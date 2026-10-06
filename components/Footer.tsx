"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, Copy, Check, MapPin, Building2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("luis.ferreira@arditi.pt");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setStatusMessage(t("footer.formSent"));

    // Monta o mailto estruturado com os dados do formulário
    const subjectEncoded = encodeURIComponent(
      formData.subject || `Contacto Projeto C.A.I.X.A. - ${formData.name || "Visitante"}`
    );
    const bodyEncoded = encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
    );

    window.location.href = `mailto:luis.ferreira@arditi.pt?subject=${subjectEncoded}&body=${bodyEncoded}`;

    setTimeout(() => {
      setStatusMessage("");
    }, 4000);
  };

  return (
    <footer id="contacto" className="border-t border-slate-800 bg-[#07213D] text-[#F1F0EF] scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
        {/* Cabeçalho da Secção de Contacto */}
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F85308]">
            <span className="h-0.5 w-6 rounded-full bg-[#F85308]" />
            <span>{t("footer.contactBadge")}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("footer.contactTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#F1F0EF]/80 sm:text-base">
            {t("footer.contactDesc")}
          </p>
        </div>

        {/* Grelha Principal: Formulário Interativo + Informações Diretas */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Coluna 1: Formulário de Contacto Rápido (7 colunas) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-700/80 bg-slate-800/40 p-6 sm:p-8 backdrop-blur-xs shadow-xl"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300">
                    {t("footer.formName")}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ana Silva"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#F85308] focus:outline-hidden focus:ring-1 focus:ring-[#F85308]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300">
                    {t("footer.formEmail")} <span className="text-[#F85308]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@email.pt"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#F85308] focus:outline-hidden focus:ring-1 focus:ring-[#F85308]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300">
                  {t("footer.formSubject")}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Colaboração / Dúvida sobre o projeto"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#F85308] focus:outline-hidden focus:ring-1 focus:ring-[#F85308]"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300">
                  {t("footer.formMessage")} <span className="text-[#F85308]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escreva a sua mensagem..."
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#F85308] focus:outline-hidden focus:ring-1 focus:ring-[#F85308]"
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F85308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F85308]/25 transition-all hover:bg-[#e04804] hover:shadow-xl hover:shadow-[#F85308]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>{t("footer.formSend")}</span>
                </button>

                {statusMessage && (
                  <span className="text-xs font-medium text-emerald-400 animate-in fade-in">
                    {statusMessage}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Coluna 2: Informações de Contacto Direto e Sede (5 colunas) */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            {/* Card de Email Direto com Ação Rápida */}
            <div className="rounded-3xl border border-slate-700/80 bg-slate-800/40 p-6 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#F85308]">
                <Mail className="h-4 w-4" />
                <span>{t("footer.directEmailTitle")}</span>
              </div>
              <p className="mt-2 text-base font-bold text-white sm:text-lg break-all">
                luis.ferreira@arditi.pt
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <a
                  href="mailto:luis.ferreira@arditi.pt"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#F85308]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar Email</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-400 hover:text-white cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t("footer.copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t("footer.copyEmail")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card de Instituição & Sede */}
            <div className="rounded-3xl border border-slate-700/80 bg-slate-800/40 p-6 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#F85308]">
                <MapPin className="h-4 w-4" />
                <span>{t("footer.institutionTitle")}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">
                ARDITI – Agência Regional para o Desenvolvimento da Investigação, Tecnologia e Inovação
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Edifício Madeira Tecnopolo, Caminho da Penteada, 9020-105 Funchal, Madeira, Portugal
              </p>
            </div>

            {/* Card de Consórcio e Investigação */}
            <div className="rounded-3xl border border-slate-700/80 bg-slate-800/40 p-6 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#F85308]">
                <Sparkles className="h-4 w-4" />
                <span>Consórcio & Investigação</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                Desenvolvido no âmbito do <span className="font-semibold text-white">NeuroRehabLab</span>, em colaboração com a <span className="font-semibold text-white">Universidade da Madeira</span> e a <span className="font-semibold text-white">Liga Portuguesa Contra o Cancro</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Barra Inferior com Navegação Rápida e Direitos */}
        <div className="mt-16 flex flex-col gap-6 border-t border-slate-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">
              {t("navbar.home")}
            </Link>
            <Link href="#sobre" className="hover:text-white transition-colors">
              {t("navbar.about")}
            </Link>
            <Link href="#equipa" className="hover:text-white transition-colors">
              {t("navbar.team")}
            </Link>
            <Link href="#parcerias" className="hover:text-white transition-colors">
              {t("navbar.partners")}
            </Link>
          </div>

          <p className="text-xs text-[#F1F0EF]/60">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
