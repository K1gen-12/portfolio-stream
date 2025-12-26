'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { PostRecord } from '@/lib/types';

export default function AdminPage() {
  const [pages, setPages] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!active) return;

      if (!error && data) {
        setPages(data as PostRecord[]);
      }
      setLoading(false);
    };

    fetchPages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">記事一覧</h1>
        <Link
          href="/admin/new"
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          新規作成
        </Link>
      </div>

      <div className="space-y-4">
        {loading && <p className="text-sm text-slate-400">読み込み中...</p>}
        {!loading && pages.length === 0 && (
          <p className="text-sm text-slate-400">まだ記事がありません。</p>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">/{page.slug}</p>
                <h2 className="text-lg font-semibold text-slate-100">{page.title}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(page.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  ハイライト: {page.is_highlight ? 'はい' : 'いいえ'}
                </span>
                <Link
                  href={`/admin/${page.id}`}
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs"
                >
                  編集
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
