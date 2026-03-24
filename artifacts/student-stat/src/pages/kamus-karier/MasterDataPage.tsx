import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Trash2, Download, AlertTriangle, Code, Palette, PenTool, Megaphone, Settings, BarChart3, FileText, Plus, ChevronsUpDown, Check, Bug, CheckCircle2, XCircle, Info, Pencil } from "lucide-react";
import { RextraTableHeader } from "@/components/design-system/RextraTableHeader";
import { RextraTablePagination } from "@/components/design-system/RextraTablePagination";
import { KategoriTab } from "@/components/kamus-karier/KategoriTab";
import { PerusahaanTab } from "@/components/kamus-karier/PerusahaanTab";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import noImageProfesi from "@/assets/no-image-profesi.png";

// Kelengkapan fields
const kelengkapanFields = [
  { key: "deskripsi", label: "Deskripsi" },
  { key: "tugas", label: "Tugas Utama" },
  { key: "kualifikasi", label: "Kualifikasi" },
  { key: "keterampilan", label: "Keterampilan" },
  { key: "prospekKarier", label: "Prospek Karier" },
  { key: "mediaTerkait", label: "Media Terkait" },
];

// Types
interface Profesi {
  id: string;
  nama: string;
  slug: string;
  alias?: string;
  image?: string;
  kategori: string;
  kategoriIcon: React.ElementType;
  subKategori: string;
  riasec: string;
  diperbarui: string;
  kelengkapan: Record<string, boolean>; // field key -> filled or not
}

// Mock data for profesi
const mockProfesiData: Profesi[] = [
  {
    id: "1",
    nama: "Software Engineer",
    slug: "/software-engineer",
    alias: "Pengembang Perangkat Lunak",
    kategori: "Engineering & Teknologi",
    kategoriIcon: Code,
    subKategori: "Backend Development",
    riasec: "IRC",
    diperbarui: "11 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: true, prospekKarier: true, mediaTerkait: true },
  },
  {
    id: "2",
    nama: "UI/UX Designer",
    slug: "/ui-ux-designer",
    alias: "Desainer Antarmuka",
    kategori: "Desain & Kreativitas",
    kategoriIcon: Palette,
    subKategori: "UI Design",
    riasec: "AIS",
    diperbarui: "10 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: false, prospekKarier: true, mediaTerkait: false },
  },
  {
    id: "3",
    nama: "Product Manager",
    slug: "/product-manager",
    kategori: "Bisnis & Manajemen",
    kategoriIcon: Settings,
    subKategori: "Product Management",
    riasec: "ECS",
    diperbarui: "09 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: false, keterampilan: false, prospekKarier: false, mediaTerkait: false },
  },
  {
    id: "4",
    nama: "Data Scientist",
    slug: "/data-scientist",
    alias: "Ilmuwan Data",
    kategori: "Data & Analitik",
    kategoriIcon: BarChart3,
    subKategori: "Data Science",
    riasec: "ICR",
    diperbarui: "08 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: true, prospekKarier: false, mediaTerkait: true },
  },
  {
    id: "5",
    nama: "Digital Marketing Specialist",
    slug: "/digital-marketing-specialist",
    kategori: "Marketing & Komunikasi",
    kategoriIcon: Megaphone,
    subKategori: "Digital Marketing",
    riasec: "ESA",
    diperbarui: "07 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: false, kualifikasi: false, keterampilan: false, prospekKarier: false, mediaTerkait: false },
  },
  {
    id: "6",
    nama: "Content Writer",
    slug: "/content-writer",
    alias: "Penulis Konten",
    kategori: "Marketing & Komunikasi",
    kategoriIcon: Megaphone,
    subKategori: "Content Marketing",
    riasec: "AIC",
    diperbarui: "06 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: true, prospekKarier: true, mediaTerkait: false },
  },
  {
    id: "7",
    nama: "Business Analyst",
    slug: "/business-analyst",
    kategori: "Bisnis & Manajemen",
    kategoriIcon: Settings,
    subKategori: "Business Analysis",
    riasec: "ICE",
    diperbarui: "05 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: true, prospekKarier: true, mediaTerkait: true },
  },
  {
    id: "8",
    nama: "DevOps Engineer",
    slug: "/devops-engineer",
    kategori: "Engineering & Teknologi",
    kategoriIcon: Code,
    subKategori: "DevOps",
    riasec: "IRC",
    diperbarui: "04 Jan 2026",
    kelengkapan: { deskripsi: false, tugas: false, kualifikasi: false, keterampilan: false, prospekKarier: false, mediaTerkait: false },
  },
  {
    id: "9",
    nama: "Graphic Designer",
    slug: "/graphic-designer",
    alias: "Desainer Grafis",
    kategori: "Desain & Kreativitas",
    kategoriIcon: Palette,
    subKategori: "Branding",
    riasec: "AIR",
    diperbarui: "03 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: false, prospekKarier: false, mediaTerkait: false },
  },
  {
    id: "10",
    nama: "Data Engineer",
    slug: "/data-engineer",
    kategori: "Data & Analitik",
    kategoriIcon: BarChart3,
    subKategori: "Data Engineering",
    riasec: "CIR",
    diperbarui: "02 Jan 2026",
    kelengkapan: { deskripsi: true, tugas: true, kualifikasi: true, keterampilan: true, prospekKarier: false, mediaTerkait: false },
  },
];

