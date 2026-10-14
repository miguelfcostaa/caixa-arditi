"use client";

import { useEffect } from "react";

/**
 * Componente que desativa a possibilidade de descarregar, arrastar ou abrir o
 * menu de contexto (clique direito) em imagens em todo o website.
 */
export function ImageProtection() {
  useEffect(() => {
    const isImageElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement || target instanceof SVGElement)) {
        return false;
      }
      return (
        target.tagName === "IMG" ||
        target.tagName === "PICTURE" ||
        target.tagName === "image" ||
        Boolean(target.closest("img, picture"))
      );
    };

    // Bloqueia o clique direito (menu de contexto) apenas quando o clique é numa imagem
    const handleContextMenu = (e: MouseEvent) => {
      if (isImageElement(e.target)) {
        e.preventDefault();
      }
    };

    // Bloqueia a ação de arrastar imagens para o ambiente de trabalho ou outro separador
    const handleDragStart = (e: DragEvent) => {
      if (isImageElement(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
    };
  }, []);

  return null;
}

