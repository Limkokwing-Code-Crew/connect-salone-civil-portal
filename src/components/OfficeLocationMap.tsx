import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  label: string;
  latitude: number;
  longitude: number;
  description?: string;
}

interface OfficeLocationMapProps {
  locations: Location[];
  className?: string;
}

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function OfficeLocationMap({ locations, className }: OfficeLocationMapProps) {
  if (locations.length === 0) return null;

  const center: LatLngExpression =
    locations.length === 1
      ? [locations[0].latitude, locations[0].longitude]
      : [
          locations.reduce((s, l) => s + l.latitude, 0) / locations.length,
          locations.reduce((s, l) => s + l.longitude, 0) / locations.length,
        ];

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-48 rounded-xl z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, i) => (
          <Marker
            key={i}
            position={[loc.latitude, loc.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{loc.label}</strong>
              {loc.description && <br />}
              {loc.description && <span className="text-sm">{loc.description}</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
