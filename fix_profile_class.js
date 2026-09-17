const fs = require('fs');
let code = fs.readFileSync('app/(dashboard)/profile/_sections/ChildrenProfileSection.tsx', 'utf-8');

const target = `                    <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0 shrink-0">
                        <Input placeholder="Kode Kelas" className="w-full sm:w-28 bg-surface text-sm" suppressHydrationWarning />
                        <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm" suppressHydrationWarning>Gabung</Button>
                    </div>`;

const replacement = `                    <div className="flex w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                        <Link href="/learn/kelas">
                            <Button variant="outline" className="text-brand-primary border-brand-primary hover:bg-brand-primary/5" suppressHydrationWarning>Masuk ke Kelasku</Button>
                        </Link>
                    </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('app/(dashboard)/profile/_sections/ChildrenProfileSection.tsx', code);
  console.log("Successfully replaced input with link!");
} else {
  console.log("Could not find the target string.");
}
