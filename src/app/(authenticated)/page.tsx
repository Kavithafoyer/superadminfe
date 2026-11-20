'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootAuthenticatedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-medium">Navigating to Business Overview...</p>
      </div>
    </div>
  );
}
