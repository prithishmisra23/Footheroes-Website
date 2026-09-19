import type { Metadata } from "next";
import { Inter, Exo_2, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import BottomNav from "@/components/BottomNav";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const exo2 = Exo_2({ subsets: ["latin"], variable: "--font-exo-2" });
const bebasNeue = Bebas_Neue({ 
  weight: "400",
  subsets: ["latin"], 
  variable: "--font-bebas-neue" 
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Foot Heroes | Your game. Your record. Forever.",
  description: "India's football data infrastructure and scouting network. The permanent digital identity layer for every grassroots football player in the country.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#22C55E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${exo2.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} font-inter antialiased`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
