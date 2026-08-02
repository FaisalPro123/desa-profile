import { useState, useMemo, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Building2,
  Camera,
  AlertTriangle,
  GraduationCap,
  Trees,
  Heart,
  Shield,
  Lightbulb,
  Compass,
  Search,
  Bell,
  ChevronDown,
  X,
  ShieldAlert,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../styles/interactive-map.css';
import { useApp } from '../context/AppContext';

function MapController({ selectedMarker, resetSignal }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [map]);

  useEffect(() => {
    if (map && selectedMarker?.posisi) {
      map.flyTo(selectedMarker.posisi, 16.5, { animate: true, duration: 1.2 });
    }
  }, [map, selectedMarker]);

  useEffect(() => {
    if (map && resetSignal) {
      map.flyTo([-6.6210, 106.7645], 14.8, { animate: true, duration: 1 });
    }
  }, [map, resetSignal]);

  return null;
}


// Basemap Tiles
const BASEMAPS = {
  satellite: {
    name: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; World Imagery'
  }
};

export const MAP_CATEGORIES = [
  { id: 'alarm', label: 'Titik Alarm Warga', color: '#ff3b30', icon: AlertTriangle },
  { id: 'asset', label: 'Aset Desa', color: '#007aff', icon: Building2 },
  { id: 'lapangan', label: 'Lapangan', color: '#34c759', icon: Trees },
  { id: 'sekolah', label: 'Sekolah', color: '#af52de', icon: GraduationCap },
  { id: 'masjid', label: 'Masjid', color: '#5856d6', icon: Building2 },
  { id: 'posyandu', label: 'Posyandu', color: '#ff2d55', icon: Heart },
  { id: 'cctv', label: 'CCTV', color: '#00c7be', icon: Camera },
  { id: 'posRonda', label: 'Pos Ronda', color: '#ff9500', icon: Shield },
  { id: 'pju', label: 'PJU', color: '#ffcc00', icon: Lightbulb }
];

const getCategorySvg = (type) => {
  switch (type) {
    case 'alarm':
      return `<span style="font-weight:900; font-size:16px; color:#ffffff;">!</span>`;
    case 'asset':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/></svg>`;
    case 'lapangan':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="12" cy="12" r="3"/></svg>`;
    case 'sekolah':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    case 'masjid':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M12 2v4"/><path d="M12 6a5 5 0 0 0-5 5v9h10v-9a5 5 0 0 0-5-5z"/></svg>`;
    case 'posyandu':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    case 'cctv':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
    case 'posRonda':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="8"/></svg>`;
  }
};

const createCustomIcon = (type, isAlarmActive = true) => {
  const cat = MAP_CATEGORIES.find((c) => c.id === type) || MAP_CATEGORIES[1];
  const svgHtml = getCategorySvg(type);
  const color = type === 'alarm' && !isAlarmActive ? '#64748b' : cat.color;

  const iconHtml = `
    <div class="map-marker-pin" style="--marker-color: ${color}; cursor: pointer;">
      <div class="map-marker-glow" style="background: ${color};"></div>
      <div class="map-marker-inner" style="background: ${color};">
        ${svgHtml}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-marker-wrapper',
    html: iconHtml,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -18]
  });
};

// Data RW
const WILAYAH_RW_PARAKAN = [
  { id: 1, nama: 'RW 01', warna: '#00e5ff', koordinat: [[-6.6150, 106.7580], [-6.6138, 106.7648], [-6.6198, 106.7658], [-6.6218, 106.7612], [-6.6190, 106.7570]] },
  { id: 2, nama: 'RW 02', warna: '#007aff', koordinat: [[-6.6138, 106.7648], [-6.6128, 106.7718], [-6.6188, 106.7728], [-6.6208, 106.7678], [-6.6198, 106.7658]] },
  { id: 3, nama: 'RW 03', warna: '#00c7be', koordinat: [[-6.6198, 106.7658], [-6.6208, 106.7678], [-6.6188, 106.7728], [-6.6258, 106.7718], [-6.6248, 106.7658]] },
  { id: 4, nama: 'RW 04', warna: '#ffcc00', koordinat: [[-6.6218, 106.7612], [-6.6198, 106.7658], [-6.6248, 106.7658], [-6.6268, 106.7588], [-6.6248, 106.7570]] },
  { id: 5, nama: 'RW 05', warna: '#ff3b30', koordinat: [[-6.6248, 106.7658], [-6.6258, 106.7718], [-6.6298, 106.7698], [-6.6308, 106.7638], [-6.6278, 106.7618]] }
];

