export interface IHabit {
  id: string;
  _id: string;
  user: string;
  month: string;
  name: string;
  completed: boolean;
  streak: number;
  completedDates: string[];
  reminderTime?: string | null;
  targetDays: number;
  originPlan?: string | null;
  createdAt: string;
  // Atomic Habits (James Clear) — the four laws of behavior change
  cueTime?: string | null;
  cueLocation?: string | null;
  stackAfter?: string | null;
  twoMinute?: string | null;
  reward?: string | null;
  identity?: string | null;
}
