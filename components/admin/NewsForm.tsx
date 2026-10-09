"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { getNewsImageUrl } from "@/lib/newsImage";

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
"Conferências & Ciência",
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
const currentImage = initialArticle?.image || "/images/image1.jpg";
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageAltPt, setImageAltPt] = useState(initialArticle?.imageAlt.pt || "");
const [imageAltEn, setImageAltEn] = useState(initialArticle?.imageAlt.en || "");

// Conteúdo / Parágrafos (como texto multilinhas para fácil edição)
const [contentPt, setContentPt] = useState(
    initialArticle?.content.pt.join("\n\n") || "",
);
const [contentEn, setContentEn] = useState(
    initialArticle?.content.en.join("\n\n") || "",
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

const handleSubmit = async (e: React.FormEvent, isPreview = false) => {
    e.preventDefault();
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
    const paragraphsPt = contentPt
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

    const paragraphsEn = contentEn
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

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
        imageAlt: {
        pt: imageAltPt.trim() || titlePt.trim(),
        en: imageAltEn.trim() || titleEn.trim() || titlePt.trim(),
        },
        content: {
        pt: paragraphsPt.length > 0 ? paragraphsPt : [titlePt.trim()],
        en: paragraphsEn.length > 0 ? paragraphsEn : paragraphsPt,
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

return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
    {/* Barra de Ações Superior */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#F85308] sm:text-sm"
        >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao painel</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
        <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50 sm:text-sm cursor-pointer"
        >
            <Eye className="h-4 w-4 text-slate-500" />
            <span>Pré-visualizar</span>
        </button>

        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#07213D] px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#07213D]/90 disabled:opacity-50 sm:text-sm cursor-pointer"
        >
            <Save className="h-4 w-4 text-[#F85308]" />
            <span>{loading ? "A guardar..." : "Guardar Notícia"}</span>
        </button>
        </div>
    </div>

    {/* Alertas */}
    {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        <div>
            <h4 className="font-semibold">Erro ao guardar</h4>
            <p className="mt-0.5">{error}</p>
        </div>
        </div>
    )}

    {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
            <h4 className="font-semibold">Operação concluída</h4>
            <p className="mt-0.5">{success}</p>
        </div>
        </div>
    )}

    {/* Cartão de Definições Gerais */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <h3 className="text-base font-bold text-[#07213D] sm:text-lg">
        Configuração da Publicação
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Estado de Publicação */}
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Estado
            </label>
            <div className="mt-2 flex gap-3">
            <label
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                status === "publicada"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                    ? "border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
            <p className="mt-1.5 text-xs text-slate-400">
            {status === "publicada"
                ? "Visível no website público e sitemap."
                : "Apenas visível no painel administrativo."}
            </p>
        </div>

        {/* Data de Publicação */}
        <div>
            <label
            htmlFor="publishedAt"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
            Data de Publicação
            </label>
            <input
            id="publishedAt"
            type="date"
            required
            value={publishedAt}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            <p className="mt-1.5 text-xs text-slate-400">
            Usada para ordenação cronológica.
            </p>
        </div>

        {/* Slug URL */}
        <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
            <label
                htmlFor="slug"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
                Identificador (Slug URL)
            </label>
            <button
                type="button"
                onClick={() => setSlugLocked(!slugLocked)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
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
                    <span className="text-amber-600">Edição manual</span>
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
                    ? "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                    : "border-slate-300 bg-white text-slate-900 focus:border-[#F85308] focus:ring-2 focus:ring-[#F85308]/20"
                }`}
            />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
            URL: /noticias/{slug || "slug-da-noticia"}
            </p>
        </div>
        </div>
    </div>


    {/* Cartão de Conteúdo com Separadores Bilingues */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h3 className="text-base font-bold text-[#07213D] sm:text-lg">
            Conteúdo Bilingue da Notícia
            </h3>
            <p className="mt-1 text-xs text-slate-500">
            Alterne entre os separadores para gerir a versão em Português e em Inglês.
            </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
            <button
            type="button"
            onClick={() => setActiveTab("pt")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pt"
                ? "bg-white text-[#07213D] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            >
            <span>🇵🇹 Português</span>
            {titlePt && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>

            <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "en"
                ? "bg-white text-[#07213D] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            >
            <span>🇬🇧 English</span>
            {titleEn && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
        </div>
        </div>

        {/* Separador Português */}
        {activeTab === "pt" && (
        <div className="mt-6 space-y-6">
            <div>
            <label
                htmlFor="titlePt"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
                Título (Português) *
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
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-base font-semibold text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label
                htmlFor="categoryPt"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Categoria (Português)
                </label>
                <input
                id="categoryPt"
                type="text"
                list="cat-suggestions-pt"
                value={categoryPt}
                onChange={(e) => setCategoryPt(e.target.value)}
                placeholder="Ex: Iniciativas Comunitárias"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
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
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Texto da Data (Português)
                </label>
                <input
                id="datePt"
                type="text"
                value={datePt}
                onChange={(e) => setDatePt(e.target.value)}
                placeholder="Ex: Outubro 2026"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>
            </div>

            <div>
            <div className="flex items-center justify-between">
                <label
                htmlFor="contentPt"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Conteúdo do Artigo (Português)
                </label>
                <span className="text-xs text-slate-400">
                Separe os parágrafos com uma linha em branco
                </span>
            </div>
            <textarea
                id="contentPt"
                rows={8}
                value={contentPt}
                onChange={(e) => setContentPt(e.target.value)}
                placeholder="Escreva os parágrafos da notícia aqui...&#10;&#10;Um novo parágrafo começa após uma linha em branco."
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
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
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
                Title (English)
            </label>
            <input
                id="titleEn"
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex: Workshop with Parents under Project C.A.I.X.A."
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-base font-semibold text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label
                htmlFor="categoryEn"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Category (English)
                </label>
                <input
                id="categoryEn"
                type="text"
                list="cat-suggestions-en"
                value={categoryEn}
                onChange={(e) => setCategoryEn(e.target.value)}
                placeholder="Ex: Community Initiatives"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
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
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Date Text (English)
                </label>
                <input
                id="dateEn"
                type="text"
                value={dateEn}
                onChange={(e) => setDateEn(e.target.value)}
                placeholder="Ex: October 2026"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>
            </div>

            <div>
            <div className="flex items-center justify-between">
                <label
                htmlFor="contentEn"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Article Content (English)
                </label>
                <span className="text-xs text-slate-400">
                Separate paragraphs with an empty line
                </span>
            </div>
            <textarea
                id="contentEn"
                rows={8}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder="Write the news article paragraphs here...&#10;&#10;A new paragraph starts after a blank line."
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
            />
            </div>
        </div>
        )}
    </div>
    
    {/* Cartão de Imagem */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <h3 className="text-base font-bold text-[#07213D] sm:text-lg">
            Imagem de Destaque
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pré-visualização e Upload */}
            <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <Image
                src={imagePreview || getNewsImageUrl(currentImage)}
                alt="Pré-visualização da imagem"
                fill
                className="object-cover"
                unoptimized
                />
            </div>

            <div className="mt-4">
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-700 transition-colors hover:border-[#F85308] hover:bg-slate-100 sm:text-sm">
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
                <p className="mt-1.5 text-xs text-slate-400">
                A imagem será guardada em public/images/noticias/ e otimizada para o website.
                </p>
            </div>
            </div>

            {/* Descrições da Imagem (Acessibilidade Alt) */}
            <div className="space-y-4">
            <div>
                <label
                htmlFor="imageAltPt"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Descrição da Imagem (PT — Acessibilidade)
                </label>
                <input
                id="imageAltPt"
                type="text"
                value={imageAltPt}
                onChange={(e) => setImageAltPt(e.target.value)}
                placeholder="Descreva a imagem em português..."
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>

            <div>
                <label
                htmlFor="imageAltEn"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                Descrição da Imagem (EN — Accessibility)
                </label>
                <input
                id="imageAltEn"
                type="text"
                value={imageAltEn}
                onChange={(e) => setImageAltEn(e.target.value)}
                placeholder="Describe the image in English..."
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-[#F85308] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
                />
            </div>
            </div>
        </div>
    </div>

    {/* Botões Inferiores */}
    <div className="flex items-center justify-end gap-3 pt-4">
        <Link
        href="/admin"
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
        Cancelar
        </Link>

        <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-[#07213D] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#07213D]/90 disabled:opacity-50 cursor-pointer"
        >
        <Save className="h-4 w-4 text-[#F85308]" />
        <span>{loading ? "A guardar..." : "Guardar e Publicar"}</span>
        </button>
    </div>
    </form>
);
}

