import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieOptions,
  createSessionToken,
  isAuthenticatedAdmin,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "A palavra-passe é obrigatória." },
        { status: 400 },
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Palavra-passe incorreta." },
        { status: 401 },
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(adminCookieOptions.name, token, adminCookieOptions);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao processar a autenticação." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieOptions.name);
  return NextResponse.json({ success: true });
}

