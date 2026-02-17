import { useQuery } from "@tanstack/react-query";
import { apiClient, extractData } from "./api-client";
import type { DashboardStats } from "@quizapp/shared";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get("/admin/dashboard");
    return extractData<DashboardStats>(response);
  },
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
