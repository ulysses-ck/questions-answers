import { GenerativeModel } from "@google/generative-ai";
import { CreateQuestionnaireWithAnswers } from "@/server/actions/questionnaire.mutation";
import { questionnaireInsertSchema, answerInsertSchema } from "@/db/schema";

export interface IModel {
  name: string;
  displayName: string;
  description: string;
  supportedGenerationMethods: string[];
  temperature?: number;
  topK?: number;
  topP?: number;
  inputTokenLimit: number;
  outputTokenLimit: number;
}

interface GeminiResponse {
  message?: string;
  data: CreateQuestionnaireWithAnswers;
}

interface GeminiQuestionnaireService {
  listModels: () => Promise<IModel[]>;
  generateQuestionnaire: (topic: string) => Promise<CreateQuestionnaireWithAnswers>;
}

const QUESTIONNAIRE_SYSTEM_PROMPT = `You are a helpful assistant that generates multiple choice questions. 
Generate a question with 4 possible answers, where only one answer is correct.`;

async function listModels(apiKey: string): Promise<IModel[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid API Key");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: { models: IModel[] } = await response.json();
    return data.models;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

async function generateQuestionnaire(
  model: GenerativeModel,
  topic: string
): Promise<CreateQuestionnaireWithAnswers> {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: QUESTIONNAIRE_SYSTEM_PROMPT }],
      },
      {
        role: "user",
        parts: [{ text: `Generate a multiple choice question about: ${topic}` }],
      },
    ],
  });

  const response = result.response;
  const text = response.text();
  const geminiResponse = JSON.parse(text) as GeminiResponse;
  const data = geminiResponse.data;

  // Validate against our schema
  questionnaireInsertSchema.parse({ question: data.question });
  data.answers.forEach(answer => {
    answerInsertSchema.parse({
      text: answer.text,
      isCorrect: answer.isCorrect,
      questionnaireId: 0 // This will be set when actually inserting
    });
  });

  return data;
}

export function createGeminiQuestionnaireService(
  model: GenerativeModel,
  apiKey: string
): GeminiQuestionnaireService {
  return {
    listModels: () => listModels(apiKey),
    generateQuestionnaire: (topic: string) => generateQuestionnaire(model, topic),
  };
} 