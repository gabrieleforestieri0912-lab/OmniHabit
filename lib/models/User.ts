export interface IUser {
  id: string;
  _id: string;
  username: string;
  email: string;
  password: string | null;
  avatar: string | null;
  isGoogleAuth: boolean;
  level: number;
  exp: number;
  totalScore: number;
  isPremium: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePlanName?: string | null;
  subscriptionStatus?: string | null;
  subscriptionEndsAt?: string | null;
  aiPlanUsageCount: number;
  aiPlanUsageLimit: number;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  createdAt: string;
}
