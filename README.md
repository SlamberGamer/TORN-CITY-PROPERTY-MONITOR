# 🏠 Torn Rental Ops Monitor

> A mobile-first Progressive Web App for monitoring **Torn City property rental expiry times** — with real-time countdowns, browser notifications, offline support, and light/dark theme.

**Developed by [SlamberGamer](https://www.torn.com)**

---

## 📱 Preview

```
┌─────────────────────────────────┐
│  RENTAL OPS          21:34:05   │
│  TORN CITY PROPERTY MONITOR     │
│  [ ☀️ ── ]           Sun 8 Mar  │
│                      ● SYNCED   │
├───────────┬───────────┬─────────┤
│  ACTIVE   │ EXPIRING  │ EXPIRED │
│     3     │     1     │    0    │
├─────────────────────────────────┤
│ Standard House - John           │
│ ████████████░░░░  EXPIRING      │
│ Started: 03/03/26 00:02 TCT     │
│ Expires: 04/02/26 00:02 TCT     │
│ Duration: 30 days   78% done    │
│                   14H 22M 05S   │
└─────────────────────────────────┘
```

---

## ✨ Features

- **Real-time countdown** — live per-second timer for every rental
- **Torn City Time sync** — pulls accurate UTC time from `worldtimeapi.org` on load and every hour, counts locally in between
- **Browser notifications** — alerts at **24h**, **12h**, **1h** before expiry and **on expiry**
- **Service Worker** — works fully offline after first load; fires background alerts even when the app isn't open
- **Persistent storage** — all rentals saved to `localStorage`, survive page refreshes and phone restarts
- **Light / Dark theme** — toggle sits in the header (below the title), preference saved across sessions
- **Mobile-first design** — built for phone screens with large tap targets and clean layout
- **PWA installable** — installs to Android/iOS home screen like a native app
- **Color-coded urgency** — 🟢 safe → 🟡 72h → 🟠 24h → 🔴 1h → blinking red = critical
- **Progress bar** — visual % elapsed per rental
- **Add / Edit / Remove** rentals at any time

---

## 🚀 Installation (Android)

### Option A — GitHub Pages *(recommended, enables full PWA + notifications)*

1. Fork or clone this repo
2. Go to **Settings → Pages → Source → `main` branch → `/root`**
3. Open the generated URL in **Chrome on Android**
4. Tap `⋮` menu → **"Add to Home Screen"**
5. Accept notification permissions when prompted
6. Done — it's on your home screen like a real app ✅

### Option B — Local file

1. Download the ZIP and extract it
2. Transfer the folder to your Android phone via USB or Google Drive
3. Open `index.html` with Chrome
4. Works immediately — note: background notifications require hosting (Option A)

### Option C — Vercel *(fastest deploy, auto HTTPS)*

1. Go to **vercel.com** → Log in
2. Click **"Add New Project"** → drag & drop the `torn-rental-pwa` folder
3. Click **Deploy** — done in ~30 seconds ✅
4. Or link your GitHub repo for auto-deploy on every push

After deploying, confirm `manifest.json` looks like this:

```json
{
  "name": "Torn Rental Ops Monitor",
  "short_name": "Rental Ops",
  "description": "Monitor your Torn City property rental expiry times with real-time alerts.",
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f0f4ff",
  "theme_color": "#a78bfa",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["utilities", "productivity"],
  "shortcuts": [
    {
      "name": "Add Rental",
      "short_name": "Add",
      "description": "Add a new rental to monitor",
      "url": "/index.html#add"
    }
  ]
}
```

> Vercel provides HTTPS automatically — required for Service Workers and push notifications to work.

---

## 📂 File Structure

```
torn-rental-pwa/
├── index.html       # Full app — all HTML, CSS, JS in one file
├── manifest.json    # PWA manifest — name, icons, display mode
├── sw.js            # Service Worker — offline cache + background alerts
├── icon-192.png     # App icon (home screen, notifications)
└── icon-512.png     # App icon (splash screen)
```

---

## ⏱ How to Add a Rental

| Field | Format | Example |
|---|---|---|
| Property Name | Free text | `Standard House - John` |
| Start Time | `HH:MM:SS` (Torn City Time / UTC) | `00:02:32` |
| Start Date | `MM/DD/YY` | `03/03/26` |
| Duration | Days (decimals ok) | `30` or `7.5` |

> All times use **Torn City Time = UTC**. Find your rental start time in Torn's property page.

---

## 🔔 Notification System

| Trigger | Alert |
|---|---|
| 24 hours before expiry | 🔔 `[Property] expires in 24 hours` |
| 12 hours before expiry | 🔔 `[Property] expires in 12 hours` |
| 1 hour before expiry | 🔔 `[Property] expires in 1 hour` |
| Expiry reached | ⚠️ `EXPIRED: [Property]` |

Notification state is persisted — you won't receive duplicate alerts across sessions.

---

## 🌗 Theme

The app supports **light (pastel) and dark** themes. The toggle is located in the **top-left of the header**, just below the app title — it won't overlap any content on mobile. Your preference is saved automatically and restored on every launch.

---

## 🌐 Time Sync

Torn City Time runs on **UTC**. This app:
1. Fetches the accurate UTC timestamp from `worldtimeapi.org` on startup
2. Calculates and stores the offset between your device clock and real UTC
3. Counts down **locally** every second — no repeated API calls
4. Re-syncs every **1 hour** automatically to prevent drift
5. Manual re-sync available via the `↻` button

---

## 🛠 Tech Stack

- Vanilla **HTML / CSS / JavaScript** — zero dependencies, zero build steps
- **PWA** with Web App Manifest + Service Worker
- **Notification API** + **Periodic Background Sync API**
- **localStorage** for data persistence
- **worldtimeapi.org** for UTC time verification

---

## 📋 Requirements

- Android: **Chrome 80+** (recommended) or any Chromium browser
- iOS: Safari 16.4+ (limited background notification support)
- Desktop: Any modern browser

---

## 📄 License

MIT License — free to use, modify, and share.

---

<div align="center">

**Made for Torn City players. Not affiliated with Torn Ltd.**

*Developed by SlamberGamer*

</div>
