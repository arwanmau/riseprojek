import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLoyaltyPointsAdmin, fetchSaasOverview } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Gift, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export function AdminSaasPanel({ adminEmail }: { adminEmail: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["saas-overview", adminEmail],
    queryFn: () => fetchSaasOverview(adminEmail),
  });

  const addPoints = useMutation({
    mutationFn: ({ email, points }: { email: string; points: number }) =>
      addLoyaltyPointsAdmin(adminEmail, email, points, "Admin bonus — AI loyalty campaign"),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["saas-overview"] });
      toast.success("Poin loyalty ditambahkan");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const overview = data as {
    totalMrrUsd: number;
    activeSubscriptions: number;
    trialCount: number;
    loyaltyMembers: number;
    avgLoyaltyPoints: number;
    plans: { id: string; name: string; priceUsd: number; features: string[] }[];
    subscriptions: {
      userEmail: string;
      planId: string;
      status: string;
      mrrUsd: number;
      renewsAt: string;
    }[];
    loyalty: {
      userEmail: string;
      company: string;
      tier: string;
      points: number;
      aiBonusPct: number;
      perks: string[];
    }[];
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="h-4 w-4" /> MRR Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overview?.totalMrrUsd ?? 0}</div>
            <p className="text-xs text-muted-foreground">{overview?.activeSubscriptions ?? 0} langganan aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.trialCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Akun dalam masa trial</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gift className="h-4 w-4" /> B2B Loyalty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.loyaltyMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Rata-rata {overview?.avgLoyaltyPoints ?? 0} poin/member
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4" /> AI SaaS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.plans?.length ?? 3}</div>
            <p className="text-xs text-muted-foreground">Paket berlangganan tersedia</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" /> Langganan SaaS (CRUD Admin View)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Renew</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(overview?.subscriptions ?? []).map((s) => (
                <TableRow key={s.userEmail}>
                  <TableCell>{s.userEmail}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.planId}</Badge>
                  </TableCell>
                  <TableCell>{s.status}</TableCell>
                  <TableCell>${s.mrrUsd}</TableCell>
                  <TableCell className="text-muted-foreground">{s.renewsAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-4 w-4" /> Loyalitas B2B Berbasis AI
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead>AI Bonus</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(overview?.loyalty ?? []).map((l) => (
                <TableRow key={l.userEmail}>
                  <TableCell className="font-medium">{l.company}</TableCell>
                  <TableCell className="text-muted-foreground">{l.userEmail}</TableCell>
                  <TableCell>
                    <Badge>{l.tier}</Badge>
                  </TableCell>
                  <TableCell>{l.points.toLocaleString()}</TableCell>
                  <TableCell>+{l.aiBonusPct}%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={addPoints.isPending}
                      onClick={() => addPoints.mutate({ email: l.userEmail, points: 100 })}
                    >
                      +100 AI Poin
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
