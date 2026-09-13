import { Star, Users, Briefcase, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { User } from '@/lib/data/dummy-users';

const ADULT_AVATAR_OPTIONS = [
    "https://api.dicebear.com/10.x/avataaars/svg?topVariant=hijab&seed=wuwu1oq7",
    "https://api.dicebear.com/10.x/avataaars/svg?topVariant=hijab&seed=p5d7w2b6",
    "https://api.dicebear.com/10.x/avataaars/svg?topVariant=hijab&seed=fonb5yf0",
    "https://api.dicebear.com/10.x/avataaars/svg?seed=fooskqu5",
    "https://api.dicebear.com/10.x/avataaars/svg?seed=n2wiknjj",
    "https://api.dicebear.com/10.x/avataaars/svg?seed=laheishi",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    "https://api.dicebear.com/10.x/avataaars/svg?seed=Eapeaaa",
    "https://api.dicebear.com/10.x/avataaars/svg?seed=HeAFAFAOF"
];

const CHILD_AVATAR_OPTIONS = [
    "https://api.dicebear.com/10.x/critters/svg?seed=Dino",
    "https://api.dicebear.com/10.x/critters/svg?seed=Rex",
    "https://api.dicebear.com/10.x/critters/svg?seed=Spike",
    "https://api.dicebear.com/10.x/critters/svg?seed=Bella",
    "https://api.dicebear.com/10.x/critters/svg?seed=Tricera",
    "https://api.dicebear.com/10.x/critters/svg?seed=Ptero"
];

interface Props {
    user: User;
    formData: User;
    isChild: boolean;
    isAvatarOpen: boolean;
    setIsAvatarOpen: (open: boolean) => void;
    handleAvatarChange: (url: string) => void;
}

export function ProfileHeader({ user, formData, isChild, isAvatarOpen, setIsAvatarOpen, handleAvatarChange }: Props) {
    return (
        <Card>
            <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted flex shrink-0 items-center justify-center">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-4xl font-semibold text-muted-foreground">
                            {user.fullName.charAt(0)}
                        </span>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-primary">{user.fullName}</h2>
                        <p className="text-muted-foreground">@{user.username} {user.email && `• ${user.email}`}</p>
                    </div>
                    <Badge variant="outline" className="shadow-none capitalize font-medium px-3 py-1 rounded-full flex items-center w-fit mx-auto md:mx-0 border-border bg-surface">
                        {user.role === 'children' && <Star className="w-3.5 h-3.5 mr-1.5 text-info" />}
                        {user.role === 'parents' && <Users className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />}
                        {user.role === 'teacher' && <Briefcase className="w-3.5 h-3.5 mr-1.5 text-warning" />}
                        {user.role === 'admin' && <Shield className="w-3.5 h-3.5 mr-1.5 text-destructive" />}
                        <span className="text-foreground">{user.role}</span>
                    </Badge>
                </div>

                <div className="shrink-0">
                    <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
                        <DialogTrigger className={buttonVariants({ variant: 'outline' })} suppressHydrationWarning>
                            Ubah Foto
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Pilih Avatar Baru</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-4 py-4">
                                {(isChild ? CHILD_AVATAR_OPTIONS : ADULT_AVATAR_OPTIONS).map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAvatarChange(url)}
                                        className={`h-24 w-24 rounded-full overflow-hidden border-4 transition-all hover:scale-105 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${formData.avatarUrl === url ? 'border-brand-accent scale-110 shadow-md' : 'border-transparent hover:border-brand-secondary/50'}`}
                                    >
                                        <img src={url} alt={`Avatar ${idx}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
