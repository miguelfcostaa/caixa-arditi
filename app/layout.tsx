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
        className="min-h-full flex flex-col bg-[#E5E3DF] text-[#30323D] selection:bg-[#E06126] selection:text-white font-sans"
      >
        {children}
      </body>
    </html>
  );
}