const BATAS_DESA_UTARA = [[-6.6150, 106.7580], [-6.6138, 106.7648], [-6.6128, 106.7718]];
const BATAS_DESA_SELATAN = [[-6.6268, 106.7588], [-6.6308, 106.7638], [-6.6298, 106.7698]];

const MARKERS_PARAKAN = [
  { id: 101, nama: 'CCTV 01 - Akses Utama Krajan', tipe: 'cctv', rw: 'RW 01', posisi: [-6.6152, 106.7628], detail: 'Pemantauan lalu lintas jalan utama masuk Desa Parakan' },
  { id: 102, nama: 'Pos Ronda Siskamling RW 01', tipe: 'posRonda', rw: 'RW 01', posisi: [-6.6162, 106.7592], detail: 'Pos jaga malam warga RW 01' },
  { id: 103, nama: 'Titik Alarm Krajan Utama', tipe: 'alarm', rw: 'RW 01', posisi: [-6.6175, 106.7600], detail: 'Sirine alarm tombol darurat warga RT 02 / RW 01' },
  { id: 104, nama: 'Lapangan Krajan', tipe: 'lapangan', rw: 'RW 01', posisi: [-6.6180, 106.7615], detail: 'Lapangan publik Krajan' },
  { id: 201, nama: 'SDN 01 Sukamanah/Parakan', tipe: 'sekolah', rw: 'RW 02', posisi: [-6.6160, 106.7675], detail: 'Sekolah Dasar Negeri 01 Sukamanah Parakan' },
  { id: 202, nama: 'Balai Desa Sukamanah Parakan', tipe: 'asset', rw: 'RW 02', posisi: [-6.6185, 106.7668], detail: 'Pusat Balai & Kantor Desa Sukamanah Parakan' },
  { id: 204, nama: 'Masjid Al-Ikhlas Sukamanah', tipe: 'masjid', rw: 'RW 02', posisi: [-6.6190, 106.7678], detail: 'Masjid Jami utama RW 02' },
  { id: 205, nama: 'PKU/Bidan/Usaha Ogan Katergori', tipe: 'posyandu', rw: 'RW 02', posisi: [-6.6170, 106.7660], detail: 'Posyandu & Layanan Bidan Desa' },
  { id: 301, nama: 'Mushola Nurul I-Pos Ronda RW 03', tipe: 'posRonda', rw: 'RW 03', posisi: [-6.6228, 106.7725], detail: 'Pos keamanan & mushola warga RW 03' },
  { id: 302, nama: 'CCTV 03 - Simpang Cikaret', tipe: 'cctv', rw: 'RW 03', posisi: [-6.6248, 106.7712], detail: 'Kamera pengawas persimpangan Cikaret' },
  { id: 304, nama: 'Titik Alarm Warga RW 03', tipe: 'alarm', rw: 'RW 03', posisi: [-6.6212, 106.7705], detail: 'Sirine Peringatan Dini RW 03' },
  { id: 401, nama: 'CCTV 04 - Area Posyandu Pasirjaya', tipe: 'cctv', rw: 'RW 04', posisi: [-6.6238, 106.7608], detail: 'Kamera CCTV area Posyandu Pasirjaya' },
  { id: 403, nama: 'Posyandu Sukamanah Pasirjaya', tipe: 'posyandu', rw: 'RW 04', posisi: [-6.6255, 106.7630], detail: 'Posyandu Kesehatan RW 04 Pasirjaya' },
  { id: 405, nama: 'Titik Alarm Warga RW 04', tipe: 'alarm', rw: 'RW 04', posisi: [-6.6245, 106.7620], detail: 'Tombol Alarm Darurat Pasirjaya' },
  { id: 501, nama: 'CCTV 05 - Gerbang Sukamulya', tipe: 'cctv', rw: 'RW 05', posisi: [-6.6292, 106.7672], detail: 'CCTV perbatasan Sukamulya' },
  { id: 502, nama: 'Pos Ronda Siskamling RW 05', tipe: 'posRonda', rw: 'RW 05', posisi: [-6.6298, 106.7652], detail: 'Pos Ronda RW 05' },
  { id: 503, nama: 'Lapangan Voli RW 05', tipe: 'lapangan', rw: 'RW 05', posisi: [-6.6285, 106.7680], detail: 'Lapangan Olahraga RW 05 Sukamulya' },
  { id: 504, nama: 'Titik Alarm Warga Sukamulya', tipe: 'alarm', rw: 'RW 05', posisi: [-6.6275, 106.7670], detail: 'Sirine Alarm RW 05' }
];

