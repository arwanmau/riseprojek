export type AccountRole = "Admin" | "Farmer" | "Collector" | "Distributor" | "Retailer";

export type DemoAccount = {
  email: string;
  password: string;
  name: string;
  role: AccountRole;
  isAdmin: boolean;
  plan?: "starter" | "professional" | "enterprise";
  loyaltyPoints?: number;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@gfl.io",
    password: "admin123",
    name: "Admin Root",
    role: "Admin",
    isAdmin: true,
    plan: "enterprise",
    loyaltyPoints: 0,
  },
  {
    email: "budi.santoso@sawahhijau.id",
    password: "password123",
    name: "Budi Santoso",
    role: "Farmer",
    isAdmin: false,
    plan: "professional",
    loyaltyPoints: 1240,
  },
  {
    email: "sari@farm.id",
    password: "user123",
    name: "Sari Wulandari",
    role: "Farmer",
    isAdmin: false,
    plan: "starter",
    loyaltyPoints: 580,
  },
  {
    email: "depot@milano.it",
    password: "b2b2026",
    name: "Milano Depot",
    role: "Retailer",
    isAdmin: false,
    plan: "professional",
    loyaltyPoints: 3420,
  },
];

export const SUPPORT_EMAIL = "support@gfl.io";

export function findAccount(email: string, password: string): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  return (
    DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized && a.password === password) ?? null
  );
}

export function buildForgotPasswordMailto(userEmail: string): string {
  const subject = encodeURIComponent("Reset Password — Global Food Ledger");
  const body = encodeURIComponent(
    `Halo Tim GFL,\n\nSaya lupa password untuk akun berikut:\nEmail: ${userEmail}\n\nMohon bantu reset password saya.\n\nTerima kasih.`,
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${subject}&body=${body}`;
}
