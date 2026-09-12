// Component
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Type
interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl lg:max-w-4xl w-[90vw] max-h-[85vh] flex flex-col p-0 overflow-hidden border-t-[6px] border-brand-primary">
                <DialogHeader className="p-6 pb-2 border-b border-border">
                    <DialogTitle className="text-2xl font-heading text-primary">Syarat & Ketentuan</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-2 md:px-8 md:py-4 overflow-y-auto text-secondary text-sm md:text-base leading-relaxed">
                    <ol className="list-decimal list-outside pl-5 md:pl-6 space-y-6 marker:font-heading marker:text-primary marker:text-lg">
                        <li className="pl-2">
                            <h3 className="text-lg font-heading text-primary mb-2 -ml-2">Pendahuluan</h3>
                            <p>Selamat datang di Dinosaku! Syarat & Ketentuan ini mengatur penggunaan platform edukasi Dinosaku. Dengan mendaftar dan menggunakan layanan kami, Anda menyetujui seluruh ketentuan yang tertulis.</p>
                        </li>

                        <li className="pl-2">
                            <h3 className="text-lg font-heading text-primary mb-2 -ml-2">Privasi dan Keamanan Anak</h3>
                            <p>Kami memahami bahwa keamanan data anak adalah prioritas utama. Dinosaku berkomitmen untuk melindungi informasi pribadi pengguna. Data Anda dan anak Anda <strong>tidak akan pernah dijual, disewakan, atau dibagikan</strong> kepada pihak ketiga untuk tujuan periklanan atau komersial. Kami menggunakan enkripsi standar industri untuk melindungi data Anda.</p>
                        </li>

                        <li className="pl-2">
                            <h3 className="text-lg font-heading text-primary mb-2 -ml-2">Akun dan Keamanan</h3>
                            <ul className="list-disc list-outside pl-5 space-y-1 mt-2">
                                <li>Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi akun Anda.</li>
                                <li>Satu akun dapat digunakan oleh Orang Tua, Guru, dan Anak sesuai perannya.</li>
                                <li>Segera laporkan kepada kami jika Anda mencurigai adanya penyalahgunaan pada akun Anda.</li>
                            </ul>
                        </li>

                        <li className="pl-2">
                            <h3 className="text-lg font-heading text-primary mb-2 -ml-2">Penggunaan Konten Edukasi</h3>
                            <p>Seluruh materi pembelajaran, ilustrasi maskot, dan konten interaktif yang terdapat di dalam Dinosaku adalah hak cipta milik platform. Konten ini disediakan untuk tujuan pembelajaran pribadi dan tidak diperkenankan untuk disalin atau didistribusikan ulang untuk tujuan komersial tanpa izin tertulis.</p>
                        </li>
                    </ol>
                </div>

                <DialogFooter className="p-6 border-t border-border bg-surface-soft">
                    <Button
                        onClick={onClose}
                        className="bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl font-heading"
                    >
                        Mengerti
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
