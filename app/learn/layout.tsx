import React from 'react';
import { LearnShell } from '@/components/dino/LearnShell';
import StorageNotice from '@/components/dino/StorageNotice';
import { getSessionUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <LearnShell
      user={user ? { 
        fullName: user.fullName, 
        avatarUrl: user.avatarUrl,
        gamification: user.gamification 
      } : null}
    >
      <StorageNotice />
      {children}
    </LearnShell>
  );
}
