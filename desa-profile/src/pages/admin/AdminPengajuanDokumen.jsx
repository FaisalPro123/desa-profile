import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import ImageUploader from '../../components/ImageUploader';

const EMPTY = {
  nama: '',
  deskripsi: '',
  biaya: '',
  waktuProses: '',
  persyaratan: [],
  gambar: ''
};

const STATUS_MAP = {
  pending: {
    label: 'Menunggu',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,.1)'
  },
  approved: {
    label: 'Disetujui',
    color: '#10b981',
    bg: 'rgba(16,185,129,.1)'
  },
  rejected: {
    label: 'Ditolak',
    color: '#ef4444',
    bg: 'rgba(239,68,68,.1)'
  },
  completed: {
    label: 'Selesai',
    color: '#6366f1',
    bg: 'rgba(99,102,241,.1)'
  }
};

export default function AdminPengajuanDokumen() {
  const {
    pengajuanDokumen,
    updatePengajuanDokumen,
    pengajuanSubmissions,
    updatePengajuanSubmission,
    deletePengajuanSubmission,
    user
  } = useApp();

  const isAdmin = user?.role === 'admin';

  const [tab, setTab] = useState('dokumen');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);
  const [persyaratanText, setPersyaratanText] = useState('');
  const [detailItem, setDetailItem] = useState(null);

  // =========================
  // TAMBAH DOKUMEN
  // =========================
  const openAdd = () => {
    setForm({ ...EMPTY });
    setPersyaratanText('');
    setModal({ mode: 'add' });
  };

  // =========================
  // EDIT DOKUMEN
  // =========================
  const openEdit = (item) => {
    setForm({ ...item });

    setPersyaratanText(
      (item.persyaratan || []).join('\n')
    );

    setModal({
      mode: 'edit',
      id: item.id
    });
  };

  // =========================
  // TUTUP MODAL
  // =========================
  const close = () => {
    setModal(null);
  };

  // =========================
  // SIMPAN DOKUMEN
  // =========================
  const handleSave = () => {
    if (!form.nama || !form.deskripsi) {
      alert('Nama dan Deskripsi wajib diisi.');
      return;
    }

    const updated = {
      ...form,
      persyaratan: persyaratanText
        .split('\n')
        .filter(item => item.trim())
    };

    if (modal.mode === 'add') {
      updatePengajuanDokumen([
        ...pengajuanDokumen,
        {
          ...updated,
          id: Date.now()
        }
      ]);
    } else {
      updatePengajuanDokumen(
        pengajuanDokumen.map(item =>
          item.id === modal.id
            ? updated
            : item
        )
      );
    }

    close();
  };

  // =========================
  // HAPUS DOKUMEN
  // =========================
  const handleDeleteDokumen = (id) => {
    updatePengajuanDokumen(
      pengajuanDokumen.filter(
        item => item.id !== id
      )
    );
  };

  // =========================
  // UBAH STATUS PENGAJUAN
  // =========================
  const handleStatusChange = (
    id,
    status
  ) => {
    updatePengajuanSubmission(
      id,
      { status }
    );
  };

  return (
    <div className="adm-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="adm-page-head">

        <div>
          <h1>Pengajuan Dokumen</h1>

          <p>
            Kelola layanan pengajuan dokumen desa
          </p>
        </div>

      </div>


      {/* =========================
          TAB
      ========================= */}
      <div
        className="adm-tabs"
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}
      >

        <button
          className={`adm-tab ${
            tab === 'dokumen'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setTab('dokumen')
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} />

          Jenis Dokumen
        </button>


        <button
          className={`adm-tab ${
            tab === 'pengajuan'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setTab('pengajuan')
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={18} />

          Pengajuan Masuk (
          {pengajuanSubmissions.length}
          )
        </button>

      </div>


      {/* ==================================================
          TAB JENIS DOKUMEN
      ================================================== */}

      {tab === 'dokumen' && (

        <>

          {/* TOMBOL TAMBAH */}
          <div
            className="adm-table-actions"
            style={{
              marginBottom: '15px'
            }}
          >

            {isAdmin && (

              <button
                className="btn-adm-primary"
                onClick={openAdd}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={18} />

                Tambah Dokumen
              </button>

            )}

          </div>


          {/* TABLE */}
          <div className="adm-table-wrap">

            <table className="adm-table">

              <thead>

                <tr>

                  <th>
                    Nama Dokumen
                  </th>

                  <th>
                    Biaya
                  </th>

                  <th>
                    Waktu Proses
                  </th>

                  <th>
                    Persyaratan
                  </th>

                  {isAdmin && (
                    <th
                      style={{
                        width: '160px',
                        textAlign: 'center'
                      }}
                    >
                      Aksi
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {pengajuanDokumen.length === 0 ? (

                  <tr>

                    <td
                      colSpan={
                        isAdmin ? 5 : 4
                      }
                      className="adm-empty"
                    >
                      Belum ada data dokumen
                    </td>

                  </tr>

                ) : (

                  pengajuanDokumen.map(doc => (

                    <tr key={doc.id}>

                      <td>

                        <span className="fw-600">
                          {doc.nama}
                        </span>

                        <br />

                        <small className="text-gray">
                          {doc.deskripsi}
                        </small>

                      </td>


                      <td>
                        {doc.biaya || '-'}
                      </td>


                      <td>
                        {doc.waktuProses || '-'}
                      </td>


                      <td>

                        <small>

                          {doc.persyaratan?.length > 0
                            ? `${doc.persyaratan.length} item`
                            : '-'
                          }

                        </small>

                      </td>


                      {/* =========================
                          IKON EDIT DAN HAPUS
                      ========================= */}

                      {isAdmin && (

                        <td>

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >

                            {/* EDIT */}

                            <button
                              type="button"
                              title="Edit Dokumen"
                              onClick={() =>
                                openEdit(doc)
                              }
                              style={{
                                width: '46px',
                                height: '46px',
                                border: 'none',
                                borderRadius: '10px',
                                background:
                                  '#eef2ff',
                                color:
                                  '#6366f1',
                                display: 'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                cursor: 'pointer'
                              }}
                            >

                              <Pencil
                                size={22}
                                strokeWidth={2.5}
                              />

                            </button>


                            {/* HAPUS */}

                            <button
                              type="button"
                              title="Hapus Dokumen"
                              onClick={() =>
                                setConfirm({
                                  type: 'dokumen',
                                  id: doc.id
                                })
                              }
                              style={{
                                width: '46px',
                                height: '46px',
                                border: 'none',
                                borderRadius: '10px',
                                background:
                                  '#fee2e2',
                                color:
                                  '#ef4444',
                                display: 'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                cursor: 'pointer'
                              }}
                            >

                              <Trash2
                                size={22}
                                strokeWidth={2.5}
                              />

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


      {/* ==================================================
          TAB PENGAJUAN MASUK
      ================================================== */}

      {tab === 'pengajuan' && (

        <div className="adm-table-wrap">

          <table className="adm-table">

            <thead>

              <tr>

                <th>
                  Pengaju
                </th>

                <th>
                  NIK
                </th>

                <th>
                  Dokumen
                </th>

                <th>
                  Keperluan
                </th>

                <th>
                  Tanggal
                </th>

                <th>
                  Status
                </th>

                {isAdmin && (
                  <th
                    style={{
                      width: '280px',
                      textAlign: 'center'
                    }}
                  >
                    Aksi
                  </th>
                )}

              </tr>

            </thead>


            <tbody>

              {pengajuanSubmissions.length === 0 ? (

                <tr>

                  <td
                    colSpan={
                      isAdmin ? 7 : 6
                    }
                    className="adm-empty"
                  >
                    Belum ada pengajuan masuk
                  </td>

                </tr>

              ) : (

                pengajuanSubmissions.map(
                  sub => {

                    const st =
                      STATUS_MAP[
                        sub.status
                      ] ||
                      STATUS_MAP.pending;

                    return (

                      <tr key={sub.id}>

                        <td>

                          <span className="fw-600">
                            {sub.nama}
                          </span>

                          <br />

                          <small className="text-gray">
                            {sub.telp}
                          </small>

                        </td>


                        <td>
                          <small>
                            {sub.nik}
                          </small>
                        </td>


                        <td>
                          {sub.dokumen}
                        </td>


                        <td>
                          <small>
                            {sub.keperluan}
                          </small>
                        </td>


                        <td>
                          <small>
                            {sub.tanggal}
                          </small>
                        </td>


                        <td>

                          <span
                            style={{
                              padding:
                                '.4rem .8rem',
                              borderRadius:
                                '50px',
                              fontSize:
                                '.75rem',
                              fontWeight: 700,
                              background:
                                st.bg,
                              color:
                                st.color
                            }}
                          >
                            {st.label}
                          </span>

                        </td>


                        {/* AKSI PENGAJUAN */}

                        {isAdmin && (

                          <td>

                            <div
                              style={{
                                display:
                                  'flex',
                                justifyContent:
                                  'center',
                                alignItems:
                                  'center',
                                gap: '8px'
                              }}
                            >

                              {/* DETAIL */}

                              <button
                                type="button"
                                title="Lihat Detail"
                                onClick={() =>
                                  setDetailItem(
                                    sub
                                  )
                                }
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  border: 'none',
                                  borderRadius:
                                    '9px',
                                  background:
                                    '#eef2ff',
                                  color:
                                    '#6366f1',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  cursor:
                                    'pointer'
                                }}
                              >

                                <Eye
                                  size={21}
                                  strokeWidth={2.5}
                                />

                              </button>


                              {/* SETUJUI */}

                              <button
                                type="button"
                                title="Setujui"
                                onClick={() =>
                                  handleStatusChange(
                                    sub.id,
                                    'approved'
                                  )
                                }
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  border: 'none',
                                  borderRadius:
                                    '9px',
                                  background:
                                    '#dcfce7',
                                  color:
                                    '#16a34a',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  cursor:
                                    'pointer'
                                }}
                              >

                                <CheckCircle
                                  size={21}
                                  strokeWidth={2.5}
                                />

                              </button>


                              {/* TOLAK */}

                              <button
                                type="button"
                                title="Tolak"
                                onClick={() =>
                                  handleStatusChange(
                                    sub.id,
                                    'rejected'
                                  )
                                }
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  border: 'none',
                                  borderRadius:
                                    '9px',
                                  background:
                                    '#fee2e2',
                                  color:
                                    '#dc2626',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  cursor:
                                    'pointer'
                                }}
                              >

                                <XCircle
                                  size={21}
                                  strokeWidth={2.5}
                                />

                              </button>


                              {/* HAPUS */}

                              <button
                                type="button"
                                title="Hapus Pengajuan"
                                onClick={() =>
                                  setConfirm({
                                    type: 'sub',
                                    id: sub.id
                                  })
                                }
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  border: 'none',
                                  borderRadius:
                                    '9px',
                                  background:
                                    '#fee2e2',
                                  color:
                                    '#ef4444',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  cursor:
                                    'pointer'
                                }}
                              >

                                <Trash2
                                  size={21}
                                  strokeWidth={2.5}
                                />

                              </button>

                            </div>

                          </td>

                        )}

                      </tr>

                    );

                  }

                )

              )}

            </tbody>

          </table>

        </div>

      )}


      {/* ==================================================
          MODAL DETAIL PENGAJUAN
      ================================================== */}

      {detailItem && (

        <div
          className="adm-modal-bg"
          onClick={() =>
            setDetailItem(null)
          }
        >

          <div
            className="adm-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="adm-modal-head">

              <h2>
                Detail Pengajuan
              </h2>

              <button
                onClick={() =>
                  setDetailItem(null)
                }
              >

                <X size={20} />

              </button>

            </div>


            <div className="adm-modal-body">

              <div className="adm-form-grid">

                {[
                  [
                    'Nama',
                    detailItem.nama
                  ],
                  [
                    'NIK',
                    detailItem.nik
                  ],
                  [
                    'Telepon',
                    detailItem.telp
                  ],
                  [
                    'Jenis Dokumen',
                    detailItem.dokumen
                  ],
                  [
                    'Keperluan',
                    detailItem.keperluan
                  ],
                  [
                    'Tanggal',
                    detailItem.tanggal
                  ],
                  [
                    'Keterangan',
                    detailItem.keterangan ||
                      '-'
                  ]
                ].map(
                  ([label, value]) => (

                    <div
                      className="adm-form-group"
                      key={label}
                    >

                      <label>
                        {label}
                      </label>

                      <p
                        style={{
                          padding: '.7rem',
                          background:
                            '#f8fafc',
                          borderRadius:
                            '8px',
                          fontSize:
                            '.9rem'
                        }}
                      >
                        {value}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="adm-modal-foot">

              <button
                className="btn-adm-outline"
                onClick={() =>
                  setDetailItem(null)
                }
              >
                Tutup
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          MODAL TAMBAH / EDIT DOKUMEN
      ================================================== */}

      {modal && (

        <div
          className="adm-modal-bg"
          onClick={close}
        >

          <div
            className="adm-modal wide"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="adm-modal-head">

              <h2>

                {modal.mode === 'add'
                  ? 'Tambah Dokumen'
                  : 'Edit Dokumen'}

              </h2>

              <button onClick={close}>

                <X size={20} />

              </button>

            </div>


            <div className="adm-modal-body">

              <div className="adm-form-grid">


                {/* NAMA */}

                <div
                  className="adm-form-group full"
                >

                  <label>
                    Nama Dokumen
                  </label>

                  <input
                    type="text"
                    value={form.nama}
                    onChange={e =>
                      setForm({
                        ...form,
                        nama:
                          e.target.value
                      })
                    }
                  />

                </div>


                {/* DESKRIPSI */}

                <div
                  className="adm-form-group full"
                >

                  <label>
                    Deskripsi
                  </label>

                  <textarea
                    rows={3}
                    value={form.deskripsi}
                    onChange={e =>
                      setForm({
                        ...form,
                        deskripsi:
                          e.target.value
                      })
                    }
                  />

                </div>


                {/* BIAYA */}

                <div className="adm-form-group">

                  <label>
                    Biaya
                  </label>

                  <input
                    type="text"
                    placeholder="Rp 25.000 atau Gratis"
                    value={form.biaya}
                    onChange={e =>
                      setForm({
                        ...form,
                        biaya:
                          e.target.value
                      })
                    }
                  />

                </div>


                {/* WAKTU */}

                <div className="adm-form-group">

                  <label>
                    Waktu Proses
                  </label>

                  <input
                    type="text"
                    placeholder="1 Hari Kerja"
                    value={
                      form.waktuProses
                    }
                    onChange={e =>
                      setForm({
                        ...form,
                        waktuProses:
                          e.target.value
                      })
                    }
                  />

                </div>


                {/* PERSYARATAN */}

                <div
                  className="adm-form-group full"
                >

                  <label>
                    Persyaratan
                    (Satu per baris)
                  </label>

                  <textarea
                    rows={4}
                    placeholder={
                      'KTP\nKartu Keluarga\nSurat pernyataan'
                    }
                    value={
                      persyaratanText
                    }
                    onChange={e =>
                      setPersyaratanText(
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* GAMBAR */}

                <div
                  className="adm-form-group full"
                >

                  <ImageUploader
                    currentImage={
                      form.gambar
                    }
                    onImageChange={
                      base64 =>
                        setForm({
                          ...form,
                          gambar:
                            base64
                        })
                    }
                    label="Gambar/Icon Dokumen (Opsional)"
                    aspectRatio="1/1"
                    maxWidth={400}
                    maxHeight={400}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >

                <Save size={18} />

                Simpan

              </button>

            </div>

          </div>

        </div>

      )}


      
      {confirm && (

        <div
          className="adm-modal-bg"
          onClick={() =>
            setConfirm(null)
          }
        >

          <div
            className="adm-confirm"
            onClick={e =>
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
              size={42}
              color="#ef4444"
            />


            <h3>

              {confirm.type === 'sub'
                ? 'Hapus pengajuan ini?'
                : 'Hapus dokumen ini?'}

            </h3>


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

                  if (
                    confirm.type ===
                    'sub'
                  ) {

                    deletePengajuanSubmission(
                      confirm.id
                    );

                  } else {

                    handleDeleteDokumen(
                      confirm.id
                    );

                  }

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