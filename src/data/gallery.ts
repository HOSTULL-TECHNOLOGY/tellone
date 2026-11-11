/** One picture in a gallery: small and large sources, caption, and an optional download (e.g. a print-quality poster). */
export type GalleryItem = { key: string; thumbWebp: string; thumbJpg: string; fullWebp: string; fullJpg: string; alt: string; label: string; download?: string; ratio?: number };

/** A campaign poster as a gallery item (files in /public/media: poster-<lang>-480/800/1320). */
export const posterItem = (lang: string, label: string, alt: string): GalleryItem => ({
  key: `poster-${lang}`,
  thumbWebp: `/media/poster-${lang}-480.webp 480w, /media/poster-${lang}-800.webp 800w`,
  thumbJpg: `/media/poster-${lang}-480.jpg`,
  fullWebp: `/media/poster-${lang}-1320.webp`,
  fullJpg: `/media/poster-${lang}-800.jpg`,
  alt,
  label,
  download: `/media/poster-${lang}-1320.jpg`,
  ratio: 480 / 580,
});
