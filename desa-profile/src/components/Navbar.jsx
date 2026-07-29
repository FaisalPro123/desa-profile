import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LogIn, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MENU = [
  { id: 'profil',    label: 'Profil' },
  { id: 'anggota',   label: 'Anggota' },
  { id: 'statistik', label: 'Statistik' },
  { id: 'peta',      label: 'Peta' },
  { id: 'berita',    label: 'Berita' },
  { id: 'umkm',      label: 'UMKM' },
  { id: 'cctv',      label: 'CCTV' },
  { id: 'pengaduan', label: 'Pengaduan' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, theme, toggleTheme } = useApp();
  const location               = useLocation();
  const navigate               = useNavigate();

  const isHome  = location.pathname === '/';
  const isSolid = !isHome || scrolled;

  function gotoSection(id) {
    setOpen(false);
    if (!isHome) {
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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [location, open]);

  return (
    <>
      <nav className={`nb ${isSolid ? 'nb--solid' : ''}`}>
        <div className="nb-inner">
          <Link to="/" className="nb-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Desa Parakan Ciomas
          </Link>

          <div className="nb-mobile-right">
            <button
              className="nb-theme-btn nb-theme-btn--mobile"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="nb-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <ul className={`nb-menu ${open ? 'nb-menu--open' : ''}`}>
            {MENU.map(m => (
              <li key={m.id}>
                <button className="nb-link" onClick={() => gotoSection(m.id)}>{m.label}</button>
              </li>
            ))}
            
            <li className="nb-theme-item">
              <button
                className="nb-theme-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={16} /> <span className="nb-theme-text">Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} /> <span className="nb-theme-text">Mode Gelap</span>
                  </>
                )}
              </button>
            </li>

            <li className="nb-auth">
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'viewer') && (
                    <Link to="/admin/dashboard" className="nb-btn nb-btn--dash" onClick={() => setOpen(false)}>
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                  )}
                  <button className="nb-btn nb-btn--out" onClick={() => { logout(); setOpen(false); }}>
                    <LogOut size={14} /> Keluar
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="nb-btn nb-btn--in" onClick={() => setOpen(false)}>
                  <LogIn size={14} /> Masuk
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {open && <div className="nb-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
