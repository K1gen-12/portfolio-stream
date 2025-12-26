'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PostRecord } from '@/lib/types';

type DeleteState = {
  success: boolean;
  message?: string;
};

type EditPostFormProps = {
  postId: string;
  deleteAction: (prevState: DeleteState, formData: FormData) => Promise<DeleteState>;
  initialDeleteState: DeleteState;
};

const initialForm = {
  title: '',
  slug: '',
  content: '',
};

type FormState = typeof initialForm;

export default function EditPostForm({
  postId,
  deleteAction,
  initialDeleteState,
}: EditPostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [deleteState, deleteFormAction] = useFormState(
    deleteAction,
    initialDeleteState
  );

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setAccessToken(data.session?.access_token ?? '');
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', postId)
        .single();

      if (!active) return;

      if (!error && data) {
        const post = data as PostRecord;
        setForm({
          title: post.title,
          slug: post.slug,
          content: post.content,
        });
      }
      setLoading(false);
    };

    fetchPost();

    return () => {
      active = false;
    };
  }, [postId]);

  useEffect(() => {
    if (deleteState.success) {
      router.push('/admin');
    }
  }, [deleteState.success, router]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    const { error } = await supabase
      .from('pages')
      .update({
        title: form.title,
        slug: form.slug,
        content: form.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    if (error) {
      console.error(error);
      setSaving(false);
      return;
    }

    router.push('/admin');
  };

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm('この記事を削除しますか？')) {
      event.preventDefault();
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-400">読み込み中...</p>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="space-y-2 text-sm block">
          <span>タイトル</span>
          <input
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>スラッグ</span>
          <input
            value={form.slug}
            onChange={(event) => handleChange('slug', event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
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

      <form action={deleteFormAction} onSubmit={handleDeleteSubmit}>
        <input type="hidden" name="accessToken" value={accessToken} />
        <input type="hidden" name="postId" value={postId} />
        {deleteState.message && !deleteState.success && (
          <p className="text-sm text-red-300">{deleteState.message}</p>
        )}
        <button
          type="submit"
          className="rounded-md border border-red-500/60 px-4 py-2 text-sm text-red-200"
        >
          削除
        </button>
      </form>
    </div>
  );
}
