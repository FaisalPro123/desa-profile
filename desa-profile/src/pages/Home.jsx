import {
  ArrowRight, Users, TrendingUp, Building2, Newspaper, MapPin, ChevronDown,
  Landmark, Award, BookOpen, Target, Store, Camera, MessageSquare,
  Navigation, Compass, ExternalLink, Wifi, WifiOff, MonitorOff,
  Send, CheckCircle, AlertCircle, X, ChevronRight, Sprout
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import Statistik from './Statistik';
import heroDesa from '../assets/hero-desa.png';

/* ─── Smooth scroll helper ─── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
}

/* ─── Berita Modal ─── */
function BeritaModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        {item.gambar && (
          <div className="modal-img">
            <img
              src={item.gambar}
              alt={item.judul}
              onError={(e) => {
                e.target.style.display = 'none';
                const wrap = e.target.parentElement;
                if (wrap) wrap.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="modal-content">
          <div className="modal-meta">
            <span className="berita-date-badge">{item.tanggal}</span>
            {item.kategori && <span className="berita-kat-badge">{item.kategori}</span>}
          </div>
          <h2 className="modal-title">{item.judul}</h2>
          <p className="modal-body">{item.isi}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
const Home = () => {
  const { statistik, umkm, berita, infoDesa, aparat, cctv } = useApp();
  const [activeBerita, setActiveBerita] = useState(null);
  const [pengForm, setPengForm] = useState({ nama: '', telp: '', jenis: 'Pengaduan', isi: '' });
  const [pengSent, setPengSent] = useState(false);
  const [pengError, setPengError] = useState('');
  const { addLaporan } = useApp();
  const statsRef = useRef(null);
  const [animated, setAnimated] = useState({ pop: 0, kk: 0, umkmCount: 0, news: 0 });
  const hasAnimated = useRef(false);

  const JENIS_LAPORAN = ['Pengaduan', 'Aspirasi', 'Pertanyaan', 'Laporan Kerusakan', 'Saran'];

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const targets = {
          pop: statistik.totalPenduduk || 0,
          kk: statistik.kk || 0,
          umkmCount: umkm.filter(u => u.status === 'aktif' || !u.status).length,
          news: berita.length,
        };
        let step = 0; const steps = 60; const dur = 2000;
        const t = setInterval(() => {
          step++;
          const e = 1 - Math.pow(1 - step / steps, 3);
          setAnimated({ pop: Math.round(targets.pop * e), kk: Math.round(targets.kk * e), umkmCount: Math.round(targets.umkmCount * e), news: Math.round(targets.news * e) });
          if (step >= steps) {
            clearInterval(t);
            // Set ke nilai final yang akurat
            setAnimated({ pop: targets.pop, kk: targets.kk, umkmCount: targets.umkmCount, news: targets.news });
          }
        }, dur / steps);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const genderData = [
    { name: 'Laki-laki', value: statistik.lakiLaki || 0, color: '#6366f1' },
    { name: 'Perempuan', value: statistik.perempuan || 0, color: '#ec4899' },
  ];
  const pendidikanData = (statistik.pendidikan || []).map((it, i) => ({
    name: it.tingkat || it.label, value: it.jumlah ?? it.value ?? 0,
    color: ['#8b5cf6','#6366f1','#3b82f6','#06b6d4','#10b981','#f59e0b'][i % 6],
  }));
  const pekerjaanData = (statistik.pekerjaan || []).map((it, i) => ({
    name: it.jenis || it.label, value: it.jumlah ?? it.value ?? 0,
    color: ['#f59e0b','#ef4444','#ec4899','#a855f7','#6366f1','#14b8a6'][i % 6],
  }));

  const lat = infoDesa.koordinat?.lat || -6.5621;
  const lng = infoDesa.koordinat?.lng || 106.7831;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.015},${lat-0.015},${lng+0.015},${lat+0.015}&layer=mapnik&marker=${lat},${lng}`;
  const gmapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const handlePengaduan = (e) => {
    e.preventDefault();
    if (!pengForm.nama || !pengForm.telp || !pengForm.isi) { setPengError('Mohon lengkapi semua field.'); return; }
    addLaporan(pengForm);
    setPengForm({ nama: '', telp: '', jenis: 'Pengaduan', isi: '' });
    setPengSent(true); setPengError('');
  };

  return (
    <div className="sp-page">
      {activeBerita && <BeritaModal item={activeBerita} onClose={() => setActiveBerita(null)} />}

      {/* ══════════ HERO ══════════ */}
      <section className="sp-hero" style={{ backgroundImage: `url(${heroDesa})` }}>
        <div className="sp-hero-overlay" />
        <div className="sp-hero-content">
          
          <div className="sp-hero-badge"><Sprout size={14} /> Portal Resmi Pemerintahan Desa</div>
          <h1>Selamat Datang di<br /><span>{infoDesa.nama || 'Desa Parakan Ciomas'}</span></h1>
          <p>{infoDesa.kecamatan}, {infoDesa.kota}, {infoDesa.provinsi}</p>
          <div className="sp-hero-btns">
            <button className="sp-btn-primary" onClick={() => scrollTo('profil')}>
              Lihat Profil <ArrowRight size={16} />
            </button>
            <button className="sp-btn-glass" onClick={() => scrollTo('pengaduan')}>
              <MessageSquare size={16} /> Pengaduan
            </button>
          </div>
        </div>
        <button className="sp-scroll-hint" onClick={() => scrollTo('stats')}>
          <ChevronDown size={28} />
        </button>
      </section>

      {/* ══════════ QUICK STATS ══════════ */}
      <section id="stats" className="sp-stats" ref={statsRef}>
        <div className="sp-container">
          <div className="sp-stats-grid">
            {[
              { n: animated.pop,      l: 'Total Penduduk',   icon: <Users size={22} />,      c: '#6366f1' },
              { n: animated.kk,       l: 'Kepala Keluarga',  icon: <Building2 size={22} />,  c: '#10b981' },
              { n: animated.umkmCount,l: 'UMKM Aktif',       icon: <Store size={22} />,      c: '#f59e0b' },
              { n: animated.news,     l: 'Total Berita',     icon: <Newspaper size={22} />,  c: '#ef4444' },
            ].map((s, i) => (
              <div className="sp-stat-card" key={i} style={{ '--sc': s.c }}>
                <div className="sp-stat-icon" style={{ color: s.c }}>{s.icon}</div>
                <div className="sp-stat-num">{s.n.toLocaleString()}</div>
                <div className="sp-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PROFIL ══════════ */}
      <section id="profil" className="sp-section sp-alt">
        <div className="sp-container">
          <div className="sp-sec-header">
            <span className="sp-badge"><Landmark size={14} /> Tentang Desa</span>
            <h2>Profil Desa</h2>
            <p>Informasi lengkap tentang {infoDesa.nama}</p>
          </div>
          <div className="sp-cards-col">
            {/* Identitas */}
            <div className="sp-card">
              <div className="sp-card-head"><div className="sp-card-ico" style={{background:'#6366f115',color:'#6366f1'}}><Landmark size={18}/></div><h3>Identitas Desa</h3></div>
              <div className="sp-identitas-grid">
                {[
                  ['Nama Desa', infoDesa.nama],
                  ['Kecamatan', infoDesa.kecamatan],
                  ['Kota/Kabupaten', infoDesa.kota],
                  ['Provinsi', infoDesa.provinsi],
                  ['Tahun Berdiri', infoDesa.tahunBerdiri],
                  ['Kepala Desa', infoDesa.kepala],
                  ['Luas Wilayah', infoDesa.luas],
                  ['Kode Pos', infoDesa.kodePos],
                ].map(([l, v]) => (
                  <div className="sp-id-item" key={l}>
                    <span className="sp-id-label">{l}</span>
                    <span className="sp-id-value">{v || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Visi Misi */}
            <div className="sp-card">
              <div className="sp-card-head"><div className="sp-card-ico" style={{background:'#f59e0b15',color:'#f59e0b'}}><Target size={18}/></div><h3>Visi &amp; Misi</h3></div>
              <div className="sp-visi-box">
                <div className="sp-visi-label"><Award size={14}/> Visi</div>
                <p className="sp-visi-text">{infoDesa.visi || '-'}</p>
              </div>
              <div className="sp-misi-list">
                {(infoDesa.misi || []).map((m, i) => (
                  <div className="sp-misi-item" key={i}>
                    <span className="sp-misi-num">{i + 1}</span>
                    <p>{m}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Sejarah */}
            <div className="sp-card">
              <div className="sp-card-head"><div className="sp-card-ico" style={{background:'#10b98115',color:'#10b981'}}><BookOpen size={18}/></div><h3>Sejarah Desa</h3></div>
              <p className="sp-sejarah">{infoDesa.sejarah || '-'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ANGGOTA ══════════ */}
      <section id="anggota" className="sp-section">
        <div className="sp-container">
          <div className="sp-sec-header">
           
            <h2>Perangkat Desa</h2>
            <p>Struktur organisasi pemerintahan {infoDesa.nama}</p>
          </div>
          {aparat.length === 0 ? (
            <div className="sp-empty"><Users size={48}/><p>Data perangkat desa belum tersedia</p><span>Tambahkan melalui dashboard admin</span></div>
          ) : (
            <div className="sp-aparat-grid">
              {aparat.sort((a,b) => (a.rank||99)-(b.rank||99)).map(item => {
                const fotoSrc = item.foto || '';
                return (
                  <div className="sp-aparat-card" key={item.id}>
                    <div className="sp-aparat-photo-wrap">
                      {fotoSrc ? (
                        <img
                          src={fotoSrc}
                          alt={item.nama}
                          className="sp-aparat-photo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const init = e.target.nextSibling;
                            if (init) init.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="sp-aparat-initial" style={{ display: fotoSrc ? 'none' : 'flex' }}>
                        {item.nama?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div className="sp-aparat-gradient-overlay" />
                      <div className="sp-aparat-badge">{item.jabatan}</div>
                    </div>
                    <div className="sp-aparat-info">
                      <h4>{item.nama}</h4>
                      {item.nip && <p className="sp-aparat-nip">NIP: {item.nip}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ STATISTIK ══════════ */}
      <section id="statistik" className="sp-section sp-alt" style={{ padding: '3rem 0' }}>
        <div className="sp-container">
          <Statistik embedded={true} />
        </div>
      </section>

      {/* ══════════ PETA ══════════ */}
      <section id="peta" className="sp-section">
        <div className="sp-container">
          <div className="sp-sec-header">
         
            <h2>Peta Desa Interaktif</h2>
            <p>Peta wilayah administrasi, batas RW, dan fasilitas {infoDesa.nama}</p>
          </div>
          
          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <InteractiveMap height="600px" />
          </div>

          <div className="sp-peta-info" style={{ marginTop: '1rem' }}>
            <div className="sp-peta-card">
              <div className="sp-peta-ico" style={{color:'#10b981',background:'#10b98115'}}><Navigation size={18}/></div>
              <div>
                <h4>Batas Wilayah</h4>
                <div className="sp-batas-grid">
                  {[['Utara',infoDesa.batasDesa?.utara],['Selatan',infoDesa.batasDesa?.selatan],['Timur',infoDesa.batasDesa?.timur],['Barat',infoDesa.batasDesa?.barat]].map(([a,v])=>(
                    <div className="sp-batas-item" key={a}><span>{a}</span><b>{v||'-'}</b></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="sp-peta-card">
              <div className="sp-peta-ico" style={{color:'#6366f1',background:'#6366f115'}}><MapPin size={18}/></div>
              <div>
                <h4>Alamat Kantor</h4>
                <p className="sp-peta-addr">{infoDesa.alamat || '-'}</p>
                {infoDesa.telp && <p className="sp-peta-telp">{infoDesa.telp}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ BERITA ══════════ */}
      <section id="berita" className="sp-section sp-alt">
        <div className="sp-container">
          <div className="sp-sec-header">
            
            <h2>Berita &amp; Pengumuman</h2>
            <p>Informasi terbaru dari pemerintah desa — klik berita untuk membaca</p>
          </div>
          {berita.length === 0 ? (
            <div className="sp-empty"><Newspaper size={48}/><p>Belum ada berita</p><span>Admin desa akan menambahkan berita segera</span></div>
          ) : (
            <div className="sp-berita-grid">
              {berita.map(item => {
                const imgSrc = item.gambar || item.image || '';
                return (
                  <button key={item.id} className="sp-berita-card" onClick={() => setActiveBerita(item)}>
                    <div className="sp-berita-img">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.judul}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        display: imgSrc ? 'none' : 'flex',
                        position: 'absolute', inset: 0,
                        alignItems: 'center', justifyContent: 'center',
                        background: '#6366f1', color: '#fff'
                      }}>
                        <Newspaper size={32} />
                      </div>
                    </div>
                    <div className="sp-berita-body">
                      <div className="sp-berita-meta">
                        <span className="sp-berita-date">{item.tanggal}</span>
                        {item.kategori && <span className="sp-berita-kat">{item.kategori}</span>}
                      </div>
                      <h4>{item.judul}</h4>
                      <p>{item.isi?.substring(0, 100)}{item.isi?.length > 100 ? '...' : ''}</p>
                      <span className="sp-berita-read">Baca selengkapnya <ChevronRight size={14}/></span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ UMKM ══════════ */}
      <section id="umkm" className="sp-section">
        <div className="sp-container">
          <div className="sp-sec-header">
            <h2>UMKM Desa</h2>
            <p>Produk dan layanan dari usaha mikro kecil menengah lokal</p>
          </div>
          {umkm.filter(u=>u.status==='aktif'||!u.status).length === 0 ? (
            <div className="sp-empty"><Store size={48}/><p>Belum ada data UMKM</p><span>Admin desa akan menambahkan UMKM segera</span></div>
          ) : (
            <div className="sp-umkm-grid">
              {umkm.filter(u=>u.status==='aktif'||!u.status).map(item => {
                const imgSrc = item.gambar || item.image || '';
                return (
                  <div className="sp-umkm-card" key={item.id}>
                    <div className="sp-umkm-img">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.nama}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        display: imgSrc ? 'none' : 'flex',
                        position: 'absolute', inset: 0,
                        alignItems: 'center', justifyContent: 'center',
                        background: '#8b5cf6', color: '#fff'
                      }}>
                        <Store size={28} />
                      </div>
                    </div>
                    <div className="sp-umkm-body">
                      <span className="sp-umkm-kat">{item.kategori || 'Umum'}</span>
                      <h4>{item.nama}</h4>
                      <p>{item.deskripsi || '-'}</p>
                      {item.pemilik && <div className="sp-umkm-meta"><Users size={12}/> {item.pemilik}</div>}
                      {(item.kontak || item.telp) && <div className="sp-umkm-meta"><MessageSquare size={12}/> {item.kontak || item.telp}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ CCTV ══════════ */}
      <section id="cctv" className="sp-section sp-alt">
        <div className="sp-container">
          <div className="sp-sec-header">
            <h2>CCTV Live</h2>
            <p>Pemantauan kamera keamanan publik real-time</p>
          </div>
          <div className="sp-cctv-statusbar">
            <Wifi size={15} color="#10b981"/>
            <span><b>{cctv.filter(c=>c.status==='aktif').length}</b> dari <b>{cctv.length}</b> kamera aktif</span>
          </div>
          {cctv.length === 0 ? (
            <div className="sp-empty"><MonitorOff size={48}/><p>Belum ada kamera terdaftar</p><span>Admin desa akan menambahkan CCTV segera</span></div>
          ) : (
            <div className="sp-cctv-grid">
              {cctv.map(cam => (
                <div className="sp-cctv-card" key={cam.id}>
                  <div className={`sp-cctv-screen ${cam.status==='aktif'?'on':'off'}`}>
                    {cam.status==='aktif' ? (
                      <>
                        <div className="sp-cctv-live"><span className="sp-cctv-dot"></span>LIVE</div>
                        {cam.url ? (
                          <img src={cam.url} alt={cam.lokasi} className="sp-cctv-img" onError={e=>{e.target.style.display='none'}}/>
                        ) : (
                          <div className="sp-cctv-nofeed"><Camera size={28}/><span>Feed tidak tersedia</span></div>
                        )}
                      </>
                    ) : (
                      <div className="sp-cctv-offline"><WifiOff size={24}/><span>Offline</span></div>
                    )}
                  </div>
                  <div className="sp-cctv-footer">
                    <span>{cam.lokasi}</span>
                    <span className={`sp-cctv-badge ${cam.status==='aktif'?'on':'off'}`}>
                      {cam.status==='aktif'?'Online':'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="sp-cctv-note">Tayangan memerlukan konfigurasi URL stream dari perangkat kamera. Hubungi admin desa untuk informasi lebih lanjut.</p>
        </div>
      </section>

      {/* ══════════ PENGADUAN ══════════ */}
      <section id="pengaduan" className="sp-section">
        <div className="sp-container">
          <div className="sp-sec-header">

            <h2>Layanan Pengaduan</h2>
            <p>Sampaikan aspirasi dan laporan Anda kepada pemerintah desa</p>
          </div>
          {pengSent ? (
            <div className="sp-peng-success">
              <CheckCircle size={52} color="#10b981"/>
              <h3>Laporan Berhasil Dikirim!</h3>
              <p>Terima kasih. Pengaduan Anda telah kami terima dan akan segera ditindaklanjuti.</p>
              <button className="sp-btn-primary" onClick={() => setPengSent(false)}>Kirim Laporan Lagi</button>
            </div>
          ) : (
            <div className="sp-peng-layout">
              <div className="sp-peng-info">
                <h4>Tata Cara Pengaduan</h4>
                {['Isi formulir dengan data yang benar dan lengkap.','Pilih jenis laporan yang sesuai.','Jelaskan laporan Anda dengan detail.','Laporan diproses dalam 1×24 jam kerja.','Status laporan dapat ditanyakan ke kantor desa.'].map((t,i) => (
                  <div className="sp-peng-step" key={i}>
                    <span className="sp-peng-num">{i+1}</span>
                    <p>{t}</p>
                  </div>
                ))}
                <div className="sp-peng-kontak">
                  <AlertCircle size={14}/>
                  <div>
                    <p>Darurat? Hubungi langsung:</p>
                    <strong>{infoDesa.telp || 'Kantor Desa'}</strong>
                  </div>
                </div>
              </div>
              <form className="sp-peng-form" onSubmit={handlePengaduan}>
                <h4>Formulir Pengaduan</h4>
                {pengError && <div className="sp-peng-error"><AlertCircle size={14}/> {pengError}</div>}
                <div className="sp-field">
                  <label>Nama Lengkap <span>*</span></label>
                  <input type="text" placeholder="Nama Anda" value={pengForm.nama} onChange={e=>setPengForm({...pengForm,nama:e.target.value})} required/>
                </div>
                <div className="sp-field">
                  <label>No. Telepon <span>*</span></label>
                  <input type="tel" placeholder="08xx-xxxx-xxxx" value={pengForm.telp} onChange={e=>setPengForm({...pengForm,telp:e.target.value})} required/>
                </div>
                <div className="sp-field">
                  <label>Jenis Laporan</label>
                  <select value={pengForm.jenis} onChange={e=>setPengForm({...pengForm,jenis:e.target.value})}>
                    {JENIS_LAPORAN.map(j=><option key={j}>{j}</option>)}
                  </select>
                </div>
                <div className="sp-field">
                  <label>Isi Laporan <span>*</span></label>
                  <textarea rows={5} placeholder="Jelaskan laporan atau aspirasi Anda secara detail..." value={pengForm.isi} onChange={e=>setPengForm({...pengForm,isi:e.target.value})} required/>
                </div>
                <button type="submit" className="sp-peng-submit"><Send size={16}/> Kirim Laporan</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ FOOTER STRIP ══════════ */}
      <section className="sp-footer-strip" style={{ backgroundImage: `url(${heroDesa})` }}>
        <div className="sp-footer-overlay"/>
        <div className="sp-container sp-footer-content">
          <h2>Bersama Membangun {infoDesa.nama || 'Desa Parakan Ciomas'}</h2>
          <p>Portal informasi dan layanan desa untuk seluruh masyarakat</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
