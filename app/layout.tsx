import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nyaya — AI Dispute Defense for Freelancers & Merchants',
  description:
    'Upload your contract, paste communication logs, and generate a professional, legally-sound chargeback rebuttal letter in seconds. Powered by BharatCode qwen-3.8-27b.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
