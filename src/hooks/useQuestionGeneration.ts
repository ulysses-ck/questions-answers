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
    
    if (!apiKey?.trim()) {
      setError("API key is required. Please provide a valid API key in the configuration.");
      setLoading(false);
      return [];
    }

    if (!model) {
      setError("Please select a model in the configuration before generating questions.");
      setLoading(false);
      return [];
    }

    console.log("[Question Generation] Initial prompt:", prompt);
    console.log("[Question Generation] Previously generated questions:", generatedQuestions?.length || 0);
    
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: count });

    const newQuestions: Question[] = [];

    try {
      const geminiModel = createGeminiModel(apiKey, model, temperature);
      const service = createGeminiQuestionnaireService(geminiModel, apiKey);

      for (let i = 0; i < count; i++) {
        // Add delay between requests (2 seconds)
        if (i > 0) {
          await delay(2000);
        }

        // Enhance prompt with previously generated questions
        const enhancedPrompt = `${prompt}\n\nPreviously generated questions (DO NOT REPEAT):\n${
          [...(generatedQuestions || []), ...newQuestions]
            .map((q, idx) => `${idx + 1}. ${q.question}`)
            .join('\n')
        }`;

        console.log(`[Question Generation] Generating question ${i + 1}/${count}`);

        try {
          const result = await service.generateQuestion(enhancedPrompt);
          
          if (result) {
            console.log("[Question Generation] Received result:", result.question);
            
            if (isDuplicateQuestion(result, [...newQuestions, ...(generatedQuestions || [])])) {
              console.log("[Question Generation] Duplicate question detected, skipping");
              setError(`Question ${i + 1} was a duplicate. Some questions may have been skipped.`);
              continue;
            }

            console.log("[Question Generation] New unique question added");
            newQuestions.push(result);
            addGeneratedQuestion(result);
            setQuestions([...newQuestions]);
            setProgress({ current: i + 1, total: count });
          }
        } catch (err) {
          // Handle individual question generation error
          console.error(`[Question Generation] Error generating question ${i + 1}:`, err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          
          if (errorMessage.includes('400') || errorMessage.includes('401')) {
            setError('Invalid API key. Please check your API key in the configuration and try again.');
            break;
          } else if (errorMessage.includes('429')) {
            setError('API rate limit exceeded. Please wait a moment and try again.');
            break;
          } else {
            setError(`Error generating question ${i + 1}: ${errorMessage}`);
            continue;
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("[Question Generation] Error:", errorMessage);
      
      if (errorMessage.includes('400') || errorMessage.includes('401')) {
        setError('Invalid API key. Please check your API key in the configuration and try again.');
      } else if (errorMessage.includes('429')) {
        setError('API rate limit exceeded. Please wait a moment and try again.');
      } else {
        setError(`Error generating questions: ${errorMessage}. Note: Gemini API has a rate limit of 15 requests per minute in the free tier.`);
      }
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