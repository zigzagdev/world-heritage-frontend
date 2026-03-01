import type { ReactNode } from "react";
import "./heritage-detail.css";

export type MetadataItem = {
  label: string;
  value: ReactNode;
  hidden?: boolean;
};

type Props = {
  items: readonly MetadataItem[] | null;
  className?: string;
};

export function HeritageMetadataList({ items, className }: Props) {
  return (
    <dl className={className ?? "heritage-detail__definition-list"}>
      {items
        ?.filter((item) => !item.hidden)
        .map((item, index) => (
          <div key={index} className="heritage-detail__definition-item">
            <dt className="heritage-detail__definition-term">{item.label}</dt>
            <dd className="heritage-detail__definition-description">{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}
