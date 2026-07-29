import { Users, Store, MessageSquare, Camera, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

export default function Dashboard() {
  const { warga, umkm, laporan, cctv, statistik, user } = useApp();

  const totalAktifCctv = cctv.filter(c => c.status === 'aktif').length;
  const laporanBaru    = laporan.filter(l => l.status === 'baru').length;
  const laporanProses  = laporan.filter(l => l.status === 'diproses').length;
  const laporanSelesai = laporan.filter(l => l.status === 'selesai').length;

  const summaryCards = [
    { label: 'Total Warga',     value: statistik.totalPenduduk || warga.length, icon: <Users size={22} />,          color: '#6366f1' },
    { label: 'UMKM Aktif',      value: umkm.filter(u => u.status === 'aktif').length, icon: <Store size={22} />,    color: '#10b981' },
    { label: 'Laporan Masuk',   value: laporan.length,                           icon: <MessageSquare size={22} />, color: '#f59e0b' },
    { label: 'CCTV Online',     value: `${totalAktifCctv}/${cctv.length}`,       icon: <Camera size={22} />,        color: '#ef4444' },
  ];

  const pieData = [
    { name: 'Baru',      value: laporanBaru    || 0 },
    { name: 'Diproses',  value: laporanProses  || 0 },
    { name: 'Selesai',   value: laporanSelesai || 0 },
  ];

  const barData = statistik.pekerjaan?.length
    ? statistik.pekerjaan
    : [{ label: 'Belum ada data', value: 0 }];

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang, {user?.name}. Berikut ringkasan data desa.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dash-summary-grid">
        {summaryCards.map((c, i) => (
          <div className="dash-card" key={i} style={{ '--dc': c.color }}>
            <div className="dash-card-ico" style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</div>
            <div>
              <div className="dash-card-num" style={{ color: c.color }}>{c.value}</div>
              <div className="dash-card-lbl">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="dash-charts-row">
        {/* Bar chart pekerjaan */}
        <div className="dash-chart-box">
          <h3><TrendingUp size={16} /> Mata Pencaharian Warga</h3>
          {barData[0].value === 0 ? (
            <div className="dash-empty">Belum ada data statistik</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart laporan */}
        <div className="dash-chart-box">
        <h3>
       <MessageSquare size={16} />
       Status Laporan Warga
       </h3>

  {laporan.length === 0 ? (
    <div className="dash-empty">Belum ada laporan masuk</div>
  ) : (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {pieData.map((_, i) => (
            <Cell
              key={`cell-${i}`}
              fill={['#f59e0b', '#6366f1', '#10b981'][i]}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value, name) => [value, name]}
        />

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  )}
</div>

        {/* CCTV status */}
        <div className="dash-chart-box">
          <h3><Camera size={16} /> Status CCTV</h3>
          <div className="dash-cctv-list">
            {cctv.map(cam => (
              <div className="dash-cctv-item" key={cam.id}>
                <div className={`dash-cctv-dot ${cam.status === 'aktif' ? 'on' : 'off'}`}></div>
                <span>{cam.lokasi}</span>
                <span className={`dash-cctv-status ${cam.status === 'aktif' ? 'on' : 'off'}`}>
                  {cam.status === 'aktif' ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent laporan */}
      <div className="dash-table-box">
        <h3><AlertCircle size={16} /> Laporan Terbaru</h3>
        {laporan.length === 0 ? (
          <div className="dash-empty">Belum ada laporan</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Nama</th><th>Jenis</th><th>Tanggal</th><th>Status</th></tr>
            </thead>
            <tbody>
              {laporan.slice(0, 5).map(l => (
                <tr key={l.id}>
                  <td>{l.nama}</td>
                  <td>{l.jenis}</td>
                  <td>{l.tanggal}</td>
                  <td><span className={`status-badge ${l.status}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
