import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Bug } from 'lucide-react'

export default function DiagnosticsPanel() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    let platform = 'unknown'
    let isNative = false
    let pluginChecks = {}

    try {
      platform = Capacitor.getPlatform ? Capacitor.getPlatform() : 'unavailable'
      isNative = Capacitor.isNativePlatform ? Capacitor.isNativePlatform() : false
      ;['Filesystem', 'Share', 'Clipboard', 'Media'].forEach((name) => {
        try {
          pluginChecks[name] = Capacitor.isPluginAvailable ? Capacitor.isPluginAvailable(name) : 'n/a'
        } catch {
          pluginChecks[name] = 'error'
        }
      })
    } catch (err) {
      platform = `error: ${err?.message}`
    }

    setInfo({
      platform,
      isNative,
      pluginChecks,
      hasWindowCapacitor: typeof window !== 'undefined' && Boolean(window.Capacitor),
      navigatorShare: typeof navigator !== 'undefined' && Boolean(navigator.share),
      navigatorClipboard: typeof navigator !== 'undefined' && Boolean(navigator.clipboard),
      clipboardItem: typeof window !== 'undefined' && typeof window.ClipboardItem !== 'undefined',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    })
  }, [])

  if (!info) return null

  return (
    <section className="card diagnostics-panel">
      <h2 className="card-title">
        <Bug size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
        Diagnostics
      </h2>
      <p className="field-hint">
        If PNG/SVG/Copy/Share aren't working, screenshot this section and send it over — it tells
        us exactly why.
      </p>
      <dl className="diagnostics-list">
        <dt>Detected platform</dt>
        <dd>{info.platform}</dd>

        <dt>Running as native app?</dt>
        <dd className={info.isNative ? 'diag-good' : 'diag-bad'}>{String(info.isNative)}</dd>

        <dt>window.Capacitor present?</dt>
        <dd className={info.hasWindowCapacitor ? 'diag-good' : 'diag-bad'}>{String(info.hasWindowCapacitor)}</dd>

        <dt>Filesystem plugin available</dt>
        <dd>{String(info.pluginChecks.Filesystem)}</dd>

        <dt>Share plugin available</dt>
        <dd>{String(info.pluginChecks.Share)}</dd>

        <dt>Clipboard plugin available</dt>
        <dd>{String(info.pluginChecks.Clipboard)}</dd>

        <dt>Media (gallery save) plugin available</dt>
        <dd>{String(info.pluginChecks.Media)}</dd>

        <dt>navigator.share (web fallback)</dt>
        <dd>{String(info.navigatorShare)}</dd>

        <dt>navigator.clipboard (web fallback)</dt>
        <dd>{String(info.navigatorClipboard)}</dd>

        <dt>Page URL</dt>
        <dd className="diag-wrap">{info.url}</dd>

        <dt>User agent</dt>
        <dd className="diag-wrap">{info.userAgent}</dd>
      </dl>
    </section>
  )
}
