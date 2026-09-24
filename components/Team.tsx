import { User, HeartHandshake, Code2, Palette } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
}

// Componente de Cartão de Membro Reutilizável declarado fora da função de renderização
function MemberCard({
  member,
  isLeader = false,
}: {
  member: TeamMember;
  isLeader?: boolean;
}) {
  return (
    <div
      className={`group relative flex flex-col items-center rounded-2xl border bg-[#F1F0EF] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md ${
        isLeader
          ? "border-[#E06126] shadow-md shadow-[#E06126]/10 sm:max-w-md w-full"
          : "border-[#4D5061]/25 shadow-2xs hover:border-[#E06126] w-full"
      }`}
    >
      {/* Moldura da Imagem / Fotografia */}
      <div className="relative mb-4 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#F1F0EF] shadow-xs ring-1 ring-[#4D5061]/30">
        {/* Placeholder estético com gradiente e iniciais */}
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${member.avatarGradient} text-xl font-bold text-white transition-transform group-hover:scale-105`}
        >
          <span>{member.initials}</span>
        </div>

        {/* Efeito hover indicando espaço para imagem */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-2xs transition-opacity group-hover:opacity-100">
          <User className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Nome */}
      <h4 className="text-base font-bold text-[#30323D] sm:text-lg">
        {member.name}
      </h4>

      {/* Função */}
      <p
        className={`mt-1 text-xs font-semibold ${
          isLeader ? "text-[#E06126]" : "text-[#4D5061]"
        }`}
      >
        {member.role}
      </p>
    </div>
  );
}

export function Team() {
  // 1. Chefe do Projeto
  const leader: TeamMember = {
    id: "chefe",
    name: "Luís Ferreira",
    role: "Chefe de Projeto / Coordenação Geral",
    initials: "LF",
    avatarGradient: "from-[#E06126] to-[#c8531d] ring-[#E06126]/30",
  };

  // 2. Psicólogas (2)
  const psychologists: TeamMember[] = [
    {
      id: "psico-1",
      name: "Petra Santos",
      role: "Psicóloga Clínica",
      initials: "PS",
      avatarGradient: "from-[#4D5061] to-[#30323D] ring-[#4D5061]/30",
    },
    {
      id: "psico-2",
      name: "Beatriz Castro",
      role: "Psicóloga de Apoio Pediátrico",
      initials: "BC",
      avatarGradient: "from-[#4D5061] to-[#30323D] ring-[#4D5061]/30",
    },
  ];

  // 3. Desenvolvedores (2)
  const developers: TeamMember[] = [
    {
      id: "dev-1",
      name: "Miguel Costa",
      role: "Desenvolvedor Frontend",
      initials: "MC",
      avatarGradient: "from-[#30323D] to-[#1c1d24] ring-[#30323D]/30",
    },
    {
      id: "dev-2",
      name: "Roberto Fernandes",
      role: "Desenvolvedor Backend",
      initials: "RF",
      avatarGradient: "from-[#30323D] to-[#1c1d24] ring-[#30323D]/30",
    },
  ];

  // 4. Design (1 UX/UI e 1 Designer)
  const designers: TeamMember[] = [
    {
      id: "des-ux",
      name: "Juan Ponte",
      role: "Designer UX / UI",
      initials: "JP",
      avatarGradient: "from-[#E06126] to-[#4D5061] ring-[#E06126]/20",
    },
    {
      id: "des-vis",
      name: "Nome do Designer",
      role: "Designer Visual & Gráfico",
      initials: "DG",
      avatarGradient: "from-[#4D5061] to-[#E06126] ring-[#E06126]/20",
    },
  ];

  return (
    <section id="equipa" className="relative border-t border-[#4D5061]/20 bg-[#F1F0EF] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E06126]">
            Estrutura Organizacional
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#30323D] sm:text-4xl">
            Equipa de Desenvolvimento
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#4D5061] sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Nível 1: Liderança / Chefia */}
        <div className="mt-14 flex flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-[#E06126]">
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Liderança & Coordenação
            </h3>
          </div>
          <MemberCard member={leader} isLeader={true} />
        </div>

        {/* Nível 2: Psicologia (2 psicólogas) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <HeartHandshake className="h-4 w-4 text-[#E06126]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#30323D]">
              Apoio Psicológico & Acompanhamento
            </h3>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {psychologists.map((psychologist) => (
              <MemberCard key={psychologist.id} member={psychologist} />
            ))}
          </div>
        </div>

        {/* Nível 3: Desenvolvimento de Software (2 desenvolvedores) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Code2 className="h-4 w-4 text-[#30323D]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#30323D]">
              Engenharia & Desenvolvimento Web
            </h3>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {developers.map((dev) => (
              <MemberCard key={dev.id} member={dev} />
            ))}
          </div>
        </div>

        {/* Nível 4: Design (1 Designer UX/UI e 1 Designer) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Palette className="h-4 w-4 text-[#E06126]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#30323D]">
              Design de Experiência (UX/UI) & Identidade Visual
            </h3>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {designers.map((designer) => (
              <MemberCard key={designer.id} member={designer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
