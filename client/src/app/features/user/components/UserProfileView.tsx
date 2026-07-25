import { useText } from "@shared/locale/ui-text.ts";
import type { UserProfile } from "../types";

type Props = {
  profile: UserProfile;
};

const initials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export function UserProfileView({ profile }: Props) {
  const text = useText();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-12">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-semibold text-white">
        {initials(profile.firstName, profile.lastName)}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-sm text-zinc-500">{profile.email}</p>
      </div>

      <div className="w-full divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white/70 shadow-sm">
        <ProfileRow label={text.userFirstName} value={profile.firstName} />
        <ProfileRow label={text.userLastName} value={profile.lastName} />
        <ProfileRow label={text.userEmail} value={profile.email} />
        <ProfileRow label={text.userAgeRange} value={profile.ageRange} />
        <ProfileRow label={text.userSubscriptionTier} value={profile.subscriptionTier} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-900">{value}</span>
    </div>
  );
}
