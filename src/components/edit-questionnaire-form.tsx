"use client";

import { Button } from "@heroui/button";
import { Input, Switch } from "@heroui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateQuestionnaire } from "@/server/actions/questionnaire.mutation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Create a schema for the entire form
const editQuestionnaireFormSchema = z.object({
  question: z.string(),
  answers: z.array(
    z.object({
      id: z.number().optional(),
      text: z.string(),
      isCorrect: z.boolean(),
    })
  ).min(2, "At least two answers are required"),
});

type FormData = z.infer<typeof editQuestionnaireFormSchema>;

type EditQuestionnaireFormProps = {
  questionnaire: {
    id: number;
    question: string;
    answers: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
    }>;
  };
};

export default function EditQuestionnaireForm({ questionnaire }: EditQuestionnaireFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: FormData = {
    question: questionnaire.question,
    answers: questionnaire.answers.map(answer => ({
      id: answer.id,
      text: answer.text,
      isCorrect: answer.isCorrect,
    })),
  };
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editQuestionnaireFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await updateQuestionnaire(questionnaire.id, data);
      
      if (result.success) {
        router.push("/list");
      } else {
        // Handle error
        console.error("Failed to update questionnaire");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Input
          label="Question"
          {...register("question")}
          isInvalid={!!errors.question}
          errorMessage={errors.question?.message}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Answers</h3>
          <Button
            type="button"
            onPress={() => append({ text: "", isCorrect: false })}
          >
            Add Answer
          </Button>
        </div>

        {errors.answers?.root?.message && (
          <p className="text-danger">{errors.answers.root.message}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <div className="flex-1">
              <Input
                label={`Answer ${index + 1}`}
                {...register(`answers.${index}.text`)}
                isInvalid={!!errors.answers?.[index]?.text}
                errorMessage={errors.answers?.[index]?.text?.message}
              />
              <input
                type="hidden"
                {...register(`answers.${index}.id`)}
              />
            </div>
            <Switch
              {...register(`answers.${index}.isCorrect`)}
              defaultSelected={field.isCorrect}
              aria-label="Is correct answer"
            >
              Correct
            </Switch>
            {fields.length > 2 && (
              <Button
                type="button"
                color="danger"
                variant="light"
                onPress={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="flat"
          onPress={() => router.push("/list")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
        >
          Update Questionnaire
        </Button>
      </div>
    </form>
  );
} 