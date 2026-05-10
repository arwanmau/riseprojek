import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { BatchTable } from "@/components/BatchTable";
import { EscrowCard } from "@/components/EscrowCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { BATCHES, ROLE_LABELS } from "@/lib/mock-data";
import { useBatches } from "@/lib/batches-context";
import { AddBatchDialog } from "@/components/AddBatchDialog";
import { Sprout, Truck, Warehouse, Store, Package, Activity, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Global Food Ledger" },
      { name: "description", content: "Track staple food batches across the supply chain with on-chain verification." },
    ],
  }),
  component: Dashboard,
});

const ROLE_COPY = {
  farmer: { Icon: Sprout, title: "Farm Operations", sub: "Register harvests and submit them to the immutable ledger." },
  collector: { Icon: Warehouse, title: "Collection Hub", sub: "Inspect, weigh, and aggregate incoming batches from farms." },
  distributor: { Icon: Truck, title: "Distribution Control", sub: "Coordinate logistics and trigger smart contract settlements." },
  retailer: { Icon: Store, title: "Retail Inventory", sub: "Verify provenance before stocking on shelves." },
} as const;

function Dashboard() {
  const { user } = useAuth();
  const { role } = useRole();
  const { batches } = useBatches();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const meta = ROLE_COPY[role];
  const label = ROLE_LABELS[role];

  const stats = [
    { label: "Active Batches", value: batches.length, Icon: Package, tint: "text-primary bg-primary/10" },
    { label: "On-Chain Events", value: batches.reduce((a, b) => a + b.timeline.length, 0), Icon: Activity, tint: "text-chain bg-chain/10" },
    { label: "Verified Origins", value: new Set(batches.map((b) => b.origin.country)).size, Icon: ShieldCheck, tint: "text-success bg-success/10" },
    { label: "Throughput (T)", value: Math.round(batches.reduce((a, b) => a + b.weightKg, 0) / 1000), Icon: TrendingUp, tint: "text-secondary bg-secondary/10" },
  ];
  void BATCHES;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AppHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <meta.Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.title}</h1>
                <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-block">
                  {label.en}{label.local && ` · ${label.local}`}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Halo, <span className="font-semibold text-foreground">{user.name}</span> — {meta.sub}
              </p>
            </div>
          </div>
          <AddBatchDialog />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-elegant">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <span className={`grid h-7 w-7 place-items-center rounded-md ${s.tint}`}>
                  <s.Icon className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
            </div>
          ))}
        </div>

        {role === "distributor" && <EscrowCard />}

        <AnalyticsChart />

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Supply Chain Ledger</h2>
              <p className="text-xs text-muted-foreground">Tap a batch to view its on-chain journey.</p>
            </div>
            <div className="hidden items-center gap-1.5 text-[11px] font-medium text-muted-foreground sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Live · Polygon Mainnet
            </div>
          </div>
          <BatchTable batches={batches} />
        </section>
      </main>
    </div>
  );
}
