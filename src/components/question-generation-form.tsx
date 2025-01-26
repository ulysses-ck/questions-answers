"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question } from "@/types/gemini";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().min(1).max(10),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionGenerationFormProps {
  onGenerate: (topic: string, count: number) => Promise<Question[]>;
  isLoading: boolean;
}

export default function QuestionGenerationForm({ onGenerate, isLoading }: QuestionGenerationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    await onGenerate(data.topic, data.count);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <Textarea
          id="topic"
          placeholder="Enter a topic for the questions..."
          className="mt-1"
          {...register("topic")}
        />
        {errors.topic && (
          <p className="mt-1 text-sm text-red-500">{errors.topic.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="count" className="block text-sm font-medium text-gray-700">
          Number of Questions (1-10)
        </label>
        <Input
          id="count"
          type="number"
          min={1}
          max={10}
          className="mt-1"
          {...register("count", { valueAsNumber: true })}
        />
        {errors.count && (
          <p className="mt-1 text-sm text-red-500">{errors.count.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Questions"}
      </Button>
    </form>
  );
} 