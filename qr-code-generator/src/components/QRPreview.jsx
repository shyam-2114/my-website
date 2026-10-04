import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { AlertTriangle } from 'lucide-react'

const CANVAS_SIZE = 480
const LOGO_RATIO = 0.22 // logo occupies ~22% of the QR width

const QRPreview = forwardRef(function QRPreview(
  { payload, fgColor, bgColor, logo, errorCorrectionLevel, onStatusChange },
  ref
) {
  const canvasRef = useRef(null)
  const requestIdRef = useRef(0) // guards against slower, stale renders overwriting a newer one
  const [svgMarkup, setSvgMarkup] = useState('')
  const [error, setError] = useState('')
  const [isEmpty, setIsEmpty] = useState(true)

  useImperativeHandle(ref, () => ({
    getPngDataUrl(size = CANVAS_SIZE) {
      const canvas = canvasRef.current
      if (!canvas) return null
      if (size === CANVAS_SIZE) return canvas.toDataURL('image/png')
      // re-render at a custom export size for crisp downloads
      const scaled = document.createElement('canvas')
      scaled.width = size
      scaled.height = size
      const ctx = scaled.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(canvas, 0, 0, size, size)
      return scaled.toDataURL('image/png')
    },
    getPngBlob(size = CANVAS_SIZE) {
      const canvas = canvasRef.current
      return new Promise((resolve, reject) => {
        if (!canvas) return reject(new Error('No QR code available yet.'))
        if (size === CANVAS_SIZE) {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
          return
        }
        const scaled = document.createElement('canvas')
        scaled.width = size
        scaled.height = size
        const ctx = scaled.getContext('2d')
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(canvas, 0, 0, size, size)
        scaled.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
      })
    },
    getCanvas() {
      return canvasRef.current
    },
    getSvgString() {
      return svgMarkup
    },
    hasContent() {
      return !isEmpty && !error
    },
  }))

  useEffect(() => {
    // Each effect run gets its own id. If a newer run starts before this one
    // finishes, `isStale()` turns true and this run must stop touching the
    // canvas/state — otherwise a slow, outdated render can finish last and
    // paint (and make downloadable/scannable) content that doesn't match
    // what's currently in the form.
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    const isStale = () => requestId !== requestIdRef.current

    async function render() {
      const canvas = canvasRef.current
      if (!canvas) return

      if (!payload || payload.trim().length === 0) {
        if (isStale()) return
        setIsEmpty(true)
        setError('')
        setSvgMarkup('')
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onStatusChange?.({ ready: false, error: false })
        return
      }

      try {
        const options = {
          width: CANVAS_SIZE,
          margin: 2,
          errorCorrectionLevel: logo ? 'H' : errorCorrectionLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        }

        // Render into a detached canvas first so a stale/slow run never
        // touches the on-screen canvas with outdated content.
        const offscreen = document.createElement('canvas')
        await QRCode.toCanvas(offscreen, payload, options)
        if (isStale()) return

        let svg = await QRCode.toString(payload, { ...options, type: 'svg' })
        if (isStale()) return

        if (logo) {
          const logoSize = CANVAS_SIZE * LOGO_RATIO
          const pad = logoSize * 0.16
          const cx = (CANVAS_SIZE - logoSize) / 2
          const cy = (CANVAS_SIZE - logoSize) / 2

          await drawLogoOnCanvas(offscreen, logo, cx, cy, logoSize, pad, bgColor)
          if (isStale()) return

          // Inject a matching backing rect + image into the SVG markup so the
          // downloaded vector file also carries the logo.
          const backingRect = `<rect x="${cx - pad}" y="${cy - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="${logoSize * 0.14}" fill="${bgColor}" />`
          const imageTag = `<image x="${cx}" y="${cy}" width="${logoSize}" height="${logoSize}" href="${logo}" preserveAspectRatio="xMidYMid slice" />`
          svg = svg.replace('</svg>', `${backingRect}${imageTag}</svg>`)
        }

        // Only the freshest, still-current run is allowed to commit its
        // result to the visible canvas and to React state.
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height)

        setSvgMarkup(svg)
        setIsEmpty(false)
        setError('')
        onStatusChange?.({ ready: true, error: false })
      } catch (err) {
        if (isStale()) return
        console.error('QR generation failed:', err)
        setError('This content is too long or complex to encode as a QR code. Try shortening it.')
        setIsEmpty(true)
        onStatusChange?.({ ready: false, error: true })
      }
    }

    render()
  }, [payload, fgColor, bgColor, logo, errorCorrectionLevel])

  return (
    <div className="qr-preview">
      <div className={`qr-canvas-wrap ${isEmpty && !error ? 'qr-canvas-wrap-empty' : ''}`} style={{ background: bgColor }}>
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="qr-canvas" />
        {isEmpty && !error && (
          <div className="qr-empty-hint">
            <span>Fill in the details to generate your QR code</span>
          </div>
        )}
        {error && (
          <div className="qr-error-hint">
            <AlertTriangle size={22} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
})

function drawLogoOnCanvas(canvas, logoSrc, x, y, size, pad, bgColor) {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      const radius = size * 0.14
      // backing plate so the logo stays legible against the code
      roundRect(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, radius)
      ctx.fillStyle = bgColor
      ctx.fill()

      roundRect(ctx, x, y, size, size, radius * 0.8)
      ctx.save()
      ctx.clip()
      ctx.drawImage(img, x, y, size, size)
      ctx.restore()
      resolve()
    }
    img.onerror = () => reject(new Error('Failed to load logo image'))
    img.src = logoSrc
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default QRPreview
