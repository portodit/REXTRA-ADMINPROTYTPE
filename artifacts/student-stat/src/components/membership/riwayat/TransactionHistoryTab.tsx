import { useState, useMemo } from "react";
import { Search, Download, RefreshCw, AlertCircle, Calendar, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionTable } from "./TransactionTable";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";
import { generateMockTransactions } from "./mockData";
import { Transaction } from "./types";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface TransactionHistoryTabProps {
  demoState: "loading" | "data" | "empty" | "error";
}

export function TransactionHistoryTab({ demoState }: TransactionHistoryTabProps) {
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const mockTransactions = useMemo(() => generateMockTransactions(), []);
  const itemsPerPage = 50;

  const filteredTransactions = useMemo(() => {
    if (demoState !== "data") return [];
    
    let filtered = [...mockTransactions];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.user.name.toLowerCase().includes(searchLower) ||
          t.user.email.toLowerCase().includes(searchLower) ||
          t.user.userId.toLowerCase().includes(searchLower) ||
          t.referenceId.toLowerCase().includes(searchLower)
      );
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((t) => t.eventType === eventTypeFilter);
    }

    // Payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter((t) => t.paymentStatus === paymentStatusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter((t) => t.duration.includes(durationFilter));
    }

    // Date range filter
    if (dateRange?.from) {
      filtered = filtered.filter((t) => t.date >= dateRange.from!);
    }
    if (dateRange?.to) {
      filtered = filtered.filter((t) => t.date <= dateRange.to!);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case "highest":
        filtered.sort((a, b) => b.totalPaid - a.totalPaid);
        break;
      case "lowest":
        filtered.sort((a, b) => a.totalPaid - b.totalPaid);
        break;
    }

    return filtered;
  }, [mockTransactions, search, eventTypeFilter, paymentStatusFilter, categoryFilter, durationFilter, dateRange, sortBy, demoState]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const hasActiveFilters = search || eventTypeFilter !== "all" || paymentStatusFilter !== "all" || categoryFilter !== "all" || durationFilter !== "all" || dateRange;

  const resetFilters = () => {
    setSearch("");
    setEventTypeFilter("all");
    setPaymentStatusFilter("all");
    setCategoryFilter("all");
    setDurationFilter("all");
    setSortBy("newest");
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = ["Waktu", "User", "User ID", "Event", "Status", "Durasi", "Total Bayar", "Status Pembayaran", "Reference ID", "Token", "Poin"];
    const rows = filteredTransactions.map((t) => [
      format(t.date, "dd/MM/yyyy HH:mm", { locale: id }),
      t.user.name,
      t.user.userId,
      t.eventType,
      `${t.statusBefore} → ${t.statusAfter}`,
      t.duration,
      t.totalPaid,
      t.paymentStatus,
      t.referenceId,
      t.tokenGiven,
      t.pointsGiven,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `riwayat-transaksi-${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor");
  };

  // Loading State
  if (demoState === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border border-border rounded-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 m-2" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (demoState === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50 rounded-full p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tidak dapat memuat data
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Terjadi kesalahan saat memuat data transaksi. Silakan coba lagi.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  // Empty State
  if (demoState === "empty" || (demoState === "data" && filteredTransactions.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-slate-100 rounded-full p-4 mb-4">
            <Filter className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {hasActiveFilters ? "Tidak ada data sesuai filter" : "Belum ada transaksi"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {hasActiveFilters
              ? "Coba ubah kriteria pencarian atau filter untuk melihat hasil lainnya."
              : "Data transaksi akan muncul di sini setelah ada aktivitas membership."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Riwayat Transaksi</h2>
        <p className="text-sm text-muted-foreground">
          Ledger transaksi membership untuk audit dan penelusuran finansial
        </p>
      </div>

      {/* Control Bar - Horizontal Dropdowns */}
      <div className="flex flex-col gap-4">
        {/* First row: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Purchase">Purchase</SelectItem>
              <SelectItem value="Renewal">Renewal</SelectItem>
              <SelectItem value="Upgrade">Upgrade</SelectItem>
              <SelectItem value="Downgrade">Downgrade</SelectItem>
              <SelectItem value="Trial Start">Trial Start</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Refund">Refund</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status Bayar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Berhasil">Berhasil</SelectItem>
              <SelectItem value="Menunggu">Menunggu</SelectItem>
              <SelectItem value="Gagal">Gagal</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Refund">Refund</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="REXTRA Club">REXTRA Club</SelectItem>
              <SelectItem value="Trial Club">Trial Club</SelectItem>
              <SelectItem value="Non-Club">Non-Club</SelectItem>
            </SelectContent>
          </Select>

          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Durasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Durasi</SelectItem>
              <SelectItem value="1 bulan">1 bulan</SelectItem>
              <SelectItem value="3 bulan">3 bulan</SelectItem>
              <SelectItem value="6 bulan">6 bulan</SelectItem>
              <SelectItem value="12 bulan">12 bulan</SelectItem>
              <SelectItem value="hari">Trial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="highest">Total Tertinggi</SelectItem>
              <SelectItem value="lowest">Total Terendah</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Second row: Search + Export */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari user, invoice, atau reference ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable 
        transactions={paginatedTransactions} 
        onViewDetail={setSelectedTransaction} 
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} dari {filteredTransactions.length}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Detail Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}