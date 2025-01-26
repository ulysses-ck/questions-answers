import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  ModelParams,
  SchemaType,
} from "@google/generative-ai";
import { CreateQuestionnaireWithAnswers } from "@/server/actions/questionnaire.mutation";
import { questionnaireInsertSchema, answerInsertSchema } from "@/db/schema";
import { Model, ModelsResponse, Question } from "@/types/gemini";

export const baseUrl = "https://generativelanguage.googleapis.com/";

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    question: {
      type: SchemaType.STRING,
      description: "The question text",
    },
    answers: {
      type: SchemaType.ARRAY,
      description:
        "List of exactly 4 possible answers, where exactly one answer must be correct",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: {
            type: SchemaType.STRING,
            description: "The answer text",
          },
          isCorrect: {
            type: SchemaType.BOOLEAN,
            description: "Whether this is the correct answer",
          },
        },
        required: ["text", "isCorrect"],
      },
    },
  },
  required: ["question", "answers"],
};

export interface GeminiQuestionnaireService {
  listModels: () => Promise<Model[]>;
  generateQuestionnaire: (topic: string) => Promise<CreateQuestionnaireWithAnswers>;
  generateQuestion: (topic: string) => Promise<Question>;
}

const QUESTIONNAIRE_SYSTEM_PROMPT = `You are a helpful assistant that generates multiple choice questions.
Your task is to generate a question with 4 possible answers about the given topic.
Exactly one answer must be correct.

Important guidelines:
1. Each question must be unique and substantially different from any previously generated questions
2. Do not ask the same question with different wording
3. If the topic is broad, explore different aspects or subtopics rather than focusing on one aspect
4. Ensure questions test different knowledge areas within the topic
5. Avoid questions that are just reformulations of each other`;

export async function listModels(apiKey: string): Promise<Model[]> {
  try {
    const response = await fetch(`${baseUrl}v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw new Error("Invalid API key. Please check your key and try again.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ModelsResponse;
    return data.models;
  } catch (error) {
    console.error("Error fetching models:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch models. Please check your connection.");
  }
}

export function createGeminiModel(
  apiKey: string,
  modelName: string,
  temperature?: number,
  topP?: number,
  maxOutputTokens?: number,
  safetySettings?: Array<{
    category: HarmCategory;
    threshold: HarmBlockThreshold;
  }>
) {
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelParams: ModelParams = {
    model: modelName,
    generationConfig: {
      temperature,
      topP,
      maxOutputTokens,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
    safetySettings: safetySettings || [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      }
    ]
  };

  return genAI.getGenerativeModel(modelParams);
}

async function generateQuestionnaire(
  model: GenerativeModel,
  topic: string
): Promise<CreateQuestionnaireWithAnswers> {
  try {
    const response = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: QUESTIONNAIRE_SYSTEM_PROMPT }] },
        {
          role: "user",
          parts: [{ text: `Generate a multiple choice question about: ${topic}` }],
        },
      ],
    });

    const text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as CreateQuestionnaireWithAnswers;

    // Validate the structure
    if (!data.question || !Array.isArray(data.answers) || data.answers.length !== 4) {
      throw new Error("Invalid response structure");
    }

    // Ensure exactly one answer is correct
    const correctAnswers = data.answers.filter((a) => a.isCorrect);
    if (correctAnswers.length !== 1) {
      throw new Error("There must be exactly one correct answer");
    }

    // Validate against our schema
    questionnaireInsertSchema.parse({ question: data.question });
    data.answers.forEach((answer) => {
      answerInsertSchema.parse({
        text: answer.text,
        isCorrect: answer.isCorrect,
        questionnaireId: 0, // This will be set when actually inserting
      });
    });

    return data;
  } catch (error) {
    console.error("Error generating questionnaire:", error);
    throw new Error("Failed to generate valid questionnaire");
  }
}

export function createGeminiQuestionnaireService(
  model: GenerativeModel,
  apiKey: string
): GeminiQuestionnaireService {
  return {
    listModels: () => listModels(apiKey),
    generateQuestionnaire: (topic: string) => generateQuestionnaire(model, topic),
    generateQuestion: async (topic: string) => {
      try {
        const response = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: QUESTIONNAIRE_SYSTEM_PROMPT }] },
            {
              role: "user",
              parts: [{ text: topic }],
            },
          ],
        });

        if (!response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("No valid response received from Gemini API. Please check your API key and try again.");
        }

        const text = response.response.candidates[0].content.parts[0].text;

        try {
          const data = JSON.parse(text) as Question;

          // Validate the structure
          if (!data.question || !Array.isArray(data.answers) || data.answers.length !== 4) {
            throw new Error("Invalid response structure: missing required fields. Please try again.");
          }

          // Ensure exactly one answer is correct
          const correctAnswers = data.answers.filter((a) => a.isCorrect);
          if (correctAnswers.length !== 1) {
            throw new Error("Invalid response structure: must have exactly one correct answer. Please try again.");
          }

          return data;
        } catch (parseError) {
          console.error("Error parsing Gemini response:", parseError);
          throw new Error("Failed to parse Gemini API response. Please try again.");
        }
      } catch (error) {
        console.error("Error generating question:", error);
        
        // Handle specific API errors
        if (error instanceof Error) {
          if (error.message.includes('400')) {
            throw new Error("Invalid API request. Please check your API key in the configuration.");
          } else if (error.message.includes('401')) {
            throw new Error("Invalid or missing API key. Please check your API key in the configuration.");
          } else if (error.message.includes('429')) {
            throw new Error("API rate limit exceeded. Please wait a moment before trying again.");
          }
        }
        
        throw new Error("Failed to generate valid question. Please try again.");
      }
    },
  };
}
