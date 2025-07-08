import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FilterProvider } from "@/contexts/FilterContext";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RUNHUB Directory - Australian Run Clubs",
  description: "Find local run clubs across Australia. Connect with runners, explore new routes, and join a community of passionate runners.",
  keywords: "running clubs, Australia, fitness, community, running groups, marathon training",
  authors: [{ name: "RUNHUB Directory" }],
  openGraph: {
    title: "RUNHUB Directory - Australian Run Clubs",
    description: "Find local run clubs across Australia. Connect with runners, explore new routes, and join a community of passionate runners.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/RH.png" type="image/png" />
        <link rel="icon" href="/RH.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/RH.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/RH.png" />
      </head>
      <body className={inter.className}>
        <FilterProvider>
          {children}
        </FilterProvider>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
