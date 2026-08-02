// ═══════════════════════════════════════════════════════════════════
//  DATA DESA PARAKAN CIOMAS — sumber utama seluruh konten website
// ═══════════════════════════════════════════════════════════════════
//
//  SEMUA teks, gambar, dan angka yang tampil di website (halaman user
//  maupun halaman admin) diambil dari file ini.
//
//  CARA MENGUBAH KONTEN:
//  1. Ubah teks / ganti URL gambar di file ini (VS Code).
//  2. Simpan, lalu refresh browser. Data baru otomatis terpakai —
//     TIDAK perlu mengubah DATA_VERSION lagi.
//
//  CATATAN:
//  - Untuk gambar, cukup ganti string URL-nya dengan link GAMBAR
//    LANGSUNG (berakhiran .jpg, .png, .webp, atau .gif). Contoh:
//      foto: 'https://contoh.com/gambar.jpg'
//  - Kalau gambar kosong (''), website memakai gambar default.
//  - Pengeditan lewat halaman admin (upload/link) tersimpan di
//    browser. Saat file ini diubah, perubahan file yang menang.
// ═══════════════════════════════════════════════════════════════════

// (opsional, tidak wajib diubah lagi — sistem signature otomatis)
export const DATA_VERSION = 6;

const SITI_FOTO_URL = new URL('../assets/image.png', import.meta.url).href;

