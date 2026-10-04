// The plain browser APIs used for downloading files, copying images, and
// sharing (an <a download> click, navigator.clipboard.write, navigator.share)
// mostly don't work inside an Android WebView, which is what the installed
// APK actually is: there's no download manager wired up, no clipboard
// permission flow, and navigator.share is frequently undefined entirely.
//
// This module picks the right implementation at runtime:
//  - Running as the installed Android app -> use Capacitor's native plugins
//    (Filesystem + Share + Clipboard), which talk to real Android APIs.
//  - Running as a website in a normal browser -> use the original web APIs.
//
// If the Capacitor native modules aren't installed/available for some reason,
// isNative() simply returns false and everything falls back to the web path,
// so this file is always safe to import.

import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'
import { Media } from '@capacitor-community/media'

export function isNative() {
  try {
    return Boolean(Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform())
  } catch {
    return false
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result || ''
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(new Error('Could not read the generated file.'))
    reader.readAsDataURL(blob)
  })
}

async function writeToCache(blob, filename) {
  const base64Data = await blobToBase64(blob)
  return Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Cache,
    recursive: true,
  })
}

/**
 * "Download" a file. On the website this triggers a normal browser download.
 *
 * Inside the installed Android app, images (PNG) are saved directly to the
 * device's Photos/Gallery — a real one-tap "download", no picker needed —
 * using the native Media plugin. If that ever fails (older Android versions,
 * missing permission, etc.) it falls back to opening Android's native
 * save/share sheet, same as SVG (which has no gallery equivalent, since it
 * isn't a photo format).
 */
export async function saveFile({ blob, filename, isImage = false }) {
  if (isNative()) {
    if (isImage) {
      try {
        const written = await writeToCache(blob, filename)
        await Media.savePhoto({ path: written.uri, fileName: filename })
        return { native: true, savedToGallery: true }
      } catch (err) {
        console.warn('Gallery save failed, falling back to the save/share sheet:', err)
        // fall through to the share-sheet based save below
      }
    }

    const written = await writeToCache(blob, filename)
    await Share.share({
      title: 'Save QR code',
      url: written.uri,
      dialogTitle: 'Choose where to save this file',
    })
    return { native: true, savedToGallery: false }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return { native: false, savedToGallery: false }
}

/** Copy a PNG image blob to the clipboard. */
export async function copyImage(blob) {
  if (isNative()) {
    const base64Data = await blobToBase64(blob)
    await Clipboard.write({ image: `data:image/png;base64,${base64Data}` })
    return { native: true }
  }

  if (!navigator.clipboard || typeof window.ClipboardItem === 'undefined') {
    throw new Error('Clipboard image copy is not supported in this browser.')
  }
  await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
  return { native: false }
}

/** Open the native share sheet (Android) or the Web Share API (browser). */
export async function shareFile({ blob, filename, mimeType, title, text }) {
  if (isNative()) {
    const written = await writeToCache(blob, filename)
    await Share.share({
      title: title || 'QR Code',
      text: text || 'Here is a QR code I generated.',
      url: written.uri,
      dialogTitle: 'Share QR code',
    })
    return { native: true }
  }

  const file = new File([blob], filename, { type: mimeType })
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: title || 'QR Code',
      text: text || 'Here is a QR code I generated.',
    })
    return { native: false }
  }
  throw new Error('Sharing is not supported on this device.')
}
