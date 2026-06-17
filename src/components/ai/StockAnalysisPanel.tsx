import { useQuery } from "@tanstack/react-query";
import { fetchStockAnalysis } from "@/lib/admin-api";
import { useBatches } from "@/lib/batches-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bot, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import type { StockSignal } from "@/server/ai/stock-analysis";

const SIGNAL_STYLE: Record<StockSignal, string> = {
  buy: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  hold: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  sell: "bg-red-500/15 text-red-600 border-red-500/30",
  watch: "bg-amber-500/15 text-amber-600 border-amber-500/30",
};

export function StockAnalysisPanel({ compact = false }: { compact?: boolean }) {
  const { batches } = useBatches();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stock-analysis", batches.length],
    queryFn: () => fetchStockAnalysis(batches),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> AI menganalisis komoditas…
      </div>
    );
  }

  if (isError || !data) {
    return <p className="py-8 text-center text-sm text-destructive">Gagal memuat analisis saham AI.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Bot className="h-3.5 w-3.5" /> {data.aiModel}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{data.marketSummary}</p>
        </div>
        {!compact && (
          <div className="rounded-lg border bg-muted/30 px-4 py-2 text-center">
            <div className="text-[10px] uppercase text-muted-foreground">Top Pick AI</div>
            <div className="font-bold text-primary">{data.topPick}</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Portfolio Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-xs">
              <span>Rendah</span>
              <span className="font-bold">{data.portfolioRisk}/100</span>
              <span>Tinggi</span>
            </div>
            <Progress value={data.portfolioRisk} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Komoditas Dianalisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.items.length}</div>
            <p className="text-xs text-muted-foreground">Pangan global · update real-time demo</p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Komoditas</TableHead>
              <TableHead>Harga (IDR/kg)</TableHead>
              <TableHead>7d</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Sinyal</TableHead>
              {!compact && <TableHead>Rekomendasi AI</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => (
              <TableRow key={item.symbol}>
                <TableCell>
                  <div className="font-medium">{item.commodity}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{item.symbol}</div>
                </TableCell>
                <TableCell>{item.currentPriceIdr.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      item.changePct7d >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {item.changePct7d >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {item.changePct7d > 0 ? "+" : ""}
                    {item.changePct7d}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold">{item.aiScore}</span>
                  <span className="text-muted-foreground">/100</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={SIGNAL_STYLE[item.signal]}>
                    {item.signal.toUpperCase()}
                  </Badge>
                </TableCell>
                {!compact && (
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    {item.recommendation}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
