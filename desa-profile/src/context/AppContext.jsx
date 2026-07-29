import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import sitiFoto from '../assets/image.png';

const LS_KEY = 'desa_parakan_state';
const LS_VERSION = 'v8'; // Deep-merge statistik fields (kesehatan, statusSosial, etc.)

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Jika versi berbeda, hapus cache lama agar default baru dipakai
    if (parsed.__version !== LS_VERSION) {
      localStorage.removeItem(LS_KEY);
      return null;
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


const DEFAULT_ACCOUNTS = [
  { id: 1, name: 'Admin Desa', email: 'admin@desaparakanciomas.id', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Petugas',    email: 'petugas@desaparakanciomas.id', password: 'petugas123', role: 'viewer' },
];

// Generate 100 warga (50 cewe, 50 cowo)
const generateWarga = () => {
  const namaCewe = ['Siti', 'Rini', 'Dewi', 'Nur', 'Ayu', 'Eka', 'Lisa', 'Maya', 'Nita', 'Putri', 'Rina', 'Sinta', 'Tina', 'Vira', 'Wati', 'Yuni', 'Zara', 'Ade', 'Bela', 'Citra', 'Diana', 'Endah', 'Fina', 'Gita', 'Hana', 'Ira', 'Jeni', 'Kiki', 'Lina', 'Mita', 'Nina', 'Ofa', 'Pepi', 'Qori', 'Rani', 'Silvia', 'Tari', 'Uci', 'Vina', 'Windi', 'Xeni', 'Yesi', 'Zeni', 'Alya', 'Bella', 'Cinta', 'Dina', 'Eva', 'Fani', 'Gina', 'Hera'];
  const namaCowo = ['Ahmad', 'Budi', 'Citra', 'Dedi', 'Eka', 'Fajar', 'Gunawan', 'Hendri', 'Indra', 'Joko', 'Karim', 'Luthfi', 'Mahmud', 'Nur', 'Omar', 'Panji', 'Qorri', 'Reza', 'Surya', 'Taufik', 'Udin', 'Vito', 'Wahyu', 'Xander', 'Yusuf', 'Zainul', 'Adi', 'Bambang', 'Cecep', 'Dono', 'Endi', 'Firman', 'Gatot', 'Hasan', 'Ilham', 'Jamal', 'Kanda', 'Lukman', 'Maman', 'Nanang', 'Opang', 'Parto', 'Qahfi', 'Rinto', 'Saiful', 'Toni', 'Usman', 'Veri', 'Wawan', 'Xasri'];
  const namaAkhir = ['Setiawan', 'Wijaya', 'Sutrisno', 'Hermawan', 'Kusuma', 'Hartono', 'Santoso', 'Priyanto', 'Bambang', 'Suryanto', 'Rahmawan', 'Darmawan', 'Handoko', 'Saputra', 'Gunawan', 'Arianto', 'Prasetyo', 'Nugroho', 'Iskandar', 'Rahman', 'Supiyanto', 'Sujono', 'Wibisono', 'Purnomo', 'Syaiful', 'Hasanudin', 'Kasmadi', 'Karjono', 'Kasmudin', 'Kasiran'];
  
  const warga = [];
  
  // 50 perempuan
  for (let i = 0; i < 50; i++) {
    const idx = Math.floor(Math.random() * namaAkhir.length);
    warga.push({
      id: 1000 + i,
      nama: `${namaCewe[i]} ${namaAkhir[idx]}`,
      nik: String(32701 * 1000000 + Math.floor(Math.random() * 999999)).padStart(16, '0'),
      jenis_kelamin: 'Perempuan',
      alamat: `RT 0${(i % 9) + 1} / RW 0${(i % 3) + 1}`,
      tanggal_lahir: `198${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      pekerjaan: ['Ibu Rumah Tangga', 'Petani', 'Pedagang', 'PNS', 'Karyawan', 'Guru', 'Perawat', 'Buruh'][Math.floor(Math.random() * 8)],
      agama: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha'][Math.floor(Math.random() * 5)],
      pendidikan: ['SD', 'SMP', 'SMA', 'Diploma', 'Sarjana'][Math.floor(Math.random() * 5)],
      status_perkawinan: ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'][Math.floor(Math.random() * 4)],
      keterangan: ''
    });
  }
  
  // 50 laki-laki
  for (let i = 0; i < 50; i++) {
    const idx = Math.floor(Math.random() * namaAkhir.length);
    warga.push({
      id: 1050 + i,
      nama: `${namaCowo[i]} ${namaAkhir[idx]}`,
      nik: String(32701 * 1000000 + Math.floor(Math.random() * 999999)).padStart(16, '0'),
      jenis_kelamin: 'Laki-laki',
      alamat: `RT 0${(i % 9) + 1} / RW 0${(i % 3) + 1}`,
      tanggal_lahir: `198${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      pekerjaan: ['Petani', 'Pedagang', 'PNS', 'Karyawan', 'Tukang', 'Guru', 'Sopir', 'Buruh'][Math.floor(Math.random() * 8)],
      agama: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha'][Math.floor(Math.random() * 5)],
      pendidikan: ['SD', 'SMP', 'SMA', 'Diploma', 'Sarjana'][Math.floor(Math.random() * 5)],
      status_perkawinan: ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'][Math.floor(Math.random() * 4)],
      keterangan: ''
    });
  }
  
  return warga;
};

const DEFAULT_STATE = {
  theme: 'light',
  user: null,
  accounts: DEFAULT_ACCOUNTS,
  warga: generateWarga(),
  aparat: [
    {
      id: 1,
      nama: 'Drs. H. Ahmad Sudrajat',
      jabatan: 'Kepala Desa',
      nip: '19750812 200212 1 003',
      rank: 1,
      foto: 'https://img.magnific.com/foto-gratis/potret-close-up-pria-asia-yang-karismatik-dan-menarik-menjamin-kualitas-terbaik-merekomendasikan-produk-tertawa-dan-tersenyum-senang-bersikap-tegas-anda-akan-menyukainya-dinding-putih_176420-37441.jpg?semt=ais_hybrid&w=740&q=80',
      email: 'ahmad@desaparakanciomas.id',
      telp: '081234567890',
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza, S.AP',
      jabatan: 'Sekretaris Desa',
      nip: '19820415 200801 2 005',
      rank: 2,
      foto: sitiFoto, 
      email: 'siti@desaparakanciomas.id',
      telp: '081298765432',
    },
    {
      id: 3,
      nama: 'Budi Santoso, S.E.',
      jabatan: 'Kaur Keuangan',
      nip: '19881102 201403 1 002',
      rank: 3,
      foto: 'https://example.com/foto-budi.jpg', // KOSONGKAN - Anda bisa isi via admin panel
      email: 'budi@desaparakanciomas.id',
      telp: '081312345678',
    },
    {
      id: 4,
      nama: 'Rina Kartika, S.Sos',
      jabatan: 'Kasi Pelayanan',
      nip: '19900320 201705 2 001',
      rank: 4,
      foto: '', // KOSONGKAN - Anda bisa isi via admin panel
      email: 'rina@desaparakanciomas.id',
      telp: '081398765432',
    },
    {
      id: 5,
      nama: 'Dedi Suryanto, S.Pd',
      jabatan: 'Kaur Pembangunan',
      nip: '19860725 200801 1 004',
      rank: 5,
      foto: '', // KOSONGKAN - Anda bisa isi via admin panel
      email: 'dedi@desaparakanciomas.id',
      telp: '081456789012',
    },
    {
      id: 6,
      nama: 'Heni Susilowati, S.H',
      jabatan: 'Kaur Tata Usaha',
      nip: '19920410 201705 2 003',
      rank: 6,
      foto: '', // KOSONGKAN - Anda bisa isi via admin panel
      email: 'heni@desaparakanciomas.id',
      telp: '081567890123',
    },
  ],
  berita: [
    {
      id: 1,
      judul: 'Penyaluran Bantuan Sosial dan Pembangunan Jalan Desa',
      tanggal: '2026-07-20',
      kategori: 'Pembangunan',
      penulis: 'Admin Desa',
      isi: 'Pemerintah Desa Parakan Ciomas telah mengalokasikan anggaran infrastruktur untuk pengaspalan jalan utama serta penyaluran bantuan sosial bagi warga penerima manfaat.',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 2,
      judul: 'Pelatihan Kewirausahaan dan Digitalisasi UMKM Desa',
      tanggal: '2026-07-15',
      kategori: 'UMKM',
      penulis: 'Tim Kreatif',
      isi: 'Guna meningkatkan daya saing ekonomi lokal, Pemerintah Desa menyelenggarakan pelatihan pemasaran digital bagi pelaku UMKM di Balai Desa.',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 3,
      judul: 'Gotong Royong Bersih Desa dan Penanaman Pohon',
      tanggal: '2026-07-10',
      kategori: 'Lingkungan',
      penulis: 'Karang Taruna',
      isi: 'Seluruh warga bergotong royong membersihkan lingkungan desa dan menanam 200 pohon untuk menjaga kelestarian alam.',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 4,
      judul: 'Vaksinasi Massal dan Pemeriksaan Kesehatan Gratis',
      tanggal: '2026-07-05',
      kategori: 'Kesehatan',
      penulis: 'Puskesmas Parakan',
      isi: 'Kerjasama dengan Puskesmas setempat menyelenggarakan vaksinasi dan pemeriksaan kesehatan gratis untuk seluruh warga.',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
  ],
  umkm: [
    {
      id: 1,
      nama: 'Keripik Singkong Parakan',
      pemilik: 'Ibu Heni',
      kategori: 'Makanan & Minuman',
      kontak: '081234567890',
      alamat: 'RT 02 / RW 01',
      deskripsi: 'Olahan keripik singkong gurih khas desa dengan aneka varian rasa lezat.',
      status: 'aktif',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 2,
      nama: 'Kerajinan Bambu Ciomas',
      pemilik: 'Pak Maman',
      kategori: 'Kerajinan',
      kontak: '082198765432',
      alamat: 'RT 04 / RW 02',
      deskripsi: 'Produk anyaman bambu tradisional bermutu tinggi untuk hiasan & kebutuhan rumah tangga.',
      status: 'aktif',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 3,
      nama: 'Warung Gudeg Mbak Tini',
      pemilik: 'Ibu Tini',
      kategori: 'Kuliner',
      kontak: '081987654321',
      alamat: 'RT 01 / RW 01',
      deskripsi: 'Gudeg tradisional dengan cita rasa autentik yang sudah terkenal di desa.',
      status: 'aktif',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
    {
      id: 4,
      nama: 'Bengkel Motor Pak Joko',
      pemilik: 'Pak Joko',
      kategori: 'Jasa',
      kontak: '082123456789',
      alamat: 'RT 03 / RW 02',
      deskripsi: 'Layanan service dan perbaikan motor dengan teknisi berpengalaman.',
      status: 'aktif',
      gambar: '', // KOSONGKAN - Anda bisa isi via admin panel
    },
  ],
  laporan: [],
  pengajuanSubmissions: [],
  cctv: [
    { id: 1, lokasi: 'Gerbang Desa', url: '', status: 'aktif' },
    { id: 2, lokasi: 'Balai Desa',   url: '', status: 'aktif' },
    { id: 3, lokasi: 'Pasar Desa',   url: '', status: 'nonaktif' },
  ],
  statistik: {
    totalPenduduk: 3850,
    lakiLaki: 1960,
    perempuan: 1890,
    kk: 1120,
    luasWilayah: 485,
    usia: [
      { label: '0-14 Tahun', value: 850 },
      { label: '15-64 Tahun', value: 2540 },
      { label: '65+ Tahun', value: 460 },
    ],
    pendidikan: [
      { label: 'Tidak Sekolah', value: 120 },
      { label: 'SD / Sederajat', value: 820 },
      { label: 'SMP / Sederajat', value: 1150 },
      { label: 'SMA / SMK', value: 1420 },
      { label: 'Diploma / Sarjana', value: 460 },
    ],
    pekerjaan: [
      { label: 'Petani / Pekebun', value: 950 },
      { label: 'Wiraswasta / UMKM', value: 780 },
      { label: 'Karyawan Swasta', value: 1120 },
      { label: 'PNS / TNI / Polri', value: 240 },
      { label: 'Buruh / Karyawan', value: 420 },
      { label: 'Lainnya', value: 340 },
    ],
    kesehatan: {
      sehat: 3650,
      sakitBiasa: 150,
      sakitKronis: 50,
      balita: 320,
      ibuHamil: 45,
      lansia: 460,
      bpjs: 3400,
      nonBpjs: 450,
    },
    pertumbuhan: [
      { tahun: '2022', jumlah: 3520 },
      { tahun: '2023', jumlah: 3610 },
      { tahun: '2024', jumlah: 3720 },
      { tahun: '2025', jumlah: 3780 },
      { tahun: '2026', jumlah: 3850 },
    ],
    statusSosial: {
      mampu: 2800,
      kurangMampu: 750,
      sangatKurangMampu: 300,
      penerimaBansos: 420,
      fakirMiskin: 80,
    },
    kelengkapanAdmin: {
      ktp: 3200,
      kk: 3100,
      akteLahir: 2400,
      bpjs: 3400,
      nikBaru: 3500,
    },
    rumahIbadat: [
      { nama: 'Masjid Al-Ikhlas', desa: 'RW 01', jumlah: 1 },
      { nama: 'Masjid Baitul Hikmah', desa: 'RW 02', jumlah: 1 },
      { nama: 'Musholla An-Noor', desa: 'RT 02/RW 01', jumlah: 1 },
      { nama: 'Gereja Pentakosta', desa: 'RW 03', jumlah: 1 },
    ],
    infrastruktur: {
      sekolah: 6,
      puskesmas: 1,
      posyandu: 3,
      balaiDesa: 1,
      kantorPol: 1,
      warung: 45,
    },
  },
  pengajuanDokumen: [
    { id: 1, nama: 'Surat Keterangan Domisili', deskripsi: 'Untuk keperluan administratif dan permohonan layanan publik', biaya: 'Gratis', waktuProses: '1 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga', 'Surat pernyataan'], gambar: '' },
    { id: 2, nama: 'Surat Keterangan Usaha', deskripsi: 'Untuk mendaftar UMKM dan keperluan usaha lainnya', biaya: 'Rp 25.000', waktuProses: '2 Hari Kerja', persyaratan: ['KTP', 'Surat keterangan domisili', 'Foto usaha'], gambar: '' },
    { id: 3, nama: 'Surat Keterangan Lulus Keamanan', deskripsi: 'Untuk keperluan lamaran kerja dan kebutuhan lainnya', biaya: 'Gratis', waktuProses: '1 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga'], gambar: '' },
    { id: 4, nama: 'Surat Rekomendasi Sosial', deskripsi: 'Untuk bantuan sosial dan program kesejahteraan', biaya: 'Gratis', waktuProses: '3 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga', 'Surat permohonan'], gambar: '' },
  ],
  petaAset: [
    { id: 1, tipe: 'balai', nama: 'Balai Desa Parakan Ciomas', lat: -6.5621, lng: 106.7831, alamat: 'Jl. Parakan Ciomas', gambar: '', kontak: '(0251) 8345-6789' },
    { id: 2, tipe: 'lapangan', nama: 'Lapangan Olahraga Desa', lat: -6.5625, lng: 106.7825, alamat: 'RT 01 / RW 01', gambar: '', kontak: '' },
    { id: 3, tipe: 'cctv', nama: 'CCTV Gerbang Desa', lat: -6.5619, lng: 106.7829, alamat: 'Gerbang masuk desa', gambar: '', kontak: '' },
    { id: 4, tipe: 'posRonda', nama: 'Pos Ronda RW 01', lat: -6.5623, lng: 106.7830, alamat: 'RT 02 / RW 01', gambar: '', kontak: '081234567890' },
  ],
  dataRW: [
    { id: 1, nama: 'RW 01', rt: ['RT 01', 'RT 02', 'RT 03'], ketua: 'Bapak Suryanto', telp: '081234567890', batas: 'Utara: Jl. Raya, Selatan: Sungai', gambar: '' },
    { id: 2, nama: 'RW 02', rt: ['RT 04', 'RT 05', 'RT 06'], ketua: 'Ibu Siti', telp: '081298765432', batas: 'Utara: Jl. Raya, Selatan: Kebun', gambar: '' },
    { id: 3, nama: 'RW 03', rt: ['RT 07', 'RT 08'], ketua: 'Pak Mahmud', telp: '081356789012', batas: 'Utara: Sawah, Selatan: Hutan', gambar: '' },
  ],
  alarmDarurat: [],
  infoDesa: {
    nama: 'Desa Parakan Ciomas',
    kecamatan: 'Parung Panjang',
    kota: 'Kota Bogor',
    provinsi: 'Jawa Barat',
    kodePos: '16360',
    luas: '485 Ha',
    tahunBerdiri: '1982',
    kepala: 'Drs. H. Ahmad Sudrajat',
    visi: 'Terwujudnya Desa Parakan Ciomas yang Maju, Mandiri, dan Sejahtera.',
    misi: [
      'Meningkatkan kualitas pelayanan publik kepada seluruh warga.',
      'Mengembangkan potensi ekonomi lokal berbasis UMKM dan pertanian.',
      'Membangun infrastruktur desa yang merata dan berkelanjutan.',
      'Meningkatkan kualitas sumber daya manusia melalui pendidikan.',
      'Menjaga keamanan, ketertiban, dan kerukunan warga desa.',
    ],
    sejarah: 'Desa Parakan Ciomas merupakan salah satu desa yang terletak di wilayah Kota Bogor, Jawa Barat. Desa ini memiliki potensi alam yang kaya serta masyarakat yang gotong royong dalam membangun kemajuan bersama.',
    koordinat: { lat: -6.5621, lng: 106.7831 },
    batasDesa: { utara: 'Desa Sukamaju', selatan: 'Desa Parung', timur: 'Desa Ciomas Harapan', barat: 'Desa Cibadak' },
    alamat: 'Jl. Parakan Ciomas, Kota Bogor, Jawa Barat 16360',
    telp: '(0251) 8345-6789',
    email: 'info@desaparakanciomas.id',
    petaStaticUrl: '',
  },
};

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

  // Persist to localStorage on every state change
  useEffect(() => { saveState(state); }, [state]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const DEFAULT_STATISTIK = DEFAULT_STATE.statistik;
