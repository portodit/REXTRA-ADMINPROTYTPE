import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  Edit, Trash2, Layers, SearchX, AlertCircle,
  RefreshCw, Info, ShieldAlert, Key, ChevronLeft,
  ChevronsLeft, ChevronsRight, X, Download, Bug,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";
import { useFiturData, useKategoriAksiData, useHakAksesData } from "@/hooks/useFiturHakAksesData";
import type { Fitur, HakAkses } from "@/hooks/useFiturHakAksesData";
import { supabase } from "@/integrations/supabase/client";

// ── Helpers ────────────────────────────────────────────────────────
const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_").trim();

const validateSlug = (slug: string): { valid: boolean; message: string } => {
  if (!slug) return { valid: false, message: "Slug wajib diisi." };
  if (/\s/.test(slug)) return { valid: false, message: "Slug harus huruf kecil tanpa spasi." };
  if (/[^a-z0-9_]/.test(slug)) return { valid: false, message: "Slug hanya boleh huruf kecil, angka, dan underscore." };
  if (/^[0-9]/.test(slug)) return { valid: false, message: "Slug tidak boleh diawali angka." };
  return { valid: true, message: "" };
};

const ITEMS_PER_PAGE = 50;

// ── Component ──────────────────────────────────────────────────────
export function HakAksesTab() {
  // Data hooks
  const { fiturData } = useFiturData();
  const {
    kategoriData, addKategori: dbAddKategori, updateKategori: dbUpdateKategori,
    bulkUpdateStatus: dbBulkUpdateKategoriStatus,
  } = useKategoriAksiData();
  const {
    hakAksesData, setHakAksesData,
    addHakAkses: dbAddHakAkses, updateHakAkses: dbUpdateHakAkses,
    deleteHakAkses: dbDeleteHakAkses, bulkUpdateStatus: dbBulkUpdateHakStatus,
    loading: hakLoading,
  } = useHakAksesData();

  // Debug state
  type DebugOverride = "none" | "loading" | "data" | "empty" | "error";
  const [debugOverride, setDebugOverride] = useState<DebugOverride>("none");
  const [debugMenuOpen, setDebugMenuOpen] = useState(false);

  const rawState = hakLoading ? "loading" as const : hakAksesData.length === 0 ? "empty" as const : "data" as const;
  const demoState = debugOverride === "none" ? rawState : debugOverride;

  // Section 1: Kategori Aksi
  const [kategoriCollapsed, setKategoriCollapsed] = useState(false);
  const [kategoriModalOpen, setKategoriModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState<ReturnType<typeof useKategoriAksiData>["kategoriData"][0] | null>(null);
  const [kategoriForm, setKategoriForm] = useState({ name: "", slug: "", description: "", status: "active" as "active" | "inactive" });
  const [kategoriSlugManual, setKategoriSlugManual] = useState(false);
  const [kategoriNameError, setKategoriNameError] = useState("");
  const [kategoriSlugError, setKategoriSlugError] = useState("");
  const [kategoriConfirmChecked, setKategoriConfirmChecked] = useState(false);
  const [kategoriSelectedIds, setKategoriSelectedIds] = useState<string[]>([]);
  const [hakSearch, setHakSearch] = useState("");
  const [hakStatusFilter, setHakStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [hakLevelFilter, setHakLevelFilter] = useState<"all" | "fitur" | "sub_fitur">("all");
  const [hakFiturFilter, setHakFiturFilter] = useState<string>("all");
  const [hakSubFiturFilter, setHakSubFiturFilter] = useState<string>("all");
  const [hakKategoriFilter, setHakKategoriFilter] = useState<string>("all");
  const [hakSortBy, setHakSortBy] = useState<"name" | "key">("name");
  const [hakPage, setHakPage] = useState(1);
  const [hakSelectedIds, setHakSelectedIds] = useState<string[]>([]);
  const [hakViewMode, setHakViewMode] = useState<"flat" | "grouped">("flat");

  // Modals
  const [hakModalOpen, setHakModalOpen] = useState(false);
  const [editingHak, setEditingHak] = useState<HakAkses | null>(null);
  const [hakForm, setHakForm] = useState({
    fiturId: "", level: "fitur" as "fitur" | "sub_fitur", subFiturId: "",
    kategoriAksiId: "", name: "", description: "", status: "active" as "active" | "inactive",
    manualKey: false, manualKeyValue: "",
    restrictionType: "unlimited" as "unlimited" | "token_gated" | "frequency_limited" | "locked",
    tokenCost: 1,
  });
  const [hakConfirmChecked, setHakConfirmChecked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HakAkses | null>(null);

  // Bulk action modals
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<"activate" | "deactivate">("activate");
  const [bulkActionSection, setBulkActionSection] = useState<"kategori" | "hak">("hak");

  // ── Computed ──
  const activeKategori = useMemo(() => kategoriData.filter(k => k.status === "active"), [kategoriData]);

  const filteredHakAkses = useMemo(() => {
    if (demoState !== "data") return [];
    let data = hakAksesData.filter(h => {
      const q = hakSearch.toLowerCase();
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.key.toLowerCase().includes(q) || h.fiturName.toLowerCase().includes(q) || h.subFiturName.toLowerCase().includes(q);
      const matchStatus = hakStatusFilter === "all" || h.status === hakStatusFilter;
      const matchLevel = hakLevelFilter === "all" || h.level === hakLevelFilter;
      const matchFitur = hakFiturFilter === "all" || h.fiturPrefix === hakFiturFilter;
      const matchSubFitur = hakSubFiturFilter === "all" || h.key.includes(`.${hakSubFiturFilter}.`);
      const matchKategori = hakKategoriFilter === "all" || h.kategoriAksiSlug === hakKategoriFilter;
      return matchSearch && matchStatus && matchLevel && matchFitur && matchSubFitur && matchKategori;
    });
    data.sort((a, b) => hakSortBy === "name" ? a.name.localeCompare(b.name) : a.key.localeCompare(b.key));
    return data;
  }, [hakAksesData, hakSearch, hakStatusFilter, hakLevelFilter, hakFiturFilter, hakSubFiturFilter, hakKategoriFilter, hakSortBy, demoState]);

  const totalPages = Math.max(1, Math.ceil(filteredHakAkses.length / ITEMS_PER_PAGE));
  const paginatedHakAkses = filteredHakAkses.slice((hakPage - 1) * ITEMS_PER_PAGE, hakPage * ITEMS_PER_PAGE);

  const isFilterActive = hakSearch.trim() !== "" || hakStatusFilter !== "all" || hakLevelFilter !== "all" || hakFiturFilter !== "all" || hakKategoriFilter !== "all";

  // Sub fitur options for filter (conditional on fitur filter)
  const filterSubFiturOptions = useMemo(() => {
    if (hakFiturFilter === "all") return [];
    const fitur = fiturData.find(f => f.prefix === hakFiturFilter);
    return fitur?.subFitur.filter(sf => sf.status === "active") || [];
  }, [hakFiturFilter, fiturData]);

  // Smart dropdown: get available categories for the selected fitur+level+subfitur combo (exclude already-created entitlements)
  const availableKategoriForModal = useMemo(() => {
    if (!hakForm.fiturId) return activeKategori;
    const fitur = fiturData.find(f => f.id === hakForm.fiturId);
    if (!fitur) return activeKategori;

    return activeKategori.filter(k => {
      let expectedKey: string;
      if (hakForm.level === "fitur") {
        expectedKey = `${fitur.prefix}.${k.slug}`;
      } else {
        const sf = fitur.subFitur.find(s => s.id === hakForm.subFiturId);
        if (!sf) return true;
        expectedKey = `${fitur.prefix}.${sf.slug}.${k.slug}`;
      }
      if (editingHak && editingHak.key === expectedKey) return true;
      return !hakAksesData.some(h => h.key === expectedKey);
    });
  }, [hakForm.fiturId, hakForm.level, hakForm.subFiturId, activeKategori, fiturData, hakAksesData, editingHak]);

  // Smart dropdown: filter out features that have ALL active categories fully covered
  const availableFiturForModal = useMemo(() => {
    return fiturData.filter(f => {
      if (f.status !== "active") return false;
      const hasRemainingAtFiturLevel = activeKategori.some(k => {
        const key = `${f.prefix}.${k.slug}`;
        return !hakAksesData.some(h => h.key === key);
      });
      if (hasRemainingAtFiturLevel) return true;
      if (f.type === "bertingkat") {
        const activeSubFiturs = f.subFitur.filter(sf => sf.status === "active");
        return activeSubFiturs.some(sf =>
          activeKategori.some(k => {
            const key = `${f.prefix}.${sf.slug}.${k.slug}`;
            return !hakAksesData.some(h => h.key === key);
          })
        );
      }
      return false;
    });
  }, [fiturData, activeKategori, hakAksesData]);

  // ── Kategori Aksi Handlers ──
  const openAddKategori = () => {
    setEditingKategori(null);
    setKategoriForm({ name: "", slug: "", description: "", status: "active" });
    setKategoriSlugManual(false);
    setKategoriNameError("");
    setKategoriSlugError("");
    setKategoriConfirmChecked(false);
    setKategoriModalOpen(true);
  };

  const openEditKategori = (k: typeof kategoriData[0]) => {
    setEditingKategori(k);
    setKategoriForm({ name: k.name, slug: k.slug, description: k.description, status: k.status });
    setKategoriSlugManual(true);
    setKategoriNameError("");
    setKategoriSlugError("");
    setKategoriConfirmChecked(false);
    setKategoriModalOpen(true);
  };

  const handleKategoriNameChange = (name: string) => {
    setKategoriForm(p => ({ ...p, name }));
    const normalizedName = name.trim().toLowerCase();
    const nameExists = kategoriData.some(k => k.name.trim().toLowerCase() === normalizedName && k.id !== editingKategori?.id);
    setKategoriNameError(nameExists ? "Kategori aksi ini sudah pernah dibuat." : "");

    if (!kategoriSlugManual) {
      const slug = generateSlug(name);
      setKategoriForm(p => ({ ...p, slug }));
      const v = validateSlug(slug);
      setKategoriSlugError(v.valid ? "" : v.message);
    }
  };

  const handleKategoriSlugChange = (slug: string) => {
    setKategoriSlugManual(true);
    setKategoriForm(p => ({ ...p, slug }));
    const v = validateSlug(slug);
    setKategoriSlugError(v.valid ? "" : v.message);
    if (v.valid) {
      const exists = kategoriData.some(k => k.slug === slug && k.id !== editingKategori?.id);
      if (exists) setKategoriSlugError("Slug sudah digunakan.");
    }
  };

  const saveKategori = async () => {
    if (!kategoriForm.name.trim()) { toast.error("Nama kategori aksi wajib diisi"); return; }
    const normalizedName = kategoriForm.name.trim().toLowerCase();
    const nameExists = kategoriData.some(k => k.name.trim().toLowerCase() === normalizedName && k.id !== editingKategori?.id);
    if (nameExists) { setKategoriNameError("Kategori aksi ini sudah pernah dibuat."); return; }

    const v = validateSlug(kategoriForm.slug);
    if (!v.valid) { setKategoriSlugError(v.message); return; }
    const slugExists = kategoriData.some(k => k.slug === kategoriForm.slug && k.id !== editingKategori?.id);
    if (slugExists) { setKategoriSlugError("Slug sudah digunakan."); return; }

    if (editingKategori) {
      if (editingKategori.usedByEntitlements > 0 && editingKategori.slug !== kategoriForm.slug && !kategoriConfirmChecked) {
        toast.error("Centang konfirmasi untuk menyimpan perubahan"); return;
      }
      const impacted = editingKategori.usedByEntitlements > 0 && editingKategori.slug !== kategoriForm.slug;
      const ok = await dbUpdateKategori(editingKategori.id, kategoriForm);
      if (!ok) return;
      toast.success(impacted ? `Perubahan diterapkan. ${editingKategori.usedByEntitlements} entitlements telah diperbarui.` : "Perubahan berhasil disimpan");
    } else {
      const result = await dbAddKategori(kategoriForm);
      if (!result) return;
      toast.success("Kategori aksi berhasil ditambahkan");
    }
    setKategoriModalOpen(false);
  };

  // ── Hak Akses Handlers ──
  const getKeyPreview = useCallback(() => {
    if (hakForm.manualKey) return hakForm.manualKeyValue;
    const fitur = fiturData.find(f => f.id === hakForm.fiturId);
    if (!fitur) return "";
    const kategori = kategoriData.find(k => k.id === hakForm.kategoriAksiId);
    if (!kategori) return "";
    if (hakForm.level === "fitur") return `${fitur.prefix}.${kategori.slug}`;
    const sf = fitur.subFitur.find(s => s.id === hakForm.subFiturId);
    if (!sf) return "";
    return `${fitur.prefix}.${sf.slug}.${kategori.slug}`;
  }, [hakForm, fiturData, kategoriData]);

  const keyPreview = getKeyPreview();
  const isDuplicateKey = keyPreview ? hakAksesData.some(h => h.key === keyPreview && h.id !== editingHak?.id) : false;

  const autoGenerateName = useCallback(() => {
    const fitur = fiturData.find(f => f.id === hakForm.fiturId);
    const kategori = kategoriData.find(k => k.id === hakForm.kategoriAksiId);
    if (!fitur || !kategori) return "";
    if (hakForm.level === "sub_fitur") {
      const sf = fitur.subFitur.find(s => s.id === hakForm.subFiturId);
      if (sf) return `${kategori.name} ${sf.name}`;
    }
    return `${kategori.name} ${fitur.name}`;
  }, [hakForm, fiturData, kategoriData]);

  const openAddHak = () => {
    if (activeKategori.length === 0) {
      toast.error("Tambahkan kategori aksi terlebih dahulu.");
      return;
    }
    setEditingHak(null);
    setHakForm({ fiturId: "", level: "fitur", subFiturId: "", kategoriAksiId: "", name: "", description: "", status: "active", manualKey: false, manualKeyValue: "", restrictionType: "unlimited", tokenCost: 1 });
    setHakConfirmChecked(false);
    setHakModalOpen(true);
  };

  const openEditHak = (h: HakAkses) => {
    setEditingHak(h);
    const fitur = fiturData.find(f => f.prefix === h.fiturPrefix);
    let subFiturId = "";
    if (h.level === "sub_fitur" && fitur) {
      const parts = h.key.split(".");
      if (parts.length === 3) {
        const sf = fitur.subFitur.find(s => s.slug === parts[1]);
        subFiturId = sf?.id || "";
      }
    }
    const kategori = kategoriData.find(k => k.slug === h.kategoriAksiSlug);
    setHakForm({
      fiturId: fitur?.id || "", level: h.level, subFiturId, kategoriAksiId: kategori?.id || "",
      name: h.name, description: h.description, status: h.status, manualKey: false, manualKeyValue: h.key,
      restrictionType: h.restrictionType as "unlimited" | "token_gated" | "frequency_limited" | "locked", tokenCost: h.tokenCost || 1,
    });
    setHakConfirmChecked(false);
    setHakModalOpen(true);
  };

  const handleFiturChange = (fiturId: string) => {
    const fitur = fiturData.find(f => f.id === fiturId);
    // Auto-set level based on fitur type
    const level = fitur?.type === "tunggal" ? "fitur" as const : hakForm.level;
    setHakForm(p => ({ ...p, fiturId, subFiturId: "", level }));
  };

  const saveHak = async () => {
    if (!hakForm.fiturId || !hakForm.kategoriAksiId || !hakForm.name.trim()) {
      toast.error("Lengkapi semua field yang wajib diisi"); return;
    }
    if (hakForm.level === "sub_fitur" && !hakForm.subFiturId) {
      toast.error("Pilih sub fitur"); return;
    }
    const key = keyPreview;
    if (!key) { toast.error("Key tidak valid"); return; }
    if (isDuplicateKey) { toast.error("Key sudah digunakan"); return; }

    const fitur = fiturData.find(f => f.id === hakForm.fiturId)!;
    const kategori = kategoriData.find(k => k.id === hakForm.kategoriAksiId)!;
    const sf = fitur.subFitur.find(s => s.id === hakForm.subFiturId);

    if (editingHak) {
      if (editingHak.usedByPlans > 0 && !hakConfirmChecked) {
        toast.error("Centang konfirmasi untuk menyimpan perubahan"); return;
      }
      const impacted = editingHak.usedByPlans > 0;
      const ok = await dbUpdateHakAkses(editingHak.id, {
        name: hakForm.name, description: hakForm.description, status: hakForm.status,
        key: editingHak.usedByPlans > 0 ? editingHak.key : key,
        restriction_type: hakForm.restrictionType,
        token_cost: hakForm.restrictionType === "token_gated" ? hakForm.tokenCost : 0,
      });
      if (!ok) return;
      toast.success(impacted ? `Perubahan diterapkan. ${editingHak.usedByPlans} plan telah diperbarui.` : "Perubahan berhasil disimpan");
    } else {
      const result = await dbAddHakAkses({
        name: hakForm.name, key, level: hakForm.level,
        featureId: hakForm.fiturId, subFeatureId: hakForm.subFiturId || null,
        actionCategoryId: hakForm.kategoriAksiId,
        description: hakForm.description, status: hakForm.status,
        restrictionType: hakForm.restrictionType,
        tokenCost: hakForm.restrictionType === "token_gated" ? hakForm.tokenCost : 0,
        fiturName: fitur.name, fiturPrefix: fitur.prefix,
        subFiturName: sf?.name || "", kategoriAksiSlug: kategori.slug, kategoriAksiName: kategori.name,
      });
      if (!result) return;
      toast.success("Hak akses berhasil ditambahkan");
    }
    setHakModalOpen(false);
  };

  const handleDeleteHak = (h: HakAkses) => {
    setDeleteTarget(h);
    setDeleteModalOpen(true);
  };

  const confirmDeleteHak = async () => {
    if (deleteTarget) {
      // Cascade: delete mappings first if used
      if (deleteTarget.usedByPlans > 0) {
        const { error: mapErr } = await supabase
          .from("duration_access_mappings")
          .delete()
          .eq("entitlement_key", deleteTarget.key);
        if (mapErr) { toast.error("Gagal menghapus mapping: " + mapErr.message); return; }
      }
      const ok = await dbDeleteHakAkses(deleteTarget.id);
      if (!ok) return;
      toast.success(`Hak akses "${deleteTarget.name}" berhasil dihapus`);
      setHakSelectedIds(p => p.filter(id => id !== deleteTarget.id));
    }
    setDeleteModalOpen(false);
  };

  // ── Bulk Actions ──
  const handleBulkAction = (action: "activate" | "deactivate", section: "kategori" | "hak") => {
    setBulkActionType(action);
    setBulkActionSection(section);

    if (action === "deactivate") {
      // Check if any selected items are used
      if (section === "kategori") {
        const hasUsed = kategoriSelectedIds.some(id => kategoriData.find(k => k.id === id)?.usedByEntitlements! > 0);
        if (hasUsed) { setBulkActionModalOpen(true); return; }
      } else {
        const hasUsed = hakSelectedIds.some(id => hakAksesData.find(h => h.id === id)?.usedByPlans! > 0);
        if (hasUsed) { setBulkActionModalOpen(true); return; }
      }
    }

    executeBulkAction(action, section, false);
  };

  const executeBulkAction = async (action: "activate" | "deactivate", section: "kategori" | "hak", safeOnly: boolean) => {
    const newStatus = action === "activate" ? "active" as const : "inactive" as const;
    if (section === "kategori") {
      let ids = kategoriSelectedIds;
      if (safeOnly && action === "deactivate") {
        ids = ids.filter(id => !(kategoriData.find(k => k.id === id)?.usedByEntitlements! > 0));
      }
      await dbBulkUpdateKategoriStatus(ids, newStatus);
      setKategoriSelectedIds([]);
      toast.success(`${ids.length} kategori aksi berhasil di${action === "activate" ? "aktifkan" : "nonaktifkan"}`);
    } else {
      let ids = hakSelectedIds;
      if (safeOnly && action === "deactivate") {
        ids = ids.filter(id => !(hakAksesData.find(h => h.id === id)?.usedByPlans! > 0));
      }
      await dbBulkUpdateHakStatus(ids, newStatus);
      setHakSelectedIds([]);
      toast.success(`${ids.length} hak akses berhasil di${action === "activate" ? "aktifkan" : "nonaktifkan"}`);
    }
    setBulkActionModalOpen(false);
  };

  // ── Selection helpers ──
  const toggleKategoriSelect = (id: string) => setKategoriSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleHakSelect = (id: string) => setHakSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleAllHak = () => {
    const pageIds = paginatedHakAkses.map(h => h.id);
    const allSelected = pageIds.every(id => hakSelectedIds.includes(id));
    setHakSelectedIds(allSelected ? hakSelectedIds.filter(id => !pageIds.includes(id)) : [...new Set([...hakSelectedIds, ...pageIds])]);
  };
  const toggleAllKategori = () => {
    const allSelected = kategoriData.every(k => kategoriSelectedIds.includes(k.id));
    setKategoriSelectedIds(allSelected ? [] : kategoriData.map(k => k.id));
  };

  // ── Render: Loading ──
  const renderLoading = () => (
    <div className="space-y-6">
      {/* Section 1 skeleton */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-4 w-72" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton className="h-5 flex-1" /><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-14" /><Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
      {/* Section 2 skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-3"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-32" /></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-28" /><Skeleton className="h-9 w-28" /><Skeleton className="h-9 w-28" /><Skeleton className="h-9 w-28" /></div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 p-3"><Skeleton className="h-5 w-full" /></div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border-t flex items-center gap-4">
              <Skeleton className="h-4 w-4" /><Skeleton className="h-5 w-16" /><Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-14" /><Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Gagal memuat data</h3>
      <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
        Terjadi kesalahan saat memuat data hak akses. Silakan coba lagi.
      </p>
      <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
        <RefreshCw className="h-4 w-4" />Coba Lagi
      </Button>
    </div>
  );

  const renderEmpty = () => (
    <div className="space-y-6">
      {/* Empty Section 1 */}
      <div className="border rounded-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <h3 className="font-semibold">Kategori Aksi</h3>
            <span className="text-sm text-muted-foreground">(0 kategori)</span>
          </div>
          <Button size="sm" onClick={openAddKategori}><Plus className="h-3 w-3 mr-1" />Tambah Kategori</Button>
        </div>
        <div className="border-t p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">Belum ada kategori aksi</p>
          <Button variant="outline" size="sm" onClick={openAddKategori}><Plus className="h-3 w-3 mr-1" />Tambah Kategori</Button>
        </div>
      </div>
      {/* Empty Section 2 */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Key className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Belum ada hak akses</h3>
        <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
          Tambahkan hak akses untuk dapat dipetakan ke paket membership.
        </p>
        <Button onClick={openAddHak} className="gap-2"><Plus className="h-4 w-4" />Tambah Hak Akses</Button>
      </div>
    </div>
  );

  // Selected fitur for modal
  const selectedFitur = fiturData.find(f => f.id === hakForm.fiturId);
  const selectedFiturSubFiturs = selectedFitur?.subFitur.filter(sf => sf.status === "active") || [];
  const showLevelSelect = selectedFitur?.type === "bertingkat";

  // Grouped data
  const groupedHakAkses = useMemo(() => {
    if (hakViewMode !== "grouped") return {};
    const groups: Record<string, { fiturName: string; induk: HakAkses[]; subFitur: HakAkses[] }> = {};
    filteredHakAkses.forEach(h => {
      if (!groups[h.fiturPrefix]) groups[h.fiturPrefix] = { fiturName: h.fiturName, induk: [], subFitur: [] };
      if (h.level === "fitur") groups[h.fiturPrefix].induk.push(h);
      else groups[h.fiturPrefix].subFitur.push(h);
    });
    return groups;
  }, [filteredHakAkses, hakViewMode]);

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Hak Akses Fitur</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola master entitlement sebagai dasar penyusunan hak akses dan konfigurasi membership.
          </p>
        </div>

        {/* Callout */}
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
              <div className="text-amber-700 dark:text-amber-300 space-y-2 text-xs sm:text-sm ml-6 sm:ml-8">
                <ul className="list-disc list-inside space-y-1.5">
                  <li><strong>Kategori Aksi</strong> adalah standar penamaan aksi yang dipakai saat membentuk entitlement (mis. view/use/create/edit/delete).</li>
                  <li>Entitlement dibentuk dari kombinasi: <strong>Objek (Fitur/Sub Fitur)</strong> + <strong>Kategori Aksi (Action)</strong>.</li>
                  <li>Key dibuat otomatis (auto-generate) dari pilihan objek + kategori aksi untuk mencegah salah format/typo.</li>
                  <li>Fitur bertingkat punya <strong>2 layer</strong> entitlement:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                      <li>Level Fitur (Induk): <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[11px]">{"{prefix}.{action}"}</code> → contoh: <code className="font-mono text-[11px]">kk.view</code></li>
                      <li>Level Sub Fitur (Spesifik): <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[11px]">{"{prefix}.{scope}.{action}"}</code> → contoh: <code className="font-mono text-[11px]">kk.jelajah_profesi.view</code></li>
                    </ul>
                  </li>
                  <li>Key wajib unik. Duplikasi dicegah sejak preview (real-time check).</li>
                  <li>Perubahan pada entitlement yang sudah digunakan memerlukan konfirmasi karena mempengaruhi aturan akses.</li>
                  <li>Tipe akses (unlimited/token/limit) ditentukan saat pembuatan hak akses, dan otomatis berlaku saat dimapping ke plan.</li>
                </ul>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Content */}
        {demoState === "loading" ? renderLoading() :
         demoState === "empty" ? renderEmpty() : (
          <>
            {/* ══════════ SECTION 1: Kategori Aksi ══════════ */}
            <Collapsible open={!kategoriCollapsed} onOpenChange={o => setKategoriCollapsed(!o)}>
              <div className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {kategoriCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <h3 className="font-semibold text-sm sm:text-base">Kategori Aksi</h3>
                      <span className="text-xs sm:text-sm text-muted-foreground">({kategoriData.length} kategori)</span>
                    </div>
                    <Button size="sm" onClick={e => { e.stopPropagation(); openAddKategori(); }}>
                      <Plus className="h-3 w-3 mr-1" />Tambah Kategori
                    </Button>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Kelola daftar kategori aksi sebagai standar penamaan aksi pada hak akses.
                    </p>
                    {kategoriData.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Layers className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Belum ada kategori aksi</p>
                        <Button variant="outline" size="sm" onClick={openAddKategori}><Plus className="h-3 w-3 mr-1" />Tambah Kategori</Button>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10"><Checkbox checked={kategoriData.length > 0 && kategoriSelectedIds.length === kategoriData.length} onCheckedChange={toggleAllKategori} /></TableHead>
                              <TableHead>Nama Kategori</TableHead>
                              <TableHead>Slug</TableHead>
                              <TableHead className="hidden sm:table-cell">Deskripsi</TableHead>
                              <TableHead className="text-center">Digunakan</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="w-[70px]">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {kategoriData.map(k => (
                              <TableRow key={k.id} data-state={kategoriSelectedIds.includes(k.id) ? "selected" : undefined}>
                                <TableCell><Checkbox checked={kategoriSelectedIds.includes(k.id)} onCheckedChange={() => toggleKategoriSelect(k.id)} /></TableCell>
                                <TableCell className="font-medium text-sm">{k.name}</TableCell>
                                <TableCell><code className="text-xs bg-muted px-2 py-1 rounded font-mono">{k.slug}</code></TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs max-w-[200px] truncate">{k.description || "—"}</TableCell>
                                <TableCell className="text-center text-xs">{k.usedByEntitlements} entitlements</TableCell>
                                <TableCell className="text-center"><Badge variant={k.status === "active" ? "default" : "secondary"}>{k.status === "active" ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditKategori(k)}><Edit className="h-3.5 w-3.5" /></Button></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Bulk Action Bar - Kategori */}
            {kategoriSelectedIds.length > 0 && (
              <div className="sticky bottom-4 z-40 mx-auto max-w-xl">
                <div className="bg-card border-2 border-primary/20 rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">{kategoriSelectedIds.length}</Badge>
                    <span className="text-sm font-medium">item dipilih</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate", "kategori")}>Aktifkan</Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate", "kategori")}>Nonaktifkan</Button>
                    <Button size="sm" variant="ghost" onClick={() => setKategoriSelectedIds([])}><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ SECTION 2: Master Hak Akses ══════════ */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm sm:text-base">Master Hak Akses</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Tampilan:</span>
                  <div className="flex rounded-lg border overflow-hidden">
                    <button onClick={() => setHakViewMode("flat")} className={cn("px-2.5 py-1 text-xs font-medium transition-colors", hakViewMode === "flat" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>Tabel</button>
                    <button onClick={() => setHakViewMode("grouped")} className={cn("px-2.5 py-1 text-xs font-medium transition-colors border-l", hakViewMode === "grouped" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>Grup per Fitur</button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari nama hak akses, key, fitur, atau sub fitur…" value={hakSearch} onChange={e => setHakSearch(e.target.value)} className="pl-9 h-9 sm:h-10" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-2 sm:flex-wrap">
                    <Select value={hakStatusFilter} onValueChange={v => setHakStatusFilter(v as typeof hakStatusFilter)}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={hakLevelFilter} onValueChange={v => { setHakLevelFilter(v as typeof hakLevelFilter); if (v === "fitur") setHakSubFiturFilter("all"); }}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[150px]"><SelectValue placeholder="Level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Level</SelectItem>
                        <SelectItem value="fitur">Fitur (Induk)</SelectItem>
                        <SelectItem value="sub_fitur">Sub Fitur (Spesifik)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={hakFiturFilter} onValueChange={v => { setHakFiturFilter(v); setHakSubFiturFilter("all"); }}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[140px]"><SelectValue placeholder="Fitur" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Fitur</SelectItem>
                        {fiturData.filter(f => f.status === "active").map(f => (
                          <SelectItem key={f.id} value={f.prefix}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hakFiturFilter !== "all" && hakLevelFilter !== "fitur" && filterSubFiturOptions.length > 0 && (
                      <Select value={hakSubFiturFilter} onValueChange={setHakSubFiturFilter}>
                        <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[150px]"><SelectValue placeholder="Sub Fitur" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Sub Fitur</SelectItem>
                          {filterSubFiturOptions.map(sf => (
                            <SelectItem key={sf.id} value={sf.slug}>{sf.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Select value={hakKategoriFilter} onValueChange={setHakKategoriFilter}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[150px]"><SelectValue placeholder="Kategori Aksi" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {activeKategori.map(k => (<SelectItem key={k.id} value={k.slug}>{k.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Select value={hakSortBy} onValueChange={v => setHakSortBy(v as typeof hakSortBy)}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm sm:w-[130px]"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nama (A–Z)</SelectItem>
                        <SelectItem value="key">Key (A–Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={openAddHak} size="sm" className="w-full sm:w-auto h-9 shrink-0">
                    <Plus className="h-4 w-4 mr-1.5" />Tambah Hak Akses
                  </Button>
                </div>
              </div>

              {/* Table or Grouped */}
              {filteredHakAkses.length === 0 ? (
                isFilterActive ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                      <SearchX className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Data tidak ditemukan</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      Coba ubah filter atau kata kunci pencarian Anda.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Key className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Belum ada hak akses</h3>
                    <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
                      Tambahkan hak akses untuk dapat dipetakan ke paket membership.
                    </p>
                    <Button onClick={openAddHak} className="gap-2"><Plus className="h-4 w-4" />Tambah Hak Akses</Button>
                  </div>
                )
              ) : hakViewMode === "grouped" ? (
                /* Grouped View */
                <div className="space-y-5">
                  {Object.entries(groupedHakAkses).map(([prefix, group]) => (
                    <div key={prefix} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono text-xs px-2.5 py-1">{prefix}</Badge>
                          <span className="font-semibold text-base">{group.fiturName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{group.induk.length + group.subFitur.length} entitlements</span>
                      </div>
                      <div className="border-t">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/30">
                              <TableHead>Sub Fitur</TableHead>
                              <TableHead>Kategori Aksi</TableHead>
                              <TableHead>Key</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>Pembatasan</TableHead>
                              <TableHead className="text-center">Digunakan</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="w-[90px]">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...group.induk, ...group.subFitur].map(h => (
                              <TableRow key={h.id}>
                                <TableCell className="text-sm">{h.subFiturName || "—"}</TableCell>
                                <TableCell><Badge variant="outline" className="text-[11px]">{h.kategoriAksiName}</Badge></TableCell>
                                <TableCell><code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{h.key}</code></TableCell>
                                <TableCell className="font-medium text-sm">{h.name}</TableCell>
                                 <TableCell>
                                   {h.restrictionType === "unlimited" && <Badge variant="secondary" className="text-[10px]">Tanpa batas</Badge>}
                                   {h.restrictionType === "token_gated" && <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">{h.tokenCost} token/aksi</Badge>}
                                   {h.restrictionType === "frequency_limited" && <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Batas pakai</Badge>}
                                   {h.restrictionType === "locked" && <Badge variant="outline" className="text-[10px]">Terkunci</Badge>}
                                 </TableCell>
                                <TableCell className="text-center text-sm">{h.usedByPlans} plan</TableCell>
                                <TableCell className="text-center"><Badge variant={h.status === "active" ? "default" : "secondary"}>{h.status === "active" ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-0.5">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditHak(h)}><Edit className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleDeleteHak(h)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Flat Table View */
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"><Checkbox checked={paginatedHakAkses.length > 0 && paginatedHakAkses.every(h => hakSelectedIds.includes(h.id))} onCheckedChange={toggleAllHak} /></TableHead>
                          <TableHead>Fitur</TableHead>
                          <TableHead>Kategori Aksi</TableHead>
                          <TableHead>Key Hak Akses</TableHead>
                          <TableHead>Nama Hak Akses</TableHead>
                          <TableHead>Pembatasan</TableHead>
                          <TableHead className="text-center">Digunakan</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="w-[90px]">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedHakAkses.map(h => (
                          <TableRow key={h.id} data-state={hakSelectedIds.includes(h.id) ? "selected" : undefined}>
                            <TableCell><Checkbox checked={hakSelectedIds.includes(h.id)} onCheckedChange={() => toggleHakSelect(h.id)} /></TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">{h.fiturName}</span>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="text-[10px]">{h.kategoriAksiName}</Badge></TableCell>
                            <TableCell><code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{h.key}</code></TableCell>
                            <TableCell className="font-medium text-sm">{h.name}</TableCell>
                             <TableCell>
                               {h.restrictionType === "unlimited" && <Badge variant="secondary" className="text-[10px]">Tanpa batas</Badge>}
                               {h.restrictionType === "token_gated" && <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">{h.tokenCost} token/aksi</Badge>}
                               {h.restrictionType === "frequency_limited" && <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Batas pakai</Badge>}
                               {h.restrictionType === "locked" && <Badge variant="outline" className="text-[10px]">Terkunci</Badge>}
                             </TableCell>
                            <TableCell className="text-center text-xs">{h.usedByPlans} plan</TableCell>
                            <TableCell className="text-center"><Badge variant={h.status === "active" ? "default" : "secondary"}>{h.status === "active" ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                            <TableCell>
                              <div className="flex items-center gap-0.5">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditHak(h)}><Edit className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleDeleteHak(h)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {filteredHakAkses.length > ITEMS_PER_PAGE && (
                    <RextraTablePagination
                      currentPage={hakPage}
                      totalPages={totalPages}
                      totalItems={filteredHakAkses.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setHakPage}
                      onItemsPerPageChange={() => {}}
                      itemsPerPageOptions={[ITEMS_PER_PAGE]}
                    />
                  )}
                </>
              )}
            </div>

            {/* Bulk Action Bar - Hak Akses */}
            {hakSelectedIds.length > 0 && (
              <div className="sticky bottom-4 z-40 mx-auto max-w-2xl">
                <div className="bg-card border-2 border-primary/20 rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">{hakSelectedIds.length}</Badge>
                    <span className="text-sm font-medium">item dipilih</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate", "hak")}>Aktifkan</Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate", "hak")}>Nonaktifkan</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Export data dimulai...")}>
                      <Download className="h-3.5 w-3.5 mr-1" />Export
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setHakSelectedIds([])}><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>



      {/* ══════════ MODALS ══════════ */}

      {/* Modal: Tambah/Edit Kategori Aksi */}
      <Dialog open={kategoriModalOpen} onOpenChange={setKategoriModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingKategori ? "Edit Kategori Aksi" : "Tambah Kategori Aksi"}</DialogTitle>
            <DialogDescription>Kategori aksi akan digunakan sebagai standar pilihan aksi pada pembuatan hak akses.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingKategori && editingKategori.usedByEntitlements > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Kategori aksi ini digunakan oleh <strong>{editingKategori.usedByEntitlements} entitlements</strong>. Mengubah slug dapat mengubah key dan mempengaruhi akses.
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Nama Kategori <span className="text-destructive">*</span></Label>
              <Input placeholder="Tampilan" value={kategoriForm.name} onChange={e => handleKategoriNameChange(e.target.value)}
                className={cn(kategoriNameError && "border-destructive")} />
              {kategoriNameError && <p className="text-xs text-destructive">{kategoriNameError}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug <span className="text-destructive">*</span></Label>
              <Input placeholder="view" value={kategoriForm.slug} onChange={e => handleKategoriSlugChange(e.target.value)}
                className={cn("font-mono", kategoriSlugError && "border-destructive")} />
              {kategoriSlugError && <p className="text-xs text-destructive">{kategoriSlugError}</p>}
            </div>
            <div className="space-y-2">
              <Label>Deskripsi <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Textarea placeholder="Akses untuk melihat data atau halaman" value={kategoriForm.description}
                onChange={e => setKategoriForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup value={kategoriForm.status} onValueChange={v => setKategoriForm(p => ({ ...p, status: v as "active" | "inactive" }))} className="flex gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="active" id="kat-active" /><Label htmlFor="kat-active" className="cursor-pointer">Aktif</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="inactive" id="kat-inactive" /><Label htmlFor="kat-inactive" className="cursor-pointer">Nonaktif</Label></div>
              </RadioGroup>
            </div>
            {editingKategori && editingKategori.usedByEntitlements > 0 && editingKategori.slug !== kategoriForm.slug && (
              <div className="flex items-start space-x-2 pt-2 border-t">
                <Checkbox id="kat-confirm" checked={kategoriConfirmChecked} onCheckedChange={v => setKategoriConfirmChecked(v as boolean)} className="mt-0.5" />
                <Label htmlFor="kat-confirm" className="text-sm cursor-pointer leading-snug">Saya memahami dampak perubahan ini.</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKategoriModalOpen(false)}>Batal</Button>
            <Button onClick={saveKategori}
              disabled={!!kategoriNameError || (editingKategori?.usedByEntitlements! > 0 && editingKategori?.slug !== kategoriForm.slug && !kategoriConfirmChecked)}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Tambah/Edit Hak Akses */}
      <Dialog open={hakModalOpen} onOpenChange={setHakModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHak ? "Edit Hak Akses" : "Tambah Hak Akses"}</DialogTitle>
            <DialogDescription>
              {editingHak ? "Ubah konfigurasi hak akses yang sudah ada." : "Hak akses dibentuk dari kombinasi objek dan kategori aksi. Key dibuat otomatis dan harus unik."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Warning if editing used item */}
            {editingHak && editingHak.usedByPlans > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Hak akses ini sudah digunakan pada <strong>{editingHak.usedByPlans} plan</strong>. Perubahan dapat mempengaruhi konfigurasi paket membership.
                  </p>
                </div>
              </div>
            )}

            {/* Fitur */}
            <div className="space-y-2">
              <Label>Fitur <span className="text-destructive">*</span></Label>
              {editingHak ? (
                <Input value={`${editingHak.fiturName} (${editingHak.fiturPrefix})`} readOnly disabled className="bg-muted" />
              ) : (
                <Select value={hakForm.fiturId} onValueChange={handleFiturChange}>
                  <SelectTrigger><SelectValue placeholder="Pilih fitur" /></SelectTrigger>
                  <SelectContent>
                    {availableFiturForModal.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex items-center gap-2">
                          <span>{f.name}</span>
                          <span className="text-muted-foreground text-xs">({f.prefix})</span>
                          <Badge variant="outline" className="text-[9px] h-4">{f.type === "tunggal" ? "Tunggal" : "Bertingkat"}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Level (only for bertingkat) */}
            {showLevelSelect && !editingHak?.usedByPlans && (
              <div className="space-y-2">
                <Label>Level Hak Akses <span className="text-destructive">*</span></Label>
                <RadioGroup value={hakForm.level} onValueChange={v => setHakForm(p => ({ ...p, level: v as "fitur" | "sub_fitur", subFiturId: "" }))} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="fitur" id="lvl-fitur" /><Label htmlFor="lvl-fitur" className="cursor-pointer text-sm">Fitur (Induk)</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sub_fitur" id="lvl-sub" /><Label htmlFor="lvl-sub" className="cursor-pointer text-sm">Sub Fitur (Spesifik)</Label></div>
                </RadioGroup>
              </div>
            )}
            {editingHak?.usedByPlans! > 0 && showLevelSelect && (
              <div className="space-y-2">
                <Label>Level Hak Akses</Label>
                <Input value={editingHak?.level === "fitur" ? "Fitur (Induk)" : "Sub Fitur (Spesifik)"} readOnly disabled className="bg-muted" />
              </div>
            )}

            {/* Sub Fitur (conditional) */}
            {hakForm.level === "sub_fitur" && hakForm.fiturId && (
              <div className="space-y-2">
                <Label>Sub Fitur <span className="text-destructive">*</span></Label>
                {editingHak && editingHak.usedByPlans > 0 ? (
                  <Input value={editingHak.subFiturName} readOnly disabled className="bg-muted" />
                ) : selectedFiturSubFiturs.length === 0 ? (
                  <div className="bg-muted/50 border rounded-lg p-4 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Belum ada sub fitur pada fitur ini.</p>
                    <p className="text-xs text-muted-foreground">Tambahkan sub fitur terlebih dahulu di <strong>Tab Fitur & Sub Fitur</strong>.</p>
                  </div>
                ) : (
                  <Select value={hakForm.subFiturId} onValueChange={v => setHakForm(p => ({ ...p, subFiturId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih sub fitur" /></SelectTrigger>
                    <SelectContent>
                      {selectedFiturSubFiturs.map(sf => (<SelectItem key={sf.id} value={sf.id}>{sf.name} <span className="text-muted-foreground">({sf.slug})</span></SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Kategori Aksi */}
            <div className="space-y-2">
              <Label>Kategori Aksi <span className="text-destructive">*</span></Label>
              {availableKategoriForModal.length === 0 && hakForm.fiturId ? (
                <div className="bg-muted/50 border rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Semua kategori aksi untuk item ini sudah dibuat.</p>
                </div>
              ) : (
                <Select value={hakForm.kategoriAksiId} onValueChange={v => setHakForm(p => ({ ...p, kategoriAksiId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori aksi" /></SelectTrigger>
                  <SelectContent>
                    {availableKategoriForModal.map(k => (<SelectItem key={k.id} value={k.id}>{k.name} ({k.slug})</SelectItem>))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Preview Key */}
            {keyPreview && (
              <div className={cn("border rounded-lg p-3 space-y-1",
                isDuplicateKey ? "bg-destructive/5 border-destructive/30" : "bg-primary/5 border-primary/20")}>
                <p className="text-xs font-medium text-muted-foreground">Preview Key Hak Akses:</p>
                <code className={cn("text-sm font-mono font-semibold block", isDuplicateKey ? "text-destructive" : "text-primary")}>
                  {keyPreview}
                </code>
                {isDuplicateKey && (
                  <p className="text-xs text-destructive font-medium">
                    Key sudah digunakan. Ubah pilihan Level/Sub Fitur/Kategori Aksi.
                  </p>
                )}
              </div>
            )}

            {/* Advanced: Manual Key (only for add or unused edit) */}
            {!(editingHak && editingHak.usedByPlans > 0) && (
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Edit key manual (Advanced)</Label>
                  <Switch checked={hakForm.manualKey} onCheckedChange={v => setHakForm(p => ({ ...p, manualKey: v, manualKeyValue: keyPreview || p.manualKeyValue }))} />
                </div>
                {hakForm.manualKey && (
                  <>
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-2.5">
                      <p className="text-xs text-destructive font-medium">⚠️ Mengubah key manual dapat menyebabkan inkonsistensi format. Pastikan key mengikuti konvensi: {"{prefix}.{scope}.{action}"}</p>
                    </div>
                    <Input value={hakForm.manualKeyValue} onChange={e => setHakForm(p => ({ ...p, manualKeyValue: e.target.value }))}
                      className="font-mono" placeholder="kk.jelajah_profesi.view" />
                  </>
                )}
              </div>
            )}

            {/* Pembatasan Akses */}
            <div className="space-y-3 border-t pt-3">
              <Label>Pembatasan Akses <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={hakForm.restrictionType}
                onValueChange={v => setHakForm(p => ({ ...p, restrictionType: v as "unlimited" | "token_gated" | "frequency_limited" | "locked" }))}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <Label
                  htmlFor="r-unlimited"
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    hakForm.restrictionType === "unlimited" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="unlimited" id="r-unlimited" className="sr-only" />
                  <span className="text-sm font-medium">Tanpa batas</span>
                </Label>
                <Label
                  htmlFor="r-token_gated"
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    hakForm.restrictionType === "token_gated" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="token_gated" id="r-token_gated" className="sr-only" />
                  <span className="text-sm font-medium">Token</span>
                </Label>
                <Label
                  htmlFor="r-frequency_limited"
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    hakForm.restrictionType === "frequency_limited" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="frequency_limited" id="r-frequency_limited" className="sr-only" />
                  <span className="text-sm font-medium">Batas pakai</span>
                </Label>
                <Label
                  htmlFor="r-locked"
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    hakForm.restrictionType === "locked" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="locked" id="r-locked" className="sr-only" />
                  <span className="text-sm font-medium">Terkunci</span>
                </Label>
              </RadioGroup>

              {hakForm.restrictionType === "token_gated" && (
                <div className="space-y-2">
                  <Label className="text-sm">Biaya token per aksi <span className="text-destructive">*</span></Label>
                  <Input
                    type="number" value={hakForm.tokenCost} min={1} max={1000}
                    onChange={e => setHakForm(p => ({ ...p, tokenCost: Number(e.target.value) }))}
                    className="w-40"
                  />
                  <p className="text-xs text-muted-foreground">Min: 1, Max: 1.000</p>
                </div>
              )}

              {hakForm.restrictionType === "frequency_limited" && (
                <div className="bg-muted/50 border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    Kuota penggunaan akan ditentukan per plan & durasi saat mapping ke paket membership.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nama Hak Akses <span className="text-destructive">*</span></Label>
              <Input placeholder={autoGenerateName() || "Lihat Kamus Karier"}
                value={hakForm.name} onChange={e => setHakForm(p => ({ ...p, name: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Nama ini akan ditampilkan di UI untuk user</p>
              {!hakForm.name && autoGenerateName() && (
                <button className="text-xs text-primary hover:underline" onClick={() => setHakForm(p => ({ ...p, name: autoGenerateName() }))}>
                  Gunakan nama otomatis: "{autoGenerateName()}"
                </button>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label>Deskripsi <span className="text-muted-foreground text-xs">(opsional)</span></Label>
              <Textarea placeholder="Penjelasan singkat tentang hak akses ini" value={hakForm.description}
                onChange={e => setHakForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup value={hakForm.status} onValueChange={v => setHakForm(p => ({ ...p, status: v as "active" | "inactive" }))} className="flex gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="active" id="hak-active" /><Label htmlFor="hak-active" className="cursor-pointer">Aktif</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="inactive" id="hak-inactive" /><Label htmlFor="hak-inactive" className="cursor-pointer">Nonaktif</Label></div>
              </RadioGroup>
              {/* Warning when deactivating used item */}
              {editingHak && editingHak.usedByPlans > 0 && hakForm.status === "inactive" && editingHak.status === "active" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2.5 mt-2 space-y-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Menonaktifkan hak akses ini tidak menghapus mapping yang sudah ada, tetapi hak akses ini tidak bisa dipilih untuk konfigurasi baru.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="hak-deactivate-confirm" checked={hakConfirmChecked} onCheckedChange={v => setHakConfirmChecked(v as boolean)} className="mt-0.5" />
                    <Label htmlFor="hak-deactivate-confirm" className="text-xs cursor-pointer leading-snug text-amber-700 dark:text-amber-300">Saya memahami dampaknya.</Label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHakModalOpen(false)}>Batal</Button>
            <Button onClick={saveHak}
              disabled={
                isDuplicateKey ||
                (availableKategoriForModal.length === 0 && !!hakForm.fiturId) ||
                (editingHak && editingHak.usedByPlans > 0 && hakForm.status === "inactive" && editingHak.status === "active" && !hakConfirmChecked) ||
                (hakForm.level === "sub_fitur" && hakForm.fiturId && selectedFiturSubFiturs.length === 0)
              }>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Delete Hak Akses */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{deleteTarget && deleteTarget.usedByPlans > 0 ? "Hapus hak akses yang sedang digunakan?" : "Hapus hak akses?"}</DialogTitle>
            <DialogDescription>
              {deleteTarget && deleteTarget.usedByPlans > 0
                ? `Hak akses ini sudah dimapping ke ${deleteTarget.usedByPlans} plan. Menghapusnya akan melepas hak akses ini dari semua plan tersebut.`
                : "Aksi ini tidak dapat dibatalkan."}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-3">
                <p className="font-medium text-sm">{deleteTarget.name}</p>
                <code className="text-xs font-mono text-primary">{deleteTarget.key}</code>
              </div>
              {deleteTarget.usedByPlans > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 space-y-1.5">
                  <p className="text-sm font-medium text-destructive">Dampak penghapusan:</p>
                  <ul className="text-xs text-destructive/80 list-disc list-inside space-y-0.5">
                    <li>Dimapping pada: <strong>{deleteTarget.usedByPlans} plan</strong></li>
                    <li>Mapping entitlement ke plan akan dihapus</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDeleteHak}>
              {deleteTarget && deleteTarget.usedByPlans > 0 ? "Hapus & Lepaskan Mapping" : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Bulk Action Warning */}
      <Dialog open={bulkActionModalOpen} onOpenChange={setBulkActionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Sebagian item tidak bisa dinonaktifkan</DialogTitle>
            <DialogDescription className="text-center">
              {bulkActionSection === "kategori"
                ? "Sebagian kategori aksi tidak bisa dinonaktifkan karena sudah digunakan oleh entitlement."
                : "Sebagian hak akses tidak bisa dinonaktifkan karena sudah dimapping ke plan membership."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setBulkActionModalOpen(false)}>Batalkan</Button>
            <Button onClick={() => executeBulkAction(bulkActionType, bulkActionSection, true)}>
              Lanjutkan untuk item yang aman saja
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
              { key: "empty", label: "🗂️ Empty State", desc: "Belum ada hak akses" },
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
