import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [16.5062, 80.648]; // Vijayawada. Mee city ki maarchandi.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTR = '&copy; OpenStreetMap contributors';
const STATUS_COLOR = { OPEN: '#d32f2f', IN_PROGRESS: '#ed8a00', RESOLVED: '#2e7d32' };

/**
 * mode="pick": map nokkithe pin pedutundi (onPick(lat,lng)). value = {lat,lng} | null
 * mode="show": issues list ni status rangu chukkalu ga chupistundi
 * circleMarker vadutunnam: Leaflet default pin images bundler lo break avutayi.
 */
export default function MapView({ mode = 'show', issues = [], value = null, onPick, height = 300 }) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    const m = L.map(el.current).setView(DEFAULT_CENTER, 13);
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    if (mode === 'pick') m.on('click', (e) => onPickRef.current?.(e.latlng.lat, e.latlng.lng));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [mode]);

  useEffect(() => {
    if (!map.current) return;
    layer.current.clearLayers();
    if (mode === 'pick') {
      if (value) {
        L.circleMarker([value.lat, value.lng], { radius: 10, color: '#d32f2f', fillOpacity: 0.7 }).addTo(layer.current);
        map.current.setView([value.lat, value.lng], Math.max(map.current.getZoom(), 16));
      }
    } else {
      const pts = [];
      issues.forEach((i) => {
        const c = STATUS_COLOR[i.status] || '#555';
        L.circleMarker([i.latitude, i.longitude], { radius: 8, color: c, fillColor: c, fillOpacity: 0.7 })
          .bindPopup(`<b>${escapeHtml(i.title)}</b><br/>${escapeHtml(i.address || '')}`)
          .addTo(layer.current);
        pts.push([i.latitude, i.longitude]);
      });
      if (pts.length) map.current.fitBounds(pts, { padding: [30, 30], maxZoom: 16 });
    }
  }, [mode, issues, value]);

  return <div ref={el} className="map" style={{ height }} />;
}

// Popup lo user text direct HTML ga pettakudadu (XSS)
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
