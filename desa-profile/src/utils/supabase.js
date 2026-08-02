/**
 * ═══════════════════════════════════════════════════════════════
 *  SINGLE SUPABASE CLIENT — satu-satunya file yang boleh
 *  memanggil createClient(). Semua file lain import dari sini.
 * ═══════════════════════════════════════════════════════════════
 *
 * Prioritas credentials:
 *   1. VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY  (env vars — Vercel / .env.local)
 *   2. localStorage desa_supabase_url / desa_supabase_key  (opsional, hanya untuk
 *      admin yang set via halaman Pengaturan Supabase di browser sendiri)
 *
 * localStorage TIDAK boleh menimpa env vars — env vars selalu menang.
 * Ini mencegah situasi di mana localStorage masih berisi URL lama
 * padahal env vars sudah diupdate ke URL baru.
 */

import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────
// Config resolver
// ─────────────────────────────────────────────────────────────
const getConfig = () => {
  // 1. Env vars — wajib diset di Vercel Dashboard → Settings → Environment Variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL  || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // 2. localStorage — hanya fallback jika env vars belum diset (dev tanpa .env.local)
  const lsUrl = typeof window !== 'undefined' ? (localStorage.getItem('desa_supabase_url')  || '') : '';
  const lsKey = typeof window !== 'undefined' ? (localStorage.getItem('desa_supabase_key') || '') : '';

  // env vars MENANG atas localStorage
  const url = envUrl || lsUrl;
  const key = envKey || lsKey;

  // DEBUG: Log untuk memastikan tidak ada URL lama
  if (typeof window !== 'undefined' && url) {
    console.log('🔧 Supabase Config:', { url: url.slice(0, 30) + '...', hasKey: !!key });
  }

  return { url, key, ok: Boolean(url && key) };
};

// ─────────────────────────────────────────────────────────────
// Single cached client instance
// ─────────────────────────────────────────────────────────────
let _client   = null;
let _cacheKey = '';

export const getSupabaseClient = () => {
  const { url, key, ok } = getConfig();
  if (!ok) {
    console.warn('⚠️ Supabase credentials tidak ditemukan. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diset di .env.local');
    return null;
  }

  const cacheKey = `${url}::${key}`;
  if (_client && _cacheKey === cacheKey) return _client;

  try {
    _client   = createClient(url, key, { auth: { persistSession: false } });
    _cacheKey = cacheKey;
    console.log('✅ Supabase client initialized:', url.replace(/https?:\/\//, '').split('.')[0]);
    return _client;
  } catch (err) {
    console.error('[Supabase] createClient failed:', err.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Public helpers
// ─────────────────────────────────────────────────────────────

/** Simpan credentials ke localStorage (dipakai oleh halaman AdminSettings) */
export const setSupabaseCredentials = (url, key) => {
  if (typeof window === 'undefined') return;
  if (url && key) {
    localStorage.setItem('desa_supabase_url', url.trim());
    localStorage.setItem('desa_supabase_key', key.trim());
  } else {
    localStorage.removeItem('desa_supabase_url');
    localStorage.removeItem('desa_supabase_key');
  }
  // Reset cache agar client di-recreate dengan credentials baru
  _client   = null;
  _cacheKey = '';
};

/** Status koneksi — dipakai oleh AdminLayout badge dan AdminSettings */
export const getSupabaseStatus = () => {
  const { ok, url } = getConfig();
  return { isConfigured: ok, url };
};

// ─────────────────────────────────────────────────────────────
// State sync helpers — tabel: desa_app_state
// ─────────────────────────────────────────────────────────────
const ROW_ID = 'parakan_state_v1';

// Keys yang tidak perlu disimpan ke cloud
const SKIP = new Set(['user', 'accounts', '__version', 'theme', '__dataVersion', '__fieldSignatures']);

const sanitize = (raw) => {
  try {
    const o = JSON.parse(JSON.stringify(raw));
    SKIP.forEach(k => delete o[k]);
    return o;
  } catch { return {}; }
};

/**
 * Ambil state dari Supabase.
 * Returns object atau null jika gagal / row kosong.
 */
export const fetchSupabaseState = async () => {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    console.log('📥 Fetching data from Supabase...');
    const { data, error } = await sb
      .from('desa_app_state')
      .select('data')
      .eq('id', ROW_ID)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') console.warn('[Supabase] fetch:', error.message);
      return null;
    }

    const payload = data?.data;
    if (!payload || Object.keys(payload).length === 0) return null;
    console.log('✅ Remote data loaded:', Object.keys(payload));
    return payload;
  } catch (e) {
    console.warn('[Supabase] fetch exception:', e.message);
    return null;
  }
};

// Debounce save — jangan spam saat user ketik
let _saveTimer = null;
let _readyToSave = false;   // guard: jangan save sebelum initial fetch selesai

export const markInitialFetchDone = () => { _readyToSave = true; };

/**
 * Simpan state ke Supabase.
 * @param {object} stateData
 * @param {boolean} force   Lewati debounce & guard (untuk tombol manual sync)
 * @returns {Promise<boolean>|void}
 */
export const saveSupabaseState = (stateData, force = false) => {
  const sb = getSupabaseClient();
  if (!sb) return;

  if (!_readyToSave && !force) return; // belum boleh save

  if (_saveTimer) clearTimeout(_saveTimer);

  const doSave = async () => {
    try {
      const clean = sanitize(stateData);
      // Abaikan state kosong / default yang tidak bermakna
      if (!clean.aparat?.length && !clean.berita?.length && !clean.umkm?.length) {
        console.log('⚠️ Skip save - state masih kosong');
        return false;
      }

      console.log('💾 Saving to Supabase...', Object.keys(clean));
      const { error } = await sb
        .from('desa_app_state')
        .upsert({ id: ROW_ID, data: clean, updated_at: new Date().toISOString() }, { onConflict: 'id' });

      if (error) { 
        console.error('[Supabase] save:', error.message); 
        return false; 
      }
      console.log('✅ Data saved to cloud');
      return true;
    } catch (e) {
      console.error('[Supabase] save exception:', e.message);
      return false;
    }
  };

  if (force) return doSave();           // await-able
  _saveTimer = setTimeout(doSave, 2500); // debounced
};

/**
 * Langganan realtime perubahan state dari perangkat lain.
 * Returns fungsi unsubscribe.
 */
export const subscribeSupabaseState = (onUpdate) => {
  const sb = getSupabaseClient();
  if (!sb) return () => {};

  try {
    console.log('🔄 Starting realtime subscription...');
    const ch = sb
      .channel('desa_realtime_state')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'desa_app_state', filter: `id=eq.${ROW_ID}`,
      }, (payload) => {
        const d = payload.new?.data;
        if (d && Object.keys(d).length > 0) {
          console.log('📡 Remote update received:', Object.keys(d));
          onUpdate(d);
        }
      })
      .subscribe();

    return () => sb.removeChannel(ch);
  } catch (e) {
    console.warn('[Supabase] subscribe error:', e.message);
    return () => {};
  }
};