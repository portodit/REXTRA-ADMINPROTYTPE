import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle, Search, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Coins, CreditCard, Crown, Zap, AlertTriangle, Copy, ExternalLink,
  ChevronDown, RefreshCw,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip as RechartsTooltip, XAxis, YAxis, Legend,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import {
  useTokenLedgerData, useTokenKPI, useTokenChartData, useTopupTransactionCount,
  type SourceFilter,
} from "@/hooks/useTokenIkhtisar";

const SOURCE_LABELS: Record<string, string> = {
  TOPUP: "Top Up",
  MEMBERSHIP: "Membership",
  USAGE: "Pemakaian",
  ADJUSTMENT: "Koreksi",
  REFUND: "Refund",
  EXPIRED: "Expired",
};

export default function SistemTokenIkhtisar() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState<SourceFilter>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  // Real data hooks
  const { data: ledgerData, isLoading: ledgerLoading, isError: ledgerError, refetch: refetchLedger } = useTokenLedgerData(selectedTab, selectedPeriod);
  const { data: kpiData, isLoading: kpiLoading } = useTokenKPI(selectedTab, selectedPeriod);
  const { data: chartData, isLoading: chartLoading } = useTokenChartData(selectedTab, selectedPeriod);
  const { data: topupCount } = useTopupTransactionCount(selectedPeriod);

  const isLoading = ledgerLoading || kpiLoading || chartLoading;
  const isError = ledgerError;
  const isEmpty = !isLoading && !isError && (!ledgerData || ledgerData.length === 0);

  const formatNumber = (num: number) => new Intl.NumberFormat("id-ID").format(Math.abs(num));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Berhasil disalin", description: `${text} telah disalin ke clipboard.` });
  };

  const getTabLabel = (tab: SourceFilter) => {
    switch (tab) {
      case "semua": return "Semua Aktivitas";
      case "topup": return "Top Up";
      case "alokasi": return "Alokasi Membership";
      case "pemakaian": return "Pemakaian Token";
    }
  };

  // Filter ledger by search
  const filteredLedger = useMemo(() => {
    if (!ledgerData) return [];
    if (!searchQuery) return ledgerData.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return ledgerData
      .filter(e =>
        e.user_id.toLowerCase().includes(q) ||
        (e.reference_id || "").toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [ledgerData, searchQuery]);

  // Dynamic KPI cards
  const kpiCards = useMemo(() => {
    const d = kpiData || { tokenMasuk: 0, tokenKeluar: 0, netFlow: 0, topUpCount: 0, alokasiTotal: 0, pemakaianTotal: 0 };
    const cards = [
      {
        key: "tokenMasuk",
        title: selectedTab === "topup" ? "Token dari Top Up" : selectedTab === "alokasi" ? "Token dari Alokasi" : "Token Masuk",
        value: d.tokenMasuk,
        icon: ArrowUpRight,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        tooltip: "Total token masuk pada periode ini",
        show: selectedTab !== "pemakaian",
      },
      {
        key: "tokenKeluar",
        title: selectedTab === "pemakaian" ? "Total Pemakaian" : "Token Keluar",
        value: d.tokenKeluar,
        icon: ArrowDownRight,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        tooltip: "Total token keluar pada periode ini",
        show: selectedTab === "semua" || selectedTab === "pemakaian",
      },
      {
        key: "netFlow",
        title: "Net Flow",
        value: d.netFlow,
        icon: d.netFlow >= 0 ? TrendingUp : TrendingDown,
        color: d.netFlow >= 0 ? "text-blue-600" : "text-red-600",
        bgColor: d.netFlow >= 0 ? "bg-blue-50 dark:bg-blue-950/30" : "bg-red-50 dark:bg-red-950/30",
        tooltip: "Selisih token masuk dikurangi keluar",
        show: true,
      },
      {
        key: "topUpBerhasil",
        title: "Top Up Berhasil",
        value: topupCount || 0,
        icon: CreditCard,
        color: "text-violet-600",
        bgColor: "bg-violet-50 dark:bg-violet-950/30",
        tooltip: "Jumlah transaksi top up berhasil",
        isCount: true,
        show: selectedTab === "semua" || selectedTab === "topup",
      },
      {
        key: "alokasiMembership",
        title: "Alokasi Membership",
        value: d.alokasiTotal,
        icon: Crown,
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        tooltip: "Total token dari alokasi membership",
        show: selectedTab === "semua" || selectedTab === "alokasi",
      },
      {
        key: "pemakaianToken",
        title: "Pemakaian Token",
        value: d.pemakaianTotal,
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/30",
        tooltip: "Total token keluar dari konsumsi fitur",
        show: selectedTab === "semua" || selectedTab === "pemakaian",
      },
    ];
    return cards.filter(c => c.show);
  }, [selectedTab, kpiData, topupCount]);

  // Chart config based on tab
  const getChartConfig = () => {
    switch (selectedTab) {
      case "topup":
        return {
          areas: [{ dataKey: "topup", name: "Top Up", stroke: "#8B5CF6", gradient: "colorTopup" }],
          gradients: [{ id: "colorTopup", color: "#8B5CF6" }],
        };
      case "alokasi":
        return {
          areas: [{ dataKey: "alokasi", name: "Alokasi Membership", stroke: "#F59E0B", gradient: "colorAlokasi" }],
          gradients: [{ id: "colorAlokasi", color: "#F59E0B" }],
        };
      case "pemakaian":
        return {
          areas: [{ dataKey: "pemakaian", name: "Pemakaian Token", stroke: "#F97316", gradient: "colorPemakaian" }],
          gradients: [{ id: "colorPemakaian", color: "#F97316" }],
        };
      default:
        return {
          areas: [
            { dataKey: "masuk", name: "Token Masuk", stroke: "#3B82F6", gradient: "colorMasuk" },
            { dataKey: "keluar", name: "Token Keluar", stroke: "#F59E0B", gradient: "colorKeluar" },
          ],
          gradients: [
            { id: "colorMasuk", color: "#3B82F6" },
            { id: "colorKeluar", color: "#F59E0B" },
          ],
        };
    }
  };

  const chartConfig = getChartConfig();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm z-50">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((p: any) => (
              <p key={p.dataKey} style={{ color: p.stroke }} className="font-medium">
                {p.name}: {formatNumber(p.value)} token
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Alerts from real data
  const alertsData = useMemo(() => {
    if (!ledgerData) return [];
    const alerts: { id: string; message: string; type: string; route: string }[] = [];
    // Count failed topups in period
    const failedUsage = ledgerData.filter(e => e.source_type === "ADJUSTMENT").length;
    if (failedUsage > 0) {
      alerts.push({
        id: "adj",
        message: `${failedUsage} koreksi admin tercatat pada periode ini`,
        type: "warning",
        route: "/sistem-token/ledger?source=koreksi",
      });
    }
    return alerts;
  }, [ledgerData]);

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/sistem-token/ikhtisar">Sistem Token</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Ikhtisar Token</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ikhtisar Token</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">
                  Pantau pergerakan token masuk dan keluar, serta ringkasan pemakaian token pada periode tertentu.
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="cursor-help shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs z-50 bg-popover">
                  <p className="text-sm">
                    Token adalah unit mata uang dalam sistem REXTRA yang digunakan untuk mengakses fitur berbayar.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Control Bar */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as SourceFilter)}>
                <TabsList className="inline-flex h-10 p-1 bg-muted/60 rounded-xl">
                  <TabsTrigger value="semua" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Semua</TabsTrigger>
                  <TabsTrigger value="topup" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Top Up</TabsTrigger>
                  <TabsTrigger value="alokasi" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Alokasi</TabsTrigger>
                  <TabsTrigger value="pemakaian" className="text-xs sm:text-sm px-3 sm:px-4 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Pemakaian</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari user ID atau reference ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 sm:h-10"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="flex-1 h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Periode" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="7d">7 Hari</SelectItem>
                    <SelectItem value="30d">30 Hari</SelectItem>
                    <SelectItem value="90d">90 Hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* States */}
          {isLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-8 w-32 mb-2" /><Skeleton className="h-3 w-20" /></CardContent></Card>
                ))}
              </div>
              <Card><CardHeader><Skeleton className="h-5 w-48" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">Terjadi kesalahan saat memuat data.</p>
              <Button onClick={() => refetchLedger()}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Coins className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Belum Ada Aktivitas Token</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Aktivitas token akan muncul setelah ada top up, alokasi membership, atau pemakaian fitur.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/sistem-token/pengadaan")}>Ke Pengadaan Token</Button>
              </div>
            </div>
          )}

          {!isLoading && !isError && !isEmpty && (
            <>
              {/* KPI Cards */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Menampilkan data untuk: <span className="font-medium text-foreground">{getTabLabel(selectedTab)}</span>
                </p>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {kpiCards.map((kpi) => (
                    <Card key={kpi.key} className="hover:shadow-md transition-shadow min-w-0">
                      <CardContent className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{kpi.title}</p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="cursor-help shrink-0">
                                    <HelpCircle className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="z-50 bg-popover">
                                  <p className="text-xs max-w-[200px]">{kpi.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                              {kpi.key === "netFlow" && kpi.value < 0 && "-"}
                              {kpi.isCount ? kpi.value : formatNumber(kpi.value)}
                              <span className="text-sm sm:text-base lg:text-lg font-normal ml-1">
                                {kpi.isCount ? "trx" : "token"}
                              </span>
                            </p>
                          </div>
                          <div className={`p-1.5 sm:p-2 lg:p-2.5 rounded-lg shrink-0 ${kpi.bgColor}`}>
                            <kpi.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${kpi.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              {alertsData.length > 0 && (
                <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 overflow-hidden">
                  <Collapsible open={alertsExpanded} onOpenChange={setAlertsExpanded}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-100/30 dark:hover:bg-amber-900/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Perlu Ditinjau</p>
                            <p className="text-xs text-muted-foreground">{alertsData.length} item memerlukan perhatian</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 font-semibold">{alertsData.length}</Badge>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${alertsExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-2">
                        {alertsData.map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-card/80 ring-1 ring-border/50 hover:ring-border transition-all group">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${alert.type === "error" ? "bg-destructive" : "bg-amber-500"}`} />
                              <span className="text-sm text-foreground">{alert.message}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 opacity-70 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => { e.stopPropagation(); navigate(alert.route); }}>
                              Tinjau<ExternalLink className="h-3 w-3 ml-1.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Grafik Tren: {getTabLabel(selectedTab)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] lg:h-[400px]">
                    {chartData && chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            {chartConfig.gradients.map((g) => (
                              <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                              </linearGradient>
                            ))}
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          {chartConfig.areas.map((area) => (
                            <Area
                              key={area.dataKey}
                              type="monotone"
                              dataKey={area.dataKey}
                              name={area.name}
                              stroke={area.stroke}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill={`url(#${area.gradient})`}
                            />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Belum ada data chart untuk periode ini.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-base font-semibold">Aktivitas Token Terbaru</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{filteredLedger.length} pergerakan token terakhir</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    onClick={() => navigate("/sistem-token/ledger")}>
                    Lihat Semua<ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="min-w-[100px]">Waktu</TableHead>
                          <TableHead className="min-w-[100px]">User</TableHead>
                          <TableHead className="min-w-[60px] text-center">Tipe</TableHead>
                          <TableHead className="min-w-[100px]">Sumber</TableHead>
                          <TableHead className="min-w-[120px] hidden md:table-cell">Ref ID</TableHead>
                          <TableHead className="min-w-[90px] text-right">Jumlah</TableHead>
                          <TableHead className="min-w-[90px] text-right hidden sm:table-cell">Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLedger.map((item) => {
                          const isIn = item.direction === "IN";
                          const time = new Date(item.occurred_at);
                          return (
                            <TableRow key={item.id} className="hover:bg-muted/30 cursor-pointer group"
                              onClick={() => navigate(`/sistem-token/ledger?ref=${item.reference_id}`)}>
                              <TableCell className="py-3">
                                <div className="text-sm font-medium">{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
                                <div className="text-xs text-muted-foreground">{time.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="text-sm font-medium truncate max-w-[120px]">{item.user_id}</div>
                              </TableCell>
                              <TableCell className="py-3 text-center">
                                <Badge variant="outline" className={isIn
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700 text-xs px-2"
                                  : "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-700 text-xs px-2"
                                }>
                                  {isIn ? "↑ IN" : "↓ OUT"}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 text-sm">{SOURCE_LABELS[item.source_type] || item.source_type}</TableCell>
                              <TableCell className="py-3 hidden md:table-cell">
                                {item.reference_id && (
                                  <div className="flex items-center gap-1">
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{item.reference_id}</code>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => { e.stopPropagation(); copyToClipboard(item.reference_id!); }}>
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="py-3 text-right">
                                <span className={isIn ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                                  {isIn ? "+" : "-"}{formatNumber(item.amount)}
                                </span>
                              </TableCell>
                              <TableCell className="py-3 text-right hidden sm:table-cell">
                                <span className="text-sm text-muted-foreground font-mono">{formatNumber(item.balance_after)}</span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
