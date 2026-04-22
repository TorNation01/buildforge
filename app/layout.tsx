import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildForge — Ship projects that don't fall apart",
  description:
    "Four governance files. Written before you touch code. Any AI follows them to the letter. No scope creep. No structural drift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
