import { useState } from 'react';
import { Image as ImageIcon, Link2, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function PhotoUrlInput({
  value = '',
  onChange,
  label = 'URL Gambar',
  placeholder = 'https://contoh.com/foto.jpg',
  hint = 'Tempel link GAMBAR langsung (diakhiri .jpg, .png, .webp, atau .gif), bukan link halaman web / hasil pencarian Google.',
}) {
  const [failed, setFailed] = useState(false);

  const isUrl = typeof value === 'string' && value.startsWith('http');

  const handleChange = (e) => {
    setFailed(false);
    onChange(e.target.value);
  };

  const handleClear = () => {
    setFailed(false);
    onChange('');
  };

  return (
    <div className="photo-url-input">
      <label>{label}</label>

      <div className="photo-url-row">
        <span className="photo-url-icon"><Link2 size={16} /></span>
        <input
          type="text"
          placeholder={placeholder}
          value={typeof value === 'string' && value.startsWith('http') ? value : ''}
          onChange={handleChange}
        />
        {isUrl && (
          <button type="button" className="photo-url-clear" onClick={handleClear} title="Hapus link">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Pratinjau */}
      {isUrl && (
        <div className="photo-url-preview">
          <img
            src={value}
            alt="Pratinjau"
            onLoad={() => setFailed(false)}
            onError={() => setFailed(true)}
          />
          <div className="photo-url-status">
            {failed ? (
              <span className="photo-url-msg bad"><AlertTriangle size={14} /> Link tidak valid — bukan gambar. Gambar tidak akan muncul.</span>
            ) : (
              <span className="photo-url-msg good"><CheckCircle size={14} /> Link gambar valid.</span>
            )}
          </div>
        </div>
      )}

      {!isUrl && (
        <div className="photo-url-msg neutral">
          <ImageIcon size={14} />
          {value ? 'Foto saat ini dari file yang diunggah. Kosongkan kolom ini bila memakai upload.' : hint}
        </div>
      )}
    </div>
  );
}

export const photoUrlInputStyles = `
.photo-url-input {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.photo-url-input label {
  font-family: var(--font-heading, 'Inter');
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--dark, #0f172a);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.photo-url-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  background: #fff;
  padding: 0 0.75rem;
  transition: border-color 0.2s;
}
.photo-url-row:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
.photo-url-icon {
  color: #94a3b8;
  display: flex;
}
.photo-url-row input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.7rem 0;
  font-size: 0.9rem;
  color: #172033;
  background: transparent;
}
.photo-url-clear {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.photo-url-clear:hover {
  background: #e2e8f0;
}
.photo-url-preview {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  border: 1px solid #e8ebf2;
  border-radius: 10px;
  padding: 0.6rem;
  background: #f8fafc;
}
.photo-url-preview img {
  width: 96px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
  background: #eef2f7;
}
.photo-url-status {
  display: flex;
  align-items: center;
  flex: 1;
}
.photo-url-msg {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  line-height: 1.4;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
}
.photo-url-msg.good {
  color: #059669;
  background: rgba(16, 185, 129, 0.08);
}
.photo-url-msg.bad {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.08);
}
.photo-url-msg.neutral {
  color: #64748b;
  background: #f1f5f9;
}
`;
