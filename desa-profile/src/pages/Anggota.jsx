import { Mail, Phone, MapPin, Users, UserX } from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';

const COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
];

// ======================================================
// FOTO ANGGOTA
// GANTI URL DI BAWAH DENGAN LINK GAMBAR KAMU
// ======================================================
const FOTO_ANGGOTA = {
  1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',

  2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',

  3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',

  4: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80',

  5: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',

  6: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
};

const Anggota = () => {
  const { aparat } = useApp();

  const sorted = [...(aparat || [])].sort(
    (a, b) =>
      (a.rank || a.urutan || 99) -
      (b.rank || b.urutan || 99)
  );

  return (
    <div className="anggota-page">

      {/* ================= HEADER ================= */}
      <PageHeaderPhoto
        badgeIcon={<Users size={14} />}
        title="Anggota Desa"
        subtitle="Struktur organisasi perangkat desa Parakan Ciomas"
      />

      {/* ================= BODY ================= */}
      <div className="page-body">
        <div className="page-container">

          {/* ================= DATA KOSONG ================= */}
          {sorted.length === 0 && (
            <div className="public-empty">
              <UserX size={48} />

              <h3>Data Belum Tersedia</h3>

              <p>
                Data anggota desa akan ditampilkan setelah admin menambahkan.
              </p>
            </div>
          )}

          {/* ================= GRID ANGGOTA ================= */}
          <div className="members-grid">

            {sorted.map((m, idx) => {
              const color = COLORS[idx % COLORS.length];

              // Ambil foto berdasarkan ID anggota (prioritas: data → default)
              const foto = (m.foto && m.foto.trim()) ? m.foto : FOTO_ANGGOTA[m.id];

              return (
                <div
                  key={m.id}
                  className="member-card"
                  style={{
                    '--mc': color,
                  }}
                >

                  {/* ================= FOTO ================= */}
                  <div
                    className="member-img-wrap"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >

                    {/* Background */}
                    <div
                      className="member-img-bg"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: color,
                      }}
                    />

                    {/* ================= FOTO ANGGOTA ================= */}
                    {foto ? (
                      <img
                        src={foto}
                        alt={`Foto ${m.nama}`}
                        className="member-img"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          zIndex: 1,
                        }}
                        onError={(e) => {
                          console.error(
                            'Foto gagal dimuat:',
                            m.nama,
                            foto
                          );

                          e.currentTarget.style.display = 'none';

                          const fallback =
                            e.currentTarget.parentElement?.querySelector(
                              '.member-no-photo'
                            );

                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}

                    {/* ================= FALLBACK INISIAL ================= */}
                    <div
                      className="member-no-photo"
                      style={{
                        display: foto ? 'none' : 'flex',
                        position: 'absolute',
                        inset: 0,
                        background: color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '3rem',
                          fontWeight: 800,
                          color: '#fff',
                        }}
                      >
                        {(m.nama || 'A')[0].toUpperCase()}
                      </span>
                    </div>

                    {/* ================= GRADIENT ================= */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />

                    {/* ================= JABATAN ================= */}
                    <span
                      className="member-role-tag"
                      style={{
                        background: color,
                        zIndex: 3,
                      }}
                    >
                      {m.jabatan}
                    </span>

                  </div>

                  {/* ================= INFORMASI ================= */}
                  <div className="member-body">

                    <h3>
                      {m.nama}
                    </h3>

                    <p
                      className="member-pos"
                      style={{
                        color: color,
                      }}
                    >
                      {m.jabatan}
                    </p>

                    <div className="member-sep" />

                    {/* ================= KONTAK ================= */}
                    <div className="member-contacts">

                      {/* EMAIL */}
                      {m.email && (
                        <div className="mc-row">

                          <div
                            className="mc-ico"
                            style={{
                              background: `${color}18`,
                              color: color,
                            }}
                          >
                            <Mail size={14} />
                          </div>

                          <span>
                            {m.email}
                          </span>

                        </div>
                      )}

                      {/* TELEPON */}
                      {m.telp && (
                        <div className="mc-row">

                          <div
                            className="mc-ico"
                            style={{
                              background: `${color}18`,
                              color: color,
                            }}
                          >
                            <Phone size={14} />
                          </div>

                          <span>
                            {m.telp}
                          </span>

                        </div>
                      )}

                      {/* NIP */}
                      {m.nip && (
                        <div className="mc-row">

                          <div
                            className="mc-ico"
                            style={{
                              background: `${color}18`,
                              color: color,
                            }}
                          >
                            <MapPin size={14} />
                          </div>

                          <span>
                            NIP: {m.nip}
                          </span>

                        </div>
                      )}

                    </div>

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

export default Anggota;