import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScientificBasisPage() {
  notFound();
}
