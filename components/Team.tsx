"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, HeartHandshake, Code2, Palette, Handshake, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
  image?: string; // Caminho da foto em /public/team/
  category?: string;
  bio?: {
    pt: string;
    en: string;
  } | string;
}

// Componente Modal de Biografia com altura fixa e scroll obrigatório
function BioModal({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  const { locale, t } = useLanguage();

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

  // Resolve a biografia conforme o idioma atual (com fallback para o outro idioma se vazio)
  const currentBio = (() => {
    if (!member.bio) return t("team.defaultBio");
    if (typeof member.bio === "string") return member.bio;
    return member.bio[locale] || member.bio.pt || member.bio.en || t("team.defaultBio");
  })();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-member-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Fundo escurecido (Backdrop) */}
      <div
        className="fixed inset-0 bg-[#07213D]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Janela de Biografia - Mais larga (max-w-2xl) com altura fixa e scroll suave */}
      <div className="relative z-10 flex h-[500px] sm:h-[530px] max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FCFAF9] p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200/80 transition-all animate-in zoom-in-95 duration-200">
        {/* Botão de Fechar fixo */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#07213D] transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F85308]"
          aria-label={t("team.close")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabeçalho Fixo com Fotografia e Nome */}
        <div className="flex shrink-0 flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3.5 sm:gap-5 pt-1 sm:pt-0 sm:pr-10">
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
        <div className="flex-1 overflow-y-auto pr-2 sm:pr-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#07213D]/70 sticky top-0 bg-[#FCFAF9] py-0.5">
            {t("team.bioTitle")}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line text-justify">
            {currentBio}
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
    <div className="group relative flex flex-col items-center rounded-2xl p-3 sm:p-6 text-center transition-all hover:-translate-y-1">
      {/* Moldura da Imagem / Fotografia - Clicável para abrir o popup */}
      <button
        type="button"
        onClick={() => onOpenBio(member)}
        aria-label={`${t("team.viewBio")} - ${member.name}`}
        className={`group/avatar relative mb-2 sm:mb-4 flex h-24 w-24 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#FCFAF9] bg-gradient-to-br ${member.avatarGradient} shadow-md ring-1 ring-slate-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg hover:ring-2 hover:ring-[#F85308] cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F85308]`}
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
        className="text-sm font-bold text-[#07213D] transition-colors group-hover:text-[#F85308] hover:text-[#F85308] sm:text-lg cursor-pointer focus:outline-hidden"
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
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // 1. Chefe do Projeto / Investigadores Principais
  const leader: TeamMember[] = [
    {
      id: "chefe-ana",
      name: "Ana Lúcia Faria",
      role: t("team.defaultRoleInv"),
      initials: "AF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/ana-lucia-faria.png",
      category: "Investigação & Coordenação",
      bio: {
        pt: "É Psicóloga Clínica e da Saúde (com especialidade avançada em Neuropsicologia) pela Ordem dos Psicólogos Portugueses, doutorada em Psicologia da Reabilitação pela Universidade de Coimbra em 2020. Os principais resultados da sua tese foram o desenvolvimento de um novo modelo de personalização da reabilitação cognitiva com diretrizes objetivas, utilizadas para criar três ferramentas inovadoras — Task Generator, Reh@Task e Reh@City — e a sua validação clínica com doentes vítimas de AVC no Serviço de Saúde da Madeira (SESARAM). Em 2015 foi-lhe atribuída uma bolsa de doutoramento pela ARDITI, tendo como instituição de acolhimento o M-ITI/LARSyS. Durante os seus estudos de doutoramento, esteve envolvida no projeto europeu RehabNet (303891 FP7-PEOPLE-2011). Como investigadora de pós-doutoramento, integrou a equipa de coordenação do projeto interdisciplinar BRaNT (PTDC/CCI-COM/31046/2017), que aborda as limitações científicas das práticas atuais de reabilitação cognitiva através de jogos de realidade virtual com personalização automática baseada em Inteligência Artificial. Desde 2010 leciona como professora convidada na Universidade da Madeira. \n\n Publicou, maioritariamente como primeira autora, 8 artigos em revistas científicas com revisão por pares, tais como o Journal of NeuroEngineering and Rehabilitation (IF: 4.632), Frontiers in Psychology (IF: 2.323), Journal of Medical Internet Research (IF: 4.945) e Virtual Reality (IF: 3.634). Atualmente, está a desenvolver uma revisão sistemática sobre a validade ecológica de tecnologias baseadas em realidade virtual para a avaliação e reabilitação de Lesões Cerebrais Adquiridas (LCA), em colaboração com investigadores da Universitat Politècnica de València. Além disso, publicou 1 capítulo de livro e 12 artigos em conferências (alguns ACM e IEEE). Foi distinguida com a Best Student Paper Commendation em 2014 e 2016 no ICDVRAT e o Best Student Paper na Conferência de Psicologia Aplicada e Comportamento Humano de 2018. Tem participado ativamente com posters e apresentações orais em reuniões clínicas de relevo internacional, como o International Congress of Neuropsychological Rehabilitation in ABI (Prémio de Melhor Comunicação), International Neuropsychological Society Meetings e European Stroke Organisation Conference. \n\n Psicóloga Clínica e da Saúde, Especialista em Neuropsicologia \n Professora Convidada na Universidade da Madeira \n Responsável pela área de Psicologia no NeuroRehabLab",
        en: "She is a Clinical and Health Psychologist (with an advanced specialization in Neuropsychology) accredited by the Portuguese Psychologists’ Association, and holds a PhD in Rehabilitation Psychology from the University of Coimbra, completed in 2020. The main outcomes of her thesis were the development of a new model for personalizing cognitive rehabilitation with objective guidelines, which were used to create three innovative tools — Task Generator, Reh@Task, and Reh@City — and their clinical validation with stroke patients at the Madeira Health Service (SESARAM). In 2015, she was awarded a PhD scholarship by ARDITI, with M-ITI/LARSyS as the host institution. During her doctoral studies, she was involved in the European RehabNet project (303891 FP7-PEOPLE-2011). As a postdoctoral researcher, she was part of the coordination team of the interdisciplinary BRaNT project (PTDC/CCI-COM/31046/2017), which addresses the scientific limitations of current cognitive rehabilitation practices through virtual reality games with automatic personalization based on Artificial Intelligence. Since 2010, she has taught as a guest lecturer at the University of Madeira. \n\n She has published 8 peer-reviewed journal articles, mostly as first author, in journals such as the Journal of NeuroEngineering and Rehabilitation (IF: 4.632), Frontiers in Psychology (IF: 2.323), Journal of Medical Internet Research (IF: 4.945), and Virtual Reality (IF: 3.634). She is currently developing a systematic review on the ecological validity of virtual reality-based technologies for the assessment and rehabilitation of Acquired Brain Injuries (ABI), in collaboration with researchers from the Universitat Politècnica de València. In addition, she has published 1 book chapter and 12 conference papers, including ACM and IEEE publications. She received the Best Student Paper Commendation in 2014 and 2016 at ICDVRAT, as well as the Best Student Paper award at the 2018 Conference on Applied Psychology and Human Behaviour. She has actively participated with posters and oral presentations at internationally relevant clinical meetings, including the International Congress of Neuropsychological Rehabilitation in ABI (Best Communication Award), International Neuropsychological Society Meetings, and the European Stroke Organisation Conference. \n\n Clinical and Health Psychologist, Specialist in Neuropsychology \n Guest Lecturer at the University of Madeira \n Head of the Psychology Area at NeuroRehabLab",
      },
    },
    {
      id: "chefe-luis",
      name: "Luís Ferreira",
      role: t("team.defaultRoleInv"),
      initials: "LF",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/luis.png",
      category: "Investigação & Coordenação",
      bio: {
        pt: "É licenciado em Design Interativo pela Universidade da Madeira e mestre em Tecnologias do Entretenimento pela Carnegie Mellon University. Em 2021, concluiu o Doutoramento em Média Digitais na Faculdade de Ciências e Tecnologia da Universidade NOVA de Lisboa (FCT NOVA), onde desenvolveu a Musiquence, uma plataforma que recorre a elementos como a música e a reminiscência para a estimulação cognitiva. \n\n Atualmente, é docente na Universidade da Madeira e colabora ativamente em projetos de investigação no NeuroRehabLab e no NOVA LINCS. O seu trabalho centra-se sobretudo no desenvolvimento de jogos sérios e no estudo do seu impacto em populações clínicas, incluindo populações com condições neurológicas e psiquiátricas.",
        en: "He holds a Bachelor's degree in Interactive Design from the University of Madeira and a Master's degree in Entertainment Technology from Carnegie Mellon University. In 2021, he completed his PhD in Digital Media at the NOVA School of Science and Technology (NOVA FCT), where he developed Musiquence, a platform that uses elements such as music and reminiscence for cognitive stimulation. \n\n He is currently a lecturer at the University of Madeira and actively collaborates on research projects at NeuroRehabLab and NOVA LINCS. His work focuses primarily on the development of serious games and the study of their impact on clinical populations, including people with neurological and psychiatric conditions.",
      },
    },
    {
      id: "chefe-monica",
      name: "Mónica Cameirão",
      role: t("team.defaultRoleInv"),
      initials: "MC",
      avatarGradient: "from-amber-500 to-amber-700 ring-amber-700/30",
      image: "/team/monica-cameirao.png",
      category: "Investigação & Coordenação",
      bio: {
        pt: "É Professora Auxiliar e investigadora na Universidade da Madeira (UMa) e membro integrado do NOVA Laboratory for Computer Science and Informatics (NOVA LINCS). É a atual Diretora do Programa de Doutoramento em Engenharia Informática da UMa. No passado, trabalhou como assistente de investigação no Laboratório SPECS da Universitat Pompeu Fabra e no Institute of Neuroinformatics da ETH-Zürich, na Suíça; foi também investigadora visitante no Quality of Life Technologies Center da Carnegie Mellon University. Desde que chegou à Madeira em 2011, é co-investigadora principal e co-fundadora do Grupo de Investigação NeuroRehabLab, um grupo interdisciplinar que investiga na interseção entre tecnologia, neurociência e prática clínica para encontrar soluções inovadoras que melhorem a qualidade de vida de pessoas com necessidades especiais. A Mónica tem estado particularmente envolvida no desenvolvimento e avaliação clínica de tecnologias de Realidade Virtual (RV) para a reabilitação pós-AVC, explorando mecanismos cerebrais específicos relacionados com a recuperação funcional para abordar a reabilitação motora e cognitiva através de tecnologias não invasivas e de baixo custo. Mais recentemente, tem colaborado no desenvolvimento de soluções de RV para apoio à saúde mental após perda gestacional precoce. A sua investigação foca aspetos como jogos sérios (serious games) e personalização do treino. Em 2016, foi distinguida com o prémio ISVR Early Career Investigator Award pela International Society for Virtual Rehabilitation, em reconhecimento das contribuições de excelência de jovens cientistas na área da reabilitação virtual. Desde 2020, é membro da Comissão de Ética da UMa.",
        en: "She is an Assistant Professor and researcher at the University of Madeira (UMa) and integrated member of the NOVA Laboratory for Computer Science and Informatics (NOVA LINCS). She is the current Director of the PhD Program in Informatics Engineering of UMa. In the past she worked as research assistant at the SPECS Laboratory of the Universitat Pompeu Fabra and at the Institute of Neuroinformatics, ETH-Zürich, Switzerland; and was visiting scholar at the Quality of Life Technologies center of Carnegie Mellon University. Since Mónica arrived in Madeira in 2011, she has been co-principal investigator and co-founder of the NeuroRehabLab Research Group, an interdisciplinary research group that investigates at the intersection of technology, neuroscience and clinical practice to find novel solutions to increase the quality of life of those with special needs. Mónica has been particularly involved in the development and clinical assessment of Virtual Reality (VR) technologies for stroke rehabilitation, exploring specific brain mechanisms that relate to functional recovery to approach motor and cognitive rehabilitation by means of non-invasive and low-cost technologies. More recently, Mónica has also been involved in the development of VR solutions for supporting mental health after early pregnancy loss. Her research addresses aspects such as serious gaming and personalization of training. In 2016, Mónica has been awarded the ISVR Early Career Investigator Award, an award granted by the International Society for Virtual Rehabilitation to recognize and acknowledge outstanding contributions by early career scientists whose research relates to virtual rehabilitation. Since 2020, Mónica is a member of the Ethics Committee of UMa.",
      },
    },
  ];

  // 2. Psicólogas (2)
  const psychologists: TeamMember[] = [
    {
      id: "psico-2",
      name: "Beatriz Castro",
      role: t("team.defaultRolePsi"),
      initials: "BC",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
      image: "/team/beatriz-castro.png",
      category: "Psicologia Clínica",
      bio: {
        pt: "Psicóloga clínica.",
        en: "Clinical psychologist.",
      },
    },
    {
      id: "psico-1",
      name: "Petra Santos",
      role: t("team.defaultRolePsi"),
      initials: "PS",
      avatarGradient: "from-pink-500 to-pink-800 ring-[#4D5061]/30",
      image: "/team/petra-santos.png",
      category: "Psicologia Clínica",
      bio: {
        pt: "É Psicóloga, Membro Efetivo da Ordem dos Psicólogos Portugueses (Cédula Profissional n.º 32238), Mestre em Psicologia Clínica, da Saúde e Bem-Estar pela Universidade da Madeira e Formadora Certificada. Atualmente, encontra-se na Agência Regional para o Desenvolvimento da Investigação, Tecnologia e Inovação (ARDITI), como Psicóloga no Projeto C.A.I.X.A.: Da Consciencialização à Ação: Impacto Neuropsicológico das Tecnologias XR na Aprendizagem para Prevenção do Cancro Infantil. No âmbito do projeto, participa na conceção e desenvolvimento de atividades e conteúdos psicoeducativos para integração numa plataforma digital gamificada. O seu contributo centra-se na promoção da literacia em saúde e de estilos de vida saudáveis desde a infância e adolescência, numa perspetiva de prevenção do cancro ao longo do ciclo vital. Possui experiência em avaliação e intervenção psicológica em contextos clínicos, de saúde e comunitários, com particular destaque na área da Psico-Oncologia, na qual realizou intervenção psicológica com doentes oncológicos e familiares, dinamizou ações de formação e sensibilização e, colaborou em projetos institucionais e em contexto multidisciplinar. O seu percurso inclui ainda experiência nos Cuidados de Saúde Primários e no apoio psicossocial a vítimas de violência doméstica. Paralelamente, é autora e coautora de publicações nas áreas da Psicologia, Bem-Estar, Luto e Terapia Narrativa. A sua dissertação de mestrado incidiu sobre os contributos da Terapia Narrativa no processo de luto complicado.",
        en: "She is a Psychologist, Member of the Portuguese Psychologists Association (No. 32238), holds a Master’s degree in Clinical, Health and Well-Being Psychology from the University of Madeira, and is a Certified Trainer. She is currently working at the Regional Agency for the Development of Research, Technology and Innovation (ARDITI) as a Psychologist in the C.A.I.X.A. Project – From Awareness to Action: Neuropsychological Impact of XR Technologies on Learning for Childhood Cancer Prevention. Within the project, she contributes to the design and development of psychoeducational activities and content for integration into a gamified digital platform. Her contribution focuses on promoting health literacy and healthy lifestyles from childhood and adolescence, with a view to cancer prevention across the lifespan. She has experience in psychological assessment and intervention across clinical, healthcare, and community settings, with a particular focus on Psycho-Oncology, where she provided psychological intervention to cancer patients and their families, delivered training and awareness-raising initiatives, and collaborated on institutional projects and within multidisciplinary teams. Her professional background also includes experience in Primary Healthcare and in providing psychosocial support to victims of domestic violence. Alongside her professional practice, she is the author and co-author of publications in the fields of Psychology, Well-Being, Grief, and Narrative Therapy. Her Master’s dissertation focused on the contributions of Narrative Therapy to the process of complicated grief.",
      },
    },
  ];

  // 3. Desenvolvedores (2)
  const developers: TeamMember[] = [
    {
      id: "dev-1",
      name: "Miguel Costa",
      role: t("team.defaultRoleDevF"),
      initials: "MC",
      avatarGradient: "from-[#c6d2db] to-[#c6d2db] ring-[#30323D]/30",
      image: "/team/miguel-costa.png",
      category: "Desenvolvimento de Software",
      bio: {
        pt: "É licenciado e mestre em Engenharia Informática pela Universidade da Madeira. A sua dissertação de mestrado centrou-se na utilização de tecnologias interativas e jogos sérios aplicados à educação para a saúde, com especial foco na prevenção do cancro em crianças.",
        en: "He holds both a Bachelor's and a Master's degree in Computer Engineering from the University of Madeira. His Master's dissertation focused on the use of interactive technologies and serious games in health education, with a particular emphasis on cancer prevention in children.",
      },
    },
    {
      id: "dev-2",
      name: "Roberto Fernandes",
      role: t("team.defaultRoleDevB"),
      initials: "RF",
      avatarGradient: "from-[#c6d2db] to-[#c6d2db] ring-[#30323D]/30",
      image: "/team/roberto-f.png",
      category: "Desenvolvimento de Software",
      bio: {
        pt: "Engenheiro de software. ",
        en: "Software engineer .",
      },
    },
  ];

  // 4. Design (1 UX/UI e 1 Designer)
  const designers: TeamMember[] = [
    {
      id: "des-ux",
      name: "Juan Ponte",
      role: t("team.defaultRoleDes"),
      initials: "JP",
      avatarGradient: "from-cyan-600 to-cyan-800 ring-[#E06126]/20",
      image: "/team/juan-ponte.png",
      category: "Design & Experiência",
      bio: {
        pt: "Designer UX/UI ",
        en: "UX/UI designer ",
      },
    },
  ];

  // 5. Parceiros
  const partners: TeamMember[] = [
    {
      id: "parceiro-1",
      name: "Ricardo Sousa",
      role: t("team.defaultRolePartnerLPCC"),
      initials: "RS",
      avatarGradient: "from-emerald-600 to-teal-800 ring-emerald-700/20",
      image: "/team/ricardo-sousa.png",
      category: "Parcerias",
      bio: {
        pt: "Presidente da Direcção do Núcleo Regional da Madeira da Liga Portuguesa Contra o Cancro.",
        en: "President of the Board of Directors of the Madeira Regional Branch of the Portuguese League Against Cancer.",
      },
    },
  ];

  const allMembers = [...leader, ...psychologists, ...developers, ...designers, ...partners];
  const selectedMember = allMembers.find((m) => m.id === selectedMemberId) || null;

  return (
    <section id="equipa" className="relative border-t border-slate-200/60 bg-[#FCFAF9] py-16 sm:py-24 lg:py-32 scroll-mt-20">
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
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3">
            {leader.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isLeader={true}
                onOpenBio={(m) => setSelectedMemberId(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Nível 2: Psicologia (2 psicólogas) */}
        <div className="mt-10 sm:mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <HeartHandshake className="h-4 w-4 text-pink-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600">
              {t("team.psychTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-2">
            {psychologists.map((psychologist) => (
              <MemberCard
                key={psychologist.id}
                member={psychologist}
                onOpenBio={(m) => setSelectedMemberId(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Nível 3: Desenvolvimento de Software (2 desenvolvedores) */}
        <div className="mt-10 sm:mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Code2 className="h-4 w-4 text-[#07213D]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#07213D]">
              {t("team.devTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-2">
            {developers.map((dev) => (
              <MemberCard
                key={dev.id}
                member={dev}
                onOpenBio={(m) => setSelectedMemberId(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Nível 4: Design (1 UX/UI e 1 Designer) */}
        <div className="mt-10 sm:mt-16">
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
                onOpenBio={(m) => setSelectedMemberId(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Nível 5: Parceiros */}
        <div className="mt-10 sm:mt-16">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Handshake className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {t("team.partnersTitle")}
            </h3>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-1">
            {partners.map((partner) => (
              <MemberCard
                key={partner.id}
                member={partner}
                onOpenBio={(m) => setSelectedMemberId(m.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal / Popup de Biografia */}
      <BioModal
        member={selectedMember}
        onClose={() => setSelectedMemberId(null)}
      />
    </section>
  );
}
