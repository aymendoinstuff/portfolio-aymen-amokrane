import SectionTitle from "@/components/SectionTitle";
import Placeholder from "@/components/public/common/Placeholder";
import { Btn } from "@/components/public/common/ui";
import Link from "next/link";

export default function BlogPage() {
  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <SectionTitle>Articles</SectionTitle>
        <div className="grid gap-6">
          {new Array(6).fill(0).map((_, i) => (
            <div
              key={i}
              className="grid md:grid-cols-[260px_1fr] gap-4 items-start"
            >
              <Placeholder className="h-32 w-full rounded-xl" />
              <div>
                <div className="font-medium">Article Title {i + 1}</div>
                <p className="text-sm opacity-80 mt-1">
                  Short description of the article as a two-line teaser.
                </p>
                <div className="mt-3">
                  <Link href="#">
                    <Btn className="px-3 py-1 text-sm">Read more</Btn>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
