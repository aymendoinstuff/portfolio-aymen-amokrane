/* eslint-disable @typescript-eslint/no-explicit-any */
import ArticleForm from "@/components/admin/ArticleForm";
import { adminDb } from "@/lib/firebase/admin";

export default async function EditArticle(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; // 👈 await the params
  const ref = await adminDb.collection("articles").doc(id).get();

  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">Edit Article</div>
      <ArticleForm id={id} initial={ref.exists ? (ref.data() as any) : {}} />
    </main>
  );
}
