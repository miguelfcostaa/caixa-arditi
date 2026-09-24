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
      className={"group relative flex flex-col items-center rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md "}
    >
      {/* Moldura da Imagem / Fotografia */}
      <div className="relative mb-4 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#E5E3DF] shadow-xs ring-1 ring-[#4D5061]/30">
        {/* Placeholder estético com gradiente e iniciais */}
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${member.avatarGradient} text-xl font-bold text-white transition-transform group-hover:scale-105`}
        >
          <span>{member.initials}</span>
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
  // 1. Chefe do Projeto / Investigadores Principais
  const leader: TeamMember[] = [
    {
      id: "chefe-ana",
      name: "Ana Lúcia Faria",
      role: "Investigadora Principal",
      initials: "AF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
    },
    {
      id: "chefe-luis",
      name: "Luís Ferreira",
      role: "Investigador Principal",
      initials: "LF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
    },
    {
      id: "chefe-monica",
      name: "Mónica Cameirão",
      role: "Investigadora Principal",
      initials: "MC",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
    },
  ];

  // 2. Psicólogas (2)
  const psychologists: TeamMember[] = [
    {
      id: "psico-1",
      name: "Petra Santos",
      role: "Psicóloga Clínica",
      initials: "PS",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
    },
    {
      id: "psico-2",
      name: "Beatriz Castro",
      role: "Psicóloga de Apoio Pediátrico",
      initials: "BC",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
    },
  ];

  // 3. Desenvolvedores (2)
  const developers: TeamMember[] = [
    {
      id: "dev-1",
      name: "Miguel Costa",
      role: "Desenvolvedor Frontend",
      initials: "MC",
      avatarGradient: "from-mist-500 to-graphite ring-[#30323D]/30",
    },
    {
      id: "dev-2",
      name: "Roberto Fernandes",
      role: "Desenvolvedor Backend",
      initials: "RF",
      avatarGradient: "from-mist-500 to-graphite ring-[#30323D]/30",
    },
  ];

  // 4. Design (1 UX/UI e 1 Designer)
  const designers: TeamMember[] = [
    {
      id: "des-ux",
      name: "Juan Ponte",
      role: "Designer UX / UI",
      initials: "JP",
      avatarGradient: "from-cyan-600 to-cyan-800 ring-[#E06126]/20",
    },
    {
      id: "des-vis",
      name: "Carolina Luís",
      role: "Designer Visual & Gráfico",
      initials: "DG",
      avatarGradient: "from-cyan-600 to-cyan-800 ring-[#E06126]/20",
    },
  ];

  return (
    <section id="equipa" className="relative border-t border-[#4D5061]/20 bg-[#F1F0EF] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-graphite sm:text-4xl">
            Equipa de Desenvolvimento
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-graphite sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Nível 1: Liderança / Chefia */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <User className="h-4 w-4 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Investigação & Coordenação do Projeto
            </h3>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-3">
            {leader.map((member) => (
                <MemberCard key={member.id} member={member} isLeader={true} />
            ))}
          </div>
        </div>

        {/* Nível 2: Psicologia (2 psicólogas) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <HeartHandshake className="h-4 w-4 text-pink-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600">
              Psicólogas 
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
              Desenvolvedores de Software
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
            <Palette className="h-4 w-4 text-cyan-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Designers 
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
