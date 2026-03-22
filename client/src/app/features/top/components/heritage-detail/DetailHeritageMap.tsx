import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number | null;
  longitude: number | null;
};

const isValidCoord = (latitude: number | null, longitude: number | null) =>
  latitude !== null && longitude !== null && latitude !== 0 && longitude !== 0;

// red diamond icon using DivIcon
const redDiamondIcon = divIcon({
  className: "",
  html: `<div class="w-3.5 h-3.5 bg-rose-600 rotate-45 border-2 border-white shadow-md"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function DetailHeritageMap({ latitude, longitude }: Props) {
  if (!isValidCoord(latitude, longitude) || latitude === null || longitude === null) {
    return null;
  }

  const centre: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={centre}
      zoom={7}
      style={{ height: "160px", width: "100%" }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={centre} icon={redDiamondIcon} />
    </MapContainer>
  );
}
