const NEWS_IMAGE_PREFIX = "/images/noticias/";

/**
 * As imagens carregadas no admin vivem no GitHub e podem não existir no
 * filesystem imutável do contentor. Esta URL passa por uma rota que suporta
 * ambas as origens.
 */
export function getNewsImageUrl(image: string): string {
  if (!image.startsWith(NEWS_IMAGE_PREFIX)) {
    return image;
  }

  const filename = image.slice(NEWS_IMAGE_PREFIX.length);
  if (!filename || filename.includes("/")) {
    return image;
  }

  return `/api/noticias/imagens/${encodeURIComponent(filename)}`;
}
