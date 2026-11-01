import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Nyaya — AI Dispute Defense for Freelancers & Merchants',
  description:
    'Upload your contract, paste communication logs, and generate an administrative, bank-compliant chargeback rebuttal letter in seconds. Powered by BharatCode qwen-3.8-27b.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

