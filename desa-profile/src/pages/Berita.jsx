import { useState } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, Newspaper, Clock, FileText } from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';

const CAT_COLOR = {
  Umum: '#6366f1', Pembangunan: '#f59e0b', Kesehatan: '#ef4444',
  Pendidikan: '#10b981', UMKM: '#8b5cf6', Sosial: '#06b6d4',
  Kegiatan: '#3b82f6', Pengumuman: '#ec4899', Lingkungan: '#10b981',
};

const Berita = () => {
  const { berita: news } = useApp();
  const [selected, setSelected] = useState(null);

  const fmt = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (selected) {
    const color = CAT_COLOR[selected.kategori || selected.category] || '#6366f1';
    const img = selected.gambar || selected.image || '';
    return (
      <div className="berita-page">
        <PageHeaderPhoto
          badgeIcon={<Newspaper size={14} />}
          title="Berita Desa"
          subtitle="Informasi dan pengumuman terbaru dari desa"
        />
        <div className="page-body">
          <div className="page-container">
            <button className="back-btn" onClick={() => setSelected(null)}>
              <ArrowLeft size={16} /> Kembali ke Berita
            </button>
            <article className="news-art">
              <div className="news-art-img">
                {img ? (
                  <img
                    src={img}
                    alt={selected.judul || selected.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '300px', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '4rem', fontWeight: 800
                  }}>
                    <Newspaper size={80} />
                  </div>
                )}
                <div className="news-art-img-overlay">
                  <span className="nd-tag" style={{ background: color }}>
                    {selected.kategori || selected.category}
                  </span>
                </div>
              </div>
              <div className="news-art-body">
                <h1>{selected.judul || selected.title}</h1>
                <div className="news-art-meta">
                  <span><Calendar size={14} /> {fmt(selected.tanggal || selected.date)}</span>
                  <span><User size={14} /> {selected.penulis || selected.author || 'Admin'}</span>
                  {selected.readTime && <span><Clock size={14} /> {selected.readTime}</span>}
                </div>
                <div className="news-art-content">
                  {(selected.isi || selected.content || selected.ringkasan || selected.excerpt || 'Tidak ada isi berita.')
                    .split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="berita-page">
      <PageHeaderPhoto
        badgeIcon={<Newspaper size={14} />}
        title="Berita Desa"
        subtitle="Informasi dan pengumuman terbaru dari Desa Parakan Ciomas"
      />
      <div className="page-body">
        <div className="page-container">

          {news.length === 0 && (
            <div className="public-empty">
              <FileText size={48} />
              <h3>Belum Ada Berita</h3>
              <p>Berita dan pengumuman akan ditampilkan setelah admin menambahkan.</p>
            </div>
          )}

          <div className="news-grid">
            {news.map(item => {
              const color = CAT_COLOR[item.kategori || item.category] || '#6366f1';
              const img = item.gambar || item.image || '';
              const judul = item.judul || item.title || 'Tanpa Judul';
              const ringkas = item.ringkasan || item.excerpt || item.isi?.slice(0, 120) || '';
              const kat = item.kategori || item.category || 'Umum';
              
              return (
                <article key={item.id} className="news-card" style={{ '--nc': color }}>
                  <div className="news-img-wrap">
                    {img ? (
                      <img
                        src={img}
                        alt={judul}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback icon jika tidak ada foto */}
                    <div style={{
                      display: img ? 'none' : 'flex',
                      position: 'absolute', inset: 0,
                      background: color, alignItems: 'center', justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <Newspaper size={48} />
                    </div>
                    
                    <div className="news-img-overlay"></div>
                    <span className="news-tag" style={{ background: color }}>{kat}</span>
                  </div>
                  <div className="news-body">
                    <h3>{judul}</h3>
                    <p className="news-excerpt">{ringkas}</p>
                    <div className="news-foot">
                      <div className="news-meta">
                        <span><Calendar size={12} /> {fmt(item.tanggal || item.date)}</span>
                      </div>
                      <button className="read-btn" style={{ color }} onClick={() => setSelected(item)}>
                        Baca <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Berita;
