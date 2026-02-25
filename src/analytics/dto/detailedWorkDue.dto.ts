export class UserSummaryDto {
  name: string;
  email: string;
}

export class TaskDeadlineDetailDto {
  id: string;
  title: string;
  dueDate: Date;
  status: string;
  assignedUsers: UserSummaryDto[];
}

export class CombinedAnalyticsDto {
  deadlines: {
    overdue: TaskDeadlineDetailDto[];
    dueSoon: TaskDeadlineDetailDto[];
    onTrackCount: number;
  };
  performance: {
    averageEstimatedHours: number;
    averageActualHours: number;
    accuracyPercentage: number;
    averageVariance: number;
    insight: string;
  };
}