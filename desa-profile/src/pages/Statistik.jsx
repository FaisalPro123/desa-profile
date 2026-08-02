import { useMemo } from 'react';
import {
  TrendingUp,
  GraduationCap,
  Heart,
  BarChart2,
  Shield,
  FileCheck
} from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  PieChart as PieChartRC,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

const GENDER_COLORS  = ['#6366f1', '#ec4899'];
const PENDIDIKAN_COLORS = ['#8b5cf6','#6366f1','#3b82f6','#06b6d4','#10b981','#f59e0b'];
const PEKERJAAN_COLORS  = ['#ef4444','#f59e0b','#10b981','#6366f1','#a855f7','#06b6d4'];
const BPJS_COLORS    = ['#10b981','#06b6d4','#ef4444'];

/* ── Donut Gauge SVG ─────────────────────────────────── */
const DonutGauge = ({ percentage = 0, label = '', detail = '', color = '#007043' }) => {
  const radius = 38;
  const sw = 8;
  const norm = radius - sw * 0.5;
  const circ = norm * 2 * Math.PI;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 92, height: 92 }}>
        <svg height="92" width="92" viewBox="0 0 92 92" style={{ transform: 'rotate(-90deg)' }}>
          <circle stroke="#e2e8f0" fill="transparent" strokeWidth={sw} r={norm} cx="46" cy="46" />
          <circle stroke={color} fill="transparent" strokeWidth={sw}
            strokeDasharray={`${circ} ${circ}`}
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.8s ease' }}
            strokeLinecap="round" r={norm} cx="46" cy="46" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
          {percentage}%
        </div>
      </div>
      <div style={{ marginTop: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>{label}</div>
      {detail && <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{detail}</div>}
    </div>
  );
};

