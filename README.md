# QR Code Generator

A production-ready, installable QR Code Generator built with **React + Vite**. Everything
runs entirely in the browser — there is no backend and no data ever leaves the device.

## Features

- Generate QR codes for **URL, Text, Phone, Email, Wi-Fi, and Contact (vCard)**
- Custom **foreground / background colors** with hex input and presets
- Optional **center logo** (PNG/JPG/WEBP/SVG) with automatic high error-correction
- **Download PNG** and **Download SVG**
- **Copy to clipboard** and **native Share** (on supported devices/browsers)
- Full **Reset**
- Real-time input **validation** with inline errors
- **Bottom navigation** built for phones, plus an **About** page
- Installable **PWA** — works offline once loaded
- A React **error boundary** so unexpected errors never blank the screen

## Tech stack

- React 18 + Vite 5
- [`qrcode`](https://www.npmjs.com/package/qrcode) — QR encoding (canvas + SVG)
- [`lucide-react`](https://www.npmjs.com/package/lucide-react) — icons
- `vite-plugin-pwa` — service worker + web app manifest generation

## Project structure

```
qr-code-generator/
├── index.html
├── package.json
├── vite.config.js
├── capacitor.config.json      # Android app wrapper config (see "Build an Android app" below)
├── public/
│   ├── icons/                 # App icons (192, 512, apple-touch, favicon)
│   ├── manifest.json          # Reference manifest (the build also emits manifest.webmanifest)
│   └── robots.txt
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css
│   ├── index.css              # Design tokens + global styles
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── TabSelector.jsx
│   │   ├── QRGeneratorPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── LogoUpload.jsx
│   │   ├── QRPreview.jsx
│   │   ├── ActionButtons.jsx
│   │   ├── Toast.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── forms/
│   │       ├── URLForm.jsx
│   │       ├── TextForm.jsx
│   │       ├── PhoneForm.jsx
│   │       ├── EmailForm.jsx
│   │       ├── WifiForm.jsx
│   │       └── VCardForm.jsx
│   └── utils/
│       ├── constants.js
│       ├── validators.js
│       └── qrDataBuilders.js
└── README.md
```

## 1. Install dependencies

You need [Node.js](https://nodejs.org) 18+ and npm installed. From the project folder:

```bash
npm install
```

## 2. Run it locally

```bash
npm run dev
```

This starts Vite's dev server (by default at `http://localhost:5173`). Open that URL in your
browser — the app hot-reloads as you edit files.

### Test it on your phone, on the same Wi-Fi network

The dev server is already configured with `host: true`, so it's reachable from other devices
on your network:

1. Run `npm run dev` and note the "Network" URL Vite prints (something like
   `http://192.168.1.23:5173`) — or find your computer's local IP with `ipconfig` (Windows) or
   `ifconfig` / `ip addr` (Mac/Linux).
2. Make sure your phone is on the **same Wi-Fi network** as your computer.
3. Open that `http://<your-ip>:5173` address in your phone's browser.
4. Optional: tap your browser's menu → **"Add to Home Screen"** to install it like an app.

## 3. Build for production

```bash
npm run build
```

This outputs a fully static site into the `dist/` folder — HTML, CSS, JS, icons, the web app
manifest, and the service worker.

Preview the production build locally before deploying:

```bash
npm run preview
```

## Why PNG/SVG/Copy/Share needed native plugins

If you built the APK before this update, tapping PNG, SVG, Copy, or Share may have done
**nothing at all**. That's because those buttons originally used plain browser JavaScript APIs
(`<a download>`, `navigator.clipboard`, `navigator.share`) — and Android's WebView (which is
what the installed app actually runs in) doesn't wire those up to anything: there's no download
manager, no clipboard permission flow, and `navigator.share` is often simply undefined. It's a
well-known Capacitor/WebView limitation, not a bug in the QR logic itself.

This project now detects whether it's running as the installed Android app or as a website
(`src/utils/platformActions.js`) and switches accordingly:

- **Website:** unchanged — normal browser download, clipboard, and Web Share behavior.
- **Installed Android app:** uses Capacitor's native **Filesystem**, **Share**, and
  **Clipboard** plugins. "Download PNG/SVG" writes the file and opens Android's native
  save/share sheet so you can pick exactly where it goes (Downloads, Files, Google Drive, etc).
  "Copy" writes the image straight to the system clipboard. "Share" opens the native share sheet.

**If you already generated an APK before this change, you need to rebuild it:**

```bash
npm install         # pulls in the new @capacitor/filesystem, @capacitor/share, @capacitor/clipboard
npm run cap:sync     # rebuilds the web app and copies the native plugins into android/
npm run android:open # or npm run android:build:debug
```

Then reinstall the new `app-debug.apk` on your phone (Android will let you update over the old
one). PNG/SVG/Copy/Share should now open the native save/share sheet instead of doing nothing.

### PNG now saves straight to Photos — no picker sheet

On the installed Android app, tapping **PNG** writes the image directly to your device's
Photos/Gallery using Capacitor's Media plugin — a real one-tap download, the same as saving a
photo from any other app. **SVG** still opens the native save/share sheet (there's no
"gallery" for non-image files like SVG, so you pick Files/Drive/etc. from the sheet instead).
If the gallery save ever fails for some reason (older Android version, missing permission), it
automatically falls back to the save/share sheet so you're never stuck with nothing happening.

This needs one more plugin, so if you already built the APK before this change:

```bash
npm install         # pulls in @capacitor-community/media
npm run cap:sync
npm run android:build:debug        # Mac/Linux
npm run android:build:debug:win    # Windows
```

Reinstall the resulting `app-debug.apk` on your phone (uninstall the old one first to be safe).

## 4. Build a real installable Android app (.apk)

The steps above deploy a *website*. If you instead want an **installable Android app** — an
actual `.apk` file, works offline, has its own icon on the home screen, no browser chrome — use
[Capacitor](https://capacitorjs.com), which is already wired into this project. Capacitor
bundles your built web app (`dist/`) directly inside the Android app, so **no server or internet
connection is needed at runtime**.

### One-time prerequisites (install these on your computer first)

1. **Node.js 18+** (you already have this if you got this far).
2. **Java JDK 17** — [Eclipse Temurin 17](https://adoptium.net/) is a good free option.
3. **Android Studio** (includes the Android SDK) — download from
   [developer.android.com/studio](https://developer.android.com/studio). Open it once after
   installing so it finishes downloading the SDK components.

### Steps

```bash
# 1. Install project dependencies (Capacitor is already in package.json)
npm install

# 2. Build the web app and create the native android/ project
npm run cap:add:android

# 3. Copy the latest build into the native project (run this again after every code change)
npm run cap:sync

# 4. Open the native project in Android Studio
npm run android:open
```

In Android Studio:
1. Wait for Gradle to finish syncing (progress bar at the bottom, first time can take a few minutes).
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. When it finishes, click **"locate"** in the notification, or find the file at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
4. Copy that `.apk` to your phone (email it to yourself, USB transfer, Google Drive, etc.),
   open it on the phone, and tap **Install**. You'll need to allow "Install unknown apps" for
   whichever app you used to open the file (Android will prompt you automatically).

### Building from the command line instead (no Android Studio UI)

If you have the Android SDK / command-line tools installed but don't want to use the Studio UI:

```bash
# Mac / Linux terminal
npm run android:build:debug

# Windows (Command Prompt or PowerShell)
npm run android:build:debug:win
```

> **Windows note:** if you see `'.' is not recognized as an internal or external command`,
> that's just this OS difference — Mac/Linux run `./gradlew`, Windows runs `gradlew.bat`. Make
> sure you're using the `:win` script above (or run `cd android` then `gradlew.bat assembleDebug`
> directly).

This runs the Gradle wrapper directly and produces the same file at
`android/app/build/outputs/apk/debug/app-debug.apk`.

### Making a signed release APK (for sharing widely / the Play Store)

A **debug APK** (above) installs and runs fine for personal use and testing, but for
distributing more broadly you should sign a release build:

```bash
# Generate a signing key (do this once; keep the .keystore file and passwords safe!)
keytool -genkey -v -keystore qr-gen-release.keystore -alias qr-gen -keyalg RSA -keysize 2048 -validity 10000
```

Then add signing config to `android/app/build.gradle` under `android { signingConfigs { ... } }`
and `buildTypes { release { signingConfig ... } }` (Android Studio's
**Build → Generate Signed Bundle / APK** wizard will do this for you interactively — pick
**APK**, point it at your keystore, and it produces
`android/app/build/outputs/apk/release/app-release.apk`).

### Updating the app after you change the code

Every time you edit the source, rebuild and re-sync before opening/building in Android Studio
again:

```bash
npm run cap:sync
```

## 5. Deploy the website version so anyone can open it from their phone

Because the app is 100% static (no backend), you can deploy `dist/` to any static host. A few
easy options:

### Option A — Netlify (drag & drop, no account setup needed)
1. Run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist` folder in.
3. Netlify gives you a public HTTPS URL immediately — open it on any phone.

### Option B — Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```
Follow the prompts (accept the defaults; Vercel auto-detects Vite). It gives you a public URL.

### Option C — GitHub Pages
1. `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. Set `base: '/your-repo-name/'` in `vite.config.js`.
4. `npm run build && npm run deploy`

### Option D — Any static host (S3, Cloudflare Pages, Firebase Hosting, nginx, etc.)
Just upload the contents of `dist/` — it's plain static files.

> **HTTPS matters:** installing as a PWA, using the camera-based "Add to Home Screen" flow, and
> using `navigator.share` / clipboard APIs all require a secure context. `localhost` counts as
> secure for local testing; for a real phone test over the internet, use one of the HTTPS hosts
> above (all of the options here provide HTTPS automatically).

## Installing as an app (PWA)

Once the site is deployed (or opened over `localhost`):

- **Android (Chrome):** open the site → menu (⋮) → **"Install app"** / **"Add to Home screen"**.
- **iOS (Safari):** open the site → Share icon → **"Add to Home Screen"**.
- **Desktop (Chrome/Edge):** an install icon appears in the address bar.

After installing, the app opens full-screen with its own icon and works offline for
previously visited pages.

## "Verify this QR scans correctly"

Under the preview there's a **Verify this QR scans correctly** button. It runs the exact image
you're looking at through a real QR decoder (`jsQR`) right there in the browser and shows you
the precise content a scanner would read back — so you can confirm the code is correct without
depending on your phone's camera app.

This is especially useful for **plain "Text" QR codes**: unlike a URL, phone number, email, or
Wi‑Fi code (which carry a recognized scheme like `https://`, `tel:`, `mailto:`, `WIFI:` that
phone camera apps turn into a tappable action), plain text has no scheme to act on. Many camera
apps only show a small banner for text codes — and some do nothing visible at all if you don't
tap the notification, which can look like "nothing happened" even though the code is perfectly
valid. If you want to confirm a text code is right, either use the in-app verifier above, or
scan it with a dedicated reader app (e.g. Google Lens, or a "QR & Barcode Scanner" app) that
displays raw text explicitly.

## Notes on QR payload formats

- **Wi-Fi** codes follow the standard `WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;;` format
  understood by iOS and Android camera apps.
- **Contact** codes generate a `VCARD` (version 3.0) block, importable directly into Contacts
  apps.
- **Email** codes use a `mailto:` URI with URL-encoded subject/body.
- **Phone** codes use a `tel:` URI.

## License

Provided as-is for your own use.
