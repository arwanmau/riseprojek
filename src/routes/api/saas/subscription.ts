import { createFileRoute } from "@tanstack/react-router";
import { assertAdminRequest, jsonResponse } from "@/server/admin/auth";
import {
  addLoyaltyPoints,
  getLoyalty,
  getSaasOverview,
  getSubscription,
  getPlans,
  listLoyalty,
  listSubscriptions,
  updateSubscription,
  type SaasPlanId,
} from "@/server/saas/store";

export const Route = createFileRoute("/api/saas/subscription")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get("email");
        const adminEmail = request.headers.get("x-gfl-admin-email");

        if (adminEmail && !assertAdminRequest(request)) {
          return jsonResponse(getSaasOverview());
        }
        if (email) {
          return jsonResponse({
            plans: getPlans(),
            subscription: getSubscription(email),
          });
        }
        return jsonResponse({ plans: getPlans(), subscriptions: listSubscriptions() });
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { email: string; planId: SaasPlanId };
          if (!body.email || !body.planId) {
            return jsonResponse({ error: "email and planId required" }, { status: 400 });
          }
          const subscription = updateSubscription(body.email, body.planId);
          return jsonResponse({ subscription, plans: getPlans() });
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
