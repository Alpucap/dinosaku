export function TermsContent() {
    return (
        <div className="space-y-6 text-secondary leading-relaxed">
            <section>
                <h2 className="text-lg md:text-xl font-heading text-primary mb-2">1. Pendahuluan</h2>
                <p>
                    Selamat datang di Dinosaku! Syarat & Ketentuan ini mengatur penggunaan platform edukasi finansial Dinosaku. Dengan mendaftar dan menggunakan layanan kami, Anda menyetujui seluruh ketentuan yang tertulis di halaman ini.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-heading text-primary mb-2">2. Privasi dan Keamanan Anak</h2>
                <p>
                    Kami memahami bahwa keamanan data anak adalah prioritas utama. Dinosaku berkomitmen penuh untuk melindungi informasi pribadi pengguna di bawah umur. Data Anda dan anak Anda <strong>tidak akan pernah dijual, disewakan, atau dibagikan</strong> kepada pihak ketiga untuk tujuan periklanan atau komersial.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-heading text-primary mb-2">3. Hak Akses dan Peran (Role-Based Access Control)</h2>
                <p className="mb-3">Dinosaku menerapkan pembatasan akses data secara ketat berdasarkan peran pengguna (RBAC) demi menjaga privasi:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                    <li><strong>Siswa / Anak:</strong> Hanya dapat mengakses akunnya sendiri, bermain petualangan finansial, dan melihat pencapaian pribadinya. Tidak dapat melihat data pengguna lain.</li>
                    <li><strong>Orang Tua:</strong> Memiliki akses penuh untuk memantau progres belajar, aktivitas tabungan, dan mengelola tugas khusus untuk <em>anak-anak yang terhubung secara sah dengan akun mereka</em>. Orang tua tidak dapat melihat data anak dari keluarga lain.</li>
                    <li><strong>Guru:</strong> Hanya dapat memantau progres akademik dan literasi finansial dari <em>siswa yang tergabung dalam kode kelas (Class Code) yang sama</em>. Guru tidak memiliki akses ke data privat keuangan keluarga siswa di luar konteks sekolah.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-heading text-primary mb-2">4. Akun dan Keamanan</h2>
                <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda.</li>
                    <li>Segera laporkan kepada tim dukungan kami jika Anda mencurigai adanya penyalahgunaan atau akses tidak sah pada akun Anda.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-heading text-primary mb-2">5. Penggunaan Konten Edukasi</h2>
                <p>
                    Seluruh materi pembelajaran, ilustrasi maskot (Dino), dan konten gamifikasi yang terdapat di dalam Dinosaku adalah hak kekayaan intelektual milik platform. Konten ini disediakan secara eksklusif untuk tujuan pembelajaran pribadi dan dilarang keras untuk disalin atau didistribusikan ulang untuk tujuan komersial tanpa izin tertulis.
                </p>
            </section>
        </div>
    );
}
