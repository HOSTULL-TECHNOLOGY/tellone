import { peoplePhotos, type PeoplePhoto } from "@/data/photos";

/** Photo mosaic of Nigerians in the movement. Renders nothing until photos are added to src/data/photos.ts. */
export function PeopleMosaic({
  title,
  intro,
  limit = 5,
  offset = 0,
  photos = peoplePhotos,
  headingLevel = 2,
}: {
  title?: string;
  intro?: string;
  limit?: number;
  offset?: number;
  photos?: PeoplePhoto[];
  headingLevel?: 2 | 3;
}) {
  if (!photos.length) return null;
  // Rotate through the list so different pages show different faces
  const list = Array.from({ length: Math.min(limit, photos.length) }, (_, i) => photos[(i + offset) % photos.length]);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="people-mosaic">
      {title && <H className="people-mosaic-title">{title}</H>}
      {intro && <p className="people-mosaic-intro muted">{intro}</p>}
      <ul role="list" className="people-grid" data-count={list.length}>
        {list.map((p, i) => (
          <li key={`${p.base}-${i}`}>
            <figure>
              <picture>
                <source type="image/webp" srcSet={`${p.base}-480.webp 480w, ${p.base}-960.webp 960w`} sizes="(min-width: 1024px) 33vw, 50vw" />
                <img src={`${p.base}.jpg`} alt={p.alt} loading="lazy" decoding="async" width={480} height={Math.round(480 / (p.ratio ?? 1.5))} />
              </picture>
              {(p.caption || p.credit) && (
                <figcaption>
                  {p.caption}
                  {p.credit && <span className="people-credit"> · {p.credit}</span>}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A single captioned photo (e.g. the polling-unit photo on the election pages). */
export function PhotoFigure({ photo, sizes = "(min-width: 900px) 640px, 100vw" }: { photo: PeoplePhoto; sizes?: string }) {
  return (
    <figure className="photo-figure">
      <picture>
        <source type="image/webp" srcSet={`${photo.base}-480.webp 480w, ${photo.base}-960.webp 960w`} sizes={sizes} />
        <img src={`${photo.base}.jpg`} alt={photo.alt} loading="lazy" decoding="async" width={640} height={Math.round(640 / (photo.ratio ?? 1.5))} />
      </picture>
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
}
