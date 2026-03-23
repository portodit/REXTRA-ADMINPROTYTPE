import { useState, useCallback, useMemo, Fragment, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Search, Plus, ChevronDown, ChevronRight, AlertTriangle,
  Edit, Trash2, Layers, PackageOpen, SearchX, AlertCircle,
  RefreshCw, Info, ShieldAlert, Bug, X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFiturData } from "@/hooks/useFiturHakAksesData";
import type { Fitur, SubFitur } from "@/hooks/useFiturHakAksesData";

type DemoState = "data" | "loading" | "empty" | "error";
type DebugOverride = DemoState | "expand-with-data" | "expand-empty" | "none";

// ── Helpers ────────────────────────────────────────────────────────
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();

const generatePrefix = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].substring(0, 2).toLowerCase().replace(/[^a-z]/g, "");
  return words.map((w) => w[0]).join("").toLowerCase().replace(/[^a-z]/g, "").substring(0, 4);
};

const validateSlug = (slug: string): { valid: boolean; message: string } => {
  if (!slug) return { valid: false, message: "Slug wajib diisi." };
  if (/\s/.test(slug)) return { valid: false, message: "Slug harus huruf kecil tanpa spasi. Contoh: portfolio_builder." };
  if (/-/.test(slug)) return { valid: false, message: "Gunakan underscore, bukan dash (-). Contoh: portfolio_builder." };
  if (/[A-Z]/.test(slug)) return { valid: false, message: "Slug harus huruf kecil tanpa spasi. Contoh: portfolio_builder." };
  if (/[^a-z0-9_]/.test(slug)) return { valid: false, message: "Slug hanya boleh huruf kecil, angka, dan underscore." };
  if (/^[0-9]/.test(slug)) return { valid: false, message: "Slug tidak boleh diawali angka." };
  return { valid: true, message: "" };
};

// Check if a fitur is connected to access system
const isFiturConnected = (fitur: Fitur) => {
  return fitur.usedByEntitlements.length > 0 || (fitur.mappedToPlans ?? 0) > 0;
};

// Check if a sub fitur is connected to access system
const isSubFiturConnected = (sf: SubFitur) => {
  return sf.usedByEntitlements > 0 || sf.mappedToPlans > 0;
};

// Check if slug/prefix should be immutable (per backend brief: only when entitlements exist)
const isSlugImmutable = (fitur: Fitur) => {
  return fitur.usedByEntitlements.length > 0;
};

const isSubSlugImmutable = (sf: SubFitur) => {
  return sf.usedByEntitlements > 0;
};

// Check if tipe fitur can be changed
const canChangeTipeFitur = (fitur: Fitur) => {
  if (fitur.subFitur.length > 0) return false;
  if (fitur.usedByEntitlements.length > 0) return false;
  if (fitur.mappedToPlans > 0) return false;
  return true;
};

