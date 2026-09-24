"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Copy, Check, Send } from "lucide-react";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const emailPlaceholder = "contacto@projetocaixa.pt";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailPlaceholder);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contacto" className="relative py-20 sm:py-28 bg-[#EAE8E5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EE6F36]">
            Canais de Comunicação
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#2A2826] sm:text-4xl">
            Contacto com o Projeto
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#4A4744] sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Informações Diretas de Contacto */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 rounded-3xl border border-[#D1D1D1] bg-[#F5F4F1] p-8 sm:p-10 shadow-xs">
            <div>
              <h3 className="text-xl font-bold text-[#2A2826]">
                Informações Gerais
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#4A4744]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Em caso
                de questões sobre o projeto ou cooperação institucional:
              </p>

              <div className="mt-8 space-y-6">
                {/* E-mail com Cópia Rápida */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EE6F36]/10 text-[#EE6F36]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-stone-500">Correio Eletrónico</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-[#2A2826]">
                        {emailPlaceholder}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 rounded-md bg-[#DFDDD9] px-2 py-1 text-xs font-medium text-[#2A2826] border border-[#D1D1D1] hover:bg-[#D1D1D1]"
                        title="Copiar e-mail"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-700" />
                            <span className="text-emerald-700 text-[10px]">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-stone-600" />
                            <span className="text-[10px]">Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EE6F36]/10 text-[#EE6F36]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500">Telefone / Linha de Apoio</p>
                    <p className="mt-1 text-sm font-medium text-[#2A2826]">
                      +351 21 000 0000
                    </p>
                  </div>
                </div>

                {/* Localização */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-200 text-stone-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500">Localização Institucional</p>
                    <p className="mt-1 text-sm font-medium text-[#2A2826]">
                      Portugal (Lisboa / Porto)
                    </p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EE6F36]/10 text-[#EE6F36]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500">Horário de Disponibilidade</p>
                    <p className="mt-1 text-sm font-medium text-[#2A2826]">
                      Segunda a Sexta: 09h00 – 18h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D1D1D1] bg-[#DFDDD9] p-4">
              <p className="text-xs leading-relaxed text-[#2A2826]">
                <span className="font-bold text-[#EE6F36]">Aviso Informativo:</span> Este website é de
                natureza puramente informativa. Para emergências pediátricas, contacte
                sempre os serviços de emergência médica (112 ou Linha SNS 24).
              </p>
            </div>
          </div>

          {/* Formulário Simples Informativo */}
          <div className="lg:col-span-7 rounded-3xl border border-[#D1D1D1] bg-[#F5F4F1] p-8 sm:p-10 shadow-xs">
            <h3 className="text-xl font-bold text-[#2A2826]">
              Enviar Mensagem à Equipa
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#4A4744]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Preencha os campos abaixo para estabelecer contacto direto.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const subject = encodeURIComponent(
                  `[Projeto C.A.I.X.A.] Contacto de ${formData.get("name") || "Interessado"}`
                );
                const body = encodeURIComponent(
                  `Nome: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\nMensagem:\n${formData.get("message")}`
                );
                window.location.href = `mailto:${emailPlaceholder}?subject=${subject}&body=${body}`;
              }}
              className="mt-8 space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#2A2826]">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Seu nome..."
                    className="mt-1.5 w-full rounded-xl border border-[#D1D1D1] bg-[#EAE8E5] px-4 py-2.5 text-sm text-[#2A2826] placeholder:text-stone-400 focus:border-[#EE6F36] focus:bg-[#F5F4F1] focus:outline-hidden focus:ring-2 focus:ring-[#EE6F36]/20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#2A2826]">
                    Correio Eletrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="exemplo@dominio.pt"
                    className="mt-1.5 w-full rounded-xl border border-[#D1D1D1] bg-[#EAE8E5] px-4 py-2.5 text-sm text-[#2A2826] placeholder:text-stone-400 focus:border-[#EE6F36] focus:bg-[#F5F4F1] focus:outline-hidden focus:ring-2 focus:ring-[#EE6F36]/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-[#2A2826]">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Motivo do contacto (ex: Parceria, Informação...)"
                  className="mt-1.5 w-full rounded-xl border border-[#D1D1D1] bg-[#EAE8E5] px-4 py-2.5 text-sm text-[#2A2826] placeholder:text-stone-400 focus:border-[#EE6F36] focus:bg-[#F5F4F1] focus:outline-hidden focus:ring-2 focus:ring-[#EE6F36]/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-[#2A2826]">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Escreva aqui a sua mensagem..."
                  className="mt-1.5 w-full rounded-xl border border-[#D1D1D1] bg-[#EAE8E5] px-4 py-2.5 text-sm text-[#2A2826] placeholder:text-stone-400 focus:border-[#EE6F36] focus:bg-[#F5F4F1] focus:outline-hidden focus:ring-2 focus:ring-[#EE6F36]/20"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#EE6F36] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#d85e27] focus:outline-hidden"
                >
                  <span>Enviar Mensagem</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
