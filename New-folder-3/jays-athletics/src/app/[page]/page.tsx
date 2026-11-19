import { notFound } from "next/navigation";
import { PAGES } from "@/config/pages";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PAGES).map((page) => ({ page }));

export default function Static({ params }: { params: { page: string } }) {
  const p = PAGES[params.page];
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">{p.title}</h1>
      {p.body.map((t, i) => <p key={i}>{t}</p>)}
    </article>
  );
}
