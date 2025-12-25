import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPageBySlug } from '@/lib/data';
import { renderMarkdown } from '@/lib/markdown';
import LikeButton from '@/app/components/LikeButton';

const defaultThumbnail = '/images/thumbnail-placeholder.svg';

export default async function PageDetail({ params }: { params: { slug: string } }) {
  const page = await fetchPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const html = renderMarkdown(page.content);

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <Link href="/posts" className="text-sm text-slate-400">
          ← 記事一覧へ
        </Link>
        <h1 className="text-3xl font-semibold text-slate-100">{page.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>{new Date(page.created_at).toLocaleDateString('ja-JP')}</span>
          {page.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
              #{tag}
            </span>
          ))}
        </div>
        <div className="aspect-video overflow-hidden rounded-2xl border border-slate-800">
          <img
            src={page.thumbnail_url || defaultThumbnail}
            alt={page.title}
            className="h-full w-full object-cover"
          />
        </div>
      </header>
      <section
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <LikeButton pageId={page.id} />
    </article>
  );
}
