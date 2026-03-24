import { useRouter } from 'next/navigation'
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RextraTablePagination } from "@/components/design-system/RextraTablePagination";
import {
  Search, RefreshCw, AlertCircle, Calendar, X, Filter, Eye,
  ArrowRight, Clock, CheckCircle2, Ban, ShoppingCart, RotateCcw, TrendingUp, TrendingDown,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { DateRange } from "react-day-picker";

// --- Types ---
interface MembershipTransaction {
  id: string;
  transaction_id: string;
  created_at: string;
  primary_status: string;
  change_type: string;
  user_id: string;
  user_name: string;
  user_email: string;
  from_plan: string | null;
  to_plan: string;
  from_duration_months: number | null;
  to_duration_months: number | null;
  subtotal: number;
  discount: number;
  promo_code: string | null;
  total: number;
  payment_method: string | null;
  xendit_invoice_id: string | null;
  cancel_reason: string | null;
}

// --- Badge Components ---
function PrimaryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    BERLANGSUNG: { icon: <Clock className="h-3.5 w-3.5" />, bg: "bg-amber-50", text: "text-amber-600" },
    DIBATALKAN: { icon: <Ban className="h-3.5 w-3.5" />, bg: "bg-slate-100", text: "text-slate-600" },
    BERHASIL: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, bg: "bg-emerald-50", text: "text-emerald-600" },
  };
  const c = config[status] || config.BERLANGSUNG;
  const label = status === "BERLANGSUNG" ? "Berlangsung" : status === "DIBATALKAN" ? "Dibatalkan" : "Berhasil";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border border-current/10`}>
      {c.icon}
      {label}
    </span>
  );
}

function ChangeTypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
    PEMBELIAN_BARU: { icon: <ShoppingCart className="h-3 w-3" />, bg: "bg-sky-100", text: "text-sky-700", label: "Pembelian Baru" },
    RENEWAL: { icon: <RotateCcw className="h-3 w-3" />, bg: "bg-emerald-100", text: "text-emerald-700", label: "Renewal" },
    UPGRADE: { icon: <TrendingUp className="h-3 w-3" />, bg: "bg-violet-100", text: "text-violet-700", label: "Upgrade" },
    DOWNGRADE: { icon: <TrendingDown className="h-3 w-3" />, bg: "bg-amber-100", text: "text-amber-700", label: "Downgrade" },
  };
  const c = config[type] || config.PEMBELIAN_BARU;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${c.bg} ${c.text} border border-current/10`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string | null }) {
  if (!plan) return <span className="text-xs text-muted-foreground">—</span>;
  const tierConfig: Record<string, string> = {
    MAX: "bg-amber-50 text-amber-700 border-amber-200",
    PRO: "bg-violet-50 text-violet-700 border-violet-200",
    BASIC: "bg-sky-50 text-sky-700 border-sky-200",
    STANDARD: "bg-slate-50 text-slate-600 border-slate-200",
  };
  const cls = tierConfig[plan] || tierConfig.STANDARD;
  return <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>{plan}</span>;
}

const formatCurrency = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;

