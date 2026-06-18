import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

function Spin({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
    const t = setTimeout(() => map.invalidateSize(), 200)
    return () => clearTimeout(t)
  }, [map, center])
  return null
}

// Карта на фоне сплэш-экрана (см. референс «задний фон — карта»).
// Интерактив выключен — это декоративный слой.
export default function BackgroundMap({ center = [41.6938, 44.8015] }) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Spin center={center} />
    </MapContainer>
  )
}
