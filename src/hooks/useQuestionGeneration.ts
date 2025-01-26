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

const isDuplicateQuestion = (newQuestion: Question, existingQuestions: Question[]): boolean => {
  return existingQuestions.some(existing => 
    existing.question.toLowerCase().trim() === newQuestion.question.toLowerCase().trim()
  );
};

export const useQuestionGeneration = ({ apiKey, model, temperature }: UseQuestionGenerationProps) => {
  const { 
    setQuestions, 
    setLoading, 
    setError, 
    setProgress, 
    addGeneratedQuestion,
    generatedQuestions 
  } = useGeminiStore(
    useShallow((state) => ({
      setQuestions: state.setQuestions,
      setLoading: state.setLoading,
      setError: state.setError,
      setProgress: state.setProgress,
      addGeneratedQuestion: state.addGeneratedQuestion,
      generatedQuestions: state.generatedQuestions
    }))
  );

  const generateQuestions = async (prompt: string, count: number) => {
    console.log("[Question Generation] Starting generation process");
    console.log("[Question Generation] Initial prompt:", prompt);
    console.log("[Question Generation] Previously generated questions:", generatedQuestions.length);
    
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: count });

    const geminiModel = createGeminiModel(apiKey, model, temperature);
    const service = createGeminiQuestionnaireService(geminiModel, apiKey);
    const newQuestions: Question[] = [];
    let attempts = 0;
    const maxAttempts = count * 2; // Allow some retries for duplicates

    try {
      while (newQuestions.length < count && attempts < maxAttempts) {
        attempts++;
        
        // Add delay between requests (2 seconds)
        if (attempts > 1) {
          await delay(2000);
        }

        // Enhance prompt with previously generated questions
        const enhancedPrompt = `${prompt}\n\nPreviously generated questions (DO NOT REPEAT):\n${
          generatedQuestions
            .map((q, i) => `${i + 1}. ${q.question}`)
            .join('\n')
        }`;

        console.log(`[Question Generation] Attempt ${attempts}/${maxAttempts}`);
        console.log("[Question Generation] Enhanced prompt:", enhancedPrompt);

        const result = await service.generateQuestion(enhancedPrompt);
        
        if (result) {
          console.log("[Question Generation] Received result:", result.question);
          
          if (isDuplicateQuestion(result, [...newQuestions, ...generatedQuestions])) {
            console.log("[Question Generation] Duplicate question detected, retrying...");
            continue;
          }

          console.log("[Question Generation] New unique question added");
          newQuestions.push(result);
          addGeneratedQuestion(result);
          setQuestions([...newQuestions]);
          setProgress({ current: newQuestions.length, total: count });
        }
      }

      if (newQuestions.length < count) {
        setError(`Could only generate ${newQuestions.length} unique questions after ${attempts} attempts`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("[Question Generation] Error:", errorMessage);
      setError(`Error generating questions: ${errorMessage}. Note: Gemini API has a rate limit of 15 requests per minute in the free tier.`);
    } finally {
      setLoading(false);
      console.log("[Question Generation] Process completed. Generated questions:", newQuestions.length);
    }

    return newQuestions;
  };

  const clearQuestions = () => {
    console.log("[Question Generation] Clearing all questions");
    setQuestions([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return {
    generateQuestions,
    clearQuestions,
  };
}; 