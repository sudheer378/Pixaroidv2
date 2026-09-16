import Link from "next/link";
import { toolCategories } from "@/core/tools/categories";
import { getToolsByCategory } from "@/core/tools/registry";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-lg font-bold text-slate-950">Pixora</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
              Free, privacy-first online tools. Everything runs in your browser — your files and data never leave your device.
            </p>
          </div>
          {toolCategories.slice(0, 3).map((category) => (
            <div key={category.id}>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-950">
                <Link href={`/${category.slug}`}>{category.label}</Link>
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {getToolsByCategory(category.id).slice(0, 5).map((tool) => (
                  <li key={tool.id}>
                    <Link href={`/tools/${tool.slug}`} className="hover:text-blue-600">{tool.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Pixora. All tools are free to use.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
