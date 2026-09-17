import { Star, Users, Briefcase, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { User } from '@/lib/data/dummy-users';

const dicebear = (style: string, seeds: string[], query = "") =>
    seeds.map((seed) => `https://api.dicebear.com/10.x/${style}/svg?${query}seed=${seed}`);

const AVATAAR_SAFE_BASE = "mouthVariant=smile&eyesVariant=default&eyebrowsVariant=default&facialHairProbability=0";

const createHijabAvatar = (seed: string, hatColor: string) =>
    `https://api.dicebear.com/10.x/avataaars/svg?${AVATAAR_SAFE_BASE}&topVariant=hijab&hatColor=${hatColor}&seed=${seed}`;

const createMaleAvatar = (seed: string) =>
    `https://api.dicebear.com/10.x/avataaars/svg?${AVATAAR_SAFE_BASE}&topVariant=shortFlat,shortRound,shortWaved,theCaesar&seed=${seed}`;

const createFemaleAvatar = (seed: string) =>
    `https://api.dicebear.com/10.x/avataaars/svg?${AVATAAR_SAFE_BASE}&topVariant=straight01,straight02,straightAndStrand,curvy,bob,bun&seed=${seed}`;

const PARENT_AVATAR_OPTIONS = [
    createHijabAvatar("Siti", "26a69a"),
    createHijabAvatar("Aminah", "29b6f6"),
    createHijabAvatar("Laila", "7e57c2"),
    createHijabAvatar("Salma", "00796b"),
    createHijabAvatar("Aisyah", "e91e63"),
    createHijabAvatar("Nadia", "f57c00"),
    createHijabAvatar("Maryam", "3f51b5"),
    createHijabAvatar("Fatimah", "795548"),
    createMaleAvatar("AyahBudi"),
    createMaleAvatar("AyahHendra"),
    createMaleAvatar("AyahSurya"),
    createMaleAvatar("AyahDedi"),
    createMaleAvatar("AyahIndra"),
    createMaleAvatar("AyahGunawan"),
    createMaleAvatar("AyahRian"),
    createMaleAvatar("AyahJoko"),
    createFemaleAvatar("BundaWulan"),
    createFemaleAvatar("BundaDewi"),
    createFemaleAvatar("BundaMaya"),
    createFemaleAvatar("BundaSari"),
    createFemaleAvatar("BundaFitri"),
    createFemaleAvatar("BundaRatna"),
    createFemaleAvatar("BundaAyu"),
    createFemaleAvatar("BundaIndah"),
];

const TEACHER_AVATAR_OPTIONS = [
    createHijabAvatar("GuruSiti", "26a69a"),
    createHijabAvatar("GuruAminah", "29b6f6"),
    createHijabAvatar("GuruLaila", "7e57c2"),
    createHijabAvatar("GuruSalma", "00796b"),
    createHijabAvatar("GuruAisyah", "e91e63"),
    createHijabAvatar("GuruNadia", "f57c00"),
    createHijabAvatar("GuruMaryam", "3f51b5"),
    createHijabAvatar("GuruFatimah", "795548"),
    createMaleAvatar("PakBudi"),
    createMaleAvatar("PakAndi"),
    createMaleAvatar("PakJoko"),
    createMaleAvatar("PakFajar"),
    createMaleAvatar("PakAgus"),
    createMaleAvatar("PakSurya"),
    createMaleAvatar("PakHendra"),
    createMaleAvatar("PakRian"),
    createFemaleAvatar("BuSari"),
    createFemaleAvatar("BuRina"),
    createFemaleAvatar("BuMaya"),
    createFemaleAvatar("BuDewi"),
    createFemaleAvatar("BuIndah"),
    createFemaleAvatar("BuRatna"),
    createFemaleAvatar("BuWulan"),
    createFemaleAvatar("BuFitri"),
];

const ADMIN_AVATAR_OPTIONS = [
    ...dicebear("bottts", ["Admin1", "Admin2", "Admin3", "Admin4", "Admin5", "Admin6"]),
    ...dicebear("bottts-neutral", ["Sistem", "Server", "Data", "Modul", "Kontrol", "Panel"]),
    ...dicebear("toon-head", ["Operator", "Pengelola", "Supervisor", "Koordinator"]),
    ...dicebear("miniavs", ["Staf", "Tim", "Manajer", "Kepala"]),
    ...dicebear("dylan", ["Pusat", "Markas", "Kantor", "Ruang"]),
];

const CHILD_AVATAR_OPTIONS = [
    ...dicebear("critters", [
        "Dino", "Rex", "Spike", "Bella",
        "Tricera", "Ptero", "Bronto", "Stego",
        "Raptor", "Compy", "Terra", "Fern",
        "Milo", "Coco", "Bobi", "Ollie",
        "Ziggy", "Gizmo", "Kiki", "Lulu",
        "Nori", "Zuzu", "Pippin", "Sparky"
    ]),
];

const AVATAR_OPTIONS_BY_ROLE: Record<string, string[]> = {
    children: CHILD_AVATAR_OPTIONS,
    parents: PARENT_AVATAR_OPTIONS,
    parent: PARENT_AVATAR_OPTIONS,
    teacher: TEACHER_AVATAR_OPTIONS,
    admin: ADMIN_AVATAR_OPTIONS,
};

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
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Pilih Avatar Baru</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-4 gap-3 sm:gap-4 p-2 max-h-[60vh] overflow-y-auto">
                                {(AVATAR_OPTIONS_BY_ROLE[user.role?.toLowerCase()] ?? PARENT_AVATAR_OPTIONS).map((url, idx) => (
                                    <div key={url} className="aspect-square flex items-center justify-center p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => handleAvatarChange(url)}
                                            aria-label={`Pilih avatar ${idx + 1}`}
                                            className={`h-full w-full rounded-full overflow-hidden border-4 bg-surface-soft transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${formData.avatarUrl === url ? 'border-brand-accent shadow-md ring-2 ring-brand-accent/30' : 'border-transparent hover:border-brand-secondary/50'}`}
                                        >
                                            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover block" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
