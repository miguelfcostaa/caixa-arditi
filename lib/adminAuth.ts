import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "caixa_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "caixa2026admin";
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "caixa-secret-key-development-change-in-production-2026"
  );
}

/**
 * Valida a palavra-passe de administração em tempo constante para prevenir timing attacks.
 */
export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = getAdminPassword();
  const inputBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

/**
 * Cria um token de sessão assinado com HMAC-SHA256 contendo timestamp.
 */
export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

/**
 * Valida a assinatura e a validade temporal do token de sessão.
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  // Verifica se a sessão expirou
  const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
  if (Date.now() - timestamp > maxAgeMs || timestamp > Date.now() + 60000) {
    return false;
  }

  const secret = getSessionSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(timestampStr)
    .digest("hex");

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Verifica se o pedido atual tem uma sessão válida de administrador.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(sessionToken);
}

/**
 * Opções padrão para o cookie de sessão.
 */
export const adminCookieOptions = {
  name: ADMIN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

