import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScientificBasis } from "@/components/ScientificBasis";

export const metadata: Metadata = {
  title: "Base Científica",
  description:
    "Trabalhos científicos e investigação de referência do Projeto C.A.I.X.A.",
  alternates: {
    canonical: "/base-cientifica",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ScientificBasisPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      <Navbar />
      <main className="flex-1 pb-20 pt-32 sm:pb-24 sm:pt-36">
        <ScientificBasis />
      </main>
      <Footer />
    </div>
  );
}
