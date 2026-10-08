import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { loadAllNews } from "@/lib/githubStorage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { NewsListClient } from "@/components/admin/NewsListClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const allNews = await loadAllNews();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <NewsListClient initialNews={allNews} />
      </main>
    </div>
  );
}

