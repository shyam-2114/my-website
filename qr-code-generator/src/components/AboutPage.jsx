import { ShieldCheck, WifiOff, Smartphone, Palette } from 'lucide-react'
import DiagnosticsPanel from './DiagnosticsPanel'

export default function AboutPage() {
  return (
    <div className="page about-page">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-mark-dot" />
        </div>
        <div>
          <h1>About</h1>
          <p className="page-subtitle">What this app does, and how it works.</p>
        </div>
      </header>

      <section className="card">
        <p>
          QR Gen creates QR codes for links, plain text, phone numbers, email drafts, Wi-Fi
          logins and contact cards. Every code is generated on your own device — nothing you
          type is sent to a server.
        </p>
      </section>

      <section className="card">
        <h2 className="card-title">Highlights</h2>
        <ul className="feature-list">
          <li>
            <ShieldCheck size={18} />
            <div>
              <strong>Private by design</strong>
              <p>All encoding happens locally in your browser. Your data never leaves your device.</p>
            </div>
          </li>
          <li>
            <WifiOff size={18} />
            <div>
              <strong>Works offline</strong>
              <p>Install it once and keep generating QR codes without an internet connection.</p>
            </div>
          </li>
          <li>
            <Palette size={18} />
            <div>
              <strong>Fully customizable</strong>
              <p>Pick your own colors and drop in a logo — the app raises error correction automatically so it still scans.</p>
            </div>
          </li>
          <li>
            <Smartphone size={18} />
            <div>
              <strong>Built for mobile</strong>
              <p>A compact, thumb-friendly layout with bottom navigation, made to feel like a native app.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="card">
        <h2 className="card-title">Supported QR types</h2>
        <p>URL &middot; Text &middot; Phone number &middot; Email &middot; Wi-Fi network &middot; Contact card (vCard)</p>
      </section>

      <section className="card">
        <h2 className="card-title">Tech</h2>
        <p>
          Built with React and Vite, rendered with the <code>qrcode</code> npm package, and packaged
          as an installable Progressive Web App.
        </p>
      </section>

      <DiagnosticsPanel />

      <p className="developer-credit">Developed by Gannapureddy Shyam Sundhar</p>
    </div>
  )
}
