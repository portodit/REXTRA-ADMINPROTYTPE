import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, Coins, Gift, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { UserMembership, TokenLedgerEntry, PointsLedgerEntry } from "@/hooks/useUserMembershipDetail";

interface Tab3Props {
  membership: UserMembership;
  tokenLedger: TokenLedgerEntry[];
  pointsLedger: PointsLedgerEntry[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const formatCurrency = (v: number) => `${v >= 0 ? "+" : ""}${v.toLocaleString("id-ID")}`;
const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const formatTime = (d: string) => new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

function LedgerTable({ entries, type }: { entries: (TokenLedgerEntry | PointsLedgerEntry)[]; type: "token" | "poin" }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        Belum ada riwayat {type}.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Tanggal</th>
            <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Keterangan</th>
            <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Sumber</th>
            <th className="text-right py-2 text-xs font-semibold text-muted-foreground">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isIn = entry.mutation_type === "in" || entry.mutation_type === "earn";
            return (
              <tr key={entry.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                <td className="py-2.5">
                  <p className="text-sm">{formatDate(entry.created_at)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatTime(entry.created_at)}</p>
                </td>
                <td className="py-2.5">
                  <p className="text-sm">{entry.description || "-"}</p>
                  {entry.reference_id && (
                    <code className="text-[10px] text-muted-foreground font-mono">{entry.reference_id}</code>
                  )}
                </td>
                <td className="py-2.5">
                  <Badge variant="secondary" className="text-[10px]">{entry.source}</Badge>
                </td>
                <td className="py-2.5 text-right">
                  <span className={`inline-flex items-center gap-1 font-mono font-medium text-sm ${isIn ? "text-emerald-600" : "text-red-500"}`}>
                    {isIn ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                    {formatCurrency(entry.amount)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function UserMembershipTab3({ membership, tokenLedger, pointsLedger, isLoading, isError, refetch }: Tab3Props) {
  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-48" /></div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Gagal memuat data token & poin.</p>
        <Button size="sm" onClick={refetch}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saldo Ringkas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-5 bg-amber-50/50 rounded-xl border border-amber-100">
          <Coins className="h-8 w-8 text-amber-600" />
          <div>
            <p className="font-bold text-2xl">{membership.token_balance.toLocaleString("id-ID")}</p>
            <p className="text-xs text-muted-foreground">Token Aktif</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-violet-50/50 rounded-xl border border-violet-100">
          <Gift className="h-8 w-8 text-violet-600" />
          <div>
            <p className="font-bold text-2xl">{membership.points_balance.toLocaleString("id-ID")}</p>
            <p className="text-xs text-muted-foreground">Poin Aktif</p>
          </div>
        </div>
      </div>

      {/* Token Ledger */}
      <div className="border border-border/60 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Coins className="h-3.5 w-3.5" />
          Riwayat Token ({tokenLedger.length})
        </h3>
        <LedgerTable entries={tokenLedger} type="token" />
      </div>

      {/* Points Ledger */}
      <div className="border border-border/60 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Gift className="h-3.5 w-3.5" />
          Riwayat Poin ({pointsLedger.length})
        </h3>
        <LedgerTable entries={pointsLedger} type="poin" />
      </div>
    </div>
  );
}
