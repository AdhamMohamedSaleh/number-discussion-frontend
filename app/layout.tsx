import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Number Discussions - Social Math Platform",
    template: "%s | Number Discussions",
  },
  description: "A social network where people communicate through numbers. Start discussions, respond with math operations, and discover interesting calculation chains.",
  keywords: ["math", "social network", "calculations", "number discussions", "collaborative math"],
  authors: [{ name: "Number Discussions Team" }],
  creator: "Number Discussions",
  publisher: "Number Discussions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Number Discussions",
    title: "Number Discussions - Social Math Platform",
    description: "A social network where people communicate through numbers. Start discussions, respond with math operations, and discover interesting calculation chains.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Number Discussions - Social Math Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Discussions - Social Math Platform",
    description: "A social network where people communicate through numbers.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://number-discussions.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
