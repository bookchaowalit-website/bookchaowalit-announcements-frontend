import type { Metadata } from "next";
import { Lora, Work_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const bulletinDisplay = Lora({ variable: "--font-bulletin-display", subsets: ["latin"] });
const bulletinSans = Work_Sans({ variable: "--font-bulletin-sans", subsets: ["latin"] });
const bulletinMono = Work_Sans({ variable: "--font-bulletin-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "Circular — Notice desk", description: "Compose and review local announcements.", metadataBase: new URL("https://announcements.bookchaowalit.com"), alternates: { canonical: "https://announcements.bookchaowalit.com" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${bulletinDisplay.variable} ${bulletinSans.variable} ${bulletinMono.variable}`}><body><Analytics /><SpeedInsights />{children}</body></html>;
}
