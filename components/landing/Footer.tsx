"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-tp-border bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-tp-textMuted flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>&copy; {new Date().getFullYear()} TaskPilot. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
