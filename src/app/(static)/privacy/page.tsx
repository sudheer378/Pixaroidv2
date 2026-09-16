import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Pixora's privacy policy: your files are processed in your browser and never uploaded. Learn what little data we do and don't collect.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>
          <div className="mt-6 space-y-6 text-base leading-8 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-950">Your files never leave your device</h2>
              <p className="mt-2">
                All Pixora tools process files and data locally in your web browser. PDFs, images, text
                and calculator inputs are never uploaded to our servers. We could not read your files
                even if we wanted to — the processing code runs entirely on your device.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-950">What we collect</h2>
              <p className="mt-2">
                We may collect anonymous, aggregated usage analytics (such as which tool pages are
                visited) to understand which tools are useful. This never includes file contents,
                file names, text you type into tools, or generated results.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-950">Advertising</h2>
              <p className="mt-2">
                Pixora may display advertising to keep the tools free. Ad providers may use cookies
                subject to their own policies and applicable law (including GDPR in the EU and UK).
                Where required, you will be asked for consent before any advertising cookies are set.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-950">Contact</h2>
              <p className="mt-2">
                Questions about this policy? Reach out via the contact page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
