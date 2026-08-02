import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_STATE, DEFAULT_ACCOUNTS, DATA_VERSION, getFieldSignatures } from '../data/initialData';
import { saveSupabaseState } from '../utils/supabase';

const LS_KEY = 'desa_parakan_state';
const LS_VERSION = 'v15'; // v15: data dari file selalu menang; cache browser lama dibuang

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Jika versi aplikasi / skema berubah, hapus cache lama.
    if (parsed.__version !== LS_VERSION) {
      localStorage.removeItem(LS_KEY);
      return null;
    }

    // Bandingkan signature tiap bagian dengan file data.
    // Bagian yang berubah di src/data/initialData.js → tanda stale
    // → nanti dipakai dari file (bukan dari cache).
    const current = getFieldSignatures();
    const savedSigs = parsed.__fieldSignatures || {};
    let needsUpdate = false;
    for (const key of Object.keys(current)) {
      if (savedSigs[key] !== current[key]) {
        needsUpdate = true;
        delete parsed[key];
      }
    }
    if (needsUpdate) {
      const refreshed = { ...parsed, __fieldSignatures: current };
      try { localStorage.setItem(LS_KEY, JSON.stringify(refreshed)); } catch { /* ignore */ }
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      __version: LS_VERSION,
      __dataVersion: DATA_VERSION,
      __fieldSignatures: getFieldSignatures(),
      theme:     state.theme,
      user:      state.user,
      accounts:  state.accounts,
      warga:     state.warga,
      aparat:    state.aparat,
      berita:    state.berita,
      umkm:      state.umkm,
      laporan:   state.laporan,
      cctv:      state.cctv,
      statistik: state.statistik,
      infoDesa:  state.infoDesa,
      pengajuanDokumen: state.pengajuanDokumen,
      pengajuanSubmissions: state.pengajuanSubmissions,
      petaAset:  state.petaAset,
      dataRW:    state.dataRW,
      alarmDarurat: state.alarmDarurat,
    }));
  } catch { /* quota exceeded – ignore */ }
}

/* ─────────────────────────────────────
   Merge saved state with defaults
   (ensures new fields from code updates
   are always present even in old saves)
───────────────────────────────────── */
function buildInitial() {
  const saved = loadState();
  if (!saved) return { ...DEFAULT_STATE };

  const savedStat = saved.statistik || {};
  const hasStat = savedStat.totalPenduduk > 0 &&
                  Array.isArray(savedStat.pendidikan) && savedStat.pendidikan.length > 0 &&
                  Array.isArray(savedStat.pekerjaan) && savedStat.pekerjaan.length > 0;

  return {
    ...DEFAULT_STATE,
    ...saved,
    accounts: mergeAccounts(DEFAULT_ACCOUNTS, saved.accounts || []),
    statistik: hasStat ? {
      ...DEFAULT_STATE.statistik,
      ...savedStat,
      usia: savedStat.usia && savedStat.usia.length > 0 ? savedStat.usia : DEFAULT_STATE.statistik.usia,
      pendidikan: savedStat.pendidikan && savedStat.pendidikan.length > 0 ? savedStat.pendidikan : DEFAULT_STATE.statistik.pendidikan,
      pekerjaan: savedStat.pekerjaan && savedStat.pekerjaan.length > 0 ? savedStat.pekerjaan : DEFAULT_STATE.statistik.pekerjaan,
      pertumbuhan: savedStat.pertumbuhan && savedStat.pertumbuhan.length > 0 ? savedStat.pertumbuhan : DEFAULT_STATE.statistik.pertumbuhan,
      rumahIbadat: savedStat.rumahIbadat && savedStat.rumahIbadat.length > 0 ? savedStat.rumahIbadat : DEFAULT_STATE.statistik.rumahIbadat,
      kesehatan: { ...DEFAULT_STATE.statistik.kesehatan, ...(savedStat.kesehatan || {}) },
      statusSosial: { ...DEFAULT_STATE.statistik.statusSosial, ...(savedStat.statusSosial || {}) },
      kelengkapanAdmin: { ...DEFAULT_STATE.statistik.kelengkapanAdmin, ...(savedStat.kelengkapanAdmin || {}) },
      infrastruktur: { ...DEFAULT_STATE.statistik.infrastruktur, ...(savedStat.infrastruktur || {}) },
    } : DEFAULT_STATE.statistik,
    aparat: (saved.aparat && saved.aparat.length > 0)
      ? saved.aparat.map(a => {
          const def = DEFAULT_STATE.aparat.find(d => d.id === a.id);
          const fotoFinal = (a.foto && a.foto.trim()) ? a.foto : def?.foto;
          return { ...a, foto: fotoFinal };
        })
      : DEFAULT_STATE.aparat,
    berita: (saved.berita && saved.berita.length > 0) ? saved.berita.map(b => {
      const def = DEFAULT_STATE.berita.find(d => d.id === b.id);
      const gambarFinal = (b.gambar && b.gambar.trim()) ? b.gambar : def?.gambar;
      return gambarFinal ? { ...b, gambar: gambarFinal } : b;
    }) : DEFAULT_STATE.berita,
    umkm: (saved.umkm && saved.umkm.length > 0) ? saved.umkm.map(u => {
      const def = DEFAULT_STATE.umkm.find(d => d.id === u.id);
      const gambarFinal = (u.gambar && u.gambar.trim()) ? u.gambar : def?.gambar;
      return gambarFinal ? { ...u, gambar: gambarFinal } : u;
    }) : DEFAULT_STATE.umkm,
    infoDesa: { ...DEFAULT_STATE.infoDesa, ...(saved.infoDesa || {}) },
    pengajuanDokumen: (saved.pengajuanDokumen && saved.pengajuanDokumen.length > 0) ? saved.pengajuanDokumen : DEFAULT_STATE.pengajuanDokumen,
    pengajuanSubmissions: saved.pengajuanSubmissions || [],
    petaAset: (saved.petaAset && saved.petaAset.length > 0) ? saved.petaAset : DEFAULT_STATE.petaAset,
    dataRW: (saved.dataRW && saved.dataRW.length > 0) ? saved.dataRW : DEFAULT_STATE.dataRW,
    alarmDarurat: saved.alarmDarurat || [],
  };
}

