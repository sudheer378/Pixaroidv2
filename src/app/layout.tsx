import type { Metadata } from "next";
import "./globals.css";
import { siteSeo } from "@/core/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteSeo.url),
  title: {
    default: siteSeo.title,
    template: "%s | Pixora",
  },
  description: siteSeo.description,
  applicationName: "Pixora",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Pixora",
    title: siteSeo.title,
    description: siteSeo.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
