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
  title: "Projeto C.A.I.X.A. | Prevenção Oncológica Pediátrica",
  description:
    "Plataforma informativa do Projeto C.A.I.X.A. dedicada à prevenção, sensibilização e apoio na oncologia pediátrica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F1F0EF] text-[#30323D] selection:bg-[#E06126] selection:text-white">
        {children}
      </body>
    </html>
  );
}
