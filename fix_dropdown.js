const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/kelas/ClassManagerClient.tsx', 'utf-8');

const target = `<DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>`;

const replacement = `<DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-soft text-text-muted hover:text-text-primary outline-none">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>`;

code = code.replace(target, replacement);
fs.writeFileSync('app/pembimbing/kelas/ClassManagerClient.tsx', code);
