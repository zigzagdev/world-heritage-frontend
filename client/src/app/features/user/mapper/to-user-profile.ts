import type { ApiUserDto } from "../apis/user-api";
import type { UserProfile } from "../types";

export const toUserProfile = (dto: ApiUserDto): UserProfile => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  email: dto.email,
  ageRange: dto.age_range,
  subscriptionTier: dto.subscription_tier,
  subscriptionExpiresAt: dto.subscription_expires_at,
});
