import { useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
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
  Layers,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Search,
  ShieldCheck
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../styles/interactive-map.css';

// ======================================================
// BASMAP TILE CONFIGURATIONS
// ======================================================
const BASEMAPS = {
  satellite: {
    name: 'Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping'
  },
  dark: {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  light: {
    name: 'Vektor Terang',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }
};

// ======================================================
// CATEGORIES & COLOR SYSTEM (MATCHING REFERENCE IMAGE)
// ======================================================
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
      return `<span class="alarm-exclamation">!</span>`;
    case 'asset':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    case 'lapangan':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.01"/><path d="M14 14v.01"/><path d="M14 10v.01"/><path d="M10 14v.01"/><path d="M20 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>`;
    case 'sekolah':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    case 'masjid':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 6a5 5 0 0 0-5 5v9h10v-9a5 5 0 0 0-5-5z"/><path d="M6 12H4a2 2 0 0 0-2 2v6h4"/><path d="M18 12h2a2 2 0 0 1 2 2v6h-4"/><path d="M10 20v-4a2 2 0 0 1 4 0v4"/></svg>`;
    case 'posyandu':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    case 'cctv':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
    case 'posRonda':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case 'pju':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/></svg>`;
  }
};

// ======================================================
// CUSTOM MARKER ICON GENERATOR
// ======================================================
const createCustomIcon = (type) => {
  const cat = MAP_CATEGORIES.find((c) => c.id === type) || MAP_CATEGORIES[1];
  const svgHtml = getCategorySvg(type);

  const iconHtml = `
    <div class="map-marker-pin" style="--marker-color: ${cat.color};">
      <div class="map-marker-glow"></div>
      <div class="map-marker-inner">
        ${svgHtml}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-marker-wrapper',
    html: iconHtml,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22]
  });
};

// ======================================================
// DATA WILAYAH RW — DESA PARAKAN, CIOMAS, BOGOR
// ======================================================
const WILAYAH_RW_PARAKAN = [
  {
    id: 1,
    nama: 'RW 01',
    labelPos: [-6.6175, 106.7615],
    warna: '#00e5ff',
    koordinat: [
      [-6.6150, 106.7580],
      [-6.6138, 106.7648],
      [-6.6198, 106.7658],
      [-6.6218, 106.7612],
      [-6.6190, 106.7570]
    ]
  },
  {
    id: 2,
    nama: 'RW 02',
    labelPos: [-6.6165, 106.7685],
    warna: '#007aff',
    koordinat: [
      [-6.6138, 106.7648],
      [-6.6128, 106.7718],
      [-6.6188, 106.7728],
      [-6.6208, 106.7678],
      [-6.6198, 106.7658]
    ]
  },
  {
    id: 3,
    nama: 'RW 03',
    labelPos: [-6.6232, 106.7702],
    warna: '#00c7be',
    koordinat: [
      [-6.6198, 106.7658],
      [-6.6208, 106.7678],
      [-6.6188, 106.7728],
      [-6.6258, 106.7718],
      [-6.6248, 106.7658]
    ]
  },
  {
    id: 4,
    nama: 'RW 04',
    labelPos: [-6.6238, 106.7612],
    warna: '#ffcc00',
    koordinat: [
      [-6.6218, 106.7612],
      [-6.6198, 106.7658],
      [-6.6248, 106.7658],
      [-6.6268, 106.7588],
      [-6.6248, 106.7570]
    ]
  },
  {
    id: 5,
    nama: 'RW 05',
    labelPos: [-6.6282, 106.7665],
    warna: '#ff3b30',
    koordinat: [
      [-6.6248, 106.7658],
      [-6.6258, 106.7718],
      [-6.6298, 106.7698],
      [-6.6308, 106.7638],
      [-6.6278, 106.7618]
    ]
  }
];

// ======================================================
// BATAS DESA & SUNGAI PARAKAN CIOMAS
// ======================================================
const BATAS_DESA_UTARA = [
  [-6.6150, 106.7580],
  [-6.6138, 106.7648],
  [-6.6128, 106.7718]
];

const BATAS_DESA_SELATAN = [
  [-6.6268, 106.7588],
  [-6.6308, 106.7638],
  [-6.6298, 106.7698]
];

const SUNGAI_CIOMAS = [
  [-6.6280, 106.7560],
  [-6.6290, 106.7600],
  [-6.6298, 106.7650],
  [-6.6305, 106.7710],
  [-6.6315, 106.7750]
];

