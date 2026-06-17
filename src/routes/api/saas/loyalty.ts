import { createFileRoute } from "@tanstack/react-router";
import { assertAdminRequest, jsonResponse } from "@/server/admin/auth";
import { addLoyaltyPoints, getLoyalty, getSaasOverview, listLoyalty } from "@/server/saas/store";

export const Route = createFileRoute("/api/saas/loyalty")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get("email");
        if (email) {
          return jsonResponse({ account: getLoyalty(email) });
        }
        const denied = assertAdminRequest(request);
        if (denied) return denied;
        return jsonResponse({ accounts: listLoyalty(), overview: getSaasOverview() });
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { email: string; points: number; reason?: string };
          if (!body.email || !body.points) {
            return jsonResponse({ error: "email and points required" }, { status: 400 });
          }
          const result = addLoyaltyPoints(body.email, body.points, body.reason ?? "Manual adjustment");
          return jsonResponse(result);
        } catch (err) {
          return jsonResponse(
            { error: err instanceof Error ? err.message : "Update failed" },
            { status: 400 },
          );
        }
      },
    },
  },
});
