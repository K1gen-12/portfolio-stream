import { supabase } from './supabase';
import type { PostRecord } from './types';

export async function fetchHighlightedPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('is_highlight', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch highlighted pages', error);
    return [] as PostRecord[];
  }

  return data as PostRecord[];
}

export async function fetchRecentPages(limit = 10) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch recent pages', error);
    return [] as PostRecord[];
  }

  return data as PostRecord[];
}

export async function fetchPageList() {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch pages', error);
    return [] as PostRecord[];
  }

  return data as PostRecord[];
}

export async function fetchPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Failed to fetch page', error);
    return null;
  }

  return data as PostRecord;
}
