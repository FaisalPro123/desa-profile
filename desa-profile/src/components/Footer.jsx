import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MENU = [
  { id: 'profil',    label: 'Profil' },
  { id: 'statistik', label: 'Statistik' },
  { id: 'peta',      label: 'Peta' },
  { id: 'berita',    label: 'Berita' },
  { id: 'umkm',      label: 'UMKM' },
  { id: 'cctv',      label: 'CCTV' },
  { id: 'pengaduan', label: 'Pengaduan' },
];

export default function Footer() {
  const { infoDesa } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const d = infoDesa;

  function gotoSection(id) {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
    }
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>{d.nama || 'Desa Parakan Ciomas'}</h3>
            <p>{d.kecamatan ? `${d.kecamatan}, ${d.kota}, ${d.provinsi}` : 'Portal resmi informasi desa'}</p>
            <div className="social-links">
              <a href="#profil" title="Facebook" onClick={(e) => { e.preventDefault(); gotoSection('profil'); }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#profil" title="Instagram" onClick={(e) => { e.preventDefault(); gotoSection('profil'); }}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Menu</h3>
            <ul>
              {MENU.map(m => (
                <li key={m.id}>
                  <button
                    onClick={() => gotoSection(m.id)}
                    style={{background:'none',border:'none',color:'rgba(255,255,255,.7)',padding:0,cursor:'pointer',fontSize:'.9rem',textAlign:'left',font:'inherit'}}
                  >
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3>Kontak</h3>
            <p style={{fontSize:'.9rem',marginBottom:'1rem',color:'rgba(255,255,255,.7)'}}>Alamat:</p>
            <p style={{fontSize:'.9rem',marginBottom:'1.5rem'}}>{d.alamat || '-'}</p>
            <p style={{fontSize:'.9rem',marginBottom:'.5rem',color:'rgba(255,255,255,.7)'}}>Telepon:</p>
            <p style={{fontSize:'.9rem',marginBottom:'1.5rem'}}>{d.telp || '-'}</p>
            <p style={{fontSize:'.9rem',marginBottom:'.5rem',color:'rgba(255,255,255,.7)'}}>Email:</p>
            <p style={{fontSize:'.9rem'}}>{d.email || '-'}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {d.nama}. Hak Cipta Dilindungi.</p>
          <p>Dibangun untuk pelayanan warga yang lebih baik</p>
        </div>
      </div>
    </footer>
  );
}