// Categories for filter
const kategoriOptions = [
  "Semua kategori",
  "Data & Analitik",
  "Desain & Kreativitas",
  "Engineering & Teknologi",
  "Marketing & Komunikasi",
  "Bisnis & Manajemen",
];

const subKategoriOptions: Record<string, string[]> = {
  "Semua kategori": ["Semua sub-kategori"],
  "Data & Analitik": ["Semua sub-kategori", "Data Analytics", "Data Engineering", "Data Science", "Business Intelligence"],
  "Desain & Kreativitas": ["Semua sub-kategori", "UI Design", "UX Research", "Branding", "Motion Design"],
  "Engineering & Teknologi": ["Semua sub-kategori", "Backend Development", "Frontend Development", "DevOps", "Mobile Development", "Cloud Infrastructure"],
  "Marketing & Komunikasi": ["Semua sub-kategori", "Digital Marketing", "Content Marketing", "SEO/SEM", "Public Relations"],
  "Bisnis & Manajemen": ["Semua sub-kategori", "Product Management", "Business Analysis", "Project Management", "Consulting"],
};

// All RIASEC combinations for searchable combobox
const riasecFullOptions = [
  { code: "A", label: "Artistic (A)" },
  { code: "AC", label: "Artistic Conventional (AC)" },
  { code: "ACE", label: "Artistic Conventional Enterprising (ACE)" },
  { code: "ACI", label: "Artistic Conventional Investigative (ACI)" },
  { code: "ACR", label: "Artistic Conventional Realistic (ACR)" },
  { code: "ACS", label: "Artistic Conventional Social (ACS)" },
  { code: "AE", label: "Artistic Enterprising (AE)" },
  { code: "AEI", label: "Artistic Enterprising Investigative (AEI)" },
  { code: "AES", label: "Artistic Enterprising Social (AES)" },
  { code: "AI", label: "Artistic Investigative (AI)" },
  { code: "AIC", label: "Artistic Investigative Conventional (AIC)" },
  { code: "AIR", label: "Artistic Investigative Realistic (AIR)" },
  { code: "AIS", label: "Artistic Investigative Social (AIS)" },
  { code: "AR", label: "Artistic Realistic (AR)" },
  { code: "AS", label: "Artistic Social (AS)" },
  { code: "C", label: "Conventional (C)" },
  { code: "CE", label: "Conventional Enterprising (CE)" },
  { code: "CI", label: "Conventional Investigative (CI)" },
  { code: "CIR", label: "Conventional Investigative Realistic (CIR)" },
  { code: "CR", label: "Conventional Realistic (CR)" },
  { code: "CS", label: "Conventional Social (CS)" },
  { code: "E", label: "Enterprising (E)" },
  { code: "EC", label: "Enterprising Conventional (EC)" },
  { code: "ECS", label: "Enterprising Conventional Social (ECS)" },
  { code: "EI", label: "Enterprising Investigative (EI)" },
  { code: "ES", label: "Enterprising Social (ES)" },
  { code: "ESA", label: "Enterprising Social Artistic (ESA)" },
  { code: "I", label: "Investigative (I)" },
  { code: "IC", label: "Investigative Conventional (IC)" },
  { code: "ICE", label: "Investigative Conventional Enterprising (ICE)" },
  { code: "ICR", label: "Investigative Conventional Realistic (ICR)" },
  { code: "IR", label: "Investigative Realistic (IR)" },
  { code: "IRC", label: "Investigative Realistic Conventional (IRC)" },
  { code: "IS", label: "Investigative Social (IS)" },
  { code: "R", label: "Realistic (R)" },
  { code: "RA", label: "Realistic Artistic (RA)" },
  { code: "RC", label: "Realistic Conventional (RC)" },
  { code: "RE", label: "Realistic Enterprising (RE)" },
  { code: "RI", label: "Realistic Investigative (RI)" },
  { code: "RS", label: "Realistic Social (RS)" },
  { code: "S", label: "Social (S)" },
  { code: "SA", label: "Social Artistic (SA)" },
  { code: "SC", label: "Social Conventional (SC)" },
  { code: "SE", label: "Social Enterprising (SE)" },
  { code: "SI", label: "Social Investigative (SI)" },
  { code: "SR", label: "Social Realistic (SR)" },
];

