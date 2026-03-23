import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import type { WorldHeritageVm } from "../../../../domain/types.ts";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { LatLngBoundsExpression } from "leaflet";

type Props = {
  items: WorldHeritageVm[];
};

const CATEGORY_COLOR: Record<string, string> = {
  Cultural: "#f59e0b",
  Natural: "#22c55e",
  Mixed: "#ef4444",
};

const getColor = (category: string): string => CATEGORY_COLOR[category] ?? "#6366f1";

const isValidCoordinate = (lat: number | null, lng: number | null): lat is number =>
  lat !== null && lng !== null && lat !== 0 && lng !== 0;

function FitBounds({ items }: { items: WorldHeritageVm[] }) {
  const map = useMap();

  useEffect(() => {
    if (items.length === 0) return;

    const bounds: LatLngBoundsExpression = items.map((item) => [
      item.latitude as number,
      item.longitude as number,
    ]);

    map.fitBounds(bounds, { padding: [40, 40] });
  }, [items, map]);

  return null;
}

export function SearchResultMapComponent({ items }: Props) {
  const navigate = useNavigate();

  const validItems = items.filter((item) => isValidCoordinate(item.latitude, item.longitude));

  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className={"my-8"}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "360px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds items={validItems} />
        {validItems.map((item) => (
          <CircleMarker
            key={item.id}
            center={[item.latitude as number, item.longitude as number]}
            radius={7}
            pathOptions={{
              color: getColor(item.category),
              fillColor: getColor(item.category),
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              click: () => navigate(`/heritages/${item.id}`),
            }}
          >
            <Tooltip>
              <div className="text-xs font-semibold">{item.name}</div>
              <div className="text-xs text-zinc-500">{item.category}</div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
