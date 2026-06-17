import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, ShieldCheck, Loader2, LogIn, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Lupa Password — Global Food Ledger" },
      { name: "description", content: "Reset password via Gmail ke tim support GFL." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { buildForgotPasswordMailto } = await import("@/lib/auth-users");
      const gmailUrl = buildForgotPasswordMailto(email.trim());
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
      toast.success("Gmail dibuka", {
        description: "Kirim email reset password ke support@gfl.io",
      });
      setTimeout(() => navigate({ to: "/login" }), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Kembali ke login
        </Link>

        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Lupa Password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan email akun Anda. Anda akan diarahkan ke <strong>Gmail</strong> dengan pesan
          reset password yang sudah terisi untuk dikirim ke{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">support@gfl.io</code>.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email akun</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anda@toko.id"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Membuka Gmail…
              </>
            ) : (
              <>Buka Gmail untuk Reset Password</>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Admin?{" "}
          <Link to="/admin/login" className="font-medium text-primary hover:underline">
            Login Admin
          </Link>
        </p>
      </div>
    </div>
  );
}
