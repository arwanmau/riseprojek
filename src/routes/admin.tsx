import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBatches } from "@/lib/batches-context";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";
import { AppHeader } from "@/components/AppHeader";
import { AdminBackendPanel } from "@/components/admin/AdminBackendPanel";
import { AdminUserCrud } from "@/components/admin/AdminUserCrud";
import { AdminSaasPanel } from "@/components/admin/AdminSaasPanel";
import { StockAnalysisPanel } from "@/components/ai/StockAnalysisPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Package,
  Trash2,
  Crown,
  BarChart3,
  Settings2,
  Loader2,
  AlertCircle,
  LineChart,
  CreditCard,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard & Analytics — Global Food Ledger" },
      {
        name: "description",
        content: "Administrative dashboard with CRUD, SaaS, AI stock analysis, and batch operations.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { batches, removeBatch } = useBatches();
  const analytics = useAdminAnalytics(user?.isAdmin ? user.email : undefined, batches);

  useEffect(() => {
    if (!user) navigate({ to: "/admin/login" });
  }, [user, navigate]);

  if (!user) return null;

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
            <ShieldCheck className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Halaman ini khusus administrator. Silakan masuk via{" "}
            <Link to="/admin/login" className="font-medium text-primary hover:underline">
              Login Admin
            </Link>
            .
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Kembali ke Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    removeBatch(id);
    toast.success(`Batch ${id} dihapus`);
    void analytics.refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Crown className="h-3 w-3" /> Admin Console · CRUD Mode
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard Admin</h1>
            <p className="text-sm text-muted-foreground">
              CRUD user, analitik back-end, SaaS & loyalitas B2B, analisis saham AI.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 border-chain/40 text-chain">
            <ShieldCheck className="h-3 w-3" />
            {user.email}
          </Badge>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1">
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="h-4 w-4" /> Analitik
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="h-4 w-4" /> CRUD User
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-1.5">
              <LineChart className="h-4 w-4" /> AI Saham
            </TabsTrigger>
            <TabsTrigger value="saas" className="gap-1.5">
              <CreditCard className="h-4 w-4" /> SaaS & Loyalty
            </TabsTrigger>
            <TabsTrigger value="operations" className="gap-1.5">
              <Settings2 className="h-4 w-4" /> Operasi Batch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-0">
            {analytics.isLoading && !analytics.data ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Memuat analitik dari back-end…</p>
              </div>
            ) : analytics.isError ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-medium">Gagal memuat analitik API</p>
                <Button size="sm" onClick={() => analytics.refetch()}>
                  Coba lagi
                </Button>
              </div>
            ) : analytics.data ? (
              <AdminBackendPanel
                data={analytics.data}
                loading={analytics.isFetching}
                onRefresh={() => void analytics.refetch()}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <AdminUserCrud adminEmail={user.email} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analisis Saham Komoditas Pangan (AI)</CardTitle>
              </CardHeader>
              <CardContent>
                <StockAnalysisPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saas" className="mt-0">
            <AdminSaasPanel adminEmail={user.email} />
          </TabsContent>

          <TabsContent value="operations" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" /> Batch Override (Delete)
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">{b.id}</TableCell>
                        <TableCell>
                          {b.product} · {b.variety}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{b.status}</Badge>
                        </TableCell>
                        <TableCell>{b.weightKg.toLocaleString()} kg</TableCell>
                        <TableCell className="text-muted-foreground">{b.location}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(b.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
