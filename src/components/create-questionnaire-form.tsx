"use client";

import { Button } from "@heroui/button";
import { Input, Switch } from "@heroui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionnaireInsertSchema, answerInsertSchema } from "@/db/schema";
import { createQuestionnaire } from "@/server/actions/questionnaire.mutation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Create a schema for the entire form
const createQuestionnaireFormSchema = z.object({
  question: questionnaireInsertSchema.shape.question,
  answers: z.array(
    z.object({
      text: answerInsertSchema.shape.text,
      isCorrect: answerInsertSchema.shape.isCorrect,
    })
  ).min(2, "At least two answers are required"),
});

type FormData = z.infer<typeof createQuestionnaireFormSchema>;

export default function CreateQuestionnaireForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createQuestionnaireFormSchema),
    defaultValues: {
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await createQuestionnaire(data);
      
      if (result.success) {
        router.push("/list-questionnaire");
      } else {
        // Handle error
        console.error("Failed to create questionnaire");
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
            </div>
            <Switch
              {...register(`answers.${index}.isCorrect`)}
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
          onPress={() => router.push("/list-questionnaire")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
        >
          Create Questionnaire
        </Button>
      </div>
    </form>
  );
} 