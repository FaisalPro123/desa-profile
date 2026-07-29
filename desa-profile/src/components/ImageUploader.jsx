import { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { handleImageUpload } from '../utils/imageHandler';


export default function ImageUploader({
  currentImage,
  onImageChange,
  label = 'Upload Gambar',
  maxWidth = 1200,
  maxHeight = 1200,
  aspectRatio = 'auto', 
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const base64 = await handleImageUpload(file, maxWidth, maxHeight);
      setPreview(base64);
      onImageChange(base64);
      setSuccess('Gambar berhasil diunggah!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onImageChange('');
    setError('');
    setSuccess('');
  };

  const getAspectRatioStyle = () => {
    if (aspectRatio === '3/4') return { aspectRatio: '3/4' };
    if (aspectRatio === '16/9') return { aspectRatio: '16/9' };
    if (aspectRatio === '4/3') return { aspectRatio: '4/3' };
    return {};
  };

  return (
    <div className="image-uploader">
      <label className="uploader-label">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="uploader-preview" style={getAspectRatioStyle()}>
          <img src={preview} alt="Preview" />
          <button
            type="button"
            className="uploader-remove-btn"
            onClick={handleRemove}
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="uploader-drop-zone">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            id={`uploader-${Math.random()}`}
            style={{ display: 'none' }}
          />
          <label htmlFor={`uploader-${Math.random()}`} className="uploader-drop-label">
            <Upload size={28} />
            <span>Click atau drag gambar di sini</span>
            <small>JPG, PNG, WebP, GIF (Max 5MB)</small>
            {uploading && <div className="uploader-loading">Mengunggah...</div>}
          </label>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="uploader-message error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="uploader-message success">
          <Check size={16} />
          {success}
        </div>
      )}

      {/* Edit Button */}
      {preview && (
        <div className="uploader-actions">
          <label htmlFor={`uploader-edit-${Math.random()}`} className="uploader-edit-btn">
            Ubah Gambar
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            id={`uploader-edit-${Math.random()}`}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Inline styles untuk ImageUploader
 */
export const imageUploaderStyles = `
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.uploader-label {
  font-family: var(--font-heading, 'Inter');
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--dark, #0f172a);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.uploader-preview {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #e0e7ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #c7d2fe;
}

.uploader-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.uploader-remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.uploader-remove-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.uploader-drop-zone {
  position: relative;
}

.uploader-drop-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  border: 2px dashed #c7d2fe;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--dark, #0f172a);
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
}

.uploader-drop-label:hover {
  border-color: #6366f1;
  background: #ede9fe;
  color: #6366f1;
}

.uploader-drop-label small {
  font-size: 0.8rem;
  color: var(--gray-5, #64748b);
  font-weight: 500;
}

.uploader-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.uploader-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.uploader-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.uploader-message.success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.uploader-actions {
  display: flex;
  gap: 0.5rem;
}

.uploader-edit-btn {
  flex: 1;
  padding: 0.75rem 1.25rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-heading, 'Inter');
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  display: block;
  width: 100%;
}

.uploader-edit-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
`;