// 100 warga (50 perempuan, 50 laki-laki) — di-generate otomatis
const generateWarga = () => {
  const namaCewe = ['Siti', 'Rini', 'Dewi', 'Nur', 'Ayu', 'Eka', 'Lisa', 'Maya', 'Nita', 'Putri', 'Rina', 'Sinta', 'Tina', 'Vira', 'Wati', 'Yuni', 'Zara', 'Ade', 'Bela', 'Citra', 'Diana', 'Endah', 'Fina', 'Gita', 'Hana', 'Ira', 'Jeni', 'Kiki', 'Lina', 'Mita', 'Nina', 'Ofa', 'Pepi', 'Qori', 'Rani', 'Silvia', 'Tari', 'Uci', 'Vina', 'Windi', 'Xeni', 'Yesi', 'Zeni', 'Alya', 'Bella', 'Cinta', 'Dina', 'Eva', 'Fani', 'Gina', 'Hera'];
  const namaCowo = ['Ahmad', 'Budi', 'Citra', 'Dedi', 'Eka', 'Fajar', 'Gunawan', 'Hendri', 'Indra', 'Joko', 'Karim', 'Luthfi', 'Mahmud', 'Nur', 'Omar', 'Panji', 'Qorri', 'Reza', 'Surya', 'Taufik', 'Udin', 'Vito', 'Wahyu', 'Xander', 'Yusuf', 'Zainul', 'Adi', 'Bambang', 'Cecep', 'Dono', 'Endi', 'Firman', 'Gatot', 'Hasan', 'Ilham', 'Jamal', 'Kanda', 'Lukman', 'Maman', 'Nanang', 'Opang', 'Parto', 'Qahfi', 'Rinto', 'Saiful', 'Toni', 'Usman', 'Veri', 'Wawan', 'Xasri'];
  const namaAkhir = ['Setiawan', 'Wijaya', 'Sutrisno', 'Hermawan', 'Kusuma', 'Hartono', 'Santoso', 'Priyanto', 'Bambang', 'Suryanto', 'Rahmawan', 'Darmawan', 'Handoko', 'Saputra', 'Gunawan', 'Arianto', 'Prasetyo', 'Nugroho', 'Iskandar', 'Rahman', 'Supiyanto', 'Sujono', 'Wibisono', 'Purnomo', 'Syaiful', 'Hasanudin', 'Kasmadi', 'Karjono', 'Kasmudin', 'Kasiran'];

  const warga = [];

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

export const DEFAULT_ACCOUNTS = [
  { id: 1, name: 'Admin Desa', email: 'admin@desaparakanciomas.id', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Petugas',    email: 'petugas@desaparakanciomas.id', password: 'petugas123', role: 'viewer' },
];

export const DEFAULT_STATE = {
  theme: 'light',
  user: null,
  accounts: DEFAULT_ACCOUNTS,
  warga: generateWarga(),

  // ── APARAT DESA (halaman Anggota) ────────────────────────────────
  aparat: [
    {
      id: 1,
      nama: 'Drs. H. Ahmad Sudrajat, M.Si',
      jabatan: 'Kepala Desa',
      nip: '19750812 200212 1 003',
      rank: 1,
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      email: 'ahmad@desaparakanciomas.id',
      telp: '081234567890',
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza, S.AP',
      jabatan: 'Sekretaris Desa',
      nip: '19820415 200801 2 005',
      rank: 2,
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      email: 'siti@desaparakanciomas.id',
      telp: '081298765432',
    },
    {
      id: 3,
      nama: 'Budi Santoso, S.E.',
      jabatan: 'Kaur Keuangan',
      nip: '19881102 201403 1 002',
      rank: 3,
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      email: 'budi@desaparakanciomas.id',
      telp: '081312345678',
    },
    {
      id: 4,
      nama: 'Rina Kartika, S.Sos',
      jabatan: 'Kasi Pelayanan',
      nip: '19900320 201705 2 001',
      rank: 4,
      foto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',
      email: 'rina@desaparakanciomas.id',
      telp: '081398765432',
    },
    {
      id: 5,
      nama: 'Dedi Suryanto, S.Pd',
      jabatan: 'Kaur Pembangunan',
      nip: '19860725 200801 1 004',
      rank: 5,
      foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      email: 'dedi@desaparakanciomas.id',
      telp: '081456789012',
    },
    {
      id: 6,
      nama: 'Heni Susilowati, S.H',
      jabatan: 'Kaur Tata Usaha',
      nip: '19920410 201705 2 003',
      rank: 6,
      foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      email: 'heni@desaparakanciomas.id',
      telp: '081567890123',
    },
  ],

  // ── BERITA / KABAR DESA ──────────────────────────────────────────
  berita: [
    {
      id: 1,
      judul: 'Smart Village Desa Parakan Kecamatan Ciomas Kabupaten Bogor',
      tanggal: '2026-07-20',
      kategori: 'Pembangunan',
      penulis: 'Admin Desa',
      isi: 'Pemerintah Desa Parakan Ciomas telah mengalokasikan anggaran infrastruktur untuk pengaspalan jalan utama serta penyaluran bantuan sosial bagi warga penerima manfaat.',
      gambar: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      judul: 'Pelatihan Kewirausahaan dan Digitalisasi UMKM Desa',
      tanggal: '2026-07-15',
      kategori: 'UMKM',
      penulis: 'Tim Kreatif',
      isi: 'Guna meningkatkan daya saing ekonomi lokal, Pemerintah Desa menyelenggarakan pelatihan pemasaran digital bagi pelaku UMKM di Balai Desa.',
      gambar: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      judul: 'Gotong Royong Bersih Desa dan Penanaman Pohon',
      tanggal: '2026-07-10',
      kategori: 'Lingkungan',
      penulis: 'Karang Taruna',
      isi: 'Seluruh warga bergotong royong membersihkan lingkungan desa dan menanam 200 pohon untuk menjaga kelestarian alam.',
      gambar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      judul: 'Vaksinasi Massal dan Pemeriksaan Kesehatan Gratis',
      tanggal: '2026-07-05',
      kategori: 'Kesehatan',
      penulis: 'Puskesmas Parakan',
      isi: 'Kerjasama dengan Puskesmas setempat menyelenggarakan vaksinasi dan pemeriksaan kesehatan gratis untuk seluruh warga.',
      gambar: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    },
  ],

  // ── UMKM DESA ────────────────────────────────────────────────────
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
      gambar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
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
      gambar: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
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
      gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
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
      gambar: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    },
  ],

  laporan: [],
  pengajuanSubmissions: [],

  // ── CCTV (halaman halaman CCTV) ───────────────────────────────────
  cctv: [
    { id: 1, lokasi: 'Gerbang Desa', url: '', status: 'aktif' },
    { id: 2, lokasi: 'Balai Desa',   url: '', status: 'aktif' },
    { id: 3, lokasi: 'Pasar Desa',   url: '', status: 'nonaktif' },
  ],

  // ── STATISTIK / DATA DEMOGRAFI ───────────────────────────────────
  statistik: {
    totalPenduduk: 13645,
    lakiLaki: 6890,
    perempuan: 6755,
    kk: 4078,
    luasWilayah: 485,
    usia: [
      { label: '0-14 Tahun', value: 2850 },
      { label: '15-64 Tahun', value: 9240 },
      { label: '65+ Tahun', value: 1555 },
    ],
    pendidikan: [
      { label: 'D1 – D3', value: 2592, pct: 19.0 },
      { label: 'SMA / SMK', value: 2415, pct: 17.7 },
      { label: 'SD / Sederajat', value: 2333, pct: 17.1 },
      { label: 'S1 / D4', value: 2074, pct: 15.2 },
      { label: 'SMP / Sederajat', value: 2074, pct: 15.2 },
      { label: 'Belum / Tidak Sekolah', value: 1897, pct: 13.9 },
    ],
    pekerjaan: [
      { label: 'Karyawan Swasta', value: 3465, pct: 25.4 },
      { label: 'Wiraswasta / UMKM', value: 3111, pct: 22.8 },
      { label: 'Petani & Peternak', value: 2524, pct: 18.5 },
      { label: 'Buruh Harian Lepas', value: 1937, pct: 14.2 },
      { label: 'PNS / TNI / Polri', value: 1378, pct: 10.1 },
      { label: 'Jasa & Lainnya', value: 1230, pct: 9.0 },
    ],
    pertumbuhan: [
      { tahun: '2022', jumlah: 8200 },
      { tahun: '2023', jumlah: 9450 },
      { tahun: '2024', jumlah: 10800 },
      { tahun: '2025', jumlah: 12100 },
      { tahun: '2026', jumlah: 13645 },
    ],
    kelahiranKematian: [
      { tahun: '2022', kelahiran: 340, kematian: 130 },
      { tahun: '2023', kelahiran: 370, kematian: 140 },
      { tahun: '2024', kelahiran: 350, kematian: 125 },
      { tahun: '2025', kelahiran: 420, kematian: 160 },
      { tahun: '2026', kelahiran: 310, kematian: 110 },
    ],
    kesehatan: {
      sehat: 12500,
      sakitBiasa: 850,
      sakitKronis: 295,
      balita: 1090,
      ibuHamil: 185,
      lansia: 1555,
      bpjs: 9237,
      nonBpjs: 4408,
    },
    statusSosial: {
      mampu: 9800,
      kurangMampu: 2600,
      sangatKurangMampu: 1245,
      penerimaBansos: 1540,
      fakirMiskin: 320,
    },
    bpjs: {
      mandiriPct: 34.2,
      mandiriJiwa: 4666,
      pbiPct: 33.5,
      pbiJiwa: 4571,
      belumPct: 32.3,
      belumJiwa: 4408,
    },
    agama: {
      islamPct: 92.4,
      kristenPct: 6.3,
      lainnyaPct: 1.3,
    },
    golonganDarah: {
      oPct: 32.1,
      aPct: 25.5,
      bPct: 24.2,
      abPct: 18.2,
    },
    kelengkapanAdmin: {
      ktpPct: 98,
      ktpCount: 13372,
      kkPct: 99,
      kkCount: 4078,
      aktePct: 95,
      akteCount: 12962,
    },
    rumahIbadat: [
      { nama: 'Masjid Al-Ikhlas', desa: 'RW 01', jumlah: 1 },
      { nama: 'Masjid Baitul Hikmah', desa: 'RW 02', jumlah: 1 },
      { nama: 'Musholla An-Noor', desa: 'RT 02/RW 01', jumlah: 1 },
      { nama: 'Gereja Pentakosta', desa: 'RW 03', jumlah: 1 },
    ],
    infrastruktur: {
      sekolah: 12,
      puskesmas: 2,
      posyandu: 8,
      balaiDesa: 1,
      kantorPol: 1,
      warung: 85,
    },
  },

  // ── LAYANAN DOKUMEN ──────────────────────────────────────────────
  pengajuanDokumen: [
    { id: 1, nama: 'Surat Keterangan Domisili', deskripsi: 'Untuk keperluan administratif dan permohonan layanan publik', biaya: 'Gratis', waktuProses: '1 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga', 'Surat pernyataan'], gambar: '' },
    { id: 2, nama: 'Surat Keterangan Usaha', deskripsi: 'Untuk mendaftar UMKM dan keperluan usaha lainnya', biaya: 'Rp 25.000', waktuProses: '2 Hari Kerja', persyaratan: ['KTP', 'Surat keterangan domisili', 'Foto usaha'], gambar: '' },
    { id: 3, nama: 'Surat Keterangan Lulus Keamanan', deskripsi: 'Untuk keperluan lamaran kerja dan kebutuhan lainnya', biaya: 'Gratis', waktuProses: '1 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga'], gambar: '' },
    { id: 4, nama: 'Surat Rekomendasi Sosial', deskripsi: 'Untuk bantuan sosial dan program kesejahteraan', biaya: 'Gratis', waktuProses: '3 Hari Kerja', persyaratan: ['KTP', 'Kartu Keluarga', 'Surat permohonan'], gambar: '' },
  ],

  // ── PETA ASET DESA (Peta Interaktif) ─────────────────────────────
  petaAset: [
    { id: 1, tipe: 'balai', nama: 'Balai Desa Parakan Ciomas', lat: -6.5621, lng: 106.7831, alamat: 'Jl. Parakan Ciomas', gambar: '', kontak: '(0251) 8345-6789' },
    { id: 2, tipe: 'lapangan', nama: 'Lapangan Olahraga Desa', lat: -6.5625, lng: 106.7825, alamat: 'RT 01 / RW 01', gambar: '', kontak: '' },
    { id: 3, tipe: 'cctv', nama: 'CCTV Gerbang Desa', lat: -6.5619, lng: 106.7829, alamat: 'Gerbang masuk desa', gambar: '', kontak: '' },
    { id: 4, tipe: 'posRonda', nama: 'Pos Ronda RW 01', lat: -6.5623, lng: 106.7830, alamat: 'RT 02 / RW 01', gambar: '', kontak: '081234567890' },
  ],

  // ── DATA RW ──────────────────────────────────────────────────────
  dataRW: [
    { id: 1, nama: 'RW 01', rt: ['RT 01', 'RT 02', 'RT 03'], ketua: 'Bapak Suryanto', telp: '081234567890', batas: 'Utara: Jl. Raya, Selatan: Sungai', gambar: '' },
    { id: 2, nama: 'RW 02', rt: ['RT 04', 'RT 05', 'RT 06'], ketua: 'Ibu Siti', telp: '081298765432', batas: 'Utara: Jl. Raya, Selatan: Kebun', gambar: '' },
    { id: 3, nama: 'RW 03', rt: ['RT 07', 'RT 08'], ketua: 'Pak Mahmud', telp: '081356789012', batas: 'Utara: Sawah, Selatan: Hutan', gambar: '' },
  ],

  alarmDarurat: [],

  // ── PROFIL DESA (halaman Profil) ─────────────────────────────────
  infoDesa: {
    nama: 'Desa Parakan Ciomas',
    kecamatan: 'Parung Panjang',
    kota: 'Kota Bogor',
    provinsi: 'Jawa Barat',
    kodePos: '16360',
    luas: '485 Ha',
    tahunBerdiri: '1982',
    kepala: 'Drs. H. Ahmad Sudrajat',
    visi: ' Mewujudkan tata kehidupan masyarakat Desa Parakan yang maju, religius, tertib, dan sejahtera berbasis pelayanan publik yang prima..',
    misi: [
      'Meningkatkan kualitas penyelenggaraan pemerintahan desa yang akuntabel dan transparan.',
      'Mengoptimalkan pembangunan infrastruktur dan fasilitas lingkungan yang tepat sasaran.',
      'Meningkatkan perekonomian serta pemberdayaan potensi lokal warga desa.',
      'Memelihara ketertiban, keamanan, serta nilai-nilai keagamaan dan sosial budaya di tengah masyarakat',
      
    ],
    sejarah: 'Desa Parakan di Kecamatan Ciomas, Kabupaten Bogor, memiliki akar sejarah yang kuat sejak tahun 1885 saat tiga wilayah mandiri—Desa Blimbing, Desa Parakan, dan Desa Cangkring—sepakat melebur menjadi satu kesatuan desa utuh di bawah kepemimpinan kepala desa pertama, Bapak Suradi. Dinamika historis desa ini juga berkelindan erat dengan heroisme lokal kawasan Ciomas dalam perlawanan petani terhadap kolonial Belanda pada tahun 1886, serta diperkaya oleh warisan peradaban klasik seperti situs purbakala Petilasan Taman Sri Bagenda dan Sumur Jalatunda yang disinyalir sebagai tempat peristirahat para bangsawan tempo dulu. Perpaduan antara semangat persatuan, nilai perjuangan, dan kelestarian budaya inilah yang kini menjadi fondasi utama bagi Desa Parakan untuk terus bertumbuh menjadi wilayah yang maju dan modern tanpa kehilangan jati diri luhurnya.',
    koordinat: { lat: -6.5621, lng: 106.7831 },
    batasDesa: { utara: 'Desa Sukamaju', selatan: 'Desa Parung', timur: 'Desa Ciomas Harapan', barat: 'Desa Cibadak' },
    alamat: 'Jl. Parakan Ciomas, Kota Bogor, Jawa Barat 16360',
    telp: '(0251) 8345-6789',
    email: 'info@desaparakanciomas.id',
    petaStaticUrl: '',
  },
};

export const DEFAULT_STATISTIK = DEFAULT_STATE.statistik;

// ─────────────────────────────────────────────────────────────────
//  SIGNATURE OTOMATIS PER-BAGIAN
//  Setiap kali salah satu bagian data di file ini diubah, signature
//  bagian itu ikut berubah. Saat aplikasi dibuka, bagian yang
//  signature-nya beda dengan yang tersimpan di browser otomatis
//  diambil dari file ini — bagian lain yang diubah lewat admin
//  tetap aman. Jadi TIDAK perlu mengubah DATA_VERSION manual.
// ─────────────────────────────────────────────────────────────────
function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

const CONTENT_FIELDS = [
  'aparat',
  'berita',
  'umkm',
  'statistik',
  'infoDesa',
  'pengajuanDokumen',
  'petaAset',
  'dataRW',
  'cctv',
];

export function getFieldSignatures() {
  const sig = {};
  for (const key of CONTENT_FIELDS) {
    sig[key] = hashString(stableStringify(DEFAULT_STATE[key]));
  }
  return sig;
}
