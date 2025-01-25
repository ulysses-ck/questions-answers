import { createGeminiModel } from "@/service/gemini";
import { createGeminiQuestionnaireService } from "@/services/implementations/GeminiQuestionnaireService";
import { createQuestionnaire } from "./questionnaire.mutation";
import { ResponseSchema, SchemaType } from "@google/generative-ai";

const questionnaireResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    message: {
      type: SchemaType.STRING,
    },
    data: {
      type: SchemaType.OBJECT,
      properties: {
        question: {
          type: SchemaType.STRING,
          description: "The question text"
        },
        answers: {
          type: SchemaType.ARRAY,
          description: "List of exactly 4 possible answers, where exactly one answer must be correct",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              text: {
                type: SchemaType.STRING,
                description: "The answer text"
              },
              isCorrect: {
                type: SchemaType.BOOLEAN,
                description: "Whether this is the correct answer"
              }
            },
            required: ["text", "isCorrect"]
          }
        }
      },
      required: ["question", "answers"]
    }
  },
  required: ["data"]
};

export async function generateAndSaveQuestionnaire(
  apiKey: string,
  model: string,
  topic: string,
  temperature = 0.7
) {
  try {
    const geminiModel = createGeminiModel(apiKey, model, questionnaireResponseSchema, temperature);
    const service = createGeminiQuestionnaireService(geminiModel, apiKey);
    
    // Generate questionnaire content
    const questionnaireData = await service.generateQuestionnaire(topic);
    
    // Save to database using existing mutation
    const result = await createQuestionnaire(questionnaireData);
    
    return result;
  } catch (error) {
    console.error('Error generating questionnaire:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating questionnaire'
    };
  }
} 