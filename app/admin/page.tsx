'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PageRecord } from '@/lib/types';

const initialForm = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  thumbnailUrl: '',
  isHighlight: false,
};

type FormState = typeof initialForm;

export default function AdminPage() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);

  const loadPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPages(data as PageRecord[]);
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.slug || !form.content) return;

    setLoading(true);
    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 3);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      tags: tags.length > 0 ? tags : null,
      thumbnail_url: form.thumbnailUrl || null,
      is_highlight: form.isHighlight,
      updated_at: new Date().toISOString(),
    };

    const { error } = form.id
      ? await supabase.from('pages').update(payload).eq('id', form.id)
      : await supabase
          .from('pages')
          .insert({ ...payload, created_at: new Date().toISOString(), likes: 0 });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setForm(initialForm);
    await loadPages();
    setLoading(false);
  };

  const handleEdit = (page: PageRecord) => {
    setForm({
      id: page.id,
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt ?? '',
      content: page.content,
      tags: page.tags?.join(', ') ?? '',
      thumbnailUrl: page.thumbnail_url ?? '',
      isHighlight: page.is_highlight,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このページを削除しますか？')) return;
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) {
      console.error(error);
      return;
    }
    await loadPages();
  };

  const handleReset = () => setForm(initialForm);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">管理画面</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>タイトル</span>
            <input
              value={form.title}
              onChange={(event) => handleChange('title', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              required
            />
          </label>
          <label className="space-y-2 text-sm">
            <span>スラッグ</span>
            <input
              value={form.slug}
              onChange={(event) => handleChange('slug', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              required
            />
          </label>
        </div>
        <label className="space-y-2 text-sm block">
          <span>抜粋</span>
          <textarea
            value={form.excerpt}
            onChange={(event) => handleChange('excerpt', event.target.value)}
            className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>本文（Markdown）</span>
          <textarea
            value={form.content}
            onChange={(event) => handleChange('content', event.target.value)}
            className="min-h-[240px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono"
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>タグ（カンマ区切りで最大3つ）</span>
            <input
              value={form.tags}
              onChange={(event) => handleChange('tags', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span>サムネイルURL</span>
            <input
              value={form.thumbnailUrl}
              onChange={(event) => handleChange('thumbnailUrl', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isHighlight}
            onChange={(event) => handleChange('isHighlight', event.target.checked)}
          />
          ハイライトに表示する
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {form.id ? '更新する' : '追加する'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm"
          >
            フォームをリセット
          </button>
        </div>
      </form>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">記事一覧</h2>
        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">/{page.slug}</p>
                  <h3 className="text-lg font-semibold text-slate-100">{page.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(page)}
                    className="rounded-md border border-slate-700 px-3 py-1 text-xs"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(page.id)}
                    className="rounded-md border border-red-500/60 px-3 py-1 text-xs text-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ハイライト: {page.is_highlight ? 'はい' : 'いいえ'} | いいね: {page.likes ?? 0}
              </p>
            </div>
          ))}
          {pages.length === 0 && (
            <p className="text-sm text-slate-400">まだ記事がありません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
