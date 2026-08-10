export interface UserRow {
  id: string;
  username: string;
  email: string;
  password: string | null;
  avatar: string | null;
  is_google_auth: boolean;
  level: number;
  exp: number;
  total_score: number;
  is_premium: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_plan_name: string | null;
  subscription_status: string | null;
  subscription_ends_at: string | null;
  ai_plan_usage_count: number;
  ai_plan_usage_limit: number;
  reset_token: string | null;
  reset_token_expiry: string | null;
  created_at: string;
}

export interface HabitRow {
  id: string;
  user_id: string;
  month: string;
  name: string;
  completed: boolean;
  streak: number;
  completed_dates: string[];
  reminder_time: string | null;
  target_days: number;
  origin_plan_id: string | null;
  created_at: string;
  // Atomic Habits (James Clear) — the four laws of behavior change
  cue_time: string | null;
  cue_location: string | null;
  stack_after: string | null;
  two_minute: string | null;
  reward: string | null;
  identity: string | null;
}

export interface PlanRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  plan_data: unknown;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  habits_applied: boolean;
  created_at: string;
  updated_at: string;
}

export type UserPatch = Partial<
  Pick<
    UserRow,
    | 'username'
    | 'email'
    | 'password'
    | 'avatar'
    | 'is_google_auth'
    | 'level'
    | 'exp'
    | 'total_score'
    | 'is_premium'
    | 'stripe_customer_id'
    | 'stripe_subscription_id'
    | 'stripe_plan_name'
    | 'subscription_status'
    | 'subscription_ends_at'
    | 'ai_plan_usage_count'
    | 'ai_plan_usage_limit'
    | 'reset_token'
    | 'reset_token_expiry'
  >
>;

export type HabitPatch = Partial<
  Pick<
    HabitRow,
    | 'month'
    | 'name'
    | 'completed'
    | 'streak'
    | 'completed_dates'
    | 'reminder_time'
    | 'target_days'
    | 'origin_plan_id'
    | 'cue_time'
    | 'cue_location'
    | 'stack_after'
    | 'two_minute'
    | 'reward'
    | 'identity'
  >
>;

export type PlanPatch = Partial<
  Pick<PlanRow, 'title' | 'description' | 'plan_data' | 'is_active' | 'start_date' | 'end_date' | 'habits_applied'>
>;
