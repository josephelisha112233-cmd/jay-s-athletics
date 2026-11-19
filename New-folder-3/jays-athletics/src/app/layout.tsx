import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { BRAND_NAME } from "@/config/brand";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Oswald({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: `${BRAND_NAME} | Football Cleats & Sports Shoes`, template: `%s | ${BRAND_NAME}` },
  description: "Football cleats, sports shoes, kits and sportswear delivered across Nigeria.",
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body><CartProvider><Header /><main>{children}</main><Footer /></CartProvider></body>
    </html>
  );
}
