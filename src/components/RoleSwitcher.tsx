import { useRole } from "@/lib/role-context";
import { ROLE_LABELS, type Role } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sprout, Truck, Warehouse, Store, ChevronDown, Check } from "lucide-react";

const META: Record<Role, { Icon: typeof Sprout; tint: string }> = {
  farmer: { Icon: Sprout, tint: "text-primary" },
  collector: { Icon: Warehouse, tint: "text-warning" },
  distributor: { Icon: Truck, tint: "text-chain" },
  retailer: { Icon: Store, tint: "text-secondary" },
};

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const { Icon, tint } = META[role];
  const label = ROLE_LABELS[role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-2 border-2 px-3">
          <span className={`grid h-6 w-6 place-items-center rounded-md bg-accent ${tint}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Role</span>
            <span className="block text-xs font-semibold">{label.en}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Switch role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => {
          const M = META[r];
          const L = ROLE_LABELS[r];
          const active = r === role;
          return (
            <DropdownMenuItem key={r} onClick={() => setRole(r)} className="gap-3 py-2.5">
              <span className={`grid h-7 w-7 place-items-center rounded-md bg-accent ${M.tint}`}>
                <M.Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 leading-tight">
                <span className="block text-sm font-medium">{L.en}</span>
                {L.local && (
                  <span className="block text-[11px] text-muted-foreground">{L.local}</span>
                )}
              </span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
