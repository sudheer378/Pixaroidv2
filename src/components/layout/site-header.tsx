import Link from "next/link";
import { toolCategories } from "@/core/tools/categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">P</span>
          Pixora
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          {toolCategories.map((category) => (
            <Link key={category.id} href={`/${category.slug}`} className="hover:text-blue-600">
              {category.shortLabel}
            </Link>
          ))}
        </nav>
        <Link
          href="/#tools"
          className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          All tools
        </Link>
      </div>
    </header>
  );
}
