import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "GoWheels | Bike & Car Rentals",
    template: "%s | GoWheels",
  },
  description:
    "Find and book bikes, scooters, and cars with GoWheels. Compare vehicles, check availability, and reserve your ride online.",
  applicationName: "GoWheels",
  keywords: [
    "GoWheels",
    "bike rental",
    "car rental",
    "scooter rental",
    "vehicle booking",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "GoWheels",
    title: "GoWheels | Bike & Car Rentals",
    description:
      "Find and book bikes, scooters, and cars with GoWheels. Compare vehicles, check availability, and reserve your ride online.",
    images: siteUrl
      ? [{ url: new URL("/gowheels.png", siteUrl), alt: "GoWheels" }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "GoWheels | Bike & Car Rentals",
    description:
      "Find and book bikes, scooters, and cars with GoWheels. Compare vehicles, check availability, and reserve your ride online.",
    images: siteUrl ? [new URL("/gowheels.png", siteUrl).toString()] : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
