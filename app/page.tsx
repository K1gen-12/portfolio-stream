import Link from 'next/link';
import TwitchSection from './components/TwitchSection';
import { fetchHighlightedPages, fetchRecentPages } from '@/lib/data';

const defaultThumbnail = '/images/thumbnail-placeholder.svg';

export default async function Home() {
  const [highlights, recentPages] = await Promise.all([
    fetchHighlightedPages(),
    fetchRecentPages(12),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">ハイライト記事</h1>
          <Link href="/posts" className="text-sm text-slate-300">
            すべての記事を見る
          </Link>
        </div>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {highlights.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
              ハイライト記事がまだありません。
            </div>
          )}
          {highlights.map((page) => (
            <Link
              key={page.id}
              href={`/posts/${page.slug}`}
              className="min-w-[280px] max-w-sm flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-slate-600"
            >
              <div className="aspect-video w-full overflow-hidden rounded-t-2xl border-b border-slate-800">
                <img
                  src={page.thumbnail_url || defaultThumbnail}
                  alt={page.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-slate-100">{page.title}</h3>
                <p className="text-sm text-slate-400">
                  {page.excerpt || '抜粋がまだありません。'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TwitchSection />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">最近更新された記事</h2>
        <div className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-2">
          {recentPages.length === 0 && (
            <p className="text-sm text-slate-400">まだ記事がありません。</p>
          )}
          {recentPages.map((page) => (
            <Link
              key={page.id}
              href={`/posts/${page.slug}`}
              className="block text-sm text-slate-300 hover:text-slate-100"
            >
              {page.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">自己紹介</h2>
        <p className="mt-3 text-sm text-slate-300">
          個人開発と配信のログをまとめるためのブログです。作りながら考えたことを、
          そのまま残していきます。
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href="https://x.com" target="_blank" rel="noreferrer">
            Xを見る
          </a>
          <a href="https://twitch.tv" target="_blank" rel="noreferrer">
            Twitchを見る
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
        <a
          href="https://marshmallow-qa.com"
          target="_blank"
          rel="noreferrer"
          className="text-base font-semibold"
        >
          質問・感想はこちら
        </a>
      </section>
    </div>
  );
}
