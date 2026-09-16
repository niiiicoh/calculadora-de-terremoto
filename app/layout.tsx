import type { Metadata } from "next";
import { Barlow, Anton } from "next/font/google";
import { description, isIndexable, siteUrl, title } from "@/lib/site";
import "./globals.css";

const archivo = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const fraunces = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "@niiiicoh" }],
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  openGraph: {
    title,
    description,
    locale: "es_CL",
    type: "website",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  robots: { index: isIndexable, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t;try{t=localStorage.getItem('terremoto-theme')}catch(e){}document.documentElement.dataset.theme=t==='day'||t==='night'?t:matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'})()`,
          }}
        />
      </head>
      <body className={`${archivo.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
