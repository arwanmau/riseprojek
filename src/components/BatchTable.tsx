import { useState } from "react";
import type { Batch } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, MapPin, Clock, Package, Sprout, Search, Truck, Warehouse, Check, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { HandoverDialog } from "./HandoverDialog";
import { useBatches } from "@/lib/batches-context";

const STEP_ICON: Record<string, typeof Sprout> = {
  Harvested: Sprout,
  Inspected: Search,
  "In Transit": Truck,
  Warehoused: Warehouse,
  Delivered: Check,
};

export function BatchTable({ batches }: { batches: Batch[] }) {
  const [open, setOpen] = useState<Batch | null>(null);
  const [handover, setHandover] = useState<Batch | null>(null);
  const { nextStatusOf } = useBatches();

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card shadow-elegant">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Batch</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Location</th>
                <th className="px-5 py-3 text-left font-semibold">Timestamp</th>
                <th className="px-5 py-3 text-right font-semibold">Ledger</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setOpen(b)}
                  className="cursor-pointer border-t transition-colors hover:bg-accent/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Batch #{b.id}</div>
                        <div className="text-xs text-muted-foreground">{b.product} · {b.variety}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4 text-muted-foreground">{b.location}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.timestamp}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {nextStatusOf(b.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setHandover(b);
                          }}
                          className="gap-1.5"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                          Handover
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Opening Polygonscan", { description: b.txHash });
                        }}
                        className="gap-1.5 border-chain/30 text-chain hover:bg-chain/10 hover:text-chain"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ledger
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y md:hidden">
          {batches.map((b) => (
            <div key={b.id} className="flex w-full flex-col gap-3 p-4">
              <button
                onClick={() => setOpen(b)}
                className="flex w-full flex-col gap-3 text-left transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold">#{b.id}</div>
                      <div className="text-xs text-muted-foreground">{b.product} · {b.variety}</div>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {b.location}</div>
                  <div className="flex items-center gap-1.5 font-mono"><Clock className="h-3 w-3" /> {b.timestamp.split(" ")[0]}</div>
                </div>
              </button>
              {nextStatusOf(b.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHandover(b)}
                  className="w-full gap-1.5"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" /> Handover ke {nextStatusOf(b.status)}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl">Batch #{open.id}</DialogTitle>
                  <StatusBadge status={open.status} />
                </div>
                <DialogDescription>
                  {open.product} · {open.variety} · {open.weightKg.toLocaleString()} kg
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 rounded-lg border bg-gradient-subtle p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Genesis transaction
                </div>
                <div className="mt-1 break-all font-mono text-xs text-chain">{open.txHash}</div>
              </div>

              <div className="mt-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Immutable Journey
                </h3>
                <ol className="relative space-y-5 border-l-2 border-dashed border-border pl-7">
                  {open.timeline.map((step, i) => {
                    const Icon = STEP_ICON[step.status] ?? Package;
                    const isLast = i === open.timeline.length - 1;
                    return (
                      <li key={i} className="relative">
                        <span
                          className={`absolute -left-[37px] grid h-8 w-8 place-items-center rounded-full border-2 ${
                            isLast
                              ? "border-primary bg-primary text-primary-foreground shadow-glow"
                              : "border-border bg-card text-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="rounded-lg border bg-card p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold">{step.status}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">{step.timestamp}</div>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {step.actor} · {step.location}
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5">
                            <span className="rounded-md bg-chain/10 px-2 py-0.5 font-mono text-[10px] text-chain">
                              tx {step.txHash}
                            </span>
                            <span className="rounded-md bg-secondary/10 px-2 py-0.5 font-mono text-[10px] text-secondary">
                              {step.wallet}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <Button
                onClick={() => toast.success("Opening Polygonscan", { description: open.txHash })}
                className="mt-2 w-full gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                View Full Ledger on Polygon
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <HandoverDialog batch={handover} open={!!handover} onOpenChange={(v) => !v && setHandover(null)} />
    </>
  );
}
