"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Unlink,
  ImagePlus,
  Columns2,
  Undo,
  Redo,
  Loader2,
  Trash2,
  Sliders,
  AlignCenter,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  locale?: "pt" | "en";
}

const EDITOR_TRANSLATIONS = {
  pt: {
    h2: "Título 2 (H2)",
    h3: "Título 3 (H3)",
    bold: "Negrito (Bold)",
    italic: "Itálico",
    underline: "Sublinhado",
    strike: "Riscado",
    bulletList: "Lista de Marcadores (Bullet Points)",
    orderedList: "Lista Numerada",
    blockquote: "Citação (Blockquote)",
    divider: "Linha Divisória",
    link: "Inserir / Editar Link",
    unlink: "Remover Link",
    image: "Imagem",
    insertImage: "Inserir Imagem",
    undo: "Desfazer",
    redo: "Refazer",
    selectedImage: "Imagem Selecionada:",
    width: "Largura:",
    height: "Altura:",
    layout: "Disposição:",
    center: "Centro",
    centerTitle: "Centrada",
    sideBySide: "Lado a Lado",
    sideBySideTitle: "Lado a Lado com outras imagens",
    delete: "Eliminar",
    deleteTitle: "Eliminar imagem selecionada",
    promptLink: "Introduza o URL do link:",
    uploadError: "Erro ao carregar a imagem.",
    autoWidthTitle: "Ajustar automaticamente ao limite (50% se for lado a lado)",
    setWidthTitle: (label: string) => `Definir largura para ${label}`,
    dragToResize: "Arrastar para aumentar ou diminuir a largura",
    autoHeightTitle: "Proporção natural da imagem",
    setHeightTitle: (label: string) => `Definir altura para ${label}`,
  },
  en: {
    h2: "Heading 2 (H2)",
    h3: "Heading 3 (H3)",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strike: "Strikethrough",
    bulletList: "Bullet List",
    orderedList: "Numbered List",
    blockquote: "Quote (Blockquote)",
    divider: "Divider Line",
    link: "Insert / Edit Link",
    unlink: "Remove Link",
    image: "Image",
    insertImage: "Insert Image",
    undo: "Undo",
    redo: "Redo",
    selectedImage: "Selected Image:",
    width: "Width:",
    height: "Height:",
    layout: "Layout:",
    center: "Center",
    centerTitle: "Centered",
    sideBySide: "Side by Side",
    sideBySideTitle: "Side by side with other images",
    delete: "Delete",
    deleteTitle: "Delete selected image",
    promptLink: "Enter link URL:",
    uploadError: "Error uploading image.",
    autoWidthTitle: "Adjust automatically to limit (50% if side-by-side)",
    setWidthTitle: (label: string) => `Set width to ${label}`,
    dragToResize: "Drag to increase or decrease width",
    autoHeightTitle: "Natural image ratio",
    setHeightTitle: (label: string) => `Set height to ${label}`,
  },
};

// Extensão customizada do Image do Tiptap com suporte para largura, altura e layout (lado a lado / centro / float)
const CustomImage = Image.extend({
  name: "image",
  inline: true,
  group: "inline",
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          element.getAttribute("width") ||
          "auto",
      },
      height: {
        default: "220px",
        parseHTML: (element) =>
          element.getAttribute("data-height") ||
          element.style.height ||
          element.getAttribute("height") ||
          "220px",
      },
      layout: {
        default: "center",
        parseHTML: (element) =>
          element.getAttribute("data-layout") || "center",
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { width = "auto", height = "220px", layout = "center", style: _ignoredStyle, ...rest } = HTMLAttributes;
    const styleParts: string[] = [];

    if (width && width !== "auto") {
      styleParts.push(`width: ${width}; max-width: 100%;`);
    } else {
      if (layout === "side-by-side") {
        styleParts.push("width: calc(50% - 0.5rem); max-width: calc(50% - 0.5rem);");
      } else {
        styleParts.push("width: auto; max-width: 100%;");
      }
    }

    if (height && height !== "auto") {
      styleParts.push(`height: ${height}; object-fit: cover;`);
    } else {
      styleParts.push("height: auto; max-height: 480px; object-fit: contain;");
    }

    if (layout === "side-by-side") {
      styleParts.push("vertical-align: top;");
    } else {
      styleParts.push("display: block; margin: 1.5rem auto;");
    }

    return [
      "img",
      mergeAttributes(rest, {
        "data-layout": layout,
        "data-width": width || "auto",
        "data-height": height || "220px",
        style: styleParts.join(" "),
        class: "custom-article-image rounded-xl shadow-xs transition-all",
      }),
    ];
  },
});

