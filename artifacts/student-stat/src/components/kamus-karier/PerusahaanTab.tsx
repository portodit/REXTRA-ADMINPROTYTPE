import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Trash2,
  Download,
  AlertTriangle,
  Plus,
  Building2,
  Landmark,
  Briefcase,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Kelengkapan fields for perusahaan
const kelengkapanFields = [
  { key: "ringkasan", label: "Ringkasan Perusahaan" },
  { key: "tentang", label: "Tentang Perusahaan" },
  { key: "gambar", label: "Visual Pendukung" },
  { key: "visi", label: "Visi Perusahaan" },
  { key: "misi", label: "Misi Perusahaan" },
  { key: "capaian", label: "Capaian Perusahaan" },
  { key: "dokumen", label: "Dokumen Publik" },
];

// Types
interface Perusahaan {
  id: string;
  nama: string;
  namaLokal?: string;
  tipeOrganisasi: string;
  sektorIndustri: string;
  lokasi: string;
  diperbarui: string;
  kelengkapan: Record<string, boolean>;
}

const tipeOrganisasiIcons: Record<string, React.ElementType> = {
  "Perusahaan Negara": Landmark,
  "Perusahaan Swasta": Building2,
  "Perusahaan Startup": Briefcase,
};

// Mock data
const mockPerusahaanData: Perusahaan[] = [
  {
    id: "1",
    nama: "PT Tokopedia",
    namaLokal: "Tokopedia",
    tipeOrganisasi: "Perusahaan Startup",
    sektorIndustri: "Technology",
    lokasi: "Jakarta",
    diperbarui: "15 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: true, visi: true, misi: true, capaian: false, dokumen: false },
  },
  {
    id: "2",
    nama: "PT Bank Central Asia Tbk",
    namaLokal: "BCA",
    tipeOrganisasi: "Perusahaan Swasta",
    sektorIndustri: "Finance",
    lokasi: "Jakarta",
    diperbarui: "14 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: true, visi: true, misi: true, capaian: true, dokumen: true },
  },
  {
    id: "3",
    nama: "PT Telekomunikasi Indonesia Tbk",
    namaLokal: "Telkom Indonesia",
    tipeOrganisasi: "Perusahaan Negara",
    sektorIndustri: "Technology",
    lokasi: "Bandung",
    diperbarui: "13 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: true, visi: true, misi: true, capaian: true, dokumen: true },
  },
  {
    id: "4",
    nama: "Google Indonesia",
    tipeOrganisasi: "Perusahaan Swasta",
    sektorIndustri: "Technology",
    lokasi: "Jakarta",
    diperbarui: "12 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: false, visi: false, misi: false, capaian: false, dokumen: false },
  },
  {
    id: "5",
    nama: "PT Bukalapak.com Tbk",
    namaLokal: "Bukalapak",
    tipeOrganisasi: "Perusahaan Startup",
    sektorIndustri: "Retail",
    lokasi: "Jakarta",
    diperbarui: "06 Jan 2026",
    kelengkapan: { ringkasan: false, tentang: false, gambar: false, visi: false, misi: false, capaian: false, dokumen: false },
  },
  {
    id: "6",
    nama: "PT Gojek Indonesia",
    namaLokal: "Gojek",
    tipeOrganisasi: "Perusahaan Startup",
    sektorIndustri: "Logistics",
    lokasi: "Jakarta",
    diperbarui: "09 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: true, visi: true, misi: true, capaian: true, dokumen: false },
  },
  {
    id: "7",
    nama: "PT Pertamina (Persero)",
    namaLokal: "Pertamina",
    tipeOrganisasi: "Perusahaan Negara",
    sektorIndustri: "Energy",
    lokasi: "Jakarta",
    diperbarui: "08 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: true, visi: true, misi: true, capaian: true, dokumen: true },
  },
  {
    id: "8",
    nama: "Unilever Indonesia",
    tipeOrganisasi: "Perusahaan Swasta",
    sektorIndustri: "FMCG",
    lokasi: "Jakarta",
    diperbarui: "07 Jan 2026",
    kelengkapan: { ringkasan: true, tentang: true, gambar: false, visi: true, misi: true, capaian: false, dokumen: false },
  },
];

