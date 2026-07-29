import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Download, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportCsv } from '../../utils/exportCsv';

const EMPTY = { 
  nik:'', 
  nama:'', 
  jenis_kelamin:'Laki-laki', 
  tanggal_lahir:'', 
  alamat:'', 
  pekerjaan:'', 
  agama:'Islam', 
  pendidikan:'SD', 
  status_perkawinan:'Belum Menikah',
  keterangan:''
};

export default function AdminWarga() {
  const { warga, addWarga, updateWarga, deleteWarga, user } = useApp();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode:'add'|'edit', data }
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const filtered = warga.filter(w =>
    w.nama?.toLowerCase().includes(search.toLowerCase()) ||
    w.nik?.includes(search)
  );

  const openAdd  = () => { setForm(EMPTY); setModal({ mode:'add' }); };
  const openEdit = (w) => { setForm({ ...w }); setModal({ mode:'edit', id: w.id }); };
  const close    = () => setModal(null);

  const handleSave = () => {
    if (!form.nik || !form.nama) return alert('NIK dan Nama wajib diisi.');
    if (modal.mode === 'add') addWarga(form);
    else updateWarga(modal.id, form);
    close();
  };

  const handleDelete = (id) => {
    deleteWarga(id);
    setConfirm(null);
  };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Data Warga</h1>
          <p>Manajemen kependudukan Desa Parakan Ciomas</p>
        </div>
        <div className="adm-head-actions">
          <button className="btn-adm-outline" onClick={() => exportCsv(warga, 'data_warga')}>
            <Download size={15} /> Export CSV
          </button>
          {isAdmin && (
            <button className="btn-adm-primary" onClick={openAdd}>
              <Plus size={15} /> Tambah Warga
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="adm-search-bar">
        <Search size={16} />
        <input placeholder="Cari nama atau NIK..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>NIK</th><th>Nama</th><th>JK</th><th>Pendidikan</th><th>Pekerjaan</th><th>Agama</th><th>Status Perkawinan</th>{isAdmin && <th>Aksi</th>}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 8 : 7} className="adm-empty">Belum ada data warga</td></tr>
            ) : filtered.map(w => (
              <tr key={w.id}>
                <td><small>{w.nik?.substring(0, 8)}...</small></td>
                <td><span className="fw-600">{w.nama}</span></td>
                <td>{w.jenis_kelamin?.charAt(0).toUpperCase()}</td>
                <td>{w.pendidikan}</td>
                <td>{w.pekerjaan}</td>
                <td>{w.agama}</td>
                <td>{w.status_perkawinan}</td>
                {isAdmin && (
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn-edit" onClick={() => openEdit(w)}><Pencil size={14} /></button>
                      <button className="adm-btn-del"  onClick={() => setConfirm(w.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adm-table-footer">Total: <b>{filtered.length}</b> warga</div>

      {/* Modal */}
      {modal && (
        <div className="adm-modal-bg" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h2>{modal.mode === 'add' ? 'Tambah Warga' : 'Edit Warga'}</h2>
              <button onClick={close}><X size={18} /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-grid">
                <div className="adm-form-group full">
                  <label>NIK</label>
                  <input type="text" value={form.nik} onChange={e => setForm({...form, nik: e.target.value})} />
                </div>
                <div className="adm-form-group full">
                  <label>Nama Lengkap</label>
                  <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
                </div>
                <div className="adm-form-group">
                  <label>Jenis Kelamin</label>
                  <select value={form.jenis_kelamin} onChange={e => setForm({...form, jenis_kelamin: e.target.value})}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Tanggal Lahir</label>
                  <input type="date" value={form.tanggal_lahir} onChange={e => setForm({...form, tanggal_lahir: e.target.value})} />
                </div>
                <div className="adm-form-group full">
                  <label>Alamat</label>
                  <input type="text" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
                </div>
                <div className="adm-form-group">
                  <label>Pekerjaan</label>
                  <input type="text" value={form.pekerjaan} onChange={e => setForm({...form, pekerjaan: e.target.value})} />
                </div>
                <div className="adm-form-group">
                  <label>Agama</label>
                  <select value={form.agama} onChange={e => setForm({...form, agama: e.target.value})}>
                    {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Pendidikan</label>
                  <select value={form.pendidikan} onChange={e => setForm({...form, pendidikan: e.target.value})}>
                    {['Tidak Sekolah','SD','SMP','SMA','Diploma','S1','S2','S3'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Status Perkawinan</label>
                  <select value={form.status_perkawinan} onChange={e => setForm({...form, status_perkawinan: e.target.value})}>
                    {['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="adm-form-group full">
                  <label>Keterangan</label>
                  <textarea rows={3} value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="adm-modal-foot">
              <button className="btn-adm-outline" onClick={close}>Batal</button>
              <button className="btn-adm-primary" onClick={handleSave}><Save size={15} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirm && (
        <div className="adm-modal-bg" onClick={() => setConfirm(null)}>
          <div className="adm-confirm" onClick={e => e.stopPropagation()}>
            <button className="adm-confirm-close" onClick={() => setConfirm(null)}><X size={16} /></button>
            <Trash2 size={32} color="#ef4444" />
            <h3>Hapus data warga?</h3>
            <p>Tindakan ini tidak dapat dibatalkan.</p>
            <div className="adm-confirm-btns">
              <button className="btn-adm-outline" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-adm-danger" onClick={() => handleDelete(confirm)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
