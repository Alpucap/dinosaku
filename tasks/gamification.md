# Gamifikasi Dinosaku

## Cakupan dan urutan
1. `progress`: profil lokal, hasil kuis terbaik, tanggal belajar, migrasi progres lama.
2. `rewards`: lencana dan streak dari hasil nyata; bergantung pada progress.
3. `leaderboard`: peringkat profil satu browser menurut jumlah poin skor terbaik; bergantung pada progress.
4. `energy`: tiga pembuatan cerita AI berhasil per hari kalender lokal, dibagi semua profil; demo gratis. Reservasi sebelum permintaan, dikembalikan saat gagal.
5. `learning-ui`: peta, koleksi lencana, peringkat, generator dan hasil kuis menampilkan data tersebut.

## Penerimaan
- Skor disimpan ketika hasil kuis tampil. Mengulang kuis tidak menggandakan poin; skor terbaik dipertahankan.
- Skor sempurna membuka lencana; streak bertambah sekali per tanggal belajar dan terputus setelah melewatkan satu hari.
- Peringkat hanya berisi profil nyata di perangkat ini. Maksimal delapan nama panggilan, masing-masing maksimal 24 karakter.
- Data lama tetap membuka cerita yang sudah selesai. Data rusak atau storage yang diblokir tidak menyebabkan layar crash.
- Energi dibagi seluruh profil; pergantian profil tidak mengisi ulang. Hari baru mengisi ulang; kegagalan API mengembalikan reservasi.
- Energi lokal dapat direset lewat data browser. Proteksi biaya produksi memerlukan autentikasi dan pembatasan server yang persisten, di luar versi lokal ini.
- Semua kontrol punya aksi, navigasi keyboard dan fokus terlihat; layout diperiksa pada 320, 768, 1024, 1440 px.

## Desain
Buku petualangan literasi keuangan untuk anak. ENERGY 2 / RHYTHM 2 / MOTION 1.
Hijau gelap untuk aksi utama, hijau muda untuk progres, kuning hangat untuk medali. Purba dan jalur cerita menjadi motif; font Baloo untuk judul dan Fredoka untuk isi mengikuti aset proyek. Animasi singkat untuk umpan balik; hormati reduced motion.

## Implementasi dan pemeriksaan
Logika domain di `lib/progress.ts`, sinkronisasi React di `lib/use-progress.ts`, komponen belajar di `components/dino`, halaman di `app/learn`.
Gunakan fungsi bertipe eksplisit, misalnya `getStreak(days: string[], today: string): number`.
Tes domain memakai Node test runner dan compiler TypeScript yang sudah terpasang. Uji browser dengan Playwright terisolasi.

Perintah: `node --test tests/*.test.mjs`, `npx eslint app/learn components/dino lib/progress.ts lib/use-progress.ts tests`, `npm run build`.
Selalu validasi data lokal dan pertahankan perubahan pengguna. Jangan menyimpan API key di browser atau menambahkan pengguna/skor fiktif.

## Tugas
- [ ] Domain progres, migrasi, lencana, streak, energi dan tes.
- [ ] Integrasi hasil kuis dan generator.
- [ ] Halaman pencapaian, profil, peringkat dan penyegaran peta/navigasi.
- [ ] Build, lint kode yang diubah, pemeriksaan browser dan dokumentasi batas versi lokal.
