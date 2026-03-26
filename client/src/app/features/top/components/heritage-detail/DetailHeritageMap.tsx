import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";

type Props = {
  latitude: number | null;
  longitude: number | null;
  name?: string;
};

const isValidCoord = (lat: number | null, lng: number | null): lat is number =>
  lat !== null && lng !== null && lat !== 0 && lng !== 0;

const redDiamondIcon = divIcon({
  className: "",
  html: `<div class="w-5 h-5 bg-rose-600 rotate-45 border-2 border-white shadow-md"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function DetailHeritageMap({ latitude, longitude, name }: Props) {
  if (!isValidCoord(latitude, longitude)) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-zinc-100">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700">
          <LocationOnIcon fontSize="small" className="text-rose-500" />
          <span>Location</span>
        </div>
        {name && <span className="text-xs text-zinc-400 truncate max-w-[160px]">{name}</span>}
      </div>

      {/* Map */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={5}
        style={{ height: "200px", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <Marker position={[latitude, longitude]} icon={redDiamondIcon} />
      </MapContainer>
    </div>
  );
}
