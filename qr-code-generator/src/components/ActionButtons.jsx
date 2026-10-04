import { Download, FileCode2, Copy, Share2, RotateCcw } from 'lucide-react'
import { saveFile, copyImage, shareFile, isNative } from '../utils/platformActions'

export default function ActionButtons({ previewRef, hasContent, fileNamePrefix, onReset, notify }) {
  async function handleDownloadPng() {
    if (!hasContent) return
    try {
      const blob = await previewRef.current?.getPngBlob(1024)
      const result = await saveFile({ blob, filename: `${fileNamePrefix}.png`, isImage: true })
      if (result.savedToGallery) {
        notify('success', 'Saved to your Photos.')
      } else if (result.native) {
        notify('success', 'Choose where to save the PNG.')
      } else {
        notify('success', 'PNG downloaded.')
      }
    } catch (err) {
      console.error(err)
      notify('error', 'Could not save the PNG. Please try again.')
    }
  }

  async function handleDownloadSvg() {
    if (!hasContent) return
    try {
      const svg = previewRef.current?.getSvgString()
      if (!svg) throw new Error('No QR code available yet.')
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const result = await saveFile({ blob, filename: `${fileNamePrefix}.svg` })
      notify('success', result.native ? 'Choose where to save the SVG.' : 'SVG downloaded.')
    } catch (err) {
      console.error(err)
      notify('error', 'Could not save the SVG. Please try again.')
    }
  }

  async function handleCopy() {
    if (!hasContent) return
    try {
      const blob = await previewRef.current?.getPngBlob()
      await copyImage(blob)
      notify('success', 'QR code copied to clipboard.')
    } catch (err) {
      console.error(err)
      notify('error', 'Copy is not supported here. Try downloading instead.')
    }
  }

  async function handleShare() {
    if (!hasContent) return
    try {
      const blob = await previewRef.current?.getPngBlob()
      const result = await shareFile({ blob, filename: `${fileNamePrefix}.png`, mimeType: 'image/png' })
      if (!result.native) notify('success', 'Shared successfully.')
    } catch (err) {
      if (err?.name === 'AbortError') return // user cancelled the native share sheet
      console.error(err)
      notify('error', 'Sharing is not supported on this device. Try downloading instead.')
    }
  }

  return (
    <div className="action-buttons">
      <div className="action-buttons-grid">
        <button type="button" className="btn btn-primary" onClick={handleDownloadPng} disabled={!hasContent}>
          <Download size={16} /> PNG
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleDownloadSvg} disabled={!hasContent}>
          <FileCode2 size={16} /> SVG
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCopy} disabled={!hasContent}>
          <Copy size={16} /> Copy
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleShare} disabled={!hasContent}>
          <Share2 size={16} /> Share
        </button>
      </div>
      {isNative() && (
        <p className="field-hint action-native-hint">
          PNG saves straight to your Photos. SVG opens a "save/share" sheet — pick Files or Drive to save it.
        </p>
      )}
      <button type="button" className="btn btn-ghost btn-reset" onClick={onReset}>
        <RotateCcw size={15} /> Reset everything
      </button>
    </div>
  )
}
