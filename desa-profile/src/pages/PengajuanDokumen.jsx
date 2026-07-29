import { FileText, Send, CheckCircle, AlertCircle, Calendar, Phone, User, CreditCard, ChevronDown } from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const PengajuanDokumen = () => {
  const { pengajuanDokumen, infoDesa, addPengajuanSubmission } = useApp();
  const [form, setForm] = useState({
    nama: '', nik: '', telp: '', dokumen: '', keperluan: '', keterangan: ''
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showList, setShowList] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.nik || !form.telp || !form.dokumen || !form.keperluan) {
      setError('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }
    addPengajuanSubmission(form);
    setForm({ nama: '', nik: '', telp: '', dokumen: '', keperluan: '', keterangan: '' });
    setSent(true);
    setError('');
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const selectedDoc = pengajuanDokumen.find(d => d.nama === form.dokumen);

  return (
    <div className="peng-page">
      <PageHeaderPhoto
        badgeIcon={<FileText size={14} />}
        title="Pengajuan Dokumen"
        subtitle="Layanan pengajuan dan penerbitan dokumen resmi desa"
      />

      <div className="page-body">
        <div className="page-container">

          {sent ? (
            <div className="peng-success-box">
              <div className="peng-success-icon">
                <CheckCircle size={56} />
              </div>
              <h2>Pengajuan Berhasil Dikirim!</h2>
              <p>Pengajuan dokumen Anda telah kami terima. Silakan tunggu konfirmasi dari petugas desa atau hubungi kantor desa untuk informasi lebih lanjut.</p>
              <div className="peng-success-actions">
                <button className="peng-btn-primary" onClick={() => setSent(false)}>
                  Ajukan Dokumen Lagi
                </button>
                <a href={`tel:${infoDesa.telp}`} className="peng-btn-outline">
                  <Phone size={16} /> Hubungi Kantor Desa
                </a>
              </div>
            </div>
          ) : (
            <div className="peng-layout">
              {/* Form Section */}
              <div className="peng-form-section">
                <div className="peng-form-header">
                  <h2>Formulir Pengajuan Dokumen</h2>
                  <p>Isi data diri Anda dan pilih jenis dokumen yang ingin diajukan</p>
                </div>

                <form className="peng-form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="peng-error">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div className="peng-form-grid">
                    <div className="peng-field">
                      <label><User size={14} /> Nama Lengkap <span>*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={form.nama}
                        onChange={e => handleChange('nama', e.target.value)}
                        required
                      />
                    </div>

                    <div className="peng-field">
                      <label><CreditCard size={14} /> NIK <span>*</span></label>
                      <input
                        type="text"
                        placeholder="Nomor Induk Kependudukan"
                        value={form.nik}
                        onChange={e => handleChange('nik', e.target.value)}
                        maxLength={16}
                        required
                      />
                    </div>

                    <div className="peng-field">
                      <label><Phone size={14} /> No. Telepon <span>*</span></label>
                      <input
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        value={form.telp}
                        onChange={e => handleChange('telp', e.target.value)}
                        required
                      />
                    </div>

                    <div className="peng-field">
                      <label><FileText size={14} /> Jenis Dokumen <span>*</span></label>
                      <div className="peng-select-wrap">
                        <select
                          value={form.dokumen}
                          onChange={e => handleChange('dokumen', e.target.value)}
                          required
                        >
                          <option value="">Pilih jenis dokumen</option>
                          {pengajuanDokumen.map(doc => (
                            <option key={doc.id} value={doc.nama}>{doc.nama}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="peng-select-icon" />
                      </div>
                    </div>

                    <div className="peng-field full-width">
                      <label><Calendar size={14} /> Keperluan <span>*</span></label>
                      <input
                        type="text"
                        placeholder="Contoh: Kepentingan sekolah, pengajuan pinjaman, dll."
                        value={form.keperluan}
                        onChange={e => handleChange('keperluan', e.target.value)}
                        required
                      />
                    </div>

                    <div className="peng-field full-width">
                      <label>Keterangan Tambahan</label>
                      <textarea
                        rows={4}
                        placeholder="Tambahkan keterangan atau catatan khusus jika diperlukan..."
                        value={form.keterangan}
                        onChange={e => handleChange('keterangan', e.target.value)}
                      />
                    </div>
                  </div>

                  {selectedDoc && (
                    <div className="peng-doc-preview">
                      <h4>Detail Dokumen Dipilih</h4>
                      <div className="peng-doc-preview-grid">
                        <div className="peng-doc-info-item">
                          <span className="peng-doc-label">Biaya</span>
                          <span className="peng-doc-value green">{selectedDoc.biaya}</span>
                        </div>
                        <div className="peng-doc-info-item">
                          <span className="peng-doc-label">Waktu Proses</span>
                          <span className="peng-doc-value amber">{selectedDoc.waktuProses}</span>
                        </div>
                      </div>
                      {selectedDoc.persyaratan && selectedDoc.persyaratan.length > 0 && (
                        <div className="peng-doc-reqs">
                          <strong>Persyaratan:</strong>
                          <ul>
                            {selectedDoc.persyaratan.map((req, i) => (
                              <li key={i}><span className="peng-req-dot" />{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <button type="submit" className="peng-submit-btn">
                    <Send size={18} /> Kirim Pengajuan
                  </button>
                </form>
              </div>

              {/* Info Sidebar */}
              <div className="peng-sidebar">
                <div className="peng-info-card">
                  <h3>Tata Cara Pengajuan</h3>
                  <div className="peng-steps">
                    {[
                      'Isi formulir pengajuan dengan data yang benar.',
                      'Pilih jenis dokumen yang dibutuhkan.',
                      'Siapkan persyaratan yang diperlukan.',
                      'Kirim formulir dan tunggu konfirmasi.',
                      'Ambil dokumen di kantor desa.',
                    ].map((step, i) => (
                      <div className="peng-step" key={i}>
                        <span className="peng-step-num">{i + 1}</span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="peng-info-card">
                  <h3>Jenis Dokumen Tersedia</h3>
                  <div className="peng-doc-list">
                    {pengajuanDokumen.map(doc => (
                      <div className="peng-doc-mini" key={doc.id}>
                        <FileText size={16} />
                        <div>
                          <strong>{doc.nama}</strong>
                          <span>{doc.biaya} &middot; {doc.waktuProses}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="peng-info-card accent">
                  <h3>Butuh Bantuan?</h3>
                  <p>Hubungi kantor desa untuk informasi lebih lanjut.</p>
                  <a href={`tel:${infoDesa.telp}`} className="peng-contact-link">
                    <Phone size={16} /> {infoDesa.telp}
                  </a>
                  <p className="peng-email">{infoDesa.email}</p>
                </div>

                <div className="peng-info-card">
                  <h3>Jam Pelayanan</h3>
                  <div className="peng-jam">
                    <div className="peng-jam-row"><span>Senin - Jumat</span><strong>08:00 - 16:00</strong></div>
                    <div className="peng-jam-row"><span>Sabtu</span><strong>08:00 - 12:00</strong></div>
                    <div className="peng-jam-row closed"><span>Minggu & Libur</span><strong>TUTUP</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengajuanDokumen;
