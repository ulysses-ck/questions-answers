"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import ConfigSidebar from "@/components/config-sidebar";
import { useQuestionGeneration } from "@/hooks/useQuestionGeneration";
import { Question } from "@/types/gemini";
import QuestionGenerationForm from "@/components/question-generation-form";

export default function CreateQuestionnairePage() {
  const [config, setConfig] = useState({
    apiKey: "",
    model: "",
    temperature: 0.7,
  });

  const { questions, isLoading, error, generateQuestions, clearQuestions, progress } = useQuestionGeneration(config);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        <ConfigSidebar onConfigChange={setConfig} />
        <div className="flex-1">
          <Card>
            <CardBody>
              <h1 className="text-2xl font-bold mb-4">Create New Questionnaire</h1>
              {config.apiKey && config.model ? (
                <div className="space-y-8">
                  <div>
                    <QuestionGenerationForm
                      onGenerate={generateQuestions}
                      isLoading={isLoading}
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
                        <button
                          onClick={clearQuestions}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Clear All
                        </button>
                      </div>
                      {questions.map((question, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardBody>
                            <h3 className="font-semibold mb-2">{question.question}</h3>
                            <ul className="space-y-2">
                              {question.answers.map((answer, answerIndex) => (
                                <li
                                  key={answerIndex}
                                  className={`p-2 rounded ${
                                    answer.isCorrect ? "bg-green-100" : "bg-white"
                                  }`}
                                >
                                  {answer.text}
                                  {answer.isCorrect && (
                                    <span className="ml-2 text-green-600">(Correct)</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                  {isLoading && (
                    <div className="text-gray-500 mt-4">
                      <p>Generating questions... ({progress.current} of {progress.total})</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
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
