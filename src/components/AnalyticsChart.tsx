import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";

const throughput = [
  { month: "Dec", rice: 32, wheat: 24 },
  { month: "Jan", rice: 41, wheat: 28 },
  { month: "Feb", rice: 38, wheat: 35 },
  { month: "Mar", rice: 52, wheat: 42 },
  { month: "Apr", rice: 61, wheat: 48 },
  { month: "May", rice: 74, wheat: 56 },
];

const status = [
  { name: "Delivered", value: 42, color: "var(--success)" },
  { name: "In Transit", value: 28, color: "var(--chain)" },
  { name: "Warehoused", value: 18, color: "var(--secondary)" },
  { name: "Pending", value: 12, color: "var(--warning)" },
];

const revenue = [
  { week: "W1", value: 18 },
  { week: "W2", value: 24 },
  { week: "W3", value: 21 },
  { week: "W4", value: 32 },
  { week: "W5", value: 29 },
  { week: "W6", value: 38 },
];

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function AnalyticsChart() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Analisa Toko</h2>
          <p className="text-xs text-muted-foreground">Performa rantai pasok 6 bulan terakhir.</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success sm:inline-flex">
          <TrendingUp className="h-3 w-3" /> +18.4% MoM
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Throughput */}
        <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Throughput Bulanan (ton)</div>
              <div className="text-[11px] text-muted-foreground">Beras vs Gandum</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={throughput} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="g-rice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-wheat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chain)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--chain)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="rice" stroke="var(--primary)" strokeWidth={2} fill="url(#g-rice)" />
              <Area type="monotone" dataKey="wheat" stroke="var(--chain)" strokeWidth={2} fill="url(#g-wheat)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-chain/10 text-chain">
              <PieIcon className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Status Batch</div>
              <div className="text-[11px] text-muted-foreground">Distribusi saat ini</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={status} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                {status.map((s) => (
                  <Cell key={s.name} fill={s.color} stroke="var(--card)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {status.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue bars */}
        <div className="rounded-xl border bg-card p-4 shadow-sm lg:col-span-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary/10 text-secondary">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Pendapatan Mingguan (USDC, ribu)</div>
              <div className="text-[11px] text-muted-foreground">Settlement on-chain via smart contract</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenue} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)", opacity: 0.4 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
