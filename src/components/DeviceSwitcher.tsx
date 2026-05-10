import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useDevice, type DeviceMode } from "@/lib/device-context";
import { cn } from "@/lib/utils";

const OPTIONS: { mode: DeviceMode; Icon: typeof Monitor; label: string }[] = [
  { mode: "desktop", Icon: Monitor, label: "Desktop" },
  { mode: "tablet", Icon: Tablet, label: "Tablet" },
  { mode: "mobile", Icon: Smartphone, label: "Mobile" },
];

export function DeviceSwitcher() {
  const { device, setDevice } = useDevice();
  return (
    <div className="hidden md:flex items-center rounded-md border bg-muted/40 p-0.5">
      {OPTIONS.map(({ mode, Icon, label }) => {
        const active = device === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setDevice(mode)}
            aria-label={label}
            title={`Preview as ${label}`}
            className={cn(
              "grid h-7 w-8 place-items-center rounded transition-colors",
              active
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
