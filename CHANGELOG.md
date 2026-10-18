# Catatan Perubahan (Changelog) GENTRA 🎙️

Dokumen ini mencatat pembaruan dan peningkatan arsitektur pada repositori **GENTRA**.

---

## [v2.6.4] - 2026-10-18: Standardisasi Versi Mandiri GENTRA, Manajemen Akun & Audit Naskah, dan Sinkronisasi Silsilah Suara 3 Pilar

### 🎯 Pokok Pembaruan
1. **Standardisasi Versi Mandiri GENTRA (`v2.6.4`)**:
   - Memisahkan dan membersihkan badge versi eksternal (`v1.3.0`) yang sempat terbawa saat penyeragaman tipografi.
   - Menyelaraskan seluruh branding rilis platform ke **`v2.6.4`** secara utuh dan konsisten di Landing Page, Studio Suite, Modal Login, Voice Lab, Enterprise Manager, hingga `package.json`.
2. **Silsilah Nama Asli & Backend ID Abadi**:
   - Menjaga keaslian karakter bawaan pabrik (`originalName`) dan pengenal mesin neural (`backendVoiceId` / `geminiVoiceId`) agar tidak hilang atau terhapus di backend saat dikustomisasi pengguna.
3. **Keterkaitan Real-Time 3 Permukaan (Landing Page, Studio, Lab Suara)**:
   - Menggunakan repositori vokal tunggal (`src/utils/voiceRegistry.js`) dengan arsitektur reaktif berbasis event (`gentra_voices_updated`) dan *dual-storage persistence* (localStorage + cookie 365 hari).
4. **Manajemen Akun, Sandi & Audit Riwayat Naskah**:
   - Fitur swakelola akun admin & tim produksi (`UserManagementModal.jsx`, `userStore.js`, `api/auth/users.js`, `api/auth/activity.js`).
   - Audit trail mendalam: mencatat akun pembuat, isi naskah yang digenerate, karakter vokal yang dipakai, jumlah karakter/kata, dan penampil naskah lengkap dengan salin 1-klik.

---

## [v1.1.0] - 2026-10-17: Migrasi & Dukungan Deployment Cloud Vercel

### 🎯 Latar Belakang Perubahan
Sebelum pembaruan ini, seluruh logika backend pemrosesan suara multi-engine (`Gemini`, `Azure`, `ElevenLabs`, dll.) berada di dalam folder `server/` dan dijalankan melalui **Vite Dev Server Middleware** (`server/ttsMiddleware.js`). 

* **Keterbatasan Sebelumnya:** Vite middleware **hanya aktif saat development lokal** (`npm run dev`). Ketika aplikasi di-build untuk produksi (`npm run build`) dan di-deploy ke hosting cloud seperti Vercel, Vite hanya mengekspor file frontend statis (`dist/`). Akibatnya, pemanggilan endpoint `/api/tts/*` di cloud akan menghasilkan **HTTP 404 (Not Found)**.
* **Solusi:** Menambahkan adapter resmi **Vercel Serverless Functions** pada direktori `api/tts/`, sehingga backend TTS dapat berjalan 24/7 di cloud Vercel secara mandiri dan aman tanpa memerlukan server VPS terpisah.

---

### 📁 Rincian File & Folder Baru

| File / Folder | Peran & Fungsi |
| :--- | :--- |
| `api/_utils.js` | Modul helper bersama untuk membaca *Environment Variables* di lingkungan Vercel Cloud (`process.env`) maupun file lokal (`.env`), serta penanganan header CORS dan parsing body JSON. |
| `api/tts/status.js` | Endpoint `GET /api/tts/status` versi Serverless. Memeriksa ketersediaan konfigurasi engine AI (Gemini, Azure, ElevenLabs, Google Cloud) secara live. |
| `api/tts/catalog.js` | Endpoint `GET /api/tts/catalog` versi Serverless. Mengambil daftar 22+ katalog persona vokal (Sunda & Nasional) langsung dari `server/ttsCatalog.js`. |
| `api/tts/synthesize.js` | Endpoint `POST /api/tts/synthesize` versi Serverless. Menjalankan sintesis audio ke penyedia AI (Gemini Flash Neural, ElevenLabs, Azure Speech) dengan aman tanpa membocorkan API Key ke browser. |
| `api/tts/benchmark.js` | Endpoint `POST /api/tts/benchmark` versi Serverless. Menjalankan uji komparasi performa dan latensi kelima engine audio sekaligus di cloud. |
| `vercel.json` | Konfigurasi inti deployment Vercel: menetapkan batas waktu eksekusi serverless hingga 60 detik (`maxDuration: 60`) agar sintesis audio naskah panjang tidak terputus, serta aturan rewrite SPA agar reload halaman web tidak 404. |

---

### 🔄 Perbandingan Arsitektur: Sebelum vs Sesudah

```mermaid
graph TD
    subgraph Sebelum (Hanya Lokal)
        ClientDev["Browser Lokal"] --> ViteDev["Vite Dev Server (:3000)"]
        ViteDev --> Middleware["server/ttsMiddleware.js"]
        Middleware --> Service["server/ttsService.js"]
        NoteDev["❌ Tidak bisa jalan saat di-deploy ke Vercel (404)"]
    end

    subgraph Sesudah (Lokal + Cloud Ready)
        ClientLive["Browser Pengunjung"] --> CloudCDN["Vercel Global Edge CDN"]
        CloudCDN --> SPA["Frontend React (dist/)"]
        CloudCDN --> API["Vercel Serverless Functions (api/tts/*)"]
        API --> Service2["server/ttsService.js & server/ttsCatalog.js"]
        NoteLive["✅ Aktif 24/7 di https://gentra.vercel.app"]
    end
```

---

### 🔐 Keamanan API Key
Dengan adanya folder `api/tts/`, seluruh kunci API rahasia (`GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `AZURE_SPEECH_KEY`) cukup disimpan di pengaturan **Environment Variables Vercel** dan dieksekusi di sisi server. Kunci tidak akan pernah terlihat di source code frontend maupun di tab *Network inspect* browser pengunjung.
