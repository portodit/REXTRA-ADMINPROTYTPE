import { useRouter } from 'next/navigation'
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, RefreshCw, ChevronDown, Calendar, Clock, FileText, Coins, Star, Shield, TrendingUp, Hash, CreditCard } from "lucide-react";
import { TierBadge } from "../StatusBadges";
import type { UserMembership, SubscriptionCycle } from "@/hooks/useUserMembershipDetail";

interface Tab1Props {
  membership: UserMembership;
  cycles: SubscriptionCycle[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const formatCurrency = (v: number) => `Rp ${Math.abs(v).toLocaleString("id-ID")}`;
const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

export function UserMembershipTab1({ membership, cycles, isLoading, isError, refetch }: Tab1Props) {
  const router = useRouter();

  // Fetch transaction UUIDs for all cycles that have a transaction_id
  const trxIds = cycles.filter(c => c.transaction_id).map(c => c.transaction_id!);
  const { data: trxMap } = useQuery({
    queryKey: ["cycle-trx-map", trxIds],
    queryFn: async () => {
      if (trxIds.length === 0) return {};
      const { data } = await supabase
        .from("membership_transactions")
        .select("id, transaction_id, primary_status")
        .in("transaction_id", trxIds);
      const map: Record<string, { uuid: string; status: string }> = {};
      (data || []).forEach((t: any) => { map[t.transaction_id] = { uuid: t.id, status: t.primary_status }; });
      return map;
    },
    enabled: trxIds.length > 0,
  });

  const lifetimeStats = useMemo(() => {
    const paidCycles = cycles.filter(c => c.cycle_number > 0);
    const successCycles = paidCycles.filter(c => c.status !== "failed");
    const totalPaid = successCycles.reduce((s, c) => s + c.amount_paid, 0);
    const totalMonths = successCycles.reduce((s, c) => s + c.duration_months, 0);
    const firstCycle = [...cycles].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
    return {
      totalTransactions: successCycles.length,
      totalMonths,
      totalPaid,
      firstDate: firstCycle?.start_date || null,
    };
  }, [cycles]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Gagal memuat data riwayat langganan.</p>
        <Button size="sm" onClick={refetch}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Benefit Membership — glassmorphism style */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/20 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          Benefit Membership
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200/30 transition-all hover:shadow-md hover:shadow-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <Coins className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
              <p className="font-bold text-2xl text-foreground tracking-tight">{membership.token_balance.toLocaleString("id-ID")}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Token</p>
            </div>
          </div>
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-200/30 transition-all hover:shadow-md hover:shadow-amber-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 text-amber-600" />
                </div>
              </div>
              <p className="font-bold text-2xl text-foreground tracking-tight">{membership.points_balance.toLocaleString("id-ID")}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Poin</p>
            </div>
          </div>
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200/30 transition-all hover:shadow-md hover:shadow-emerald-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>
              <p className="font-bold text-2xl text-foreground tracking-tight">{membership.entitlement_count}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Akses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Lifetime — modern stats */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-primary/5 p-6">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" />
          Ringkasan Lifetime Membership
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/30 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hash className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className="font-bold text-2xl text-foreground tracking-tight">{lifetimeStats.totalTransactions}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Transaksi Sukses</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/30 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className="font-bold text-2xl text-foreground tracking-tight">{lifetimeStats.totalMonths}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Bulan</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/30 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className="font-bold text-lg text-foreground tracking-tight">{formatCurrency(lifetimeStats.totalPaid)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Bayar</p>
          </div>
        </div>
      </div>

      {/* Riwayat Langganan */}
      <div className="border border-border/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Riwayat Langganan</h3>
        </div>
        {lifetimeStats.firstDate && (
          <p className="text-xs text-muted-foreground mb-4">Sejak langganan pertama: {formatDate(lifetimeStats.firstDate)}</p>
        )}

        {cycles.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Belum ada riwayat langganan</p>
            <p className="text-xs text-muted-foreground mt-1">Data riwayat akan muncul setelah user melakukan transaksi membership.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cycles.map((cycle) => (
              <Collapsible key={cycle.id}>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors text-left group">
                    <div className="flex items-center gap-3 min-w-0">
                      <TierBadge tier={cycle.plan} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {cycle.cycle_number === 0 ? "Trial" : `Langganan ke-${cycle.cycle_number}`} — {cycle.plan}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {formatDate(cycle.start_date)} – {formatDate(cycle.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge variant={cycle.status === "active" ? "default" : cycle.status === "expired" ? "destructive" : "secondary"} className="text-[10px]">
                        {cycle.status === "active" ? "Aktif" : cycle.status === "expired" ? "Expired" : "Selesai"}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-4 bg-muted/20 rounded-xl space-y-3 text-sm border border-border/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Durasi</p>
                        <p className="font-medium">{cycle.duration_months} bulan</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Nominal</p>
                        <p className="font-medium">{cycle.amount_paid === 0 ? "Gratis" : formatCurrency(cycle.amount_paid)}</p>
                      </div>
                      {cycle.transaction_id && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Transaction ID</p>
                          <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{cycle.transaction_id}</code>
                        </div>
                      )}
                      {cycle.payment_channel && cycle.payment_channel !== "-" && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Channel</p>
                          <p className="font-medium">{cycle.payment_channel}</p>
                        </div>
                      )}
                    </div>
                    {/* Action buttons */}
                    {cycle.transaction_id && trxMap?.[cycle.transaction_id] && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40 flex-wrap">
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => router.push(`/membership/riwayat-transaksi/${trxMap[cycle.transaction_id!].uuid}`)}>
                          <Clock className="h-3 w-3 mr-1.5" />
                          Detail Transaksi
                        </Button>
                        {trxMap[cycle.transaction_id!].status === "BERHASIL" && (
                          <Button variant="outline" size="sm" className="text-xs h-7"
                            onClick={() => router.push(`/faktur/view/${trxMap[cycle.transaction_id!].uuid}`)}>
                            <FileText className="h-3 w-3 mr-1.5" />
                            Faktur
                          </Button>
                        )}
                      </div>
                    )}
                    {cycle.transaction_id && !trxMap?.[cycle.transaction_id] && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <p className="text-xs text-muted-foreground italic">Data transaksi tidak ditemukan</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
