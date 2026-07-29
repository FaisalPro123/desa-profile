import { useState } from 'react';
import { Save, Plus, Trash2, Pencil, X, Download, TrendingUp, Heart, Shield, FileCheck, BarChart2, Users, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportCsv } from '../../utils/exportCsv';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

function ArrayEditor({ label, data, onChange, valueKey = 'value', labelKey = 'label' }) {
  const add = () => onChange([...data, { [labelKey]:'', [valueKey]:0 }]);
  const remove = (i) => onChange(data.filter((_,idx) => idx !== i));
  const set = (i, key, val) => {
    const next = [...data];
    next[i] = { ...next[i], [key]: key === valueKey ? +val : val };
    onChange(next);
  };
  return (
    <div className="stat-array-editor">
      <div className="stat-ae-head">
        <span>{label}</span>
        <button type="button" className="btn-adm-xs" onClick={add}><Plus size={12} /> Tambah</button>
      </div>
      {data.map((row, i) => (
        <div className="stat-ae-row" key={i}>
          <input placeholder="Label" value={row[labelKey] || ''} onChange={e => set(i, labelKey, e.target.value)} />
          <input type="number" placeholder="Jumlah" value={row[valueKey] || 0} onChange={e => set(i, valueKey, e.target.value)} />
          <button type="button" className="stat-ae-delete" onClick={() => remove(i)} title="Hapus"><Trash2 size={13} /></button>
        </div>
      ))}
    </div>
  );
}

