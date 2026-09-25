import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Projeto C.A.I.X.A.",
  description:
    "Plataforma informativa do Projeto C.A.I.X.A. dedicada à prevenção, sensibilização e apoio na oncologia pediátrica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${montserrat.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#FCFAF9] text-[#07213D] selection:bg-[#F85308] selection:text-white font-sans"
      >
        {children}
      </body>
    </html>
  );
}
