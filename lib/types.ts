export type PageRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  tags: string[] | null;
  thumbnail_url: string | null;
  is_highlight: boolean;
  created_at: string;
  updated_at: string | null;
  likes: number | null;
};
