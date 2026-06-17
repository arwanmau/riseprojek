import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { CommandCenterShell } from "@/components/command-center/CommandCenterShell";
import {
  fetchUserLoyalty,
  fetchUserSubscription,
  updateUserSubscription,
} from "@/lib/admin-api";
import type { SaasPlanId } from "@/server/saas/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, Crown, Gift, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Langganan & Loyalitas — Global Food Ledger" },
      {
        name: "description",
        content: "Sistem berlangganan SaaS dan program loyalitas B2B berbasis AI.",
      },
    ],
  }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const subQuery = useQuery({
    queryKey: ["subscription", user?.email],
    queryFn: () => fetchUserSubscription(user!.email),
    enabled: !!user,
  });

  const loyaltyQuery = useQuery({
    queryKey: ["loyalty", user?.email],
    queryFn: () => fetchUserLoyalty(user!.email),
    enabled: !!user,
  });

  const upgrade = useMutation({
    mutationFn: (planId: SaasPlanId) => updateUserSubscription(user!.email, planId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Plan berhasil diperbarui");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) return null;

  const plans = (subQuery.data as { plans?: { id: SaasPlanId; name: string; priceUsd: number; features: string[] }[] })
    ?.plans ?? [];
  const currentPlan =
    (subQuery.data as { subscription?: { planId: SaasPlanId; status: string; renewsAt: string } })
      ?.subscription?.planId ?? user.plan;
  const loyalty = (
    loyaltyQuery.data as {
      account?: {
        tier: string;
        points: number;
        nextTierAt: number;
        aiBonusPct: number;
        perks: string[];
        company: string;
      };
    }
  )?.account;

  const tierProgress = loyalty
    ? Math.min(100, Math.round((loyalty.points / loyalty.nextTierAt) * 100))
    : 0;

  return (
    <CommandCenterShell>
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <div>
          <Badge variant="outline" className="mb-2 gap-1 border-primary/30 text-primary">
            <Sparkles className="h-3 w-3" /> SaaS & B2B AI
          </Badge>
          <h1 className="text-3xl font-bold">Berlangganan & Loyalitas B2B</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola paket SaaS Anda dan pantau poin loyalitas mitra B2B yang dihitung oleh AI.
          </p>
        </div>

        {loyalty && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" /> Loyalitas B2B — {loyalty.company}
              </CardTitle>
              <CardDescription>
                Tier {loyalty.tier} · Bonus AI +{loyalty.aiBonusPct}% pada setiap transaksi on-chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-3xl font-bold">{loyalty.points.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Poin loyalty</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{loyalty.nextTierAt - loyalty.points} poin</div>
                  <div className="text-xs text-muted-foreground">Menuju tier berikutnya</div>
                </div>
              </div>
              <Progress value={tierProgress} className="h-2" />
              <div className="flex flex-wrap gap-2">
                {loyalty.perks.map((p) => (
                  <Badge key={p} variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" /> {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5" /> Paket Berlangganan SaaS
          </h2>
          {subQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => {
                const active = currentPlan === plan.id;
                return (
                  <Card
                    key={plan.id}
                    className={active ? "border-primary ring-2 ring-primary/20" : undefined}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {active && (
                          <Badge className="gap-1">
                            <Crown className="h-3 w-3" /> Aktif
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        <span className="text-2xl font-bold text-foreground">${plan.priceUsd}</span>
                        /bulan
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {plan.features.map((f) => (
                          <li key={f} className="flex gap-2">
                            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={active ? "outline" : "default"}
                        disabled={active || upgrade.isPending}
                        onClick={() => upgrade.mutate(plan.id)}
                      >
                        {active ? "Plan Saat Ini" : "Pilih Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </CommandCenterShell>
  );
}
