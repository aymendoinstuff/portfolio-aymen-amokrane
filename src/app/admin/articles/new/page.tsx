import ArticleForm from "@/components/admin/ArticleForm";
export default function NewArticle() {
  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">New Article</div>
      <ArticleForm />
    </main>
  );
}
