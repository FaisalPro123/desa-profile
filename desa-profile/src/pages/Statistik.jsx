import { Users, TrendingUp, Home, GraduationCap, Heart, BarChart2, Database, MapPin, UserCheck, Activity, Shield, FileCheck, LineChart as LineChartIcon } from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, PieChart as PieChartRC, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6'];

const FALLBACK = {
  kesehatan: { sehat: 3650, sakitBiasa: 150, sakitKronis: 50, balita: 320, ibuHamil: 45, lansia: 460, bpjs: 3400, nonBpjs: 450 },
  statusSosial: { mampu: 2800, kurangMampu: 750, sangatKurangMampu: 300, penerimaBansos: 420, fakirMiskin: 80 },
  kelengkapanAdmin: { ktp: 3200, kk: 3100, akteLahir: 2400, bpjs: 3400, nikBaru: 3500 },
  pertumbuhan: [{ tahun: '2022', jumlah: 3520 }, { tahun: '2023', jumlah: 3610 }, { tahun: '2024', jumlah: 3720 }, { tahun: '2025', jumlah: 3780 }, { tahun: '2026', jumlah: 3850 }],
  infrastruktur: { sekolah: 6, puskesmas: 1, posyandu: 3, balaiDesa: 1, kantorPol: 1, warung: 45 },
};

