import { useState } from 'react';
import { Settings, Database, FileCode2, Download, RotateCcw, Copy, Check, Cloud, Upload, Key, Link, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseStatus, setSupabaseCredentials, getSupabaseClient } from '../../utils/supabase';

export default function AdminSettings() {
  const appState = useApp();
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [testingConn, setTestingConn] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [sbUrl, setSbUrl]   = useState('');
  const [sbKey, setSbKey]   = useState('');
  const [saving, setSaving] = useState(false);

  const supabaseStatus = getSupabaseStatus();

  // ── Sync ke cloud ──────────────────────────────────────────────────
  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await appState.forceSync();
      setSyncMessage(result?.message || 'Selesai');
    } catch (error) {
      setSyncMessage('Error: ' + error.message);
    }
    setSyncing(false);
    setTimeout(() => setSyncMessage(''), 4000);
  };

  // ── Test koneksi Supabase ──────────────────────────────────────────
  const handleTestConn = async () => {
    setTestingConn(true);
    setTestMessage('');
    try {
      const sb = getSupabaseClient();
      if (!sb) {
        setTestMessage('❌ Client tidak terbentuk — pastikan URL dan Key sudah diisi.');
        setTestingConn(false);
        return;
      }
      const { error } = await sb.from('desa_app_state').select('id').limit(1);
      if (error) {
        setTestMessage('❌ Error: ' + error.message + '. Pastikan tabel desa_app_state sudah dibuat.');
      } else {
        setTestMessage('✅ Koneksi berhasil! Supabase terhubung.');
      }
    } catch (e) {
      setTestMessage('❌ Exception: ' + e.message);
    }
    setTestingConn(false);
    setTimeout(() => setTestMessage(''), 5000);
  };

  // ── Simpan credentials ke localStorage ────────────────────────────
  const handleSaveCredentials = () => {
    if (!sbUrl.trim() || !sbKey.trim()) {
      alert('URL dan Key tidak boleh kosong.');
      return;
    }
    setSaving(true);
    setSupabaseCredentials(sbUrl.trim(), sbKey.trim());
    setTimeout(() => {
      setSaving(false);
      window.location.reload(); // reload agar client baru dibuat
    }, 500);
  };

  // ── Export JSON ────────────────────────────────────────────────────
  const handleExport = () => {
    const { theme, user, accounts, ...exportable } = appState; // eslint-disable-line no-unused-vars
    const data = JSON.stringify(exportable, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'data-desa.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Reset cache browser ────────────────────────────────────────────
  const handleReset = () => {
    if (!confirm('Hapus cache data di browser ini lalu muat ulang?')) return;
    localStorage.removeItem('desa_parakan_state');
    window.location.reload();
  };

  const handleCopyFile = () => {
    navigator.clipboard.writeText('src/data/initialData.js').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: 860, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Settings size={22} style={{ color: '#6366f1' }} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#172033' }}>Pengaturan Data</h1>
        </div>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
          Atur sinkronisasi data agar konten admin dan halaman publik selalu sama di semua perangkat.
        </p>
      </div>

      {/* ── Status badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderRadius: 10, marginBottom: 20,
        background: supabaseStatus.isConfigured ? '#f0fdf4' : '#fefce8',
        border: `1px solid ${supabaseStatus.isConfigured ? '#bbf7d0' : '#fde68a'}`,
      }}>
        {supabaseStatus.isConfigured
          ? <CheckCircle size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          : <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
        }
        <span style={{ fontSize: 14, fontWeight: 600, color: supabaseStatus.isConfigured ? '#15803d' : '#92400e' }}>
          {supabaseStatus.isConfigured
            ? `Cloud Sync Aktif — ${supabaseStatus.url?.replace(/https?:\/\//, '')?.split('.')[0]}.supabase.co`
            : 'Mode Offline — Data hanya tersimpan di browser ini. User lain tidak bisa melihat perubahan.'
          }
        </span>
      </div>

      {/* ── Setup Supabase (hanya muncul kalau belum konfigurasi) ── */}
      {!supabaseStatus.isConfigured && (
        <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #fbbf24', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: 8 }}>
            <NumBadge n="!" color="#d97706" />
            <span style={{ fontWeight: 700, color: '#92400e', fontSize: 15 }}>Setup Supabase — Wajib untuk Sinkronisasi Data</span>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              Tanpa Supabase, perubahan admin hanya tersimpan di browser ini dan tidak terlihat oleh pengguna lain.
              Ikuti langkah berikut untuk mengaktifkan sinkronisasi:
            </p>

            <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
              {[
                { step: 1, text: 'Buka app.supabase.com → Login → New project', link: 'https://app.supabase.com' },
                { step: 2, text: 'Buat project baru, pilih region Singapore, tunggu 1-2 menit' },
                { step: 3, text: 'Di project baru: Settings → API → copy Project URL dan anon public key' },
                { step: 4, text: 'Jalankan SQL ini di SQL Editor Supabase untuk membuat tabel:', sql: true },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#6366f1', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1
                  }}>{item.step}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: '#334155' }}>{item.text}</span>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer"
                        style={{ marginLeft: 8, fontSize: 12, color: '#6366f1', fontWeight: 600 }}>
                        Buka →
                      </a>
                    )}
                    {item.sql && (
                      <pre style={{
                        margin: '8px 0 0', padding: '12px', borderRadius: 8,
                        background: '#1e293b', color: '#e2e8f0', fontSize: 11,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6
                      }}>{SQL_SETUP}</pre>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  <Link size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Project URL
                </label>
                <input
                  value={sbUrl}
                  onChange={e => setSbUrl(e.target.value)}
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  <Key size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Anon Public Key
                </label>
                <input
                  value={sbKey}
                  onChange={e => setSbKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleTestConn}
                disabled={testingConn || !sbUrl || !sbKey}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: '1.5px solid #6366f1',
                  cursor: (testingConn || !sbUrl || !sbKey) ? 'not-allowed' : 'pointer',
                  background: '#fff', color: '#6366f1', fontWeight: 700, fontSize: 13,
                  opacity: (!sbUrl || !sbKey) ? 0.5 : 1
                }}
              >
                {testingConn ? 'Menguji...' : 'Test Koneksi'}
              </button>
              <button
                onClick={handleSaveCredentials}
                disabled={saving || !sbUrl || !sbKey}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: 'none',
                  cursor: (saving || !sbUrl || !sbKey) ? 'not-allowed' : 'pointer',
                  background: (!sbUrl || !sbKey) ? '#94a3b8' : '#6366f1',
                  color: '#fff', fontWeight: 700, fontSize: 13
                }}
              >
                {saving ? 'Menyimpan...' : 'Simpan & Aktifkan'}
              </button>
            </div>

            {testMessage && (
              <div style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 8, fontSize: 13,
                background: testMessage.includes('✅') ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${testMessage.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
                color: testMessage.includes('✅') ? '#16a34a' : '#dc2626',
              }}>
                {testMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Cloud Sync (muncul kalau sudah terkonfigurasi) ── */}
      {supabaseStatus.isConfigured && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 8 }}>
            <NumBadge n={1} color="#10b981" />
            <span style={{ fontWeight: 700, color: '#065f46', fontSize: 15 }}>Sinkronisasi Cloud</span>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              Data otomatis tersimpan ke cloud setiap kali ada perubahan. Klik tombol di bawah untuk force sync manual sekarang juga.
            </p>
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                padding: '11px 20px', borderRadius: 9, border: 'none',
                cursor: syncing ? 'not-allowed' : 'pointer',
                background: syncing ? '#94a3b8' : '#10b981',
                color: '#fff', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <Upload size={16} />
              {syncing ? 'Menyinkronisasi...' : 'Sync Semua Data ke Cloud Sekarang'}
            </button>

            {syncMessage && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: 13,
                background: syncMessage.toLowerCase().includes('error') || syncMessage.toLowerCase().includes('gagal') ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${syncMessage.toLowerCase().includes('error') || syncMessage.toLowerCase().includes('gagal') ? '#fecaca' : '#bbf7d0'}`,
                color: syncMessage.toLowerCase().includes('error') || syncMessage.toLowerCase().includes('gagal') ? '#dc2626' : '#16a34a',
              }}>
                {syncMessage}
              </div>
            )}

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b' }}>
              <strong>Cara kerja sinkronisasi:</strong><br />
              Admin edit data → tersimpan otomatis ke Supabase (2.5 detik debounce) → user di semua perangkat menerima update realtime.
            </div>
          </div>
        </div>
      )}

      {/* ── Cara mengubah data via kode ── */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
          <NumBadge n={supabaseStatus.isConfigured ? 2 : '?'} />
          <span style={{ fontWeight: 700, color: '#172033', fontSize: 15 }}>Mengubah Data via File Kode</span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 2.2 }}>
            <li>
              Buka file{' '}
              <code
                style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 6, fontWeight: 700, color: '#6366f1', cursor: 'pointer' }}
                onClick={handleCopyFile}
                title="Klik untuk menyalin lokasi file"
              >
                src/data/initialData.js {copied ? <Check size={11} style={{ verticalAlign: 'middle' }} /> : <Copy size={11} style={{ verticalAlign: 'middle' }} />}
              </code>{' '}
              di VS Code.
            </li>
            <li>Ubah teks atau ganti URL gambar (Berita, UMKM, Aparat, Profil Desa, dll).</li>
            <li>Simpan, lalu deploy ke Vercel. Data baru langsung tampil.</li>
          </ol>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1e40af', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileCode2 size={14} /> Catatan Penting
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#1d4ed8', lineHeight: 1.6 }}>
              Edit via halaman admin (upload/link gambar, edit teks) tersimpan ke <strong>Supabase cloud</strong> jika sudah dikonfigurasi
              — sehingga semua perangkat mendapat data yang sama. Tanpa Supabase, perubahan admin hanya tersimpan di browser tersebut.
            </p>
          </div>
        </div>
      </div>

      {/* ── Alat bantu ── */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
          <NumBadge n={supabaseStatus.isConfigured ? 3 : 2} />
          <span style={{ fontWeight: 700, color: '#172033', fontSize: 15 }}>Alat Bantu</span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card
              title="Ekspor Data"
              desc="Download seluruh data saat ini sebagai file JSON untuk backup."
              btnLabel={<><Download size={15} /> Ekspor JSON</>}
              btnColor="#10b981"
              onClick={handleExport}
            />
            <Card
              title="Reset Cache Browser"
              desc="Bersihkan data tersimpan di browser ini. Gunakan jika konten belum berubah setelah deploy atau sync."
              btnLabel={<><RotateCcw size={15} /> Reset & Muat Ulang</>}
              btnColor="#6366f1"
              onClick={handleReset}
            />
          </div>
        </div>
      </div>

      {/* ── Info Footer ── */}
      <div style={{ background: '#f0f9ff', borderRadius: 14, border: '1px solid #bae6fd', padding: '16px 20px', display: 'flex', gap: 12 }}>
        <Database size={18} style={{ color: '#0284c7', flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13, color: '#0369a1', lineHeight: 1.7 }}>
          {supabaseStatus.isConfigured
            ? 'Supabase aktif. Semua perubahan tersinkronisasi realtime — admin edit → cloud → user di semua perangkat melihat perubahan langsung.'
            : 'Mode offline aktif. Aktifkan Supabase di atas agar data admin langsung terlihat oleh semua pengguna di semua perangkat dan deployment Vercel.'
          }
        </p>
      </div>
    </div>
  );
}

const SQL_SETUP = `CREATE TABLE IF NOT EXISTS public.desa_app_state (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.desa_app_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read"   ON public.desa_app_state FOR SELECT USING (true);
CREATE POLICY "public_write"  ON public.desa_app_state FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON public.desa_app_state FOR UPDATE USING (true) WITH CHECK (true);
INSERT INTO public.desa_app_state (id, data)
VALUES ('parakan_state_v1', '{}') ON CONFLICT (id) DO NOTHING;`;

const NumBadge = ({ n, color = '#6366f1' }) => (
  <span style={{
    width: 26, height: 26, borderRadius: '50%', background: color, color: '#fff',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, flexShrink: 0
  }}>{n}</span>
);

const Card = ({ title, desc, btnLabel, btnColor, onClick }) => (
  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '18px', border: '1px solid #e2e8f0' }}>
    <span style={{ fontWeight: 700, fontSize: 14, color: '#172033' }}>{title}</span>
    <p style={{ margin: '6px 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
    <button onClick={onClick} style={{
      width: '100%', padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
      background: btnColor, color: '#fff', fontWeight: 700, fontSize: 13,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7
    }}>
      {btnLabel}
    </button>
  </div>
);
