import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arc Diagram — AI-Powered Architecture Diagrams",
  description:
    "Create beautiful system architecture diagrams instantly with AI. No login required. Describe your system and watch it come to life.",
  keywords: ["architecture diagram", "AI diagram", "system design", "diagram generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-[#0d0d12] text-white font-[var(--font-inter)]`}
      >
        {children}
      </body>
    </html>
  );
}
