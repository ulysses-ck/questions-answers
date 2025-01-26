"use client";

import { useState, useEffect } from "react";
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
  onGenerate: (topicPrompt: string, count: number) => Promise<Question[]>;
  isLoading: boolean;
  getTopicPrompt: (topic: string, previousQuestions: Question[]) => string;
  currentQuestions: Question[];
}

export default function QuestionGenerationForm({ 
  onGenerate, 
  isLoading, 
  getTopicPrompt,
  currentQuestions 
}: QuestionGenerationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
      topic: "Generate a multiple choice question about: ",
    },
  });

  const topic = watch("topic");

  useEffect(() => {
    if (currentQuestions.length > 0) {
      const basePrompt = topic.split("\n\nQuestions previously generated, do not repeat them:")[0];
      const updatedPrompt = getTopicPrompt(basePrompt, currentQuestions);
      setValue("topic", updatedPrompt);
    }
  }, [currentQuestions, topic, getTopicPrompt, setValue]);

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
          placeholder="Enter a topic for the questions... (e.g. 'JavaScript Promises', 'React Hooks', etc.)"
          value={topic}
          onChange={(e) => setValue("topic", e.target.value)}
          className="mt-1"
          name="topic"
          disabled={isLoading}
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
          disabled={isLoading}
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