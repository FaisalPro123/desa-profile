import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageUploader from '../../components/ImageUploader';

const EMPTY = {
  judul: '',
  ringkasan: '',
  isi: '',
  gambar: '',
  penulis: 'Admin Desa',
  tanggal: '',
  kategori: 'Umum',
};

const KATEGORI = [
  'Umum',
  'Pembangunan',
  'Kesehatan',
  'Pendidikan',
  'UMKM',
  'Sosial',
  'Kegiatan',
];

export default function AdminBerita() {
  const {
    berita,
    addBerita,
    updateBerita,
    deleteBerita,
    user,
  } = useApp();

  const isAdmin = user?.role === 'admin';

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const openAdd = () => {
    setForm({
      ...EMPTY,
      tanggal: new Date().toISOString().slice(0, 10),
    });
    setModal({ mode: 'add' });
  };

  const openEdit = (b) => {
    setForm({ ...b });
    setModal({ mode: 'edit', id: b.id });
  };

  const close = () => setModal(null);

  const handleSave = () => {
    if (!form.judul) {
      alert('Judul wajib diisi.');
      return;
    }

    if (modal.mode === 'add') {
      addBerita(form);
    } else {
      updateBerita(modal.id, form);
    }

    close();
  };

  return (
    <div className="adm-page">

      {/* HEADER */}
      <div className="adm-page-head">
        <div>
          <h1>Manajemen Berita</h1>
          <p>Kelola berita dan pengumuman desa</p>
        </div>

        {isAdmin && (
          <button
            className="btn-adm-primary"
            onClick={openAdd}
          >
            <Plus size={15} />
            Tambah Berita
          </button>
        )}
      </div>

      {/* LIST BERITA */}
      <div className="berita-admin-list">

        {berita.length === 0 ? (
          <div className="dash-empty">
            Belum ada berita.
          </div>
        ) : (
          berita.map((b) => (
            <div
              className="berita-admin-item"
              key={b.id}
            >

              <div className="bai-img">
                <img
                  src={
                    b.gambar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      b.judul
                    )}&background=6366f1&color=fff&size=300`
                  }
                  alt={b.judul}
                />
              </div>

              <div className="bai-body">
                <span className="bai-kat">
                  {b.kategori}
                </span>

                <h3>{b.judul}</h3>

                <p>{b.ringkasan}</p>

                <span className="bai-meta">
                  {b.penulis} · {b.tanggal}
                </span>
              </div>

              {/* ICON EDIT & HAPUS */}
              {isAdmin && (
                <div className="bai-actions">

                  <button
                    onClick={() => openEdit(b)}
                    title="Edit berita"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => setConfirm(b.id)}
                    title="Hapus berita"
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
        <div
          className="adm-modal-bg"
          onClick={close}
        >
          <div
            className="adm-modal wide"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="adm-modal-head">
              <h2>
                {modal.mode === 'add'
                  ? 'Tambah Berita'
                  : 'Edit Berita'}
              </h2>

              <button onClick={close}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">

              <div className="adm-form-grid">

                <div className="adm-form-group full">
                  <label>Judul</label>
                  <input
                    type="text"
                    value={form.judul}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        judul: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="adm-form-group">
                  <label>Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kategori: e.target.value,
                      })
                    }
                  >
                    {KATEGORI.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tanggal: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="adm-form-group">
                  <label>Penulis</label>
                  <input
                    type="text"
                    value={form.penulis}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        penulis: e.target.value,
                      })
                    }
                  />
                </div>

                {/* FOTO */}
                <div className="adm-form-group full">
                  <ImageUploader
                    currentImage={form.gambar}
                    onImageChange={(gambar) =>
                      setForm({
                        ...form,
                        gambar,
                      })
                    }
                    label="Gambar Berita"
                    aspectRatio="16/9"
                    maxWidth={1200}
                    maxHeight={675}
                  />
                </div>

                {/* URL FOTO */}
                <div className="adm-form-group full">
                  <label>URL Gambar</label>

                  <input
                    type="text"
                    placeholder="https://example.com/gambar.jpg"
                    value={
                      form.gambar?.startsWith('http')
                        ? form.gambar
                        : ''
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        gambar: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="adm-form-group full">
                  <label>Ringkasan</label>

                  <input
                    type="text"
                    value={form.ringkasan}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ringkasan: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="adm-form-group full">
                  <label>Isi Berita</label>

                  <textarea
                    rows={5}
                    value={form.isi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isi: e.target.value,
                      })
                    }
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

            <Trash2
              size={32}
              color="#ef4444"
            />

            <h3>
              Hapus berita ini?
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
                  deleteBerita(confirm);
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