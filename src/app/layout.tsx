import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'mbps.pro - Real Internet Speed Test',
  description:
    'Test your real download speed across 6 CDN providers. Detect ISP throttling and peering issues instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-[#050606] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
