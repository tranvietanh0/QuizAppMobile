"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/components/categories/category-form";
import { useToast } from "@/components/ui/use-toast";
import { useCreateCategory } from "@/services/categories.service";

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCategory = useCreateCategory();

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    iconUrl?: string;
    color: string;
    isActive: boolean;
  }) => {
    try {
      await createCategory.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        iconUrl: data.iconUrl || undefined,
        color: data.color,
        isActive: data.isActive,
      });
      toast({
        title: "Category created",
        description: `"${data.name}" has been created successfully.`,
      });
      router.push("/categories");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to create category",
        description: "There was an error creating the category.",
      });
    }
  };

  return (
    <div>
      <Header
        title="New Category"
        description="Create a new quiz category"
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
            <CategoryForm onSubmit={handleSubmit} isLoading={createCategory.isPending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
