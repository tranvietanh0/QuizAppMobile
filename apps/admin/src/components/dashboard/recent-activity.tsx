import { UserPlus, CheckCircle, HelpCircle, FolderPlus, LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentActivity as RecentActivityType } from "@quizapp/shared";

const activityIcons: Record<RecentActivityType["type"], LucideIcon> = {
  user_registered: UserPlus,
  quiz_completed: CheckCircle,
  question_added: HelpCircle,
  category_added: FolderPlus,
};

const activityColors: Record<RecentActivityType["type"], string> = {
  user_registered: "text-blue-500",
  quiz_completed: "text-green-500",
  question_added: "text-purple-500",
  category_added: "text-orange-500",
};

interface RecentActivityProps {
  activities: RecentActivityType[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted ${colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
