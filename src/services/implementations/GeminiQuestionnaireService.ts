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
Exactly one answer must be correct.`;

export async function listModels(apiKey: string): Promise<Model[]> {
  const response = await fetch(`${baseUrl}v1beta/models?key=${apiKey}`);
  const data = (await response.json()) as ModelsResponse;
  return data.models;
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

        const text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("No response from Gemini");
        }

        const data = JSON.parse(text) as Question;

        // Validate the structure
        if (!data.question || !Array.isArray(data.answers) || data.answers.length !== 4) {
          throw new Error("Invalid response structure");
        }

        // Ensure exactly one answer is correct
        const correctAnswers = data.answers.filter((a) => a.isCorrect);
        if (correctAnswers.length !== 1) {
          throw new Error("There must be exactly one correct answer");
        }

        return data;
      } catch (error) {
        console.error("Error generating question:", error);
        throw new Error("Failed to generate valid question");
      }
    },
  };
}
