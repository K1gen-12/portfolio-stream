'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;

      if (error || !data.user) {
        router.replace('/login');
      }
    };

    checkUser();

    return () => {
      active = false;
    };
  }, [router]);

  return <>{children}</>;
}
