import React from 'react';
import { LearnShell } from '@/components/dino/LearnShell';
import StorageNotice from '@/components/dino/StorageNotice';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnShell>
      <StorageNotice />
      {children}
    </LearnShell>
  );
}