// ======================================================
// MARKER POINTS OF INTEREST IN PARAKAN CIOMAS
// ======================================================
const MARKERS_PARAKAN = [
  // RW 01
  {
    id: 101,
    nama: 'CCTV 01 - Akses Utama Krajan',
    tipe: 'cctv',
    rw: 'RW 01',
    posisi: [-6.6152, 106.7628],
    detail: 'Pemantauan lalu lintas jalan utama masuk Desa Parakan Ciomas'
  },
  {
    id: 102,
    nama: 'Pos Ronda Siskamling RW 01',
    tipe: 'posRonda',
    rw: 'RW 01',
    posisi: [-6.6162, 106.7592],
    detail: 'Pos jaga malam warga RW 01 Parakan'
  },
  {
    id: 103,
    nama: 'Titik Alarm Warga Krajan',
    tipe: 'alarm',
    rw: 'RW 01',
    posisi: [-6.6175, 106.7600],
    detail: 'Sirine tombol darurat RT 02 / RW 01'
  },
  {
    id: 104,
    nama: 'Lapangan Krajan',
    tipe: 'lapangan',
    rw: 'RW 01',
    posisi: [-6.6180, 106.7615],
    detail: 'Lapangan olahraga dan kegiatan publik warga Krajan'
  },
  {
    id: 105,
    nama: 'Posyandu Melati 01',
    tipe: 'posyandu',
    rw: 'RW 01',
    posisi: [-6.6165, 106.7625],
    detail: 'Layanan kesehatan balita & lansia RW 01'
  },

  // RW 02
  {
    id: 201,
    nama: 'SDN 01 (Parakan)',
    tipe: 'sekolah',
    rw: 'RW 02',
    posisi: [-6.6160, 106.7675],
    detail: 'Sekolah Dasar Negeri 01 Parakan Ciomas'
  },
  {
    id: 202,
    nama: 'Balai Desa Parakan',
    tipe: 'asset',
    rw: 'RW 02',
    posisi: [-6.6185, 106.7668],
    detail: 'Pusat Kantor Pemerintah Desa Parakan Ciomas'
  },
  {
    id: 203,
    nama: 'PJU Jalan Utama Dusun Karangsari',
    tipe: 'pju',
    rw: 'RW 02',
    posisi: [-6.6178, 106.7642],
    detail: 'Penerangan Jalan Umum hemat energi'
  },
  {
    id: 204,
    nama: 'Masjid Al-Ikhlas Parakan',
    tipe: 'masjid',
    rw: 'RW 02',
    posisi: [-6.6190, 106.7678],
    detail: 'Masjid Jami utama wilayah RW 02'
  },
  {
    id: 205,
    nama: 'Pos Ronda Siskamling RW 02',
    tipe: 'posRonda',
    rw: 'RW 02',
    posisi: [-6.6185, 106.7690],
    detail: 'Pos Ronda keamanan lingkungan RW 02'
  },

  // RW 03
  {
    id: 301,
    nama: 'Mushola Nurul Iman / Pos Ronda RW 03',
    tipe: 'posRonda',
    rw: 'RW 03',
    posisi: [-6.6228, 106.7725],
    detail: 'Pos keamanan dan mushola warga RW 03'
  },
  {
    id: 302,
    nama: 'CCTV 03 - Simpang Cikaret',
    tipe: 'cctv',
    rw: 'RW 03',
    posisi: [-6.6248, 106.7712],
    detail: 'Kamera pengawas persimpangan Cikaret Parakan'
  },
  {
    id: 303,
    nama: 'Lapangan Voli RW 03',
    tipe: 'lapangan',
    rw: 'RW 03',
    posisi: [-6.6235, 106.7685],
    detail: 'Sarana olahraga bola voli warga'
  },
  {
    id: 304,
    nama: 'Titik Alarm Warga RW 03',
    tipe: 'alarm',
    rw: 'RW 03',
    posisi: [-6.6212, 106.7705],
    detail: 'Titik Sistem Peringatan Dini Warga RW 03'
  },

  // RW 04
  {
    id: 401,
    nama: 'CCTV 04 - Area Posyandu Pasirjaya',
    tipe: 'cctv',
    rw: 'RW 04',
    posisi: [-6.6238, 106.7608],
    detail: 'Pengawas area pemukiman Pasirjaya'
  },
  {
    id: 402,
    nama: 'PJU Simpang RW 04',
    tipe: 'pju',
    rw: 'RW 04',
    posisi: [-6.6222, 106.7628],
    detail: 'Tiang Penerangan Jalan Umum RW 04'
  },
  {
    id: 403,
    nama: 'Posyandu desa parakan',
    tipe: 'posyandu',
    rw: 'RW 04',
    posisi: [-6.6255, 106.7630],
    detail: 'Gedung Posyandu RW 04 Pasirjaya'
  },
  {
    id: 404,
    nama: 'Pos Ronda Siskamling RW 04',
    tipe: 'posRonda',
    rw: 'RW 04',
    posisi: [-6.6262, 106.7605],
    detail: 'Pos Ronda batas selatan RW 04'
  },
  {
    id: 405,
    nama: 'Titik Alarm Warga Pasirjaya',
    tipe: 'alarm',
    rw: 'RW 04',
    posisi: [-6.6245, 106.7620],
    detail: 'Tombol darurat keamanan Pasirjaya'
  },

  // RW 05
  {
    id: 501,
    nama: 'CCTV 05 - Gerbang Sukamulya',
    tipe: 'cctv',
    rw: 'RW 05',
    posisi: [-6.6292, 106.7672],
    detail: 'CCTV pemantau perbatasan Sukamulya'
  },
  {
    id: 502,
    nama: 'Pos Ronda Siskamling RW 05',
    tipe: 'posRonda',
    rw: 'RW 05',
    posisi: [-6.6298, 106.7652],
    detail: 'Pos keamanan lingkar RW 05'
  },
  {
    id: 503,
    nama: 'Lapangan Voli RW 05',
    tipe: 'lapangan',
    rw: 'RW 05',
    posisi: [-6.6285, 106.7680],
    detail: 'Lapangan olahraga RW 05 Sukamulya'
  },
  {
    id: 504,
    nama: 'Titik Alarm Warga Sukamulya',
    tipe: 'alarm',
    rw: 'RW 05',
    posisi: [-6.6275, 106.7670],
    detail: 'Alarm bahaya & darurat RW 05'
  }
];

