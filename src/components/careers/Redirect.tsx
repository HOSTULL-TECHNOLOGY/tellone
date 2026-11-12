"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { go } from "@/lib/navigate";

/** Sends the visitor on to the new address (used where the server cannot redirect, e.g. the offline preview). */
export function Redirect({ to }: { to: string }) {
  const path = usePathname() ?? "";
  useEffect(() => {
    const lang = path.split("/").filter(Boolean)[0];
    go(["pcm", "yo", "ha", "ig"].includes(lang ?? "") ? `/${lang}${to}` : to);
  }, [path, to]);
  return null;
}
