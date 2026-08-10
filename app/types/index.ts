export interface User {
  _id: string;
  username: string;
  email?: string;
  avatar?: string | null;
  level: number;
  exp: number;
  totalScore: number;
  isGoogleAuth?: boolean;
  isPremium?: boolean;
  subscriptionStatus?: string | null;
  aiPlanUsageCount?: number;
  aiPlanUsageLimit?: number;
}

export interface Habit {
  _id: string;
  user: string;
  month: string;
  name: string;
  completed: boolean;
  streak: number;
  completedDates: string[];
  reminderTime?: string | null;
  targetDays?: number;
  originPlan?: string | null;
  createdAt?: string;
  // Atomic Habits (James Clear) — the four laws of behavior change
  cueTime?: string | null;
  cueLocation?: string | null;
  stackAfter?: string | null;
  twoMinute?: string | null;
  reward?: string | null;
  identity?: string | null;
}

import type { PlanHabitDraft } from '../../lib/models/Plan';

/** A habit draft produced by the AI plan generator (Atomic Habits structure). */
export type AtomicHabitDraft = PlanHabitDraft;

export type HabitsMap = Record<string, Habit[]>;

export type View =
  | 'home'
  | 'dashboard'
  | 'user-dashboard'
  | 'chat'
  | 'plans'
  | 'doc'
  | 'privacy'
  | 'terms';

export type AuthMode = 'login' | 'register' | null;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeneratedPlanMonth {
  month: string;
  habits: Array<string | AtomicHabitDraft>;
}

export interface GeneratedPlan {
  summary: string;
  plan: GeneratedPlanMonth[];
}

export interface Plan {
  _id: string;
  user: string;
  title: string;
  description: string;
  planData: GeneratedPlan;
  isActive: boolean;
  startDate?: string;
  endDate?: string | null;
  habitsApplied: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type NavClickHandler = (view: View, e?: React.MouseEvent) => void;