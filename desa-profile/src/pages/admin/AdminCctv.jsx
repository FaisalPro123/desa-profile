import { useState } from 'react';
import { Wifi, WifiOff, Save, Plus, Trash2, Pencil, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminCctv() {
  const { cctv, updateCctv, user } = useApp();
  const isAdmin = user?.role === 'admin';
  const [list, setList] = useState([...cctv]);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ lokasi: '', url: '' });

  const toggle = (id) => {
    setList(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'aktif' ? 'nonaktif' : 'aktif' } : c));
  };

  const remove = (id) => setList(prev => prev.filter(c => c.id !== id));

  const add = () => setList(prev => [...prev, { id: Date.now(), lokasi:'Lokasi Baru', url:'', status:'nonaktif' }]);

  const setField = (id, key, val) => setList(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c));

  const startEdit = (cam) => {
    setEditingId(cam.id);
    setEditForm({ lokasi: cam.lokasi, url: cam.url || '' });
  };

  const saveEdit = (id) => {
    setList(prev => prev.map(c => c.id === id ? { ...c, lokasi: editForm.lokasi, url: editForm.url } : c));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleSave = () => {
    updateCctv(list);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Manajemen CCTV</h1><p>Pantau dan kelola kamera keamanan desa</p></div>
        {isAdmin && (
          <div className="adm-head-actions">
            <button className="btn-adm-outline" onClick={add}><Plus size={15}/> Tambah Kamera</button>
            <button className="btn-adm-primary" onClick={handleSave}><Save size={15}/> {saved ? 'Tersimpan!' : 'Simpan'}</button>
          </div>
        )}
      </div>

      <div className="cctv-grid">
        {list.map(cam => (
          <div className="cctv-card" key={cam.id}>
            <div className={`cctv-screen ${cam.status === 'aktif' ? 'on' : 'off'}`}>
              {cam.status === 'aktif' ? (
                <div className="cctv-live-label"><span className="cctv-dot"></span> LIVE</div>
              ) : (
                <div className="cctv-offline-label"><WifiOff size={28}/><span>Kamera Offline</span></div>
              )}
              {cam.url && cam.status === 'aktif' && (
                <img src={cam.url} alt={cam.lokasi} className="cctv-img" />
              )}
            </div>
            <div className="cctv-info">
              {editingId === cam.id && isAdmin ? (
                <input
                  className="cctv-lokasi-input"
                  value={editForm.lokasi}
                  onChange={e => setEditForm({ ...editForm, lokasi: e.target.value })}
                  autoFocus
                />
              ) : (
                <span className="cctv-lokasi">{cam.lokasi}</span>
              )}
              <div className="cctv-actions-row">
                {isAdmin && (
                  <>
                    {editingId === cam.id ? (
                      <>
                        <button className="cctv-toggle on" onClick={() => saveEdit(cam.id)}>
                          <Save size={14}/> Simpan
                        </button>
                        <button className="cctv-toggle off" onClick={cancelEdit}>
                          <X size={14}/> Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="cctv-toggle" onClick={() => startEdit(cam)} title="Edit Kamera">
                          <Pencil size={14}/> Edit
                        </button>
                        <button
                          className={`cctv-toggle ${cam.status === 'aktif' ? 'on' : 'off'}`}
                          onClick={() => toggle(cam.id)}
                          title={cam.status === 'aktif' ? 'Matikan' : 'Nyalakan'}
                        >
                          {cam.status === 'aktif' ? <><Wifi size={14}/> Online</> : <><WifiOff size={14}/> Offline</>}
                        </button>
                        <button className="adm-btn-del sm" onClick={() => remove(cam.id)} title="Hapus Kamera">
                          <Trash2 size={13}/>
                        </button>
                      </>
                    )}
                  </>
                )}
                {!isAdmin && (
                  <span className={`status-badge ${cam.status === 'aktif' ? 'selesai' : 'baru'}`}>
                    {cam.status === 'aktif' ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
              {editingId === cam.id && isAdmin && (
                <input
                  className="cctv-url-input"
                  placeholder="URL stream kamera (opsional)"
                  value={editForm.url}
                  onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="cctv-note">
        Catatan: Integrasi stream kamera nyata memerlukan URL RTSP/HLS dari perangkat CCTV. Masukkan URL stream di masing-masing kamera.
      </p>
    </div>
  );
}
