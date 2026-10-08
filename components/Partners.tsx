"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function Partners() {
  const { t } = useLanguage();

  return (
    <section id="parcerias" className="relative flex flex-col justify-center border-t border-slate-200/60 bg-[#F5F2EE] py-16 sm:py-24 lg:py-32 scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Título direto */}
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#07213D] sm:text-sm">
            {t("partners.title")}
          </h2>
        </div>

        {/* Parceiros principais - 2 em cima e 2 por baixo em mobile, linha em desktop */}
        <div className="mt-8 grid grid-cols-2 items-stretch justify-items-center gap-3 py-0 sm:gap-5 md:mt-14 md:flex md:flex-wrap md:items-center md:justify-center md:gap-14 md:py-2 lg:gap-20">
          {/* ARDITI */}
          <div className="flex h-24 w-full shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:w-auto md:p-2">
            <Image
              src="/partners/arditi-logo.png"
              alt="ARDITI - Agência Regional para o Desenvolvimento da Investigação, Tecnologia e Inovação"
              width={633}
              height={672}
              className="h-14 w-auto sm:h-16 md:h-24 object-contain opacity-90 transition-opacity hover:opacity-100"
            />
          </div>

          {/* NeurorehabLab */}
          <div className="flex h-24 w-full shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:w-auto md:p-2">
            <Image
              src="/partners/neurorehablabLogo.png"
              alt="NeurorehabLab"
              width={704}
              height={217}
              className="h-12 w-auto max-w-[150px] object-contain opacity-90 transition-opacity hover:opacity-100 sm:h-14 sm:max-w-[250px] md:h-20 md:max-w-[340px]"
            />
          </div>

          {/* Liga Portuguesa Contra o Cancro */}
          <div className="flex h-24 w-full shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:w-auto md:p-2">
            <Image
              src="/partners/liga-portuguesa-contra-o-cancro-logo.png"
              alt="Liga Portuguesa Contra o Cancro"
              width={842}
              height={630}
              className="h-18 w-auto max-w-[140px] object-contain opacity-90 transition-opacity hover:opacity-100 sm:h-20 sm:max-w-[170px] md:h-24 md:max-w-[220px]"
            />
          </div>

          {/* NOVA LINCS */}
          <div className="flex h-24 w-full shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:w-auto md:p-2">
            <Image
              src="/partners/novalincs-logo.png"
              alt="MADEIRA N-LINCS - Universidade da Madeira"
              width={842}
              height={300}
              className="h-16 w-auto max-w-[150px] object-contain opacity-90 transition-opacity hover:opacity-100 sm:h-20 sm:max-w-[180px] md:h-24 md:max-w-[220px]"
            />
          </div>
        </div>

        {/* Logos RAM - Secretaria Regional de Educação e Secretaria Regional de Saúde (3ª linha) */}
        <div className="mt-0 flex flex-col items-center justify-center gap-0 py-0 md:mt-12 md:flex-row md:items-center md:justify-center md:gap-10 md:py-2 lg:gap-14">
          {/* Secretaria Regional de Educação, Ciência e Tecnologia */}
          <div className="flex h-28 w-full max-w-sm shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:h-auto md:w-auto md:max-w-none md:p-1">
            <Image
              src="/partners/RAM-educacao-logo.png"
              alt="Secretaria Regional de Educação, Ciência e Tecnologia - Região Autónoma da Madeira"
              width={993}
              height={369}
              className="h-24 w-auto max-w-full object-contain opacity-95 transition-opacity hover:opacity-100 sm:h-26 md:h-32"
            />
          </div>

          {/* Secretaria Regional de Saúde e Proteção Civil */}
          <div className="flex h-28 w-full max-w-sm shrink-0 items-center justify-center p-3 transition-all duration-300 hover:scale-105 md:h-auto md:w-auto md:max-w-none md:p-1">
            <Image
              src="/partners/RAM-secretaria-logo.png"
              alt="Secretaria Regional de Saúde e Proteção Civil - Região Autónoma da Madeira"
              width={1000}
              height={325}
              className="h-20 w-auto max-w-full object-contain opacity-95 transition-opacity hover:opacity-100 sm:h-24 md:h-30"
            />
          </div>
        </div>

        {/* Cofinanciamento Madeira 2030 - mantido abaixo, fluido e centrado */}
        <div className="mt-0 flex items-center justify-center px-0 py-0 md:mt-16 md:px-2 md:py-2">
          <div className="flex w-full max-w-4xl items-center justify-center p-1 transition-all duration-300 hover:scale-[1.02] md:p-0">
            <Image
              src="/partners/MADEIRA2030_BarraCofinan_Band_Ass_RGB_3590px.png"
              alt="MADEIRA 2030, da Região Autónoma da Madeira"
              width={3591}
              height={598}
              className="h-auto max-h-20 w-[108%] max-w-none object-contain opacity-90 transition-opacity hover:opacity-100 sm:max-h-24 md:max-h-36 md:w-full"
            />
          </div>
        </div>

        

      </div>
    </section>
  );
}
