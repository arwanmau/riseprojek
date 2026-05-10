import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBatches } from "@/lib/batches-context";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Users, Package, Activity, Trash2, Crown, Database } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Global Food Ledger" },
      { name: "description", content: "Administrative controls for managing users, batches and platform health." },
    ],
  }),
  component: AdminPage,
});

const MOCK_USERS = [
  { name: "Sari Wulandari", email: "sari@farm.id", role: "Farmer", status: "Active", joined: "2026-01-12" },
  { name: "Budi Hartono", email: "budi@collect.id", role: "Collector", status: "Active", joined: "2026-02-04" },
  { name: "Marco Bianchi", email: "marco@bianchi.it", role: "Farmer", status: "Active", joined: "2026-02-22" },
  { name: "Eurotrans Ops", email: "ops@eurotrans.eu", role: "Distributor", status: "Pending", joined: "2026-03-11" },
  { name: "Milano Depot", email: "depot@milano.it", role: "Retailer", status: "Active", joined: "2026-03-29" },
  { name: "Admin Root", email: "admin@gfl.io", role: "Admin", status: "Active", joined: "2025-11-01" },
];

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { batches, removeBatch } = useBatches();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const stats = useMemo(() => {
    const totalKg = batches.reduce((s, b) => s + b.weightKg, 0);
    const inTransit = batches.filter((b) => b.status === "In Transit").length;
    const escrowUSD = batches.reduce((s, b) => s + (b.escrow?.amountUSD ?? 0), 0);
    return { totalKg, inTransit, escrowUSD };
  }, [batches]);

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
            Halaman ini khusus untuk admin. Login dengan email yang mengandung
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">admin</code>
            (mis. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">admin@gfl.io</code>) untuk mencoba.
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
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Crown className="h-3 w-3" /> Admin Console
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Platform Operations</h1>
            <p className="text-sm text-muted-foreground">
              Kelola pengguna, audit batch, dan pantau kesehatan jaringan.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 border-chain/40 text-chain">
            <ShieldCheck className="h-3 w-3" />
            Polygon · 21 nodes online
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard Icon={Users} label="Registered Users" value={MOCK_USERS.length.toString()} hint="+2 minggu ini" />
          <StatCard Icon={Package} label="Active Batches" value={batches.length.toString()} hint={`${(stats.totalKg / 1000).toFixed(1)} t total`} />
          <StatCard Icon={Activity} label="In Transit" value={stats.inTransit.toString()} hint="Real-time" />
          <StatCard Icon={Database} label="Escrow Locked" value={`$${stats.escrowUSD.toLocaleString()}`} hint="USDC on-chain" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_USERS.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "Admin" ? "default" : "secondary"}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === "Active" ? "text-emerald-600" : "text-amber-600"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {u.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info(`Audit log untuk ${u.name} dibuka`)}
                      >
                        Audit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" /> Batch Override
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
                    <TableCell>{b.product} · {b.variety}</TableCell>
                    <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
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
      </main>
    </div>
  );
}

function StatCard({ Icon, label, value, hint }: { Icon: typeof Users; label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}
