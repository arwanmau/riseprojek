import type { AdminUserRecord } from "./types";
import { ADMIN_USERS as SEED_USERS } from "./store";

let users: AdminUserRecord[] = SEED_USERS.map((u) => ({ ...u }));

function nextId() {
  const max = users.reduce((m, u) => Math.max(m, parseInt(u.id.replace("u-", ""), 10) || 0), 0);
  return `u-${String(max + 1).padStart(3, "0")}`;
}

export function listUsers(): AdminUserRecord[] {
  return users.map((u) => ({ ...u }));
}

export function getUser(id: string): AdminUserRecord | undefined {
  return users.find((u) => u.id === id);
}

export function createUser(input: Omit<AdminUserRecord, "id">): AdminUserRecord {
  const emailTaken = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (emailTaken) throw new Error("Email sudah terdaftar.");
  const record: AdminUserRecord = { ...input, id: nextId() };
  users = [...users, record];
  return record;
}

export function updateUser(id: string, patch: Partial<Omit<AdminUserRecord, "id">>): AdminUserRecord {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User tidak ditemukan.");
  if (patch.email) {
    const taken = users.some((u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase());
    if (taken) throw new Error("Email sudah digunakan user lain.");
  }
  users[idx] = { ...users[idx], ...patch };
  return { ...users[idx] };
}

export function deleteUser(id: string): void {
  const before = users.length;
  users = users.filter((u) => u.id !== id);
  if (users.length === before) throw new Error("User tidak ditemukan.");
}

export function resetUsers() {
  users = SEED_USERS.map((u) => ({ ...u }));
}