export function RichTextEditor({
  value,
  onChange,
  locale = "pt",
}: RichTextEditorProps) {
  const t = EDITOR_TRANSLATIONS[locale] || EDITOR_TRANSLATIONS.pt;
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInternalUpdateRef = useRef(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para customização da imagem ativa
  const [selectedImagePos, setSelectedImagePos] = useState<number | null>(null);
  const [activeImgAttrs, setActiveImgAttrs] = useState<{
    src?: string;
    width?: string | null;
    height?: string | null;
    layout?: string;
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#F85308] underline font-medium hover:text-[#d64505]",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CustomImage,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] w-full px-4 py-3.5 text-sm sm:text-base leading-relaxed text-[#07213D] focus:outline-none focus:ring-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#07213D] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#07213D] [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:my-3 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[#F85308] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#07213D]/80 [&_blockquote]:my-4 [&_hr]:my-6 [&_hr]:border-slate-200",
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        if (target && target.tagName === "IMG") {
          const nodePos = view.posAtDOM(target, 0);
          if (nodePos >= 0) {
            const tr = view.state.tr.setSelection(
              NodeSelection.create(view.state.doc, nodePos),
            );
            view.dispatch(tr);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      isInternalUpdateRef.current = true;
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      if (editor.isActive("image")) {
        const { from } = editor.state.selection;
        setSelectedImagePos(from);
        const attrs = editor.getAttributes("image");
        setActiveImgAttrs({
          src: attrs.src || "",
          width: attrs.width || "",
          height: attrs.height || "",
          layout: attrs.layout || "center",
        });
      } else if (editor.isFocused) {
        setActiveImgAttrs(null);
        setSelectedImagePos(null);
      }
    },
  });

  // Atualiza o editor quando o valor externo muda (ex: trocar de aba PT/EN)
  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Fechar menu de imagem ao clicar fora do componente do editor
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveImgAttrs(null);
        setSelectedImagePos(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  if (!editor) {
    return null;
  }

  // Helper para carregar uma imagem para o backend
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.url) {
      return data.url;
    }
    alert(data.error || t.uploadError);
    return null;
  };

  // Upload de 1 imagem normal
  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: {
              src: url,
              alt: file.name,
              layout: "center",
            },
          })
          .run();
      }
    } finally {
      setUploadingImage(false);
      if (singleFileInputRef.current) singleFileInputRef.current.value = "";
    }
  };



  // Atualizar atributos da imagem selecionada
  const updateImageAttr = (
    attrs: Partial<{ width: string | null; height: string | null; layout: string }>,
    shouldFocus = false,
  ) => {
    if (!editor) return;

    // Localizar a posição exata da imagem ativa
    let targetPos = selectedImagePos;
    if (targetPos !== null) {
      const node = editor.state.doc.nodeAt(targetPos);
      if (!node || node.type.name !== "image") {
        targetPos = null;
      }
    }

    if (targetPos === null && activeImgAttrs?.src) {
      editor.state.doc.descendants((node, pos) => {
        if (targetPos === null && node.type.name === "image" && node.attrs.src === activeImgAttrs.src) {
          targetPos = pos;
          return false;
        }
      });
    }

    if (targetPos !== null) {
      setSelectedImagePos(targetPos);
      const { tr } = editor.state;
      const node = tr.doc.nodeAt(targetPos);
      if (node) {
        tr.setNodeMarkup(targetPos, undefined, {
          ...node.attrs,
          ...attrs,
        });
        tr.setSelection(NodeSelection.create(tr.doc, targetPos));
        isInternalUpdateRef.current = true;
        editor.view.dispatch(tr);
        if (shouldFocus) {
          editor.view.focus();
        }
        setActiveImgAttrs((prev) => (prev ? { ...prev, ...attrs } : null));
        return;
      }
    }

    // Fallback normal
    if (shouldFocus) {
      editor.chain().focus().updateAttributes("image", attrs).run();
    } else {
      editor.commands.updateAttributes("image", attrs);
    }
    setActiveImgAttrs((prev) => (prev ? { ...prev, ...attrs } : null));
  };

  const handleWidthSliderChange = (newVal: number) => {
    let finalWidth: string;
    if (newVal === 100) {
      finalWidth = "100%";
    } else if (activeImgAttrs?.layout === "side-by-side" && newVal === 50) {
      finalWidth = "calc(50% - 0.5rem)";
    } else if (activeImgAttrs?.layout === "side-by-side" && newVal === 33) {
      finalWidth = "calc(33.333% - 0.5rem)";
    } else {
      finalWidth = `${newVal}%`;
    }
    updateImageAttr({ width: finalWidth }, false);
  };

  const currentWidthStr = activeImgAttrs?.width || "";
  const isWidthAuto = !currentWidthStr || currentWidthStr === "auto";
  const numericWidth = (() => {
    if (isWidthAuto) {
      return activeImgAttrs?.layout === "side-by-side" ? 50 : 100;
    }
    const match = currentWidthStr.match(/(\d+(?:\.\d+)?)%/);
    if (match) return Math.round(parseFloat(match[1]));
    const pxMatch = currentWidthStr.match(/(\d+)px/);
    if (pxMatch) {
      return Math.min(100, Math.max(15, Math.round((parseInt(pxMatch[1], 10) / 720) * 100)));
    }
    return 100;
  })();

  // Inserir link
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(t.promptLink, previousUrl || "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div ref={containerRef} className="relative mt-2 rounded-xl border border-slate-200 bg-white shadow-xs focus-within:border-[#F85308] focus-within:ring-2 focus-within:ring-[#F85308]/20 transition-all">
      {/* Topo Flutuante (Barra de Ferramentas + Ajustes de Imagem) */}
      <div className="sticky top-20 z-30 rounded-t-xl border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs transition-shadow">
        {/* Barra de Ferramentas WYSIWYG */}
        <div className="flex flex-wrap items-center gap-1 p-2 sm:gap-1.5">
        {/* Títulos / Estrutura */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.h2}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.h3}
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Formatação Básica de Texto */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.bold}
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.italic}
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("underline")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.underline}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("strike")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.strike}
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Listas */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.bulletList}
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.orderedList}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.blockquote}
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D] transition-colors cursor-pointer"
          title={t.divider}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-[#07213D] text-white shadow-xs"
              : "text-[#07213D]/70 hover:bg-slate-200/60 hover:text-[#07213D]"
          }`}
          title={t.link}
        >
          <Link2 className="h-4 w-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title={t.unlink}
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}

        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* Botão Inserir Imagem */}
        <button
          type="button"
          onClick={() => singleFileInputRef.current?.click()}
          disabled={uploadingImage}
          className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#07213D]/80 hover:bg-[#F85308]/10 hover:text-[#F85308] transition-colors cursor-pointer disabled:opacity-50"
          title={t.insertImage}
        >
          {uploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#F85308]" />
          ) : (
            <ImagePlus className="h-4 w-4 text-[#F85308]" />
          )}
          <span className="hidden sm:inline">{t.image}</span>
        </button>
        <input
          ref={singleFileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleSingleImageUpload}
          className="sr-only"
        />

        {/* Undo / Redo */}
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#07213D]/50 hover:bg-slate-200/60 hover:text-[#07213D] disabled:opacity-30 transition-colors cursor-pointer"
            title={t.undo}
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#07213D]/50 hover:bg-slate-200/60 hover:text-[#07213D] disabled:opacity-30 transition-colors cursor-pointer"
            title={t.redo}
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

        {/* Painel de Customização da Imagem Selecionada */}
        {activeImgAttrs && (
          <div
            className="flex flex-wrap items-center gap-2 border-t border-amber-200 bg-amber-50/95 px-3 py-2 text-xs text-[#07213D] animate-in fade-in duration-150"
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).tagName !== "INPUT") {
                e.preventDefault();
              }
            }}
          >
          <div className="flex items-center gap-1.5 font-bold text-[#F85308]">
            <Sliders className="h-3.5 w-3.5" />
            <span>{t.selectedImage}</span>
          </div>

          {/* Presets e Barra de Ajuste de Largura */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-[#07213D]/60 text-[11px] whitespace-nowrap">{t.width}</span>

            {/* Barra que pode arrastar */}
            <div
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 shadow-2xs"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <input
                type="range"
                min={15}
                max={100}
                step={1}
                value={numericWidth}
                onChange={(e) => handleWidthSliderChange(Number(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
                className="h-1.5 w-20 sm:w-28 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#07213D] hover:accent-[#F85308] transition-colors touch-none"
                title={t.dragToResize}
              />
              <span className="min-w-[34px] text-right font-mono text-[11px] font-bold text-[#07213D]">
                {isWidthAuto ? "Auto" : `${numericWidth}%`}
              </span>
            </div>

            {/* Presets Rápidos */}
            <div className="flex items-center gap-1">
              {[
                { label: "Auto", val: "auto" },
                { label: "25%", val: "25%" },
                { label: "33%", val: "calc(33.333% - 0.5rem)" },
                { label: "50%", val: "calc(50% - 0.5rem)" },
                { label: "75%", val: "75%" },
                { label: "100%", val: "100%" },
              ].map(({ label, val }) => {
                const isActive =
                  val === "auto"
                    ? isWidthAuto
                    : !isWidthAuto && (
                        (val === "25%" && numericWidth === 25) ||
                        (val.includes("33") && numericWidth === 33) ||
                        (val.includes("50") && numericWidth === 50) ||
                        (val === "75%" && numericWidth === 75) ||
                        (val === "100%" && numericWidth === 100)
                      );

                return (
                  <button
                    key={label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => updateImageAttr({ width: val }, true)}
                    className={`rounded-md px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#07213D] text-white shadow-xs"
                        : "bg-white text-[#07213D] border border-slate-200 hover:border-slate-300"
                    }`}
                    title={val === "auto" ? t.autoWidthTitle : t.setWidthTitle(label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-4 w-px bg-amber-300 mx-1 hidden sm:block" />

          {/* Presets de Altura */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#07213D]/60 text-[11px]">{t.height}</span>
            {[
              { label: "Auto", val: "auto" },
              { label: "220px", val: "220px" },
              { label: "280px", val: "280px" },
              { label: "360px", val: "360px" },
            ].map(({ label, val }) => (
              <button
                key={label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => updateImageAttr({ height: val }, true)}
                className={`rounded-md px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeImgAttrs.height === val || (val === "220px" && (!activeImgAttrs.height || activeImgAttrs.height === "220px"))
                    ? "bg-[#07213D] text-white shadow-xs"
                    : "bg-white text-[#07213D] border border-slate-200 hover:border-slate-300"
                }`}
                title={val === "auto" ? t.autoHeightTitle : t.setHeightTitle(label)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-amber-300 mx-1 hidden md:block" />

          {/* Disposição */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#07213D]/60 text-[11px]">{t.layout}</span>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => updateImageAttr({ layout: "center" }, true)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold cursor-pointer ${
                activeImgAttrs.layout === "center"
                  ? "bg-[#07213D] text-white shadow-xs"
                  : "bg-white border border-slate-200 hover:border-slate-300"
              }`}
              title={t.centerTitle}
            >
              <AlignCenter className="h-3 w-3" />
              <span>{t.center}</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                updateImageAttr({
                  layout: "side-by-side",
                  width:
                    activeImgAttrs.width &&
                    activeImgAttrs.width !== "auto" &&
                    activeImgAttrs.width !== "100%"
                      ? activeImgAttrs.width
                      : "calc(50% - 0.5rem)",
                }, true)
              }
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold cursor-pointer ${
                activeImgAttrs.layout === "side-by-side"
                  ? "bg-[#07213D] text-white shadow-xs"
                  : "bg-white border border-slate-200 hover:border-slate-300"
              }`}
              title={t.sideBySideTitle}
            >
              <Columns2 className="h-3 w-3" />
              <span>{t.sideBySide}</span>
            </button>


          </div>

          {/* Remover Imagem */}
          <button
            type="button"
            onClick={() => {
              let targetPos = selectedImagePos;
              if (targetPos === null && activeImgAttrs?.src) {
                editor.state.doc.descendants((node, pos) => {
                  if (targetPos === null && node.type.name === "image" && node.attrs.src === activeImgAttrs.src) {
                    targetPos = pos;
                    return false;
                  }
                });
              }
              if (targetPos !== null) {
                const node = editor.state.doc.nodeAt(targetPos);
                if (node) {
                  const tr = editor.state.tr.delete(targetPos, targetPos + node.nodeSize);
                  isInternalUpdateRef.current = true;
                  editor.view.dispatch(tr);
                }
              } else {
                editor.chain().focus().deleteSelection().run();
              }
              setActiveImgAttrs(null);
              setSelectedImagePos(null);
            }}
            className="ml-auto flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
            title={t.deleteTitle}
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
            <span>{t.delete}</span>
          </button>
        </div>
      )}
      </div>

      {/* Área Editável WYSIWYG */}
      <EditorContent editor={editor} className="overflow-hidden rounded-b-xl" />
    </div>
  );
}
