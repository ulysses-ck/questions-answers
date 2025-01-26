import { useGeminiStore } from "@/stores/gemini-store";
import { createGeminiQuestionnaireService, createGeminiModel } from "@/services/implementations/GeminiQuestionnaireService";
import { Question } from "@/types/gemini";
import { useShallow } from 'zustand/react/shallow';

interface UseQuestionGenerationProps {
  apiKey: string;
  model: string;
  temperature: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useQuestionGeneration = ({ apiKey, model, temperature }: UseQuestionGenerationProps) => {
  const { setQuestions, setLoading, setError, setProgress } = useGeminiStore(
    useShallow((state) => ({
      setQuestions: state.setQuestions,
      setLoading: state.setLoading,
      setError: state.setError,
      setProgress: state.setProgress,
    }))
  );

  const generateQuestions = async (prompt: string, count: number) => {
    console.log("Generating questions...");
    console.log("Prompt:", prompt);
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: count });

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
          setQuestions([...newQuestions]); // Update with all questions so far
          setProgress({ current: i + 1, total: count });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Error generating question ${i + 1}: ${errorMessage}. Note: Gemini API has a rate limit of 15 requests per minute in the free tier.`);
        break;
      }
    }

    setLoading(false);
    return newQuestions;
  };

  const clearQuestions = () => {
    setQuestions([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return {
    generateQuestions,
    clearQuestions,
  };
}; 