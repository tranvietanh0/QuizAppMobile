"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionForm } from "@/components/questions/question-form";
import { useToast } from "@/components/ui/use-toast";
import { useCreateQuestion, type CreateQuestionDto } from "@/services/questions.service";
import { useCategories } from "@/services/categories.service";

export default function NewQuestionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories, isLoading: categoriesLoading } = useCategories(false);
  const createQuestion = useCreateQuestion();

  const handleSubmit = async (data: CreateQuestionDto) => {
    try {
      await createQuestion.mutateAsync(data);
      toast({
        title: "Question created",
        description: "The question has been created successfully.",
      });
      router.push("/questions");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to create question",
        description: "There was an error creating the question.",
      });
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div>
        <Header
          title="New Question"
          action={
            <Button variant="ghost" asChild>
              <Link href="/questions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Questions
              </Link>
            </Button>
          }
        />
        <div className="flex flex-col items-center justify-center p-12">
          <p className="mb-4 text-lg text-muted-foreground">
            You need to create at least one category first.
          </p>
          <Button asChild>
            <Link href="/categories/new">Create Category</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="New Question"
        description="Create a new quiz question"
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
              categories={categories}
              onSubmit={handleSubmit}
              isLoading={createQuestion.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
