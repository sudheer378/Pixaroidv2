import Link from "next/link";
import { toolRegistry, getToolsByCategory } from "@/core/tools/registry";
import { toolCategories } from "@/core/tools/categories";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdSlot } from "@/components/layout/ad-slot";
import { WebsiteJsonLd } from "@/components/seo/json-ld";

const popularSlugs = [
  "merge-pdf",
  "bmi-calculator",
  "qr-code-generator",
  "age-calculator",
  "password-generator",
  "compress-pdf",
  "word-counter",
  "percentage-calculator",
  "jpg-to-pdf",
];

const categoryAccents: Record<string, string> = {
  pdf: "bg-rose-50 text-rose-700 border-rose-100",
  image: "bg-violet-50 text-violet-700 border-violet-100",
  calculator: "bg-emerald-50 text-emerald-700 border-emerald-100",
  text: "bg-sky-50 text-sky-700 border-sky-100",
  generator: "bg-amber-50 text-amber-700 border-amber-100",
  developer: "bg-cyan-50 text-cyan-700 border-cyan-100",
};

export default function HomePage() {
  const popular = popularSlugs
    .map((slug) => toolRegistry.find((tool) => tool.slug === slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <>
      <WebsiteJsonLd />
      <SiteHeader />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 text-center sm:pt-20">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
              {toolRegistry.length} free tools · no sign-up · no uploads
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Free online tools that respect your privacy.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              PDF, image, calculator, text and developer tools — all free, all running
              directly in your browser. Your files and data never leave your device.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="#tools" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                Browse all tools
              </Link>
              <Link href="/tools/merge-pdf" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600">
                Merge PDF
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pt-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Most popular</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryAccents[tool.category]}`}>
                  {toolCategories.find((category) => category.id === tool.category)?.shortLabel}
                </span>
                <h3 className="mt-3 font-bold text-slate-950 group-hover:text-blue-700">{tool.name}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5">
          <AdSlot id="home-mid" format="leaderboard" />
        </div>

        <section id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">All tools by category</h2>
          <div className="mt-6 space-y-10">
            {toolCategories.map((category) => {
              const tools = getToolsByCategory(category.id);
              if (tools.length === 0) return null;
              return (
                <div key={category.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-950">
                      <Link href={`/${category.slug}`} className="hover:text-blue-700">{category.label}</Link>
                    </h3>
                    <Link href={`/${category.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View all →
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 hover:shadow-sm"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Why Pixora?</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <article>
                <h3 className="font-bold text-slate-950">🔒 Private by design</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Every tool runs entirely in your browser. Your PDFs, photos, passwords and
                  text are never uploaded, stored or logged — there is no server to send them to.
                </p>
              </article>
              <article>
                <h3 className="font-bold text-slate-950">⚡ Instant results</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No upload queues or processing servers. Because everything happens on your
                  device, results appear in seconds — even for large files.
                </p>
              </article>
              <article>
                <h3 className="font-bold text-slate-950">💯 Genuinely free</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No accounts, no trials, no watermarks, no daily limits. Every tool works
                  fully, forever, on desktop and mobile.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
