import { useState } from "react";
import { BATCHES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Wallet, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function EscrowCard() {
  const batch = BATCHES.find((b) => b.escrow && b.status === "Pending Escrow")!;
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  const run = async () => {
    setPhase("loading");
    await new Promise((r) => setTimeout(r, 2200));
    setPhase("done");
    toast.success("Smart Contract Executed", {
      description: `Escrow funds (USDC ${batch.escrow!.amountUSD.toLocaleString()}) automatically released to Farmer.`,
      duration: 6000,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-chain/20 bg-card shadow-elegant">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-chain/5 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-chain/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-chain">
              <Lock className="h-3 w-3" />
              Smart Contract Escrow
            </div>
            <h2 className="mt-2.5 text-lg font-bold tracking-tight">Pending Shipment Confirmation</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Funds are locked on-chain and auto-released on delivery confirmation.
            </p>
          </div>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-xl border bg-gradient-subtle p-4 sm:grid-cols-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Batch</div>
            <div className="mt-1 font-semibold">#{batch.id}</div>
            <div className="text-xs text-muted-foreground">{batch.product} · {batch.weightKg.toLocaleString()} kg</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Escrow Amount</div>
            <div className="mt-1 text-lg font-bold text-primary">${batch.escrow!.amountUSD.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">USDC · Polygon</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recipient</div>
            <div className="mt-1 truncate text-sm font-medium">{batch.escrow!.counterparty}</div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-chain">
              <Wallet className="h-3 w-3" /> {batch.escrow!.counterpartyWallet}
            </div>
          </div>
        </div>

        <div className="mt-5">
          {phase !== "done" ? (
            <Button
              onClick={run}
              disabled={phase === "loading"}
              size="lg"
              className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] hover:opacity-95"
            >
              {phase === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executing on Polygon...
                </>
              ) : (
                <>
                  Confirm Delivery & Execute Contract
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border-2 border-success/30 bg-success/5 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success text-primary-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-success">Contract Executed</div>
                <div className="text-xs text-muted-foreground">
                  USDC {batch.escrow!.amountUSD.toLocaleString()} released to {batch.escrow!.counterpartyWallet}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
