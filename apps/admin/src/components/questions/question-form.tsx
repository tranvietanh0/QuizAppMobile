"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question, QuestionType, Difficulty } from "@/services/questions.service";
import type { Category } from "@/services/categories.service";

const questionSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Question content is required").max(1000),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  options: z.array(z.object({ value: z.string() })).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  points: z.coerce.number().min(1).max(100),
  timeLimit: z.coerce.number().min(5).max(120),
  isActive: z.boolean(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: Question;
  categories: Category[];
  onSubmit: (data: {
    categoryId: string;
    content: string;
    type: QuestionType;
    difficulty: Difficulty;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    imageUrl?: string;
    points: number;
    timeLimit: number;
    isActive: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function QuestionForm({ question, categories, onSubmit, isLoading }: QuestionFormProps) {
  const defaultOptions = question?.options?.map((o) => ({ value: o })) || [
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
  ];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      categoryId: question?.categoryId || "",
      content: question?.content || "",
      type: question?.type || "MULTIPLE_CHOICE",
      difficulty: question?.difficulty || "MEDIUM",
      options: defaultOptions,
      correctAnswer: question?.correctAnswer || "",
      explanation: question?.explanation || "",
      imageUrl: question?.imageUrl || "",
      points: question?.points || 10,
      timeLimit: question?.timeLimit || 30,
      isActive: question?.isActive ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const questionType = watch("type");
  const isActive = watch("isActive");
  const options = watch("options");

  const handleFormSubmit = (data: QuestionFormData) => {
    const optionsArray = data.options.map((o) => o.value).filter((v) => v.trim() !== "");
    onSubmit({
      ...data,
      options: optionsArray,
      explanation: data.explanation || undefined,
      imageUrl: data.imageUrl || undefined,
    });
  };

  // For TRUE_FALSE, auto-set options
  const handleTypeChange = (type: QuestionType) => {
    setValue("type", type);
    if (type === "TRUE_FALSE") {
      setValue("options", [{ value: "True" }, { value: "False" }]);
    } else if (type === "FILL_BLANK") {
      setValue("options", [{ value: "" }]);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={watch("categoryId")}
            onValueChange={(value) => setValue("categoryId", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Question Type *</Label>
          <Select
            value={questionType}
            onValueChange={(value) => handleTypeChange(value as QuestionType)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
              <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Question *</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Enter your question"
          rows={3}
          disabled={isLoading}
        />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>

      {questionType !== "FILL_BLANK" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options *</Label>
            {questionType === "MULTIPLE_CHOICE" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
                disabled={isLoading || fields.length >= 6}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Option
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`options.${index}.value`)}
                  placeholder={`Option ${index + 1}`}
                  disabled={isLoading || questionType === "TRUE_FALSE"}
                />
                {questionType === "MULTIPLE_CHOICE" && fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.options && <p className="text-sm text-destructive">{errors.options.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="correctAnswer">Correct Answer *</Label>
        {questionType === "TRUE_FALSE" ? (
          <Select
            value={watch("correctAnswer")}
            onValueChange={(value) => setValue("correctAnswer", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="True">True</SelectItem>
              <SelectItem value="False">False</SelectItem>
            </SelectContent>
          </Select>
        ) : questionType === "MULTIPLE_CHOICE" ? (
          <Select
            value={watch("correctAnswer")}
            onValueChange={(value) => setValue("correctAnswer", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              {options
                .filter((o) => o.value.trim() !== "")
                .map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            {...register("correctAnswer")}
            placeholder="Enter the correct answer"
            disabled={isLoading}
          />
        )}
        {errors.correctAnswer && (
          <p className="text-sm text-destructive">{errors.correctAnswer.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (shown after answer)</Label>
        <Textarea
          id="explanation"
          {...register("explanation")}
          placeholder="Explain why this is the correct answer"
          rows={2}
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={watch("difficulty")}
            onValueChange={(value) => setValue("difficulty", value as Difficulty)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            {...register("points")}
            min={1}
            max={100}
            disabled={isLoading}
          />
          {errors.points && <p className="text-sm text-destructive">{errors.points.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
          <Input
            id="timeLimit"
            type="number"
            {...register("timeLimit")}
            min={5}
            max={120}
            disabled={isLoading}
          />
          {errors.timeLimit && (
            <p className="text-sm text-destructive">{errors.timeLimit.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive">Status</Label>
        <Select
          value={isActive ? "active" : "inactive"}
          onValueChange={(value) => setValue("isActive", value === "active")}
          disabled={isLoading}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {question ? "Update Question" : "Create Question"}
        </Button>
      </div>
    </form>
  );
}
