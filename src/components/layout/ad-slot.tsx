/**
 * AdSense-ready placeholder. Reserves fixed space so ads never cause layout
 * shift (CLS). Replace the inner placeholder with an <ins class="adsbygoogle">
 * unit once the site is approved; the reserved sizes match standard units.
 */
const SLOT_SIZES = {
  leaderboard: { label: "728×90 / responsive", className: "h-[90px] max-w-[728px]" },
  rectangle: { label: "336×280 / responsive", className: "h-[280px] max-w-[336px]" },
  mobileBanner: { label: "320×100 / responsive", className: "h-[100px] max-w-[320px]" },
} as const;

export type AdSlotFormat = keyof typeof SLOT_SIZES;

export function AdSlot({ format = "leaderboard", id }: { format?: AdSlotFormat; id: string }) {
  const size = SLOT_SIZES[format];
  return (
    <div
      data-ad-slot-id={id}
      aria-hidden="true"
      className={`mx-auto my-6 flex w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 ${size.className}`}
    >
      Ad space · {size.label}
    </div>
  );
}
