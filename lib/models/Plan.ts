export interface PlanHabitDraft {
  name: string;
  cueTime?: string;
  cueLocation?: string;
  stackAfter?: string;
  twoMinute?: string;
  reward?: string;
}

export interface PlanData {
  summary?: string;
  plan?: Array<{ month: string; habits: Array<string | PlanHabitDraft> }>;
}

export interface IPlan {
  id: string;
  _id: string;
  user: string;
  title: string;
  description: string;
  planData: PlanData;
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  habitsApplied: boolean;
  createdAt: string;
  updatedAt: string;
}
