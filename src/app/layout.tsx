import type { Metadata, Viewport } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL?.trim() || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")
  ),
  title: {
    default: "Sosyofox",
    template: "%s | Sosyofox"
  },
  description: "Sosyal medya, uygulama, web ve platform büyüme hizmetlerini tek panelden yönetin.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/icon.png",
    apple: "/brand/icon.png"
  },
  openGraph: {
    title: "Sosyofox",
    description: "Büyüme hizmetleri için premium ve güvenli yönetim paneli.",
    images: ["/brand/logo.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${poppins.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
