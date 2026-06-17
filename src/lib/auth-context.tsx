import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findAccount, type AccountRole } from "@/lib/auth-users";

export type AuthUser = {
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  role: AccountRole;
  plan: "starter" | "professional" | "enterprise";
  loyaltyPoints: number;
};

type LoginMode = "user" | "admin";

type Ctx = {
  user: AuthUser | null;
  login: (email: string, password: string, mode?: LoginMode) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);
const KEY = "gfl.auth.user";

function toAuthUser(account: ReturnType<typeof findAccount>): AuthUser {
  if (!account) throw new Error("Invalid account");
  const avatar = account.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    name: account.name,
    email: account.email,
    avatar,
    isAdmin: account.isAdmin,
    role: account.role,
    plan: account.plan ?? "starter",
    loyaltyPoints: account.loyaltyPoints ?? 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async (email: string, password: string, mode: LoginMode = "user") => {
    await new Promise((r) => setTimeout(r, 700));
    const account = findAccount(email, password);
    if (!account) {
      throw new Error("Email atau password salah.");
    }
    if (mode === "admin" && !account.isAdmin) {
      throw new Error("Akun ini bukan admin. Gunakan login pengguna biasa.");
    }
    if (mode === "user" && account.isAdmin) {
      throw new Error("Admin harus masuk via halaman Login Admin.");
    }
    const u = toAuthUser(account);
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