export default function Statistik({ embedded = false }) {
  const { statistik = {}, infoDesa = {}, warga = [] } = useApp();
  const s = statistik;

  /* ── Computed from warga ─────────────────────────── */
  const computed = useMemo(() => {
    const total = s.totalPenduduk || warga.length || 0;
    const male  = s.lakiLaki  || warga.filter(w => w.jenis_kelamin === 'Laki-laki').length  || 0;
    const female= s.perempuan || warga.filter(w => w.jenis_kelamin === 'Perempuan').length  || 0;
    const kk    = s.kk        || Math.floor(total / 4) || 0;
    return { total, male, female, kk };
  }, [s, warga]);

  const { total, male, female, kk } = computed;

  /* ── Gender Pie ─────────────────────────────────── */
  const genderData = [
    { name: 'Laki-laki',  value: male,   pct: total ? Math.round((male / total) * 100) : 50 },
    { name: 'Perempuan',  value: female, pct: total ? Math.round((female / total) * 100) : 50 },
  ];

  /* ── Pendidikan from real data ──────────────────── */
  const pendidikanData = useMemo(() => {
    const list = (s.pendidikan && s.pendidikan.length > 0) ? s.pendidikan : (s.pendidikanDetail || []);
    if (list.length > 0) {
      return list.map((item, i) => ({
        label: item.label || item.tingkat || '',
        value: item.value || item.jumlah || 0,
        pct:   item.pct   || (total ? Math.round(((item.value||item.jumlah||0) / total) * 100) : 0),
        color: PENDIDIKAN_COLORS[i % PENDIDIKAN_COLORS.length],
      }));
    }
    // Derive from warga list
    const map = {};
    warga.forEach(w => { const p = w.pendidikan || 'Tidak Sekolah'; map[p] = (map[p] || 0) + 1; });
    return Object.entries(map).map(([label, value], i) => ({
      label, value, pct: total ? Math.round((value / total) * 100) : 0,
      color: PENDIDIKAN_COLORS[i % PENDIDIKAN_COLORS.length],
    }));
  }, [s.pendidikan, s.pendidikanDetail, warga, total]);

  /* ── Pekerjaan from real data ───────────────────── */
  const pekerjaanData = useMemo(() => {
    const list = (s.pekerjaan && s.pekerjaan.length > 0) ? s.pekerjaan : (s.pekerjaanDetail || []);
    if (list.length > 0) {
      return list.map((item, i) => ({
        label: item.label || item.jenis || '',
        value: item.value || item.jumlah || 0,
        pct:   item.pct   || (total ? Math.round(((item.value||item.jumlah||0) / total) * 100) : 0),
        color: PEKERJAAN_COLORS[i % PEKERJAAN_COLORS.length],
      }));
    }
    const map = {};
    warga.forEach(w => { const p = w.pekerjaan || 'Lainnya'; map[p] = (map[p] || 0) + 1; });
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,6).map(([label, value], i) => ({
      label, value, pct: total ? Math.round((value / total) * 100) : 0,
      color: PEKERJAAN_COLORS[i % PEKERJAAN_COLORS.length],
    }));
  }, [s.pekerjaan, s.pekerjaanDetail, warga, total]);

  /* ── Growth Data ─────────────────────────────────── */
  const listPertumbuhan = (s.pertumbuhan && s.pertumbuhan.length > 0) ? s.pertumbuhan : (s.pertumbuhan5Tahun || []);
  const pertumbuhanData = listPertumbuhan.length > 0
    ? listPertumbuhan.map(g => ({ tahun: g.tahun, jumlah: g.jumlah }))
    : [
        { tahun: '2022', jumlah: Math.round(total * 0.75) },
        { tahun: '2023', jumlah: Math.round(total * 0.85) },
        { tahun: '2024', jumlah: Math.round(total * 0.92) },
        { tahun: '2025', jumlah: Math.round(total * 0.97) },
        { tahun: '2026', jumlah: total },
      ];

  const kelahiranKematianData = s.kelahiranKematian && s.kelahiranKematian.length > 0
    ? s.kelahiranKematian
    : [
        { tahun: '2022', kelahiran: 340, kematian: 130 },
        { tahun: '2023', kelahiran: 370, kematian: 140 },
        { tahun: '2024', kelahiran: 350, kematian: 125 },
        { tahun: '2025', kelahiran: 420, kematian: 160 },
        { tahun: '2026', kelahiran: 310, kematian: 110 },
      ];

  /* ── 5-year bar ─────────────────────────────────── */
  const pertumbuhan5Tahun = pertumbuhanData.slice(-5).map(g => ({
    tahun: `Tahun ${g.tahun}`, jumlah: g.jumlah
  }));

  /* ── BPJS Composition ────────────────────────────── */
  const bpjsComp = s.bpjsComposition && s.bpjsComposition.length > 0
    ? s.bpjsComposition.map((item, i) => ({
        name: item.name || item.label || '',
        value: item.value || 0,
        pct: item.pct || 0,
        color: BPJS_COLORS[i % BPJS_COLORS.length]
      }))
    : s.bpjs ? [
        { name: 'Aktif Mandiri', value: s.bpjs.mandiriJiwa || 0, pct: s.bpjs.mandiriPct || 0, color: '#10b981' },
        { name: 'PBI (KIS)',     value: s.bpjs.pbiJiwa     || 0, pct: s.bpjs.pbiPct     || 0, color: '#06b6d4' },
        { name: 'Tidak Aktif',  value: s.bpjs.belumJiwa    || 0, pct: s.bpjs.belumPct   || 0, color: '#ef4444' },
      ] : [
        { name: 'Aktif KIS',    value: 35, pct: 33, color: '#10b981' },
        { name: 'Aktif Mandiri',value: 35, pct: 33, color: '#06b6d4' },
        { name: 'Tidak Aktif',  value: 35, pct: 33, color: '#ef4444' },
      ];

  /* ── Kesehatan Progress List ─────────────────────── */
  const kes = s.kesehatan || {};
  const kesehatanList = [
    { label: 'Kepemilikan BPJS Kesehatan',         count: `${(kes.bpjs || 9237).toLocaleString('id-ID')} Jiwa`,  pct: total ? Math.round(((kes.bpjs || 9237) / total) * 100) : 68, color: '#10b981' },
    { label: 'Penerima Bantuan Sosial (PKH/BPNT)',  count: `${((s.statusSosial?.penerimaBansos) || 1540).toLocaleString('id-ID')} Jiwa`, pct: total ? Math.round((((s.statusSosial?.penerimaBansos) || 1540) / total) * 100) : 11, color: '#f59e0b' },
    { label: 'Akses Air Bersih & Sanitasi Layak',  count: `${Math.round(total * 0.96).toLocaleString('id-ID')} Jiwa`, pct: 96, color: '#06b6d4' },
    { label: 'Balita Terdata Imunisasi Lengkap',    count: `${(kes.balita || 1090).toLocaleString('id-ID')} Balita`, pct: 93, color: '#3b82f6' },
  ];

  /* ── Admin Data ──────────────────────────────────── */
  const adminData = s.kelengkapanAdmin || { ktpPct: 98, ktpCount: 13372, kkPct: 99, kkCount: kk, aktePct: 95, akteCount: Math.round(total * 0.95) };
  const bpjsData  = s.bpjs  || { mandiriPct: 34.2, pbiPct: 33.5, belumPct: 32.3 };
  const agamaData = s.agama || { islamPct: 92.4, kristenPct: 6.3, lainnyaPct: 1.3 };
  const goldarData = s.golonganDarah || { oPct: 32.1, aPct: 25.5, bPct: 24.2, abPct: 18.2 };

  /* ── Age Groups ──────────────────────────────────── */
  const usia = s.usia && s.usia.length > 0 ? s.usia : [
    { label: '0-14 Tahun',  value: Math.round(total * 0.21) },
    { label: '15-64 Tahun', value: Math.round(total * 0.68) },
    { label: '65+ Tahun',   value: Math.round(total * 0.11) },
  ];

  /* ── Infra ───────────────────────────────────────── */
  const infra = s.infrastruktur || { sekolah: 12, puskesmas: 2, posyandu: 8, balaiDesa: 1 };

  const desaName = infoDesa.nama || 'Desa Parakan Ciomas';

  return (
    <div style={{ background: '#f6f8fc', minHeight: embedded ? undefined : '100vh', paddingBottom: '4rem' }}>
      {!embedded && (
        <PageHeaderPhoto
          badgeIcon={<BarChart2 size={14} />}
          title={`Statistik Kependudukan ${desaName}`}
          subtitle="Visualisasi data demografi, pendidikan, pekerjaan, dan kesehatan warga secara terintegrasi"
        />
      )}

      <div style={{ maxWidth: '1280px', margin: embedded ? '0 auto' : '2rem auto 0 auto', padding: '0 1.25rem' }}>

        {/* ── TITLE ── */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Statistik Kependudukan
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.4rem 0 0 0', fontStyle: 'italic' }}>
            Visualisasi data demografi warga {desaName}
          </p>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* 4 METRIC CARDS */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Penduduk',   value: total,  color: '#6366f1' },
            { label: 'Laki-laki',        value: male,   color: '#3b82f6' },
            { label: 'Perempuan',        value: female, color: '#ec4899' },
            { label: 'Kepala Keluarga',  value: kk,     color: '#10b981' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', borderLeft: `5px solid ${color}`, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color, lineHeight: 1 }}>
                {value.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginTop: '0.4rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* 3 PIE CHARTS */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Gender Pie */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0' }}>Distribusi Gender</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChartRC>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v.toLocaleString('id-ID')} Jiwa`, n]} />
                </PieChartRC>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>
              <span style={{ color: '#6366f1' }}>● Laki-laki: {male.toLocaleString('id-ID')} ({genderData[0].pct}%)</span>
              <span style={{ color: '#ec4899' }}>● Perempuan: {female.toLocaleString('id-ID')} ({genderData[1].pct}%)</span>
            </div>
          </div>

          {/* Pendidikan Pie */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0' }}>Tingkat Pendidikan</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChartRC>
                  <Pie data={pendidikanData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {pendidikanData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v.toLocaleString('id-ID')} Jiwa`, n]} />
                </PieChartRC>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3rem 0.7rem', marginTop: '0.5rem' }}>
              {pendidikanData.map((item, i) => (
                <span key={i} style={{ fontSize: '0.72rem', fontWeight: '700', color: item.color }}>
                  ● {item.label} ({item.pct}%)
                </span>
              ))}
            </div>
          </div>

          {/* Pekerjaan Pie */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0' }}>Jenis Pekerjaan</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChartRC>
                  <Pie data={pekerjaanData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {pekerjaanData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v.toLocaleString('id-ID')} Jiwa`, n]} />
                </PieChartRC>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3rem 0.7rem', marginTop: '0.5rem' }}>
              {pekerjaanData.map((item, i) => (
                <span key={i} style={{ fontSize: '0.72rem', fontWeight: '700', color: item.color }}>
                  ● {item.label} ({item.pct}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* TREN PERTUMBUHAN + KELAHIRAN vs KEMATIAN */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(480px,1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
                TREN LAJU PERTUMBUHAN TOTAL
              </h3>
              <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: '700', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem' }}>
                {total.toLocaleString('id-ID')} Jiwa
              </span>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pertumbuhanData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#007043" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#007043" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tahun" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${v.toLocaleString('id-ID')} Jiwa`, 'Populasi']} />
                  <Area type="monotone" dataKey="jumlah" stroke="#007043" strokeWidth={3} fill="url(#growthGrad)" dot={{ r: 4, fill: '#007043' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
                KELAHIRAN VS KEMATIAN
              </h3>
              <div style={{ display: 'flex', gap: '0.7rem', fontSize: '0.75rem', fontWeight: '700' }}>
                <span style={{ color: '#007043' }}>● Kelahiran</span>
                <span style={{ color: '#ff2d55' }}>● Kematian</span>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kelahiranKematianData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tahun" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="kelahiran" name="Kelahiran" fill="#007043" radius={[5,5,0,0]} />
                  <Bar dataKey="kematian"  name="Kematian"  fill="#ff2d55" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* PERTUMBUHAN 5 TAHUN + RASIO GENDER */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                Pertumbuhan Penduduk 5 Tahun Terakhir &amp; Rasio Jenis Kelamin
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                Grafik populasi 5 tahun terakhir — {male.toLocaleString('id-ID')} Pria vs {female.toLocaleString('id-ID')} Perempuan
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>
                📈 Grafik Pertumbuhan Penduduk
              </h4>
              <div style={{ height: 185 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pertumbuhan5Tahun} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="tahun" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v.toLocaleString('id-ID')} Jiwa`, 'Populasi']} />
                    <Bar dataKey="jumlah" fill="#10b981" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', textAlign: 'center' }}>
                ▲ Rata-rata Laju Pertumbuhan: +2.3% per tahun
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#334155', alignSelf: 'flex-start' }}>
                ⏱ Rasio Jenis Kelamin
              </h4>
              <div style={{ width: '100%', height: 175 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartRC>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#ec4899" />
                    </Pie>
                    <Tooltip formatter={(v) => [`${v.toLocaleString('id-ID')} Jiwa`]} />
                  </PieChartRC>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', fontWeight: '700' }}>
                <span style={{ color: '#3b82f6' }}>● Pria: {male.toLocaleString('id-ID')} ({genderData[0].pct}%)</span>
                <span style={{ color: '#ec4899' }}>● Perempuan: {female.toLocaleString('id-ID')} ({genderData[1].pct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* PENDIDIKAN + PEKERJAAN PROGRESS BARS */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                Tingkat Pendidikan &amp; Mata Pencaharian Utama
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Profil kualitas SDM dan sektor pekerjaan warga desa</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '1rem' }}>🎓 Tingkat Pendidikan</h4>
              {pendidikanData.map((item, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.2rem' }}>
                    <span>{item.label}</span>
                    <span>{item.value.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', marginTop: '2px', textAlign: 'right' }}>{item.pct}%</div>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '1rem' }}>💼 Mata Pencaharian Utama</h4>
              {pekerjaanData.map((item, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.2rem' }}>
                    <span>{item.label}</span>
                    <span>{item.value.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', marginTop: '2px', textAlign: 'right' }}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* STATUS SOSIAL & KESEHATAN + BPJS DONUT */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Status Sosial &amp; Kesehatan Warga</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Cakupan jaminan kesehatan dan layanan kesejahteraan masyarakat</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '2rem' }}>
            <div>
              {kesehatanList.map((item, i) => (
                <div key={i} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '999px' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', marginTop: '2px', textAlign: 'right' }}>{item.pct}%</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#334155', alignSelf: 'flex-start' }}>
                ⏱ Komposisi BPJS Kesehatan
              </h4>
              <div style={{ width: '100%', height: 175 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartRC>
                    <Pie data={bpjsComp} cx="50%" cy="50%" innerRadius={44} outerRadius={68} dataKey="value">
                      {bpjsComp.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v.toLocaleString('id-ID')} Jiwa`, n]} />
                  </PieChartRC>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.75rem', fontWeight: '700', flexWrap: 'wrap', justifyContent: 'center' }}>
                {bpjsComp.map((item, i) => (
                  <span key={i} style={{ color: item.color }}>● {item.name} ({item.pct}%)</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* KELOMPOK USIA (BAR) */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
            📊 Distribusi Kelompok Usia
          </h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usia} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v.toLocaleString('id-ID')} Jiwa`, 'Jumlah']} />
                <Bar dataKey="value" name="Jumlah" radius={[6,6,0,0]}>
                  {usia.map((_, i) => (
                    <Cell key={i} fill={['#6366f1','#10b981','#f59e0b'][i % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* KELENGKAPAN ADMIN GAUGES */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(0,112,67,0.1)', color: '#007043', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Kelengkapan Administrasi Publik</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem', padding: '0.5rem 0' }}>
            <DonutGauge percentage={adminData.ktpPct || 98}  label="KTP Elektronik"  detail={`${(adminData.ktpCount || 13372).toLocaleString('id-ID')} Terdaftar`} color="#007043" />
            <DonutGauge percentage={adminData.kkPct  || 99}  label="Kartu Keluarga"  detail={`${(adminData.kkCount || kk).toLocaleString('id-ID')} KK`}           color="#007043" />
            <DonutGauge percentage={adminData.aktePct|| 95}  label="Akta Kelahiran"  detail={`${(adminData.akteCount || Math.round(total*0.95)).toLocaleString('id-ID')} Terdaftar`} color="#007043" />
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* BPJS / AGAMA / GOLDAR 3-COLUMN */}
        {/* ════════════════════════════════════════════ */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(0,112,67,0.1)', color: '#007043', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Status Sosial, BPJS &amp; Golongan Darah</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#007043', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
                KEPESERTAAN BPJS KESEHATAN
              </div>
              {[
                { label: 'Mandiri (Non-PBI)',  val: `${bpjsData.mandiriPct}%  (${((bpjsData.mandiriJiwa)||4666).toLocaleString('id-ID')} Jiwa)` },
                { label: 'PBI (Subsidi APBN)', val: `${bpjsData.pbiPct}%  (${((bpjsData.pbiJiwa)||4571).toLocaleString('id-ID')} Jiwa)` },
                { label: 'Belum Terdaftar',    val: `${bpjsData.belumPct}%  (${((bpjsData.belumJiwa)||4408).toLocaleString('id-ID')} Jiwa)` },
              ].map(row => (
                <div key={row.label} style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{row.label}</span>
                  <strong>{row.val}</strong>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', padding: '0 1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#007043', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
                DISTRIBUSI AGAMA WARGA
              </div>
              {[
                { label: 'Islam',                 val: `${agamaData.islamPct}%` },
                { label: 'Kristen / Katholik',    val: `${agamaData.kristenPct}%` },
                { label: 'Lainnya (Hindu/Budha)', val: `${agamaData.lainnyaPct}%` },
              ].map(row => (
                <div key={row.label} style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{row.label}</span>
                  <strong>{row.val}</strong>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#007043', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
                GOLONGAN DARAH WARGA
              </div>
              {[
                { label: 'Golongan O',  val: `${goldarData.oPct}%` },
                { label: 'Golongan A',  val: `${goldarData.aPct}%` },
                { label: 'Golongan B',  val: `${goldarData.bPct}%` },
                { label: 'Golongan AB', val: `${goldarData.abPct}%` },
              ].map(row => (
                <div key={row.label} style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{row.label}</span>
                  <strong>{row.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

Statistik.defaultProps = { embedded: false };
