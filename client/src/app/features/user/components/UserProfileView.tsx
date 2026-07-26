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

type EditableField = keyof UpdateUserFormValues;

const initials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const toFormValues = (profile: UserProfile): UpdateUserFormValues => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
});

export function UserProfileView({ profile, onUpdate, isUpdating, updateError }: Props) {
  const text = useText();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const wasUpdatingRef = useRef(false);

  useEffect(() => {
    if (wasUpdatingRef.current && !isUpdating && updateError == null) {
      setEditingField(null);
    }
    wasUpdatingRef.current = isUpdating;
  }, [isUpdating, updateError]);

  const startEditing = (field: EditableField) => {
    setFieldValue(profile[field]);
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!editingField) return;
    onUpdate({ ...toFormValues(profile), [editingField]: fieldValue });
  };

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

      {updateError != null && <ErrorPanel message={text.userUpdateError} />}

      <div className="w-full divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white/70 shadow-sm">
        <EditableProfileRow
          label={text.userFirstName}
          value={profile.firstName}
          isEditing={editingField === "firstName"}
          isEditDisabled={isUpdating && editingField !== "firstName"}
          isSaving={isUpdating && editingField === "firstName"}
          editValue={fieldValue}
          onEditValueChange={setFieldValue}
          onStartEdit={() => startEditing("firstName")}
          onCancel={cancelEditing}
          onSave={handleSave}
          editLabel={text.userUpdateEdit}
          saveLabel={text.userUpdateSubmit}
          cancelLabel={text.userUpdateCancel}
        />
        <EditableProfileRow
          label={text.userLastName}
          value={profile.lastName}
          isEditing={editingField === "lastName"}
          isEditDisabled={isUpdating && editingField !== "lastName"}
          isSaving={isUpdating && editingField === "lastName"}
          editValue={fieldValue}
          onEditValueChange={setFieldValue}
          onStartEdit={() => startEditing("lastName")}
          onCancel={cancelEditing}
          onSave={handleSave}
          editLabel={text.userUpdateEdit}
          saveLabel={text.userUpdateSubmit}
          cancelLabel={text.userUpdateCancel}
        />
        <EditableProfileRow
          label={text.userEmail}
          value={profile.email}
          type="email"
          isEditing={editingField === "email"}
          isEditDisabled={isUpdating && editingField !== "email"}
          isSaving={isUpdating && editingField === "email"}
          editValue={fieldValue}
          onEditValueChange={setFieldValue}
          onStartEdit={() => startEditing("email")}
          onCancel={cancelEditing}
          onSave={handleSave}
          editLabel={text.userUpdateEdit}
          saveLabel={text.userUpdateSubmit}
          cancelLabel={text.userUpdateCancel}
        />
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

type EditableProfileRowProps = {
  label: string;
  value: string;
  type?: string;
  isEditing: boolean;
  isEditDisabled: boolean;
  isSaving: boolean;
  editValue: string;
  onEditValueChange: (next: string) => void;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: (e: FormEvent) => void;
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
};

function EditableProfileRow({
  label,
  value,
  type,
  isEditing,
  isEditDisabled,
  isSaving,
  editValue,
  onEditValueChange,
  onStartEdit,
  onCancel,
  onSave,
  editLabel,
  saveLabel,
  cancelLabel,
}: EditableProfileRowProps) {
  if (isEditing) {
    return (
      <form onSubmit={onSave} className="flex items-center justify-between gap-3 px-6 py-4">
        <TextField
          label={label}
          type={type}
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          size="small"
          required
        />
        <div className="flex shrink-0 gap-2">
          <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
            {saveLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            {cancelLabel}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-900">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${editLabel} ${label}`}
          onClick={onStartEdit}
          disabled={isEditDisabled}
        >
          {editLabel}
        </Button>
      </div>
    </div>
  );
}
