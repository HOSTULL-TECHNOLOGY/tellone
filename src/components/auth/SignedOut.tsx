"use client";

import Link from "next/link";
import { useEffect } from "react";
import { signOut } from "@/lib/auth";
import { FormSuccess } from "@/components/ui/Form";

/** Clears the demo session (in case the user arrived here directly) and confirms sign-out. */
export function SignedOut() {
  useEffect(() => signOut(), []);
  return (
    <div className="auth-card form-grid">
      <FormSuccess title="You're signed out">On a shared phone, also close the browser tab.</FormSuccess>
      <div className="form-actions">
        <Link href="/" className="btn btn-primary">
          Back to the website
        </Link>
        <Link href="/login" className="btn btn-outline">
          Sign in again
        </Link>
      </div>
    </div>
  );
}