function mergeAccounts(defaults, saved) {
  const map = {};
  defaults.forEach(a => { map[a.email] = a; });
  saved.forEach(a => { map[a.email] = a; });
  return Object.values(map);
}

/* ─────────────────────────────────────
   Context
───────────────────────────────────── */
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(buildInitial);

  // Sync data-theme attribute with state.theme
  useEffect(() => {
    const currentTheme = state.theme || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [state.theme]);

  // Persist ke localStorage (cloud hanya lewat tombol sinkron manual)
  useEffect(() => {
    saveState(state);
  }, [state]);

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const nextTheme = (prev.theme || 'light') === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  }, []);

  const setTheme = useCallback((newTheme) => {
    setState(prev => ({ ...prev, theme: newTheme }));
  }, []);

  // ── AUTH ──────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const found = state.accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (found) {
      // eslint-disable-next-line no-unused-vars
      const { password: _pw, ...user } = found;
      setState(prev => ({ ...prev, user }));
      return { ok: true, user };
    }
    return { ok: false, message: 'Email atau password salah.' };
  }, [state.accounts]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
  }, []);

  const register = useCallback((name, email, password) => {
    const exists = state.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: 'Email sudah terdaftar.' };
    const newAccount = { id: Date.now(), name, email, password, role: 'user' };
    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      user: { id: newAccount.id, name, email, role: 'user' },
    }));
    return { ok: true };
  }, [state.accounts]);

  // ── WARGA CRUD ────────────────────────────────────────────────────
  const addWarga    = useCallback((data) => {
    const item = { ...data, id: Date.now() };
    setState(p => ({ ...p, warga: [...p.warga, item] }));
    return item;
  }, []);
  const updateWarga = useCallback((id, data) =>
    setState(p => ({ ...p, warga: p.warga.map(w => w.id===id ? {...w,...data} : w) })), []);
  const deleteWarga = useCallback((id) =>
    setState(p => ({ ...p, warga: p.warga.filter(w => w.id!==id) })), []);

  // ── APARAT CRUD ───────────────────────────────────────────────────
  const addAparat    = useCallback((data) => {
    const item = { ...data, id: Date.now() };
    setState(p => ({ ...p, aparat: [...p.aparat, item] }));
    return item;
  }, []);
  const updateAparat = useCallback((id, data) =>
    setState(p => ({ ...p, aparat: p.aparat.map(a => a.id===id ? {...a,...data} : a) })), []);
  const deleteAparat = useCallback((id) =>
    setState(p => ({ ...p, aparat: p.aparat.filter(a => a.id!==id) })), []);

  // ── BERITA CRUD ───────────────────────────────────────────────────
  const addBerita    = useCallback((data) => {
    const item = { ...data, id: Date.now(), tanggal: data.tanggal || new Date().toISOString().slice(0,10) };
    setState(p => ({ ...p, berita: [item, ...p.berita] }));
    return item;
  }, []);
  const updateBerita = useCallback((id, data) =>
    setState(p => ({ ...p, berita: p.berita.map(b => b.id===id ? {...b,...data} : b) })), []);
  const deleteBerita = useCallback((id) =>
    setState(p => ({ ...p, berita: p.berita.filter(b => b.id!==id) })), []);

  // ── UMKM CRUD ─────────────────────────────────────────────────────
  const addUmkm    = useCallback((data) => {
    const item = { ...data, id: Date.now(), status: data.status || 'aktif' };
    setState(p => ({ ...p, umkm: [...p.umkm, item] }));
    return item;
  }, []);
  const updateUmkm = useCallback((id, data) =>
    setState(p => ({ ...p, umkm: p.umkm.map(u => u.id===id ? {...u,...data} : u) })), []);
  const deleteUmkm = useCallback((id) =>
    setState(p => ({ ...p, umkm: p.umkm.filter(u => u.id!==id) })), []);

  // ── LAPORAN ───────────────────────────────────────────────────────
  const addLaporan = useCallback((data) => {
    const item = { ...data, id: Date.now(), tanggal: new Date().toISOString().slice(0,10), status:'baru', balasan:'' };
    setState(p => ({ ...p, laporan: [item, ...p.laporan] }));
    return item;
  }, []);
  const replyLaporan = useCallback((id, balasan, status) =>
    setState(p => ({ ...p, laporan: p.laporan.map(l => l.id===id ? {...l, balasan, status: status||l.status} : l) })), []);
  const deleteLaporan = useCallback((id) =>
    setState(p => ({ ...p, laporan: p.laporan.filter(l => l.id!==id) })), []);
  const updateLaporan = useCallback((id, data) =>
    setState(p => ({ ...p, laporan: p.laporan.map(l => l.id===id ? {...l,...data} : l) })), []);

  // ── PENGAJUAN SUBMISSION ──────────────────────────────────────────
  const addPengajuanSubmission = useCallback((data) => {
    const item = { ...data, id: Date.now(), tanggal: new Date().toISOString().slice(0,10), status: 'pending', balasan: '' };
    setState(p => ({ ...p, pengajuanSubmissions: [item, ...p.pengajuanSubmissions] }));
    return item;
  }, []);
  const updatePengajuanSubmission = useCallback((id, data) =>
    setState(p => ({ ...p, pengajuanSubmissions: p.pengajuanSubmissions.map(s => s.id===id ? {...s,...data} : s) })), []);
  const deletePengajuanSubmission = useCallback((id) =>
    setState(p => ({ ...p, pengajuanSubmissions: p.pengajuanSubmissions.filter(s => s.id!==id) })), []);

  // ── SUPABASE SYNC MANUAL ──────────────────────────────────────────
  const forceSync = useCallback(async () => {
    try {
      // Upload current state ke Supabase
      const success = await saveSupabaseState(state, true); // force = true
      if (success) {
        return { success: true, message: 'Data berhasil disinkronisasi ke cloud' };
      }
      return { success: false, message: 'Gagal menyinkronisasi ke cloud' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [state]);

  const value = {
    ...state,
    theme: state.theme || 'light',
    toggleTheme,
    setTheme,
    login, logout, register,
    addWarga, updateWarga, deleteWarga,
    addAparat, updateAparat, deleteAparat,
    addBerita, updateBerita, deleteBerita,
    addUmkm, updateUmkm, deleteUmkm,
    addLaporan, replyLaporan, deleteLaporan, updateLaporan,
    addPengajuanSubmission, updatePengajuanSubmission, deletePengajuanSubmission,
    updateInfoDesa:  (data) => setState(p => ({ ...p, infoDesa:  { ...p.infoDesa,  ...data } })),
    updateStatistik: (data) => setState(p => ({ ...p, statistik: { ...p.statistik, ...data } })),
    updateCctv:      (data) => setState(p => ({ ...p, cctv: data })),
    updatePengajuanDokumen: (data) => setState(p => ({ ...p, pengajuanDokumen: data })),
    updatePetaAset:   (data) => setState(p => ({ ...p, petaAset: data })),
    updateDataRW:     (data) => setState(p => ({ ...p, dataRW: data })),
    addAlarmDarurat:  (data) => setState(p => ({ ...p, alarmDarurat: [...p.alarmDarurat, { ...data, id: Date.now() }] })),
    updateAlarmDarurat: (id, data) => setState(p => ({ ...p, alarmDarurat: p.alarmDarurat.map(a => a.id === id ? {...a, ...data} : a) })),
    deleteAlarmDarurat: (id) => setState(p => ({ ...p, alarmDarurat: p.alarmDarurat.filter(a => a.id !== id) })),
    // Supabase sync
    forceSync,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
