/* eslint-disable @typescript-eslint/no-explicit-any */
import ArticleForm from "@/components/admin/ArticleForm";
import { adminDb } from "@/lib/firebase/admin";

export default async function EditArticle(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const snap = await adminDb.collection("articles").doc(id).get();

  return (
    <main className="p-6">
      <ArticleForm id={id} initial={snap.exists ? (snap.data() as any) : {}} />
    </main>
  );
}
