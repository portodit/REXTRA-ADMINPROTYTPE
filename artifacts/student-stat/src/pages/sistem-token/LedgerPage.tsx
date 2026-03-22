import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Search,
  Calendar as CalendarIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  Copy,
  Download,
  AlertTriangle,
  FileText,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Info,
} from "lucide-react";
import { RextraTableHeader } from "@/components/shared/RextraTableHeader";
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";

// Types
type MovementType = "in" | "out";
type SourceType = "top_up" | "membership" | "konsumsi" | "refund" | "koreksi" | "expired";

interface LedgerEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  source: SourceType;
  movement: MovementType;
  tokenChange: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  description: string;
  // Source-specific details
  sourceDetails?: {
    invoiceId?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    membershipPlan?: string;
    membershipPeriod?: string;
    membershipEvent?: string;
    memberId?: string;
    featureName?: string;
    entitlementKey?: string;
    costToken?: number;
    requestId?: string;
    correctionType?: string;
    correctionReason?: string;
    operator?: string;
    ticketRef?: string;
    originalTransaction?: string;
    refundReason?: string;
    expiredSource?: string;
  };
}

// Mock data
const generateMockData = (): LedgerEntry[] => {
  const sources: SourceType[] = ["top_up", "membership", "konsumsi", "refund", "koreksi", "expired"];
  const users = [
    { id: "USR-0123", name: "Budi Santoso" },
    { id: "USR-0456", name: "Ani Wijaya" },
    { id: "USR-0789", name: "Candra Pratama" },
    { id: "USR-0321", name: "Dewi Lestari" },
    { id: "USR-0654", name: "Eko Prasetyo" },
    { id: "USR-0987", name: "Fitri Handayani" },
  ];

  const entries: LedgerEntry[] = [];
  let balance = 500;

  for (let i = 0; i < 150; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const isIncoming = ["top_up", "membership", "refund", "koreksi"].includes(source) && (source !== "koreksi" || Math.random() > 0.3);
    const tokenChange = Math.floor(Math.random() * 100) + 10;
    const balanceBefore = balance;
    balance = isIncoming ? balance + tokenChange : Math.max(0, balance - tokenChange);

    let sourceDetails: LedgerEntry["sourceDetails"] = {};
    let description = "";
    let referenceId = "";

    switch (source) {
      case "top_up":
        referenceId = `INV-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(5, "0")}`;
        description = `Top Up Bundle — ${tokenChange} Token`;
        sourceDetails = {
          invoiceId: referenceId,
          paymentMethod: ["QRIS - GoPay", "QRIS - OVO", "Bank Transfer - BCA", "E-Wallet - DANA"][Math.floor(Math.random() * 4)],
          paymentStatus: "Berhasil",
        };
        break;
      case "membership":
        referenceId = `MBR-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(4, "0")}`;
        description = `Membership Benefit — Pro Plan`;
        sourceDetails = {
          membershipPlan: ["Basic", "Pro", "Max"][Math.floor(Math.random() * 3)],
          membershipPeriod: ["1 Bulan", "6 Bulan", "12 Bulan"][Math.floor(Math.random() * 3)],
          membershipEvent: ["Aktivasi", "Perpanjangan", "Upgrade"][Math.floor(Math.random() * 3)],
          memberId: referenceId,
        };
        break;
      case "konsumsi":
        referenceId = `REQ-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(5, "0")}`;
        const features = ["CV Generator", "Cover Letter", "Interview Prep", "Portfolio Builder"];
        const feature = features[Math.floor(Math.random() * features.length)];
        description = `Konsumsi Fitur — ${feature}`;
        sourceDetails = {
          featureName: feature,
          entitlementKey: feature.toLowerCase().replace(" ", "_") + ".use",
          costToken: tokenChange,
          requestId: referenceId,
        };
        break;
      case "refund":
        referenceId = `RFD-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(4, "0")}`;
        description = `Refund — Pembatalan Pembelian`;
        sourceDetails = {
          originalTransaction: `TOP-${format(new Date(Date.now() - 86400000 * 5), "yyyyMMdd")}-${String(Math.floor(Math.random() * 1000)).padStart(5, "0")}`,
          refundReason: "Pembatalan pembelian paket",
          operator: "Support Team",
        };
        break;
      case "koreksi":
        referenceId = `COR-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(4, "0")}`;
        description = isIncoming ? `Koreksi Admin — Kompensasi Insiden` : `Koreksi Admin — Penyesuaian Saldo`;
        sourceDetails = {
          correctionType: isIncoming ? "Tambah" : "Kurangi",
          correctionReason: isIncoming ? "Kompensasi untuk bug fitur CV Generator yang menyebabkan konsumsi token berlebih" : "Penyesuaian saldo berdasarkan audit internal",
          operator: "Admin Eko",
          ticketRef: `TKT-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        };
        break;
      case "expired":
        referenceId = `EXP-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(4, "0")}`;
        description = `Token Expired — Otomatis Sistem`;
        sourceDetails = {
          expiredSource: "Top Up (3 bulan yang lalu)",
        };
        break;
    }

    entries.push({
      id: `LED-${format(new Date(), "yyyyMMdd")}-${String(i).padStart(5, "0")}`,
      timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 24),
      userId: user.id,
      userName: user.name,
      source,
      movement: isIncoming ? "in" : "out",
      tokenChange: isIncoming ? tokenChange : -tokenChange,
      balanceBefore,
      balanceAfter: balance,
      referenceId,
      description,
      sourceDetails,
    });
  }

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const mockData = generateMockData();

// Source badge styling
const getSourceBadge = (source: SourceType) => {
  const styles: Record<SourceType, { bg: string; text: string; label: string }> = {
    top_up: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Top Up" },
    membership: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", label: "Membership" },
    konsumsi: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", label: "Konsumsi" },
    refund: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", label: "Refund" },
    koreksi: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "Koreksi" },
    expired: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", label: "Expired" },
  };
  return styles[source];
};

export default function SistemTokenLedger() {
  // View states
  const [viewState, setViewState] = useState<"loading" | "data" | "empty" | "error">("data");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("30");
  const [movementFilter, setMovementFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Copy to clipboard
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      description: text,
      duration: 2000,
    });
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...mockData];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      data = data.filter(
        (entry) =>
          entry.userName.toLowerCase().includes(query) ||
          entry.userId.toLowerCase().includes(query) ||
          entry.referenceId.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query)
      );
    }

    // Period filter
    if (periodFilter !== "custom") {
      const days = parseInt(periodFilter);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      data = data.filter((entry) => entry.timestamp >= cutoff);
    } else if (dateRange.from && dateRange.to) {
      data = data.filter(
        (entry) => entry.timestamp >= dateRange.from! && entry.timestamp <= dateRange.to!
      );
    }

    // Movement filter
    if (movementFilter !== "all") {
      data = data.filter((entry) => entry.movement === movementFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      data = data.filter((entry) => entry.source === sourceFilter);
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case "token_high":
        data.sort((a, b) => Math.abs(b.tokenChange) - Math.abs(a.tokenChange));
        break;
      case "token_low":
        data.sort((a, b) => Math.abs(a.tokenChange) - Math.abs(b.tokenChange));
        break;
      case "user_az":
        data.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      case "user_za":
        data.sort((a, b) => b.userName.localeCompare(a.userName));
        break;
      default:
        data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return data;
  }, [debouncedSearch, periodFilter, dateRange, movementFilter, sourceFilter, sortBy]);

  // Export data to CSV - declared after filteredData
  const handleExportData = useCallback(() => {
    const headers = ["Waktu", "User", "User ID", "Sumber", "Pergerakan", "Perubahan Token", "Saldo Sebelum", "Saldo Sesudah", "Referensi", "Keterangan"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(entry => [
        format(entry.timestamp, "dd/MM/yyyy HH:mm:ss"),
        `"${entry.userName}"`,
        entry.userId,
        getSourceBadge(entry.source).label,
        entry.movement === "in" ? "Masuk" : "Keluar",
        entry.tokenChange,
        entry.balanceBefore,
        entry.balanceAfter,
        entry.referenceId,
        `"${entry.description}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ledger-token-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`;
    link.click();

    toast({
      title: "Export berhasil",
      description: `${filteredData.length} entri telah diexport ke CSV`,
      duration: 3000,
    });
  }, [filteredData]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPeriodFilter("90");
    setMovementFilter("all");
    setSourceFilter("all");
    setSortBy("newest");
    setDateRange({});
    setCurrentPage(1);
  };

  // Open detail drawer
  const handleOpenDetail = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  // Render loading state
  if (viewState === "loading") {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-16 w-full" />
          {/* Control bar skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          {/* Table skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>›</span>
            <span>Sistem Token</span>
            <span>›</span>
            <span className="font-medium text-foreground">Ledger Token</span>
          </nav>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ledger Token</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pantau pergerakan saldo token secara transparan dan dapat ditelusuri.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>

          {/* Callout */}
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Catatan Penting:</strong> Ledger bersifat audit trail; entri tidak diedit dan tidak dihapus. Koreksi saldo dilakukan melalui entri baru dengan alasan dan jejak operator.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Control Bar */}
        <div className="space-y-4">
          {/* Row 1: Search & Period */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari user, invoice/reference ID, atau entitlement key…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Debounce
                  setTimeout(() => setDebouncedSearch(e.target.value), 300);
                }}
                className="pl-10"
              />
            </div>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[180px] justify-start">
                  <CalendarIcon className="h-4 w-4" />
                  {periodFilter === "custom" && dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`
                    : periodFilter === "7"
                    ? "7 Hari Terakhir"
                    : periodFilter === "30"
                    ? "30 Hari Terakhir"
                    : "90 Hari Terakhir"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "7", label: "7 Hari" },
                      { value: "30", label: "30 Hari" },
                      { value: "90", label: "90 Hari" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={periodFilter === option.value ? "default" : "outline"}
                        onClick={() => {
                          setPeriodFilter(option.value);
                          setDateRange({});
                          setIsDatePickerOpen(false);
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Rentang Kustom</p>
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                          setPeriodFilter("custom");
                          setIsDatePickerOpen(false);
                        }
                      }}
                      numberOfMonths={1}
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Row 2: Filters & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <Select value={movementFilter} onValueChange={setMovementFilter}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Pergerakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="in">Masuk</SelectItem>
                <SelectItem value="out">Keluar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sumber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="top_up">Top Up</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="konsumsi">Konsumsi Fitur</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="koreksi">Koreksi Admin</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="token_high">Token Terbesar</SelectItem>
                <SelectItem value="token_low">Token Terkecil</SelectItem>
                <SelectItem value="user_az">User A–Z</SelectItem>
                <SelectItem value="user_za">User Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Area */}
        {viewState === "error" ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gagal memuat data</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Terjadi kesalahan saat memuat riwayat token. Silakan coba lagi.
              </p>
              <Button onClick={() => setViewState("data")} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        ) : filteredData.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Belum ada pergerakan token</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Coba perluas periode pencarian atau ubah filter yang diterapkan
              </p>
              <Button onClick={handleResetFilters}>Reset Filter</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Table */}
            <div className="bg-card border border-border rounded-2xl">
              <RextraTableHeader
                title="Riwayat Pergerakan Token"
                subtitle={`Menampilkan ${paginatedData.length} dari ${filteredData.length.toLocaleString()} entri`}
                actions={
                  <Button
                    size="sm"
                    onClick={handleExportData}
                    className="gap-1.5 h-9 text-xs border border-primary bg-primary/5 hover:bg-primary/10 text-primary shadow-none"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                }
              />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Waktu</TableHead>
                      <TableHead className="min-w-[160px]">User</TableHead>
                      <TableHead className="min-w-[100px]">Sumber</TableHead>
                      <TableHead className="min-w-[100px] text-right">±Token</TableHead>
                      <TableHead className="min-w-[80px] text-right">Sebelum</TableHead>
                      <TableHead className="min-w-[80px] text-right">Sesudah</TableHead>
                      <TableHead className="w-[80px] text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((entry) => {
                      const sourceBadge = getSourceBadge(entry.source);
                      return (
                        <TableRow 
                          key={entry.id} 
                          className="group cursor-pointer hover:bg-sky-50/50"
                          onClick={() => handleOpenDetail(entry)}
                        >
                          <TableCell className="font-mono text-xs">
                            {format(entry.timestamp, "dd/MM/yy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{entry.userName}</p>
                              <p className="text-xs text-muted-foreground">{entry.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={cn("font-normal", sourceBadge.bg, sourceBadge.text)}>
                              {sourceBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {entry.movement === "in" ? (
                                <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <ArrowDownCircle className="h-4 w-4 text-destructive" />
                              )}
                              <span className={cn("font-semibold tabular-nums", entry.movement === "in" ? "text-emerald-600" : "text-destructive")}>
                                {entry.movement === "in" ? "+" : ""}{entry.tokenChange}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground tabular-nums">
                            {entry.balanceBefore}
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">
                            {entry.balanceAfter}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(entry);
                              }}
                              className="text-primary hover:text-primary"
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <RextraTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
                itemsPerPageOptions={[25, 50, 100]}
              />
            </div>

          </>
        )}

        {/* Detail Drawer - Modern Design */}
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="w-full sm:max-w-[480px] p-0 overflow-hidden flex flex-col bg-background">
            {selectedEntry && (
              <>
                {/* Modern Minimal Header */}
                <SheetHeader className="px-6 py-5 border-b bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          selectedEntry.movement === "in"
                            ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30"
                            : "bg-gradient-to-br from-rose-500/20 to-rose-600/10 ring-1 ring-rose-500/30"
                        )}
                      >
                        {selectedEntry.movement === "in" ? (
                          <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>
                      <div>
                        <SheetTitle className="text-base font-semibold">Detail Ledger</SheetTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(selectedEntry.timestamp, "dd MMM yyyy, HH:mm", { locale: id })} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Token Change Hero */}
                  <div className="px-6 py-8 bg-gradient-to-b from-muted/50 to-transparent">
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-4xl font-bold tracking-tight",
                          selectedEntry.movement === "in" 
                            ? "text-emerald-600 dark:text-emerald-400" 
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {selectedEntry.movement === "in" ? "+" : ""}{selectedEntry.tokenChange.toLocaleString()} Token
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "mt-3 px-3 py-1 font-medium",
                          selectedEntry.movement === "in" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" 
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        )}
                      >
                        {getSourceBadge(selectedEntry.source).label}
                      </Badge>
                    </div>
                    
                    {/* Balance Cards */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="relative overflow-hidden rounded-xl bg-card p-4 ring-1 ring-border/50 shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-muted-foreground/20 rounded-l-xl" />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sebelum</p>
                        <p className="text-xl font-bold mt-1">{selectedEntry.balanceBefore.toLocaleString()}</p>
                      </div>
                      <div className="relative overflow-hidden rounded-xl bg-card p-4 ring-1 ring-border/50 shadow-sm">
                        <div className={cn(
                          "absolute top-0 left-0 w-1 h-full rounded-l-xl",
                          selectedEntry.movement === "in" ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sesudah</p>
                        <p className="text-xl font-bold mt-1">{selectedEntry.balanceAfter.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="px-6 pb-6">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 h-11 p-1 bg-muted/60 rounded-xl">
                        <TabsTrigger value="info" className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                          Info
                        </TabsTrigger>
                        <TabsTrigger value="source" className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                          Detail Sumber
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="info" className="mt-5 space-y-4">
                        {/* Modern Info Grid */}
                        <div className="rounded-xl border bg-card overflow-hidden divide-y">
                          {[
                            { label: "ID Ledger", value: selectedEntry.id, copyable: true },
                            { label: "Waktu", value: format(selectedEntry.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: id }) + " WIB" },
                            { label: "User", value: `${selectedEntry.userName} (${selectedEntry.userId})` },
                            { label: "Referensi", value: selectedEntry.referenceId, copyable: true },
                            { label: "Keterangan", value: selectedEntry.description },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                              <span className="text-sm text-muted-foreground">{item.label}</span>
                              <span className="text-sm font-medium flex items-center gap-2 text-right max-w-[60%]">
                                <span className="truncate">{item.value}</span>
                                {item.copyable && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleCopy(item.value)}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="source" className="mt-5 space-y-4">
                        {selectedEntry.source === "top_up" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Invoice", value: selectedEntry.sourceDetails?.invoiceId || "-" },
                                { label: "Metode Bayar", value: selectedEntry.sourceDetails?.paymentMethod || "-" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium">{item.value}</span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0 font-medium">
                                  ✓ {selectedEntry.sourceDetails?.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full h-11 gap-2 rounded-xl font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                              <ExternalLink className="h-4 w-4" />
                              Lihat Transaksi Top Up
                            </Button>
                          </>
                        )}

                        {selectedEntry.source === "membership" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Paket", value: selectedEntry.sourceDetails?.membershipPlan || "-" },
                                { label: "Periode", value: selectedEntry.sourceDetails?.membershipPeriod || "-" },
                                { label: "Event", value: selectedEntry.sourceDetails?.membershipEvent || "-" },
                                { label: "ID Member", value: selectedEntry.sourceDetails?.memberId || "-" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                            <Button variant="outline" className="w-full h-11 gap-2 rounded-xl font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                              <ExternalLink className="h-4 w-4" />
                              Lihat Detail Membership
                            </Button>
                          </>
                        )}

                        {selectedEntry.source === "konsumsi" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Fitur", value: selectedEntry.sourceDetails?.featureName || "-" },
                                { label: "Entitlement", value: selectedEntry.sourceDetails?.entitlementKey || "-" },
                                { label: "Token Terpakai", value: `${selectedEntry.sourceDetails?.costToken || 0} token` },
                                { label: "Request ID", value: selectedEntry.sourceDetails?.requestId || "-" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium font-mono text-xs">{item.value}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border border-dashed text-muted-foreground">
                              <Info className="h-4 w-4 shrink-0" />
                              <span className="text-sm">Log Konsumsi Fitur — Coming Soon</span>
                            </div>
                          </>
                        )}

                        {selectedEntry.source === "koreksi" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Jenis Koreksi", value: selectedEntry.sourceDetails?.correctionType || "-" },
                                { label: "Operator", value: selectedEntry.sourceDetails?.operator || "-" },
                                { label: "Ticket Ref", value: selectedEntry.sourceDetails?.ticketRef || "-" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                            {selectedEntry.sourceDetails?.correctionReason && (
                              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl ring-1 ring-amber-200 dark:ring-amber-800/50">
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">Alasan Koreksi</p>
                                <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                                  {selectedEntry.sourceDetails.correctionReason}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {selectedEntry.source === "refund" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Transaksi Asal", value: selectedEntry.sourceDetails?.originalTransaction || "-" },
                                { label: "Alasan Refund", value: selectedEntry.sourceDetails?.refundReason || "-" },
                                { label: "Operator", value: selectedEntry.sourceDetails?.operator || "-" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                            <Button variant="outline" className="w-full h-11 gap-2 rounded-xl font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                              <ExternalLink className="h-4 w-4" />
                              Lihat Transaksi Asal
                            </Button>
                          </>
                        )}

                        {selectedEntry.source === "expired" && (
                          <>
                            <div className="rounded-xl border bg-card overflow-hidden divide-y">
                              {[
                                { label: "Tipe", value: "Token Expired" },
                                { label: "Sumber Token", value: selectedEntry.sourceDetails?.expiredSource || "-" },
                                { label: "Proses", value: "Otomatis Sistem" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-medium">{item.value}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl text-muted-foreground">
                              <Info className="h-4 w-4 shrink-0" />
                              <span className="text-sm">Token kadaluarsa dihapus otomatis oleh sistem</span>
                            </div>
                          </>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
