"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { STATIC_FILE } from "@/lib/navigate";
import { watchUrl, type Video } from "@/data/videos";

/**
 * A YouTube video card: thumbnail and play button. On the hosted site it plays in place (privacy-enhanced embed);
 * in the offline file preview, which YouTube's player does not support, it opens the video on YouTube.
 * If the thumbnail cannot load (offline, or YouTube blocked), a branded card with the candidate shows instead.
 */
export function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const thumb = useRef<HTMLImageElement>(null);
  const watch = watchUrl(video.id);
  // An image that failed before hydration never fires onError, so check once after mount
  useEffect(() => {
    const img = thumb.current;
    if (img && img.complete && img.naturalWidth === 0) setThumbFailed(true);
  }, []);
  return (
    <article className={`vcard${featured ? " vcard-featured" : ""}`}>
      <div className="vcard-screen">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="vcard-thumb"
            aria-label={`Play: ${video.title}`}
            onClick={() => {
              window.dispatchEvent(new Event("tbh:video-play"));
              if (STATIC_FILE || location.protocol === "file:") window.open(watch, "_blank", "noopener");
              else setPlaying(true);
            }}
          >
            {thumbFailed ? (
              <span className="vcard-fallback" aria-hidden>
                <img src="/people/peter-obi-560.webp" alt="" loading="lazy" />
              </span>
            ) : (
              <img ref={thumb} src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" onError={() => setThumbFailed(true)} />
            )}
            <span className="vcard-play" aria-hidden>
              <Play size={featured ? 34 : 24} />
            </span>
            <span className="vcard-yt" aria-hidden>
              YouTube
            </span>
          </button>
        )}
      </div>
      <div className="vcard-body">
        <p className="vcard-source">{video.source}</p>
        <h3 className="vcard-title">{video.title}</h3>
        <a href={watch} className="vcard-link small" rel="noopener" target="_blank">
          Watch on YouTube
        </a>
      </div>
    </article>
  );
}
