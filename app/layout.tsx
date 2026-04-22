import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildForge — Ship projects that don't fall apart",
  description:
    "Four governance files. Written before you touch code. Any AI follows them to the letter. No scope creep. No structural drift.",
};

const themeInit = `(function(){try{var t=localStorage.getItem('bf-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
