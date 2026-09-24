import { Compass, CheckCircle2, HeartHandshake, Eye, Sparkles } from "lucide-react";

export function About() {
  const pillars = [
    {
      number: "01",
      title: "Sensibilização e Educação Preventiva",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      icon: Compass,
    },
    {
      number: "02",
      title: "Deteção Precoce & Sinais Clínicos",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi nulla quis sem.",
      icon: Eye,
    },
    {
      number: "03",
      title: "Apoio Integrado às Famílias",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="sobre" className="relative py-20 sm:py-28 bg-[#EAE8E5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Secção */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EE6F36]/10 px-2.5 py-1 text-xs font-semibold text-[#EE6F36]">
            <Sparkles className="h-3.5 w-3.5 text-[#EE6F36]" />
            <span>Sobre o Projeto</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2A2826] sm:text-4xl">
            Uma abordagem dedicada à prevenção do cancro pediátrico
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4A4744]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
            malesuada. Duis pellentesque, justo eget ultrices hendrerit, neque
            felis gravida dolor, a interdum lorem magna sit amet libero.
          </p>
        </div>

        {/* Pilares / Eixos de Ação do Projeto (Cartões em cinzento suave #F5F4F1 com borda #D1D1D1) */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="relative flex flex-col justify-between rounded-2xl border border-[#D1D1D1] bg-[#F5F4F1] p-7 shadow-2xs transition-all hover:border-[#EE6F36]/80 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#EE6F36]">
                      {pillar.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EE6F36]/10 text-[#EE6F36]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#2A2826]">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#4A4744]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#EE6F36]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#EE6F36]" />
                  <span>Lorem ipsum dolor sit amet</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bloco em Destaque Conceitual */}
        <div className="mt-12 rounded-2xl border border-[#D1D1D1] bg-[#DFDDD9] p-8 sm:p-10 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EE6F36]">
                Compromisso Central
              </span>
              <h4 className="mt-1 text-xl font-bold text-[#2A2826] sm:text-2xl">
                O valor da deteção atempada na vida de cada criança
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[#4A4744]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
                vel vulputate erat, a tincidunt est.
              </p>
            </div>
            <div className="flex shrink-0">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-xl bg-[#EE6F36] px-5 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#d85e27]"
              >
                Saber Mais Informações
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
