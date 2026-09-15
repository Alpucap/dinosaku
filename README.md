# 🦖 Dinosaku

Dinosaku adalah platform edukasi literasi finansial interaktif yang dirancang khusus untuk anak-anak. Melalui perpaduan teknologi *Generative AI* (Google Gemini) dan gamifikasi, Dinosaku menyajikan pengalaman belajar mengelola keuangan melalui cerita petualangan yang menyenangkan dan dipersonalisasi.

## ✨ Fitur Utama

- 🗺️ **Peta Petualangan (Adventure Map)**: Jalur belajar terstruktur di mana anak-anak dapat menyelesaikan berbagai babak cerita dan kuis seputar literasi finansial.
- 🤖 **Cerita & Kuis Cerdas bertenaga AI**: Menggunakan Google Gemini API untuk menghasilkan cerita bergambar (komik) dan kuis secara dinamis sesuai dengan topik (Menabung, Investasi, dll) dan tema (Luar Angkasa, Bawah Laut, dll).
- 👨‍🏫 **Dasbor Pembimbing (Guru & Orang Tua)**: Portal khusus bagi orang tua dan guru untuk memantau progres belajar, poin, serta target tabungan dunia nyata dari anak-anak/murid mereka.
- 🎯 **Sistem Penugasan (Misi Khusus)**: Fitur bagi Pembimbing untuk memberikan "tugas" (misi spesifik) kepada anak dengan topik dan tema tertentu. Anak akan menerima notifikasi *Banner* Misi saat mereka *login*.
- 🏆 **Gamifikasi Lengkap**: Menggunakan sistem Poin, *Streak* (aktivitas beruntun), dan Lencana (*Badges*) untuk memastikan anak tetap termotivasi belajar.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) + React
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Relasional**: PostgreSQL (via [Neon](https://neon.tech/))
- **Storage**: Firebase Storage (Untuk menyimpan aset gambar AI)
- **Kecerdasan Buatan**: Google Gemini API
- **Styling**: Tailwind CSS
- **Ikon**: Lucide React

## 🚀 Panduan Instalasi Lokal (Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek Dinosaku secara lokal di mesin Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/Alpucap/dinosaku.git
cd dinosaku
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file `.env` di *root directory* proyek Anda dan lengkapi kredensial berikut:

```env
# URL Database PostgreSQL (Neon / Supabase / dll)
DATABASE_URL="postgresql://user:password@host:port/db_name?sslmode=require"

# API Key Google Gemini
GEMINI_API_KEY="AIzaSy..."

# Konfigurasi Firebase Admin SDK (Untuk Cloud Storage)
FIREBASE_PROJECT_ID="dinosaku-xxx"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@dinosaku-xxx.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="dinosaku-xxx.appspot.com"
```

### 4. Sinkronisasi Database
Jalankan perintah berikut untuk mendorong skema ke dalam database PostgreSQL Anda dan men-*generate* Prisma Client:
```bash
npx prisma db push
```

*(Catatan: Aplikasi ini sudah dilengkapi dengan beberapa data dummy akun untuk testing di `lib/data/dummy-users.ts`)*

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di *browser* Anda untuk melihat hasilnya.

---

## 👥 Akun Testing (Dummy)

Anda dapat masuk (Login) menggunakan salah satu akun berikut tanpa perlu *password*:

| Nama / Peran | Tipe Akun | *Use Case* |
| --- | --- | --- |
| **Bagas** | Anak | Melihat Peta Petualangan, membaca cerita AI, dan menyelesaikan kuis. |
| **Budi Guru** | Guru | Melihat Dasbor Pembimbing, progres seluruh murid, dan memberikan tugas. |
| **Cindy Mom** | Orang Tua | Memantau tabungan anak spesifik dan memberikan misi harian. |

---

Dibuat dengan ❤️ untuk literasi finansial anak usia dini.
