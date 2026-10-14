"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
Save,
Eye,
ArrowLeft,
Upload,
Lock,
Unlock,
CheckCircle2,
AlertCircle,
} from "lucide-react";
import { NewsArticle, NewsStatus } from "@/lib/newsletterData";
import { NewsImage } from "@/components/NewsImage";
import { PortugalFlag, UKFlag } from "@/components/Flags";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface NewsFormProps {
initialArticle?: NewsArticle;
isNew?: boolean;
}

const MONTH_NAMES_PT = [
"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const MONTH_NAMES_EN = [
"January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December",
];

const CATEGORY_SUGGESTIONS_PT = [
"Iniciativas Comunitárias",
"Parcerias Institucionais",
"Investigação & Validação Clínica",
"Conferências & Ciência",
"Educação & Comunidade",
"Tecnologia & Inovação",
"Publicações Científicas",
];

const CATEGORY_SUGGESTIONS_EN = [
"Community Initiatives",
"Institutional Partnerships",
"Research & Clinical Validation",
"Conferences & Science",
"Education & Community",
"Technology & Innovation",
"Scientific Publications",
];

function generateSlug(text: string): string {
return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function toInitialHtml(paragraphs?: string[]): string {
  if (!paragraphs || paragraphs.length === 0) return "";
  const joined = paragraphs.join("\n\n");
  if (/<[a-z][\s\S]*>/i.test(joined)) {
    return joined;
  }
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

export function NewsForm({ initialArticle, isNew = false }: NewsFormProps) {
const router = useRouter();

const [activeTab, setActiveTab] = useState<"pt" | "en">("pt");
const [slugLocked, setSlugLocked] = useState(!isNew);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

// Campos do formulário
const [status, setStatus] = useState<NewsStatus>(
    initialArticle?.status || "publicada",
);
const [publishedAt, setPublishedAt] = useState(
    initialArticle?.publishedAt || new Date().toISOString().split("T")[0],
);
const [slug, setSlug] = useState(initialArticle?.slug || "");

// Títulos
const [titlePt, setTitlePt] = useState(initialArticle?.title.pt || "");
const [titleEn, setTitleEn] = useState(initialArticle?.title.en || "");

// Categorias
const [categoryPt, setCategoryPt] = useState(initialArticle?.category.pt || "");
const [categoryEn, setCategoryEn] = useState(initialArticle?.category.en || "");

// Rótulos de data
const [datePt, setDatePt] = useState(initialArticle?.date.pt || "");
const [dateEn, setDateEn] = useState(initialArticle?.date.en || "");

// Imagem
const currentImage = initialArticle?.image || "";
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

// Conteúdo / Parágrafos (como HTML do editor WYSIWYG)
const [contentPt, setContentPt] = useState(
    toInitialHtml(initialArticle?.content.pt),
);
const [contentEn, setContentEn] = useState(
    toInitialHtml(initialArticle?.content.en),
);

// Atualiza automaticamente os rótulos de data quando se escolhe uma data
const handleDateChange = (newDate: string) => {
    setPublishedAt(newDate);
    if (newDate) {
    const [yearStr, monthStr] = newDate.split("-");
    const monthIdx = parseInt(monthStr, 10) - 1;
    const year = yearStr;
    if (monthIdx >= 0 && monthIdx < 12) {
        if (!datePt || isNew) setDatePt(`${MONTH_NAMES_PT[monthIdx]} ${year}`);
        if (!dateEn || isNew) setDateEn(`${MONTH_NAMES_EN[monthIdx]} ${year}`);
    }
    }
};

const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    }
};

const handleSubmit = async (e?: React.FormEvent, isPreview = false) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!titlePt.trim()) {
    setError("O título em português é obrigatório.");
    setActiveTab("pt");
    return;
    }

    if (!slug.trim()) {
    setError("O slug é obrigatório.");
    return;
    }

    setLoading(true);

    try {
    const cleanPt = contentPt.trim() === "<p></p>" ? "" : contentPt.trim();
    const cleanEn = contentEn.trim() === "<p></p>" ? "" : contentEn.trim();

    const paragraphsPt = cleanPt ? [cleanPt] : [titlePt.trim()];
    const paragraphsEn = cleanEn ? [cleanEn] : paragraphsPt;

    const articlePayload: Partial<NewsArticle> = {
        slug: slug.trim().toLowerCase(),
        status: isPreview ? "rascunho" : status,
        publishedAt,
        title: {
        pt: titlePt.trim(),
        en: titleEn.trim() || titlePt.trim(),
        },
        category: {
        pt: categoryPt.trim() || "Geral",
        en: categoryEn.trim() || categoryPt.trim() || "General",
        },
        date: {
        pt: datePt.trim() || publishedAt,
        en: dateEn.trim() || datePt.trim() || publishedAt,
        },
        image: currentImage,
        content: {
        pt: paragraphsPt,
        en: paragraphsEn,
        },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(articlePayload));
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    const res = await fetch("/api/admin/noticias", {
        method: "POST",
        body: formData,
    });

    const resData = await res.json();

    if (!res.ok) {
        setError(resData.error || "Ocorreu um erro ao gravar a notícia.");
        setLoading(false);
        return;
    }

    setSuccess(
        resData.localOnly
        ? "Notícia gravada com sucesso no sistema de ficheiros local!"
        : "Notícia publicada e comitada no repositório GitHub com sucesso!",
    );

    if (isPreview) {
        window.open(`/admin/preview/${articlePayload.slug}`, "_blank");
        setLoading(false);
    } else {
        setTimeout(() => {
        router.push("/admin");
        router.refresh();
        }, 1200);
    }
    } catch (err) {
    setError(err instanceof Error ? err.message : "Erro ao submeter notícia.");
    setLoading(false);
    }
};

