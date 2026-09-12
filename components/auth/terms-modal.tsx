// Component
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TermsContent } from "@/components/shared/terms-content"

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

                <div className="px-6 py-2 md:px-8 md:py-4 overflow-y-auto">
                    <TermsContent />
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
