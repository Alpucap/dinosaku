const fs = require('fs');
let code = fs.readFileSync('components/FAQ.tsx', 'utf-8');

const oldFaqs = `const faqs = [
  {
    q: "Apakah aplikasi Dinosaku gratis?",
    a: "Dinosaku menawarkan paket gratis dengan fitur dasar (1 anak, akses dasbor pembimbing). Untuk fitur pembuatan komik tanpa batas dan pemantauan banyak anak/murid, kami menyediakan Paket Keluarga & Paket Kelas."
  },
  {
    q: "Apa bedanya Energi AI dan langganan bulanan?",
    a: "Langganan bulanan memberikan kuota energi rutin dan fitur premium setiap bulan. Jika energi bulanan habis sebelum waktunya, Anda bisa membeli Top-Up Energi tanpa perlu meningkatkan paket langganan."
  },
  {
    q: "Apakah komik AI aman dibaca anak-anak?",
    a: "Tentu! Kami menggunakan prompt sistem khusus yang ketat untuk menyaring kata dan visual yang tidak pantas. Dinosaku berfokus pada edukasi moral, keuangan, dan sains."
  },
  {
    q: "Apakah saya bisa memakai aplikasi ini untuk murid satu kelas?",
    a: "Bisa! Kami memiliki 'Paket Kelas' khusus untuk Guru. Anda bisa menyebarkan Kode Kelas kepada murid-murid, membagikan cerita sebagai misi membaca, dan memantau analitik kelas di dasbor Anda."
  },
  {
    q: "Bagaimana cara kerja fitur Target Tabungan?",
    a: "Anak dapat memilih impian di dasbor mereka, dan Anda bisa menyetujui target nominalnya. Anak-anak akan termotivasi mengerjakan kuis dan misi membaca demi mengumpulkan poin hingga mencapai target impian!"
  }
];`;

const newFaqs = `const faqs = [
  {
    q: "Apakah AI-nya aman? Bagaimana jika AI menampilkan gambar atau cerita yang tidak pantas?",
    a: "Keamanan anak adalah prioritas utama kami. Sistem AI Dinosaku tidak menerima perintah langsung dari anak. Semua pembuatan cerita dikendalikan oleh Guru/Orang Tua melalui 'sistem prompt internal' kami yang sangat ketat untuk memblokir unsur kekerasan, kata kasar, maupun konten dewasa."
  },
  {
    q: "Apakah ini akan membuat anak saya kecanduan main gadget?",
    a: "Dinosaku didesain dengan konsep 'Micro-Learning'. Satu misi cerita komik hanya memakan waktu 5-10 menit untuk diselesaikan. Selain itu, orang tua dapat mengatur kuota mingguan dan menjadikan gadget sebagai alat produktif pembangun kebiasaan literasi, bukan sekadar hiburan kosong."
  },
  {
    q: "Apakah ada risiko anak menekan tombol beli (In-App Purchases) secara tidak sengaja?",
    a: "Tidak ada. Semua aktivitas transaksi, langganan, dan pembelian Energi AI terkunci secara eksklusif di dalam Dasbor Pembimbing yang dikelola langsung oleh Anda. Layar anak 100% bersih dari iklan (Ad-Free) dan tombol pembelian."
  },
  {
    q: "Anak saya malas membaca buku teks. Apakah komik ini benar-benar efektif?",
    a: "Tentu! Metode gamifikasi (seperti mengumpulkan koin dan lencana) dipadukan dengan format komik bergambar terbukti sangat ampuh memancing minat baca anak yang visual atau mudah bosan. Anak tidak merasa sedang 'belajar', melainkan sedang 'bertualang'."
  },
  {
    q: "Bagaimana sistem tabungan impiannya bekerja? Apakah memotong uang betulan?",
    a: "Sistem tabungan di Dinosaku sepenuhnya menggunakan 'poin/uang virtual' sebagai alat simulasi (bukan uang sungguhan). Anak termotivasi mengerjakan soal demi mengumpulkan koin, dan orang tua akan memberikan hadiah fisik/aslinya di dunia nyata ketika target tabungan virtual tersebut tercapai."
  }
];`;

if (code.includes(oldFaqs)) {
  code = code.replace(oldFaqs, newFaqs);
  fs.writeFileSync('components/FAQ.tsx', code);
  console.log("FAQ questions updated successfully!");
} else {
  console.log("Could not find the old FAQs to replace.");
}
