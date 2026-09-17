import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ClassManagerClient } from "./ClassManagerClient";

export const metadata = {
  title: "Manajemen Kelas | Dinosaku",
};

export default async function KelasPage() {
  const user = await requireRole(["teacher"]);

  const classes = await prisma.classroom.findMany({
    where: { teacherId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { students: true }
      }
    }
  });

  return (
    <div className="learning-page max-w-5xl">
      <header className="page-heading">
        <p className="eyebrow">Dasbor Pembimbing</p>
        <h1>Manajemen Kelas</h1>
        <p>Buat dan kelola banyak kelas sekaligus, lalu bagikan kode uniknya ke murid-murid Anda.</p>
      </header>

      <ClassManagerClient initialClasses={classes} teacherId={user.id} />
    </div>
  );
}
