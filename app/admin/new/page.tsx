import { createClient } from '@supabase/supabase-js';
import NewPostForm from './NewPostForm';

export const runtime = 'edge';

type ActionState = {
  success: boolean;
  message?: string;
};

const initialState: ActionState = { success: false };

async function createPostAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  'use server';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: 'Supabase設定が不足しています。' };
  }

  const accessToken = formData.get('accessToken');
  const title = formData.get('title');
  const slug = formData.get('slug');
  const content = formData.get('content');

  if (!title || !slug || !content) {
    return { success: false, message: '必須項目を入力してください。' };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken.toString()}` }
        : undefined,
    },
  });

  const { error } = await supabase.from('pages').insert({
    title: title.toString(),
    slug: slug.toString(),
    content: content.toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export default function AdminNewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">新規作成</h1>
      <NewPostForm action={createPostAction} initialState={initialState} />
    </div>
  );
}
