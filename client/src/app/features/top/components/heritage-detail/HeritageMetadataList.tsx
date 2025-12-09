import type { ReactNode } from "react";
import "./heritage-detail.css";

export type MetadataItem = {
  label: string;
  value: ReactNode;
  hidden?: boolean;
};

type Props = {
  items: readonly MetadataItem[];
  className?: string;
};

export function HeritageMetadataList({ items, className }: Props) {
  return (
    <dl className={className ?? "heritage-detail__definition-list"}>
      {items
        .filter((item) => !item.hidden)
        .map((item) => (
          <div className="heritage-detail__definition-item" key={String(item.label)}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}