const calculateStatistics = (wargaList) => {
  if (!wargaList || wargaList.length === 0) return null;

  const totalPenduduk = wargaList.length;
  const lakiLaki = wargaList.filter(w => w.jenis_kelamin === 'Laki-laki').length;
  const perempuan = wargaList.filter(w => w.jenis_kelamin === 'Perempuan').length;
  const kk = wargaList.filter(w => w.kepalaKeluarga === true || w.statusKK === 'Kepala Keluarga').length || Math.floor(totalPenduduk / 4);
  const balita = wargaList.filter(w => w.usia !== undefined && w.usia <= 5).length || Math.floor(totalPenduduk * 0.08);
  const lansia = wargaList.filter(w => w.usia !== undefined && w.usia >= 60).length || Math.floor(totalPenduduk * 0.12);

  const usia = [
    { label: '0-5 (Balita)', value: balita },
    { label: '6-12 Tahun', value: Math.floor(totalPenduduk * 0.12) },
    { label: '13-17 Tahun', value: Math.floor(totalPenduduk * 0.08) },
    { label: '18-35 Tahun', value: Math.floor(totalPenduduk * 0.3) },
    { label: '36-59 Tahun', value: Math.floor(totalPenduduk * 0.28) },
    { label: '60+ Tahun', value: lansia },
  ];

  const pendidikanMap = {};
  wargaList.forEach(w => {
    const p = w.pendidikan || 'Tidak Sekolah';
    pendidikanMap[p] = (pendidikanMap[p] || 0) + 1;
  });
  const pendidikan = Object.entries(pendidikanMap).map(([tingkat, jumlah]) => ({
    label: tingkat,
    tingkat,
    value: jumlah,
    jumlah
  }));

  const pekerjaanMap = {};
  wargaList.forEach(w => {
    const p = w.pekerjaan || 'Belum Bekerja';
    pekerjaanMap[p] = (pekerjaanMap[p] || 0) + 1;
  });
  const pekerjaan = Object.entries(pekerjaanMap).map(([jenis, jumlah]) => ({
    label: jenis,
    jenis,
    value: jumlah,
    jumlah
  })).sort((a, b) => b.jumlah - a.jumlah).slice(0, 6);

  const agamaMap = {};
  wargaList.forEach(w => {
    const a = w.agama || 'Islam';
    agamaMap[a] = (agamaMap[a] || 0) + 1;
  });
  const agama = Object.entries(agamaMap).map(([nama, jumlah]) => ({
    label: nama,
    value: jumlah
  }));

  const pekerjaanDistribusi = Object.entries(pekerjaanMap).map(([jenis, jumlah]) => ({
    label: jenis,
    value: jumlah,
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  const maxKerja = Math.max(...pekerjaanDistribusi.map(p => p.value), 1);

  return {
    totalPenduduk, lakiLaki, perempuan, kk, balita, lansia,
    usia, pendidikan, pekerjaan, agama,
    pekerjaanDistribusi, maxKerja
  };
};

const StatCard = ({ icon: Icon, title, children, color = '#6366f1' }) => (
  <div className="stat-card-modern">
    <div className="stat-card-head">
      <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, color }}>
        <Icon size={18} />
      </div>
      <h3>{title}</h3>
    </div>
    <div className="stat-card-body">
      {children}
    </div>
  </div>
);

const HorizontalBar = ({ label, value, maxVal, color, suffix }) => {
  const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
  return (
    <div className="stat-bar-row">
      <div className="stat-bar-top">
        <span className="stat-bar-label">{label}</span>
        <span className="stat-bar-value">{value.toLocaleString()}{suffix}</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const MiniCard = ({ icon: Icon, label, value, color, pct }) => (
  <div className="stat-kesehatan-mini">
    <div className="stat-km-icon" style={{ color }}><Icon size={20} /></div>
    <div className="stat-km-num" style={{ color }}>{value.toLocaleString()}</div>
    <div className="stat-km-lbl">{label}</div>
    <div className="stat-admin-bar-track" style={{ marginTop: 8 }}>
      <div className="stat-admin-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  </div>
);

const Statistik = () => {
  const { warga } = useApp();
  const realStats = calculateStatistics(warga);

  if (!realStats) {
    return (
      <div className="statistik-page">
        <PageHeaderPhoto
          badgeIcon={<BarChart2 size={14} />}
          title="Statistik Desa"
          subtitle="Data dan statistik kependudukan Desa Parakan Ciomas"
        />
        <div className="page-body">
          <div className="page-container">
            
            
            <div className="public-empty">
              <Database size={48} />
              <h3>Data Statistik Belum Tersedia</h3>
              <p>Admin desa sedang mempersiapkan data statistik kependudukan.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const d = FALLBACK;
  const totalKes = Object.values(d.kesehatan).reduce((a, b) => a + (b || 0), 0) || 1;
  const maxSosial = Math.max(...Object.values(d.statusSosial), 1);
  const maxAdmin = Math.max(...Object.values(d.kelengkapanAdmin), 1);
  const maxTumbuh = Math.max(...d.pertumbuhan.map(p => p.jumlah), 1);
  const maxInfra = Math.max(...Object.values(d.infrastruktur), 1);

  return (
    <div className="statistik-page">
      <PageHeaderPhoto
        badgeIcon={<BarChart2 size={14} />}
        title="Statistik Desa"
        subtitle="Data dan statistik kependudukan Desa Parakan Ciomas"
      />

      <div className="page-body">
        <div className="page-container">
          
          {/* Overview Cards */}
          <div className="stat-overview-modern">
            {[
              { label: 'Total Penduduk',  value: realStats.totalPenduduk, icon: Users,      color: '#6366f1', sub: `${realStats.balita} balita` },
              { label: 'Laki-laki',       value: realStats.lakiLaki,      icon: TrendingUp, color: '#10b981', sub: `${((realStats.lakiLaki / realStats.totalPenduduk) * 100).toFixed(1)}% dari total` },
              { label: 'Perempuan',       value: realStats.perempuan,     icon: Users,      color: '#f59e0b', sub: `${((realStats.perempuan / realStats.totalPenduduk) * 100).toFixed(1)}% dari total` },
              { label: 'Kepala Keluarga', value: realStats.kk,            icon: Home,       color: '#8b5cf6', sub: `Rata-rata ${Math.floor(realStats.totalPenduduk / realStats.kk)} jiwa/KK` },
            ].map((c, i) => (
              <div className="stat-ov-card" key={i}>
                <div className="stat-ov-icon" style={{ background: `${c.color}12`, color: c.color }}>
                  <c.icon size={24} />
                </div>
                <div className="stat-ov-content">
                  <div className="stat-ov-num" style={{ color: c.color }}>{c.value.toLocaleString()}</div>
                  <div className="stat-ov-lbl">{c.label}</div>
                  {c.sub && <div className="stat-ov-sub">{c.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Kelompok Usia */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon"><Activity size={18} /></div>
              <h3>Distribusi Kelompok Usia</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-bars">
                {realStats.usia.map((item, i) => (
                  <HorizontalBar key={i} label={item.label} value={item.value} maxVal={realStats.totalPenduduk} color={COLORS[i % COLORS.length]} suffix=" jiwa" />
                ))}
              </div>
            </div>
          </div>

          {/* Pendidikan + Agama */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <StatCard icon={GraduationCap} title="Tingkat Pendidikan" color="#6366f1">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={realStats.pendidikan} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="label" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 13 }} formatter={(v) => [v.toLocaleString(), 'Jumlah']} />
                  <Bar dataKey="value" name="Jumlah" radius={[6, 6, 0, 0]}>
                    {realStats.pendidikan.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </StatCard>

            <StatCard icon={Shield} title="Distribusi Agama" color="#f59e0b">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChartRC>
                    <Pie data={realStats.agama} cx="50%" cy="50%" labelLine={true} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} innerRadius={50} dataKey="value" paddingAngle={2}>
                      {realStats.agama.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChartRC>
                </ResponsiveContainer>
              </div>
            </StatCard>
          </div>

          {/* Mata Pencaharian */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b98115, #10b98108)', color: '#10b981' }}><UserCheck size={18} /></div>
              <h3>Mata Pencaharian Teratas</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-bars">
                {realStats.pekerjaanDistribusi.map((item, i) => (
                  <HorizontalBar key={i} label={item.label} value={item.value} maxVal={realStats.maxKerja} color={COLORS[(i + 2) % COLORS.length]} suffix=" orang" />
                ))}
              </div>
            </div>
          </div>

          {/* Fasilitas Umum */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #8b5cf615, #8b5cf608)', color: '#8b5cf6' }}><MapPin size={18} /></div>
              <h3>Fasilitas Umum Desa</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-facilities-grid">
                {[
                  { name: 'Balai Desa', icon: Home, count: '1 Unit', color: '#6366f1' },
                  { name: 'Puskesmas / Posyandu', icon: Heart, count: '4 Unit', color: '#ef4444' },
                  { name: 'Sekolah (SD-SMA)', icon: GraduationCap, count: '6 Unit', color: '#10b981' },
                  { name: 'Masjid / Musholla', icon: Shield, count: '14 Unit', color: '#f59e0b' },
                ].map((f, i) => (
                  <div className="stat-fac-card" key={i}>
                    <div className="stat-fac-icon">
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}12`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <f.icon size={22} />
                      </div>
                    </div>
                    <div className="stat-fac-count" style={{ color: f.color }}>{f.count}</div>
                    <div className="stat-fac-name">{f.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Komposisi Gender + Pertumbuhan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', margin: '1.5rem 0' }}>
            <StatCard icon={Users} title="Komposisi Gender" color="#10b981">
              <ResponsiveContainer width="100%" height={280}>
                <PieChartRC>
                  <Pie data={[{ name: 'Laki-laki', value: realStats.lakiLaki }, { name: 'Perempuan', value: realStats.perempuan }]} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" paddingAngle={2}>
                    <Cell fill={COLORS[1]} /><Cell fill={COLORS[2]} />
                  </Pie>
                  <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                </PieChartRC>
              </ResponsiveContainer>
            </StatCard>

            <StatCard icon={LineChartIcon} title="Pertumbuhan Penduduk" color="#8b5cf6">
              <div className="stat-bars">
                {d.pertumbuhan.map((p, i) => (
                  <HorizontalBar key={i} label={p.tahun} value={p.jumlah} maxVal={maxTumbuh} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Pertumbuhan dari {d.pertumbuhan[0]?.tahun} ke {d.pertumbuhan[d.pertumbuhan.length - 1]?.tahun}
              </div>
            </StatCard>
          </div>

          {/* Kesehatan */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #ef444415, #ef444408)', color: '#ef4444' }}><Heart size={18} /></div>
              <h3>Data Kesehatan</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-kesehatan-grid">
                {[
                  { label: 'Sehat', key: 'sehat', color: '#10b981' },
                  { label: 'Sakit Biasa', key: 'sakitBiasa', color: '#f59e0b' },
                  { label: 'Sakit Kronis', key: 'sakitKronis', color: '#ef4444' },
                  { label: 'Balita', key: 'balita', color: '#8b5cf6' },
                  { label: 'Ibu Hamil', key: 'ibuHamil', color: '#ec4899' },
                  { label: 'Lansia', key: 'lansia', color: '#06b6d4' },
                  { label: 'BPJS', key: 'bpjs', color: '#10b981' },
                  { label: 'Non-BPJS', key: 'nonBpjs', color: '#ef4444' },
                ].map((item, i) => (
                  <MiniCard key={i} icon={Heart} label={item.label} value={d.kesehatan[item.key] || 0} color={item.color} pct={((d.kesehatan[item.key] || 0) / totalKes) * 100} />
                ))}
              </div>
            </div>
          </div>

          {/* Status Sosial */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d415, #06b6d408)', color: '#06b6d4' }}><Shield size={18} /></div>
              <h3>Status Sosial</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-bars">
                {[
                  { label: 'Mampu', key: 'mampu', color: '#10b981' },
                  { label: 'Kurang Mampu', key: 'kurangMampu', color: '#f59e0b' },
                  { label: 'Sangat Kurang', key: 'sangatKurangMampu', color: '#ef4444' },
                  { label: 'Penerima Bansos', key: 'penerimaBansos', color: '#8b5cf6' },
                  { label: 'Fakir Miskin', key: 'fakirMiskin', color: '#ef4444' },
                ].map((item, i) => (
                  <HorizontalBar key={i} label={item.label} value={d.statusSosial[item.key] || 0} maxVal={maxSosial} color={item.color} />
                ))}
              </div>
            </div>
          </div>

          {/* Kelengkapan Administrasi */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b98115, #10b98108)', color: '#10b981' }}><FileCheck size={18} /></div>
              <h3>Kelengkapan Administrasi</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-bars">
                {[
                  { label: 'KTP', key: 'ktp', color: '#6366f1' },
                  { label: 'KK', key: 'kk', color: '#10b981' },
                  { label: 'Akta Lahir', key: 'akteLahir', color: '#f59e0b' },
                  { label: 'BPJS', key: 'bpjs', color: '#8b5cf6' },
                  { label: 'NIK Baru', key: 'nikBaru', color: '#06b6d4' },
                ].map((item, i) => (
                  <HorizontalBar key={i} label={item.label} value={d.kelengkapanAdmin[item.key] || 0} maxVal={maxAdmin} color={item.color} />
                ))}
              </div>
            </div>
          </div>

          {/* Infrastruktur */}
          <div className="stat-card-modern" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card-head">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d415, #06b6d408)', color: '#06b6d4' }}><MapPin size={18} /></div>
              <h3>Infrastruktur Desa</h3>
            </div>
            <div className="stat-card-body">
              <div className="stat-bars">
                {[
                  { name: 'Sekolah', key: 'sekolah', color: '#6366f1' },
                  { name: 'Puskesmas', key: 'puskesmas', color: '#ef4444' },
                  { name: 'Posyandu', key: 'posyandu', color: '#10b981' },
                  { name: 'Balai Desa', key: 'balaiDesa', color: '#f59e0b' },
                  { name: 'Kantor Polisi', key: 'kantorPol', color: '#8b5cf6' },
                  { name: 'Warung', key: 'warung', color: '#06b6d4' },
                ].map((item, i) => (
                  <HorizontalBar key={i} label={item.name} value={d.infrastruktur[item.key] || 0} maxVal={maxInfra} color={item.color} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Statistik;
