'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">ログイン</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <label className="space-y-2 text-sm block">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
