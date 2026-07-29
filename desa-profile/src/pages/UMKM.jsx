import { useState } from 'react';
import { MapPin, Phone, Store, Tag, User, PackageOpen } from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';

const CAT_COLORS = {
  Kuliner: '#f59e0b',
  Kerajinan: '#8b5cf6',
  Retail: '#10b981',
  Jasa: '#3b82f6',
  Pertanian: '#22c55e',
  'Makanan & Minuman': '#f59e0b',
  all: '#6366f1',
};

const UMKM = () => {
  const { umkm: allUmkm } = useApp();
  const [filter, setFilter] = useState('all');

  const aktif = allUmkm.filter(u => u.status === 'aktif' || !u.status);
  const filtered = filter === 'all' ? aktif : aktif.filter(u => u.kategori === filter);
  
  // Kategori yang digunakan
  const usedCats = ['all', ...new Set(aktif.map(u => u.kategori).filter(Boolean))];
  const categories = ['all', 'Kuliner', 'Makanan & Minuman', 'Kerajinan', 'Retail', 'Jasa', 'Pertanian'];
  const visibleCats = categories.filter(c => usedCats.includes(c));

  return (
    <div className="umkm-page">
      <PageHeaderPhoto
        badgeIcon={<Store size={14} />}
        title="UMKM Desa"
        subtitle="Dukung produk dan layanan lokal dari warga Desa Parakan Ciomas"
      />

      <div className="page-body">
        <div className="page-container">

          {/* Filter pills */}
          <div className="filter-row">
            {visibleCats.map(cat => {
              const color = CAT_COLORS[cat] || '#6366f1';
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  style={isActive ? { background: color, borderColor: color, color: '#fff' } : {}}
                  onClick={() => setFilter(cat)}
                >
                  <Tag size={13} />
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="public-empty">
              <PackageOpen size={48} />
              <h3>Belum Ada UMKM</h3>
              <p>Data UMKM akan ditampilkan setelah admin menambahkan.</p>
            </div>
          )}

          {/* Grid */}
          <div className="umkm-grid">
            {filtered.map(u => {
              const color = CAT_COLORS[u.kategori] || '#6366f1';
              const imgSrc = u.gambar || u.image || '';

              return (
                <div key={u.id} className="umkm-card" style={{ '--uc': color }}>
                  <div className="umkm-img-wrap">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={u.nama || u.name || 'UMKM'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback icon jika tidak ada foto */}
                    <div style={{
                      display: imgSrc ? 'none' : 'flex',
                      position: 'absolute', inset: 0,
                      background: color, alignItems: 'center', justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <Store size={48} />
                    </div>

                    <span className="umkm-tag" style={{ background: color }}>
                      {u.kategori || u.category}
                    </span>
                    <div className="umkm-img-overlay"></div>
                  </div>

                  <div className="umkm-body">
                    <h3>{u.nama || u.name}</h3>
                    <p className="umkm-desc">{u.deskripsi || u.description || '-'}</p>
                    <div className="umkm-meta">
                      <div className="um-row">
                        <div className="um-ico" style={{ color, background: `${color}18` }}>
                          <User size={14} />
                        </div>
                        <span>{u.pemilik || u.owner || '-'}</span>
                      </div>
                      {(u.telp || u.kontak || u.phone) && (
                        <div className="um-row">
                          <div className="um-ico" style={{ color, background: `${color}18` }}>
                            <Phone size={14} />
                          </div>
                          <span>{u.telp || u.kontak || u.phone}</span>
                        </div>
                      )}
                      {(u.alamat || u.address) && (
                        <div className="um-row">
                          <div className="um-ico" style={{ color, background: `${color}18` }}>
                            <MapPin size={14} />
                          </div>
                          <span>{u.alamat || u.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="umkm-foot">
                    {(u.telp || u.kontak || u.phone) ? (
                      <a
                        href={`tel:${u.telp || u.kontak || u.phone}`}
                        className="umkm-cta"
                        style={{ color, textDecoration: 'none' }}
                      >
                        <Phone size={13} /> Hubungi
                      </a>
                    ) : (
                      <span className="umkm-cta" style={{ color: '#94a3b8' }}>
                        <Phone size={13} /> Tidak Ada Kontak
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UMKM;
