import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Кастомный маркер-«пин» (без зависимости от картинок Leaflet, которые ломаются в сборке).
function pinIcon(number) {
  return L.divIcon({
    className: 'mm-pin',
    html: `
      <div style="position:relative;width:34px;height:44px;transform:translate(-50%,-100%);">
        <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 27 17 27s17-15 17-27C34 7.6 26.4 0 17 0z" fill="#f43f5e"/>
          <circle cx="17" cy="17" r="11" fill="#ffffff"/>
        </svg>
        <span style="position:absolute;top:6px;left:0;width:34px;text-align:center;font:800 14px Montserrat,sans-serif;color:#e11d48;">${number}</span>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
  })
}

// Аккуратно подгоняет карту под все точки маршрута.
function FitBounds({ points, center }) {
  const map = useMap()
  useEffect(() => {
    if (points && points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => p.coords))
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 })
    } else {
      map.setView(center, 14)
    }
    // Пересчёт размеров — карта рендерится в анимируемом контейнере.
    const t = setTimeout(() => map.invalidateSize(), 250)
    return () => clearTimeout(t)
  }, [map, points, center])
  return null
}

export default function RouteMap({ center, points = [] }) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((p, i) => (
        <Marker key={i} position={p.coords} icon={pinIcon(i + 1)}>
          <Popup>
            <div className="font-display text-sm font-extrabold text-slate-900">
              {i + 1}. {p.name}
            </div>
            {p.note && <div className="mt-0.5 text-xs text-slate-500">{p.note}</div>}
          </Popup>
        </Marker>
      ))}
      <FitBounds points={points} center={center} />
    </MapContainer>
  )
}
