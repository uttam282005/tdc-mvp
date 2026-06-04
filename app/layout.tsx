import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TDC Matchmaker Dashboard",
  description: "Internal dashboard for customer profiles, match suggestions, and AI-assisted introductions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 font-sans text-stone-950">{children}</body>
    </html>
  );
}
