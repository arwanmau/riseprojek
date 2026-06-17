import type { Batch } from "@/lib/mock-data";

export type StockSignal = "buy" | "hold" | "sell" | "watch";

export type StockAnalysisItem = {
  commodity: string;
  symbol: string;
  currentPriceIdr: number;
  changePct7d: number;
  signal: StockSignal;
  aiScore: number;
  demandIndex: number;
  supplyRisk: "low" | "medium" | "high";
  recommendation: string;
  forecast30d: string;
};

export type StockAnalysisPayload = {
  generatedAt: string;
  marketSummary: string;
  portfolioRisk: number;
  items: StockAnalysisItem[];
  topPick: string;
  aiModel: string;
};

const COMMODITIES = [
  { commodity: "Beras IR64", symbol: "RICE-IR64", base: 9800 },
  { commodity: "Gandum Hard Red", symbol: "WHEAT-HRW", base: 11200 },
  { commodity: "Jagung Feed Grade", symbol: "CORN-FG", base: 6400 },
  { commodity: "Kedelai Non-GMO", symbol: "SOY-NGM", base: 15800 },
  { commodity: "Minyak Kelapa Sawit", symbol: "CPO-REF", base: 14200 },
];

function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function deriveSignal(score: number, change: number): StockSignal {
  if (score >= 78 && change > 0) return "buy";
  if (score <= 35 || change < -8) return "sell";
  if (score >= 55) return "hold";
  return "watch";
}

export function buildStockAnalysis(batches?: Batch[]): StockAnalysisPayload {
  const batchCount = batches?.length ?? 4;
  const tonnage = batches?.reduce((a, b) => a + b.weightKg, 0) ?? 65000;
  const seed = hashSeed(`${batchCount}-${tonnage}-${new Date().toISOString().slice(0, 10)}`);

  const items: StockAnalysisItem[] = COMMODITIES.map((c, i) => {
    const noise = ((seed >> (i * 3)) & 0xff) / 255;
    const changePct7d = Math.round((noise * 24 - 8) * 10) / 10;
    const demandIndex = Math.round(45 + noise * 50);
    const supplyRisk = demandIndex > 80 ? "high" : demandIndex > 60 ? "medium" : "low";
    const aiScore = Math.round(30 + noise * 65 + (batchCount > 3 ? 5 : 0));
    const signal = deriveSignal(aiScore, changePct7d);
    const rec =
      signal === "buy"
        ? `AI merekomendasikan akumulasi — permintaan B2B naik ${Math.abs(changePct7d).toFixed(0)}% minggu ini.`
        : signal === "sell"
          ? "Tekanan oversupply terdeteksi. Pertimbangkan hedging kontrak forward."
          : signal === "hold"
            ? "Posisi netral. Pantau batch in-transit dan fluktuasi cuaca."
            : "Volatilitas tinggi — tunggu konfirmasi sinyal permintaan pasar EU.";

    return {
      commodity: c.commodity,
      symbol: c.symbol,
      currentPriceIdr: Math.round(c.base * (1 + changePct7d / 100)),
      changePct7d,
      signal,
      aiScore,
      demandIndex,
      supplyRisk,
      recommendation: rec,
      forecast30d: changePct7d >= 0 ? `+${(changePct7d * 1.4).toFixed(1)}%` : `${(changePct7d * 1.2).toFixed(1)}%`,
    };
  });

  items.sort((a, b) => b.aiScore - a.aiScore);
  const portfolioRisk = Math.round(
    items.reduce((a, i) => a + (i.supplyRisk === "high" ? 30 : i.supplyRisk === "medium" ? 18 : 8), 0) /
      items.length,
  );

  return {
    generatedAt: new Date().toISOString(),
    marketSummary: `AI menganalisis ${batchCount} batch aktif (${(tonnage / 1000).toFixed(1)}t) terhadap 5 komoditas pangan global. Sinyal dominan: permintaan beras & CPO naik di pasar ASEAN.`,
    portfolioRisk,
    items,
    topPick: items[0]?.commodity ?? "Beras IR64",
    aiModel: "GFL-DemandSupply-v2.4",
  };
}
