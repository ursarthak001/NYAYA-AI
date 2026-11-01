import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <span>Nyaya AI (न्याय) — BharatCode Build League Hackathon 2026</span>
      <div className="footer-links">
        <span>Model: qwen-3.8-27b</span>
        <div className="footer-sep" />
        <span>Native fetch · Zero external SDKs</span>
        <div className="footer-sep" />
        <Link href="/terms" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>
          Terms &amp; Privacy
        </Link>
      </div>
    </footer>
  );
}
