# Dinosaku - Project Overview

Dinosaku adalah platform pembelajaran finansial dan petualangan interaktif yang ditujukan untuk anak-anak (rentang usia TK - SD). Aplikasi ini menggabungkan pembelajaran literasi keuangan dasar (seperti menabung, membedakan kebutuhan dan keinginan) dengan teknologi AI generatif (Gemini API) untuk membuat cerita komik yang dipersonalisasi.

## 🎯 Tujuan Proyek
Mengubah proses belajar mengelola uang menjadi pengalaman bermain (*gamification*) melalui cerita bercabang, kuis interaktif, dan sistem pencapaian (*badges*).

## 🛠️ Tech Stack & Teknologi Utama
- **Framework:** Next.js 14+ (App Router, React Server Components)
- **Styling:** Tailwind CSS (dikustomisasi dengan *border* tebal ala desain anak-anak)
- **AI Engine:** Google Gemini API (`@google/genai` atau REST via Edge API)
  - `gemini-3.5-flash-lite`: Digunakan untuk menghasilkan konten cerita dan kuis berformat JSON terstruktur.
  - `gemini-3.1-flash-lite-image`: Digunakan untuk menghasilkan ilustrasi komik bergaya 2D vektor (*flat cartoon*) yang aman untuk anak-anak.
- **Penyimpanan (Storage):** 
  - *Local/Development*: Menyimpan hasil generate AI sebagai JSON & Base64 langsung ke proyek lokal (CMS *Dev Mode*).
  - *End User*: `IndexedDB` (via `localforage`) untuk fitur "Koleksi Ceritaku", dan `localStorage` untuk menyimpan profil, lencana, skor kuis, dan poin.
- **Animasi & Icon:** Framer Motion (Transisi halus & *micro-interactions*) dan Lucide React.
- **Aksesibilitas (A11y):** Web Speech API untuk fitur *Text-to-Speech* (suara narator komik berbahasa Indonesia).

## 🚀 Fitur Utama

### 1. Peta Petualangan (Story Map)
Pemain dipandu melalui *roadmap* misi (cerita) yang harus diselesaikan secara berurutan. Setiap misi yang selesai akan membuka ( *unlock*) misi berikutnya.

### 2. Generator Cerita & Komik AI (Buat Cerita)
- **Kustomisasi:** Anak dapat memilih topik (misal: "Menabung") dan tema (misal: "Planet Asing" atau tema bebas yang diketik sendiri).
- **Proses AI:** Gemini merancang alur cerita yang terdiri dari 4 panel komik beserta 3 soal kuis pilihan ganda yang menguji pemahaman finansial dari cerita tersebut.
- **Prompt Gambar:** Di belakang layar, sistem menambahkan instruksi ketat ke Imagen API agar selalu membuat gambar berformat `2d flat vector cartoon, clean lines, child-friendly, no text` untuk menjaga konsistensi agar tidak menjadi 3D / realistis.

### 3. Comic Viewer & Pembaca Suara
Menampilkan cerita panel demi panel seperti presentasi interaktif. Dilengkapi dengan fitur **Text-to-Speech** (ikon *Speaker*) agar anak yang belum lancar membaca dapat mendengarkan narasi cerita (bahasa Indonesia).

### 4. Kuis Interaktif & Lencana (Gamification)
- Setelah komik selesai, anak diuji dengan kuis.
- Skor yang didapat akan dikonversi menjadi **Poin** dan menduduki peringkat di **Papan Peringkat** (*Leaderboard*) lokal.
- Anak juga bisa mendapatkan berbagai **Lencana (Badges)** seperti "Bintang Kuis" (skor sempurna), "Langkah Pertama", atau lencana spesifik untuk cerita tertentu. Notifikasi lencana baru akan muncul di akhir kuis.

### 5. Koleksi Ceritaku
Setiap cerita unik yang di-*generate* secara khusus oleh AI akan langsung disimpan ke `IndexedDB` perangkat pengguna. Anak bisa melihat kembali cerita dan komik ciptaan mereka di halaman "Rak Buku".

## 📁 Struktur Folder Penting
- `/app`: Rute utama Next.js (Halaman Landing, Map `/learn`, Buat Cerita `/learn/create`, dll).
- `/app/api`: Endpoint API internal untuk memanggil Gemini Text & Imagen secara aman dari *server-side*. Terdapat endpoint khusus `/api/save-preset` untuk fitur CMS lokal.
- `/components/dino`: Komponen UI spesifik (DinoApp, ComicViewer, QuizViewer, Sidebar, dll).
- `/lib/progress.ts` & `use-progress.ts`: Logika *state management* untuk Profil, Poin, Lencana, dan sinkronisasi ke `localStorage`.
- `/lib/collection.ts`: Logika integrasi `localforage` untuk membaca/menyimpan objek cerita besar (berikut Base64 gambarnya) ke IndexedDB.
