import React from 'react';
import Sidebar from '@/components/dino/Sidebar';
import StorageNotice from '@/components/dino/StorageNotice';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="learning-shell flex min-h-dvh flex-col font-sans md:h-dvh md:flex-row md:overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main id="learning-content" tabIndex={-1} className="min-w-0 flex-1 relative md:h-full md:overflow-y-auto">
        <StorageNotice />
        {children}
      </main>
    </div>
  );
}
