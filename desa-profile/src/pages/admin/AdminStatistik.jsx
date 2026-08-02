import { useState } from 'react';
import { Save, Plus, Trash2, Download, TrendingUp, Heart, Shield, FileCheck, BarChart2, Users, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportCsv } from '../../utils/exportCsv';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

function ArrayEditor({ label, data = [], onChange, valueKey = 'value', labelKey = 'label', extraKey, extraLabel }) {
  const add = () => {
    const item = { [labelKey]: '', [valueKey]: 0 };
    if (extraKey) item[extraKey] = 0;
    onChange([...data, item]);
  };
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));
  const set = (i, key, val) => {
    const next = [...data];
    next[i] = { ...next[i], [key]: key === labelKey ? val : +val };
    onChange(next);
  };
  return (
    <div className="stat-array-editor" style={{ marginBottom: '1.25rem' }}>
      <div className="stat-ae-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{label}</span>
        <button type="button" className="btn-adm-xs" onClick={add} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.3rem 0.6rem' }}>
          <Plus size={12} /> Tambah Data
        </button>
      </div>
      {data.map((row, i) => (
        <div className="stat-ae-row" key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <input
            style={{ flex: 2, padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            placeholder="Label / Nama"
            value={row[labelKey] || ''}
            onChange={e => set(i, labelKey, e.target.value)}
          />
          <input
            style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            type="number"
            placeholder="Jumlah / Nilai"
            value={row[valueKey] ?? 0}
            onChange={e => set(i, valueKey, e.target.value)}
          />
          {extraKey && (
            <input
              style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              type="number"
              placeholder={extraLabel || 'Nilai 2'}
              value={row[extraKey] ?? 0}
              onChange={e => set(i, extraKey, e.target.value)}
            />
          )}
          <button type="button" className="stat-ae-delete" onClick={() => remove(i)} title="Hapus" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ icon: Icon, title, color = '#6366f1', children }) {
  return (
    <div className="adm-stat-section" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
      <div className="adm-stat-section-head" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div className="adm-stat-section-icon" style={{ background: `${color}15`, color, padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <Icon size={18} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>{title}</h3>
      </div>
      <div className="adm-stat-section-body">
        {children}
      </div>
    </div>
  );
}

export default function AdminStatistik() {
  const { statistik, updateStatistik, user } = useApp();
  const isAdmin = user?.role === 'admin';
  const [form, setForm] = useState({ ...statistik });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedForm = {
      ...form,
      pertumbuhan: form.pertumbuhan || form.pertumbuhan5Tahun,
      pertumbuhan5Tahun: form.pertumbuhan || form.pertumbuhan5Tahun,
      pendidikan: form.pendidikan || form.pendidikanDetail,
      pendidikanDetail: form.pendidikan || form.pendidikanDetail,
      pekerjaan: form.pekerjaan || form.pekerjaanDetail,
      pekerjaanDetail: form.pekerjaan || form.pekerjaanDetail,
    };
    updateStatistik(updatedForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const exportAll = () => {
    const rows = [
      ...(form.pendidikan || form.pendidikanDetail || []).map(r => ({ ...r, kategori: 'Pendidikan' })),
      ...(form.pekerjaan  || form.pekerjaanDetail  || []).map(r => ({ ...r, kategori: 'Pekerjaan'  })),
      ...(form.pertumbuhan || form.pertumbuhan5Tahun || []).map(r => ({ ...r, kategori: 'Pertumbuhan' })),
    ];
    exportCsv(rows, 'statistik_desa');
  };

  return (
    <div className="adm-page" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="adm-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Statistik Desa</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Kelola seluruh diagram & data demografi warga desa</p>
        </div>
        <div className="adm-head-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-adm-outline" onClick={exportAll} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
            <Download size={15} /> Export CSV
          </button>
          {isAdmin && (
            <button className="btn-adm-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
              <Save size={15} /> {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
            </button>
          )}
        </div>
      </div>

      {/* Overview Numbers */}
      <div className="adm-stat-overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Penduduk', key: 'totalPenduduk', icon: Users, color: '#6366f1' },
          { label: 'Laki-laki', key: 'lakiLaki', icon: UserCheck, color: '#3b82f6' },
          { label: 'Perempuan', key: 'perempuan', icon: UserCheck, color: '#ec4899' },
          { label: 'Kepala Keluarga', key: 'kk', icon: Shield, color: '#10b981' },
        ].map(f => (
          <div className="adm-stat-ov-card" key={f.key} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ background: `${f.color}15`, color: f.color, padding: '0.35rem', borderRadius: '6px' }}>
                <f.icon size={16} />
              </div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{f.label}</label>
            </div>
            <input
              type="number"
              value={form[f.key] ?? ''}
              onChange={e => setForm({ ...form, [f.key]: +e.target.value })}
              disabled={!isAdmin}
              placeholder="0"
              style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '800', fontSize: '1.1rem' }}
            />
          </div>
        ))}
      </div>

      {/* EDITORS FOR CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        {/* Pertumbuhan 5 Tahun */}
        <SectionCard icon={TrendingUp} title="Grafik Pertumbuhan Penduduk (5 Tahun)" color="#10b981">
          {isAdmin && (
            <ArrayEditor
              label="Data Pertumbuhan (Tahun & Jumlah)"
              data={form.pertumbuhan || form.pertumbuhan5Tahun || [
                { tahun: '2022', jumlah: 8200 },
                { tahun: '2023', jumlah: 9450 },
                { tahun: '2024', jumlah: 10800 },
                { tahun: '2025', jumlah: 12100 },
                { tahun: '2026', jumlah: 13645 }
              ]}
              onChange={v => setForm({ ...form, pertumbuhan: v, pertumbuhan5Tahun: v })}
              valueKey="jumlah"
              labelKey="tahun"
            />
          )}
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={form.pertumbuhan || form.pertumbuhan5Tahun || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Tingkat Pendidikan Detail */}
        <SectionCard icon={BarChart2} title="Tingkat Pendidikan (Progress Bars & Pie)" color="#3b82f6">
          {isAdmin && (
            <ArrayEditor
              label="Tingkat Pendidikan (Nama, Jumlah, Persen)"
              data={form.pendidikan || form.pendidikanDetail || [
                { label: 'D1 – D3', value: 2592, pct: 19.0 },
                { label: 'SMA / SMK', value: 2415, pct: 17.7 },
                { label: 'SD / Sederajat', value: 2333, pct: 17.1 },
                { label: 'S1 / D4', value: 2074, pct: 15.2 },
                { label: 'SMP / Sederajat', value: 2074, pct: 15.2 },
                { label: 'Belum / Tidak Sekolah', value: 1897, pct: 13.9 }
              ]}
              onChange={v => setForm({ ...form, pendidikan: v, pendidikanDetail: v })}
              valueKey="value"
              extraKey="pct"
              extraLabel="Persen %"
              labelKey="label"
            />
          )}
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        {/* Mata Pencaharian Detail */}
        <SectionCard icon={UserCheck} title="Mata Pencaharian Utama (Progress Bars & Pie)" color="#f59e0b">
          {isAdmin && (
            <ArrayEditor
              label="Mata Pencaharian (Nama, Jumlah, Persen)"
              data={form.pekerjaan || form.pekerjaanDetail || [
                { label: 'Karyawan Swasta', value: 3465, pct: 25.4 },
                { label: 'Wiraswasta / UMKM', value: 3111, pct: 22.8 },
                { label: 'Petani & Peternak', value: 2524, pct: 18.5 },
                { label: 'Buruh Harian Lepas', value: 1937, pct: 14.2 },
                { label: 'PNS / TNI / Polri', value: 1378, pct: 10.1 },
                { label: 'Jasa & Lainnya', value: 1230, pct: 9.0 }
              ]}
              onChange={v => setForm({ ...form, pekerjaan: v, pekerjaanDetail: v })}
              valueKey="value"
              extraKey="pct"
              extraLabel="Persen %"
              labelKey="label"
            />
          )}
        </SectionCard>

        {/* BPJS Composition */}
        <SectionCard icon={Heart} title="Komposisi BPJS Kesehatan" color="#ef4444">
          {isAdmin && (
            <ArrayEditor
              label="Komposisi BPJS (Kategori, Jumlah Warga, Persen)"
              data={form.bpjsComposition || [
                { name: 'Aktif KIS', value: form.bpjs?.pbiJiwa || 4571, pct: form.bpjs?.pbiPct || 33.5 },
                { name: 'Aktif Mandiri', value: form.bpjs?.mandiriJiwa || 4666, pct: form.bpjs?.mandiriPct || 34.2 },
                { name: 'Tidak Aktif', value: form.bpjs?.belumJiwa || 4408, pct: form.bpjs?.belumPct || 32.3 }
              ]}
              onChange={v => setForm({ ...form, bpjsComposition: v })}
              valueKey="value"
              extraKey="pct"
              extraLabel="Persen %"
              labelKey="name"
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

