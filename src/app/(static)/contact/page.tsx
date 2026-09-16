import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Pixora team with feedback, tool suggestions or bug reports.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Contact</h1>
          <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
            <p>
              We&apos;d love to hear from you — whether it&apos;s a bug report, a feature request or an
              idea for a new tool.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="font-semibold text-slate-900">Email</p>
              <p className="mt-1">
                <a href="mailto:hello@pixora.example" className="font-medium text-blue-600">hello@pixora.example</a>
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Replace this address with your real support inbox before launch.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
