import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/config";
import { ScrollToTopButton } from "@/components/layouts/scroll-to-top";
import Navbar from "@/components/layouts/navbar";
import { SERVERCN_URL } from "@/lib/constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  generator: siteConfig.generator,
  keywords: siteConfig.keywords,
  metadataBase: siteConfig.metadataBase,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.applicationName,
    images: [
      {
        url: `${SERVERCN_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.applicationName
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.creator
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body
        className={`selection:bg-primary selection:text-primary-foreground scroll-pt-10 scroll-smooth antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            <Navbar />
            {children}
            <Footer />
            <ScrollToTopButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
