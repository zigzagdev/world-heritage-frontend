export const AGE_RANGES = ["teens", "20s", "30s", "40s", "50s", "60plus"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const SUBSCRIPTION_TIERS = ["free", "paid"] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export type CreateUserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  ageRange: AgeRange;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
};
