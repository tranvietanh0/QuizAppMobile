"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { useToast } from "@/components/ui/use-toast";
import { useCategory, useUpdateCategory } from "@/services/categories.service";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const { data: category, isLoading } = useCategory(id);
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    iconUrl?: string;
    color: string;
    isActive: boolean;
  }) => {
    try {
      await updateCategory.mutateAsync({
        id,
        data: {
          name: data.name,
          description: data.description || undefined,
          iconUrl: data.iconUrl || undefined,
          color: data.color,
          isActive: data.isActive,
        },
      });
      toast({
        title: "Category updated",
        description: `"${data.name}" has been updated successfully.`,
      });
      router.push("/categories");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to update category",
        description: "There was an error updating the category.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-4 text-lg">Category not found</p>
        <Button asChild>
          <Link href="/categories">Back to Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Edit Category"
        description={`Editing "${category.name}"`}
        action={
          <Button variant="ghost" asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={category}
              onSubmit={handleSubmit}
              isLoading={updateCategory.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
