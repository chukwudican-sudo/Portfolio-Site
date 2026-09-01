import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// `adjustFontFallback` is off so glyphs outside the latin subset — notably the
// arrow (U+2192) used throughout the design — fall through to plain
// Helvetica/monospace at the same metrics as the reference, instead of Next's
// size-adjusted fallback face, which renders them more than twice as wide.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Chukwudi Ndubuisi — Software Engineer",
  description:
    "Software engineering student at Ontario Tech who builds and ships full products — interfaces, APIs, data, and the rules that decide what happens when something looks wrong. Available for Winter 2027 co-op.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      {/* Browser extensions commonly inject attributes onto <body> before
          React hydrates (ColorZilla's cz-shortcut-listen, Grammarly, etc.),
          which trips a hydration warning. This suppresses that comparison for
          <body> itself only — children are still checked normally. */}
      <body suppressHydrationWarning>
        {/* The scroll reveals start hidden and are un-hidden by JS. If JS never
            runs, the page would render blank, so show everything instead. */}
        <noscript>
          <style>{`.reveal,.blur-in,.blur-in-left{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
