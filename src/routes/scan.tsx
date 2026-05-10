import { createFileRoute, Link } from "@tanstack/react-router";
import { BATCHES } from "@/lib/mock-data";
import { ShopOwnerSocial } from "@/components/ShopOwnerSocial";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Sprout,
  Package,
  ArrowLeft,
  ExternalLink,
  ScanLine,
  Leaf,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan & Verify — Global Food Ledger" },
      { name: "description", content: "Verify the origin of your food via blockchain QR code." },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const batch = BATCHES[0]; // RICE-8842

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-md px-4 py-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Phone frame */}
        <div className="relative mx-auto overflow-hidden rounded-[2.5rem] border-[10px] border-foreground/90 bg-background shadow-elegant">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

          <div className="flex max-h-[80vh] flex-col overflow-y-auto">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[10px] font-semibold">
              <span>9:41</span>
              <span className="text-muted-foreground">Polygon · Verified</span>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-primary px-6 pb-8 pt-5 text-primary-foreground">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-90">
                  <ScanLine className="h-3 w-3" /> QR Scan Result
                </div>
                <h1 className="mt-2 text-2xl font-bold leading-tight">
                  {batch.product} · {batch.variety}
                </h1>
                <div className="mt-1 font-mono text-xs opacity-90">Batch #{batch.id}</div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold">Verified on Polygon</span>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Origin profile */}
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border-2 border-primary/15 bg-card p-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Sprout className="h-3 w-3" /> Origin Profile
                </div>
                <h2 className="mt-2 text-base font-bold">{batch.origin.farm}</h2>
                <p className="text-xs text-muted-foreground">Farmer · {batch.origin.farmer}</p>

                <div className="mt-3 grid gap-2.5 text-sm">
                  <Row Icon={MapPin} label="Farm Location">
                    {batch.origin.region}, {batch.origin.country}
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                      {batch.origin.coords}
                    </span>
                  </Row>
                  <Row Icon={Calendar} label="Harvest Date">{batch.origin.harvestDate}</Row>
                  <Row Icon={Package} label="Batch Weight">{batch.weightKg.toLocaleString()} kg</Row>
                  <Row Icon={Leaf} label="Cultivation">Sustainable · Rain-fed</Row>
                </div>
              </div>

              <ShopOwnerSocial />

              {/* Journey */}
              <div className="rounded-2xl border bg-card p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Verified Journey
                </div>
                <ol className="mt-3 space-y-3">
                  {batch.timeline.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 leading-tight">
                        <div className="text-sm font-semibold">{s.status}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {s.location} · {s.timestamp.split(" ")[0]}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[10px] text-chain">
                          tx {s.txHash}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trust badge */}
              <div className="rounded-2xl border-2 border-chain/20 bg-chain/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-chain text-primary-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-chain">Secured by Polygon</div>
                    <div className="text-[11px] text-muted-foreground">
                      Every step is sealed by an immutable on-chain record.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-chain/30 bg-card px-3 py-2 text-xs font-semibold text-chain transition-colors hover:bg-chain/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Polygonscan
                </button>
              </div>

              <p className="pb-2 text-center text-[10px] text-muted-foreground">
                Powered by Global Food Ledger
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  Icon,
  label,
  children,
}: {
  Icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
