import type { WorldHeritageVm } from "../../../../../domain/types.ts";

type Props = {
  item: WorldHeritageVm;
};

type ChipProps = {
  label: string;
  value?: string | number | null;
  tone?: "default" | "accent" | "danger";
};

function Chip({ label, value, tone = "default" }: ChipProps) {
  if (value === undefined || value === null || value === "") return null;

  const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium";
  const toneClass =
    tone === "accent"
      ? "border-sky-200 bg-sky-50 text-sky-900"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <span className={`${base} ${toneClass}`}>
      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className="text-[11px]">{value}</span>
    </span>
  );
}

export function HeritageMetaChips({ item }: Props) {
  const criteriaLabel =
    Array.isArray(item.criteria) && item.criteria.length > 0 ? item.criteria.join(", ") : undefined;

  return (
    <div className="flex flex-wrap gap-2">
      <Chip label="Year" value={item.yearInscribed} />
      <Chip label="Category" value={item.category} />
      <Chip label="Region" value={item.region} />
      <Chip label="State Party" value={item.stateParty} />
      <Chip label="Criteria" value={criteriaLabel} tone="accent" />
      {item.isEndangered && <Chip label="Endangered" value="Yes" tone="danger" />}
    </div>
  );
}
