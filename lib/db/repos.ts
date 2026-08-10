import bcrypt from 'bcryptjs';
import { getSupabase } from './client';
import type { HabitPatch, HabitRow, PlanPatch, PlanRow, UserPatch, UserRow } from './types';
import type { IHabit } from '../models/Habit';
import type { IPlan, PlanData } from '../models/Plan';
import type { IUser } from '../models/User';

function mapUserRow(row: UserRow): IUser {
  return {
    id: row.id,
    _id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    avatar: row.avatar,
    isGoogleAuth: row.is_google_auth,
    level: row.level,
    exp: row.exp,
    totalScore: row.total_score,
    isPremium: row.is_premium,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    stripePlanName: row.stripe_plan_name,
    subscriptionStatus: row.subscription_status,
    subscriptionEndsAt: row.subscription_ends_at,
    aiPlanUsageCount: row.ai_plan_usage_count,
    aiPlanUsageLimit: row.ai_plan_usage_limit,
    resetToken: row.reset_token,
    resetTokenExpiry: row.reset_token_expiry,
    createdAt: row.created_at
  };
}

function mapHabitRow(row: HabitRow): IHabit {
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    month: row.month,
    name: row.name,
    completed: row.completed,
    streak: row.streak,
    completedDates: row.completed_dates || [],
    reminderTime: row.reminder_time,
    targetDays: row.target_days,
    originPlan: row.origin_plan_id,
    createdAt: row.created_at,
    cueTime: row.cue_time,
    cueLocation: row.cue_location,
    stackAfter: row.stack_after,
    twoMinute: row.two_minute,
    reward: row.reward,
    identity: row.identity
  };
}

function mapPlanRow(row: PlanRow): IPlan {
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    title: row.title,
    description: row.description,
    planData: row.plan_data as PlanData,
    isActive: row.is_active,
    startDate: row.start_date,
    endDate: row.end_date,
    habitsApplied: row.habits_applied,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function isNotFoundError(error: { code?: string }): boolean {
  return error.code === 'PGRST116';
}

// ============================== USERS ==============================

export async function findUserById(id: string): Promise<IUser | null> {
  const { data, error } = await getSupabase().from('users').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUserRow(data) : null;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const { data, error } = await getSupabase().from('users').select('*').eq('email', email).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUserRow(data) : null;
}

export async function findUserByUsername(username: string): Promise<IUser | null> {
  const { data, error } = await getSupabase().from('users').select('*').eq('username', username).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUserRow(data) : null;
}

export async function findUserByResetToken(token: string): Promise<IUser | null> {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('reset_token', token)
    .gt('reset_token_expiry', new Date().toISOString())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUserRow(data) : null;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password?: string | null;
  avatar?: string | null;
  isGoogleAuth?: boolean;
}

export async function createUser(input: CreateUserInput): Promise<IUser> {
  const password = input.password ? await bcrypt.hash(input.password, 12) : null;
  const { data, error } = await getSupabase()
    .from('users')
    .insert({
      username: input.username,
      email: input.email,
      password,
      avatar: input.avatar ?? null,
      is_google_auth: input.isGoogleAuth ?? false
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapUserRow(data);
}

export async function updateUserById(id: string, patch: UserPatch): Promise<IUser | null> {
  const updates: Record<string, unknown> = { ...patch };
  if ('password' in updates && updates.password) {
    updates.password = await bcrypt.hash(String(updates.password), 12);
  }
  const { data, error } = await getSupabase()
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    if (isNotFoundError(error)) return null;
    throw new Error(error.message);
  }
  return mapUserRow(data);
}

export async function updateUserBySubscriptionId(stripeSubscriptionId: string, patch: UserPatch): Promise<void> {
  const { error } = await getSupabase().from('users').update(patch).eq('stripe_subscription_id', stripeSubscriptionId);
  if (error) throw new Error(error.message);
}

// ============================== HABITS ==============================

export async function listHabits(userId: string): Promise<IHabit[]> {
  const { data, error } = await getSupabase().from('habits').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data || []).map(mapHabitRow);
}

export interface CreateHabitInput {
  userId: string;
  month: string;
  name: string;
  reminderTime?: string | null;
  targetDays?: number;
  originPlanId?: string | null;
  // Atomic Habits (James Clear)
  cueTime?: string | null;
  cueLocation?: string | null;
  stackAfter?: string | null;
  twoMinute?: string | null;
  reward?: string | null;
  identity?: string | null;
}

export async function createHabit(input: CreateHabitInput): Promise<IHabit> {
  const { data, error } = await getSupabase()
    .from('habits')
    .insert({
      user_id: input.userId,
      month: input.month,
      name: input.name,
      reminder_time: input.reminderTime ?? null,
      target_days: input.targetDays ?? 1,
      origin_plan_id: input.originPlanId ?? null,
      cue_time: input.cueTime ?? null,
      cue_location: input.cueLocation ?? null,
      stack_after: input.stackAfter ?? null,
      two_minute: input.twoMinute ?? null,
      reward: input.reward ?? null,
      identity: input.identity ?? null
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapHabitRow(data);
}

export async function findHabit(id: string, userId: string): Promise<IHabit | null> {
  const { data, error } = await getSupabase()
    .from('habits')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapHabitRow(data) : null;
}

export async function findHabitByMonthName(userId: string, month: string, name: string): Promise<IHabit | null> {
  const { data, error } = await getSupabase()
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('name', name)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapHabitRow(data) : null;
}

export async function updateHabit(id: string, userId: string, patch: HabitPatch): Promise<IHabit | null> {
  const { data, error } = await getSupabase()
    .from('habits')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) {
    if (isNotFoundError(error)) return null;
    throw new Error(error.message);
  }
  return mapHabitRow(data);
}

export async function deleteHabit(id: string, userId: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

// ============================== PLANS ==============================

export interface CreatePlanInput {
  userId: string;
  title: string;
  description: string;
  planData: PlanData;
}

export async function createPlan(input: CreatePlanInput): Promise<IPlan> {
  const { data, error } = await getSupabase()
    .from('plans')
    .insert({
      user_id: input.userId,
      title: input.title,
      description: input.description,
      plan_data: input.planData
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapPlanRow(data);
}

export async function listPlans(userId: string): Promise<IPlan[]> {
  const { data, error } = await getSupabase()
    .from('plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(mapPlanRow);
}

export async function findPlan(id: string, userId: string): Promise<IPlan | null> {
  const { data, error } = await getSupabase()
    .from('plans')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapPlanRow(data) : null;
}

export async function updatePlan(id: string, userId: string, patch: PlanPatch): Promise<IPlan | null> {
  const { data, error } = await getSupabase()
    .from('plans')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) {
    if (isNotFoundError(error)) return null;
    throw new Error(error.message);
  }
  return mapPlanRow(data);
}

export async function deletePlan(id: string, userId: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('plans')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}
