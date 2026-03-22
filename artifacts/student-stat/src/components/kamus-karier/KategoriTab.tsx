import { useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  FolderTree,
  Building2,
  Globe,
  Tag,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────
interface SubKategori {
  id: string;
  nama: string;
  code: string;
  deskripsi: string;
}

interface KategoriUtama {
  id: string;
  nama: string;
  code: string;
  deskripsi: string;
  subKategori: SubKategori[];
}

interface TipeOrganisasi {
  id: string;
  nama: string;
  code: string;
  deskripsi: string;
}

interface SektorIndustri {
  id: string;
  nama: string;
  code: string;
  deskripsi: string;
}

type InternalTab = "profesi" | "perusahaan";
type FormMode = "add" | "edit";
type FormTarget =
  | "kategori-utama"
  | "sub-kategori"
  | "tipe-organisasi"
  | "sektor-industri";

// ─── Mock Data ───────────────────────────────────────────────────
const initialKategoriProfesi: KategoriUtama[] = [
  {
    id: "1",
    nama: "Data & Analitik",
    code: "DATA",
    deskripsi: "Kategori profesi analitis yang berfokus pada pengumpulan, pengolahan, dan analisis data untuk menghasilkan wawasan strategi.",
    subKategori: [
      { id: "s1", nama: "Data Analytics", code: "ANALYTICS", deskripsi: "Analisis data untuk menghasilkan insight bisnis dan pengambilan keputusan." },
      { id: "s2", nama: "Data Engineering", code: "DATAENG", deskripsi: "Pembangunan dan pengelolaan infrastruktur data serta pipeline ETL." },
      { id: "s3", nama: "Data Science", code: "DATASCI", deskripsi: "Pemodelan statistik, machine learning, dan prediktif analitik." },
      { id: "s4", nama: "Business Intelligence", code: "BI", deskripsi: "Visualisasi, pelaporan, dan dashboard data bisnis." },
    ],
  },
  {
    id: "2",
    nama: "Desain & Kreativitas",
    code: "DESIGN",
    deskripsi: "Kategori profesi kreatif yang mencakup desain visual, interaksi, dan pengalaman pengguna.",
    subKategori: [
      { id: "s5", nama: "UI Design", code: "UI", deskripsi: "Desain antarmuka pengguna yang intuitif dan estetis." },
      { id: "s6", nama: "UX Research", code: "UXR", deskripsi: "Riset pengalaman pengguna untuk meningkatkan usability." },
      { id: "s7", nama: "Branding", code: "BRAND", deskripsi: "Identitas visual, logo, dan strategi merek." },
      { id: "s8", nama: "Motion Design", code: "MOTION", deskripsi: "Desain animasi dan grafis bergerak." },
    ],
  },
  {
    id: "3",
    nama: "Engineering & Teknologi",
    code: "ENG",
    deskripsi: "Kategori profesi teknis yang melibatkan pengembangan perangkat lunak, sistem, dan infrastruktur.",
    subKategori: [
      { id: "s9", nama: "Backend Development", code: "BACKEND", deskripsi: "Pengembangan server-side, API, dan logika bisnis." },
      { id: "s10", nama: "Frontend Development", code: "FRONTEND", deskripsi: "Pengembangan antarmuka pengguna berbasis web." },
      { id: "s11", nama: "DevOps", code: "DEVOPS", deskripsi: "Otomasi deployment, CI/CD, dan manajemen infrastruktur." },
      { id: "s12", nama: "Mobile Development", code: "MOBILE", deskripsi: "Pengembangan aplikasi mobile Android dan iOS." },
      { id: "s13", nama: "Cloud Infrastructure", code: "CLOUD", deskripsi: "Arsitektur dan pengelolaan layanan cloud." },
    ],
  },
  {
    id: "4",
    nama: "Marketing & Komunikasi",
    code: "MKTG",
    deskripsi: "Kategori profesi yang berfokus pada pemasaran, komunikasi, dan strategi konten.",
    subKategori: [
      { id: "s14", nama: "Digital Marketing", code: "DIGMKT", deskripsi: "Pemasaran melalui kanal digital dan media sosial." },
      { id: "s15", nama: "Content Marketing", code: "CONTENT", deskripsi: "Strategi dan produksi konten untuk pemasaran." },
      { id: "s16", nama: "SEO/SEM", code: "SEOSEM", deskripsi: "Optimasi mesin pencari dan pemasaran berbayar." },
      { id: "s17", nama: "Public Relations", code: "PR", deskripsi: "Hubungan masyarakat dan manajemen reputasi." },
    ],
  },
  {
    id: "5",
    nama: "Bisnis & Manajemen",
    code: "BIZ",
    deskripsi: "Kategori profesi strategis yang mencakup manajemen produk, analisis bisnis, dan konsultasi.",
    subKategori: [
      { id: "s18", nama: "Product Management", code: "PM", deskripsi: "Manajemen siklus hidup produk dan strategi produk." },
      { id: "s19", nama: "Business Analysis", code: "BA", deskripsi: "Analisis kebutuhan bisnis dan proses improvement." },
      { id: "s20", nama: "Project Management", code: "PROJMGT", deskripsi: "Perencanaan, pelaksanaan, dan pengelolaan proyek." },
      { id: "s21", nama: "Consulting", code: "CONSULT", deskripsi: "Konsultasi strategis dan manajemen perubahan." },
    ],
  },
];

const initialTipeOrganisasi: TipeOrganisasi[] = [
  { id: "t1", nama: "Perusahaan Negara", code: "BUMN", deskripsi: "Badan usaha milik negara yang beroperasi di sektor strategis nasional." },
  { id: "t2", nama: "Perusahaan Swasta", code: "SWASTA", deskripsi: "Perusahaan swasta dengan struktur formal dan operasi multi-divisi." },
  { id: "t3", nama: "Perusahaan Startup", code: "STARTUP", deskripsi: "Perusahaan rintisan dengan model bisnis inovatif dan pertumbuhan cepat." },
];

const initialSektorIndustri: SektorIndustri[] = [
  { id: "si1", nama: "Technology", code: "TECH", deskripsi: "Aktivitas yang mencakup pengembangan perangkat lunak, layanan teknologi informasi, pemrosesan data, platform digital, dan telekomunikasi. Selaras dengan ISIC Rev.4 Section J (Information and Communication)." },
  { id: "si2", nama: "Finance", code: "FIN", deskripsi: "Aktivitas intermediasi keuangan seperti perbankan, pembiayaan, investasi, asuransi, dan layanan keuangan lainnya. Selaras dengan ISIC Rev.4 Section K (Financial and Insurance Activities)." },
  { id: "si3", nama: "FMCG", code: "FMCG", deskripsi: "Produksi dan distribusi barang konsumsi cepat saji seperti makanan, minuman, dan produk kebutuhan sehari-hari. Termasuk dalam kategori Manufacturing (ISIC Section C)." },
  { id: "si4", nama: "Retail", code: "RETAIL", deskripsi: "Aktivitas penjualan barang langsung kepada konsumen akhir melalui toko fisik atau platform digital. Selaras dengan ISIC Rev.4 Section G (Wholesale and Retail Trade)." },
  { id: "si5", nama: "Manufacturing", code: "MFG", deskripsi: "Kegiatan industri yang mengolah bahan mentah menjadi barang jadi atau setengah jadi melalui proses produksi. Selaras dengan ISIC Rev.4 Section C (Manufacturing)." },
  { id: "si6", nama: "Energy", code: "ENERGY", deskripsi: "Aktivitas eksplorasi, produksi, dan distribusi energi termasuk minyak, gas, pertambangan, serta energi terbarukan. Selaras dengan ISIC Rev.4 Section B dan D." },
  { id: "si7", nama: "Healthcare", code: "HEALTH", deskripsi: "Penyediaan layanan kesehatan, rumah sakit, klinik, serta produksi dan distribusi produk farmasi dan alat kesehatan. Selaras dengan ISIC Rev.4 Section Q." },
  { id: "si8", nama: "Education", code: "EDU", deskripsi: "Aktivitas penyelenggaraan pendidikan formal dan nonformal, termasuk layanan pelatihan dan pembelajaran digital. Selaras dengan ISIC Rev.4 Section P (Education)." },
  { id: "si9", nama: "Media", code: "MEDIA", deskripsi: "Aktivitas produksi dan distribusi konten, penyiaran, periklanan, serta industri kreatif berbasis media. Selaras dengan ISIC Rev.4 Section J dan R." },
  { id: "si10", nama: "Logistics", code: "LOG", deskripsi: "Kegiatan transportasi, pergudangan, dan manajemen rantai pasok. Selaras dengan ISIC Rev.4 Section H (Transportation and Storage)." },
  { id: "si11", nama: "Construction", code: "CONST", deskripsi: "Aktivitas pembangunan infrastruktur, konstruksi bangunan, serta proyek rekayasa teknik. Selaras dengan ISIC Rev.4 Section F (Construction)." },
  { id: "si12", nama: "Consulting", code: "CONSULT", deskripsi: "Aktivitas jasa profesional seperti konsultansi manajemen, hukum, akuntansi, audit, dan layanan profesional lainnya. Selaras dengan ISIC Rev.4 Section M." },
];

// ─── Component ───────────────────────────────────────────────────
export function KategoriTab() {
  const [internalTab, setInternalTab] = useState<InternalTab>("profesi");

  // Data state
  const [kategoriProfesi] = useState<KategoriUtama[]>(initialKategoriProfesi);
  const [tipeOrganisasi] = useState<TipeOrganisasi[]>(initialTipeOrganisasi);
  const [sektorIndustri] = useState<SektorIndustri[]>(initialSektorIndustri);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("terbaru");
  const [tipeOrgOpen, setTipeOrgOpen] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [formTarget, setFormTarget] = useState<FormTarget>("kategori-utama");
  const [formData, setFormData] = useState({ nama: "", code: "", deskripsi: "", parentId: "" });

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ nama: string; id: string } | null>(null);

  // ─── Helpers ─────────────────────────────────────────────────
  const openForm = (target: FormTarget, mode: FormMode, data?: any) => {
    setFormTarget(target);
    setFormMode(mode);
    setFormData(
      data
        ? { nama: data.nama, code: data.code, deskripsi: data.deskripsi, parentId: data.parentId || "" }
        : { nama: "", code: "", deskripsi: "", parentId: "" }
    );
    setFormOpen(true);
  };

  const handleFormSubmit = () => {
    const label = {
      "kategori-utama": "Kategori Utama",
      "sub-kategori": "Sub Kategori",
      "tipe-organisasi": "Tipe Organisasi",
      "sektor-industri": "Sektor Industri",
    }[formTarget];
    toast.success(`${label} "${formData.nama}" berhasil ${formMode === "add" ? "ditambahkan" : "diperbarui"}`);
    setFormOpen(false);
  };

  const openDelete = (nama: string, id: string) => {
    setDeleteTarget({ nama, id });
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success(`"${deleteTarget.nama}" berhasil dihapus`);
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const formTitle = {
    "kategori-utama": formMode === "add" ? "Tambah Kategori Utama" : "Edit Kategori Utama",
    "sub-kategori": formMode === "add" ? "Tambah Sub Kategori" : "Edit Sub Kategori",
    "tipe-organisasi": formMode === "add" ? "Tambah Tipe Organisasi" : "Edit Tipe Organisasi",
    "sektor-industri": formMode === "add" ? "Tambah Sektor Industri" : "Edit Sektor Industri",
  }[formTarget];

  // Filter logic
  const filterBySearch = (items: { nama: string; code: string; deskripsi: string }[]) =>
    items.filter(
      (i) =>
        i.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredKategoriProfesi = filterBySearch(kategoriProfesi) as KategoriUtama[];
  const filteredTipeOrganisasi = filterBySearch(tipeOrganisasi) as TipeOrganisasi[];
  const filteredSektorIndustri = filterBySearch(sektorIndustri) as SektorIndustri[];

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-4 overflow-hidden">
      {/* Internal Tabs */}
      <div className="space-y-2">
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit min-w-0">
            <button
              onClick={() => setInternalTab("profesi")}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                internalTab === "profesi"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Kategori Profesi
            </button>
            <button
              onClick={() => setInternalTab("perusahaan")}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                internalTab === "perusahaan"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Kategori Perusahaan
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pl-1">
          {internalTab === "profesi"
            ? "Sub kategori hanya terkait ke satu kategori utama."
            : "Sektor industri bersifat global dan digunakan oleh semua tipe organisasi."}
        </p>
      </div>

      {/* Control Bar — single row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kategori, sub kategori, atau code..."
            className="pl-10 h-9 text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="h-9 w-[90px] text-xs shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="terlama">Terlama</SelectItem>
            <SelectItem value="az">A–Z</SelectItem>
            <SelectItem value="za">Z–A</SelectItem>
          </SelectContent>
        </Select>
        {internalTab === "profesi" ? (
          <>
            <Button size="sm" className="gap-1 h-9 text-xs shrink-0" onClick={() => openForm("kategori-utama", "add")}>
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kategori Utama</span>
            </Button>
            <Button size="sm" variant="outline" className="gap-1 h-9 text-xs shrink-0" onClick={() => openForm("sub-kategori", "add")}>
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sub Kategori</span>
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" className="gap-1 h-9 text-xs shrink-0" onClick={() => openForm("tipe-organisasi", "add")}>
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tipe Organisasi</span>
            </Button>
            <Button size="sm" variant="outline" className="gap-1 h-9 text-xs shrink-0" onClick={() => openForm("sektor-industri", "add")}>
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sektor Industri</span>
            </Button>
          </>
        )}
      </div>

      {/* ─── Content: Kategori Profesi ──────────────────────────── */}
      {internalTab === "profesi" && (
        <div className="space-y-3">
          {filteredKategoriProfesi.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="Belum ada kategori utama"
              body="Tambahkan kategori utama untuk mulai menyusun struktur profesi."
              cta="Tambah Kategori Utama"
              onCta={() => openForm("kategori-utama", "add")}
            />
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {filteredKategoriProfesi.map((kat) => (
                <AccordionItem
                  key={kat.id}
                  value={kat.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 text-left">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FolderTree className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm text-foreground">{kat.nama}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {kat.subKategori.length} sub
                          </Badge>
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">{kat.deskripsi}</p>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 mr-1 sm:mr-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                          onClick={() => openForm("kategori-utama", "edit", kat)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => openDelete(kat.nama, kat.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    {kat.subKategori.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-muted-foreground">Kategori utama ini belum memiliki sub kategori.</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-1 text-xs gap-1"
                          onClick={() => openForm("sub-kategori", "add", { parentId: kat.id })}
                        >
                          <Plus className="h-3 w-3" />
                          Tambahkan Sub Kategori
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {kat.subKategori.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 hover:bg-muted/50 transition-colors">
                            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                              {sub.code}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{sub.nama}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{sub.deskripsi}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                                onClick={() => openForm("sub-kategori", "edit", { ...sub, parentId: kat.id })}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => openDelete(sub.nama, sub.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}

      {/* ─── Content: Kategori Perusahaan ───────────────────────── */}
      {internalTab === "perusahaan" && (
        <div className="space-y-4">
          {/* Tipe Organisasi — Collapsible, hidden by default */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setTipeOrgOpen(!tipeOrgOpen)}
              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Tipe Organisasi</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {filteredTipeOrganisasi.length}
                </Badge>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", tipeOrgOpen && "rotate-180")} />
            </button>
            {tipeOrgOpen && (
              <>
                {filteredTipeOrganisasi.length === 0 ? (
                  <div className="p-6 border-t border-border">
                    <EmptyState
                      icon={Building2}
                      title="Belum ada tipe organisasi"
                      cta="Tambah Tipe Organisasi"
                      onCta={() => openForm("tipe-organisasi", "add")}
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-border border-t border-border">
                    {filteredTipeOrganisasi.map((tipe) => (
                      <div key={tipe.id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-foreground">{tipe.nama}</p>
                            <Badge variant="outline" className="text-[10px] font-mono">{tipe.code}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tipe.deskripsi}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary" onClick={() => openForm("tipe-organisasi", "edit", tipe)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => openDelete(tipe.nama, tipe.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sektor Industri — Always visible */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Sektor Industri</h3>
                    <p className="text-[11px] text-muted-foreground">Dipakai oleh semua tipe organisasi.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => openForm("sektor-industri", "add")}>
                  <Plus className="h-3 w-3" />
                  <span className="hidden sm:inline">Tambah</span>
                </Button>
              </div>
            </div>
            {filteredSektorIndustri.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Globe}
                  title="Belum ada sektor industri"
                  cta="Tambah Sektor Industri"
                  onCta={() => openForm("sektor-industri", "add")}
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredSektorIndustri.map((sektor) => (
                  <div key={sektor.id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 hover:bg-muted/50 transition-colors">
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">{sektor.code}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{sektor.nama}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{sektor.deskripsi}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      Semua tipe
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary" onClick={() => openForm("sektor-industri", "edit", sektor)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => openDelete(sektor.nama, sektor.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Form Modal ─────────────────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formTarget === "sub-kategori" && (
              <div className="space-y-2">
                <Label>Kategori Utama *</Label>
                <Select value={formData.parentId} onValueChange={(v) => setFormData({ ...formData, parentId: v })}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih kategori utama" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {kategoriProfesi.map((k) => (
                      <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>
                {formTarget === "sub-kategori" ? "Nama Sub Kategori" : formTarget === "kategori-utama" ? "Nama Kategori Utama" : formTarget === "tipe-organisasi" ? "Nama Tipe Organisasi" : "Nama Sektor Industri"} *
              </Label>
              <Input
                placeholder={
                  formTarget === "kategori-utama" ? "Contoh: Data" :
                  formTarget === "sub-kategori" ? "Contoh: Data Analytics" :
                  formTarget === "tipe-organisasi" ? "Contoh: Startup" :
                  "Contoh: Teknologi Informasi"
                }
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input
                placeholder={
                  formTarget === "kategori-utama" ? "Contoh: DATA" :
                  formTarget === "sub-kategori" ? "Contoh: ANALYTICS" :
                  formTarget === "tipe-organisasi" ? "Contoh: STARTUP" :
                  "Contoh: IT"
                }
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi *</Label>
              <Textarea
                placeholder={
                  formTarget === "sub-kategori" ? "Jelaskan sub kategori ini..." :
                  "Jelaskan cakupan kategori ini..."
                }
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button
              onClick={handleFormSubmit}
              disabled={!formData.nama || !formData.code || !formData.deskripsi || (formTarget === "sub-kategori" && !formData.parentId)}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Dialog ──────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Anda akan menghapus <strong>"{deleteTarget?.nama}"</strong>. Tindakan ini tidak dapat dibatalkan. Pastikan data ini tidak sedang digunakan.
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
    </div>
  );
}

// ─── Shared Empty State ──────────────────────────────────────────
function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
  onCta,
}: {
  icon: React.ElementType;
  title: string;
  body?: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {body && <p className="text-sm text-muted-foreground mt-1">{body}</p>}
      <Button variant="outline" size="sm" className="mt-3 gap-1.5 text-xs" onClick={onCta}>
        <Plus className="h-3.5 w-3.5" />
        {cta}
      </Button>
    </div>
  );
}
