"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Textarea, Slider } from "@heroui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question } from "@/types/gemini";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().min(1).max(10),
  delay: z.coerce.number().min(0).max(30000),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionGenerationFormProps {
  onGenerate: (topicPrompt: string, count: number, delay: number) => Promise<Question[]>;
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
      delay: 2000,
    },
  });

  const topic = watch("topic");
  const delay = watch("delay");

  useEffect(() => {
    if (currentQuestions.length > 0) {
      const basePrompt = topic.split("\n\nQuestions previously generated, do not repeat them:")[0];
      const updatedPrompt = getTopicPrompt(basePrompt, currentQuestions);
      setValue("topic", updatedPrompt);
    }
  }, [currentQuestions, topic, getTopicPrompt, setValue]);

  const onSubmit = async (data: FormData) => {
    await onGenerate(data.topic, data.count, data.delay);
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

      <div>
        <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
          Delay Between Questions: {delay}ms
        </label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">0ms</span>
          <Slider
            id="delay"
            aria-label="Delay between questions"
            step={500}
            maxValue={30000}
            minValue={0}
            value={delay}
            onChange={(value) => setValue("delay", Number(value))}
            className="flex-1"
            isDisabled={isLoading}
            marks={[
              { value: 0, label: "No delay" },
              { value: 2000, label: "Default" },
              { value: 30000, label: "30s" }
            ]}
          />
          <span className="text-xs text-gray-500">30000ms</span>
        </div>
        {errors.delay && (
          <p className="mt-1 text-sm text-red-500">{errors.delay.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Questions"}
      </Button>
    </form>
  );
} 