import Link from "next/link";
import { toolRegistry } from "@/core/tools/registry";

const categories = [
  { id: "compression", label: "Compression", description: "Reduce image and PDF file sizes." },
  { id: "conversion", label: "Conversion", description: "Convert common image formats." },
  { id: "resize", label: "Resize", description: "Resize images for your task." },
  { id: "pdf", label: "PDF", description: "Turn images into PDFs and back." },
];

export default function HomePage() {
  return (
    <main>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">Pixora</Link>
          <nav aria-label="Primary" className="flex gap-5 text-sm text-slate-600">
            <Link href="#tools">Tools</Link>
            <Link href="#categories">Categories</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">Image + PDF tools</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Fast, privacy-first tools for everyday files.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Compress, resize and convert common image and PDF formats with a simple workflow designed around speed, privacy and useful results.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="#tools" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Explore tools</Link>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-5 pb-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">{category.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Popular tools</h2>
          <p className="mt-2 text-slate-600">Phase 1 includes ten high-intent workflows. Each tool is backed by the shared Pixora registry.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolRegistry.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-slate-950 group-hover:text-blue-700">{tool.name}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{tool.category}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center">
          <h2 className="text-2xl font-bold">Built for useful outcomes</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Pixora keeps tool definitions, search intent and product behavior connected so the platform can grow without duplicating the underlying processing system.
          </p>
        </div>
      </section>
    </main>
  );
}
