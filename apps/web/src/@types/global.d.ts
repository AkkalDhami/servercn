/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
