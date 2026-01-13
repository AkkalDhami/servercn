import { cn } from "./utils";
import { Geist_Mono as FontMono, Geist as FontSans, Inter, Fira_Code as FontCode } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"]
});

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const fontCode = FontCode({
  subsets: ["latin"],
  variable: "--font-code"
});

export const fontVariables = cn(fontSans.variable, fontMono.variable, fontInter.variable, fontCode.variable);