const tipeOrganisasiOptions = [
  "Semua tipe",
  "Perusahaan Negara",
  "Perusahaan Swasta",
  "Perusahaan Startup",
];

const sektorIndustriOptions = [
  "Semua sektor",
  "Technology",
  "Finance",
  "FMCG",
  "Retail",
  "Manufacturing",
  "Energy",
  "Healthcare",
  "Education",
  "Media",
  "Logistics",
  "Construction",
  "Consulting",
];

const sortOptions = [
  { value: "az", label: "A–Z (Nama)" },
  { value: "za", label: "Z–A (Nama)" },
  { value: "terbaru", label: "Terbaru diperbarui" },
  { value: "terlama", label: "Terlama diperbarui" },
];

export const PerusahaanTab = () => {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tipeFilter, setTipeFilter] = useState("Semua tipe");
  const [sektorFilter, setSektorFilter] = useState("Semua sektor");
  const [sortOption, setSortOption] = useState("az");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // UI states
  const [isLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Perusahaan | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all");

  // Delete result states
  const [deleteResultOpen, setDeleteResultOpen] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    type: "success" | "partial" | "failed";
    total: number;
    deleted: number;
    failed: number;
    failedItems: { nama: string; reason: string }[];
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Demo: simulate deletion outcome based on data dependencies
  const simulateDeletion = (items: Perusahaan[]) => {
    // Items with id 2 (BCA), 3 (Telkom), 7 (Pertamina) are "referenced" in other tables
    const referencedIds = ["2", "3", "7"];
    const deletable = items.filter(i => !referencedIds.includes(i.id));
    const blocked = items.filter(i => referencedIds.includes(i.id));
    return { deletable, blocked };
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort
  const filteredData = mockPerusahaanData
    .filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.namaLokal && item.namaLokal.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTipe = tipeFilter === "Semua tipe" || item.tipeOrganisasi === tipeFilter;
      const matchesSektor = sektorFilter === "Semua sektor" || item.sektorIndustri === sektorFilter;
      return matchesSearch && matchesTipe && matchesSektor;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "za": return b.nama.localeCompare(a.nama);
        case "terbaru": return new Date(b.diperbarui).getTime() - new Date(a.diperbarui).getTime();
        case "terlama": return new Date(a.diperbarui).getTime() - new Date(b.diperbarui).getTime();
        default: return a.nama.localeCompare(b.nama);
      }
    });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map((item) => item.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
  };

  const handleDelete = (item: Perusahaan) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setIsDeleting(true);
      setDeleteDialogOpen(false);
      setTimeout(() => {
        const { deletable, blocked } = simulateDeletion([itemToDelete]);
        setIsDeleting(false);
        if (blocked.length > 0) {
          setDeleteResult({
            type: "failed",
            total: 1,
            deleted: 0,
            failed: 1,
            failedItems: [{ nama: itemToDelete.nama, reason: "Data terkait dengan tabel Program Karier dan Profesi." }],
          });
        } else {
          setDeleteResult({
            type: "success",
            total: 1,
            deleted: 1,
            failed: 0,
            failedItems: [],
          });
        }
        setDeleteResultOpen(true);
        setItemToDelete(null);
      }, 1200);
    }
  };

  const confirmBulkDelete = () => {
    setIsDeleting(true);
    setBulkDeleteDialogOpen(false);
    const selectedItems = mockPerusahaanData.filter(i => selectedIds.includes(i.id));
    setTimeout(() => {
      const { deletable, blocked } = simulateDeletion(selectedItems);
      setIsDeleting(false);
      if (blocked.length === 0) {
        setDeleteResult({
          type: "success",
          total: selectedItems.length,
          deleted: selectedItems.length,
          failed: 0,
          failedItems: [],
        });
      } else if (deletable.length === 0) {
        setDeleteResult({
          type: "failed",
          total: selectedItems.length,
          deleted: 0,
          failed: selectedItems.length,
          failedItems: blocked.map(i => ({ nama: i.nama, reason: "Masih terkait dengan tabel lain." })),
        });
      } else {
        setDeleteResult({
          type: "partial",
          total: selectedItems.length,
          deleted: deletable.length,
          failed: blocked.length,
          failedItems: blocked.map(i => ({ nama: i.nama, reason: "Masih terkait dengan tabel lain." })),
        });
      }
      setDeleteResultOpen(true);
      setSelectedIds([]);
    }, 1500);
  };

  const confirmExport = () => {
    const count = exportScope === "filtered" ? filteredData.length : mockPerusahaanData.length;
    toast.success(`${count} perusahaan berhasil diekspor sebagai ${exportFormat.toUpperCase()}`);
    setExportDialogOpen(false);
  };

  const handleViewDetail = (item: Perusahaan) => {
    navigate(`/kamus-karier/master-data/perusahaan/${item.id}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section 1: Filter & Pencarian */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Filter & Pencarian Perusahaan
        </h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Select value={tipeFilter} onValueChange={setTipeFilter}>
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Semua tipe organisasi" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {tipeOrganisasiOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sektorFilter} onValueChange={setSektorFilter}>
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Semua sektor industri" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {sektorIndustriOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama perusahaan atau nama lokal..."
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
      </div>

      {/* Section 2: Tabel */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-5 sm:p-6 border-b border-border">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-foreground">Daftar Perusahaan</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Menampilkan {paginatedData.length} dari {totalItems} perusahaan
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
                disabled={selectedIds.length === 0}
                className="gap-1.5 h-8 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hapus Data</span>
                <span className="sm:hidden">Hapus</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportDialogOpen(true)}
                className="gap-1.5 h-8 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ekspor Data</span>
                <span className="sm:hidden">Ekspor</span>
              </Button>
              <Button size="sm" className="gap-1.5 h-8 text-xs ml-auto">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tambah Data Perusahaan</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead className="min-w-[220px]">Nama Perusahaan</TableHead>
                <TableHead className="min-w-[160px]">Tipe Organisasi</TableHead>
                <TableHead className="min-w-[180px]">Sektor Industri</TableHead>
                <TableHead className="min-w-[160px]">Kelengkapan</TableHead>
                <TableHead className="min-w-[100px]">Lokasi</TableHead>
                <TableHead className="min-w-[110px]">Diperbarui</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center">
                    {searchQuery || tipeFilter !== "Semua tipe" || sektorFilter !== "Semua sektor" ? (
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
                            setTipeFilter("Semua tipe");
                            setSektorFilter("Semua sektor");
                            setSortOption("az");
                          }}
                        >
                          Reset Filter
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground py-4">
                        <Building2 className="h-10 w-10 mb-3 opacity-40" />
                        <p className="font-semibold text-foreground">Belum ada data perusahaan</p>
                        <p className="text-sm mt-1 max-w-xs">
                          Tambahkan perusahaan pertama untuk mulai menyusun Kamus Karier.
                        </p>
                        <Button size="sm" className="mt-3 gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          Tambah Data Perusahaan
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const Icon = tipeOrganisasiIcons[item.tipeOrganisasi] || Building2;
                  const filledCount = Object.values(item.kelengkapan).filter(Boolean).length;
                  const totalFieldsCount = kelengkapanFields.length;
                  const kelengkapanPersen = Math.round((filledCount / totalFieldsCount) * 100);
                  return (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                          className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.nama}</p>
                          {item.namaLokal && (
                            <p className="text-xs text-muted-foreground">{item.namaLokal}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.tipeOrganisasi}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                          {item.sektorIndustri}
                        </span>
                      </TableCell>
                      <TableCell>
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
                                      {item.kelengkapan[f.key] ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                      ) : (
                                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                                      )}
                                      <span className={cn(
                                        item.kelengkapan[f.key] ? "text-muted-foreground" : "text-foreground font-medium"
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
                      <TableCell className="text-sm">{item.lokasi}</TableCell>
                      <TableCell className="text-muted-foreground">{item.diperbarui}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                onClick={() => handleViewDetail(item)}
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
                                onClick={() => navigate(`/kamus-karier/master-data/perusahaan/${item.id}/edit`)}
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
                                onClick={() => handleDelete(item)}
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

        {totalPages > 1 && (
          <RextraTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
          />
        )}
      </div>

      {/* Delete Single Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus perusahaan ini?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Tindakan ini tidak dapat dibatalkan. Pastikan perusahaan{" "}
              <strong>"{itemToDelete?.nama}"</strong> tidak sedang digunakan.
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus {selectedIds.length} perusahaan terpilih?</AlertDialogTitle>
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
            <DialogTitle>Ekspor Data Perusahaan</DialogTitle>
            <DialogDescription>
              Pilih format dan cakupan data yang ingin diekspor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Format file</Label>
              <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "xlsx")} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="csv" id="p-format-csv" />
                  <Label htmlFor="p-format-csv" className="font-normal cursor-pointer">CSV</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="xlsx" id="p-format-xlsx" />
                  <Label htmlFor="p-format-xlsx" className="font-normal cursor-pointer">XLSX</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Cakupan data</Label>
              <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as "all" | "filtered")} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="p-scope-all" />
                  <Label htmlFor="p-scope-all" className="font-normal cursor-pointer">
                    Ekspor semua data ({mockPerusahaanData.length} perusahaan)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="filtered" id="p-scope-filtered" />
                  <Label htmlFor="p-scope-filtered" className="font-normal cursor-pointer">
                    Ekspor hasil filter saat ini ({filteredData.length} perusahaan)
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

      {/* Deleting Overlay */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg flex flex-col items-center gap-4 max-w-xs">
            <div className="h-12 w-12 rounded-full border-4 border-muted border-t-destructive animate-spin" />
            <p className="text-sm font-medium text-foreground">Menghapus data...</p>
            <p className="text-xs text-muted-foreground text-center">Memeriksa ketergantungan antar tabel</p>
          </div>
        </div>
      )}

      {/* Delete Result Dialog */}
      <Dialog open={deleteResultOpen} onOpenChange={setDeleteResultOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-4 pb-4 border-b border-border">
            <div className="flex justify-center">
              <div className="relative">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center",
                  deleteResult?.type === "success" && "bg-primary/10",
                  deleteResult?.type === "partial" && "bg-amber-500/10",
                  deleteResult?.type === "failed" && "bg-destructive/10",
                )}>
                  {deleteResult?.type === "success" ? (
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  ) : deleteResult?.type === "partial" ? (
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                  ) : (
                    <XCircle className="h-10 w-10 text-destructive" />
                  )}
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-lg font-semibold text-foreground">
                {deleteResult?.type === "success" && "Berhasil Dihapus"}
                {deleteResult?.type === "partial" && "Sebagian Gagal Dihapus"}
                {deleteResult?.type === "failed" && "Gagal Menghapus Data"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {deleteResult?.type === "success" && (
                  <>{deleteResult.deleted} perusahaan berhasil dihapus.</>
                )}
                {deleteResult?.type === "partial" && (
                  <>
                    Dari {deleteResult.total} perusahaan yang dipilih, hanya{" "}
                    <span className="font-semibold text-primary">{deleteResult.deleted}</span> berhasil dihapus.{" "}
                    <span className="font-semibold text-destructive">{deleteResult.failed}</span> gagal karena masih terkait dengan tabel lain.
                  </>
                )}
                {deleteResult?.type === "failed" && (
                  <>
                    {deleteResult.total === 1 ? "Perusahaan" : `Seluruh ${deleteResult.total} perusahaan`} tidak dapat dihapus karena masih terkait dengan data di tabel lain.
                  </>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Failed items list */}
          {deleteResult && deleteResult.failedItems.length > 0 && (
            <div className="py-3">
              <p className="text-xs font-semibold text-foreground mb-2">
                {deleteResult.type === "partial" ? "Data yang gagal dihapus:" : "Data yang terkait:"}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {deleteResult.failedItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.nama}</p>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteResultOpen(false)}
              className="flex-1"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
