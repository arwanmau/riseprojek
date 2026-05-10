import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/AppHeader";
import { BATCHES } from "@/lib/mock-data";
import { Activity, MapPin, Navigation, Radio, Thermometer, Truck, Wind } from "lucide-react";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Tracking — Global Food Ledger" },
      { name: "description", content: "Real-time animated map of food batches in transit, with IoT telemetry." },
    ],
  }),
  component: LivePage,
});

// Simple coordinate map (x%, y%) for known cities — purely visual.
const POINTS: Record<string, { x: number; y: number; label: string }> = {
  "Karawang, ID": { x: 78, y: 68, label: "Karawang" },
  "Port of Surabaya, ID": { x: 82, y: 70, label: "Surabaya" },
  "Kansas City, US": { x: 22, y: 42, label: "Kansas City" },
  "Rotterdam, NL": { x: 48, y: 30, label: "Rotterdam" },
  "Mato Grosso, BR": { x: 32, y: 65, label: "Mato Grosso" },
  "Santos Port, BR": { x: 34, y: 68, label: "Santos" },
  "Lampung, ID": { x: 76, y: 70, label: "Lampung" },
  "Jakarta, ID": { x: 77, y: 69, label: "Jakarta" },
};

function pickRoute(loc: string) {
  const keys = Object.keys(POINTS);
  const from = keys.find((k) => loc.includes(k.split(",")[0])) ?? keys[0];
  // Pair every batch with Rotterdam as destination for the visual demo
  return { from: POINTS[from], to: POINTS["Rotterdam, NL"] };
}

function LivePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  if (!user) return null;

  const inTransit = BATCHES.filter((b) => b.status === "In Transit" || b.status === "Warehoused");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
        <div className="flex items-center gap-4 animate-fade-up">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Radio className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Live Logistics Map</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Telemetri IoT real-time dari setiap container — diperbarui setiap 1.5 detik.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card shadow-elegant animate-fade-up">
          <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-60" />
          <svg viewBox="0 0 100 60" className="block w-full" preserveAspectRatio="none" style={{ height: 360 }}>
            {/* Ocean background */}
            <defs>
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="oklch(0.95 0.04 230)" />
                <stop offset="100%" stopColor="oklch(0.88 0.06 230)" />
              </radialGradient>
              <linearGradient id="routeGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--chain)" />
              </linearGradient>
            </defs>
            <rect width="100" height="60" fill="url(#oceanGrad)" />
            {/* stylized continents */}
            <g fill="oklch(0.78 0.08 140)" opacity="0.55">
              <path d="M5 25 Q10 18 18 22 L28 24 L32 38 L22 50 L10 48 Z" />
              <path d="M40 18 Q52 14 60 22 L66 26 L62 40 L48 42 L42 32 Z" />
              <path d="M68 55 Q72 48 82 52 L92 58 L88 60 L70 60 Z" />
              <path d="M70 22 L92 20 L94 38 L80 44 L70 38 Z" />
              <path d="M28 50 L42 52 L40 60 L26 60 Z" />
            </g>

            {inTransit.map((b, i) => {
              const r = pickRoute(b.location);
              const id = `route-${i}`;
              const path = `M ${r.from.x} ${r.from.y} Q ${(r.from.x + r.to.x) / 2} ${Math.min(r.from.y, r.to.y) - 12}, ${r.to.x} ${r.to.y}`;
              return (
                <g key={b.id}>
                  <path d={path} stroke="url(#routeGrad)" strokeWidth="0.6" fill="none" opacity="0.4" />
                  <path d={path} stroke="var(--primary)" strokeWidth="0.5" fill="none" className="animate-route-dash" />
                  <path id={id} d={path} fill="none" stroke="none" />
                  <circle r="0.9" fill="var(--primary)">
                    <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}

            {Object.values(POINTS).map((p) => (
              <g key={p.label}>
                <circle cx={p.x} cy={p.y} r="0.8" fill="var(--chain)" />
                <circle cx={p.x} cy={p.y} r="1.6" fill="var(--chain)" opacity="0.25">
                  <animate attributeName="r" values="1.2;2.6;1.2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x={p.x + 1.5} y={p.y - 1} fontSize="1.6" fill="oklch(0.25 0.02 260)" fontWeight="600">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {inTransit.map((b, i) => {
            const temp = (4 + Math.sin((tick + i) / 2) * 1.2).toFixed(1);
            const speed = (18 + Math.cos((tick + i) / 1.5) * 4).toFixed(0);
            const eta = 100 - ((tick * 3 + i * 17) % 100);
            return (
              <div
                key={b.id}
                className="group rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-elegant animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary animate-pulse-ring">
                      <Truck className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-bold tracking-tight">{b.id}</div>
                      <div className="text-xs text-muted-foreground">{b.product} · {b.weightKg.toLocaleString()} kg</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                    Live
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {b.location}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Telemetry Icon={Thermometer} label="Temp" value={`${temp}°C`} />
                  <Telemetry Icon={Wind} label="Speed" value={`${speed} kn`} />
                  <Telemetry Icon={Navigation} label="Heading" value={`${(280 + i * 11) % 360}°`} />
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> ETA progress</span>
                    <span className="font-mono">{eta}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-primary transition-all duration-700"
                      style={{ width: `${eta}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Telemetry({ Icon, label, value }: { Icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/60 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-mono text-sm font-bold">{value}</div>
    </div>
  );
}
