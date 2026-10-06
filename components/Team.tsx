"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, HeartHandshake, Code2, Palette, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
  image?: string; // Caminho da foto em /public/team/
  category?: string;
  bio?: string;
}

// Componente Modal de Biografia com altura fixa e scroll obrigatório
function BioModal({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-member-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Fundo escurecido (Backdrop) */}
      <div
        className="fixed inset-0 bg-[#07213D]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Janela de Biografia - Altura fixa que não aumenta de tamanho e requer scroll */}
      <div className="relative z-10 flex h-[480px] sm:h-[520px] max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#FCFAF9] p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200/80 transition-all animate-in zoom-in-95 duration-200">
        {/* Botão de Fechar fixo */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#07213D] transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F85308]"
          aria-label={t("team.close")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabeçalho Fixo com Fotografia e Nome */}
        <div className="flex shrink-0 flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 sm:gap-5 pr-8 sm:pr-6">
          <div
            className={`relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br ${member.avatarGradient} shadow-md ring-1 ring-slate-200`}
          >
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="96px"
                className="object-cover object-top sm:object-center"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {member.initials}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h3
              id="modal-member-name"
              className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#07213D]"
            >
              {member.name}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-600">
              {member.role}
            </p>
          </div>
        </div>

        {/* Divisória subtil fixa */}
        <div className="my-4 sm:my-5 h-px w-full shrink-0 bg-slate-200/80" />

        {/* Corpo da Biografia com Scroll Fixo */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#07213D]/70 sticky top-0 bg-[#FCFAF9] py-0.5">
            {t("team.bioTitle")}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line text-justify sm:text-left">
            {member.bio || t("team.defaultBio")}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente de Cartão de Membro Reutilizável
function MemberCard({
  member,
  isLeader = false,
  onOpenBio,
}: {
  member: TeamMember;
  isLeader?: boolean;
  onOpenBio: (member: TeamMember) => void;
}) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(member.image && !imgError);

  return (
    <div className="group relative flex flex-col items-center rounded-2xl p-6 text-center transition-all hover:-translate-y-1">
      {/* Moldura da Imagem / Fotografia - Clicável para abrir o popup */}
      <button
        type="button"
        onClick={() => onOpenBio(member)}
        aria-label={`${t("team.viewBio")} - ${member.name}`}
        className={`group/avatar relative mb-4 flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#FCFAF9] bg-gradient-to-br ${member.avatarGradient} shadow-md ring-1 ring-slate-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg hover:ring-2 hover:ring-[#F85308] cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F85308]`}
      >
        {hasValidImage ? (
          <Image
            src={member.image!}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 128px, 144px"
            className="object-cover object-top sm:object-center transition-transform duration-300 group-hover/avatar:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Placeholder estético com as iniciais sobre o gradiente da equipa */
          <span className="text-2xl font-bold text-white transition-transform group-hover/avatar:scale-105">
            {member.initials}
          </span>
        )}
      </button>

      {/* Nome */}
      <button
        type="button"
        onClick={() => onOpenBio(member)}
        className="text-base font-bold text-[#07213D] transition-colors group-hover:text-[#F85308] hover:text-[#F85308] sm:text-lg cursor-pointer focus:outline-hidden"
      >
        {member.name}
      </button>

      {/* Função */}
      <p
        className={`mt-1 text-xs font-semibold ${
          isLeader ? "text-[#F85308]" : "text-[#475569]"
        }`}
      >
        {member.role}
      </p>
    </div>
  );
}

export function Team() {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // 1. Chefe do Projeto / Investigadores Principais
  const leader: TeamMember[] = [
    {
      id: "chefe-ana",
      name: "Ana Lúcia Faria",
      role: "Investigadora Principal",
      initials: "AF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/ana-lucia-faria.png",
      category: "Investigação & Coordenação",
      bio: "I am a Health and Clinical Psychologist (Neuropsychology sub-specialty) by Ordem dos Psicólogos with a Ph.D. in Rehabilitation Psychology from the University of Coimbra in 2020. The main outcomes of my thesis were: the development of a new cognitive rehabilitation personalization framework with objective guidelines that were used to create three innovative tools-Task Generator, Reh@Task, and Reh@City and; its clinical validation with stroke patients from Madeira Health Service. In 2015 I was awarded a doctoral scholarship from ARDITI, with host institution M-ITI/LARSyS. During my doctoral studies, I have been involved in an EU project called RehabNet(303891 FP7-PEOPLE-2011). As a post-doctoral researcher, I was in the coordination team of an interdisciplinary project called BRaNT(PTDC/CCI-COM/31046/2017), which addresses the scientific limitations of current cognitive rehabilitation practices through virtual reality games that will allow automatic personalization through Artificial Intelligence approaches. Since 2010 that I teach as invited professor in the University of Madeira. \n\n I published, mostly as first author, 8 articles in peer-reviewed journals such as Journal of NeuroEngineering and Rehabilitation (IF:4.632), Frontiers in Psychology (IF:2.323), Journal of Medical Internet Research RAT (IF:4.945) and Virtual Reality (IF: 3.634). Currently, I am working on a systematic review about the Ecological validity of virtual reality-based technologies for the assessment and rehabilitation of ABI, together with Universitat Politècnica de València researchers. Additionally, I published 1 book chapter and 12 conference articles, some ACM and IEEE. I was awarded a Best Student Paper Commendation in 2014 and 2016 ICDVRAT and Best Student Paper in the 2018 Conference on Applied Psychology and Human Behavior. I have been an active participant, with posters and oral presentations, in relevant clinical meetings, such as the International Congress of Neuropsychological Rehabilitation in ABI (Best Communication prize), the International Neuropsychological Society Meetings, and the European Stroke Organisation Conference. \n\n Clinical and Health Psychologist, specialized in Neuropsychology \n University of Madeira Professor \n NeuroRehabLab Psychology Lead",
    },
    {
      id: "chefe-luis",
      name: "Luís Ferreira",
      role: "Investigador Principal",
      initials: "LF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/luis.png",
      category: "Investigação & Coordenação",
      bio: "Investigador no NeuroRehabLab / ARDITI com especialização em tecnologias de Realidade Estendida (XR), computação ubíqua e interação humano-computador. Coordena a vertente tecnológica do Projeto C.A.I.X.A., focando-se no desenvolvimento de experiências imersivas rigorosas e centradas no utilizador.",
    },
    {
      id: "chefe-monica",
      name: "Mónica Cameirão",
      role: "Investigadora Principal",
      initials: "MC",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/monica-cameirao.png",
      category: "Investigação & Coordenação",
      bio: "Mónica is an Assistant Professor and researcher at the University of Madeira (UMa) and integrated member of the NOVA Laboratory for Computer Science and Informatics (NOVA LINCS). She is the current Director of the PhD Program in Informatics Engineering of UMa. In the past she worked as research assistant at the SPECS Laboratory of the Universitat Pompeu Fabra and at the Institute of Neuroinformatics, ETH-Zürich, Switzerland; and was visiting scholar at the Quality of Life Technologies center of Carnegie Mellon University. Since Mónica arrived in Madeira in 2011, she has been co-principal investigator and co-founder of the NeuroRehabLab Research Group, an interdisciplinary research group that investigates at the intersection of technology, neuroscience and clinical practice to find novel solutions to increase the quality of life of those with special needs. Mónica has been particularly involved in the development and clinical assessment of Virtual Reality (VR) technologies for stroke rehabilitation, exploring specific brain mechanisms that relate to functional recovery to approach motor and cognitive rehabilitation by means of non-invasive and low-cost technologies. More recently, Mónica has also been involved in the development of VR solutions for supporting mental health after early pregnancy loss. Her research addresses aspects such as serious gaming and personalization of training. In 2016, Mónica has been awarded the ISVR Early Career Investigator Award, an award granted by the International Society for Virtual Rehabilitation to recognize and acknowledge outstanding contributions by early career scientists whose research relates to virtual rehabilitation. Since 2020, Mónica is a member of the Ethics Committee of UMa."
    },
  ];

  // 2. Psicólogas (2)
  const psychologists: TeamMember[] = [
    {
      id: "psico-2",
      name: "Beatriz Castro",
      role: "Psicóloga Clínica",
      initials: "BC",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
      image: "/team/beatriz-castro.png",
      category: "Psicologia Clínica",
      bio: "Psicóloga clínica com atuação dedicada ao contexto pediátrico e infanto-juvenil. No Projeto C.A.I.X.A., é responsável pela adequação pedagógica e emocional dos conteúdos, assegurando que os conceitos de prevenção oncológica são transmitidos de forma acessível, segura e positiva para as crianças.",
    },
    {
      id: "psico-1",
      name: "Petra Santos",
      role: "Psicóloga Clínica",
      initials: "PS",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
      image: "/team/petra-santos.png",
      category: "Psicologia Clínica",
      bio: "Psicóloga clínica com foco em intervenções de promoção de saúde e bem-estar infantil. No âmbito do Projeto C.A.I.X.A., colabora na avaliação neuropsicológica e no estudo do impacto das experiências imersivas na aquisição de comportamentos preventivos.",
    },
  ];

  // 3. Desenvolvedores (2)
  const developers: TeamMember[] = [
    {
      id: "dev-1",
      name: "Miguel Costa",
      role: "Desenvolvedor Frontend",
      initials: "MC",
      avatarGradient: "from-[#c6d2db] to-[#c6d2db] ring-[#30323D]/30",
      image: "/team/miguel-costa.png",
      category: "Desenvolvimento de Software",
      bio: "Desenvolvedor de software especializado em frontend, arquitetura web e interfaces interativas. No Projeto C.A.I.X.A., é responsável pela implementação e integração da plataforma digital, criando interfaces intuitivas e dinâmicas que ligam os utilizadores à experiência do projeto.",
    },
    {
      id: "dev-2",
      name: "Roberto Fernandes",
      role: "Desenvolvedor Backend",
      initials: "RF",
      avatarGradient: "from-[#c6d2db] to-[#c6d2db] ring-[#30323D]/30",
      image: "/team/roberto-f.png",
      category: "Desenvolvimento de Software",
      bio: "Engenheiro de software focado em desenvolvimento backend, gestão de dados e conectividade de sistemas. No Projeto C.A.I.X.A., estrutura a lógica de suporte e persistência de dados das aplicações, garantindo a robustez e segurança de todo o ecossistema tecnológico.",
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
      image: "/team/juan-ponte.png",
      category: "Design & Experiência",
      bio: "Designer UX/UI especializado na conceção de interfaces e experiências digitais interativas. No Projeto C.A.I.X.A., é responsável pelo design visual, desenho de personagens, usabilidade e linguagem gráfica, criando um universo lúdico e cativante para as crianças.",
    },
  ];

  return (
    <section id="equipa" className="relative border-t border-slate-200/60 bg-[#FCFAF9] py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F85308]">
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#07213D] sm:text-4xl">
            {t("team.title")}
          </h2>
        </div>

        {/* Nível 1: Liderança / Chefia */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <User className="h-4 w-4 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {t("team.leaderTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {leader.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isLeader={true}
                onOpenBio={setSelectedMember}
              />
            ))}
          </div>
        </div>

        {/* Nível 2: Psicologia (2 psicólogas) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <HeartHandshake className="h-4 w-4 text-pink-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600">
              {t("team.psychTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {psychologists.map((psychologist) => (
              <MemberCard
                key={psychologist.id}
                member={psychologist}
                onOpenBio={setSelectedMember}
              />
            ))}
          </div>
        </div>

        {/* Nível 3: Desenvolvimento de Software (2 desenvolvedores) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Code2 className="h-4 w-4 text-[#07213D]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#07213D]">
              {t("team.devTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {developers.map((dev) => (
              <MemberCard
                key={dev.id}
                member={dev}
                onOpenBio={setSelectedMember}
              />
            ))}
          </div>
        </div>

        {/* Nível 4: Design (1 UX/UI e 1 Designer) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Palette className="h-4 w-4 text-cyan-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {t("team.designTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-1">
            {designers.map((designer) => (
              <MemberCard
                key={designer.id}
                member={designer}
                onOpenBio={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal / Popup de Biografia */}
      <BioModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