// Map Controller for zooming and recentering  
function MapController() {
  return null;
}

function ZoomControls({ center }) {
  const map = useMap();

  return (
    <div className="map-zoom-controls">
      <button
        type="button"
        title="Perbesar"
        onClick={() => map.zoomIn()}
        className="map-control-btn"
      >
        <Plus size={18} />
      </button>
      <button
        type="button"
        title="Perkecil"
        onClick={() => map.zoomOut()}
        className="map-control-btn"
      >
        <Minus size={18} />
      </button>
      <button
        type="button"
        title="Reset Tampilan"
        onClick={() => map.setView(center, 15.5)}
        className="map-control-btn"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

// ======================================================
// MAIN INTERACTIVE MAP COMPONENT
// ======================================================
const InteractiveMap = ({
  showWilayahProps = true,
  height = '680px',
  customCenter
}) => {
  const centerPos = customCenter || [-6.6210, 106.7645];

  // Active category filters state
  const [activeCategories, setActiveCategories] = useState(
    MAP_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );

  // Basemap tile selection
  const [basemapKey, setBasemapKey] = useState('satellite');
  const [showWilayah, setShowWilayah] = useState(showWilayahProps);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (id) => {
    setActiveCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllCategories = (status) => {
    const next = {};
    MAP_CATEGORIES.forEach((c) => {
      next[c.id] = status;
    });
    setActiveCategories(next);
  };

  // Filter markers based on category and search query
  const filteredMarkers = useMemo(() => {
    return MARKERS_PARAKAN.filter((m) => {
      const catEnabled = activeCategories[m.tipe];
      if (!catEnabled) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.nama.toLowerCase().includes(q) ||
        m.rw.toLowerCase().includes(q) ||
        m.detail.toLowerCase().includes(q)
      );
    });
  }, [activeCategories, searchQuery]);

  return (
    <div className="cyber-map-container" style={{ height }}>
      {/* ====================================================== */}
      {/* TOP LEFT: COMPASS OVERLAY */}
      {/* ====================================================== */}
      <div className="map-compass-badge" title="Arah Mata Angin">
        <div className="compass-ring">
          <span className="north">N</span>
          <span className="east">E</span>
          <span className="south">S</span>
          <span className="west">W</span>
          <div className="compass-needle">
            <Compass size={24} />
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* TOP RIGHT: LEGEND PANEL ("KETERANGAN") */}
      {/* ====================================================== */}
      <div className="map-legend-panel">
        <div className="legend-header">
          <h3>KETERANGAN</h3>
          <div className="legend-quick-toggle">
            <button type="button" onClick={() => toggleAllCategories(true)}>
              Semua
            </button>
            <span>|</span>
            <button type="button" onClick={() => toggleAllCategories(false)}>
              Sembunyi
            </button>
          </div>
        </div>

        {/* Search input in legend */}
        <div className="legend-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Cari lokasi / fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category toggles */}
        <div className="legend-items-list">
          {MAP_CATEGORIES.map((cat) => {
            const isChecked = !!activeCategories[cat.id];
            const count = MARKERS_PARAKAN.filter((m) => m.tipe === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                className={`legend-item ${isChecked ? 'active' : 'disabled'}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="legend-item-left">
                  <span
                    className="legend-color-dot"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="legend-label">{cat.label}</span>
                </div>
                <div className="legend-item-right">
                  <span className="legend-count">{count}</span>
                  <div className={`checkbox-box ${isChecked ? 'checked' : ''}`}>
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Basemap switcher */}
        <div className="legend-basemap-select">
          <span className="basemap-title">
            <Layers size={13} /> Layer Peta:
          </span>
          <div className="basemap-buttons">
            {Object.keys(BASEMAPS).map((key) => (
              <button
                key={key}
                type="button"
                className={`basemap-btn ${basemapKey === key ? 'active' : ''}`}
                onClick={() => setBasemapKey(key)}
              >
                {BASEMAPS[key].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* LEAFLET MAP CONTAINER */}
      {/* ====================================================== */}
      <MapContainer
        center={centerPos}
        zoom={15.5}
        scrollWheelZoom={true}
        zoomControl={false}
        className="leaflet-map-canvas"
      >
        <MapController />

        {/* Tile Layer */}
        <TileLayer
          attribution={BASEMAPS[basemapKey].attribution}
          url={BASEMAPS[basemapKey].url}
        />

        {/* ====================================== */}
        {/* POLYGON WILAYAH RW */}
        {/* ====================================== */}
        {showWilayah &&
          WILAYAH_RW_PARAKAN.map((rw) => (
            <Polygon
              key={rw.id}
              positions={rw.koordinat}
              pathOptions={{
                color: rw.warna,
                fillColor: rw.warna,
                fillOpacity: 0.22,
                weight: 3,
                dashArray: '6, 6'
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className="rw-label-tooltip"
              >
                <div style={{ color: rw.warna }}>{rw.nama}</div>
              </Tooltip>
              <Popup className="cyber-popup">
                <div className="popup-rw-info">
                  <h4 style={{ color: rw.warna }}>{rw.nama}</h4>
                  <p>Wilayah Administrasi Desa Parakan Ciomas</p>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* ====================================== */}
        {/* BATAS DESA POLYLINES */}
        {/* ====================================== */}
        {showWilayah && (
          <>
            <Polyline
              positions={BATAS_DESA_UTARA}
              pathOptions={{
                color: '#00e5ff',
                weight: 4,
                dashArray: '10, 10'
              }}
            >
              <Tooltip permanent direction="top" className="batas-label-tooltip">
                BATAS DESA
              </Tooltip>
            </Polyline>

            <Polyline
              positions={BATAS_DESA_SELATAN}
              pathOptions={{
                color: '#00e5ff',
                weight: 4,
                dashArray: '10, 10'
              }}
            >
              <Tooltip permanent direction="bottom" className="batas-label-tooltip">
                BATAS DESA
              </Tooltip>
            </Polyline>

            <Polyline
              positions={SUNGAI_CIOMAS}
              pathOptions={{
                color: '#007aff',
                weight: 5,
                dashArray: '8, 8'
              }}
            >
              <Tooltip permanent direction="bottom" className="sungai-label-tooltip">
                Sungai Ciomas
              </Tooltip>
            </Polyline>
          </>
        )}

        {/* ====================================== */}
        {/* CATEGORY MARKERS */}
        {/* ====================================== */}
        {filteredMarkers.map((marker) => {
          const category =
            MAP_CATEGORIES.find((c) => c.id === marker.tipe) || MAP_CATEGORIES[1];
          const IconComp = category.icon;

          return (
            <Marker
              key={marker.id}
              position={marker.posisi}
              icon={createCustomIcon(marker.tipe)}
            >
              <Popup className="cyber-popup">
                <div className="popup-card-content">
                  <div
                    className="popup-badge"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComp size={14} />
                    <span>{category.label}</span>
                    <span className="popup-rw-tag">• {marker.rw}</span>
                  </div>

                  <h3 className="popup-title">{marker.nama}</h3>
                  <p className="popup-desc">{marker.detail}</p>
                  <div className="popup-footer">
                    <span className="popup-status">
                      <span className="status-dot"></span> Desa Parakan Ciomas
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Zoom controls inside map */}
        <ZoomControls center={centerPos} />
      </MapContainer>

      {/* ====================================================== */}
      {/* BOTTOM RIGHT: DESA AMAN BADGE */}
      {/* ====================================================== */}
      <div className="map-bottom-badge">
        <ShieldCheck size={18} className="badge-icon" />
        <span>Desa Aman, Warga Nyaman</span>
      </div>
    </div>
  );
};

export default InteractiveMap;