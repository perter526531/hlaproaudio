import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AudioCenter | 专业音响 Professional Audio Systems",
  description:
    "AudioCenter - leading manufacturer of professional audio systems: line arrays, subwoofers, amplifiers, mixers and more. 专业音响系统制造商，线阵列、低音炮、功放、调音台等。",
  keywords: [
    "AudioCenter",
    "professional audio",
    "line array",
    "loudspeaker",
    "amplifier",
    "专业音响",
    "线阵列",
    "功放",
    "调音台",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
