import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getToolsByCategory, toolRegistry } from "@/core/tools/registry";
import { getCategoryById } from "@/core/tools/categories";
import { ToolWorkspace } from "@/components/tools/tool-workspace";
import { InteractiveWorkspace } from "@/components/tools/interactive-workspace";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdSlot } from "@/components/layout/ad-slot";
import { ToolJsonLd } from "@/components/seo/json-ld";

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
    keywords: [...tool.seo.keywords],
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryById(tool.category);
  const related = tool.relatedTools
    .map((id) => toolRegistry.find((item) => item.id === id || item.slug === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sameCategory = getToolsByCategory(tool.category).filter((item) => item.id !== tool.id);

  return (
    <>
      <ToolJsonLd tool={tool} categoryLabel={category.label} categorySlug={category.slug} />
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/${category.slug}`} className="hover:text-blue-600">{category.label}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-700">{tool.name}</li>
            </ol>
          </nav>

          <section className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{tool.seo.h1}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.seo.directAnswer}</p>
          </section>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              {tool.kind === "file" ? <ToolWorkspace tool={tool} /> : <InteractiveWorkspace tool={tool} />}

              <AdSlot id={`${tool.slug}-below-tool`} format="leaderboard" />

              <section className="mt-6 grid gap-6 md:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-950">How to use this tool</h2>
                  <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    {tool.seo.howTo.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{index + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-950">Why use Pixora?</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> 100% free — no sign-up, no watermark, no limits games</li>
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Private by design — everything runs in your browser</li>
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Nothing is uploaded, stored or logged</li>
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Works on desktop, tablet and mobile</li>
                  </ul>
                </article>
              </section>

              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-950">Frequently asked questions</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {tool.seo.faqs.map((faq) => (
                    <details key={faq.question} className="group py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <AdSlot id={`${tool.slug}-sidebar`} format="rectangle" />
              {related.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Related tools</h2>
                  <ul className="mt-3 space-y-1">
                    {related.map((item) => (
                      <li key={item.id}>
                        <Link href={`/tools/${item.slug}`} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {sameCategory.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    More {category.shortLabel.toLowerCase()} tools
                  </h2>
                  <ul className="mt-3 space-y-1">
                    {sameCategory.slice(0, 8).map((item) => (
                      <li key={item.id}>
                        <Link href={`/tools/${item.slug}`} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
