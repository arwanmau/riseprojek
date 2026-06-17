import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — Global Food Ledger" },
      { name: "description", content: "Portal masuk khusus administrator platform." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gfl.io");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  if (user?.isAdmin) {
    navigate({ to: "/admin" });
  } else if (user && !user.isAdmin) {
    navigate({ to: "/" });
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password, "admin");
      toast.success("Login admin berhasil");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error("Login gagal", {
        description: err instanceof Error ? err.message : "Periksa kredensial admin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-8 text-slate-100 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Admin Portal
            </div>
            <h1 className="text-xl font-bold">Global Food Ledger</h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Halaman ini khusus administrator. Pengguna biasa silakan{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            login di sini
          </Link>
          .
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-slate-300">
              Email Admin
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-slate-700 bg-slate-800/80 text-slate-100"
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-password" className="text-slate-300">
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-400 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-slate-700 bg-slate-800/80 text-slate-100"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Memproses…
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Masuk sebagai Admin
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>
            Demo admin: <code className="text-emerald-300">admin@gfl.io</code> /{" "}
            <code className="text-emerald-300">admin123</code>
          </span>
        </div>
      </div>
    </div>
  );
}