// ── Component ──────────────────────────────────────────────────────
export function FiturSubFiturTab() {
  const {
    fiturData, loadState, setLoadState, fetchData: refetchFitur,
    addFitur: dbAddFitur, updateFitur: dbUpdateFitur, deleteFitur: dbDeleteFitur, deleteFiturCascade: dbDeleteFiturCascade,
    addSubFitur: dbAddSubFitur, updateSubFitur: dbUpdateSubFitur, deleteSubFitur: dbDeleteSubFitur, deleteSubFiturCascade: dbDeleteSubFiturCascade,
  } = useFiturData();

  const [debugOverride, setDebugOverride] = useState<DebugOverride>("none");
  const [debugMenuOpen, setDebugMenuOpen] = useState(false);
  const demoState: DemoState = debugOverride === "none" ? loadState
    : debugOverride === "expand-with-data" || debugOverride === "expand-empty" ? "data"
    : debugOverride;
  const [fiturSearch, setFiturSearch] = useState("");
  const [fiturStatusFilter, setFiturStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [expandedFitur, setExpandedFitur] = useState<string[]>([]);

  // Auto-expand rows based on debug override
  useEffect(() => {
    if (debugOverride === "expand-with-data") {
      const bertingkatWithSubs = fiturData.filter(f => f.type === "bertingkat" && f.subFitur.length > 0).map(f => f.id);
      setExpandedFitur(bertingkatWithSubs);
    } else if (debugOverride === "expand-empty") {
      const bertingkatEmpty = fiturData.filter(f => f.type === "bertingkat" && f.subFitur.length === 0).map(f => f.id);
      const bertingkatWithSubs = fiturData.filter(f => f.type === "bertingkat" && f.subFitur.length > 0).map(f => f.id);
      setExpandedFitur([...bertingkatEmpty, ...bertingkatWithSubs]);
    }
  }, [debugOverride, fiturData]);

  // Modals
  const [fiturModalOpen, setFiturModalOpen] = useState(false);
  const [subFiturModalOpen, setSubFiturModalOpen] = useState(false);
  const [editingFitur, setEditingFitur] = useState<Fitur | null>(null);
  const [editingSubFitur, setEditingSubFitur] = useState<{ fiturId: string; subFitur: SubFitur | null }>({ fiturId: "", subFitur: null });
  const [showPostSaveCta, setShowPostSaveCta] = useState(false);
  const [lastSavedFiturId, setLastSavedFiturId] = useState("");

  // Delete modals
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteWarningData, setDeleteWarningData] = useState<{ type: "fitur" | "subfitur"; fiturId: string; subFiturId?: string; name: string; entitlementCount: number; planCount: number }>({ type: "fitur", fiturId: "", name: "", entitlementCount: 0, planCount: 0 });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "fitur" | "subfitur"; fiturId: string; subFiturId?: string; name: string }>({ type: "fitur", fiturId: "", name: "" });

  // Fitur form
  const [fiturForm, setFiturForm] = useState({
    name: "",
    slug: "",
    prefix: "",
    type: "tunggal" as "tunggal" | "bertingkat",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [prefixManuallyEdited, setPrefixManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const [editConfirmChecked, setEditConfirmChecked] = useState(false);

  // Sub Fitur form
  const [subFiturForm, setSubFiturForm] = useState({
    fiturId: "",
    name: "",
    slug: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [subSlugManuallyEdited, setSubSlugManuallyEdited] = useState(false);
  const [subSlugError, setSubSlugError] = useState("");
  const [subEditConfirmChecked, setSubEditConfirmChecked] = useState(false);

  // ── Filtered data ──
  const filteredFiturData = useMemo(() => {
    if (demoState !== "data") return [];
    return fiturData.filter((f) => {
      const q = fiturSearch.toLowerCase();
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.slug.toLowerCase().includes(q) || f.prefix.toLowerCase().includes(q);
      const matchStatus = fiturStatusFilter === "all" || f.status === fiturStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [fiturData, fiturSearch, fiturStatusFilter, demoState]);

  const isFilterActive = fiturSearch.trim() !== "" || fiturStatusFilter !== "all";
  const isFilterEmpty = demoState === "data" && filteredFiturData.length === 0 && isFilterActive;
  const isDataEmpty = demoState === "data" && fiturData.length === 0;

  // ── Toggle expand ──
  const toggleExpand = useCallback((id: string, type: Fitur["type"]) => {
    if (type === "tunggal") return;
    setExpandedFitur((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // ── Fitur form handlers ──
  const openAddFiturModal = () => {
    setEditingFitur(null);
    setFiturForm({ name: "", slug: "", prefix: "", type: "tunggal", description: "", status: "active" });
    setSlugManuallyEdited(false);
    setPrefixManuallyEdited(false);
    setSlugError("");
    setPrefixError("");
    setEditConfirmChecked(false);
    setFiturModalOpen(true);
  };

  const openEditFiturModal = (fitur: Fitur) => {
    setEditingFitur(fitur);
    setFiturForm({
      name: fitur.name,
      slug: fitur.slug,
      prefix: fitur.prefix,
      type: fitur.type,
      description: fitur.description,
      status: fitur.status,
    });
    setSlugManuallyEdited(true);
    setPrefixManuallyEdited(true);
    setSlugError("");
    setPrefixError("");
    setEditConfirmChecked(false);
    setFiturModalOpen(true);
  };

  const handleFiturNameChange = (name: string) => {
    setFiturForm((prev) => ({ ...prev, name }));
    if (!slugManuallyEdited) {
      const autoSlug = generateSlug(name);
      setFiturForm((prev) => ({ ...prev, slug: autoSlug }));
      const v = validateSlug(autoSlug);
      setSlugError(v.valid ? "" : v.message);
    }
    if (!prefixManuallyEdited) {
      const autoPrefix = generatePrefix(name);
      setFiturForm((prev) => ({ ...prev, prefix: autoPrefix }));
      if (autoPrefix) {
        const exists = fiturData.some((f) => f.prefix === autoPrefix && f.id !== editingFitur?.id);
        setPrefixError(exists ? "Prefix sudah digunakan. Gunakan prefix lain yang unik." : "");
      } else {
        setPrefixError("");
      }
    }
  };

  const handleFiturSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setFiturForm((prev) => ({ ...prev, slug }));
    const v = validateSlug(slug);
    setSlugError(v.valid ? "" : v.message);
    if (v.valid) {
      const exists = fiturData.some((f) => f.slug === slug && f.id !== editingFitur?.id);
      if (exists) setSlugError("Slug sudah digunakan. Gunakan slug lain yang unik.");
    }
  };

  const handlePrefixChange = (prefix: string) => {
    setPrefixManuallyEdited(true);
    setFiturForm((prev) => ({ ...prev, prefix }));
    const v = validateSlug(prefix);
    if (!prefix) { setPrefixError("Prefix wajib diisi."); return; }
    if (!v.valid) { setPrefixError(v.message); return; }
    const exists = fiturData.some((f) => f.prefix === prefix && f.id !== editingFitur?.id);
    if (exists) { setPrefixError("Prefix sudah digunakan. Gunakan prefix lain yang unik."); return; }
    setPrefixError("");
  };

  const saveFitur = async () => {
    if (!fiturForm.name.trim()) { toast.error("Nama fitur wajib diisi"); return; }
    const sv = validateSlug(fiturForm.slug);
    if (!sv.valid) { setSlugError(sv.message); return; }
    if (!fiturForm.prefix.trim()) { setPrefixError("Prefix wajib diisi."); return; }
    const pv = validateSlug(fiturForm.prefix);
    if (!pv.valid) { setPrefixError(pv.message); return; }

    const slugExists = fiturData.some((f) => f.slug === fiturForm.slug && f.id !== editingFitur?.id);
    if (slugExists) { setSlugError("Slug sudah digunakan. Gunakan slug lain yang unik."); return; }
    const prefixExists = fiturData.some((f) => f.prefix === fiturForm.prefix && f.id !== editingFitur?.id);
    if (prefixExists) { setPrefixError("Prefix sudah digunakan. Gunakan prefix lain yang unik."); return; }

    if (editingFitur) {
      // Check if deactivating connected fitur requires confirmation
      const isDeactivating = isFiturConnected(editingFitur) && fiturForm.status === "inactive" && editingFitur.status === "active";
      if (isDeactivating && !editConfirmChecked) {
        toast.error("Centang konfirmasi untuk menyimpan perubahan");
        return;
      }
      const ok = await dbUpdateFitur(editingFitur.id, fiturForm);
      if (!ok) return;
      toast.success("Perubahan berhasil disimpan");
      setFiturModalOpen(false);
    } else {
      const newFitur = await dbAddFitur(fiturForm);
      if (!newFitur) return;
      toast.success("Fitur berhasil ditambahkan");

      if (fiturForm.type === "bertingkat") {
        setLastSavedFiturId(newFitur.id);
        setShowPostSaveCta(true);
        setFiturModalOpen(false);
      } else {
        setFiturModalOpen(false);
      }
    }
  };

  // ── Sub Fitur form handlers ──
  const openAddSubFiturModal = (fiturId: string) => {
    setEditingSubFitur({ fiturId, subFitur: null });
    setSubFiturForm({ fiturId, name: "", slug: "", description: "", status: "active" });
    setSubSlugManuallyEdited(false);
    setSubSlugError("");
    setSubEditConfirmChecked(false);
    setSubFiturModalOpen(true);
  };

  const openEditSubFiturModal = (fiturId: string, subFitur: SubFitur) => {
    setEditingSubFitur({ fiturId, subFitur });
    setSubFiturForm({
      fiturId,
      name: subFitur.name,
      slug: subFitur.slug,
      description: subFitur.description,
      status: subFitur.status,
    });
    setSubSlugManuallyEdited(true);
    setSubSlugError("");
    setSubEditConfirmChecked(false);
    setSubFiturModalOpen(true);
  };

  const handleSubNameChange = (name: string) => {
    setSubFiturForm((prev) => ({ ...prev, name }));
    if (!subSlugManuallyEdited) {
      const autoSlug = generateSlug(name);
      setSubFiturForm((prev) => ({ ...prev, slug: autoSlug }));
      const v = validateSlug(autoSlug);
      setSubSlugError(v.valid ? "" : v.message);
    }
  };

  const handleSubSlugChange = (slug: string) => {
    setSubSlugManuallyEdited(true);
    setSubFiturForm((prev) => ({ ...prev, slug }));
    const v = validateSlug(slug);
    setSubSlugError(v.valid ? "" : v.message);
    if (v.valid) {
      const parentFitur = fiturData.find((f) => f.id === subFiturForm.fiturId);
      const exists = parentFitur?.subFitur.some((sf) => sf.slug === slug && sf.id !== editingSubFitur.subFitur?.id);
      if (exists) setSubSlugError("Slug sudah digunakan dalam fitur ini. Gunakan slug lain yang unik.");
    }
  };

  const getParentFitur = (fiturId: string) => fiturData.find((f) => f.id === fiturId);

  const saveSubFitur = async () => {
    if (!subFiturForm.name.trim()) { toast.error("Nama sub fitur wajib diisi"); return; }
    const sv = validateSlug(subFiturForm.slug);
    if (!sv.valid) { setSubSlugError(sv.message); return; }

    const parentFitur = getParentFitur(subFiturForm.fiturId);
    const slugExists = parentFitur?.subFitur.some((sf) => sf.slug === subFiturForm.slug && sf.id !== editingSubFitur.subFitur?.id);
    if (slugExists) { setSubSlugError("Slug sudah digunakan dalam fitur ini. Gunakan slug lain yang unik."); toast.error("Gagal menyimpan. Data sudah digunakan/sudah ada."); return; }

    if (editingSubFitur.subFitur) {
      // Check if deactivating connected sub fitur requires confirmation
      const isDeactivating = isSubFiturConnected(editingSubFitur.subFitur) && subFiturForm.status === "inactive" && editingSubFitur.subFitur.status === "active";
      if (isDeactivating && !subEditConfirmChecked) {
        toast.error("Centang konfirmasi untuk menyimpan perubahan");
        return;
      }
      const ok = await dbUpdateSubFitur(editingSubFitur.fiturId, editingSubFitur.subFitur.id, {
        name: subFiturForm.name, slug: subFiturForm.slug,
        description: subFiturForm.description, status: subFiturForm.status,
      });
      if (!ok) return;
      toast.success("Perubahan berhasil disimpan");
    } else {
      const result = await dbAddSubFitur(subFiturForm.fiturId, {
        name: subFiturForm.name, slug: subFiturForm.slug,
        description: subFiturForm.description, status: subFiturForm.status,
      });
      if (!result) return;
      toast.success("Sub fitur berhasil ditambahkan");
    }
    setSubFiturModalOpen(false);
  };

  // ── Delete handlers ──
  const handleDeleteFitur = (fitur: Fitur) => {
    if (isFiturConnected(fitur)) {
      setDeleteWarningData({
        type: "fitur",
        fiturId: fitur.id,
        name: fitur.name,
        entitlementCount: fitur.usedByEntitlements.length,
        planCount: fitur.mappedToPlans ?? 0,
      });
      setDeleteWarningOpen(true);
    } else {
      setDeleteTarget({ type: "fitur", fiturId: fitur.id, name: fitur.name });
      setDeleteConfirmOpen(true);
    }
  };

  const handleDeleteSubFitur = (fitur: Fitur, sf: SubFitur) => {
    if (isSubFiturConnected(sf)) {
      setDeleteWarningData({
        type: "subfitur",
        fiturId: fitur.id,
        subFiturId: sf.id,
        name: sf.name,
        entitlementCount: sf.usedByEntitlements,
        planCount: sf.mappedToPlans,
      });
      setDeleteWarningOpen(true);
    } else {
      setDeleteTarget({ type: "subfitur", fiturId: fitur.id, subFiturId: sf.id, name: sf.name });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget.type === "fitur") {
      const ok = await dbDeleteFitur(deleteTarget.fiturId);
      if (!ok) return;
      setExpandedFitur((prev) => prev.filter((id) => id !== deleteTarget.fiturId));
      toast.success(`Fitur "${deleteTarget.name}" berhasil dihapus`);
    } else {
      const ok = await dbDeleteSubFitur(deleteTarget.fiturId, deleteTarget.subFiturId!);
      if (!ok) return;
      toast.success(`Sub fitur "${deleteTarget.name}" berhasil dihapus`);
    }
    setDeleteConfirmOpen(false);
  };

  const confirmCascadeDelete = async () => {
    if (deleteWarningData.type === "fitur") {
      const ok = await dbDeleteFiturCascade(deleteWarningData.fiturId);
      if (!ok) return;
      setExpandedFitur((prev) => prev.filter((id) => id !== deleteWarningData.fiturId));
      toast.success(`Fitur "${deleteWarningData.name}" dan relasi terkait berhasil dihapus`);
    } else {
      const ok = await dbDeleteSubFiturCascade(deleteWarningData.fiturId, deleteWarningData.subFiturId!);
      if (!ok) return;
      toast.success(`Sub fitur "${deleteWarningData.name}" dan relasi terkait berhasil dihapus`);
    }
    setDeleteWarningOpen(false);
    // Refetch to get updated counts
    refetchFitur();
  };

  // ── Render helpers ──
  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-3"><Skeleton className="h-5 w-full" /></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-t flex items-center gap-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Gagal memuat data</h3>
      <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
        Terjadi kesalahan saat memuat data fitur. Silakan coba lagi.
      </p>
      <Button variant="outline" className="gap-2" onClick={() => refetchFitur()}>
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );

  const renderGlobalEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Belum ada data fitur</h3>
      <p className="text-sm text-muted-foreground mb-1 text-center max-w-md">
        Fitur adalah struktur modul yang menjadi dasar pembentukan hak akses (entitlement) untuk membership.
      </p>
      <p className="text-xs text-muted-foreground mb-5 text-center max-w-md">
        Mulai dengan menambahkan fitur pertama Anda.
      </p>
      <Button onClick={openAddFiturModal} className="gap-2">
        <Plus className="h-4 w-4" />
        Tambah Fitur
      </Button>
    </div>
  );

  const renderFilterEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Data tidak ditemukan</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {fiturSearch
          ? `Pencarian untuk "${fiturSearch}" tidak ditemukan. Coba kata kunci lain atau ubah filter.`
          : "Tidak ada data yang sesuai dengan filter saat ini. Coba ubah filter Anda."}
      </p>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Fitur & Sub Fitur</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola struktur fitur dan sub fitur sebagai acuan pembentukan entitlement serta konfigurasi akses membership.
          </p>
        </div>

        {/* Callout - Catatan Penting */}
        <Collapsible>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <CollapsibleTrigger className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 shrink-0" />
                <p className="font-medium text-amber-800 dark:text-amber-200 text-xs sm:text-sm">Catatan Penting</p>
              </div>
              <ChevronDown className="h-4 w-4 text-amber-600 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="text-amber-700 dark:text-amber-300 space-y-2.5 text-xs sm:text-sm ml-6 sm:ml-8">
                <ul className="list-disc list-inside space-y-1.5">
                  <li>
                    <strong>Fitur & Sub Fitur</strong> adalah master struktur modul (identifier) yang menjadi referensi untuk membentuk <strong>Hak Akses (Entitlement)</strong> dan konfigurasi akses pada plan membership.
                  </li>
                  <li>
                    <strong>Hak Akses (Entitlement)</strong> adalah kode izin berbasis string yang dipakai backend untuk menentukan user boleh menjalankan aksi tertentu (mis. <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[11px]">view</code>, <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[11px]">use</code>, <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[11px]">create</code>, dll).
                  </li>
                </ul>
                <div className="bg-amber-100/60 dark:bg-amber-900/30 rounded-md p-2.5 space-y-1.5">
                  <p className="font-semibold text-xs">Aturan format kode hak akses (key):</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Gunakan titik (<code className="font-mono">{`.`}</code>) sebagai pemisah segmen.</li>
                    <li>Gunakan underscore (<code className="font-mono">{`_`}</code>) hanya untuk pemisah kata dalam satu segmen (contoh: <code className="font-mono">jelajah_profesi</code>, <code className="font-mono">uji_kecocokan</code>).</li>
                    <li>Fitur Tunggal: <code className="font-mono">{`{prefix}.{action}`}</code> → contoh: <code className="font-mono">cv.download</code>, <code className="font-mono">pf.create</code></li>
                    <li>Fitur Bertingkat: <code className="font-mono">{`{prefix}.{scope}.{action}`}</code> → contoh: <code className="font-mono">kk.jelajah_profesi.view</code>, <code className="font-mono">kk.uji_kecocokan.use</code></li>
                  </ul>
                </div>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Kode hak akses harus <strong>unik</strong>. Sistem akan menolak jika kode yang sama sudah pernah digunakan.</li>
                  <li><strong>Slug/Prefix</strong> bersifat immutable setelah data terhubung ke sistem akses (digunakan oleh entitlement atau sudah dimapping ke plan membership).</li>
                  <li>Untuk perubahan struktur, admin harus membuat data baru dan melakukan migrasi mapping secara manual.</li>
                  <li>
                    <strong>Catatan tipe akses:</strong> Tipe akses (unlimited / frequency-limited / token-gated) tidak ditentukan di master sub fitur, melainkan di konfigurasi mapping plan ↔ entitlement.
                  </li>
                </ul>
                <div className="bg-amber-100/60 dark:bg-amber-900/30 rounded-md p-2.5 space-y-1.5">
                  <p className="font-semibold text-xs">Tentang Status Aktif/Nonaktif:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Status di master data bukan untuk "boleh dipakai user atau tidak", melainkan untuk "boleh dipakai untuk konfigurasi baru".</li>
                    <li><strong>Fitur Nonaktif</strong> → tidak muncul sebagai pilihan saat membuat konfigurasi baru (mis. dropdown "Pilih Fitur" di tab Hak Akses / mapping plan).</li>
                    <li><strong>Sub Fitur Nonaktif</strong> → tidak muncul sebagai pilihan saat membuat konfigurasi baru.</li>
                    <li>Data/hubungan yang sudah terbentuk sebelumnya (entitlement existing, mapping plan existing) <strong>tetap ada dan tetap berjalan</strong>.</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Content based on demo state */}
        {demoState === "loading" ? renderLoadingState() :
         demoState === "error" ? renderErrorState() :
         demoState === "empty" || isDataEmpty ? renderGlobalEmptyState() : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari fitur berdasarkan nama atau slug…"
                  value={fiturSearch}
                  onChange={(e) => setFiturSearch(e.target.value)}
                  className="pl-9 h-9 sm:h-10"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Select value={fiturStatusFilter} onValueChange={(v) => setFiturStatusFilter(v as typeof fiturStatusFilter)}>
                  <SelectTrigger className="w-[110px] sm:w-[140px] h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={openAddFiturModal} size="sm" className="h-9 sm:h-10 text-xs sm:text-sm gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Tambah Fitur</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </div>
            </div>

            {/* Table or filter empty */}
            {isFilterEmpty ? renderFilterEmptyState() : (
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[44px]"></TableHead>
                      <TableHead>Nama Fitur</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Prefix</TableHead>
                      <TableHead className="text-center">Tipe</TableHead>
                      <TableHead className="text-center">Sub Fitur</TableHead>
                      <TableHead className="text-center">Digunakan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[90px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiturData.map((fitur) => (
                      <Fragment key={fitur.id}>
                        <TableRow className="group">
                          <TableCell className="pr-0">
                            <button
                              onClick={() => toggleExpand(fitur.id, fitur.type)}
                              className={cn(
                                "p-1 rounded transition-colors",
                                fitur.type === "tunggal"
                                  ? "opacity-30 cursor-not-allowed"
                                  : "hover:bg-muted cursor-pointer"
                              )}
                              disabled={fitur.type === "tunggal"}
                            >
                              {expandedFitur.includes(fitur.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell className="font-medium">{fitur.name}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{fitur.slug}</code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono font-semibold">{fitur.prefix}</code>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={fitur.type === "bertingkat" ? "default" : "secondary"} className="text-[11px]">
                              {fitur.type === "bertingkat" ? "Bertingkat" : "Tunggal"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {fitur.type === "tunggal" ? "—" : fitur.subFitur.length}
                          </TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted text-sm">
                                  {fitur.usedByEntitlements.length} entitlements
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs">
                                {fitur.usedByEntitlements.length === 0 ? (
                                  <p className="text-xs text-muted-foreground">Belum digunakan</p>
                                ) : (
                                  <>
                                    <p className="font-medium mb-1.5 text-xs">Entitlements:</p>
                                    <ul className="space-y-0.5">
                                      {fitur.usedByEntitlements.slice(0, 5).map((e) => (
                                        <li key={e} className="text-xs font-mono">{e}</li>
                                      ))}
                                      {fitur.usedByEntitlements.length > 5 && (
                                        <li className="text-xs text-muted-foreground">dan {fitur.usedByEntitlements.length - 5} lainnya</li>
                                      )}
                                    </ul>
                                  </>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[11px]",
                                fitur.status === "active"
                                  ? "bg-success/10 text-success border-success/30"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {fitur.status === "active" ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditFiturModal(fitur)}>
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p className="text-xs">Edit</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDeleteFitur(fitur)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Hapus</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expand Row — Sub Fitur Panel */}
                        {expandedFitur.includes(fitur.id) && fitur.type === "bertingkat" && (
                          <TableRow>
                            <TableCell colSpan={9} className="bg-muted/20 p-0 border-l-2 border-l-primary/30">
                              <div className="p-4 sm:p-5 pl-8 sm:pl-12 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-foreground">Sub Fitur</h4>
                                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => openAddSubFiturModal(fitur.id)}>
                                    <Plus className="h-3 w-3" />
                                    Sub Fitur
                                  </Button>
                                </div>

                                {fitur.subFitur.length === 0 ? (
                                  <div className="text-center py-8 bg-card rounded-lg border border-dashed border-border">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                      <PackageOpen className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm text-foreground">Belum ada sub fitur</p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                                      Sub fitur membantu membentuk struktur akses yang lebih spesifik. Contoh: Portfolio → Auto-fill, AI Check.
                                    </p>
                                    <Button size="sm" variant="outline" className="mt-4 text-xs gap-1.5" onClick={() => openAddSubFiturModal(fitur.id)}>
                                      <Plus className="h-3 w-3" />
                                      Tambah Sub Fitur Pertama
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border rounded-lg overflow-hidden bg-card">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-muted/40">
                                          <TableHead className="text-xs">Nama Sub Fitur</TableHead>
                                          <TableHead className="text-xs">Slug</TableHead>
                                          <TableHead className="text-xs">Preview Scope Key</TableHead>
                                          <TableHead className="text-xs text-center">Digunakan</TableHead>
                                          <TableHead className="text-xs text-center">Status</TableHead>
                                          <TableHead className="text-xs w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {fitur.subFitur.map((sf) => (
                                          <TableRow key={sf.id}>
                                            <TableCell className="font-medium text-sm">{sf.name}</TableCell>
                                            <TableCell>
                                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{sf.slug}</code>
                                            </TableCell>
                                            <TableCell>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono cursor-help">
                                                    {fitur.prefix}.{sf.slug}
                                                  </code>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="max-w-sm">
                                                  <p className="text-xs">Scope key ini akan dipakai di Tab Hak Akses untuk membentuk entitlement, contoh: <code className="font-mono">{fitur.prefix}.{sf.slug}.view</code></p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-muted-foreground">
                                              {sf.usedByEntitlements} entitlements
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Badge
                                                variant="outline"
                                                className={cn(
                                                  "text-[10px]",
                                                  sf.status === "active"
                                                    ? "bg-success/10 text-success border-success/30"
                                                    : "bg-muted text-muted-foreground"
                                                )}
                                              >
                                                {sf.status === "active" ? "Aktif" : "Nonaktif"}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center gap-1">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSubFiturModal(fitur.id, sf)}>
                                                      <Edit className="h-3 w-3" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent><p className="text-xs">Edit</p></TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                      onClick={() => handleDeleteSubFitur(fitur, sf)}
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p className="text-xs">Hapus</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Warning Modal (Data terhubung — cascade delete) ── */}
      <Dialog open={deleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-7 w-7 text-destructive" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-lg">Hapus data yang terhubung?</DialogTitle>
              <DialogDescription className="text-sm">
                {deleteWarningData.type === "fitur" ? "Fitur" : "Sub fitur"}{" "}
                <strong className="text-foreground">"{deleteWarningData.name}"</strong>{" "}
                masih terhubung ke sistem akses — digunakan oleh entitlement dan/atau sudah dimapping ke plan membership.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-2 py-2">
            {deleteWarningData.entitlementCount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Digunakan oleh</p>
                  <p className="text-xs text-muted-foreground">{deleteWarningData.entitlementCount} entitlements</p>
                </div>
              </div>
            )}
            {deleteWarningData.planCount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dimapping pada</p>
                  <p className="text-xs text-muted-foreground">{deleteWarningData.planCount} plan membership</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs text-destructive">
              Jika Anda melanjutkan, sistem akan menghapus entitlement terkait serta menghapus mapping entitlement tersebut dari plan membership. Aksi ini tidak dapat dibatalkan.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteWarningOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCascadeDelete}
              className="w-full sm:w-auto gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Hapus dan Lepaskan Relasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Modal (Data aman untuk dihapus) ── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-7 w-7 text-destructive" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-lg">Hapus data?</DialogTitle>
              <DialogDescription className="text-sm">
                {deleteTarget.type === "fitur" ? "Fitur" : "Sub fitur"}{" "}
                <strong className="text-foreground">"{deleteTarget.name}"</strong>{" "}
                akan dihapus secara permanen. Aksi ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Post-save CTA (Bertingkat) ── */}
      <Dialog open={showPostSaveCta} onOpenChange={setShowPostSaveCta}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Fitur berhasil ditambahkan! 🎉</DialogTitle>
            <DialogDescription>
              Fitur bertingkat memerlukan sub fitur untuk membentuk scope key. Tambahkan sub fitur sekarang?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setShowPostSaveCta(false); }} className="w-full sm:w-auto">
              Nanti saja
            </Button>
            <Button
              onClick={() => {
                setShowPostSaveCta(false);
                openAddSubFiturModal(lastSavedFiturId);
                setExpandedFitur((prev) => [...prev, lastSavedFiturId]);
              }}
              className="w-full sm:w-auto gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Tambah Sub Fitur Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Tambah/Edit Fitur ── */}
      <Dialog open={fiturModalOpen} onOpenChange={setFiturModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFitur ? "Edit Fitur" : "Tambah Fitur Baru"}</DialogTitle>
            <DialogDescription className="space-y-1">
              <span>Fitur digunakan sebagai induk sub fitur dan dasar pembentukan kode hak akses.</span>
              <br />
              <span>Prefix dan slug akan dipakai untuk membentuk key, contoh: <code className="font-mono text-xs">cv.download</code>, <code className="font-mono text-xs">kk.jelajah_profesi.view</code>.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Info block when fields are locked */}
            {editingFitur && isSlugImmutable(editingFitur) && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Data ini masih terhubung ke sistem akses. Untuk perubahan struktur (slug/prefix/tipe), buat data baru dan lakukan migrasi mapping.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Nama Fitur <span className="text-destructive">*</span></Label>
              <Input placeholder="Portofolio" value={fiturForm.name} onChange={(e) => handleFiturNameChange(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Slug Fitur <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="portfolio"
                  value={fiturForm.slug}
                  onChange={(e) => handleFiturSlugChange(e.target.value)}
                  className={cn("font-mono", slugError && "border-destructive")}
                  readOnly={editingFitur ? isSlugImmutable(editingFitur) : false}
                  disabled={editingFitur ? isSlugImmutable(editingFitur) : false}
                />
                {slugError && <p className="text-xs text-destructive">{slugError}</p>}
              </div>
              <div className="space-y-2">
                <Label>Kode Singkat / Prefix <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="pf"
                  value={fiturForm.prefix}
                  onChange={(e) => handlePrefixChange(e.target.value)}
                  className={cn("font-mono", prefixError && "border-destructive")}
                  readOnly={editingFitur ? isSlugImmutable(editingFitur) : false}
                  disabled={editingFitur ? isSlugImmutable(editingFitur) : false}
                />
                {prefixError && <p className="text-xs text-destructive">{prefixError}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipe Fitur <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={fiturForm.type}
                onValueChange={(v) => setFiturForm((prev) => ({ ...prev, type: v as "tunggal" | "bertingkat" }))}
                className="flex gap-4"
                disabled={editingFitur ? !canChangeTipeFitur(editingFitur) : false}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tunggal" id="type-tunggal" />
                  <Label htmlFor="type-tunggal" className="cursor-pointer text-sm">Tunggal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bertingkat" id="type-bertingkat" />
                  <Label htmlFor="type-bertingkat" className="cursor-pointer text-sm">Bertingkat</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {fiturForm.type === "tunggal"
                  ? "Tunggal: tidak memiliki sub fitur. Key langsung berformat prefix.action."
                  : "Bertingkat: memiliki sub fitur. Key berformat prefix.scope.action."}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Textarea
                placeholder="Dokumentasi kegiatan dan prestasi."
                value={fiturForm.description}
                onChange={(e) => setFiturForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={fiturForm.status}
                onValueChange={(v) => setFiturForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="fitur-active" />
                  <Label htmlFor="fitur-active" className="cursor-pointer text-sm">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="fitur-inactive" />
                  <Label htmlFor="fitur-inactive" className="cursor-pointer text-sm">Nonaktif</Label>
                </div>
              </RadioGroup>
              {/* Warning when deactivating connected fitur */}
              {editingFitur && isFiturConnected(editingFitur) && fiturForm.status === "inactive" && editingFitur.status === "active" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2.5 mt-2 space-y-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Fitur ini digunakan oleh {editingFitur.usedByEntitlements.length} hak akses
                    {editingFitur.mappedToPlans > 0 && <> dan termapping ke {editingFitur.mappedToPlans} plan</>}.
                    Menonaktifkan tidak akan menghapus data tersebut, tetapi fitur ini tidak bisa dipilih untuk konfigurasi baru.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="deactivate-fitur-confirm"
                      checked={editConfirmChecked}
                      onCheckedChange={(v) => setEditConfirmChecked(v as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="deactivate-fitur-confirm" className="text-xs cursor-pointer leading-snug text-amber-700 dark:text-amber-300">
                      Saya memahami dampaknya.
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFiturModalOpen(false)}>Batal</Button>
            <Button
              onClick={saveFitur}
              disabled={!!(editingFitur && isFiturConnected(editingFitur) && fiturForm.status === "inactive" && editingFitur.status === "active" && !editConfirmChecked)}
            >
              {editingFitur ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Tambah/Edit Sub Fitur ── */}
      <Dialog open={subFiturModalOpen} onOpenChange={setSubFiturModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSubFitur.subFitur ? "Edit Sub Fitur" : "Tambah Sub Fitur"}
            </DialogTitle>
            <DialogDescription>
              Sub fitur akan menjadi bagian dari scope key untuk membentuk kode hak akses yang lebih spesifik.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Info block when slug is locked */}
            {editingSubFitur.subFitur && isSubSlugImmutable(editingSubFitur.subFitur) && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Data ini masih terhubung ke sistem akses. Untuk perubahan slug, buat data baru dan lakukan migrasi mapping.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Fitur Induk <span className="text-destructive">*</span></Label>
              {editingSubFitur.subFitur ? (
                <Input
                  value={getParentFitur(subFiturForm.fiturId)?.name ? `${getParentFitur(subFiturForm.fiturId)!.name} (${getParentFitur(subFiturForm.fiturId)!.prefix})` : ""}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              ) : (
                <Select
                  value={subFiturForm.fiturId}
                  onValueChange={(v) => setSubFiturForm((prev) => ({ ...prev, fiturId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fitur induk" />
                  </SelectTrigger>
                  <SelectContent>
                    {fiturData.filter((f) => f.type === "bertingkat").map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name} ({f.prefix})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nama Sub Fitur <span className="text-destructive">*</span></Label>
              <Input placeholder="Auto-fill Portofolio" value={subFiturForm.name} onChange={(e) => handleSubNameChange(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Slug Sub Fitur <span className="text-destructive">*</span></Label>
              <Input
                placeholder="auto_fill"
                value={subFiturForm.slug}
                onChange={(e) => handleSubSlugChange(e.target.value)}
                className={cn("font-mono", subSlugError && "border-destructive")}
                readOnly={editingSubFitur.subFitur ? isSubSlugImmutable(editingSubFitur.subFitur) : false}
                disabled={editingSubFitur.subFitur ? isSubSlugImmutable(editingSubFitur.subFitur) : false}
              />
              {subSlugError && <p className="text-xs text-destructive">{subSlugError}</p>}
            </div>

            {/* Preview Scope Key */}
            {subFiturForm.fiturId && subFiturForm.slug && (() => {
              const parent = getParentFitur(subFiturForm.fiturId);
              if (!parent) return null;
              return (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Preview scope key:</p>
                  <code className="text-sm font-mono text-primary font-semibold block">
                    {parent.prefix}.{subFiturForm.slug}
                  </code>
                  <p className="text-[11px] text-muted-foreground">
                    Scope key ini akan dipakai di Tab Hak Akses untuk membentuk entitlement, contoh: <code className="font-mono">{parent.prefix}.{subFiturForm.slug}.view</code>
                  </p>
                </div>
              );
            })()}

            <div className="space-y-2">
              <Label>Deskripsi <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Textarea
                placeholder="Penjelasan singkat tentang sub fitur ini"
                value={subFiturForm.description}
                onChange={(e) => setSubFiturForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={subFiturForm.status}
                onValueChange={(v) => setSubFiturForm((prev) => ({ ...prev, status: v as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="subfitur-active" />
                  <Label htmlFor="subfitur-active" className="cursor-pointer text-sm">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="subfitur-inactive" />
                  <Label htmlFor="subfitur-inactive" className="cursor-pointer text-sm">Nonaktif</Label>
                </div>
              </RadioGroup>
              {/* Warning when deactivating connected sub fitur */}
              {editingSubFitur.subFitur && isSubFiturConnected(editingSubFitur.subFitur) && subFiturForm.status === "inactive" && editingSubFitur.subFitur.status === "active" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2.5 mt-2 space-y-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Sub fitur ini digunakan oleh {editingSubFitur.subFitur.usedByEntitlements} hak akses
                    {editingSubFitur.subFitur.mappedToPlans > 0 && <> dan termapping ke {editingSubFitur.subFitur.mappedToPlans} plan</>}.
                    Menonaktifkan tidak akan menghapus data tersebut, tetapi sub fitur ini tidak bisa dipilih untuk konfigurasi baru.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="deactivate-subfitur-confirm"
                      checked={subEditConfirmChecked}
                      onCheckedChange={(v) => setSubEditConfirmChecked(v as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="deactivate-subfitur-confirm" className="text-xs cursor-pointer leading-snug text-amber-700 dark:text-amber-300">
                      Saya memahami dampaknya.
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubFiturModalOpen(false)}>Batal</Button>
            <Button
              onClick={saveSubFitur}
              disabled={!!(editingSubFitur.subFitur && isSubFiturConnected(editingSubFitur.subFitur) && subFiturForm.status === "inactive" && editingSubFitur.subFitur.status === "active" && !subEditConfirmChecked)}
            >
              {editingSubFitur.subFitur ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Floating Debug Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {debugMenuOpen && (
          <div className="bg-card border border-border rounded-xl shadow-xl p-3 w-56 space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground">🧪 Debug State</p>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setDebugMenuOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            {([
              { key: "none", label: "🔄 Default (Live)", desc: "State asli dari database" },
              { key: "loading", label: "⏳ Loading", desc: "Skeleton loading state" },
              { key: "data", label: "📋 Data Normal", desc: "Tabel dengan data" },
              { key: "expand-with-data", label: "📂 Expand + Data", desc: "Expand semua row bertingkat" },
              { key: "expand-empty", label: "📭 Expand + Empty", desc: "Expand termasuk yang kosong" },
              { key: "empty", label: "🗂️ Empty State", desc: "Belum ada data fitur" },
              { key: "error", label: "❌ Error State", desc: "Gagal memuat data" },
            ] as { key: DebugOverride; label: string; desc: string }[]).map(item => (
              <button
                key={item.key}
                onClick={() => { setDebugOverride(item.key); setDebugMenuOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors",
                  debugOverride === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <span className="block">{item.label}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        )}
        <Button
          size="icon"
          variant={debugOverride !== "none" ? "default" : "outline"}
          className={cn(
            "h-12 w-12 rounded-full shadow-lg",
            debugOverride !== "none" && "animate-pulse"
          )}
          onClick={() => setDebugMenuOpen(prev => !prev)}
        >
          <Bug className="h-5 w-5" />
        </Button>
        {debugOverride !== "none" && (
          <button
            onClick={() => setDebugOverride("none")}
            className="text-[10px] text-muted-foreground underline hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>
    </TooltipProvider>
  );
}
