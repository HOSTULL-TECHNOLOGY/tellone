import { Fragment } from "react";

/** Long camel-case hashtags may only wrap between words, never mid-word. */
export function Hashtag({ tag }: { tag: string }) {
  const parts = tag.split(/(?=[A-Z])/);
  return (
    <span className="hashtag">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {p}
        </Fragment>
      ))}
    </span>
  );
}
