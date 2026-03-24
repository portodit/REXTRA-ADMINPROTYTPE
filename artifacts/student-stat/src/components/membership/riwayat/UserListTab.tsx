import { useRouter } from 'next/navigation'
import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, RefreshCw, AlertCircle, X, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SummaryChips, SummaryFilter } from "./SummaryChips";
import { UserCard } from "./UserCard";
import { UserTableView } from "./UserTableView";
import { generateMockUsers } from "./mockData";
import { MemberUser } from "./types";
import { RextraTablePagination } from "@/components/design-system/RextraTablePagination";

// Map mock user IDs to database membership UUIDs
const mockToDbId: Record<string, string> = {
  "1": "a1000000-0000-0000-0000-000000000001",
  "2": "a1000000-0000-0000-0000-000000000002",
  "3": "a1000000-0000-0000-0000-000000000003",
  "4": "a1000000-0000-0000-0000-000000000004",
  "5": "a1000000-0000-0000-0000-000000000005",
  "6": "a1000000-0000-0000-0000-000000000006",
};

type ViewMode = "grid" | "table";

interface UserListTabProps {
  demoState: "loading" | "data" | "empty" | "error";
}

export function UserListTab({ demoState }: UserListTabProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [summaryFilter, setSummaryFilter] = useState<SummaryFilter>("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [validityFilter, setValidityFilter] = useState("all");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetail = (user: MemberUser) => {
    const dbId = mockToDbId[user.id];
    if (dbId) {
      router.push(`/membership/riwayat-langganan/${dbId}`);
    }
  };

  const mockUsers = useMemo(() => generateMockUsers(), []);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredUsers = useMemo(() => {
    if (demoState !== "data") return [];
    
    let filtered = [...mockUsers];

    // Search
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.userId.toLowerCase().includes(s)
      );
    }

    // Summary card filter (club or expiring)
    if (summaryFilter === "REXTRA Club" || summaryFilter === "Trial Club" || summaryFilter === "Non-Club") {
      filtered = filtered.filter((u) => u.category === summaryFilter);
    } else if (summaryFilter === "expiring") {
      filtered = filtered.filter((u) => u.validityStatus === "Akan berakhir");
    }

    // Tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter((u) => u.tier === tierFilter);
    }

    // Validity filter
    if (validityFilter !== "all") {
      filtered = filtered.filter((u) => u.validityStatus === validityFilter);
    }

    // Subscription history filter
    if (historyFilter !== "all") {
      filtered = filtered.filter((u) => u.subscriptionHistory === historyFilter);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0));
        break;
      case "expiring":
        filtered.sort((a, b) => a.remainingDays - b.remainingDays);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  }, [mockUsers, search, summaryFilter, tierFilter, validityFilter, historyFilter, sortBy, demoState]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const summaryData = useMemo(() => ({
    totalUsers: mockUsers.length,
    rextraClub: mockUsers.filter((u) => u.category === "REXTRA Club").length,
    trialClub: mockUsers.filter((u) => u.category === "Trial Club").length,
    nonClub: mockUsers.filter((u) => u.category === "Non-Club").length,
    expiring: mockUsers.filter((u) => u.validityStatus === "Akan berakhir").length,
  }), [mockUsers]);

  const hasActiveFilters = summaryFilter !== "all" || tierFilter !== "all" || validityFilter !== "all" || historyFilter !== "all" || sortBy !== "recent" || search !== "";

  const resetFilters = () => {
    setSearch("");
    setSummaryFilter("all");
    setTierFilter("all");
    setValidityFilter("all");
    setHistoryFilter("all");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const handleSummaryFilterClick = (filter: SummaryFilter) => {
    setSummaryFilter(filter === summaryFilter ? "all" : filter);
    setCurrentPage(1);
  };

  // Loading State
  if (demoState === "loading") {
    return (
      <div className="space-y-6">
        <SummaryChips isLoading />
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (demoState === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          Gagal memuat data
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          Terjadi kesalahan saat memuat data pengguna. Silakan coba lagi.
        </p>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="h-3.5 w-3.5" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  // Empty State (no data or no filter results)
  if (demoState === "empty" || (demoState === "data" && filteredUsers.length === 0)) {
    return (
      <div className="space-y-6">
        <SummaryChips 
          data={{ totalUsers: 0, rextraClub: 0, trialClub: 0, nonClub: 0, expiring: 0 }} 
          activeFilter={summaryFilter}
          onFilterClick={handleSummaryFilterClick}
        />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
            <UsersIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            {hasActiveFilters ? "Tidak ada data sesuai filter" : "Belum ada pengguna"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {hasActiveFilters
              ? "Coba ubah kriteria pencarian atau filter untuk melihat hasil lainnya."
              : "Data pengguna akan muncul di sini setelah ada yang terdaftar."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
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
        <h2 className="text-lg font-semibold text-foreground">Daftar Pengguna</h2>
        <p className="text-sm text-muted-foreground">
          Monitoring status membership dan riwayat langganan pengguna.
        </p>
      </div>

      {/* Summary Chips - clickable */}
      <SummaryChips 
        data={summaryData} 
        activeFilter={summaryFilter}
        onFilterClick={handleSummaryFilterClick}
      />

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tier</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Max">Max</SelectItem>
            </SelectContent>
          </Select>

          <Select value={validityFilter} onValueChange={(v) => { setValidityFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Akan berakhir">Akan berakhir (≤ 7 hari)</SelectItem>
              <SelectItem value="Berakhir">Berakhir</SelectItem>
            </SelectContent>
          </Select>

          <Select value={historyFilter} onValueChange={(v) => { setHistoryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Riwayat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="Pengguna Baru">Pengguna Baru</SelectItem>
              <SelectItem value="Langganan Pertama">Langganan Pertama</SelectItem>
              <SelectItem value="Pernah Berlangganan">Pernah Berlangganan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Terbaru</SelectItem>
              <SelectItem value="expiring">Berakhir paling dekat</SelectItem>
              <SelectItem value="name-asc">Nama A–Z</SelectItem>
              <SelectItem value="name-desc">Nama Z–A</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground gap-1">
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Right: Search + View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau User ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9"
            />
          </div>

          <div className="flex items-center border border-border rounded-lg p-1 bg-muted/30">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onViewDetail={() => handleViewDetail(user)}
            />
          ))}
        </div>
      ) : (
        <UserTableView users={paginatedUsers} onViewDetail={handleViewDetail} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <RextraTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
          itemsPerPageOptions={[6, 12, 24]}
        />
      )}
    </div>
  );
}
