'use client';

import { useEffect, useState } from 'react';

const offlineImage = '/images/offline-placeholder.svg';

type TwitchStatus = {
  online: boolean;
  title?: string;
  userName?: string;
};

export default function TwitchSection() {
  const [status, setStatus] = useState<TwitchStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadStatus = async () => {
      try {
        const response = await fetch('/api/twitch/status');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = (await response.json()) as TwitchStatus;
        if (!cancelled) {
          setStatus(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus({ online: false });
        }
      }
    };

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const channel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL;
  const parent = process.env.NEXT_PUBLIC_TWITCH_PARENT;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold">配信中</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {status?.online && channel && parent ? (
          <iframe
            title="Twitch live"
            className="h-full w-full"
            src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}`}
            allowFullScreen
          />
        ) : (
          <img
            src={offlineImage}
            alt="Offline"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="mt-3 text-sm text-slate-400">
        {status?.online
          ? `配信中: ${status.title ?? 'タイトル未設定'} (${status.userName ?? ''})`
          : '現在オフラインです。'}
      </p>
    </section>
  );
}
