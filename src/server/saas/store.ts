export type SaasPlanId = "starter" | "professional" | "enterprise";

export type SaasPlan = {
  id: SaasPlanId;
  name: string;
  priceUsd: number;
  billing: "monthly";
  features: string[];
  batchLimit: number;
  aiCredits: number;
  loyaltyMultiplier: number;
};

export type SubscriptionRecord = {
  userEmail: string;
  planId: SaasPlanId;
  status: "active" | "trial" | "past_due" | "cancelled";
  startedAt: string;
  renewsAt: string;
  mrrUsd: number;
};

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export type LoyaltyAccount = {
  userEmail: string;
  company: string;
  tier: LoyaltyTier;
  points: number;
  lifetimeVolumeT: number;
  aiBonusPct: number;
  nextTierAt: number;
  perks: string[];
};

export const SAAS_PLANS: SaasPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceUsd: 49,
    billing: "monthly",
    features: ["5 batch aktif", "Scan QR publik", "Dashboard dasar", "50 AI credits/bulan"],
    batchLimit: 5,
    aiCredits: 50,
    loyaltyMultiplier: 1,
  },
  {
    id: "professional",
    name: "Professional",
    priceUsd: 149,
    billing: "monthly",
    features: [
      "25 batch aktif",
      "AI stock analysis",
      "Live map & insights",
      "B2B loyalty 1.5× poin",
      "200 AI credits/bulan",
    ],
    batchLimit: 25,
    aiCredits: 200,
    loyaltyMultiplier: 1.5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceUsd: 499,
    billing: "monthly",
    features: [
      "Unlimited batch",
      "Admin API access",
      "Dedicated AI analyst",
      "B2B loyalty 2× poin + Platinum tier",
      "Unlimited AI credits",
    ],
    batchLimit: 9999,
    aiCredits: 99999,
    loyaltyMultiplier: 2,
  },
];

export const SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    userEmail: "budi.santoso@sawahhijau.id",
    planId: "professional",
    status: "active",
    startedAt: "2026-01-15",
    renewsAt: "2026-06-15",
    mrrUsd: 149,
  },
  {
    userEmail: "sari@farm.id",
    planId: "starter",
    status: "trial",
    startedAt: "2026-05-01",
    renewsAt: "2026-06-01",
    mrrUsd: 0,
  },
  {
    userEmail: "depot@milano.it",
    planId: "professional",
    status: "active",
    startedAt: "2026-02-10",
    renewsAt: "2026-06-10",
    mrrUsd: 149,
  },
  {
    userEmail: "admin@gfl.io",
    planId: "enterprise",
    status: "active",
    startedAt: "2025-11-01",
    renewsAt: "2026-07-01",
    mrrUsd: 499,
  },
];

export const LOYALTY_ACCOUNTS: LoyaltyAccount[] = [
  {
    userEmail: "budi.santoso@sawahhijau.id",
    company: "Sawah Hijau Co-op",
    tier: "Silver",
    points: 1240,
    lifetimeVolumeT: 48,
    aiBonusPct: 8,
    nextTierAt: 2000,
    perks: ["Diskon escrow 2%", "Prioritas rute AI", "Badge B2B Verified"],
  },
  {
    userEmail: "depot@milano.it",
    company: "Milano Depot SRL",
    tier: "Gold",
    points: 3420,
    lifetimeVolumeT: 186,
    aiBonusPct: 15,
    nextTierAt: 5000,
    perks: ["Net-30 settlement", "Dedicated account manager", "Early harvest alerts"],
  },
  {
    userEmail: "sari@farm.id",
    company: "Farm ID Collective",
    tier: "Bronze",
    points: 580,
    lifetimeVolumeT: 12,
    aiBonusPct: 3,
    nextTierAt: 1000,
    perks: ["Welcome onboarding", "Monthly AI digest"],
  },
];

let subscriptions = SUBSCRIPTIONS.map((s) => ({ ...s }));
let loyaltyAccounts = LOYALTY_ACCOUNTS.map((a) => ({ ...a }));

export function getPlans() {
  return SAAS_PLANS;
}

export function listSubscriptions() {
  return subscriptions.map((s) => ({ ...s }));
}

export function getSubscription(email: string) {
  return subscriptions.find((s) => s.userEmail.toLowerCase() === email.toLowerCase());
}

export function updateSubscription(email: string, planId: SaasPlanId) {
  const plan = SAAS_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error("Plan tidak valid.");
  const idx = subscriptions.findIndex((s) => s.userEmail.toLowerCase() === email.toLowerCase());
  const renews = new Date();
  renews.setMonth(renews.getMonth() + 1);
  if (idx === -1) {
    const record: SubscriptionRecord = {
      userEmail: email,
      planId,
      status: "active",
      startedAt: new Date().toISOString().slice(0, 10),
      renewsAt: renews.toISOString().slice(0, 10),
      mrrUsd: plan.priceUsd,
    };
    subscriptions = [...subscriptions, record];
    return record;
  }
  subscriptions[idx] = {
    ...subscriptions[idx],
    planId,
    status: "active",
    mrrUsd: plan.priceUsd,
    renewsAt: renews.toISOString().slice(0, 10),
  };
  return { ...subscriptions[idx] };
}

export function listLoyalty() {
  return loyaltyAccounts.map((a) => ({ ...a }));
}

export function getLoyalty(email: string) {
  return loyaltyAccounts.find((a) => a.userEmail.toLowerCase() === email.toLowerCase());
}

export function addLoyaltyPoints(email: string, points: number, reason: string) {
  const idx = loyaltyAccounts.findIndex((a) => a.userEmail.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("Akun loyalty tidak ditemukan.");
  loyaltyAccounts[idx] = {
    ...loyaltyAccounts[idx],
    points: loyaltyAccounts[idx].points + points,
  };
  if (loyaltyAccounts[idx].points >= 5000) loyaltyAccounts[idx].tier = "Platinum";
  else if (loyaltyAccounts[idx].points >= 2000) loyaltyAccounts[idx].tier = "Gold";
  else if (loyaltyAccounts[idx].points >= 1000) loyaltyAccounts[idx].tier = "Silver";
  return { account: { ...loyaltyAccounts[idx] }, reason };
}

export function getSaasOverview() {
  const active = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
  return {
    totalMrrUsd: active.reduce((a, s) => a + s.mrrUsd, 0),
    activeSubscriptions: active.length,
    trialCount: subscriptions.filter((s) => s.status === "trial").length,
    loyaltyMembers: loyaltyAccounts.length,
    avgLoyaltyPoints: Math.round(
      loyaltyAccounts.reduce((a, l) => a + l.points, 0) / loyaltyAccounts.length,
    ),
    plans: SAAS_PLANS,
    subscriptions: listSubscriptions(),
    loyalty: listLoyalty(),
  };
}
