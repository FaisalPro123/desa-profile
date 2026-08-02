import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageUploader from '../../components/ImageUploader';
import PhotoUrlInput from '../../components/PhotoUrlInput';

const EMPTY = {
  nama: '',
  jabatan: '',
  nip: '',
  foto: '',
  telp: '',
  email: '',
  urutan: 1,
};

export default function AdminAparat() {
  const {
    aparat,
    addAparat,
    updateAparat,
    deleteAparat,
    user,
  } = useApp();

  const isAdmin = user?.role === 'admin';

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...(aparat || [])].sort(
    (a, b) => (a.urutan || a.rank || 0) - (b.urutan || b.rank || 0)
  );

  const openAdd = () => {
    setForm({ ...EMPTY, urutan: aparat.length + 1 });
    setModal({ mode: 'add' });
  };

  const openEdit = (a) => {
    setForm({ ...a });
    setModal({ mode: 'edit', id: a.id });
  };

  const close = () => setModal(null);

  const handleSave = () => {
    if (!form.nama || !form.jabatan) {
      alert('Nama dan Jabatan wajib diisi.');
      return;
    }

    if (modal.mode === 'add') {
      addAparat(form);
    } else {
      updateAparat(modal.id, form);
    }

    close();
  };

  return (
    <div className="adm-page">

      {/* HEADER */}
      <div className="adm-page-head">
        <div>
          <h1>Anggota Desa</h1>
          <p>Manajemen struktur aparat Desa Parakan Ciomas</p>
        </div>

        {isAdmin && (
          <button className="btn-adm-primary" onClick={openAdd}>
            <Plus size={15} />
            Tambah Aparat
          </button>
        )}
      </div>

      {/* DATA ANGGOTA */}
      <div className="aparat-grid">

        {sorted.length === 0 ? (
          <div className="dash-empty full">
            Belum ada data anggota desa
          </div>
        ) : (
          sorted.map((a) => (
            <div className="aparat-card" key={a.id}>

              <div className="aparat-rank">
                #{a.urutan || a.rank}
              </div>

              <img
                src={
                  a.foto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    a.nama
                  )}&background=6366f1&color=fff&size=120`
                }
                alt={a.nama}
                className="aparat-photo"
              />

              <h3>{a.nama}</h3>

              <p className="aparat-jabatan">
                {a.jabatan}
              </p>

              {a.nip && (
                <p className="aparat-nip">
                  NIP: {a.nip}
                </p>
              )}

              {a.telp && (
                <p className="aparat-info">
                  {a.telp}
                </p>
              )}

              {/* EDIT & HAPUS */}
              {isAdmin && (
                <div className="aparat-actions">

                  <button
                    onClick={() => openEdit(a)}
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => setConfirm(a.id)}
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              )}

            </div>
          ))
        )}

      </div>

      {/* MODAL TAMBAH / EDIT */}
      {modal && (
        <div className="adm-modal-bg" onClick={close}>

          <div
            className="adm-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adm-modal-head">
              <h2>
                {modal.mode === 'add'
                  ? 'Tambah Aparat'
                  : 'Edit Aparat'}
              </h2>

              <button onClick={close}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">

              <div className="adm-form-grid">

                {[
                  ['Nama Lengkap', 'nama'],
                  ['Jabatan', 'jabatan'],
                  ['NIP', 'nip'],
                  ['No. Telepon', 'telp'],
                  ['Email', 'email'],
                ].map(([label, key]) => (
                  <div className="adm-form-group" key={key}>
                    <label>{label}</label>

                    <input
                      value={form[key] || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}

                <div className="adm-form-group">
                  <label>Urutan</label>

                  <input
                    type="number"
                    value={form.urutan}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        urutan: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* UPLOAD FOTO */}
                <div className="adm-form-group full">

                  <ImageUploader
                    currentImage={form.foto}
                    onImageChange={(foto) =>
                      setForm({
                        ...form,
                        foto,
                      })
                    }
                    label="Foto Anggota"
                    aspectRatio="3/4"
                    maxWidth={800}
                    maxHeight={1066}
                  />

                </div>

                {/* URL FOTO */}
                <div className="adm-form-group full">

                  <PhotoUrlInput
                    value={form.foto}
                    onChange={(foto) =>
                      setForm({
                        ...form,
                        foto,
                      })
                    }
                    label="URL Foto (gambar langsung)"
                    placeholder="https://contoh.com/foto.jpg"
                  />

                </div>

              </div>

            </div>

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
                <Save size={15} />
                Simpan
              </button>

            </div>

          </div>

        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {confirm && (
        <div
          className="adm-modal-bg"
          onClick={() => setConfirm(null)}
        >

          <div
            className="adm-confirm"
            onClick={(e) => e.stopPropagation()}
          >

            <Trash2 size={32} color="#ef4444" />

            <h3>
              Hapus aparat?
            </h3>

            <p>
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="adm-confirm-btns">

              <button
                className="btn-adm-outline"
                onClick={() => setConfirm(null)}
              >
                Batal
              </button>

              <button
                className="btn-adm-danger"
                onClick={() => {
                  deleteAparat(confirm);
                  setConfirm(null);
                }}
              >
                Hapus
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}