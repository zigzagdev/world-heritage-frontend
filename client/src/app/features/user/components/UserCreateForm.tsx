import { useMemo } from "react";
import type { FormEvent } from "react";
import TextField from "@shared/uis/TextField.tsx";
import Select from "@shared/uis/Select.tsx";
import { Button } from "@shared/uis/Button.tsx";
import { ErrorPanel } from "@shared/uis/ErrorPanel.tsx";
import { useText } from "@shared/locale/ui-text.ts";
import { AGE_RANGES, SUBSCRIPTION_TIERS } from "../types";
import type { AgeRange, CreateUserFormValues, SubscriptionTier } from "../types";
import type { ApiUserDto } from "../apis/user-api";

type Props = {
  value: CreateUserFormValues;
  onChange: (next: CreateUserFormValues) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: unknown;
  createdUser: ApiUserDto | null;
};

export function UserCreateForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
  createdUser,
}: Props) {
  const text = useText();

  const ageRangeOptions = useMemo(
    () => AGE_RANGES.map((v) => ({ value: v, label: text.userAgeRangeLabels[v] })),
    [text],
  );

  const subscriptionTierOptions = useMemo(
    () => SUBSCRIPTION_TIERS.map((v) => ({ value: v, label: text.userSubscriptionTierLabels[v] })),
    [text],
  );

  const isPaid = value.subscriptionTier === "paid";

  const handleField = <K extends keyof CreateUserFormValues>(
    key: K,
    next: CreateUserFormValues[K],
  ) => {
    onChange({ ...value, [key]: next });
  };

  const handleSubscriptionTierChange = (next: SubscriptionTier) => {
    onChange({
      ...value,
      subscriptionTier: next,
      subscriptionExpiresAt: next === "free" ? null : value.subscriptionExpiresAt,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-bold">{text.userCreateTitle}</h1>

      {createdUser && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {text.userCreateSuccess}
        </p>
      )}

      {error != null && <ErrorPanel message={text.userCreateError} />}

      <TextField
        label={text.userFirstName}
        value={value.firstName}
        onChange={(e) => handleField("firstName", e.target.value)}
        required
      />
      <TextField
        label={text.userLastName}
        value={value.lastName}
        onChange={(e) => handleField("lastName", e.target.value)}
        required
      />
      <TextField
        label={text.userEmail}
        type="email"
        value={value.email}
        onChange={(e) => handleField("email", e.target.value)}
        required
      />
      <TextField
        label={text.userPassword}
        type="password"
        value={value.password}
        onChange={(e) => handleField("password", e.target.value)}
        required
      />
      <Select<AgeRange>
        id="user-age-range"
        label={text.userAgeRange}
        value={value.ageRange}
        onChange={(next) => handleField("ageRange", next)}
        options={ageRangeOptions}
      />
      <Select<SubscriptionTier>
        id="user-subscription-tier"
        label={text.userSubscriptionTier}
        value={value.subscriptionTier}
        onChange={handleSubscriptionTierChange}
        options={subscriptionTierOptions}
      />
      {isPaid && (
        <TextField
          label={text.userSubscriptionExpiresAt}
          type="date"
          value={value.subscriptionExpiresAt ?? ""}
          onChange={(e) => handleField("subscriptionExpiresAt", e.target.value || null)}
          slotProps={{ inputLabel: { shrink: true } }}
          required
        />
      )}

      <Button type="submit" variant="primary" isLoading={isLoading}>
        {text.userCreateSubmit}
      </Button>
    </form>
  );
}
