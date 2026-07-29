import InteractiveMap from '../components/InteractiveMap';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { MapPin, ShieldCheck, Info } from 'lucide-react';

const PetaWilayah = () => {
  return (
    <div className="sp-page" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <PageHeaderPhoto
        title="Peta Wilayah Interaktif"
        subtitle="Batas Administrasi RW, Fasilitas Umum, CCTV, dan Infrastruktur Desa Parakan Ciomas"
      />

      <div className="sp-container" style={{ marginTop: '2rem' }}>
        {/* Map Header Card */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--sh-sm)',
          border: '1px solid var(--border-color, rgba(99,102,241,0.12))',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0,229,255,0.15)',
              color: '#00c7be',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Peta Spasial Desa Parakan Ciomas</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                Klik pada marker untuk melihat informasi detail atau gunakan filter kategori di kanan atas peta.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={16} /> Status Wilayah Kondusif
          </div>
        </div>

        {/* Live Interactive Map */}
        <InteractiveMap height="720px" />
      </div>
    </div>
  );
};

export default PetaWilayah;