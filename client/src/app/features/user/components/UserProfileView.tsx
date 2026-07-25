import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import TextField from "@shared/uis/TextField.tsx";
import { Button } from "@shared/uis/Button.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import type { UserProfile } from "../types";
import type { UpdateUserFormValues } from "../mapper/to-update-user-request";

type Props = {
  profile: UserProfile;
  onUpdate: (values: UpdateUserFormValues) => void;
  isUpdating: boolean;
  updateError: unknown;
};

const initials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const toFormValues = (profile: UserProfile): UpdateUserFormValues => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
});

export function UserProfileView({ profile, onUpdate, isUpdating, updateError }: Props) {
  const text = useText();
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<UpdateUserFormValues>(() => toFormValues(profile));
  const wasUpdatingRef = useRef(false);

  useEffect(() => {
    if (wasUpdatingRef.current && !isUpdating && updateError == null) {
      setIsEditing(false);
    }
    wasUpdatingRef.current = isUpdating;
  }, [isUpdating, updateError]);

  const handleField = <K extends keyof UpdateUserFormValues>(
    key: K,
    next: UpdateUserFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: next }));
  };

  const handleEdit = () => {
    setFormValues(toFormValues(profile));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(formValues);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-12">
        <h1 className="text-xl font-bold">{text.userProfileTitle}</h1>

        {updateError != null && <ErrorPanel message={text.userUpdateError} />}

        <TextField
          label={text.userFirstName}
          value={formValues.firstName}
          onChange={(e) => handleField("firstName", e.target.value)}
          required
        />
        <TextField
          label={text.userLastName}
          value={formValues.lastName}
          onChange={(e) => handleField("lastName", e.target.value)}
          required
        />
        <TextField
          label={text.userEmail}
          type="email"
          value={formValues.email}
          onChange={(e) => handleField("email", e.target.value)}
          required
        />

        <div className="flex gap-3">
          <Button type="submit" variant="primary" isLoading={isUpdating}>
            {text.userUpdateSubmit}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isUpdating}>
            {text.userUpdateCancel}
          </Button>
        </div>
      </form>
    );
  }

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

      <Button type="button" variant="secondary" onClick={handleEdit}>
        {text.userUpdateEdit}
      </Button>
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
