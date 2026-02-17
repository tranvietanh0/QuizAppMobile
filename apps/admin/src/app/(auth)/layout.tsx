"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (authService.isAuthenticated() && authService.isAdmin()) {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
