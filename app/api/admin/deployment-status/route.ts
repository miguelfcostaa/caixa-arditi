import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { getDeploymentStatus } from "@/lib/githubStorage";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const status = await getDeploymentStatus();
  return NextResponse.json(status);
}

