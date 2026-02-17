"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionForm } from "@/components/questions/question-form";
import { useToast } from "@/components/ui/use-toast";
import {
  useQuestion,
  useUpdateQuestion,
  type UpdateQuestionDto,
} from "@/services/questions.service";
import { useCategories } from "@/services/categories.service";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const { data: question, isLoading: questionLoading } = useQuestion(id);
  const { data: categories, isLoading: categoriesLoading } = useCategories(false);
  const updateQuestion = useUpdateQuestion();

  const handleSubmit = async (data: UpdateQuestionDto) => {
    try {
      await updateQuestion.mutateAsync({ id, data });
      toast({
        title: "Question updated",
        description: "The question has been updated successfully.",
      });
      router.push("/questions");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to update question",
        description: "There was an error updating the question.",
      });
    }
  };

  if (questionLoading || categoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-4 text-lg">Question not found</p>
        <Button asChild>
          <Link href="/questions">Back to Questions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Edit Question"
        description="Update question details"
        action={
          <Button variant="ghost" asChild>
            <Link href="/questions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm
              question={question}
              categories={categories || []}
              onSubmit={handleSubmit}
              isLoading={updateQuestion.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
