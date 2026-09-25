export function About() {
  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#F5F2EE] border-t border-slate-200/60 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Bloco de Conteúdo Centrado na Página */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#F85308]">
            <span>O PROJETO</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#07213D] sm:text-4xl">
            Uma abordagem dedicada à educação de crianças sobre a prevenção do cancro
          </h2>
          <p className="mt-8 sm:mt-10 text-base leading-relaxed text-justify text-[#334155]">
            Esta operação visa inovar na prevenção primária do cancro, focando-se nas crianças e jovens da RAM, um público estratégico subexplorado. A iniciativa responde à crescente carga oncológica, que desafia a saúde pública oncológica e a sustentabilidade financeira, propondo uma abordagem disruptiva para promover a literacia em saúde e hábitos saudáveis desde cedo. Assim, a operação consiste no desenvolvimento e implementação de uma plataforma digital interativa baseada em tecnologias de XR, que englobam a Realidade Virtual (RV) e a Realidade Aumentada (RA), concebida especificamente para o público infantil. Esta plataforma será desenvolvida com uma forte componente de Investigação Científica e Tecnológica, enquadrando-se, de forma intrínseca, na Tipologia de Operação – Investigação científica e desenvolvimento tecnológico.
          </p>
        </div>
      </div>
    </section>
  );
}
