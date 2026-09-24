import Image from "next/image";

// Interface para configurar cada logotipo de parceria com dimensões personalizadas
export interface PartnerLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
  width: number;  // Escolha a largura (em px) de cada imagem
  height: number; // Escolha a altura (em px) de cada imagem
}

export function Partners() {
  // Lista dos 4 parceiros com dimensões personalizadas
  const partners: PartnerLogo[] = [
    {
      id: "arditi",
      name: "ARDITI",
      src: "/partners/arditi-logo.png",
      alt: "ARDITI - Agência Regional para o Desenvolvimento da Investigação, Tecnologia e Inovação",
      width: 230,
      height: 85,
    },
    {
      id: "parceiro-2",
      name: "Secretaria Regional de Saúde e Proteção Civil",
      src: "/partners/RAM-secretaria-logo.png",
      alt: "Secretaria Regional de Saude e Proteção Civil",
      width: 310,
      height: 130,
    },
    {
      id: "parceiro-3",
      name: "Secretaria Regional de Educação, Ciência e Tecnologia",
      src: "/partners/RAM-educacao-logo.png",
      alt: "Secretaria Regional de Educação, Ciência e Tecnologia",
      width: 300,
      height: 130,
    },
    {
      id: "parceiro-4",
      name: "Liga Portuguesa Contra o Cancro",
      src: "/partners/liga-portuguesa-contra-o-cancro-logo.png",
      alt: "Liga Portuguesa Contra o Cancro",
      width: 120,
      height: 130,
    },
  ];

  return (
    <section id="parcerias" className="py-12 sm:py-16 border-y border-[#D1D1D1] bg-[#DFDDD9]/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Título direto */}
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#2A2826] sm:text-sm">
            PARCERIAS
          </h2>
        </div>

        {/* 4 Parceiros na mesma linha e mais juntos */}
        <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-nowrap overflow-x-auto py-2">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="object-contain opacity-90 transition-opacity hover:opacity-100"
                style={{
                  width: `${partner.width}px`,
                  height: `${partner.height}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
