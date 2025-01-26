import { GenerativeModel } from "@google/generative-ai";
import { CreateQuestionnaireWithAnswers } from "@/server/actions/questionnaire.mutation";
import { questionnaireInsertSchema, answerInsertSchema } from "@/db/schema";
import { Model } from "@/types/gemini";
import { faker } from "@faker-js/faker";
import type { GeminiQuestionnaireService } from "@/services/implementations/GeminiQuestionnaireService";

const MOCK_MODELS: Model[] = [
  {
    name: "gemini-pro",
    displayName: "Gemini Pro",
    description: "The best model for general use cases",
    supportedGenerationMethods: ["generateContent"],
    temperature: 0.9,
    topK: 1,
    topP: 1,
    inputTokenLimit: 30720,
    outputTokenLimit: 2048,
  },
  {
    name: "gemini-pro-vision",
    displayName: "Gemini Pro Vision",
    description: "The best model for vision and multimodal use cases",
    supportedGenerationMethods: ["generateContent"],
    temperature: 0.4,
    inputTokenLimit: 12288,
    outputTokenLimit: 4096,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mockListModels(_apiKey: string): Promise<Model[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_MODELS;
}

async function mockGenerateQuestionnaire(
  _model: GenerativeModel,
  topic: string
): Promise<CreateQuestionnaireWithAnswers> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const correctAnswerIndex = faker.number.int({ min: 0, max: 3 });
  
  const answers = Array.from({ length: 4 }, (_, index) => ({
    text: faker.lorem.sentence(),
    isCorrect: index === correctAnswerIndex
  }));

  const data: CreateQuestionnaireWithAnswers = {
    question: `${faker.word.words({ count: { min: 3, max: 8 } })} ${topic}?`,
    answers
  };

  // Validate the mock data against our schema
  questionnaireInsertSchema.parse({ question: data.question });
  data.answers.forEach((answer: { text: string; isCorrect: boolean }) => {
    answerInsertSchema.parse({
      text: answer.text,
      isCorrect: answer.isCorrect,
      questionnaireId: 0
    });
  });

  return data;
}

export function createMockGeminiQuestionnaireService(): GeminiQuestionnaireService {
  return {
    listModels: () => mockListModels("fake-api-key"),
    generateQuestionnaire: (topic: string) => mockGenerateQuestionnaire({} as GenerativeModel, topic),
  };
}