export const runtime = 'edge';

import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Portfolio Stream Blog',
  description: 'Personal blog powered by Supabase.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-slate-800">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-semibold text-slate-100">
                Portfolio Stream
              </Link>
              <nav className="flex gap-4 text-sm text-slate-300">
                <Link href="/posts">記事一覧</Link>
                <Link href="/admin">管理画面</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
