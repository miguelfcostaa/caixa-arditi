const configuredUrl =
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  "https://caixa.arditi.pt";

const urlWithProtocol = /^https?:\/\//i.test(configuredUrl)
  ? configuredUrl
  : `https://${configuredUrl}`;

export const siteConfig = {
  name: "Projeto C.A.I.X.A.",
  shortName: "C.A.I.X.A.",
  description:
    "Projeto dedicado à prevenção primária do cancro infantil através da literacia em saúde e de experiências interativas com tecnologias XR.",
  url: urlWithProtocol.replace(/\/$/, ""),
  locale: "pt_PT",
  alternateLocale: "en_GB",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function truncateDescription(text: string, maxLength = 160) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
