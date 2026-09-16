import re

with open('app/learn/tracker/TrackerClient.tsx', 'r') as f:
    content = f.read()

# 1. Remove reset button from page-heading
content = re.sub(
    r'<header className="page-heading flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">.*?</header>',
    '''<header className="page-heading">
                <p className="eyebrow">Manajemen Keuangan</p>
                <h1>Dompet & Impianku</h1>
                <p>Catat uang jajanmu dan tabung untuk membeli impianmu!</p>
            </header>''',
    content,
    flags=re.DOTALL
)

# 2. Extract sections
# Find KIRI and KANAN
kiri_pattern = r'{/\* KIRI: Financial Goals & Alokasi \(ditukar\) \*/}.*?{/\* KANAN: Form Transaksi & Riwayat \(ditukar\) \*/}'
kiri_match = re.search(kiri_pattern, content, re.DOTALL)

kanan_pattern = r'{/\* KANAN: Form Transaksi & Riwayat \(ditukar\) \*/}.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*\);\s*}'
kanan_match = re.search(kanan_pattern, content, re.DOTALL)

if not kiri_match or not kanan_match:
    print("Failed to find sections")
    exit(1)

kanan_content = kanan_match.group(0)

# Replace "Catatan Uang" with new title and reset button
kanan_content = kanan_content.replace(
    '<h3 className="font-heading font-bold text-xl text-brand-primary">Catatan Uang</h3>',
    '''<div className="flex justify-between items-center">
                                <h3 className="font-heading font-bold text-xl text-brand-primary">Catatan Uang</h3>
                                <button 
                                    onClick={handleReset}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-soft hover:bg-danger/20 text-danger rounded-xl font-bold text-xs transition-colors border border-danger/20"
                                >
                                    <RefreshCcw size={14} /> Reset Dompet
                                </button>
                            </div>'''
)

# Modify GoalCard grid to use multiple columns for full width
kiri_content = kiri_match.group(0)
kiri_content = kiri_content.replace('<div className="grid gap-4">', '<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">')

# Strip outer div from Kanan and Kiri
kanan_inner = re.search(r'<div className="lg:col-span-5 space-y-6">(.*?)</div>\s*</div>\s*</div>\s*</div>\s*</div>', kanan_content, re.DOTALL).group(1)
kiri_inner = re.search(r'<div className="lg:col-span-7 space-y-6">(.*?){/\* KANAN:', kiri_content, re.DOTALL).group(1)

new_layout = f'''                {{/* Main Content Grid: Top Row (Transactions) */}}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {kanan_inner}
                </div>

                {{/* Bottom Row: Financial Goals */}}
                <div className="space-y-6 mt-8">
                    {kiri_inner}
                </div>
            </div>
        </div>
    );
}}'''

content = content[:kiri_match.start()] + new_layout

with open('app/learn/tracker/TrackerClient.tsx', 'w') as f:
    f.write(content)

print("Rewritten successfully")
