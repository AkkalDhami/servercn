export const GA_ID = "G-E2NXRTBQ38";

export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    window.gtag("config", GA_ID, {
      page_path: url
    });
  }
};
