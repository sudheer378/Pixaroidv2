import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Pixora's free online tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Terms of Use</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>
          <div className="mt-6 space-y-6 text-base leading-8 text-slate-600">
            <p>
              Pixora&apos;s tools are provided free of charge, &quot;as is&quot; and without warranty of any
              kind. While we work hard to make every tool accurate and reliable, you use the results at
              your own risk.
            </p>
            <p>
              Calculator results (including BMI, loan and date calculations) are estimates for
              informational purposes only and are not medical, financial or legal advice. Always consult
              a qualified professional for important decisions.
            </p>
            <p>
              You agree not to use Pixora for unlawful purposes. Because all processing happens on your
              device, you remain fully responsible for the files and content you process.
            </p>
            <p>
              We may update these terms and the tools themselves at any time. Continued use of the site
              constitutes acceptance of the current terms.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
