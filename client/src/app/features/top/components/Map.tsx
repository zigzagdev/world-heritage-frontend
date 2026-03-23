import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useRegionCount } from "../../map/hooks/region-count";
import { REGION_CENTRES } from "../../constants/region-centres";
import "leaflet/dist/leaflet.css";

export function Map() {
  const { data, isLoading } = useRegionCount();
  const navigate = useNavigate();

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {!isLoading &&
        data.map((item) => (
          <CircleMarker
            key={item.region}
            // position the bubble at the centre of the region.
            center={REGION_CENTRES[item.region]}
            // set the radius of the bubble based on the count of heritages in the region.
            radius={Math.sqrt(item.count) * 2}
            eventHandlers={{
              click: () => navigate(`/heritages/results?region=${item.region}`),
            }}
          >
            // popup for hovering over the bubble.
            <Tooltip>
              {item.region}: {item.count}
            </Tooltip>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
