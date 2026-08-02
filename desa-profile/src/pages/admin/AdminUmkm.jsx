import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { exportCsv } from '../../utils/exportCsv';
import ImageUploader from '../../components/ImageUploader';
import PhotoUrlInput from '../../components/PhotoUrlInput';

const EMPTY = {
  nama: '',
  kategori: 'Kuliner',
  deskripsi: '',
  pemilik: '',
  telp: '',
  alamat: '',
  gambar: '',
  status: 'aktif'
};

const KATEGORI = [
  'Kuliner',
  'Kerajinan',
  'Retail',
  'Jasa',
  'Pertanian'
];

const CAT_COLORS = {
  Kuliner: '#f59e0b',
  Kerajinan: '#8b5cf6',
  Retail: '#10b981',
  Jasa: '#3b82f6',
  Pertanian: '#22c55e'
};

export default function AdminUmkm() {
  const {
    umkm,
    addUmkm,
    updateUmkm,
    deleteUmkm,
    user
  } = useApp();

  const isAdmin = user?.role === 'admin';

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const openAdd = () => {
    setForm({ ...EMPTY });
    setModal({ mode: 'add' });
  };

  const openEdit = (u) => {
    setForm({ ...u });
    setModal({
      mode: 'edit',
      id: u.id
    });
  };

  const close = () => {
    setModal(null);
  };

  const handleSave = () => {
    if (!form.nama) {
      alert('Nama UMKM wajib diisi.');
      return;
    }

    if (modal.mode === 'add') {
      addUmkm(form);
    } else {
      updateUmkm(modal.id, form);
    }

    close();
  };

  const toggleStatus = (u) => {
    updateUmkm(u.id, {
      status: u.status === 'aktif'
        ? 'nonaktif'
        : 'aktif'
    });
  };

  return (
    <div className="adm-page">

      {/* HEADER */}
      <div className="adm-page-head">
        <div>
          <h1>Manajemen UMKM</h1>
          <p>Kelola data UMKM Desa Parakan Ciomas</p>
        </div>

        <div className="adm-head-actions">

          <button
            className="btn-adm-outline"
            onClick={() =>
              exportCsv(umkm, 'data_umkm')
            }
          >
            <Download size={18} />
            Export CSV
          </button>

          {isAdmin && (
            <button
              className="btn-adm-primary"
              onClick={openAdd}
            >
              <Plus size={18} />
              Tambah UMKM
            </button>
          )}

        </div>
      </div>

      {/* TABLE */}
      <div className="adm-table-wrap">
        <table className="adm-table">

          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Pemilik</th>
              <th>Telp</th>
              <th>Status</th>

              {isAdmin && (
                <th>Aksi</th>
              )}
            </tr>
          </thead>

          <tbody>

            {umkm.length === 0 ? (

              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="adm-empty"
                >
                  Belum ada data UMKM
                </td>
              </tr>

            ) : (

              umkm.map((u) => (

                <tr key={u.id}>

                  {/* NAMA */}
                  <td>
                    <span className="fw-600">
                      {u.nama}
                    </span>

                    <br />

                    <small className="text-gray">
                      {u.alamat}
                    </small>
                  </td>

                  {/* KATEGORI */}
                  <td>
                    <span
                      className="kat-badge"
                      style={{
                        background: `${
                          CAT_COLORS[u.kategori] ||
                          '#6366f1'
                        }18`,

                        color:
                          CAT_COLORS[u.kategori] ||
                          '#6366f1'
                      }}
                    >
                      {u.kategori}
                    </span>
                  </td>

                  {/* PEMILIK */}
                  <td>
                    {u.pemilik}
                  </td>

                  {/* TELEPON */}
                  <td>
                    {u.telp}
                  </td>

                  {/* STATUS */}
                  <td>

                    {isAdmin ? (

                      <button
                        className={`status-toggle ${u.status}`}
                        onClick={() =>
                          toggleStatus(u)
                        }
                      >

                        {u.status === 'aktif' ? (
                          <>
                            <CheckCircle size={18} />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle size={18} />
                            Nonaktif
                          </>
                        )}

                      </button>

                    ) : (

                      <span
                        className={`status-badge ${
                          u.status === 'aktif'
                            ? 'selesai'
                            : 'baru'
                        }`}
                      >
                        {u.status}
                      </span>

                    )}

                  </td>

                  {/* AKSI */}
                  {isAdmin && (

                    <td>
                      <div
                        className="adm-actions"
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center'
                        }}
                      >

                        {/* EDIT */}
                        <button
                          className="adm-btn-edit"
                          onClick={() =>
                            openEdit(u)
                          }
                          title="Edit UMKM"
                          style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Pencil size={22} strokeWidth={2.5} />
                        </button>

                        {/* HAPUS */}
                        <button
                          className="adm-btn-del"
                          onClick={() =>
                            setConfirm(u.id)
                          }
                          title="Hapus UMKM"
                          style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={22} strokeWidth={2.5} />
                        </button>

                      </div>
                    </td>

                  )}

                </tr>

              ))

            )}

          </tbody>

        </table>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {modal && (

        <div
          className="adm-modal-bg"
          onClick={close}
        >

          <div
            className="adm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="adm-modal-head">

              <h2>
                {modal.mode === 'add'
                  ? 'Tambah UMKM'
                  : 'Edit UMKM'}
              </h2>

              <button onClick={close}>
                <X size={20} />
              </button>

            </div>

            <div className="adm-modal-body">

              <div className="adm-form-grid">

                {/* NAMA */}
                <div className="adm-form-group full">
                  <label>Nama UMKM</label>

                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nama: e.target.value
                      })
                    }
                  />
                </div>

                {/* KATEGORI */}
                <div className="adm-form-group">

                  <label>Kategori</label>

                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kategori: e.target.value
                      })
                    }
                  >
                    {KATEGORI.map((k) => (
                      <option key={k}>
                        {k}
                      </option>
                    ))}
                  </select>

                </div>

                {/* PEMILIK */}
                <div className="adm-form-group">

                  <label>Pemilik</label>

                  <input
                    type="text"
                    value={form.pemilik}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pemilik: e.target.value
                      })
                    }
                  />

                </div>

                {/* TELEPON */}
                <div className="adm-form-group">

                  <label>No. Telepon</label>

                  <input
                    type="text"
                    value={form.telp}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telp: e.target.value
                      })
                    }
                  />

                </div>

                {/* STATUS */}
                <div className="adm-form-group">

                  <label>Status</label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value
                      })
                    }
                  >
                    <option value="aktif">
                      Aktif
                    </option>

                    <option value="nonaktif">
                      Nonaktif
                    </option>
                  </select>

                </div>

                {/* ALAMAT */}
                <div className="adm-form-group full">

                  <label>Alamat</label>

                  <input
                    type="text"
                    value={form.alamat}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        alamat: e.target.value
                      })
                    }
                  />

                </div>

                {/* DESKRIPSI */}
                <div className="adm-form-group full">

                  <label>Deskripsi</label>

                  <textarea
                    rows={3}
                    value={form.deskripsi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        deskripsi: e.target.value
                      })
                    }
                  />

                </div>

                {/* FOTO */}
                <div className="adm-form-group full">

                  <ImageUploader
                    currentImage={form.gambar}
                    onImageChange={(base64) =>
                      setForm({
                        ...form,
                        gambar: base64
                      })
                    }
                    label="Gambar/Logo UMKM"
                    aspectRatio="4/3"
                    maxWidth={1200}
                    maxHeight={900}
                  />

                </div>

                {/* URL FOTO */}
                <div className="adm-form-group full">

                  <PhotoUrlInput
                    value={form.gambar}
                    onChange={(gambar) =>
                      setForm({
                        ...form,
                        gambar: gambar
                      })
                    }
                    label="URL Gambar (gambar langsung)"
                    placeholder="https://contoh.com/logo.jpg"
                  />

                </div>

              </div>

            </div>

            {/* FOOTER MODAL */}
            <div className="adm-modal-foot">

              <button
                className="btn-adm-outline"
                onClick={close}
              >
                Batal
              </button>

              <button
                className="btn-adm-primary"
                onClick={handleSave}
              >
                <Save size={18} />
                Simpan
              </button>

            </div>

          </div>

        </div>

      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {confirm && (

        <div
          className="adm-modal-bg"
          onClick={() =>
            setConfirm(null)
          }
        >

          <div
            className="adm-confirm"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="adm-confirm-close"
              onClick={() =>
                setConfirm(null)
              }
            >
              <X size={20} />
            </button>

            <Trash2
              size={40}
              color="#ef4444"
            />

            <h3>
              Hapus UMKM ini?
            </h3>

            <p>
              Tindakan ini tidak dapat
              dibatalkan.
            </p>

            <div className="adm-confirm-btns">

              <button
                className="btn-adm-outline"
                onClick={() =>
                  setConfirm(null)
                }
              >
                Batal
              </button>

              <button
                className="btn-adm-danger"
                onClick={() => {
                  deleteUmkm(confirm);
                  setConfirm(null);
                }}
              >
                <Trash2 size={18} />
                Hapus
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}