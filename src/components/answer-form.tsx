'use client';

import { checkAnswer } from "@/server/queries/questionnaire.query";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useState } from "react";

type Answer = {
  id: number;
  text: string;
};

type AnswersFormProps = {
  questionId: number;
  question: string;
  answers: Answer[];
};

export default function AnswersForm({ questionId, question, answers }: AnswersFormProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSelect = async (answerId: number) => {
    setSelectedAnswerId(answerId);
    
    const result = await checkAnswer(questionId, answerId);
    setIsCorrect(result?.isCorrect ?? null);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Question #{questionId}</h1>
        <p className="text-xl">{question}</p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Answers:</h2>
          <div className="space-y-3">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-default-200 cursor-pointer"
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <Chip
                  color={selectedAnswerId === answer.id 
                    ? isCorrect === null 
                      ? "default"
                      : isCorrect 
                        ? "success" 
                        : "danger"
                    : "default"}
                  variant="flat"
                  size="sm"
                >
                  {selectedAnswerId === answer.id ? (isCorrect === null ? "○" : isCorrect ? "✓" : "×") : "○"}
                </Chip>
                <span className={selectedAnswerId === answer.id ? "font-medium" : ""}>
                  {answer.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 