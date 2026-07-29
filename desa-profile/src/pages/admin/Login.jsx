import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Lock, Mail, AlertCircle, User, UserPlus, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import '../../admin.css';

export default function Login() {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [tab, setTab]     = useState('login');   
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm]     = useState({ name: '', email: '', password: '', confirm: '' });

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.ok) {
      // admin & viewer → dashboard, user biasa → halaman utama
      if (result.user.role === 'admin' || result.user.role === 'viewer') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  /* ── REGISTER ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!regForm.name || !regForm.email || !regForm.password) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (regForm.password !== regForm.confirm) {
      setError('Password dan konfirmasi tidak sama.');
      return;
    }
    if (regForm.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(regForm.name, regForm.email, regForm.password);
    setLoading(false);
    if (result.ok) {
      // akun baru selalu role 'user' → ke halaman utama
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <ShieldCheck size={28} />
          </div>
          <h1>Portal Admin</h1>
          <p>Desa Parakan Ciomas, Kota Bogor</p>
        </div>

        {/* Tab switcher */}
        <div className="login-tabs">
          <button
            className={`login-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            <LogIn size={15} /> Masuk
          </button>
          <button
            className={`login-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            <UserPlus size={15} /> Daftar
          </button>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="lf-group">
              <label>Email</label>
              <div className="lf-input-wrap">
                <Mail size={16} className="lf-ico" />
                <input
                  type="email"
                  placeholder="email@desaparakanciomas.id"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="lf-group">
              <label>Password</label>
              <div className="lf-input-wrap">
                <Lock size={16} className="lf-ico" />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button type="button" className="lf-eye" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <span className="login-spinner"></span> : <><LogIn size={18} /> Masuk</>}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="login-form">
            <div className="lf-group">
              <label>Nama Lengkap</label>
              <div className="lf-input-wrap">
                <User size={16} className="lf-ico" />
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="lf-group">
              <label>Email</label>
              <div className="lf-input-wrap">
                <Mail size={16} className="lf-ico" />
                <input
                  type="email"
                  placeholder="email@anda.id"
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="lf-group">
              <label>Password</label>
              <div className="lf-input-wrap">
                <Lock size={16} className="lf-ico" />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                  required
                />
                <button type="button" className="lf-eye" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="lf-group">
              <label>Konfirmasi Password</label>
              <div className="lf-input-wrap">
                <Lock size={16} className="lf-ico" />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  value={regForm.confirm}
                  onChange={e => setRegForm({ ...regForm, confirm: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <span className="login-spinner"></span> : <><UserPlus size={18} /> Daftar & Masuk</>}
            </button>
            <p className="reg-note">Akun baru akan dibuat dengan role <strong>User</strong>. Upgrade ke Admin dilakukan oleh super admin.</p>
          </form>
        )}

        {tab === 'login' && (
          <div className="login-hint">
            <p>Demo admin: <code>admin@desaparakanciomas.id</code> / <code>admin123</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
