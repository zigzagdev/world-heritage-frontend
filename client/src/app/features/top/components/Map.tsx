import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useRegionCount } from "../../map/hooks/region-count";
import { REGION_CENTRES } from "../../constants/region-centres";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Disable all map interactions to prevent accidental dragging while scrolling.
function DisableInteractions() {
  const map = useMap();

  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }, [map]);

  return null;
}

export function Map() {
  const { data, isLoading } = useRegionCount();
  const navigate = useNavigate();

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
      zoomControl={false}
    >
      {/* English tile via CartoDB */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <DisableInteractions />
      {!isLoading &&
        data.map((item) => (
          <CircleMarker
            key={item.region}
            center={REGION_CENTRES[item.region]}
            radius={Math.sqrt(item.count) * 2}
            eventHandlers={{
              click: () => navigate(`/heritages/results?region=${item.region}`),
            }}
          >
            {/* Popup displayed when hovering over the bubble. */}
            <Tooltip>
              {item.region}: {item.count}
            </Tooltip>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
