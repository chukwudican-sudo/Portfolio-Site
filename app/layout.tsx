import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Pacifico, Lobster_Two } from "next/font/google";
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


// Script accent for the name and the phrase the tagline turns on. Pacifico is
// the same face the reference site uses.
const pacifico = Pacifico({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  adjustFontFallback: false,
});

// Pacifico's capital A is a swashed form that reads as a big lowercase a, so
// the initial is set in Lobster Two — same weight and slant, but a clean
// triangular A — and only the rest of the word stays Pacifico.
const lobsterTwo = Lobster_Two({
  variable: "--font-script-caps",
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  adjustFontFallback: false,
});

const description =
  "Software engineering student at Ontario Tech who builds and ships full products — interfaces, APIs, data, and the rules that decide what happens when something looks wrong. Available for Winter 2027 co-op.";

export const metadata: Metadata = {
  // Set once the domain is live; relative OG/Twitter URLs resolve against it.
  metadataBase: new URL("https://meetalexius.com"),
  title: "Chukwudi Ndubuisi — Software Engineer",
  description,
  openGraph: {
    title: "Chukwudi Ndubuisi — Software Engineer",
    description,
    url: "/",
    siteName: "Chukwudi Ndubuisi",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chukwudi Ndubuisi — Software Engineer",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pacifico.variable} ${lobsterTwo.variable}`}>
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
