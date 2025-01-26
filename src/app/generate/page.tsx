"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Question } from "@/types/gemini";
import QuestionGenerationForm from "@/components/question-generation-form";
import GeminiQuestionnaireForm from "@/components/gemini-questionnaire-form";
import { createQuestionnaire } from "@/server/actions/questionnaire.mutation";
import ConfigSidebar from "@/components/config-sidebar";
import { useGeminiConfig, useGeminiQuestions, useGeminiLoading, useGeminiError, useGeminiProgress, useGeminiActions } from "@/providers/gemini-provider";
import { useQuestionGeneration } from "@/hooks/useQuestionGeneration";

type FormData = {
  question: string;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
};

export default function CreateQuestionnairePage() {
  const config = useGeminiConfig();
  const questions = useGeminiQuestions();
  const isLoading = useGeminiLoading();
  const error = useGeminiError();
  const progress = useGeminiProgress();
  const { setConfig, setQuestions } = useGeminiActions();

  const { generateQuestions, clearQuestions } = useQuestionGeneration(config);

  const handleQuestionEdit = async (index: number, editedQuestion: FormData) => {
    try {
      const result = await createQuestionnaire(editedQuestion);
      
      if (result.success) {
        // Only remove the question from local state
        setQuestions(questions.filter((_, i) => i !== index));
      } else {
        console.error("Failed to save questionnaire");
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error);
    }
  };

  const handleGenerate = async (topic: string, count: number) => {
    const result = await generateQuestions(topic, count);
    return result;
  };

  const getTopicPrompt = (topic: string, previousQuestions: Question[]) => {
    let prompt = topic;
    
    if (previousQuestions.length > 0) {
      prompt += "\n\nQuestions previously generated, do not repeat them:\n";
      previousQuestions.forEach((q, index) => {
        prompt += `${index + 1}. ${q.question}\n`;
      });
    }
    
    return prompt;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        <ConfigSidebar onConfigChange={setConfig} />
        <div className="flex-1">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">Create New Questionnaire</h1>
            </CardHeader>
            <CardBody>
              {config.apiKey && config.model ? (
                <div className="space-y-8">
                  <div>
                    <QuestionGenerationForm
                      onGenerate={handleGenerate}
                      isLoading={isLoading}
                      getTopicPrompt={getTopicPrompt}
                      currentQuestions={questions}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Note: Gemini API has a rate limit of 15 requests per minute in the free tier.
                      A 2-second delay is added between requests to help manage this limit.
                    </p>
                  </div>
                  
                  {questions.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Generated Questions</h2>
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          onPress={clearQuestions}
                        >
                          Clear All
                        </Button>
                      </div>
                      {questions.map((question, index) => (
                        <Card key={index}>
                          <CardBody>
                            <GeminiQuestionnaireForm
                              initialData={question}
                              onSave={(data) => handleQuestionEdit(index, data)}
                            />
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                  {error && (
                    <Card>
                      <CardBody>
                        <p className="text-danger">{error}</p>
                      </CardBody>
                    </Card>
                  )}
                  {isLoading && (
                    <Card>
                      <CardBody>
                        <div className="space-y-2">
                          <p>Generating questions... ({progress.current} of {progress.total})</p>
                          <div className="w-full bg-default-100 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  Please configure your API key and model in the sidebar to start generating questions.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
