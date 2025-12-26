'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type ActionState = {
  success: boolean;
  message?: string;
};

type NewPostFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialState: ActionState;
};

export default function NewPostForm({ action, initialState }: NewPostFormProps) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction] = useFormState(action, initialState);

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
    if (state.success) {
      setIsModalOpen(true);
    }
  }, [state.success]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/admin');
  };

  return (
    <>
      <form
        action={formAction}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <input type="hidden" name="accessToken" value={accessToken} />
        <label className="space-y-2 text-sm block">
          <span>タイトル</span>
          <input
            name="title"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>スラッグ</span>
          <input
            name="slug"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm block">
          <span>本文（Markdown）</span>
          <textarea
            name="content"
            className="min-h-[240px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono"
            required
          />
        </label>
        {state.message && !state.success && (
          <p className="text-sm text-red-300">{state.message}</p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            保存
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-sm text-slate-200">記事を作成しました</p>
            <button
              type="button"
              onClick={handleModalClose}
              className="mt-4 w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
