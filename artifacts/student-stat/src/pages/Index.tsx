import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ExportDataDialog } from "@/components/design-system/ExportDataDialog";
import { BulkDeleteDialog } from "@/components/design-system/BulkDeleteDialog";
import { SingleDeleteDialog } from "@/components/design-system/SingleDeleteDialog";
import { TestDetailModal } from "@/components/kenali-diri/TestDetailModal";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Sample data
const sampleData = [
  { id: "KD-001", name: "Budi Santoso", category: "Tes Profil Karier", status: "Selesai", result: "RIA", startDate: "2025-12-18", endDate: "2025-12-18" },
  { id: "KD-002", name: "Siti Rahayu", category: "Tes Profil Karier", status: "Selesai", result: "SEC", startDate: "2025-12-18", endDate: "2025-12-18" },
  { id: "KD-003", name: "Ahmad Wijaya", category: "Tes Profil Karier", status: "Sedang Berjalan", result: "-", startDate: "2025-12-17", endDate: "-" },
  { id: "KD-004", name: "Dewi Lestari", category: "Tes Profil Karier", status: "Selesai", result: "AIR", startDate: "2025-12-17", endDate: "2025-12-17" },
  { id: "KD-005", name: "Rizky Pratama", category: "Tes Profil Karier", status: "Dihentikan", result: "-", startDate: "2025-12-16", endDate: "2025-12-16" },
  { id: "KD-006", name: "Anisa Putri", category: "Tes Profil Karier", status: "Selesai", result: "CRE", startDate: "2025-12-16", endDate: "2025-12-16" },
  { id: "KD-007", name: "Fajar Nugroho", category: "Tes Profil Karier", status: "Selesai", result: "IAS", startDate: "2025-12-15", endDate: "2025-12-15" },
  { id: "KD-008", name: "Rina Marlina", category: "Tes Profil Karier", status: "Sedang Berjalan", result: "-", startDate: "2025-12-15", endDate: "-" },
  { id: "KD-009", name: "Hendro Kusuma", category: "Tes Profil Karier", status: "Selesai", result: "ESC", startDate: "2025-12-14", endDate: "2025-12-14" },
  { id: "KD-010", name: "Maya Sari", category: "Tes Profil Karier", status: "Selesai", result: "RCS", startDate: "2025-12-14", endDate: "2025-12-14" },
  { id: "KD-011", name: "Yoga Permana", category: "Tes Profil Karier", status: "Dihentikan", result: "-", startDate: "2025-12-13", endDate: "2025-12-13" },
  { id: "KD-012", name: "Lina Kartika", category: "Tes Profil Karier", status: "Selesai", result: "ARI", startDate: "2025-12-13", endDate: "2025-12-13" },
];

