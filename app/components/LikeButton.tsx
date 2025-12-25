'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type LikeButtonProps = {
  pageId: string;
  initialLikes: number;
};

export default function LikeButton({ pageId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const nextLikes = likes + 1;
    setLikes(nextLikes);
    const { error } = await supabase
      .from('pages')
      .update({ likes: nextLikes })
      .eq('id', pageId);

    if (error) {
      console.error(error);
      setLikes(likes);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
    >
      👍 いいね {likes}
    </button>
  );
}
