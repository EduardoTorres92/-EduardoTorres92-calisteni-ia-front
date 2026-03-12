"use client";

import { useState } from "react";

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }
    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function extractYouTubeUrls(text: string): string[] {
  const regex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^\s)]+|youtu\.be\/[^\s)]+)/g;
  const matches = text.match(regex);
  if (!matches) return [];
  const seen = new Set<string>();
  return matches.filter((url) => {
    const id = extractVideoId(url);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

interface YouTubeEmbedProps {
  url: string;
}

export function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mt-2 block h-[140px] w-full overflow-hidden rounded-xl"
    >
      {!thumbnailError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt="Vídeo demonstrativo"
            className="absolute inset-0 size-full object-cover rounded-xl"
            onError={() => setThumbnailError(true)}
          />
          <div className="absolute inset-0 rounded-xl bg-black/20 transition-colors group-hover:bg-black/30" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-muted" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 68 48"
          className="size-14 drop-shadow-lg"
          aria-hidden="true"
        >
          <path
            d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
            fill="#FF0000"
          />
          <path d="M45 24 27 14v20" fill="#fff" />
        </svg>
      </div>
    </a>
  );
}
