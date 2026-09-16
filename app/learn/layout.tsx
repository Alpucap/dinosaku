import React from 'react';
import { LearnShell } from '@/components/dino/LearnShell';
import StorageNotice from '@/components/dino/StorageNotice';
import { requireRole } from '@/lib/auth/guard';

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["children"]);

  return (
    <LearnShell
      user={{ 
        fullName: user.fullName, 
        avatarUrl: user.avatarUrl,
        role: user.role,
        gamification: user.gamification 
      }}
    >
      <StorageNotice />
      {children}
    </LearnShell>
  );
}
