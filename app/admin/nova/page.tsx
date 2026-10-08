import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { NewsForm } from "@/components/admin/NewsForm";

export const dynamic = "force-dynamic";

export default async function NovaNoticiaPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#07213D] sm:text-3xl">
            Criar Nova Notícia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados em português e inglês para publicar no website.
          </p>
        </div>

        <NewsForm isNew={true} />
      </main>
    </div>
  );
}