export default function RiwayatTransaksiPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data: transactions = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["membership-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MembershipTransaction[];
    },
  });

  // Summary counts
  const summary = useMemo(() => {
    const s = { berlangsung: 0, dibatalkan: 0, berhasil: 0 };
    transactions.forEach((t) => {
      if (t.primary_status === "BERLANGSUNG") s.berlangsung++;
      else if (t.primary_status === "DIBATALKAN") s.dibatalkan++;
      else if (t.primary_status === "BERHASIL") s.berhasil++;
    });
    return s;
  }, [transactions]);

  // Filtered
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (statusFilter !== "all") list = list.filter((t) => t.primary_status === statusFilter);
    if (changeTypeFilter !== "all") list = list.filter((t) => t.change_type === changeTypeFilter);
    if (planFilter !== "all") list = list.filter((t) => t.to_plan === planFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.transaction_id.toLowerCase().includes(q) ||
        t.user_name.toLowerCase().includes(q) ||
        t.user_email.toLowerCase().includes(q) ||
        t.user_id.toLowerCase().includes(q) ||
        (t.xendit_invoice_id && t.xendit_invoice_id.toLowerCase().includes(q))
      );
    }
    if (dateRange?.from) list = list.filter((t) => new Date(t.created_at) >= dateRange.from!);
    if (dateRange?.to) list = list.filter((t) => new Date(t.created_at) <= dateRange.to!);
    if (sortBy === "newest") list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return list;
  }, [transactions, statusFilter, changeTypeFilter, planFilter, search, dateRange, sortBy]);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const hasActiveFilters = search || statusFilter !== "all" || changeTypeFilter !== "all" || planFilter !== "all" || dateRange;

  const resetFilters = () => {
    setSearch(""); setStatusFilter("all"); setChangeTypeFilter("all"); setPlanFilter("all"); setDateRange(undefined); setCurrentPage(1);
  };

  const handleSummaryClick = (status: string) => {
    if (status === statusFilter) { setStatusFilter("all"); } else { setStatusFilter(status); }
    setCurrentPage(1);
  };

  // Loading
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-8 w-96" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      </DashboardLayout>
    );
  }

  // Error
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-red-50 rounded-full p-4 mb-4"><AlertCircle className="h-8 w-8 text-red-500" /></div>
          <h3 className="text-lg font-semibold mb-2">Gagal memuat data</h3>
          <p className="text-muted-foreground mb-4">Terjadi kesalahan saat memuat data transaksi.</p>
          <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/membership/status">Membership</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Riwayat Transaksi</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ledger transaksi membership untuk audit pembayaran dan penelusuran finansial.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "BERLANGSUNG", label: "Berlangsung", count: summary.berlangsung, icon: <Clock className="h-5 w-5" />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
            { key: "DIBATALKAN", label: "Dibatalkan", count: summary.dibatalkan, icon: <Ban className="h-5 w-5" />, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
            { key: "BERHASIL", label: "Berhasil", count: summary.berhasil, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          ].map((card) => (
            <button
              key={card.key}
              onClick={() => handleSummaryClick(card.key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                statusFilter === card.key
                  ? `${card.bg} ${card.border} ring-2 ring-current/20`
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.count}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="BERLANGSUNG">Berlangsung</SelectItem>
                <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                <SelectItem value="BERHASIL">Berhasil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={changeTypeFilter} onValueChange={(v) => { setChangeTypeFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Jenis Perubahan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="PEMBELIAN_BARU">Pembelian Baru</SelectItem>
                <SelectItem value="RENEWAL">Renewal</SelectItem>
                <SelectItem value="UPGRADE">Upgrade</SelectItem>
                <SelectItem value="DOWNGRADE">Downgrade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Plan Tujuan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Plan</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
                <SelectItem value="MAX">Max</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Urutkan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}</>
                    ) : format(dateRange.from, "dd/MM/yyyy")
                  ) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />Reset
              </Button>
            )}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID transaksi, invoice, nama, email, atau User ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table or Empty */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-4 mb-4"><Filter className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold mb-2">{hasActiveFilters ? "Data tidak ditemukan" : "Belum ada transaksi membership"}</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {hasActiveFilters ? "Coba ubah kriteria pencarian atau filter." : "Data transaksi akan muncul setelah ada aktivitas membership."}
            </p>
            {hasActiveFilters && <Button variant="outline" onClick={resetFilters}>Reset Filter</Button>}
          </div>
        ) : (
          <>
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="min-w-[110px] font-semibold text-foreground">Tanggal & Jam</TableHead>
                      <TableHead className="min-w-[150px] font-semibold text-foreground">User</TableHead>
                      <TableHead className="min-w-[140px] font-semibold text-foreground">Jenis Perubahan</TableHead>
                      <TableHead className="min-w-[140px] font-semibold text-foreground">Perubahan Plan</TableHead>
                      <TableHead className="min-w-[110px] text-right font-semibold text-foreground">Total Bayar</TableHead>
                      <TableHead className="min-w-[110px] font-semibold text-foreground">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((trx) => {
                      const d = new Date(trx.created_at);
                      return (
                        <TableRow
                          key={trx.id}
                          className="cursor-pointer hover:bg-sky-50/50 transition-colors"
                          onClick={() => router.push(`/membership/riwayat-transaksi/${trx.id}`)}
                        >
                          <TableCell>
                            <p className="text-sm font-medium">{format(d, "dd MMM yy", { locale: idLocale })}</p>
                            <p className="text-xs text-muted-foreground">{format(d, "HH:mm", { locale: idLocale })} WIB</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{trx.user_name}</p>
                            <p className="text-[11px] text-muted-foreground">{trx.user_email}</p>
                          </TableCell>
                          <TableCell><ChangeTypeBadge type={trx.change_type} /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <PlanBadge plan={trx.from_plan} />
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <PlanBadge plan={trx.to_plan} />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="font-semibold text-sm">{formatCurrency(trx.total)}</p>
                          </TableCell>
                          <TableCell><PrimaryStatusBadge status={trx.primary_status} /></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={(e) => { e.stopPropagation(); router.push(`/membership/riwayat-transaksi/${trx.id}`); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <RextraTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
              itemsPerPageOptions={[10, 20, 50]}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
