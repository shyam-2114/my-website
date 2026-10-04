import { useMemo, useRef, useState, useCallback } from 'react'
import TabSelector from './TabSelector'
import URLForm from './forms/URLForm'
import TextForm from './forms/TextForm'
import PhoneForm from './forms/PhoneForm'
import EmailForm from './forms/EmailForm'
import WifiForm from './forms/WifiForm'
import VCardForm from './forms/VCardForm'
import ColorPicker from './ColorPicker'
import LogoUpload from './LogoUpload'
import QRPreview from './QRPreview'
import ActionButtons from './ActionButtons'
import ScanVerifier from './ScanVerifier'
import Toast from './Toast'
import { DEFAULT_FORM_DATA, DEFAULT_STYLE } from '../utils/constants'
import { validateByType } from '../utils/validators'
import { buildPayload } from '../utils/qrDataBuilders'

const FORM_COMPONENTS = {
  url: URLForm,
  text: TextForm,
  phone: PhoneForm,
  email: EmailForm,
  wifi: WifiForm,
  vcard: VCardForm,
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
}

export default function QRGeneratorPage() {
  const [activeType, setActiveType] = useState('url')
  const [formData, setFormData] = useState(cloneDefaults)
  const [interacted, setInteracted] = useState({})
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const [toast, setToast] = useState(null)
  const [status, setStatus] = useState({ ready: false, error: false })

  const previewRef = useRef(null)

  const notify = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() })
  }, [])

  const currentData = formData[activeType]
  const validation = useMemo(() => validateByType(activeType, currentData), [activeType, currentData])
  const errors = interacted[activeType] ? validation.errors : {}
  const payload = validation.valid ? buildPayload(activeType, currentData) : ''

  function handleFieldChange(field, value) {
    setInteracted((prev) => ({ ...prev, [activeType]: true }))
    setFormData((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], [field]: value },
    }))
  }

  function handleReset() {
    setFormData(cloneDefaults())
    setInteracted({})
    setStyle(DEFAULT_STYLE)
    setActiveType('url')
    notify('success', 'Everything has been reset.')
  }

  const ActiveForm = FORM_COMPONENTS[activeType]
  const fileNamePrefix = `qr-${activeType}-${Date.now().toString(36).slice(-4)}`
  const hasContent = status.ready && !status.error

  return (
    <div className="page generator-page">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-mark-dot" />
        </div>
        <div>
          <h1>QR Code Generator</h1>
          <p className="page-subtitle">Build, style and share a QR code — right from your browser.</p>
        </div>
      </header>

      <TabSelector activeType={activeType} onSelect={setActiveType} />

      <section className="card">
        <h2 className="card-title">Content</h2>
        <ActiveForm data={currentData} errors={errors} onChange={handleFieldChange} />
      </section>

      <section className="card">
        <h2 className="card-title">Appearance</h2>
        <div className="appearance-grid">
          <ColorPicker
            label="Foreground"
            value={style.fgColor}
            onChange={(v) => setStyle((prev) => ({ ...prev, fgColor: v }))}
          />
          <ColorPicker
            label="Background"
            value={style.bgColor}
            onChange={(v) => setStyle((prev) => ({ ...prev, bgColor: v }))}
          />
        </div>
        <LogoUpload logo={style.logo} onChange={(logo) => setStyle((prev) => ({ ...prev, logo }))} />
      </section>

      <section className="card preview-card">
        <h2 className="card-title">Preview</h2>
        <QRPreview
          ref={previewRef}
          payload={payload}
          fgColor={style.fgColor}
          bgColor={style.bgColor}
          logo={style.logo}
          errorCorrectionLevel={style.errorCorrectionLevel}
          onStatusChange={setStatus}
        />
        <ActionButtons
          previewRef={previewRef}
          hasContent={hasContent}
          fileNamePrefix={fileNamePrefix}
          onReset={handleReset}
          notify={notify}
        />
        <ScanVerifier previewRef={previewRef} hasContent={hasContent} expectedPayload={payload} />
      </section>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
