import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
  authors: siteConfig.authors,
  generator: siteConfig.generator,
  keywords: siteConfig.keywords,
  metadataBase: siteConfig.metadataBase,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body
        className={`antialiased selection:bg-primary selection:text-primary-foreground max-w-387.5 mx-auto`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
