import Link from 'next/link';
import { fetchPageList } from '@/lib/data';

export default async function PostsPage() {
  const pages = await fetchPageList();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">記事一覧</h1>
      <div className="space-y-4">
        {pages.length === 0 && (
          <p className="text-sm text-slate-400">まだ記事がありません。</p>
        )}
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/posts/${page.slug}`}
            className="block rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-600"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-100">{page.title}</h2>
              <span className="text-xs text-slate-400">
                {new Date(page.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
            {page.excerpt && (
              <p className="mt-2 text-sm text-slate-400">{page.excerpt}</p>
            )}
            {page.tags && page.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