export default function InteractiveMap({ height = '640px' }) {
  const { infoDesa = {} } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [alarmStatusActive, setAlarmStatusActive] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  // Layer Toggles matching Reference
  const [layers, setLayers] = useState({
    batasRw: true,
    asetDesa: true,
    perangkatDesa: true,
    alarmWarga: true
  });

  const toggleLayer = (key) => setLayers(p => ({ ...p, [key]: !p[key] }));

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    return MARKERS_PARAKAN.filter(m => {
      if (m.tipe === 'alarm' && !layers.alarmWarga) return false;
      if (m.tipe === 'asset' && !layers.asetDesa) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.nama.toLowerCase().includes(q) ||
        m.rw.toLowerCase().includes(q) ||
        m.detail.toLowerCase().includes(q)
      );
    });
  }, [layers, searchQuery]);

  return (
    <div className="cyber-map-grid" style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      height,
      maxHeight: '740px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #1e293b',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      background: '#090d16',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* ==================================== */}
      {/* LEFT SIDEBAR PANEL */}
      {/* ==================================== */}
      <div className="cyber-map-sidebar" style={{
        background: '#0d1322',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.1rem',
        overflowY: 'auto',
        color: '#f8fafc'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
              Peta {infoDesa.nama || 'Desa Parakan Ciomas'}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '600', marginTop: '2px' }}>
              Kec. {infoDesa.kecamatan || 'Parung Panjang'}, {infoDesa.kota || 'Kota Bogor'}
            </div>
          </div>
          <div style={{ background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '20px', fontSize: '0.7rem', color: '#fbbf24', fontWeight: '700', border: '1px solid #334155' }}>
            ☀️ Terang
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Cari lokasi, CCTV, RW, fasilitas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.5rem 0.5rem 2rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#151d30',
              color: '#ffffff',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
        </div>

        {/* STATUS ALARM CALLOUT CARD */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(153,27,27,0.3))',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '0.8rem',
          marginBottom: '1rem',
          boxShadow: alarmStatusActive ? '0 0 15px rgba(239,68,68,0.2)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase' }}>
            <Bell size={14} /> STATUS ALARM: {alarmStatusActive ? 'AKTIF (6/6)' : 'NONAKTIF'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1', margin: '0.3rem 0 0.6rem 0', lineHeight: 1.3 }}>
            Klik lokasi atau tombol matikan untuk menonaktifkan alarm.
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <button
              onClick={() => setAlarmStatusActive(true)}
              style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Aktifkan Semua
            </button>
            <button
              onClick={() => setAlarmStatusActive(false)}
              style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', border: 'none', background: '#334155', color: '#fff', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Matikan Semua
            </button>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(true)}
            style={{
              width: '100%',
              padding: '0.45rem',
              borderRadius: '6px',
              border: 'none',
              background: '#ef4444',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(239,68,68,0.4)'
            }}
          >
            🚨 TINDAKAN DARURAT
          </button>
        </div>

        {/* LAYAR PETA */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            LAYAR PETA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { key: 'batasRw', label: 'Batas RW', count: '5 RW' },
              { key: 'asetDesa', label: 'Aset Desa', count: '7 Aset' },
              { key: 'perangkatDesa', label: 'Perangkat Desa', count: '12 Perangkat' },
              { key: 'alarmWarga', label: 'Titik Alarm Warga', count: '6 Alarm' },
            ].map(item => (
              <label key={item.key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#151d30',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #1e293b',
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => toggleLayer(item.key)}
                    style={{ accentColor: '#00e5ff', cursor: 'pointer' }}
                  />
                  <span>{item.label}</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#0f172a', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>
                  {item.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* KATEGORI ASET ACCORDION */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            KATEGORI ASET
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {MAP_CATEGORIES.slice(1, 6).map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#151d30',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon size={13} style={{ color: cat.color }} />
                    <span>{cat.label}</span>
                  </div>
                  <ChevronDown size={13} style={{ color: '#64748b' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* TITIK ALARM WARGA LIST */}
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#ef4444', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            TITIK ALARM WARGA (KLIK UNTUK INFO)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {MARKERS_PARAKAN.filter(m => m.tipe === 'alarm').map(alarm => (
              <div
                key={alarm.id}
                onClick={() => setSelectedMarker(alarm)}
                style={{
                  background: '#1e1b2e',
                  border: '1px solid #3b2042',
                  padding: '0.45rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.72rem'
                }}
              >
                <div style={{ fontWeight: '700', color: '#f87171' }}>⚠️ {alarm.nama}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>{alarm.rw} • {alarm.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT MAP CANVAS — FULL INTERACTIVE VIEW */}
      {/* ========================================================= */}
      <div className="cyber-map-canvas-wrap" style={{ position: 'relative', width: '100%', height: '100%' }}>

        {/* Top middle banner */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(13, 19, 34, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          color: '#00e5ff',
          fontWeight: '900',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          padding: '0.35rem 1rem',
          borderRadius: '20px',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)',
          pointerEvents: 'none'
        }}>
          BATAS DESA
        </div>

        {/* Top left compass */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(13, 19, 34, 0.88)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          border: '1px solid #00e5ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5ff'
        }}>
          <Compass size={22} />
        </div>

        {/* Reset view button */}
        <button
          onClick={() => setResetSignal(Date.now())}
          title="Reset Tampilan Peta"
          style={{
            position: 'absolute',
            top: '12px',
            left: '60px',
            zIndex: 1000,
            background: 'rgba(13, 19, 34, 0.9)',
            borderRadius: '20px',
            padding: '0.35rem 0.75rem',
            border: '1px solid #00e5ff',
            color: '#00e5ff',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <RotateCcw size={12} /> Fit Peta
        </button>

        {/* Top right Legend panel */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: 'rgba(13, 19, 34, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          color: '#fff',
          fontSize: '0.7rem',
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: '800', fontSize: '0.72rem', marginBottom: '0.4rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            KETERANGAN
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.3rem' }}>
            {MAP_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LEAFLET MAP — FULLY INTERACTIVE & DRAGGABLE */}
        <MapContainer
          center={[-6.6210, 106.7645]}
          zoom={14.8}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          zoomControl={false}
          style={{ width: '100%', height: '100%', cursor: 'default' }}
        >
          <MapController selectedMarker={selectedMarker} resetSignal={resetSignal} />

          <TileLayer
            attribution={BASEMAPS.satellite.attribution}
            url={BASEMAPS.satellite.url}
          />

          {/* RW BOUNDARY POLYGONS */}
          {layers.batasRw && WILAYAH_RW_PARAKAN.map(rw => (
            <Polygon
              key={rw.id}
              positions={rw.koordinat}
              pathOptions={{
                color: rw.warna,
                fillColor: rw.warna,
                fillOpacity: 0.28,
                weight: 3
              }}
            >
              <Tooltip permanent direction="center" className="rw-label-tooltip">
                <div style={{ color: rw.warna, fontWeight: '900', fontSize: '0.95rem', textShadow: '0 0 8px rgba(0,0,0,0.8)' }}>
                  {rw.nama}
                </div>
              </Tooltip>
            </Polygon>
          ))}

          {/* BATAS DESA POLYLINES */}
          {layers.batasRw && (
            <>
              <Polyline positions={BATAS_DESA_UTARA} pathOptions={{ color: '#00e5ff', weight: 4, dashArray: '8, 8' }} />
              <Polyline positions={BATAS_DESA_SELATAN} pathOptions={{ color: '#00e5ff', weight: 4, dashArray: '8, 8' }} />
            </>
          )}

          {/* MARKERS — CLICKABLE */}
          {filteredMarkers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.posisi}
              icon={createCustomIcon(marker.tipe, alarmStatusActive)}
              eventHandlers={{
                click: () => setSelectedMarker(marker)
              }}
            >
              <Tooltip direction="top" offset={[0, -18]}>
                <span style={{ fontWeight: '700' }}>{marker.nama}</span>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* IN-APP MODAL DETAIL FOR CLICKED MARKER */}
        {selectedMarker && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 2000,
            background: '#0d1322',
            border: '1px solid #38bdf8',
            borderRadius: '12px',
            padding: '0.85rem 1.1rem',
            color: '#fff',
            maxWidth: '340px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ background: '#0284c7', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '800' }}>
                {selectedMarker.rw}
              </span>
              <button onClick={() => setSelectedMarker(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem', color: '#ffffff' }}>{selectedMarker.nama}</h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>{selectedMarker.detail}</p>
            <div style={{ marginTop: '0.65rem', paddingTop: '0.45rem', borderTop: '1px solid #1e293b', fontSize: '0.7rem', color: '#38bdf8', fontWeight: '600' }}>
              📍 Lokasi Terverifikasi Sistem Informasi Desa
            </div>
          </div>
        )}

        {/* EMERGENCY ACTION MODAL */}
        {emergencyModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#1e1b2e',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(239,68,68,0.5)'
            }}>
              <ShieldAlert size={48} style={{ color: '#ef4444', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ef4444' }}>TINDAKAN DARURAT DIAKTIFKAN</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0.5rem 0 1.25rem 0' }}>
                Notifikasi darurat dan sirine bahaya telah dikirimkan keseluruh petugas keamanan desa & RW.
              </p>
              <button
                onClick={() => setEmergencyModalOpen(false)}
                style={{ background: '#ef4444', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                Tutup Peringatan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}