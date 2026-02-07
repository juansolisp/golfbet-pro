import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GolfBet Pro - Social Golf Betting',
    template: '%s | GolfBet Pro',
  },
  description: 'Plataforma de apuestas sociales de golf. Crea, gestiona y liquida apuestas entre amigos de manera automática.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GolfBet Pro',
  },
  openGraph: {
    type: 'website',
    title: 'GolfBet Pro',
    description: 'Social Golf Betting Platform',
    siteName: 'GolfBet Pro',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#052e16',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="min-h-screen bg-dark-950">
          {children}
        </div>
      </body>
    </html>
  );
}
