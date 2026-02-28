import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Precision | The Engine of Excellence - Elite Digital Craftsmanship",
  description: "An experimental 3D showcase of master engineering, precision code, and immersive digital artifacts. Designed for high-impact results.",
  keywords: ["3D Web Design", "WebGL", "Next.js 15", "Technical Portfolio", "Mechanical Watch", "Creative Brutalism"],
  authors: [{ name: "The Engineer" }],
  openGraph: {
    title: "Precision | The Engine of Excellence",
    description: "Witness the harmony of code and clockwork.",
    type: "website",
    url: "https://theprecisionengine.com",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-white selection:text-black`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "The Precision Engineer",
              "jobTitle": "Creative Technical Architect",
              "description": "Specializing in high-performance digital artifacts and 3D immersive experiences.",
              "url": "https://theprecisionengine.com",
            }),
          }}
        />
      </body>
    </html>
  );
}
