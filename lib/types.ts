export type PostRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  excerpt?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  is_highlight?: boolean;
  likes?: number | null;
};
