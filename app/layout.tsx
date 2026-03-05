import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilvantaggioai.it";

export const metadata: Metadata = {
  title: {
    default: "IlVantaggioAI — Il blog italiano sull'Intelligenza Artificiale",
    template: "%s | IlVantaggioAI",
  },
  description:
    "Scopri come l'AI sta trasformando il lavoro, il business e la vita quotidiana. Casi d'uso reali, tutorial, tools e opinioni.",
  keywords: ["intelligenza artificiale", "AI", "machine learning", "tutorial AI", "blog AI italiano"],
  authors: [{ name: "Anselmo", url: SITE_URL }],
  creator: "Anselmo",
  publisher: "IlVantaggioAI",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "IlVantaggioAI",
    title: "IlVantaggioAI — Il blog italiano sull'Intelligenza Artificiale",
    description: "Analisi, tutorial e casi d'uso reali sull'AI per professionisti italiani.",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "IlVantaggioAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IlVantaggioAI — Il blog italiano sull'AI",
    description: "Analisi, tutorial e casi d'uso reali sull'AI per professionisti italiani.",
    images: ["/og-default.svg"],
    creator: "@ilvantaggioai",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "it-IT": SITE_URL },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
