import InteractiveMap from '../components/InteractiveMap';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PetaWilayah = () => {
  const { infoDesa = {} } = useApp();

  return (
    <div className="sp-page" style={{ paddingTop: '75px', paddingBottom: '40px', background: '#090d16', minHeight: '100vh', color: '#fff' }}>
      <PageHeaderPhoto
        title={`Peta Digital ${infoDesa.nama || 'Desa Parakan Ciomas'}`}
        subtitle="Batas Administrasi RW, Fasilitas Umum, CCTV, Titik Alarm Warga, dan Infrastruktur Terintegrasi"
      />

      <div className="sp-container" style={{ marginTop: '1.25rem', padding: '0 1.25rem', maxWidth: '1360px', margin: '1.25rem auto 0 auto' }}>
        {/* Map Sub-header */}
        <div style={{
          background: '#0d1322',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          border: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0,229,255,0.15)',
              color: '#00e5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                Peta Spasial Digital & Alarm Darurat
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Gunakan panel kiri untuk mengatur layer RW, alarm darurat, dan pencarian fasilitas. Klik pin untuk melihat detail info.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(16,185,129,0.15)',
            color: '#34d399',
            padding: '0.35rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '1px solid rgba(52,211,153,0.3)'
          }}>
            <ShieldCheck size={15} /> Status Wilayah Kondusif
          </div>
        </div>

        {/* Live Fixed Interactive Map */}
        <InteractiveMap height="640px" />
      </div>
    </div>
  );
};

export default PetaWilayah;