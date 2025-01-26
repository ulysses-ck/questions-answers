import { createGeminiQuestionnaireService, createGeminiModel } from "@/services/implementations/GeminiQuestionnaireService";
import type { CreateQuestionnaireWithAnswers } from "./questionnaire.mutation";

export async function generateQuestionnaire(
  apiKey: string,
  model: string,
  topic: string,
  temperature = 0.7
): Promise<{ success: boolean; data?: CreateQuestionnaireWithAnswers; error?: string }> {
  try {
    const geminiModel = createGeminiModel(apiKey, model, temperature);
    const service = createGeminiQuestionnaireService(geminiModel, apiKey);
    
    // Generate questionnaire content
    const questionnaireData = await service.generateQuestionnaire(topic);
    
    return {
      success: true,
      data: questionnaireData
    };
  } catch (error) {
    console.error('Error generating questionnaire:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating questionnaire'
    };
  }
} 