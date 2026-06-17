import type { Batch } from "@/lib/mock-data";
import type { AdminAnalyticsPayload, AdminUserRecord } from "@/server/admin/types";
import type { StockAnalysisPayload } from "@/server/ai/stock-analysis";
import type { SaasPlanId } from "@/server/saas/store";

const ADMIN_HEADER = "x-gfl-admin-email";

function adminHeaders(adminEmail: string): HeadersInit {
  return {
    "content-type": "application/json",
    "x-gfl-admin-email": adminEmail,
  };
}

export async function fetchAdminAnalytics(
  adminEmail: string,
  batches?: Batch[],
): Promise<AdminAnalyticsPayload> {
  const res = await fetch("/api/admin/analytics", {
    method: batches?.length ? "POST" : "GET",
    headers: adminHeaders(adminEmail),
    body: batches?.length ? JSON.stringify({ batches }) : undefined,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Analytics API error (${res.status})`);
  }

  return res.json() as Promise<AdminAnalyticsPayload>;
}

export async function fetchAdminHealth(adminEmail: string) {
  const res = await fetch("/api/admin/health", {
    headers: { [ADMIN_HEADER]: adminEmail },
  });
  if (!res.ok) throw new Error(`Health API error (${res.status})`);
  return res.json();
}

export async function fetchAdminUsers(adminEmail: string): Promise<AdminUserRecord[]> {
  const res = await fetch("/api/admin/users", { headers: adminHeaders(adminEmail) });
  if (!res.ok) throw new Error("Gagal memuat users");
  const data = (await res.json()) as { users: AdminUserRecord[] };
  return data.users;
}

export async function createAdminUser(
  adminEmail: string,
  user: Omit<AdminUserRecord, "id">,
): Promise<AdminUserRecord> {
  const res = await fetch("/api/admin/users", {
    method: "POST",
    headers: adminHeaders(adminEmail),
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal membuat user");
  return data.user;
}

export async function updateAdminUser(
  adminEmail: string,
  user: AdminUserRecord,
): Promise<AdminUserRecord> {
  const res = await fetch("/api/admin/users", {
    method: "PUT",
    headers: adminHeaders(adminEmail),
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal update user");
  return data.user;
}

export async function deleteAdminUser(adminEmail: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: adminHeaders(adminEmail),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal hapus user");
}

export async function fetchStockAnalysis(batches?: Batch[]): Promise<StockAnalysisPayload> {
  const res = await fetch("/api/ai/stock", {
    method: batches?.length ? "POST" : "GET",
    headers: { "content-type": "application/json" },
    body: batches?.length ? JSON.stringify({ batches }) : undefined,
  });
  if (!res.ok) throw new Error("Gagal memuat analisis saham AI");
  return res.json() as Promise<StockAnalysisPayload>;
}

export async function fetchUserSubscription(email: string) {
  const res = await fetch(`/api/saas/subscription?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Gagal memuat langganan");
  return res.json();
}

export async function updateUserSubscription(email: string, planId: SaasPlanId) {
  const res = await fetch("/api/saas/subscription", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, planId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal upgrade plan");
  return data;
}

export async function fetchUserLoyalty(email: string) {
  const res = await fetch(`/api/saas/loyalty?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Gagal memuat loyalty");
  return res.json();
}

export async function fetchSaasOverview(adminEmail: string) {
  const res = await fetch("/api/saas/subscription", {
    headers: { [ADMIN_HEADER]: adminEmail },
  });
  if (!res.ok) throw new Error("Gagal memuat overview SaaS");
  return res.json();
}

export async function addLoyaltyPointsAdmin(
  adminEmail: string,
  email: string,
  points: number,
  reason: string,
) {
  const res = await fetch("/api/saas/loyalty", {
    method: "POST",
    headers: adminHeaders(adminEmail),
    body: JSON.stringify({ email, points, reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal menambah poin");
  return data;
}
