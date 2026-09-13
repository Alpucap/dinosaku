# Dinosaku - Panduan & Konsep Proyek

## 1. Konsep Utama
**Dinosaku** adalah aplikasi edukasi interaktif gamifikasi yang bertujuan mengajarkan literasi keuangan kepada anak-anak. Aplikasi ini menggunakan cerita komik bergambar dan kuis untuk mengajarkan konsep-konsep seperti menabung, anggaran, dan bekerja keras. 

Aplikasi menggunakan AI (saat ini Gemini, direncanakan pindah ke **GPT-6 Astra**) untuk merancang cerita dinamis (gambar & teks) berdasarkan topik yang dipilih pengguna, sehingga setiap petualangan terasa baru dan unik.

## 2. Fitur yang Sudah Dibuat
* **Landing Page (`/`)**: Halaman utama yang responsif dengan tombol Call-to-Action.
* **Dashboard & Sidebar (`/learn/layout.tsx`)**: Navigasi responsif dengan profil aktif dan streak dari aktivitas kuis yang nyata.
* **Generator Cerita AI (`/learn`)**: Formulir untuk memilih materi (misal: Menabung) dan tema (misal: Luar Angkasa) untuk membuat cerita baru via API AI.
* **Comic & Quiz Viewer**: Komponen interaktif (`ComicViewer` & `QuizViewer`) untuk membaca panel komik dan menjawab pertanyaan pilihan ganda dengan animasi, *feedback* langsung, dan *confetti*.
* **Peta Petualangan / Koleksi Cerita (`/learn/stories`)**: Fitur gamifikasi ala Duolingo. Cerita statis (Preset) disusun dalam bentuk jalur (*path*).
* **Sistem Progress Lokal**: Menyimpan cerita yang sudah diselesaikan di `localStorage` browser. Menyelesaikan kuis di suatu cerita akan membuka gembok cerita berikutnya.
* **Profil & Peringkat Lokal (`/learn/leaderboard`)**: Hingga delapan nama panggilan dalam browser yang sama, tambah/ubah nama dan ganti profil. Poin merupakan jumlah nilai terbaik setiap cerita (maksimal 100 per cerita), sehingga mengulang kuis tidak menggandakan poin. Poin sama mendapat peringkat sama.
* **Lencana (`/learn/badges`)**: Langkah Pertama, Bintang Kuis, Penabung Ulung, Pembeli Cermat, dan Rajin Belajar. Lencana diberikan dari hasil kuis; koleksi menampilkan syarat dan status setiap lencana.
* **Streak Harian**: Satu hari dihitung ketika sebuah kuis selesai, memakai tanggal lokal perangkat. Mengulang di hari sama tidak menambah streak; melewatkan satu hari memutus streak. Lencana yang pernah diraih tetap dimiliki.
* **Energi Lokal**: Tiga pembuatan cerita AI berhasil per hari, dibagi semua profil dalam browser. Reservasi diambil sebelum permintaan dan dikembalikan jika gagal. Demo serta koleksi cerita tidak memakai energi. Hari baru mengisi ulang.
* **Hasil Kuis & Pembaca Komik**: Skor otomatis disimpan saat hasil tampil; form lanjutan hanya ada untuk generator. Teks dapat dibaca ketika gambar masih dibuat; gambar yang gagal dapat dicoba lagi. Demo memakai aset lokal tanpa panggilan API.

## 3. Sedang Dirancang (Tahap Desain)
* **Peta Petualangan responsif**: Navigasi di atas pada ponsel, sidebar pada tablet/desktop, jalur satu kolom di layar kecil dan kartu berselang-seling pada desktop. Layout diperiksa pada lebar 320, 768, 1024, dan 1440 px.

## 4. Pengembangan Berikutnya untuk Produksi
* **Papan Peringkat Lintas Perangkat**: Memerlukan akun dan database; versi sekarang hanya membandingkan profil lokal, tanpa data teman fiktif.
* **Proteksi Biaya di Server**: Energi lokal merupakan aturan penggunaan antarmuka, bukan batas keamanan API. Menghapus data browser dapat meresetnya; endpoint gambar dan retry belum dibatasi server. Produksi memerlukan autentikasi serta pembatasan atomik yang persisten di server.
* **Penyimpanan & Sinkronisasi**: Progres tersimpan di `dinosaku_progress_v1`; progres lama dimigrasikan saat dibaca. Jika penyimpanan diblokir, progres sementara tetap berjalan dengan pemberitahuan. Menutup tab saat pembuatan cerita belum selesai dapat tetap memakai satu energi hari itu.

## 5. Daftar Bug & Isu Saat Ini
* **Perbaikan integrasi lokal**: Respons `/api/generate/story` kini berbentuk `{ story: ... }` sesuai pembacaan di `DinoApp`. Tes regresi: `node --test tests/story-route.test.mjs` (penyedia AI dimock, tidak menguji kuota/ketersediaan Gemini).
* **Perbaikan halaman cerita**: Parameter rute dinamis ditunggu dengan `await params` sesuai Next.js 16; dua error TypeScript pada pembacaan gambar dan perpindahan ke kuis juga diperbaiki.
* **Bug Generate Cerita (Error 500 / Localhost Error)**:
  * **Gejala**: Saat menekan tombol "Buat Cerita", sering kali gagal dan muncul *alert* "Terjadi kesalahan jaringan" atau melempar Error 500 dari server `localhost`.
  * **Penyebab**: 
    1. Kegagalan dari *endpoint* API Gemini (baik karena kuota limit habis, model yang dipanggil tidak tersedia seperti kasus `gemini-3.5-flash-lite` 404, atau masalah jaringan internal aplikasi).
    2. Waktu tunggu (*timeout*) dari Serverless Function Vercel/Next.js karena proses *generate* cerita + *generate* gambar membutuhkan waktu terlalu lama.
  * **Solusi Sementara**: Mode demo (Tanpa API) telah disediakan di opsi Materi ("Demo POC") untuk *bypass* pemanggilan API jaringan demi keperluan *testing* UI.
  * **Solusi Jangka Panjang**: Migrasi ke **GPT-6 Astra** dengan *error handling* yang lebih baik, sistem antrean (*queue*) jika *generate* lama, dan memisahkan proses *generate* teks dengan *generate* gambar agar tidak ke-banned *timeout*.

## 6. Pemeriksaan Pengembangan
* Unit/regresi: `npm test`.
* Build: `npm run build`.
* Lint area belajar: `npx eslint app/learn components/dino lib/progress.ts lib/use-progress.ts tests`.
* Browser: setelah `npx playwright install chromium`, jalankan server `npm run start -- --port 3102`, kemudian `npm run test:browser`. Tes memakai browser terisolasi dan memock API AI agar tidak memakai kuota. Screenshot tersimpan di `/tmp/dinosaku-gamification`.
* Skenario: layout 320/768/1024/1440 px; skor terbaik; lencana; profil terpisah; tautan cerita terkunci; demo gratis; refund energi; kuota lintas profil; validasi nama dan navigasi keyboard. Pengujian ini tidak membuktikan ketersediaan model/kuota Gemini yang nyata.
