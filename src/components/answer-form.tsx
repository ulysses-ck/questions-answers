'use client';

import { checkAnswer } from "@/server/queries/questionnaire.query";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useState, useEffect } from "react";

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
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSelectedAnswer = async () => {
      if (selectedAnswers.length === 0) return;
      
      const lastSelectedId = selectedAnswers[selectedAnswers.length - 1];
      
      // If this is the last remaining option, it must be correct
      if (selectedAnswers.length === answers.length - 1) {
        const remainingAnswer = answers.find(a => !selectedAnswers.includes(a.id));
        if (remainingAnswer) {
          setSelectedAnswers([...selectedAnswers, remainingAnswer.id]);
          setIsCorrect(true);
          return;
        }
      }

      // Otherwise check the answer
      const result = await checkAnswer(questionId, lastSelectedId);
      setIsCorrect(result?.isCorrect ?? null);
    };

    checkSelectedAnswer();
  }, [selectedAnswers, answers, questionId]);

  const handleAnswerSelect = (answerId: number) => {
    // If answer was already selected or we found the correct answer, do nothing
    if (selectedAnswers.includes(answerId) || isCorrect === true) {
      return;
    }

    setSelectedAnswers([...selectedAnswers, answerId]);
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
            {answers.map((answer) => {
              const isSelected = selectedAnswers.includes(answer.id);
              const isLastSelected = selectedAnswers[selectedAnswers.length - 1] === answer.id;

              return (
                <div
                  key={answer.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-default-200 ${
                    !isSelected && isCorrect !== true ? "cursor-pointer" : "cursor-not-allowed opacity-80"
                  }`}
                  onClick={() => handleAnswerSelect(answer.id)}
                >
                  <Chip
                    color={isSelected 
                      ? isLastSelected
                        ? isCorrect === null 
                          ? "default"
                          : isCorrect 
                            ? "success" 
                            : "danger"
                        : "danger"
                      : "default"}
                    variant="flat"
                    size="sm"
                  >
                    {isSelected ? (isLastSelected ? (isCorrect === null ? "○" : isCorrect ? "✓" : "×") : "×") : "○"}
                  </Chip>
                  <span className={isSelected ? "font-medium" : ""}>
                    {answer.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 