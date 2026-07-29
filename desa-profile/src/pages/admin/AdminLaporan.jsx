import { useState } from 'react';
import { MessageSquare, Send, Trash2, Pencil, X, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportCsv } from '../../utils/exportCsv';

export default function AdminLaporan() {
  const { laporan, replyLaporan, deleteLaporan, updateLaporan, user } = useApp();
  const isAdmin = user?.role === 'admin';
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [confirm, setConfirm]   = useState(null);

  const openDetail = (l) => { setSelected(l); setReply(l.balasan || ''); setNewStatus(l.status); };
  const close = () => { setSelected(null); setReply(''); };

  const handleReply = () => {
    if (!reply.trim()) return;
    replyLaporan(selected.id, reply.trim(), newStatus);
    close();
  };

  const handleQuickEditStatus = (e, l) => {
    e.stopPropagation();
    const newSt = l.status === 'baru' ? 'diproses' : l.status === 'diproses' ? 'selesai' : 'baru';
    updateLaporan(l.id, { status: newSt });
  };

  const STATUS_COLOR = { baru:'baru', diproses:'diproses', selesai:'selesai' };
  const STATUS_LABEL = { baru:'Baru', diproses:'Diproses', selesai:'Selesai' };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div><h1>Laporan Warga</h1><p>Kelola pengaduan dan aspirasi warga desa</p></div>
        <button className="btn-adm-outline" onClick={() => exportCsv(laporan, 'data_laporan')}><Download size={15}/> Export CSV</button>
      </div>

      <div className="laporan-list">
        {laporan.length === 0 ? (
          <div className="dash-empty">Belum ada laporan masuk</div>
        ) : laporan.map(l => (
          <div className="laporan-item" key={l.id} onClick={() => openDetail(l)}>
            <div className="lap-ico"><MessageSquare size={20} /></div>
            <div className="lap-body">
              <div className="lap-top">
                <span className="lap-nama">{l.nama}</span>
                <span className={`status-badge ${STATUS_COLOR[l.status]}`}>{STATUS_LABEL[l.status]}</span>
              </div>
              <p className="lap-jenis">{l.jenis}</p>
              <p className="lap-isi">{l.isi?.slice(0, 100)}{l.isi?.length > 100 ? '...' : ''}</p>
              <span className="lap-date">{l.tanggal} · {l.telp}</span>
            </div>
            {isAdmin && (
              <div className="adm-actions" style={{ flexShrink: 0, gap: '6px' }}>
                <button className="adm-btn-edit" title="Ubah Status" onClick={(e) => handleQuickEditStatus(e, l)}>
                  <Pencil size={14} />
                </button>
                <button className="adm-btn-del" title="Hapus Laporan" onClick={(e) => { e.stopPropagation(); setConfirm(l.id); }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {l.balasan && <div className="lap-replied-dot"></div>}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="adm-modal-bg" onClick={close}>
          <div className="adm-modal wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h2>Detail Laporan</h2>
              <button onClick={close}><X size={18} /></button>
            </div>
            <div className="adm-modal-body">
              <div className="lap-detail">
                <div className="lap-detail-row"><span>Pelapor</span><b>{selected.nama}</b></div>
                <div className="lap-detail-row"><span>Telepon</span><b>{selected.telp}</b></div>
                <div className="lap-detail-row"><span>Jenis</span><b>{selected.jenis}</b></div>
                <div className="lap-detail-row"><span>Tanggal</span><b>{selected.tanggal}</b></div>
                <div className="lap-detail-row col"><span>Isi Laporan</span><p>{selected.isi}</p></div>
                {selected.balasan && (
                  <div className="lap-detail-row col replied"><span>Balasan Sebelumnya</span><p>{selected.balasan}</p></div>
                )}
              </div>
              {isAdmin && (
                <div className="lap-reply-form">
                  <div className="adm-form-group">
                    <label>Update Status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      <option value="baru">Baru</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label>Balasan Admin</label>
                    <textarea rows={3} value={reply} onChange={e => setReply(e.target.value)} placeholder="Tulis balasan untuk pelapor..." />
                  </div>
                </div>
              )}
            </div>
            <div className="adm-modal-foot">
              {isAdmin && (
                <button className="btn-adm-danger" onClick={() => { setConfirm(selected.id); close(); }}>
                  <Trash2 size={14} /> Hapus
                </button>
              )}
              <button className="btn-adm-outline" onClick={close}>Tutup</button>
              {isAdmin && (
                <button className="btn-adm-primary" onClick={handleReply}><Send size={15} /> Kirim Balasan</button>
              )}
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="adm-modal-bg" onClick={() => setConfirm(null)}>
          <div className="adm-confirm" onClick={e => e.stopPropagation()}>
            <button className="adm-confirm-close" onClick={() => setConfirm(null)}><X size={16} /></button>
            <Trash2 size={32} color="#ef4444" />
            <h3>Hapus laporan ini?</h3>
            <div className="adm-confirm-btns">
              <button className="btn-adm-outline" onClick={() => setConfirm(null)}>Batal</button>
              <button className="btn-adm-danger" onClick={() => { deleteLaporan(confirm); setConfirm(null); }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
