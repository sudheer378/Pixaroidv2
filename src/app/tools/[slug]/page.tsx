import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, toolRegistry } from "@/core/tools/registry";
import { ToolWorkspace } from "@/components/tools/tool-workspace";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return toolRegistry.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = tool.relatedTools
    .map((id) => getToolBySlug(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">Pixora</Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-950">All tools</Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span>{tool.category}</span> <span aria-hidden="true">/</span> <span>{tool.name}</span>
        </nav>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">{tool.category}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">{tool.seo.h1}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{tool.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tool.inputFormats.map((format) => (
                <span key={format} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">Input: {format}</span>
              ))}
              {tool.outputFormats.map((format) => (
                <span key={format} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">Output: {format}</span>
              ))}
            </div>
          </div>

          <ToolWorkspace tool={tool} />
        </section>

        <section className="mt-14 grid gap-8 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">How to use Pixora</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Select a supported file.</li>
              <li>Choose the available tool options.</li>
              <li>Run the conversion or processing step.</li>
              <li>Review and download the result.</li>
            </ol>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Questions</h2>
            <div className="mt-4 space-y-5">
              {tool.seo.questions.map((question) => (
                <div key={question}>
                  <h3 className="font-semibold text-slate-900">{question}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">This answer is being expanded with task-specific guidance as the Pixora content system matures.</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {related.length > 0 && (
          <section className="mt-14 pb-10">
            <h2 className="text-2xl font-bold">Related tools</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/tools/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
