import { createGeminiQuestionnaireService, createGeminiModel } from "@/services/implementations/GeminiQuestionnaireService";
import { createQuestionnaire } from "./questionnaire.mutation";
import { ResponseSchema, SchemaType } from "@google/generative-ai";

export async function generateAndSaveQuestionnaire(
  apiKey: string,
  model: string,
  topic: string,
  temperature = 0.7
) {
  try {
    const geminiModel = createGeminiModel(apiKey, model, temperature);
    const service = createGeminiQuestionnaireService(geminiModel, apiKey);
    
    // Generate questionnaire content
    const questionnaireData = await service.generateQuestionnaire(topic);
    
    return questionnaireData;
  } catch (error) {
    console.error('Error generating questionnaire:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating questionnaire'
    };
  }
} 