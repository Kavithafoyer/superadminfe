'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPagesForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login/forgot-password');
  }, [router]);

  return null;
}
