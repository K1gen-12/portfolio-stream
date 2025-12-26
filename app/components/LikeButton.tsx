'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type LikeButtonProps = {
  pageId: string;
};

export default function LikeButton({ pageId }: LikeButtonProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('count')
        .eq('page_id', pageId)
        .single();

      if (cancelled) return;

      if (!error && data) {
        setLikes(data.count);
      } else {
        setLikes(0);
      }
    };

    fetchLikes();

    return () => {
      cancelled = true;
    };
  }, [pageId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    setLikes((prev) => (prev ?? 0) + 1);
    const { error } = await supabase.rpc('increment_like', {
      p_page_id: pageId,
    });

    if (error) {
      console.error(error);
      setLikes((prev) => (prev ?? 1) - 1);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
    >
      👍 いいね {likes ?? 0}
    </button>
  );
}
