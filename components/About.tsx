import Image from "next/image";

export function About() {
  return (
    <section
      id="sobre"
      className="relative flex min-h-screen flex-col justify-center border-t border-slate-200/60 bg-[#F5F2EE] py-20 sm:py-28 lg:py-32 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Coluna 1: Texto Informativo */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#F85308]">
              <span>O PROJETO</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#07213D] sm:text-4xl">
              Promoção de estilos de vida saudáveis na infância: uma abordagem psicoeducativa
            </h2>
            <p className="mt-6 sm:mt-8 text-base leading-relaxed text-justify text-[#334155]">
              Esta operação procura reforçar a prevenção primária do cancro, com foco nas crianças da Região Autónoma da Madeira, um público estratégico subexplorado neste domínio. Face ao crescente impacto da doença oncológica na saúde pública e nos custos associados aos cuidados de saúde, a iniciativa propõe uma abordagem inovadora de prevenção desde idades precoces. Uma vez que se reconhece a infância como um período privilegiado para a adoção de estilos de vida saudáveis, a intervenção visa promover a literacia em saúde e comportamentos protetores, contribuindo para a redução de fatores de risco  ao longo da vida. Assim, a operação consiste no desenvolvimento e na implementação de uma plataforma digital interativa baseada em tecnologias de XR, que englobam a Realidade Virtual (RV) e a Realidade Aumentada (RA), concebida especificamente para o público infantil. Esta será desenvolvida com uma forte componente de Investigação Científica e Tecnológica, enquadrando-se, de forma intrínseca, na Tipologia de Operação – Investigação científica e desenvolvimento tecnológico. 
            </p>
          </div>

          {/* Coluna 2: 2 Imagens sobrepostas verticalmente (sem sombras) */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-6">
            <div className="relative h-80 w-[90%] max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-white/40">
                <Image
                    src="/images/image1.jpg"
                    alt="O Projeto C.A.I.X.A. - Imagem 1"
                    fill
                    sizes="(max-width: 1024px) 100vw, 512px"
                    className="object-cover"
                />
            </div>
            <div className="relative h-80 w-[90%] max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-white/40">
              <Image
                src="/images/image2.jpg"
                alt="O Projeto C.A.I.X.A. - Imagem 2"
                fill
                sizes="(max-width: 1024px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
