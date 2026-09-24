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
    <section id="sobre" className="relative py-20 sm:py-28 bg-[#E5E3DF] border-t border-[#4D5061]/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Secção */}
        <div className="max-w-3xl">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#30323D] sm:text-4xl">
            Uma abordagem dedicada à educação de crianças sobre aprevenção do cancro 
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4D5061]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
            malesuada. Duis pellentesque, justo eget ultrices hendrerit, neque
            felis gravida dolor, a interdum lorem magna sit amet libero.
          </p>
        </div>

        {/* Pilares / Eixos de Ação do Projeto (Cartões destacados em #F1F0EF) */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="relative flex flex-col justify-between rounded-2xl border border-[#4D5061]/20 bg-[#F1F0EF] p-7 shadow-xs transition-all hover:border-[#E06126] hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#E06126]">
                      {pillar.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E06126]/10 text-[#E06126]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#30323D]">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#4D5061]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#E06126]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#E06126]" />
                  <span>Lorem ipsum dolor sit amet</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
