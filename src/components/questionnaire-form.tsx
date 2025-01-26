"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, CardFooter, Input, Textarea } from "@heroui/react";
import { generateQuestionnaire } from "@/server/actions/generate-questionnaire";
import { createQuestionnaire } from "@/server/actions/questionnaire.mutation";

const SYSTEM_PROMPT = `You are a helpful assistant that generates multiple choice questions. 
Generate a question with 4 possible answers, where only one answer is correct.`;

interface QuestionnaireFormProps {
  config: {
    apiKey: string;
    model: string;
    temperature: number;
  };
}

interface FormData {
  topic: string;
}

interface GeneratedData {
  question: string;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

export default function QuestionnaireForm({ config }: QuestionnaireFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPreview, setEditedPreview] = useState<GeneratedData | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onGenerate = async (data: FormData) => {
    try {
      setIsLoading(true);
      const result = await generateQuestionnaire(
        config.apiKey,
        config.model,
        data.topic,
        config.temperature
      );
      
      if (result.success && result.data) {
        const questionnaireData: GeneratedData = {
          question: result.data.question,
          answers: result.data.answers || []
        };
        setEditedPreview(questionnaireData);
      }
    } catch (error) {
      console.error("Error generating questionnaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (!editedPreview) return;
    try {
      setIsSaving(true);
      const result = await createQuestionnaire({
        question: editedPreview.question,
        answers: editedPreview.answers
      });
      
      if (result.success) {
        setEditedPreview(null);
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdateAnswer = (index: number, field: keyof GeneratedData['answers'][0], value: string | boolean) => {
    if (!editedPreview) return;
    const newAnswers = [...editedPreview.answers];
    if (field === 'isCorrect') {
      // Uncheck all other answers
      newAnswers.forEach((answer, i) => {
        answer.isCorrect = i === index;
      });
    } else {
      newAnswers[index] = { ...newAnswers[index], [field]: value as string };
    }
    setEditedPreview({ ...editedPreview, answers: newAnswers });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
        <Textarea
          label="Topic"
          placeholder={SYSTEM_PROMPT}
          {...register("topic", { required: "Topic is required" })}
          isInvalid={!!errors.topic}
          errorMessage={errors.topic?.message}
        />
        <Button 
          type="submit"
          color="primary"
          isLoading={isLoading}
        >
          Generate Question
        </Button>
      </form>

      {editedPreview && (
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Textarea
                  value={editedPreview.question}
                  onChange={(e) => setEditedPreview({
                    ...editedPreview,
                    question: e.target.value
                  })}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium">Answers</label>
                {editedPreview.answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                    <Input
                      value={answer.text}
                      onChange={(e) => onUpdateAnswer(index, 'text', e.target.value)}
                      className="flex-1"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={answer.isCorrect}
                        onChange={() => onUpdateAnswer(index, 'isCorrect', true)}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-end gap-2">
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setEditedPreview(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={onSave}
              isLoading={isSaving}
            >
              Save Questionnaire
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 