const Index = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<typeof sampleData[0] | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("semua");
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  
  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalData = 120;

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...sampleData];
    
    if (searchQuery) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeTab !== "semua") {
      data = data.filter(item => {
        if (activeTab === "selesai") return item.status === "Selesai";
        if (activeTab === "berjalan") return item.status === "Sedang Berjalan";
        if (activeTab === "dihentikan") return item.status === "Dihentikan";
        return true;
      });
    }
    
    if (categoryFilter && categoryFilter !== "all") {
      data = data.filter(item => item.category === categoryFilter);
    }
    
    if (sortBy) {
      switch (sortBy) {
        case "name-asc":
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          data.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "start-date":
          data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          break;
        case "end-date":
          data.sort((a, b) => {
            if (a.endDate === "-") return 1;
            if (b.endDate === "-") return -1;
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
          });
          break;
      }
    }
    
    return data;
  }, [searchQuery, categoryFilter, sortBy, activeTab]);

  const paginatedData = filteredData.slice(0, itemsPerPage);
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleDelete = (name: string) => {
    setDeleteItemName(name);
    setSingleDeleteDialogOpen(true);
  };

  const handleViewDetail = (item: typeof sampleData[0]) => {
    setSelectedDetailItem(item);
    setDetailModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Sedang Berjalan":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Dihentikan":
        return "bg-red-50 text-red-500 border border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const tabs = [
    { id: "semua", label: "Semua Data" },
    { id: "selesai", label: "Selesai" },
    { id: "berjalan", label: "Sedang Berjalan" },
    { id: "dihentikan", label: "Dihentikan" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                Riwayat Tes Kenali Diri
              </h1>
              <span className="inline-flex items-center justify-center h-6 min-w-[40px] px-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {totalData}
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Menyajikan data hasil tes Kenali Diri user <span className="font-medium text-primary">REXTRA</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Hapus Data Massal</span>
              <span className="sm:hidden">Hapus</span>
            </Button>
            <Button size="sm" onClick={() => setExportDialogOpen(true)} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Ekspor Data</span>
              <span className="sm:hidden">Ekspor</span>
            </Button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Left: Counter and Selected */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Total <span className="font-medium text-foreground">{filteredData.length}</span> data
            </span>
            {selectedItems.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                {selectedItems.length} dipilih
              </span>
            )}
          </div>

          {/* Right: Search and Filter Toggle */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-full md:w-[220px] bg-background border-input"
              />
            </div>

            <Button 
              variant={filterPanelOpen ? "default" : "outline"} 
              size="sm" 
              className="h-9 gap-2"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {filterPanelOpen && (
          <div className="bg-background rounded-xl border border-border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Rentang Tanggal
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-9 flex-1 justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yy") : "Mulai"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-9 flex-1 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yy") : "Selesai"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover border-border shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Kategori Tes
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Pilih Kategori Tes" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="profil-karier">Tes Profil Karier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Result Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Hasil Tes
                </label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Pilih Hasil Tes" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Semua Hasil</SelectItem>
                    <SelectItem value="RIA">RIA</SelectItem>
                    <SelectItem value="SEC">SEC</SelectItem>
                    <SelectItem value="AIR">AIR</SelectItem>
                    <SelectItem value="CRE">CRE</SelectItem>
                    <SelectItem value="IAS">IAS</SelectItem>
                    <SelectItem value="ESC">ESC</SelectItem>
                    <SelectItem value="RCS">RCS</SelectItem>
                    <SelectItem value="ARI">ARI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Urutkan Berdasarkan
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Urutkan berdasarkan" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="name-asc">Nama User A-Z</SelectItem>
                    <SelectItem value="name-desc">Nama User Z-A</SelectItem>
                    <SelectItem value="start-date">Tanggal Mulai</SelectItem>
                    <SelectItem value="end-date">Tanggal Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCategoryFilter("");
                  setResultFilter("");
                  setSortBy("");
                }}
              >
                Reset Filter
              </Button>
              <Button size="sm" onClick={() => setFilterPanelOpen(false)}>
                Terapkan
              </Button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left w-10 md:w-12">
                    <Checkbox
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left min-w-[80px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      ID Tes
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left min-w-[140px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      Nama
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left min-w-[120px] hidden md:table-cell">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Kategori
                    </span>
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left min-w-[100px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-left min-w-[70px]">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Hasil
                    </span>
                  </th>
                  <th className="px-3 md:px-4 py-3 md:py-4 text-center w-20 md:w-24">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Aksi
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/30 transition-colors",
                      selectedItems.includes(item.id) && "bg-primary/5"
                    )}
                  >
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">
                        #{item.id}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className="text-xs md:text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 hidden md:table-cell">
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs font-medium",
                        getStatusStyle(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className="text-xs md:text-sm font-semibold text-foreground">
                        {item.result}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 md:h-8 md:w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                          onClick={() => handleViewDetail(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 md:h-8 md:w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => handleDelete(item.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-3 md:px-4 py-3 md:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Left: Items per page */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Tampilkan</span>
              <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                <SelectTrigger className="w-[60px] md:w-[65px] h-7 md:h-8 bg-background text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>/ {totalData}</span>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 md:h-9 px-3 md:px-5 gap-1 md:gap-2 rounded-full text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Next Page</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Page indicator */}
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="text-muted-foreground">Page</span>
              <Input 
                type="text"
                value={currentPage.toString().padStart(2, '0')}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                  }
                }}
                className="w-10 md:w-12 h-7 md:h-8 text-center bg-background text-xs md:text-sm"
              />
              <span className="text-muted-foreground">/ {totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDataDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      <BulkDeleteDialog 
        open={bulkDeleteDialogOpen} 
        onOpenChange={setBulkDeleteDialogOpen} 
        dataCount={selectedItems.length || 2000} 
      />
      <SingleDeleteDialog
        open={singleDeleteDialogOpen}
        onOpenChange={setSingleDeleteDialogOpen}
        userName={deleteItemName}
      />
      <TestDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        testData={selectedDetailItem ? {
          id: selectedDetailItem.id,
          userName: selectedDetailItem.name,
          startTime: `10.00 WIB ${selectedDetailItem.startDate}`,
          endTime: selectedDetailItem.endDate !== "-" ? `11.00 WIB ${selectedDetailItem.endDate}` : "-",
          status: selectedDetailItem.status as "Selesai" | "Sedang Berjalan" | "Dihentikan",
          result: `Profil Kode ${selectedDetailItem.result}`,
        } : undefined}
      />
    </DashboardLayout>
  );
};

export default Index;
