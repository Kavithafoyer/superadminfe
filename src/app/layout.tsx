import React from 'react';
import type { Metadata } from 'next';
import '@/index.css';
import { Providers } from '@/store/providers';

export const metadata: Metadata = {
  title: 'SuperAdmin',
  description: 'Enterprise-grade Next.js starter template with modern layout, static auth, and ReusableTable',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