const sortOptions = [
  { value: "az", label: "A–Z (Nama)" },
  { value: "za", label: "Z–A (Nama)" },
  { value: "terbaru", label: "Terbaru diperbarui" },
  { value: "terlama", label: "Terlama diperbarui" },
];

// Tab types
type TabType = "profesi" | "kategori" | "perusahaan" | "istilah" | "artikel";

const KamusKarierMasterData = () => {
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("profesi");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua kategori");
  const [subKategoriFilter, setSubKategoriFilter] = useState("Semua sub-kategori");
  const [riasecFilter, setRiasecFilter] = useState("");
  const [riasecSearch, setRiasecSearch] = useState("");
  const [riasecOpen, setRiasecOpen] = useState(false);
  const [sortOption, setSortOption] = useState("az");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profesiToDelete, setProfesiToDelete] = useState<Profesi | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all");

  // Delete result dialog state
  type DeleteResultState = "success" | "partial" | "failed" | null;
  const [deleteResultOpen, setDeleteResultOpen] = useState(false);
  const [deleteResultState, setDeleteResultState] = useState<DeleteResultState>(null);
  const [demoDeleteState, setDemoDeleteState] = useState<DeleteResultState>(null);
  const [demoFabOpen, setDemoFabOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort data
  const filteredData = mockProfesiData
    .filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.alias && item.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.riasec.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKategori =
        kategoriFilter === "Semua kategori" || item.kategori === kategoriFilter;
      const matchesSubKategori =
        subKategoriFilter === "Semua sub-kategori" ||
        item.subKategori === subKategoriFilter;
      const matchesRiasec =
        !riasecFilter || item.riasec === riasecFilter;
      return matchesSearch && matchesKategori && matchesSubKategori && matchesRiasec;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "za":
          return b.nama.localeCompare(a.nama);
        case "terbaru":
          return new Date(b.diperbarui).getTime() - new Date(a.diperbarui).getTime();
        case "terlama":
          return new Date(a.diperbarui).getTime() - new Date(b.diperbarui).getTime();
        default:
          return a.nama.localeCompare(b.nama);
      }
    });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleDelete = (profesi: Profesi) => {
    setProfesiToDelete(profesi);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (profesiToDelete) {
      setDeleteDialogOpen(false);
      const state = demoDeleteState || "success";
      if (state === "failed") {
        setDeleteResultState("failed");
        setDeleteResultOpen(true);
      } else {
        toast.success(`Profesi "${profesiToDelete.nama}" berhasil dihapus`);
      }
      setProfesiToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    setBulkDeleteDialogOpen(false);
    const state = demoDeleteState || "success";
    setDeleteResultState(state);
    setDeleteResultOpen(true);
    if (state === "success") {
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const confirmExport = () => {
    const count = exportScope === "filtered" ? filteredData.length : mockProfesiData.length;
    toast.success(`${count} profesi berhasil diekspor sebagai ${exportFormat.toUpperCase()}`);
    setExportDialogOpen(false);
  };

  const handleViewDetail = (profesi: Profesi) => {
    router.push(`/kamus-karier/master-data/profesi/${profesi.id}`);
  };

  const handleKategoriChange = (value: string) => {
    setKategoriFilter(value);
    setSubKategoriFilter("Semua sub-kategori");
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const tabs: { id: TabType; label: string; disabled?: boolean }[] = [
    { id: "kategori", label: "Kategori" },
    { id: "profesi", label: "Profesi" },
    { id: "perusahaan", label: "Perusahaan" },
    { id: "istilah", label: "Istilah Dunia Kerja", disabled: true },
    { id: "artikel", label: "Artikel REXTRA", disabled: true },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Master Data Kamus Karier
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Kelola struktur kategori untuk Profesi dan Perusahaan.
          </p>
        </div>

        {/* Tab Button Group - Scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                size="sm"
                className={cn(
                  "transition-all text-xs sm:text-sm whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-accent hover:text-accent-foreground",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "profesi" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Section 1: Kontrol & Pencarian */}
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Filter & Pencarian Profesi
              </h2>
              
              <div className="flex flex-col gap-3">
                {/* Row 1: Kategori & Sub-kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Select value={kategoriFilter} onValueChange={handleKategoriChange}>
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Pilih kategori utama" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {kategoriOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={subKategoriFilter} 
                    onValueChange={setSubKategoriFilter}
                    disabled={kategoriFilter === "Semua kategori"}
                  >
                    <SelectTrigger className={cn(
                      "h-9 sm:h-10 text-xs sm:text-sm",
                      kategoriFilter === "Semua kategori" && "opacity-50 cursor-not-allowed"
                    )}>
                      <SelectValue placeholder={kategoriFilter === "Semua kategori" ? "Pilih kategori utama terlebih dahulu" : "Pilih sub-kategori"} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {(subKategoriOptions[kategoriFilter] || ["Semua sub-kategori"]).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Row 2: RIASEC Searchable Combobox & Sort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* RIASEC Searchable Combobox */}
                  <Popover open={riasecOpen} onOpenChange={setRiasecOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={riasecOpen}
                        className="h-9 sm:h-10 justify-between text-xs sm:text-sm font-normal w-full"
                      >
                        {riasecFilter
                          ? riasecFullOptions.find((o) => o.code === riasecFilter)?.label || riasecFilter
                          : "Semua kode RIASEC"}
                        <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                      <div className="border-b border-border p-2">
                        <Input
                          placeholder="Ketik kode RIASEC..."
                          value={riasecSearch}
                          onChange={(e) => setRiasecSearch(e.target.value)}
                          className="h-8 text-xs sm:text-sm border-primary focus-visible:ring-primary"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {/* Reset option */}
                        <button
                          className={cn(
                            "flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-accent transition-colors text-left",
                            !riasecFilter && "bg-accent"
                          )}
                          onClick={() => {
                            setRiasecFilter("");
                            setRiasecSearch("");
                            setRiasecOpen(false);
                          }}
                        >
                          <Check className={cn("h-3.5 w-3.5", riasecFilter && "invisible")} />
                          <span>Semua kode RIASEC</span>
                        </button>
                        {riasecFullOptions
                          .filter((o) =>
                            o.code.toLowerCase().includes(riasecSearch.toLowerCase()) ||
                            o.label.toLowerCase().includes(riasecSearch.toLowerCase())
                          )
                          .map((opt) => (
                            <button
                              key={opt.code}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-accent transition-colors text-left",
                                riasecFilter === opt.code && "bg-accent"
                              )}
                              onClick={() => {
                                setRiasecFilter(opt.code);
                                setRiasecSearch("");
                                setRiasecOpen(false);
                              }}
                            >
                              <Check className={cn("h-3.5 w-3.5", riasecFilter !== opt.code && "invisible")} />
                              <span className="font-mono text-primary font-semibold mr-2 w-8 shrink-0">{opt.code}</span>
                              <span className="text-muted-foreground truncate">{opt.label}</span>
                            </button>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Urutkan berdasarkan" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 3: Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama profesi, alias, atau kode RIASEC..."
                    className="pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Tabel Data Profesi */}
            <div className="bg-card border border-border rounded-2xl">
              <RextraTableHeader
                title="Daftar Profesi"
                subtitle={`Menampilkan ${paginatedData.length} dari ${totalItems} profesi`}
                actions={
                  <>
                    <Button
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={selectedIds.length === 0}
                      className="gap-1.5 h-9 text-xs border border-destructive bg-destructive/5 hover:bg-destructive/10 text-destructive shadow-none disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus Data
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExport}
                      className="gap-1.5 h-9 text-xs border border-primary bg-primary/5 hover:bg-primary/10 text-primary shadow-none"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Ekspor Data
                    </Button>
                    <Button size="sm" className="gap-1.5 h-9 text-xs ml-auto">
                      <Plus className="h-3.5 w-3.5" />
                      Tambah Data Profesi
                    </Button>
                  </>
                }
              />

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px] px-3">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Profesi</TableHead>
                      <TableHead className="min-w-[120px]">Kategori</TableHead>
                      <TableHead className="min-w-[80px]">RIASEC</TableHead>
                      <TableHead className="min-w-[160px]">Kelengkapan</TableHead>
                      <TableHead className="min-w-[110px]">Diperbarui</TableHead>
                      <TableHead className="w-[120px] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 7 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-3 py-2"><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-8 w-40" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell className="py-2"><Skeleton className="h-4 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center">
                          {searchQuery || kategoriFilter !== "Semua kategori" || subKategoriFilter !== "Semua sub-kategori" || riasecFilter ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground py-4">
                              <Search className="h-10 w-10 mb-3 opacity-40" />
                              <p className="font-semibold text-foreground">Data tidak ditemukan</p>
                              <p className="text-sm mt-1 max-w-xs">
                                Coba ubah kata kunci atau reset filter untuk melihat data lainnya.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => {
                                  setSearchQuery("");
                                  setKategoriFilter("Semua kategori");
                                  setSubKategoriFilter("Semua sub-kategori");
                                  setRiasecFilter("");
                                  setSortOption("az");
                                }}
                              >
                                Reset Filter
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground py-4">
                              <FileText className="h-10 w-10 mb-3 opacity-40" />
                              <p className="font-semibold text-foreground">Belum ada data profesi</p>
                              <p className="text-sm mt-1 max-w-xs">
                                Tambahkan profesi pertama untuk mulai menyusun Kamus Karier.
                              </p>
                              <Button size="sm" className="mt-3 gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                Tambah Data Profesi
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((profesi) => {
                        const isSelected = selectedIds.includes(profesi.id);
                        const filledCount = Object.values(profesi.kelengkapan).filter(Boolean).length;
                        const totalFields = kelengkapanFields.length;
                        const kelengkapanPersen = Math.round((filledCount / totalFields) * 100);
                        const missingFields = kelengkapanFields.filter(f => !profesi.kelengkapan[f.key]);
                        return (
                          <TableRow
                            key={profesi.id}
                            className={cn(
                              "transition-colors",
                              isSelected && "bg-primary/5"
                            )}
                          >
                            <TableCell className="px-3 py-2">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleSelectOne(profesi.id, checked as boolean)
                                }
                                className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={profesi.image || noImageProfesi.src}
                                  alt={profesi.nama}
                                  className="h-10 w-10 rounded-md object-cover bg-muted shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-foreground truncate">
                                    {profesi.nama}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {profesi.slug}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-2">
                              <span className="text-sm">{profesi.kategori}</span>
                            </TableCell>
                            <TableCell className="py-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accent text-accent-foreground">
                                {profesi.riasec || "–"}
                              </span>
                            </TableCell>
                            <TableCell className="py-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="flex items-center gap-2 w-full max-w-[160px] group cursor-pointer hover:opacity-80 transition-opacity">
                                    <Progress
                                      value={kelengkapanPersen}
                                      className="h-2 flex-1 bg-muted"
                                    />
                                    <span className="text-xs font-medium text-muted-foreground w-10 text-right shrink-0">
                                      {kelengkapanPersen}%
                                    </span>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" align="start" className="w-56 p-3">
                                  {kelengkapanPersen === 100 ? (
                                    <div className="flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                      <p className="text-sm font-medium">Semua data sudah lengkap</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <p className="text-sm font-semibold">Kelengkapan {kelengkapanPersen}%</p>
                                      <div className="space-y-1">
                                        {kelengkapanFields.map(f => (
                                          <div key={f.key} className="flex items-center gap-2 text-sm">
                                            {profesi.kelengkapan[f.key] ? (
                                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                            ) : (
                                              <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                                            )}
                                            <span className={cn(
                                              profesi.kelengkapan[f.key] ? "text-muted-foreground" : "text-foreground font-medium"
                                            )}>
                                              {f.label}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell className="py-2 text-sm text-muted-foreground">
                              {profesi.diperbarui}
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center justify-end gap-0.5">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                      onClick={() => handleViewDetail(profesi)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Detail</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                      onClick={() => router.push(`/kamus-karier/master-data/profesi/${profesi.id}/edit`)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => handleDelete(profesi)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Hapus</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <RextraTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
              />
            </div>
          </div>
        )}

        {/* Kategori Tab */}
        {activeTab === "kategori" && <KategoriTab />}

        {/* Perusahaan Tab */}
        {activeTab === "perusahaan" && <PerusahaanTab />}

        {/* Coming soon for other tabs */}
        {activeTab !== "profesi" && activeTab !== "kategori" && activeTab !== "perusahaan" && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium text-lg">Segera Hadir</p>
              <p className="text-sm">
                Modul ini sedang dalam pengembangan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus profesi ini?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Tindakan ini tidak dapat dibatalkan. Pastikan profesi{" "}
              <strong>"{profesiToDelete?.nama}"</strong> tidak sedang digunakan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus {selectedIds.length} profesi terpilih?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Data yang dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ekspor Data Profesi</DialogTitle>
            <DialogDescription>
              Pilih format dan cakupan data yang ingin diekspor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Format file</Label>
              <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "xlsx")} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="font-normal cursor-pointer">CSV</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="xlsx" id="format-xlsx" />
                  <Label htmlFor="format-xlsx" className="font-normal cursor-pointer">XLSX</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Cakupan data</Label>
              <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as "all" | "filtered")} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="scope-all" />
                  <Label htmlFor="scope-all" className="font-normal cursor-pointer">
                    Ekspor semua data ({mockProfesiData.length} profesi)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="filtered" id="scope-filtered" />
                  <Label htmlFor="scope-filtered" className="font-normal cursor-pointer">
                    Ekspor hasil filter saat ini ({filteredData.length} profesi)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Batal</Button>
            <Button onClick={confirmExport}>
              <Download className="h-4 w-4 mr-1.5" />
              Unduh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Result Dialog */}
      <Dialog open={deleteResultOpen} onOpenChange={setDeleteResultOpen}>
        <DialogContent className="sm:max-w-md">
          {deleteResultState === "success" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <DialogTitle>Berhasil dihapus</DialogTitle>
                </div>
                <DialogDescription className="pt-2">
                  Semua {selectedIds.length || 1} profesi berhasil dihapus dari database.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => { setDeleteResultOpen(false); setSelectedIds([]); }}>Tutup</Button>
              </DialogFooter>
            </>
          )}
          {deleteResultState === "partial" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Info className="h-5 w-5 text-amber-600" />
                  </div>
                  <DialogTitle>Sebagian gagal dihapus</DialogTitle>
                </div>
                <DialogDescription className="pt-2">
                  Dari <strong>{selectedIds.length}</strong> profesi yang dipilih, hanya <strong>{Math.ceil(selectedIds.length / 2)}</strong> yang berhasil dihapus. 
                  Sisanya <strong>{selectedIds.length - Math.ceil(selectedIds.length / 2)}</strong> profesi gagal dihapus karena datanya masih terkait dengan tabel lain.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-amber-800 mb-1">Profesi yang gagal dihapus:</p>
                <ul className="text-amber-700 space-y-0.5">
                  {selectedIds.slice(Math.ceil(selectedIds.length / 2)).map((id) => {
                    const p = mockProfesiData.find((d) => d.id === id);
                    return p ? <li key={id} className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 shrink-0" />{p.nama}</li> : null;
                  })}
                </ul>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDeleteResultOpen(false); setSelectedIds([]); }}>Tutup</Button>
              </DialogFooter>
            </>
          )}
          {deleteResultState === "failed" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <DialogTitle>Gagal menghapus</DialogTitle>
                </div>
                <DialogDescription className="pt-2">
                  Semua profesi gagal dihapus karena datanya masih terkait dengan tabel lain (misalnya: hasil tes, rekomendasi karier, atau mapping kurikulum).
                </DialogDescription>
              </DialogHeader>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 text-sm">
                <p className="font-medium text-destructive mb-1">Alasan gagal:</p>
                <p className="text-muted-foreground">
                  Data profesi yang dipilih masih digunakan sebagai referensi pada modul lain. Hapus relasi data terlebih dahulu sebelum menghapus profesi.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteResultOpen(false)}>Tutup</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Demo State Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {demoFabOpen && (
            <div className="absolute bottom-14 right-0 bg-card border border-border rounded-lg shadow-lg p-3 w-56 space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Demo State Hapus</p>
              {([
                { key: null, label: "Normal (Sukses)", icon: CheckCircle2, color: "text-green-600" },
                { key: "partial", label: "Sebagian Gagal", icon: Info, color: "text-amber-600" },
                { key: "failed", label: "Semua Gagal", icon: XCircle, color: "text-destructive" },
              ] as const).map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key || "null"}
                    onClick={() => {
                      setDemoDeleteState(opt.key as DeleteResultState);
                      setDemoFabOpen(false);
                      toast.info(`Demo state diubah: ${opt.label}`);
                    }}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent text-left",
                      demoDeleteState === opt.key && "bg-accent font-medium"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", opt.color)} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full shadow-lg bg-card border-2 border-primary/30 hover:border-primary"
            onClick={() => setDemoFabOpen(!demoFabOpen)}
          >
            <Bug className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default KamusKarierMasterData;
