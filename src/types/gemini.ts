export interface ModelsResponse {
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
  inputTokenLimit?: number;
  outputTokenLimit?: number;
}

export interface GeminiResponse<T> {
  message?: string;
  data: T;
} 