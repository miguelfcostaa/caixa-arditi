import Image from "next/image";

export function Partners() {
  return (
    <section id="parcerias" className="relative border-t border-[#4D5061]/15 bg-[#E5E3DF] py-16 sm:py-24 scroll-mt-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Título direto */}
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-[#30323D] sm:text-sm">
            APOIADO POR:
          </h2>
        </div>

        {/* Parceiros principais - ampliados com escala responsiva */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 py-2">
          {/* ARDITI */}
          <div className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-105">
            <Image
              src="/partners/arditi-logo.png"
              alt="ARDITI - Agência Regional para o Desenvolvimento da Investigação, Tecnologia e Inovação"
              width={633}
              height={672}
              className="h-16 w-auto sm:h-20 md:h-24 object-contain opacity-90 transition-opacity hover:opacity-100"
            />
          </div>

          {/* NeurorehabLab */}
          <div className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-105">
            <Image
              src="/partners/neurorehablabLogo.png"
              alt="NeurorehabLab"
              width={704}
              height={217}
              className="h-12 w-auto sm:h-16 md:h-20 max-w-[220px] sm:max-w-[280px] md:max-w-[340px] object-contain opacity-90 transition-opacity hover:opacity-100"
            />
          </div>

          {/* Liga Portuguesa Contra o Cancro */}
          <div className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-105">
            <Image
              src="/partners/liga-portuguesa-contra-o-cancro-logo.png"
              alt="Liga Portuguesa Contra o Cancro"
              width={842}
              height={630}
              className="h-16 w-auto sm:h-20 md:h-24 max-w-[140px] sm:max-w-[180px] md:max-w-[220px] object-contain opacity-90 transition-opacity hover:opacity-100"
            />
          </div>
        </div>

        {/* Cofinanciamento Madeira 2030 - ampliado e totalmente fluido no mobile */}
        <div className="mt-12 sm:mt-16 flex items-center justify-center px-2 py-2">
          <div className="w-full max-w-4xl flex items-center justify-center transition-all duration-300 hover:scale-[1.02]">
            <Image
              src="/partners/MADEIRA2030_BarraCofinan_Band_Ass_RGB_3590px.png"
              alt="MADEIRA 2030, da Região Autónoma da Madeira"
              width={3591}
              height={598}
              className="h-auto w-full max-h-20 sm:max-h-28 md:max-h-36 object-contain opacity-90 transition-opacity hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
