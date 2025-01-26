import { useState } from "react";
import { createGeminiQuestionnaireService, createGeminiModel } from "@/services/implementations/GeminiQuestionnaireService";
import { Question } from "@/types/gemini";

interface UseQuestionGenerationProps {
  apiKey: string;
  model: string;
  temperature: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useQuestionGeneration = ({ apiKey, model, temperature }: UseQuestionGenerationProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateQuestions = async (prompt: string, count: number) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuestion(0);
    setTotalQuestions(count);

    const geminiModel = createGeminiModel(apiKey, model, temperature);
    const service = createGeminiQuestionnaireService(geminiModel, apiKey);
    const newQuestions: Question[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // Add delay between requests (2 seconds)
        if (i > 0) {
          await delay(2000);
        }

        const result = await service.generateQuestion(prompt);
        if (result) {
          newQuestions.push(result);
          setQuestions(prev => [...prev, result]);
          setCurrentQuestion(i + 1);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Error generating question ${i + 1}: ${errorMessage}. Note: Gemini API has a rate limit of 15 requests per minute in the free tier.`);
        break;
      }
    }

    setIsLoading(false);
    return newQuestions;
  };

  const clearQuestions = () => {
    setQuestions([]);
    setError(null);
    setCurrentQuestion(0);
    setTotalQuestions(0);
  };

  return {
    questions,
    isLoading,
    error,
    generateQuestions,
    clearQuestions,
    setQuestions,
    progress: {
      current: currentQuestion,
      total: totalQuestions
    }
  };
}; 