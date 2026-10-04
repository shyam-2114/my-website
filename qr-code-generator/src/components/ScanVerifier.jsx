import { useState } from 'react'
import jsQR from 'jsqr'
import { ScanLine, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'

export default function ScanVerifier({ previewRef, hasContent, expectedPayload }) {
  const [result, setResult] = useState(null) // { ok, decoded, message }
  const [open, setOpen] = useState(false)

  function handleVerify() {
    setOpen(true)
    try {
      const canvas = previewRef.current?.getCanvas()
      if (!canvas) {
        setResult({ ok: false, message: 'No QR code to verify yet.' })
        return
      }

      const ctx = canvas.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (!code) {
        setResult({
          ok: false,
          message:
            'No QR pattern could be detected in the current preview. Try a higher-contrast foreground/background combination.',
        })
        return
      }

      const matches = code.data === expectedPayload
      setResult({
        ok: matches,
        decoded: code.data,
        message: matches
          ? 'This matches exactly what you entered — the code is encoded correctly.'
          : "The decoded content doesn't match what was entered. Please report this.",
      })
    } catch (err) {
      console.error('Scan verification failed:', err)
      setResult({ ok: false, message: 'Could not run the verification scan. Please try again.' })
    }
  }

  if (!hasContent) return null

  return (
    <div className="scan-verifier">
      <button type="button" className="btn btn-ghost btn-sm scan-verify-toggle" onClick={handleVerify}>
        <ScanLine size={15} /> Verify this QR scans correctly
        <ChevronDown size={14} className={open ? 'chevron-open' : ''} />
      </button>

      {open && result && (
        <div className={`scan-result ${result.ok ? 'scan-result-ok' : 'scan-result-fail'}`}>
          {result.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <div>
            <p className="scan-result-message">{result.message}</p>
            {result.decoded !== undefined && (
              <p className="scan-result-decoded">
                Decoded content: <code>{result.decoded || '(empty)'}</code>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
