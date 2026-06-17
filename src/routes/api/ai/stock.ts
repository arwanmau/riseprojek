import { createFileRoute } from "@tanstack/react-router";
import { buildStockAnalysis } from "@/server/ai/stock-analysis";
import { jsonResponse } from "@/server/admin/auth";
import type { Batch } from "@/lib/mock-data";

export const Route = createFileRoute("/api/ai/stock")({
  server: {
    handlers: {
      GET: async () => jsonResponse(buildStockAnalysis()),
      POST: async ({ request }) => {
        let batches: Batch[] | undefined;
        try {
          const text = await request.text();
          if (text) {
            const body = JSON.parse(text) as { batches?: Batch[] };
            batches = body.batches;
          }
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, { status: 400 });
        }
        return jsonResponse(buildStockAnalysis(batches));
      },
    },
  },
});
