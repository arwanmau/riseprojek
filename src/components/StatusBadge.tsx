import type { BatchStatus } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const MAP: Record<BatchStatus, string> = {
  Harvested: "bg-primary/15 text-primary border-primary/30",
  Inspected: "bg-secondary/15 text-secondary border-secondary/30",
  "In Transit": "bg-warning/15 text-[oklch(0.45_0.13_75)] border-warning/30",
  Warehoused: "bg-chain/15 text-chain border-chain/30",
  Delivered: "bg-success/15 text-success border-success/30",
  "Pending Escrow": "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: BatchStatus }) {
  return (
    <Badge variant="outline" className={`font-medium ${MAP[status]}`}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