function NumberInput({ label, value, onChange, disabled, suffix, icon: Icon, color }) {
  return (
    <div className="stat-num-input">
      <label>{label}</label>
      <div className="stat-num-wrap">
        {Icon && <span className="stat-num-icon" style={{ color: color || '#6366f1' }}><Icon size={16} /></span>}
        <input type="number" value={value || ''} onChange={e => onChange(+e.target.value)} disabled={disabled} placeholder="0" />
        {suffix && <span className="stat-num-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, color = '#6366f1', children }) {
  return (
    <div className="adm-stat-section">
      <div className="adm-stat-section-head">
        <div className="adm-stat-section-icon" style={{ background: `${color}15`, color }}>
          <Icon size={18} />
        </div>
        <h3>{title}</h3>
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
    updateStatistik(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportAll = () => {
    const rows = [
      ...( form.usia || []).map(r => ({...r, kategori:'Usia'})),
      ...(form.pendidikan || []).map(r => ({...r, kategori:'Pendidikan'})),
      ...(form.pekerjaan  || []).map(r => ({...r, kategori:'Pekerjaan'})),
    ];
    exportCsv(rows, 'statistik_desa');
  };

  const updateKesehatan = (key, val) => {
    setForm({ ...form, kesehatan: { ...form.kesehatan, [key]: val } });
  };
  const updateStatusSosial = (key, val) => {
    setForm({ ...form, statusSosial: { ...form.statusSosial, [key]: val } });
  };
  const updateAdmin = (key, val) => {
    setForm({ ...form, kelengkapanAdmin: { ...form.kelengkapanAdmin, [key]: val } });
  };

  const kesehatan = form.kesehatan || {};
  const statusSosial = form.statusSosial || {};
  const kelengkapanAdmin = form.kelengkapanAdmin || {};

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Statistik Desa</h1>
          <p>Input dan kelola data statistik kependudukan</p>
        </div>
        <div className="adm-head-actions">
          <button className="btn-adm-outline" onClick={exportAll}><Download size={15} /> Export CSV</button>
          {isAdmin && <button className="btn-adm-primary" onClick={handleSave}><Save size={15} /> {saved ? 'Tersimpan!' : 'Simpan'}</button>}
        </div>
      </div>

      {/* Overview numbers */}
      <div className="adm-stat-overview">
        {[
          { label:'Total Penduduk', key:'totalPenduduk', icon: Users, color: '#6366f1' },
          { label:'Laki-laki',      key:'lakiLaki',      icon: UserCheck, color: '#10b981' },
          { label:'Perempuan',      key:'perempuan',      icon: UserCheck, color: '#f59e0b' },
          { label:'KK',             key:'kk',             icon: Shield,    color: '#8b5cf6' },
          { label:'Luas Wilayah',   key:'luasWilayah',    icon: BarChart2, color: '#06b6d4', suffix: 'Ha' },
        ].map(f => (
          <div className="adm-stat-ov-card" key={f.key}>
            <div className="adm-stat-ov-icon" style={{ background: `${f.color}12`, color: f.color }}>
              <f.icon size={20} />
            </div>
            <div className="adm-stat-ov-field">
              <label>{f.label}</label>
              <div className="adm-stat-ov-input-wrap">
                <input
                  type="number"
                  value={form[f.key] || ''}
                  onChange={e => setForm({...form, [f.key]: +e.target.value})}
                  disabled={!isAdmin}
                  placeholder="0"
                />
                {f.suffix && <span className="adm-stat-ov-suffix">{f.suffix}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Array editors + charts */}
      {['usia','pendidikan','pekerjaan'].map(cat => {
        const icons = { usia: TrendingUp, pendidikan: BarChart2, pekerjaan: UserCheck };
        const labels = { usia:'Kelompok Usia', pendidikan:'Tingkat Pendidikan', pekerjaan:'Mata Pencaharian' };
        const colors = { usia: '#6366f1', pendidikan: '#10b981', pekerjaan: '#f59e0b' };
        const data = form[cat] || [];
        return (
          <SectionCard key={cat} icon={icons[cat]} title={labels[cat]} color={colors[cat]}>
            <div className="stat-section-inner">
              {isAdmin && (
                <ArrayEditor label={labels[cat]} data={data} onChange={v => setForm({...form,[cat]:v})} />
              )}
              <div className="stat-chart-wrap">
                {data.length === 0 ? (
                  <div className="dash-empty">Belum ada data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top:8, right:8, left:-12, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize:11, fill:'#64748b' }} />
                      <YAxis tick={{ fontSize:11, fill:'#64748b' }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" name="Jumlah" radius={[6,6,0,0]}>
                        {data.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </SectionCard>
        );
      })}

      {/* Pertumbuhan 5 Tahun */}
      <SectionCard icon={TrendingUp} title="Grafik Pertumbuhan 5 Tahun" color="#8b5cf6">
        <div className="stat-section-inner">
          {isAdmin && (
            <ArrayEditor label="Pertumbuhan 5 Tahun" data={form.pertumbuhan || []} onChange={v => setForm({...form, pertumbuhan:v})} valueKey="jumlah" labelKey="tahun" />
          )}
          <div className="stat-chart-wrap">
            {(form.pertumbuhan || []).length === 0 ? (
              <div className="dash-empty">Belum ada data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={(form.pertumbuhan || []).map(p => ({name: p.tahun, jumlah: p.jumlah}))} margin={{top:8,right:8,left:-12,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize:11, fill:'#64748b'}} />
                  <YAxis tick={{fontSize:11, fill:'#64748b'}} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="jumlah" name="Jumlah" stroke="#8b5cf6" strokeWidth={3} dot={{fill:'#8b5cf6',r:4}} activeDot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Kesehatan */}
      <SectionCard icon={Heart} title="Data Kesehatan" color="#ef4444">
        <div className="adm-stat-num-grid">
          <NumberInput label="Sehat" value={kesehatan.sehat} onChange={v => updateKesehatan('sehat', v)} disabled={!isAdmin} icon={Heart} color="#10b981" />
          <NumberInput label="Sakit Biasa" value={kesehatan.sakitBiasa} onChange={v => updateKesehatan('sakitBiasa', v)} disabled={!isAdmin} icon={Heart} color="#f59e0b" />
          <NumberInput label="Sakit Kronis" value={kesehatan.sakitKronis} onChange={v => updateKesehatan('sakitKronis', v)} disabled={!isAdmin} icon={Heart} color="#ef4444" />
          <NumberInput label="Balita" value={kesehatan.balita} onChange={v => updateKesehatan('balita', v)} disabled={!isAdmin} icon={Users} color="#8b5cf6" />
          <NumberInput label="Ibu Hamil" value={kesehatan.ibuHamil} onChange={v => updateKesehatan('ibuHamil', v)} disabled={!isAdmin} icon={Heart} color="#ec4899" />
          <NumberInput label="Lansia" value={kesehatan.lansia} onChange={v => updateKesehatan('lansia', v)} disabled={!isAdmin} icon={Users} color="#06b6d4" />
          <NumberInput label="BPJS" value={kesehatan.bpjs} onChange={v => updateKesehatan('bpjs', v)} disabled={!isAdmin} icon={Shield} color="#10b981" />
          <NumberInput label="Non-BPJS" value={kesehatan.nonBpjs} onChange={v => updateKesehatan('nonBpjs', v)} disabled={!isAdmin} icon={Shield} color="#ef4444" />
        </div>
        <div className="stat-chart-wrap" style={{ marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { label: 'Sehat', value: kesehatan.sehat || 0 },
              { label: 'Sakit Biasa', value: kesehatan.sakitBiasa || 0 },
              { label: 'Sakit Kronis', value: kesehatan.sakitKronis || 0 },
              { label: 'Balita', value: kesehatan.balita || 0 },
              { label: 'Ibu Hamil', value: kesehatan.ibuHamil || 0 },
              { label: 'Lansia', value: kesehatan.lansia || 0 },
              { label: 'BPJS', value: kesehatan.bpjs || 0 },
              { label: 'Non-BPJS', value: kesehatan.nonBpjs || 0 },
            ]} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" name="Jumlah" radius={[4, 4, 0, 0]}>
                {['#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#10b981','#ef4444'].map((c, i) => <Cell key={i} fill={c} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Status Sosial */}
      <SectionCard icon={Shield} title="Status Sosial" color="#06b6d4">
        <div className="adm-stat-num-grid">
          <NumberInput label="Mampu" value={statusSosial.mampu} onChange={v => updateStatusSosial('mampu', v)} disabled={!isAdmin} icon={Shield} color="#10b981" />
          <NumberInput label="Kurang Mampu" value={statusSosial.kurangMampu} onChange={v => updateStatusSosial('kurangMampu', v)} disabled={!isAdmin} icon={Shield} color="#f59e0b" />
          <NumberInput label="Sangat Kurang Mampu" value={statusSosial.sangatKurangMampu} onChange={v => updateStatusSosial('sangatKurangMampu', v)} disabled={!isAdmin} icon={Shield} color="#ef4444" />
          <NumberInput label="Penerima Bansos" value={statusSosial.penerimaBansos} onChange={v => updateStatusSosial('penerimaBansos', v)} disabled={!isAdmin} icon={FileCheck} color="#8b5cf6" />
          <NumberInput label="Fakir Miskin" value={statusSosial.fakirMiskin} onChange={v => updateStatusSosial('fakirMiskin', v)} disabled={!isAdmin} icon={Shield} color="#ef4444" />
        </div>
        <div className="stat-chart-wrap" style={{ marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { label: 'Mampu', value: statusSosial.mampu || 0 },
              { label: 'Kurang Mampu', value: statusSosial.kurangMampu || 0 },
              { label: 'Sangat Kurang', value: statusSosial.sangatKurangMampu || 0 },
              { label: 'Penerima Bansos', value: statusSosial.penerimaBansos || 0 },
              { label: 'Fakir Miskin', value: statusSosial.fakirMiskin || 0 },
            ]} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" name="Jumlah" radius={[6, 6, 0, 0]}>
                {['#10b981','#f59e0b','#ef4444','#8b5cf6','#ef4444'].map((c, i) => <Cell key={i} fill={c} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Kelengkapan Administrasi */}
      <SectionCard icon={FileCheck} title="Kelengkapan Administrasi" color="#10b981">
        <div className="adm-stat-num-grid">
          <NumberInput label="KTP" value={kelengkapanAdmin.ktp} onChange={v => updateAdmin('ktp', v)} disabled={!isAdmin} icon={FileCheck} color="#6366f1" />
          <NumberInput label="KK" value={kelengkapanAdmin.kk} onChange={v => updateAdmin('kk', v)} disabled={!isAdmin} icon={FileCheck} color="#10b981" />
          <NumberInput label="Akta Kelahiran" value={kelengkapanAdmin.akteLahir} onChange={v => updateAdmin('akteLahir', v)} disabled={!isAdmin} icon={FileCheck} color="#f59e0b" />
          <NumberInput label="BPJS" value={kelengkapanAdmin.bpjs} onChange={v => updateAdmin('bpjs', v)} disabled={!isAdmin} icon={FileCheck} color="#8b5cf6" />
          <NumberInput label="NIK Baru" value={kelengkapanAdmin.nikBaru} onChange={v => updateAdmin('nikBaru', v)} disabled={!isAdmin} icon={FileCheck} color="#06b6d4" />
        </div>
        <div className="stat-chart-wrap" style={{ marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { label: 'KTP', value: kelengkapanAdmin.ktp || 0 },
              { label: 'KK', value: kelengkapanAdmin.kk || 0 },
              { label: 'Akta Lahir', value: kelengkapanAdmin.akteLahir || 0 },
              { label: 'BPJS', value: kelengkapanAdmin.bpjs || 0 },
              { label: 'NIK Baru', value: kelengkapanAdmin.nikBaru || 0 },
            ]} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" name="Jumlah" radius={[6, 6, 0, 0]}>
                {['#6366f1','#10b981','#f59e0b','#8b5cf6','#06b6d4'].map((c, i) => <Cell key={i} fill={c} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
