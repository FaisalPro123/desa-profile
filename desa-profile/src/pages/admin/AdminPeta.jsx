import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageUploader from '../../components/ImageUploader';

const TIPE_ASET = ['balai', 'lapangan', 'cctv', 'posRonda'];

const EMPTY_ASET = {
  tipe: 'balai',
  nama: '',
  lat: -6.5621,
  lng: 106.7831,
  alamat: '',
  gambar: '',
  kontak: ''
};

const EMPTY_RW = {
  nama: '',
  rt: [],
  ketua: '',
  telp: '',
  batas: '',
  gambar: ''
};

export default function AdminPeta() {
  const {
    petaAset,
    dataRW,
    alarmDarurat,
    updatePetaAset,
    updateDataRW,
    deleteAlarmDarurat,
    user
  } = useApp();

  const isAdmin = user?.role === 'admin';

  const [tab, setTab] = useState('aset');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(null);
  const [rtText, setRtText] = useState('');
  const [confirm, setConfirm] = useState(null);

  // =========================
  // ASET
  // =========================

  const openAddAset = () => {
    setForm({ ...EMPTY_ASET });
    setModal({ type: 'aset', mode: 'add' });
  };

  const openEditAset = (item) => {
    setForm({ ...item });
    setModal({
      type: 'aset',
      mode: 'edit',
      id: item.id
    });
  };

  const handleSaveAset = () => {
    if (!form.nama) {
      alert('Nama wajib diisi.');
      return;
    }

    if (modal.mode === 'add') {
      updatePetaAset([
        ...petaAset,
        {
          ...form,
          id: Date.now()
        }
      ]);
    } else {
      updatePetaAset(
        petaAset.map(item =>
          item.id === modal.id
            ? { ...form, id: modal.id }
            : item
        )
      );
    }

    setModal(null);
  };

  const handleDeleteAset = (id) => {
    updatePetaAset(
      petaAset.filter(item => item.id !== id)
    );
    setConfirm(null);
  };

  // =========================
  // RW
  // =========================

  const openAddRW = () => {
    setForm({ ...EMPTY_RW });
    setRtText('');
    setModal({
      type: 'rw',
      mode: 'add'
    });
  };

  const openEditRW = (item) => {
    setForm({ ...item });
    setRtText(
      (item.rt || []).join(', ')
    );

    setModal({
      type: 'rw',
      mode: 'edit',
      id: item.id
    });
  };

  const handleSaveRW = () => {
    if (!form.nama) {
      alert('Nama RW wajib diisi.');
      return;
    }

    const updated = {
      ...form,
      rt: rtText
        .split(',')
        .map(r => r.trim())
        .filter(r => r)
    };

    if (modal.mode === 'add') {
      updateDataRW([
        ...dataRW,
        {
          ...updated,
          id: Date.now()
        }
      ]);
    } else {
      updateDataRW(
        dataRW.map(item =>
          item.id === modal.id
            ? {
                ...updated,
                id: modal.id
              }
            : item
        )
      );
    }

    setModal(null);
  };

  const handleDeleteRW = (id) => {
    updateDataRW(
      dataRW.filter(item => item.id !== id)
    );
    setConfirm(null);
  };

  return (
    <div className="adm-page">

      {/* ================= HEADER ================= */}

      <div className="adm-page-head">
        <div>
          <h1>Kelola Peta Desa</h1>
          <p>
            Atur aset, RW, dan titik alarm darurat desa
          </p>
        </div>
      </div>

      {/* ================= TAB ================= */}

      <div className="adm-tabs">

        <button
          className={`adm-tab ${
            tab === 'aset' ? 'active' : ''
          }`}
          onClick={() => setTab('aset')}
        >
          Aset Desa
        </button>

        <button
          className={`adm-tab ${
            tab === 'rw' ? 'active' : ''
          }`}
          onClick={() => setTab('rw')}
        >
          Data RW
        </button>

        <button
          className={`adm-tab ${
            tab === 'alarm' ? 'active' : ''
          }`}
          onClick={() => setTab('alarm')}
        >
          Alarm Darurat
        </button>

      </div>

      {/* ================= ASET ================= */}

      {tab === 'aset' && (
        <>
          <div className="adm-table-actions">
            {isAdmin && (
              <button
                className="btn-adm-primary"
                onClick={openAddAset}
              >
                <Plus size={18} />
                Tambah Aset
              </button>
            )}
          </div>

          <div className="adm-table-wrap">

            <table className="adm-table">

              <thead>
                <tr>
                  <th>Tipe</th>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Kontak</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>

                {petaAset.length === 0 ? (

                  <tr>
                    <td
                      colSpan={isAdmin ? 5 : 4}
                      className="adm-empty"
                    >
                      Belum ada aset desa
                    </td>
                  </tr>

                ) : (

                  petaAset.map(a => (

                    <tr key={a.id}>

                      <td>
                        <span className="kat-badge">
                          {a.tipe}
                        </span>
                      </td>

                      <td>
                        {a.nama}
                      </td>

                      <td>
                        {a.alamat || '-'}
                      </td>

                      <td>
                        {a.kontak || '-'}
                      </td>

                      {isAdmin && (

                        <td>

                          {/* ICON AKSI */}

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >

                            {/* EDIT */}

                            <button
                              type="button"
                              title="Edit Aset"
                              onClick={() =>
                                openEditAset(a)
                              }
                              style={{
                                width: '42px',
                                height: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#eef2ff',
                                color: '#6366f1',
                                cursor: 'pointer'
                              }}
                            >
                              <Pencil size={22} strokeWidth={2.5} />
                            </button>

                            {/* HAPUS */}

                            <button
                              type="button"
                              title="Hapus Aset"
                              onClick={() =>
                                setConfirm({
                                  type: 'aset',
                                  id: a.id
                                })
                              }
                              style={{
                                width: '42px',
                                height: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#fee2e2',
                                color: '#ef4444',
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
        </>
      )}

      {/* ================= RW ================= */}

      {tab === 'rw' && (
        <>
          <div className="adm-table-actions">

            {isAdmin && (
              <button
                className="btn-adm-primary"
                onClick={openAddRW}
              >
                <Plus size={18} />
                Tambah RW
              </button>
            )}

          </div>

          <div className="adm-table-wrap">

            <table className="adm-table">

              <thead>
                <tr>
                  <th>RW</th>
                  <th>Ketua</th>
                  <th>Telepon</th>
                  <th>RT</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>

              <tbody>

                {dataRW.length === 0 ? (

                  <tr>
                    <td
                      colSpan={isAdmin ? 5 : 4}
                      className="adm-empty"
                    >
                      Belum ada data RW
                    </td>
                  </tr>

                ) : (

                  dataRW.map(rw => (

                    <tr key={rw.id}>

                      <td className="fw-600">
                        {rw.nama}
                      </td>

                      <td>
                        {rw.ketua || '-'}
                      </td>

                      <td>
                        {rw.telp || '-'}
                      </td>

                      <td>
                        {rw.rt &&
                        rw.rt.length > 0
                          ? rw.rt.join(', ')
                          : '-'}
                      </td>

                      {isAdmin && (

                        <td>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >

                            {/* EDIT RW */}

                            <button
                              type="button"
                              title="Edit RW"
                              onClick={() =>
                                openEditRW(rw)
                              }
                              style={{
                                width: '42px',
                                height: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#eef2ff',
                                color: '#6366f1',
                                cursor: 'pointer'
                              }}
                            >
                              <Pencil size={22} strokeWidth={2.5} />
                            </button>

                            {/* HAPUS RW */}

                            <button
                              type="button"
                              title="Hapus RW"
                              onClick={() =>
                                setConfirm({
                                  type: 'rw',
                                  id: rw.id
                                })
                              }
                              style={{
                                width: '42px',
                                height: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                borderRadius: '8px',
                                background: '#fee2e2',
                                color: '#ef4444',
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
        </>
      )}

      {/* ================= ALARM ================= */}

      {tab === 'alarm' && (

        <div className="adm-table-wrap">

          <table className="adm-table">

            <thead>
              <tr>
                <th>Lokasi</th>
                <th>Kontak</th>
                <th>Tanggal Laporan</th>
                {isAdmin && <th>Aksi</th>}
              </tr>
            </thead>

            <tbody>

              {alarmDarurat.length === 0 ? (

                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="adm-empty"
                  >
                    Belum ada alarm darurat
                  </td>
                </tr>

              ) : (

                alarmDarurat.map(a => (

                  <tr key={a.id}>

                    <td>
                      <span className="fw-600">
                        {a.nama}
                      </span>

                      <br />

                      <small className="text-gray">
                        {a.deskripsi}
                      </small>
                    </td>

                    <td>
                      {a.kontak || '-'}
                    </td>

                    <td>
                      {new Date(
                        a.tanggal || Date.now()
                      ).toLocaleString('id-ID')}
                    </td>

                    {isAdmin && (

                      <td>

                        <button
                          type="button"
                          title="Hapus Alarm"
                          onClick={() =>
                            setConfirm({
                              type: 'alarm',
                              id: a.id
                            })
                          }
                          style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#fee2e2',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={22} strokeWidth={2.5} />
                        </button>

                      </td>

                    )}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

      {/* ================= MODAL ASET ================= */}

      {modal?.type === 'aset' && (

        <div
          className="adm-modal-bg"
          onClick={() => setModal(null)}
        >

          <div
            className="adm-modal wide"
            onClick={e => e.stopPropagation()}
          >

            <div className="adm-modal-head">

              <h2>
                <MapPin size={20} />
                {modal.mode === 'add'
                  ? 'Tambah Aset'
                  : 'Edit Aset'}
              </h2>

              <button
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>

            </div>

            <div className="adm-modal-body">

              <div className="adm-form-grid">

                <div className="adm-form-group">

                  <label>
                    Tipe Aset
                  </label>

                  <select
                    value={form.tipe}
                    onChange={e =>
                      setForm({
                        ...form,
                        tipe: e.target.value
                      })
                    }
                  >

                    {TIPE_ASET.map(t => (

                      <option
                        key={t}
                        value={t}
                      >
                        {t === 'balai' && 'Balai Desa'}
                        {t === 'lapangan' && 'Lapangan'}
                        {t === 'cctv' && 'CCTV'}
                        {t === 'posRonda' && 'Pos Ronda'}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="adm-form-group full">

                  <label>
                    Nama Aset
                  </label>

                  <input
                    type="text"
                    value={form.nama}
                    onChange={e =>
                      setForm({
                        ...form,
                        nama: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group">

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="0.0001"
                    value={form.lat}
                    onChange={e =>
                      setForm({
                        ...form,
                        lat: parseFloat(e.target.value)
                      })
                    }
                  />

                </div>

                <div className="adm-form-group">

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="0.0001"
                    value={form.lng}
                    onChange={e =>
                      setForm({
                        ...form,
                        lng: parseFloat(e.target.value)
                      })
                    }
                  />

                </div>

                <div className="adm-form-group full">

                  <label>
                    Alamat
                  </label>

                  <input
                    type="text"
                    value={form.alamat}
                    onChange={e =>
                      setForm({
                        ...form,
                        alamat: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group">

                  <label>
                    Kontak
                  </label>

                  <input
                    type="tel"
                    value={form.kontak}
                    onChange={e =>
                      setForm({
                        ...form,
                        kontak: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group full">

                  <ImageUploader
                    currentImage={form.gambar}
                    onImageChange={base64 =>
                      setForm({
                        ...form,
                        gambar: base64
                      })
                    }
                    label="Gambar Aset (Opsional)"
                    aspectRatio="16/9"
                    maxWidth={1200}
                    maxHeight={675}
                  />

                </div>

              </div>

            </div>

            <div className="adm-modal-foot">

              <button
                className="btn-adm-outline"
                onClick={() => setModal(null)}
              >
                Batal
              </button>

              <button
                className="btn-adm-primary"
                onClick={handleSaveAset}
              >
                <Save size={18} />
                Simpan
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= MODAL RW ================= */}

      {modal?.type === 'rw' && (

        <div
          className="adm-modal-bg"
          onClick={() => setModal(null)}
        >

          <div
            className="adm-modal wide"
            onClick={e => e.stopPropagation()}
          >

            <div className="adm-modal-head">

              <h2>
                <MapPin size={20} />
                {modal.mode === 'add'
                  ? 'Tambah RW'
                  : 'Edit RW'}
              </h2>

              <button
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>

            </div>

            <div className="adm-modal-body">

              <div className="adm-form-grid">

                <div className="adm-form-group full">

                  <label>
                    Nama RW
                  </label>

                  <input
                    type="text"
                    placeholder="RW 01"
                    value={form.nama}
                    onChange={e =>
                      setForm({
                        ...form,
                        nama: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group">

                  <label>
                    Ketua RW
                  </label>

                  <input
                    type="text"
                    value={form.ketua}
                    onChange={e =>
                      setForm({
                        ...form,
                        ketua: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group">

                  <label>
                    Telepon
                  </label>

                  <input
                    type="tel"
                    value={form.telp}
                    onChange={e =>
                      setForm({
                        ...form,
                        telp: e.target.value
                      })
                    }
                  />

                </div>

                <div className="adm-form-group full">

                  <label>
                    RT yang Termasuk
                  </label>

                  <input
                    type="text"
                    placeholder="RT 01, RT 02, RT 03"
                    value={rtText}
                    onChange={e =>
                      setRtText(e.target.value)
                    }
                  />

                </div>

                <div className="adm-form-group full">

                  <label>
                    Batas Wilayah
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Utara: ..., Selatan: ..., Timur: ..., Barat: ..."
                    value={form.batas}
                    onChange={e =>
                      setForm({
                        ...form,
                        batas: e.target.value
                      })
                    }
                  />

                </div>

              </div>

            </div>

            <div className="adm-modal-foot">

              <button
                className="btn-adm-outline"
                onClick={() => setModal(null)}
              >
                Batal
              </button>

              <button
                className="btn-adm-primary"
                onClick={handleSaveRW}
              >
                <Save size={18} />
                Simpan
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= CONFIRM DELETE ================= */}

      {confirm && (

        <div
          className="adm-modal-bg"
          onClick={() => setConfirm(null)}
        >

          <div
            className="adm-confirm"
            onClick={e => e.stopPropagation()}
          >

            <button
              className="adm-confirm-close"
              onClick={() => setConfirm(null)}
            >
              <X size={18} />
            </button>

            <Trash2
              size={40}
              color="#ef4444"
            />

            <h3>
              Hapus item ini?
            </h3>

            <p>
              Data yang dihapus tidak dapat dikembalikan.
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

                  if (confirm.type === 'aset') {
                    handleDeleteAset(confirm.id);
                  }

                  if (confirm.type === 'rw') {
                    handleDeleteRW(confirm.id);
                  }

                  if (confirm.type === 'alarm') {
                    deleteAlarmDarurat(confirm.id);
                    setConfirm(null);
                  }

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