import {
  GenerativeModel,
  GoogleGenerativeAI,
  ModelParams,
  type ResponseSchema,
} from "@google/generative-ai";

const baseUrl = "https://generativelanguage.googleapis.com/";

interface ModelsResponse {
  models: Model[];
}

export interface Model {
  name: string;
  displayName: string;
  description?: string;
  supportedGenerationMethods?: string[];
  temperature?: number;
  topK?: number;
  topP?: number;
  outputTokenLimit?: number;
}

export async function listModels(apiKey: string): Promise<Model[]> {
  const response = await fetch(`${baseUrl}v1beta/models?key=${apiKey}`);
  const data = (await response.json()) as ModelsResponse;
  return data.models;
}

export function createGeminiModel(
  apiKey: string,
  modelName: string,
  responseSchema?: ResponseSchema,
  temperature?: number,
  topP?: number,
  maxOutputTokens?: number
) {
  const genAI = new GoogleGenerativeAI(apiKey);

  const responseSchemaObj =
    responseSchema && Object.keys(responseSchema).length > 0
      ? {
          responseSchema: responseSchema,
          responseType: "application/json",
        }
      : {};

  const modelParams: ModelParams = {
    model: modelName,
    generationConfig: {
      temperature,
      topP,
      maxOutputTokens,
      ...responseSchemaObj,
    },
  };
  const modelResult = genAI.getGenerativeModel(modelParams);

  return modelResult;
}

export async function generateContent(
  model: GenerativeModel,
  prompt: string,
  systemMessage: string,
) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: systemMessage }],
      },
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  return result;
} 