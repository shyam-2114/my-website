import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']

export default function LogoUpload({ logo, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  function handleFile(file) {
    setError('')
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Use a PNG, JPG, WEBP or SVG image.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large (max 2MB).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.onerror = () => setError('Could not read that image. Try another file.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="logo-upload">
      <span className="field-label">Center logo (optional)</span>
      {logo ? (
        <div className="logo-preview-row">
          <img src={logo} alt="Selected logo preview" className="logo-preview" />
          <div className="logo-preview-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-danger-text"
              onClick={() => {
                onChange(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="logo-dropzone" onClick={() => inputRef.current?.click()}>
          <ImagePlus size={20} strokeWidth={1.75} />
          <span>Add a logo image</span>
          <span className="logo-dropzone-hint">PNG, JPG, WEBP or SVG · up to 2MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="visually-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="field-error">{error}</p>}
      {logo && <p className="field-hint">A high error-correction level is applied automatically so the code still scans with a logo.</p>}
    </div>
  )
}
