import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, RefreshCw, Search, Shield, Lock, Coins } from "lucide-react";
import type { UserMembership, UsageLog } from "@/hooks/useUserMembershipDetail";

interface EntitlementItem {
  id: string;
  key: string;
  name: string;
  status: string;
  restriction_type: string;
  usage_limit: number;
  token_cost: number;
}

interface Tab2Props {
  membership: UserMembership;
  entitlements: EntitlementItem[];
  usageLogs: UsageLog[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const restrictionLabel: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  unlimited: { label: "Unlimited", icon: <Shield className="h-3 w-3" />, color: "text-emerald-600 bg-emerald-50" },
  frequency: { label: "Berkuota", icon: <Lock className="h-3 w-3" />, color: "text-amber-600 bg-amber-50" },
  token_gated: { label: "Token-gated", icon: <Coins className="h-3 w-3" />, color: "text-violet-600 bg-violet-50" },
};

export function UserMembershipTab2({ membership, entitlements, usageLogs, isLoading, isError, refetch }: Tab2Props) {
  const [entSearch, setEntSearch] = useState("");
  const [entFilter, setEntFilter] = useState("all");
  const [logFilter, setLogFilter] = useState("all");
  const [logEntFilter, setLogEntFilter] = useState("all");

  const hasQuotaEntitlements = entitlements.some(e => e.restriction_type === "frequency");

  // Usage count per entitlement for quota display
  const usageCountMap = useMemo(() => {
    const map = new Map<string, number>();
    usageLogs.filter(l => l.result === "success").forEach(l => {
      map.set(l.entitlement_key, (map.get(l.entitlement_key) || 0) + 1);
    });
    return map;
  }, [usageLogs]);

  const filteredEntitlements = useMemo(() => {
    let list = [...entitlements];
    if (entSearch) {
      const s = entSearch.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(s) || e.key.toLowerCase().includes(s));
    }
    if (entFilter !== "all") {
      list = list.filter(e => e.restriction_type === entFilter);
    }
    return list;
  }, [entitlements, entSearch, entFilter]);

  const filteredLogs = useMemo(() => {
    let list = [...usageLogs];
    if (logFilter !== "all") list = list.filter(l => l.result === logFilter);
    if (logEntFilter !== "all") list = list.filter(l => l.entitlement_key === logEntFilter);
    return list;
  }, [usageLogs, logFilter, logEntFilter]);

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-48" /></div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Gagal memuat data akses.</p>
        <Button size="sm" onClick={refetch}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* A) Ringkasan Entitlement Aktif */}
      <div className="border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Entitlement Aktif</h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari entitlement..." value={entSearch} onChange={e => setEntSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={entFilter} onValueChange={setEntFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Tipe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
              <SelectItem value="frequency">Berkuota</SelectItem>
              <SelectItem value="token_gated">Token-gated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredEntitlements.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-foreground font-medium">Tidak ada entitlement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Akses</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Sisa Kuota</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntitlements.map(e => {
                  const r = restrictionLabel[e.restriction_type] || restrictionLabel.unlimited;
                  const used = usageCountMap.get(e.key) || 0;
                  const remaining = e.restriction_type === "frequency" && e.usage_limit > 0
                    ? Math.max(0, e.usage_limit - used)
                    : null;
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.name}</TableCell>
                      <TableCell><code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{e.key}</code></TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${r.color}`}>
                          {r.icon} {r.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {remaining !== null ? (
                          <span className={`text-xs font-semibold ${remaining === 0 ? "text-red-600" : remaining <= 3 ? "text-amber-600" : "text-foreground"}`}>
                            {remaining}/{e.usage_limit}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={e.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {e.status === "active" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* B) Kuota Akses (conditional) */}
      {hasQuotaEntitlements && (
        <div className="border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kuota Akses</h3>
          <p className="text-xs text-muted-foreground mb-4">Kuota berlaku untuk periode langganan aktif dan tidak reset di tengah periode.</p>
          <div className="space-y-2">
            {entitlements.filter(e => e.restriction_type === "frequency").map(e => {
              const used = usageCountMap.get(e.key) || 0;
              const remaining = Math.max(0, e.usage_limit - used);
              const pct = e.usage_limit > 0 ? (used / e.usage_limit) * 100 : 0;
              return (
                <div key={e.id} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{e.name}</span>
                    <span className="text-xs text-muted-foreground">{used}/{e.usage_limit}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Sisa: {remaining}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* C) Riwayat Penggunaan */}
      <div className="border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Riwayat Penggunaan</h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select value={logFilter} onValueChange={setLogFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Hasil" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hasil</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={logEntFilter} onValueChange={setLogEntFilter}>
            <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="Entitlement" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Entitlement</SelectItem>
              {[...new Set(usageLogs.map(l => l.entitlement_key))].map(k => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Belum ada riwayat penggunaan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Entitlement</TableHead>
                  <TableHead>Hasil</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 50).map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString("id-ID")} {new Date(log.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{log.entitlement_name}</p>
                        <code className="text-[10px] text-muted-foreground font-mono">{log.entitlement_key}</code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.result === "success" ? "default" : "destructive"} className="text-[10px]">
                        {log.result === "success" ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{log.reference_id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
