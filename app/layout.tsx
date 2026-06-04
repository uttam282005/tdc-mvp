import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TDC Matchmaker Dashboard",
  description:
    "Internal dashboard for customer profiles, match suggestions, and AI-assisted introductions.",
  icons: {
    icon: "/heart.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem("theme");
                if (!theme) theme = "system";
                if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.colorScheme = "dark";
                } else {
                  document.documentElement.style.colorScheme = "light";
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-stone-50 font-sans text-stone-950 dark:bg-stone-950 dark:text-stone-50">
        {children}
      </body>
    </html>
  );
}
