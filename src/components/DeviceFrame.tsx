import type { ReactNode } from "react";
import { useDevice, DEVICE_WIDTHS } from "@/lib/device-context";

/**
 * Wraps app content in a device-sized frame so users can preview the UI
 * in desktop / tablet / mobile widths from anywhere in the app.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { device } = useDevice();
  const isFramed = device !== "desktop";
  const width = DEVICE_WIDTHS[device];

  if (!isFramed) return <>{children}</>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-muted/40 via-background to-muted/30 py-6 px-4">
      <div className="mx-auto flex flex-col items-center gap-3">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {device} preview · {width}
        </div>
        <div
          style={{ width, maxWidth: "100%" }}
          className="overflow-hidden rounded-[2rem] border-8 border-foreground/80 bg-background shadow-2xl ring-1 ring-border"
        >
          <div className="max-h-[85vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
