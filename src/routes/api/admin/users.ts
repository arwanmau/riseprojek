import { createFileRoute } from "@tanstack/react-router";
import { assertAdminRequest, jsonResponse } from "@/server/admin/auth";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/server/admin/user-service";
import type { AdminUserRecord } from "@/server/admin/types";

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        return jsonResponse({ users: listUsers() });
      },
      POST: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        try {
          const body = (await request.json()) as Partial<AdminUserRecord>;
          if (!body.name || !body.email || !body.role) {
            return jsonResponse({ error: "name, email, role required" }, { status: 400 });
          }
          const user = createUser({
            name: body.name,
            email: body.email,
            role: body.role,
            status: body.status ?? "Active",
            joined: body.joined ?? new Date().toISOString().slice(0, 10),
            lastActive: new Date().toISOString(),
            batchesLinked: body.batchesLinked ?? 0,
          });
          return jsonResponse({ user }, { status: 201 });
        } catch (err) {
          return jsonResponse(
            { error: err instanceof Error ? err.message : "Create failed" },
            { status: 400 },
          );
        }
      },
      PUT: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        try {
          const body = (await request.json()) as { id: string } & Partial<AdminUserRecord>;
          if (!body.id) return jsonResponse({ error: "id required" }, { status: 400 });
          const { id, ...patch } = body;
          const user = updateUser(id, patch);
          return jsonResponse({ user });
        } catch (err) {
          return jsonResponse(
            { error: err instanceof Error ? err.message : "Update failed" },
            { status: 400 },
          );
        }
      },
      DELETE: async ({ request }) => {
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ error: "id query required" }, { status: 400 });
        try {
          deleteUser(id);
          return jsonResponse({ ok: true });
        } catch (err) {
          return jsonResponse(
            { error: err instanceof Error ? err.message : "Delete failed" },
            { status: 400 },
          );
        }
      },
    },
  },
});
