import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, toolCategories } from "@/core/tools/categories";
import { getToolsByCategory } from "@/core/tools/registry";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdSlot } from "@/components/layout/ad-slot";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return toolCategories.map((category) => ({ category: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(category.id);

  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-700">{category.label}</li>
            </ol>
          </nav>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{category.label}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{category.seoDescription}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <h2 className="font-bold text-slate-950 group-hover:text-blue-700">{tool.name}</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{tool.description}</p>
              </Link>
            ))}
          </div>

          <AdSlot id={`category-${category.slug}`} format="leaderboard" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
