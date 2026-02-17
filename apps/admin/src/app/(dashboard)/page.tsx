"use client";

import { Users, FolderOpen, HelpCircle, GamepadIcon, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CategoryChart, UserGrowthChart } from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { useDashboardStats } from "@/services/dashboard.service";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" description="Overview of your quiz application" />
      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="Registered users"
          />
          <StatsCard
            title="Categories"
            value={stats?.totalCategories || 0}
            icon={FolderOpen}
            description="Active categories"
          />
          <StatsCard
            title="Questions"
            value={stats?.totalQuestions || 0}
            icon={HelpCircle}
            description="Active questions"
          />
          <StatsCard
            title="Quiz Sessions"
            value={stats?.totalQuizSessions || 0}
            icon={GamepadIcon}
            description={`${stats?.sessionsToday || 0} today`}
          />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-4 lg:grid-cols-4">
          <CategoryChart data={stats?.questionsByCategory || []} />
          <UserGrowthChart data={stats?.userGrowth || []} />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-4">
          <RecentActivity activities={stats?.recentActivity || []} />
        </div>
      </div>
    </div>
  );
}
