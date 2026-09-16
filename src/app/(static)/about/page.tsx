import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { toolRegistry } from "@/core/tools/registry";

export const metadata: Metadata = {
  title: "About Pixora",
  description:
    "Pixora is a free, privacy-first suite of online tools for PDF, images, calculators, text and developers. Everything runs in your browser.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">About Pixora</h1>
          <div className="prose-slate mt-6 space-y-5 text-base leading-8 text-slate-600">
            <p>
              Pixora is a free suite of {toolRegistry.length} online tools covering PDF, images,
              calculators, text utilities, generators and developer tools. It exists because everyday
              file tasks shouldn&apos;t require accounts, subscriptions, watermarks — or uploading your
              private documents to someone else&apos;s server.
            </p>
            <p>
              <strong className="text-slate-900">Everything runs in your browser.</strong> When you merge a
              PDF, compress a photo or generate a password on Pixora, the processing happens on your own
              device using modern web technology. Your files and data are never transmitted, stored or
              logged. Close the tab and nothing remains.
            </p>
            <p>
              Pixora serves users worldwide, with a focus on the United States, United Kingdom, Europe,
              Canada, Australia and New Zealand. Tools support both metric and imperial units wherever
              relevant.
            </p>
            <p>
              Have a suggestion or found a problem? <Link href="/contact" className="font-medium text-blue-600">Get in touch</Link>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
