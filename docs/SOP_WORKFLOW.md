# Standar Operasional Prosedur (SOP) Produksi Voice Over GENTRA

**Kode Dokumen**: SOP-IKP-GENTRA-2026-01  
**Instansi**: Dinas Komunikasi dan Informatika Provinsi Jawa Barat  
**Sub Bagian**: Komunikasi Publik & Media Siber  

---

## 1. Tujuan
Menjadi pedoman baku bagi Tim Redaksi Humas, Pengelola Media Sosial, dan Editor Multimedia dalam menghasilkan sulih suara (*voice over*) berkualitas siaran, cepat, dan terstandarisasi untuk semua kanal informasi resmi Pemprov Jabar.

---

## 2. Diagram Alur SOP

```
[1. Input Teks / Brief]
         │
         ▼
[2. Pemilihan Mode Kerja]
   ├─── Mode ILM ───────► (Pilih Topik 30s / 60s -> Generate Naskah)
   └─── Mode Manual ────► (Ketik / Tempel Naskah di Studio)
         │
         ▼
[3. Kurasi Karakter Suara (22 Persona)]
   ├─── Konten Kultural / Kedaerahan ──► Persona Khas Sunda
   └─── Pengumuman Resmi / Berita ──────► Persona Nasional
         │
         ▼
[4. Penyesuaian Nada & Kecepatan]
   ├─── Cek kesesuaian tempo dengan timeline video
   └─── Dengarkan Pratinjau
         │
         ▼
[5. Finalisasi & Mastering Broadcast]
   ├─── Video Editor (Premiere / DaVinci) ──► 48.000 Hz WAV
   └─── Radio / Podcast / Spotify ──────────► 44.100 Hz WAV
         │
         ▼
[6. Pengarsipan ke Repository GitHub & Storage Internal]
```

---

## 3. Ketentuan Naskah & Etika Komunikasi

1. **Kejelasan Artikulasi**: Hindari singkatan yang tidak umum diucapkan langsung. Tuliskan kepanjangan atau cara baca (misal: "KTP" ditulis "K-T-P", bukan dieja sebagai kata satu suku kata).
2. **Kearifan Lokal Sunda**: Untuk naskah berbahasa Sunda, pastikan tingkat kehalusan bahasa (*undak usuk basa*) sesuai dengan persona yang dipilih (misal: *Ki Lengser* menggunakan bahasa luhur bijak; *Ceu Edah* menggunakan bahasa loma akrab pergaulan).
3. **Netralitas & Kepatuhan**: Materi suara tidak boleh mengandung unsur SARA, ujaran kebencian, atau informasi yang belum terverifikasi keabsahannya oleh tim redaksi utama.

---

## 4. Standar Penyimpanan & Git SOP

1. Setiap perubahan konfigurasi persona, penambahan naskah ILM baru, dan modul baru wajib didokumentasikan di folder `docs/`.
2. Commit git wajib menggunakan standar Conventional Commits:
   - `feat(...)`: Fitur atau persona baru
   - `fix(...)`: Perbaikan bug atau penyesuaian UI
   - `docs(...)`: Pembaruan dokumentasi atau panduan SOP
   - `style(...)`: Penyesuaian tampilan CSS / layout
3. Seluruh arsip kode dan dokumen teknis wajib disinkronkan ke repositori organisasi `https://github.com/bangkitberuang/gentra.git`.
