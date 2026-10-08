import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { loadAllNews } from "@/lib/githubStorage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { NewsForm } from "@/components/admin/NewsForm";

export const dynamic = "force-dynamic";

interface EditarPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditarNoticiaPage({ params }: EditarPageProps) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const allNews = await loadAllNews();
  const article = allNews.find((item) => item.slug === slug);

  if (!article) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#07213D] sm:text-3xl">
            Editar Notícia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A editar: <span className="font-semibold text-slate-700">{article.title.pt}</span>
          </p>
        </div>

        <NewsForm initialArticle={article} isNew={false} />
      </main>
    </div>
  );
}

