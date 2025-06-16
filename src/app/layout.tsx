import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FilterProvider } from "@/contexts/FilterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RunHub Directory - Australian Run Clubs",
  description: "Find local run clubs across Australia. Connect with runners, explore new routes, and join a community of passionate runners.",
  keywords: "running clubs, Australia, fitness, community, running groups, marathon training",
  authors: [{ name: "RunHub Directory" }],
  openGraph: {
    title: "RunHub Directory - Australian Run Clubs",
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
      <body className={inter.className}>
        <FilterProvider>
          {children}
        </FilterProvider>
      </body>
    </html>
  );
}
