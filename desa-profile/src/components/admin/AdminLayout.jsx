import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCog, BarChart2, Newspaper,
  Store, Camera, MessageSquare, LogOut, Menu, X, ChevronRight,
  Building2, FileText, MapPin, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import '../../admin.css';

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',          icon: <LayoutDashboard size={18} /> },
  { to: '/admin/warga',        label: 'Data Warga',         icon: <Users size={18} /> },
  { to: '/admin/aparat',       label: 'Anggota Desa',       icon: <UserCog size={18} /> },
  { to: '/admin/statistik',    label: 'Statistik',          icon: <BarChart2 size={18} /> },
  { to: '/admin/berita',       label: 'Berita',             icon: <Newspaper size={18} /> },
  { to: '/admin/umkm',         label: 'UMKM',               icon: <Store size={18} /> },
  { to: '/admin/laporan',      label: 'Laporan Warga',      icon: <MessageSquare size={18} /> },
  { to: '/admin/cctv',         label: 'CCTV',               icon: <Camera size={18} /> },
  { to: '/admin/pengajuan-dokumen', label: 'Pengajuan Dokumen', icon: <FileText size={18} /> },
  { to: '/admin/peta',         label: 'Kelola Peta',        icon: <MapPin size={18} /> },
  { to: '/admin/settings',     label: 'Pengaturan Data',    icon: <Settings size={18} /> },
];

export default function AdminLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="adm-shell">
      {/* ── SIDEBAR ─────────────────────── */}
      <aside className={`adm-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="adm-sb-top">
          <Building2 size={22} className="adm-sb-logo-icon" />
          <div>
            <div className="adm-sb-title">Parakan Ciomas</div>
            <div className="adm-sb-sub">Admin Portal</div>
          </div>
          <button className="adm-sb-close" onClick={() => setSideOpen(false)}><X size={18} /></button>
        </div>

        <nav className="adm-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `adm-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSideOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={14} className="adm-nav-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="adm-sb-footer">
          <div className="adm-user-info">
            <div className="adm-user-avatar">{user?.name?.[0] ?? 'A'}</div>
            <div>
              <div className="adm-user-name">{user?.name}</div>
              <div className="adm-user-role">{user?.role === 'admin' ? 'Administrator' : 'Viewer'}</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* overlay mobile */}
      {sideOpen && <div className="adm-overlay" onClick={() => setSideOpen(false)} />}

      {/* ── MAIN ────────────────────────── */}
      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-burger" onClick={() => setSideOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="adm-topbar-right">
            <span className="adm-badge-role">{user?.role === 'admin' ? 'Admin' : 'Viewer'}</span>
            <div className="adm-user-avatar sm">{user?.name?.[0] ?? 'A'}</div>
          </div>
        </header>

        <div className="adm-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
