'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { primaryColor } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultBg = '#0565FD';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <span className="text-2xl font-bold font-mono">404</span>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button className="gap-2 cursor-pointer">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