const submitRef = useRef(handleSubmit);
submitRef.current = handleSubmit;

useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        submitRef.current(undefined, false);
    }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
    {/* Cabeçalho + ações */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <h2 className="text-2xl font-extrabold text-[#07213D] sm:text-3xl">
            {isNew ? "Nova Notícia" : "Editar Notícia"}
        </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:self-auto">
        <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#07213D]/50 hover:text-[#07213D] transition-colors"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
        </Link>

        <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#07213D] transition-colors hover:border-[#07213D]/30 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
        >
            <Eye className="h-4 w-4 text-[#07213D]/40" />
            <span>Pré-visualizar</span>
        </button>

        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F85308] px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#d64505] disabled:opacity-50 cursor-pointer"
        >
            <Save className="h-4 w-4" />
            <span>{loading ? "A guardar..." : "Guardar"}</span>
        </button>
        </div>
    </div>

    {/* Alertas */}
    {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
            <span className="font-semibold">Erro ao guardar — </span>{error}
        </div>
        </div>
    )}

    {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
            <span className="font-semibold">Guardado — </span>{success}
        </div>
        </div>
    )}

    {/* Configuração da Publicação */}
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-extrabold text-[#07213D]">
        Publicação
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Estado */}
        <div>
            <label className="block text-sm font-medium text-[#07213D]">
            Estado
            </label>
            <div className="mt-2 flex gap-2">
            <label
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                status === "publicada"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-50 text-[#07213D]/50 hover:bg-slate-100"
                }`}
            >
                <input
                type="radio"
                name="status"
                value="publicada"
                checked={status === "publicada"}
                onChange={() => setStatus("publicada")}
                className="sr-only"
                />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Publicada</span>
            </label>

            <label
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                status === "rascunho"
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-slate-50 text-[#07213D]/50 hover:bg-slate-100"
                }`}
            >
                <input
                type="radio"
                name="status"
                value="rascunho"
                checked={status === "rascunho"}
                onChange={() => setStatus("rascunho")}
                className="sr-only"
                />
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Rascunho</span>
            </label>
            </div>
        </div>

        {/* Data */}
        <div>
            <label
            htmlFor="publishedAt"
            className="block text-sm font-medium text-[#07213D]"
            >
            Data de Publicação
            </label>
            <input
            id="publishedAt"
            type="date"
            required
            value={publishedAt}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
        </div>

        {/* Slug */}
        <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-[#07213D]"
                >
                    Slug URL
                </label>
                <button
                    type="button"
                    onClick={() => setSlugLocked(!slugLocked)}
                    className="flex items-center gap-1 text-xs text-[#07213D]/40 hover:text-[#07213D] cursor-pointer transition-colors"
                    title={slugLocked ? "Desbloquear edição do slug" : "Bloquear slug"}
                >
                    {slugLocked ? (
                    <>
                        <Lock className="h-3 w-3" />
                        <span>Bloqueado</span>
                    </>
                    ) : (
                    <>
                        <Unlock className="h-3 w-3 text-amber-600" />
                        <span className="text-amber-600">Editável</span>
                    </>
                    )}
                </button>
            </div>
            <div className="relative mt-2">
                <input
                    id="slug"
                    type="text"
                    required
                    readOnly={slugLocked}
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="slug-da-noticia"
                    className={`block w-full rounded-xl border px-3.5 py-2 text-sm transition-colors focus:outline-hidden ${
                    slugLocked
                        ? "border-slate-200 bg-slate-100 text-[#07213D]/40 cursor-not-allowed"
                        : "border-slate-200 bg-white text-[#07213D] focus:border-[#F85308] focus:ring-2 focus:ring-[#F85308]/20"
                    }`}
                />
            </div>
        </div>
        </div>
    </div>


    {/* Cartão de Conteúdo com Separadores Bilingues */}
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h3 className="text-lg font-extrabold text-[#07213D]">
            Conteúdo da Notícia
            </h3>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
            <button
            type="button"
            onClick={() => setActiveTab("pt")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pt"
                ? "bg-white text-[#07213D] shadow-xs"
                : "text-[#07213D]/40 hover:text-[#07213D]"
            }`}
            >
            <PortugalFlag className="h-3.5 w-5 rounded-[2px] shrink-0 shadow-xs overflow-hidden" />
            <span>Português</span>
            </button>

            <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "en"
                ? "bg-white text-[#07213D] shadow-xs"
                : "text-[#07213D]/40 hover:text-[#07213D]"
            }`}
            >
            <UKFlag className="h-3.5 w-5 rounded-[2px] shrink-0 shadow-xs overflow-hidden" />
            <span>English</span>
            </button>
        </div>
        </div>

        {/* Separador Português */}
        {activeTab === "pt" && (
        <div className="mt-6 space-y-6">
            <div>
            <label
                htmlFor="titlePt"
                className="block text-sm font-medium text-[#07213D]"
            >
                Título <span className="text-[#F85308]">*</span>
            </label>
            <input
                id="titlePt"
                type="text"
                required
                value={titlePt}
                onChange={(e) => {
                const nextTitle = e.target.value;
                setTitlePt(nextTitle);
                if (!slugLocked && isNew) {
                    setSlug(generateSlug(nextTitle));
                }
                }}
                placeholder="Ex: Workshop com Pais no âmbito do Projeto C.A.I.X.A."
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-base font-semibold text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label
                htmlFor="categoryPt"
                className="block text-sm font-medium text-[#07213D]"
                >
                Categoria
                </label>
                <input
                id="categoryPt"
                type="text"
                list="cat-suggestions-pt"
                value={categoryPt}
                onChange={(e) => setCategoryPt(e.target.value)}
                placeholder="Ex: Iniciativas Comunitárias"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
                <datalist id="cat-suggestions-pt">
                {CATEGORY_SUGGESTIONS_PT.map((c) => (
                    <option key={c} value={c} />
                ))}
                </datalist>
            </div>

            <div>
                <label
                htmlFor="datePt"
                className="block text-sm font-medium text-[#07213D]"
                >
                Texto da Data
                </label>
                <input
                id="datePt"
                type="text"
                value={datePt}
                onChange={(e) => setDatePt(e.target.value)}
                placeholder="Ex: Outubro 2026"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>
            </div>

            <div>
            <label
                htmlFor="contentPt"
                className="block text-sm font-medium text-[#07213D]"
            >
                Conteúdo do Artigo
            </label>
            <RichTextEditor
                value={contentPt}
                onChange={setContentPt}
                placeholder="Escreva o conteúdo da notícia em português..."
                locale="pt"
            />
            </div>
        </div>
        )}

        {/* Separador Inglês */}
        {activeTab === "en" && (
        <div className="mt-6 space-y-6">
            <div>
            <label
                htmlFor="titleEn"
                className="block text-sm font-medium text-[#07213D]"
            >
                Title
            </label>
            <input
                id="titleEn"
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex: Workshop with Parents under Project C.A.I.X.A."
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-base font-semibold text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label
                htmlFor="categoryEn"
                className="block text-sm font-medium text-[#07213D]"
                >
                Category
                </label>
                <input
                id="categoryEn"
                type="text"
                list="cat-suggestions-en"
                value={categoryEn}
                onChange={(e) => setCategoryEn(e.target.value)}
                placeholder="Ex: Community Initiatives"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
                <datalist id="cat-suggestions-en">
                {CATEGORY_SUGGESTIONS_EN.map((c) => (
                    <option key={c} value={c} />
                ))}
                </datalist>
            </div>

            <div>
                <label
                htmlFor="dateEn"
                className="block text-sm font-medium text-[#07213D]"
                >
                Date Text
                </label>
                <input
                id="dateEn"
                type="text"
                value={dateEn}
                onChange={(e) => setDateEn(e.target.value)}
                placeholder="Ex: October 2026"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-[#07213D] transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>
            </div>

            <div>
            <label
                htmlFor="contentEn"
                className="block text-sm font-medium text-[#07213D]"
            >
                Article Content
            </label>
            <RichTextEditor
                value={contentEn}
                onChange={setContentEn}
                placeholder="Write the news article content in English..."
                locale="en"
            />
            </div>
        </div>
        )}
    </div>
    
    {/* Cartão de Imagem */}
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-extrabold text-[#07213D]">
            Imagem de Destaque
        </h3>

        <div className="mt-6 w-full">
            {/* Pré-visualização e Upload */}
            <div>
            <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-44 lg:h-48">
                <NewsImage
                src={imagePreview || currentImage}
                alt={titlePt.trim() || "Imagem da notícia"}
                className="object-cover object-center"
                unoptimized
                />
            </div>

            <div className="mt-4">
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-[#07213D]/60 transition-colors hover:border-[#F85308] hover:text-[#F85308] sm:text-sm">
                <Upload className="h-4 w-4 text-[#F85308]" />
                <span>
                    {imageFile ? imageFile.name : "Carregar nova imagem (PNG, JPG, WebP)"}
                </span>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageFileChange}
                    className="sr-only"
                />
                </label>
                <p className="mt-1.5 text-xs text-[#07213D]/50">
                A imagem será guardada em public/images/noticias/ e otimizada para o website.
                </p>
            </div>
            </div>

        </div>
    </div>

    {/* Botões Inferiores */}
    <div className="flex items-center justify-end gap-3 pt-4">
        <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#07213D]/50 hover:text-[#07213D] transition-colors"
        >
        Cancelar
        </Link>

        <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-[#F85308] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#d64505] disabled:opacity-50 cursor-pointer"
        >
        <Save className="h-4 w-4" />
        <span>{loading ? "A guardar..." : "Guardar e Publicar"}</span>
        </button>
    </div>
    </form>
);
}

