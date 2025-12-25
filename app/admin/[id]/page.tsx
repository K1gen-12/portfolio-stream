'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PageRecord } from '@/lib/types';

const initialForm = {
  title: '',
  slug: '',
  tags: '',
  thumbnailUrl: '',
  isHighlight: false,
  content: '',
};

type FormState = typeof initialForm;

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPage = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!active) return;

      if (!error && data) {
        const page = data as PageRecord;
        setForm({
          title: page.title,
          slug: page.slug,
          tags: page.tags?.join(', ') ?? '',
          thumbnailUrl: page.thumbnail_url ?? '',
          isHighlight: page.is_highlight,
          content: page.content,
        });
      }
      setLoading(false);
    };

    fetchPage();

    return () => {
      active = false;
    };
  }, [params.id]);

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 3);

    const { error } = await supabase
      .from('pages')
      .update({
        title: form.title,
        slug: form.slug,
        tags: tags.length > 0 ? tags : null,
        thumbnail_url: form.thumbnailUrl || null,
        is_highlight: form.isHighlight,
        content: form.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      console.error(error);
      setSaving(false);
      return;
    }

    router.push('/admin');
  };

  if (loading) {
    return <p className="text-sm text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">記事を編集</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
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
          <span>タグ（カンマ区切り）</span>
          <input
            value={form.tags}
            onChange={(event) => handleChange('tags', event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>サムネイルURL</span>
          <input
            value={form.thumbnailUrl}
            onChange={(event) => handleChange('thumbnailUrl', event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isHighlight}
            onChange={(event) => handleChange('isHighlight', event.target.checked)}
          />
          ハイライトにする
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
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            更新
          </button>
        </div>
      </form>
    </div>
  );
}
