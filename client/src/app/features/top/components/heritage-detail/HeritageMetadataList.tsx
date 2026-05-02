import type { ReactNode } from "react";
import "./heritage-detail.css";

type MetadataItem = {
  label: string;
  value: ReactNode;
  hidden?: boolean;
};

export function HeritageMetadataList({
  items,
  className,
}: {
  items: readonly MetadataItem[];
  className?: string;
}) {
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
