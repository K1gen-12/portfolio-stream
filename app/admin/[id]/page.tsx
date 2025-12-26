import { createClient } from '@supabase/supabase-js';
import EditPostForm from './EditPostForm';

export const runtime = 'edge';

type DeleteState = {
  success: boolean;
  message?: string;
};

const initialDeleteState: DeleteState = { success: false };

async function deletePostAction(
  _prevState: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  'use server';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: 'Supabase設定が不足しています。' };
  }

  const accessToken = formData.get('accessToken');
  const postId = formData.get('postId');

  if (!postId) {
    return { success: false, message: 'IDが取得できませんでした。' };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken.toString()}` }
        : undefined,
    },
  });

  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export default function AdminEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">記事を編集</h1>
      <EditPostForm
        postId={params.id}
        deleteAction={deletePostAction}
        initialDeleteState={initialDeleteState}
      />
    </div>
  );
}
