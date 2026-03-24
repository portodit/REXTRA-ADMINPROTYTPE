import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Plus,
  Edit,
  Copy,
  X,
  Package,
  Settings,
  Receipt,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Download,
  Calculator,
  Info,
  Check,
  RefreshCw,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RextraTablePagination } from "@/components/design-system/RextraTablePagination";

// Types
interface BundlePackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  pricePerToken: number;
  label?: string;
  displayOrder: number;
  status: "active" | "inactive";
}

interface PricingTier {
  id: string;
  from: number;
  to: number | null;
  discount: number;
  effectivePrice: number;
}

interface CustomPurchaseConfig {
  enabled: boolean;
  minTokens: number;
  maxTokens: number;
  basePrice: number;
  tiers: PricingTier[];
}

interface Transaction {
  id: string;
  timestamp: string;
  date: string;
  user: string;
  userName: string;
  type: "bundle" | "custom";
  tokens: number;
  amount: number;
  status: "success" | "pending" | "failed" | "expired" | "refund";
  invoiceId: string;
}

// Mock Data
const mockBundles: BundlePackage[] = [
  { id: "1", name: "Bundle Starter", tokens: 10, price: 10000, pricePerToken: 1000, displayOrder: 1, status: "active" },
  { id: "2", name: "Bundle Hemat", tokens: 50, price: 47500, pricePerToken: 950, label: "Popular", displayOrder: 2, status: "active" },
  { id: "3", name: "Bundle Value", tokens: 100, price: 90000, pricePerToken: 900, label: "Best Value", displayOrder: 3, status: "active" },
  { id: "4", name: "Bundle Pro", tokens: 500, price: 425000, pricePerToken: 850, displayOrder: 4, status: "active" },
  { id: "5", name: "Bundle Max", tokens: 1000, price: 800000, pricePerToken: 800, displayOrder: 5, status: "inactive" },
];

const mockConfig: CustomPurchaseConfig = {
  enabled: true,
  minTokens: 10,
  maxTokens: 10000,
  basePrice: 1000,
  tiers: [
    { id: "1", from: 10, to: 100, discount: 0, effectivePrice: 1000 },
    { id: "2", from: 101, to: 500, discount: 5, effectivePrice: 950 },
    { id: "3", from: 501, to: 1000, discount: 10, effectivePrice: 900 },
    { id: "4", from: 1001, to: 5000, discount: 15, effectivePrice: 850 },
    { id: "5", from: 5001, to: 10000, discount: 20, effectivePrice: 800 },
  ],
};

const mockTransactions: Transaction[] = [
  { id: "1", timestamp: "14:32", date: "15 Jan 2026", user: "john@example.com", userName: "John Doe", type: "bundle", tokens: 50, amount: 47500, status: "success", invoiceId: "TXN-2847" },
  { id: "2", timestamp: "14:28", date: "15 Jan 2026", user: "maria@example.com", userName: "Maria Garcia", type: "custom", tokens: 750, amount: 705000, status: "success", invoiceId: "TXN-2846" },
  { id: "3", timestamp: "13:42", date: "15 Jan 2026", user: "budi@example.com", userName: "Budi Santoso", type: "bundle", tokens: 100, amount: 90000, status: "pending", invoiceId: "TXN-2845" },
  { id: "4", timestamp: "12:30", date: "15 Jan 2026", user: "siti@example.com", userName: "Siti Aminah", type: "custom", tokens: 250, amount: 237500, status: "failed", invoiceId: "TXN-2844" },
  { id: "5", timestamp: "11:15", date: "15 Jan 2026", user: "agus@example.com", userName: "Agus Prasetyo", type: "bundle", tokens: 10, amount: 10000, status: "success", invoiceId: "TXN-2843" },
  { id: "6", timestamp: "10:45", date: "14 Jan 2026", user: "rina@example.com", userName: "Rina Wati", type: "custom", tokens: 1500, amount: 1275000, status: "success", invoiceId: "TXN-2842" },
  { id: "7", timestamp: "09:20", date: "14 Jan 2026", user: "doni@example.com", userName: "Doni Kusuma", type: "bundle", tokens: 500, amount: 425000, status: "expired", invoiceId: "TXN-2841" },
  { id: "8", timestamp: "16:55", date: "13 Jan 2026", user: "lina@example.com", userName: "Lina Mariana", type: "custom", tokens: 300, amount: 277500, status: "refund", invoiceId: "TXN-2840" },
];

type ViewState = "loading" | "empty" | "error" | "data";

export default function SistemTokenPengadaan() {
  const [viewState, setViewState] = useState<ViewState>("data");
  const [activeTab, setActiveTab] = useState("bundle");

  // Bundle tab state
  const [bundleSearch, setBundleSearch] = useState("");
  const [bundleStatusFilter, setBundleStatusFilter] = useState("all");
  const [bundleSortBy, setBundleSortBy] = useState("newest");
  const [bundlePage, setBundlePage] = useState(1);
  const [bundles, setBundles] = useState<BundlePackage[]>(mockBundles);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<BundlePackage | null>(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [bundleToDeactivate, setBundleToDeactivate] = useState<BundlePackage | null>(null);

  // Bundle form state
  const [bundleForm, setBundleForm] = useState({
    name: "",
    tokens: "",
    price: "",
    label: "",
    displayOrder: "",
    status: "active" as "active" | "inactive",
  });
  const [bundleFormErrors, setBundleFormErrors] = useState<Record<string, string>>({});

  // Custom purchase tab state
  const [customConfig, setCustomConfig] = useState<CustomPurchaseConfig>(mockConfig);
  const [configDirty, setConfigDirty] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [simulationInput, setSimulationInput] = useState("");
  const [simulationResult, setSimulationResult] = useState<{
    breakdown: { tokens: number; price: number; tier: number; discount: number }[];
    total: number;
    average: number;
  } | null>(null);
  const [guardrailAcknowledged, setGuardrailAcknowledged] = useState(false);

  // Transaction tab state
  const [txSearch, setTxSearch] = useState("");
  const [txPeriod, setTxPeriod] = useState("30d");
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txStatusFilter, setTxStatusFilter] = useState("all");
  const [txPage, setTxPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      description: `${text} telah disalin ke clipboard.`,
    });
  };

  // Bundle filtering and sorting
  const filteredBundles = useMemo(() => {
    let result = [...bundles];
    
    if (bundleSearch) {
      const search = bundleSearch.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(search) || 
        b.tokens.toString().includes(search)
      );
    }
    
    if (bundleStatusFilter !== "all") {
      result = result.filter(b => b.status === bundleStatusFilter);
    }
    
    switch (bundleSortBy) {
      case "newest":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "oldest":
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "tokens":
        result.sort((a, b) => b.tokens - a.tokens);
        break;
    }
    
    return result;
  }, [bundles, bundleSearch, bundleStatusFilter, bundleSortBy]);

  // Transaction filtering
  const filteredTransactions = useMemo(() => {
    let result = [...mockTransactions];
    
    if (txSearch) {
      const search = txSearch.toLowerCase();
      result = result.filter(t => 
        t.user.toLowerCase().includes(search) || 
        t.userName.toLowerCase().includes(search) ||
        t.invoiceId.toLowerCase().includes(search)
      );
    }
    
    if (txTypeFilter !== "all") {
      result = result.filter(t => t.type === txTypeFilter);
    }
    
    if (txStatusFilter !== "all") {
      result = result.filter(t => t.status === txStatusFilter);
    }
    
    return result;
  }, [txSearch, txTypeFilter, txStatusFilter]);

  // Bundle modal handlers
  const openAddBundleModal = () => {
    setEditingBundle(null);
    setBundleForm({
      name: "",
      tokens: "",
      price: "",
      label: "",
      displayOrder: String(bundles.length + 1),
      status: "active",
    });
    setBundleFormErrors({});
    setBundleModalOpen(true);
  };

  const openEditBundleModal = (bundle: BundlePackage) => {
    setEditingBundle(bundle);
    setBundleForm({
      name: bundle.name,
      tokens: String(bundle.tokens),
      price: String(bundle.price),
      label: bundle.label || "",
      displayOrder: String(bundle.displayOrder),
      status: bundle.status,
    });
    setBundleFormErrors({});
    setBundleModalOpen(true);
  };

  const validateBundleForm = () => {
    const errors: Record<string, string> = {};
    
    if (!bundleForm.name.trim()) {
      errors.name = "Nama paket wajib diisi";
    } else if (bundleForm.name.length > 50) {
      errors.name = "Nama paket maksimal 50 karakter";
    } else if (bundles.some(b => b.name.toLowerCase() === bundleForm.name.toLowerCase() && b.id !== editingBundle?.id)) {
      errors.name = "Nama paket sudah digunakan. Gunakan nama lain.";
    }
    
    const tokens = parseInt(bundleForm.tokens);
    if (!bundleForm.tokens || isNaN(tokens)) {
      errors.tokens = "Jumlah token wajib diisi";
    } else if (tokens < 1 || tokens > 1000000) {
      errors.tokens = "Jumlah token harus antara 1 - 1.000.000";
    }
    
    const price = parseInt(bundleForm.price);
    if (!bundleForm.price || isNaN(price)) {
      errors.price = "Harga wajib diisi";
    } else if (price < 1 || price > 1000000000) {
      errors.price = "Harga harus antara Rp 1 - Rp 1.000.000.000";
    }
    
    const displayOrder = parseInt(bundleForm.displayOrder);
    if (!bundleForm.displayOrder || isNaN(displayOrder)) {
      errors.displayOrder = "Urutan tampil wajib diisi";
    }
    
    setBundleFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveBundle = () => {
    if (!validateBundleForm()) return;
    
    const tokens = parseInt(bundleForm.tokens);
    const price = parseInt(bundleForm.price);
    
    // Check if deactivating
    if (editingBundle && editingBundle.status === "active" && bundleForm.status === "inactive") {
      setBundleToDeactivate(editingBundle);
      setDeactivateDialogOpen(true);
      return;
    }
    
    saveBundle();
  };

  const saveBundle = () => {
    const tokens = parseInt(bundleForm.tokens);
    const price = parseInt(bundleForm.price);
    
    const newBundle: BundlePackage = {
      id: editingBundle?.id || String(Date.now()),
      name: bundleForm.name.trim(),
      tokens,
      price,
      pricePerToken: Math.round(price / tokens),
      label: bundleForm.label.trim() || undefined,
      displayOrder: parseInt(bundleForm.displayOrder),
      status: bundleForm.status,
    };
    
    if (editingBundle) {
      setBundles(prev => prev.map(b => b.id === editingBundle.id ? newBundle : b));
      toast({
        title: "Perubahan paket bundle berhasil disimpan",
        description: `Paket "${newBundle.name}" telah diperbarui.`,
      });
    } else {
      setBundles(prev => [...prev, newBundle]);
      toast({
        title: "Paket bundle berhasil ditambahkan",
        description: `Paket "${newBundle.name}" telah ditambahkan.`,
      });
    }
    
    setBundleModalOpen(false);
    setDeactivateDialogOpen(false);
    setBundleToDeactivate(null);
  };

  // Custom config handlers
  const handleToggleCustomPurchase = (enabled: boolean) => {
    if (!enabled && customConfig.enabled) {
      setDisableDialogOpen(true);
      return;
    }
    setCustomConfig(prev => ({ ...prev, enabled }));
    setConfigDirty(true);
  };

  const confirmDisableCustom = () => {
    setCustomConfig(prev => ({ ...prev, enabled: false }));
    setConfigDirty(true);
    setDisableDialogOpen(false);
  };

  const updateTier = (tierId: string, field: keyof PricingTier, value: number | null) => {
    setCustomConfig(prev => ({
      ...prev,
      tiers: prev.tiers.map(t => {
        if (t.id !== tierId) return t;
        const updated = { ...t, [field]: value };
        if (field === "discount") {
          updated.effectivePrice = Math.round(prev.basePrice * (1 - (value || 0) / 100));
        }
        return updated;
      }),
    }));
    setConfigDirty(true);
  };

  const addTier = () => {
    if (customConfig.tiers.length >= 10) return;
    
    const lastTier = customConfig.tiers[customConfig.tiers.length - 1];
    const newTier: PricingTier = {
      id: String(Date.now()),
      from: lastTier ? (lastTier.to || lastTier.from) + 1 : customConfig.minTokens,
      to: null,
      discount: 0,
      effectivePrice: customConfig.basePrice,
    };
    
    setCustomConfig(prev => ({
      ...prev,
      tiers: [...prev.tiers, newTier],
    }));
    setConfigDirty(true);
  };

  const removeTier = (tierId: string) => {
    setCustomConfig(prev => ({
      ...prev,
      tiers: prev.tiers.filter(t => t.id !== tierId),
    }));
    setConfigDirty(true);
  };

  // Calculate simulation
  const calculateSimulation = () => {
    const tokens = parseInt(simulationInput);
    if (isNaN(tokens)) {
      toast({ title: "Input tidak valid", variant: "destructive" });
      return;
    }
    
    if (tokens < customConfig.minTokens) {
      toast({ 
        title: `Minimal pembelian ${formatCurrency(customConfig.minTokens)} token`, 
        variant: "destructive" 
      });
      return;
    }
    
    if (tokens > customConfig.maxTokens) {
      toast({ 
        title: `Maksimal pembelian ${formatCurrency(customConfig.maxTokens)} token`, 
        variant: "destructive" 
      });
      return;
    }
    
    const breakdown: { tokens: number; price: number; tier: number; discount: number }[] = [];
    let remaining = tokens;
    let total = 0;
    
    for (let i = 0; i < customConfig.tiers.length && remaining > 0; i++) {
      const tier = customConfig.tiers[i];
      const tierMax = tier.to || customConfig.maxTokens;
      const tierSize = tierMax - tier.from + 1;
      const tokensInTier = Math.min(remaining, tierSize);
      const tierTotal = tokensInTier * tier.effectivePrice;
      
      breakdown.push({
        tokens: tokensInTier,
        price: tierTotal,
        tier: i + 1,
        discount: tier.discount,
      });
      
      total += tierTotal;
      remaining -= tokensInTier;
    }
    
    setSimulationResult({
      breakdown,
      total,
      average: Math.round(total / tokens),
    });
  };

  // Check guardrail violations
  const guardrailViolations = useMemo(() => {
    const threshold = customConfig.basePrice * 0.9;
    return customConfig.tiers.filter(t => t.effectivePrice < threshold);
  }, [customConfig]);

  const hasGuardrailWarning = guardrailViolations.length > 0;

  // Check tier validation errors
  const tierErrors = useMemo(() => {
    const errors: string[] = [];
    
    for (let i = 1; i < customConfig.tiers.length; i++) {
      const prev = customConfig.tiers[i - 1];
      const curr = customConfig.tiers[i];
      
      if (prev.to && curr.from <= prev.to) {
        errors.push(`Tier ${i} dan Tier ${i + 1} overlap. Range tidak boleh tumpang tindih.`);
      }
      
      if (curr.from < prev.from) {
        errors.push("Tier harus berurutan dari kecil ke besar.");
      }
    }
    
    return errors;
  }, [customConfig.tiers]);

  const canSaveConfig = tierErrors.length === 0 && (!hasGuardrailWarning || guardrailAcknowledged);

  const handleSaveConfig = () => {
    if (!canSaveConfig) return;
    
    toast({
      title: "Pengaturan pembelian custom berhasil disimpan",
    });
    setConfigDirty(false);
    setGuardrailAcknowledged(false);
  };

  // Transaction detail
  const openTransactionDetail = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setDrawerOpen(true);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const configs = {
      success: { label: "Berhasil", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      pending: { label: "Menunggu", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      failed: { label: "Gagal", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      expired: { label: "Expired", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
      refund: { label: "Refund", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    };
    const config = configs[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: Transaction["type"]) => {
    if (type === "bundle") {
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Package className="h-3 w-3 mr-1" />Bundle</Badge>;
    }
    return <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"><Settings className="h-3 w-3 mr-1" />Custom</Badge>;
  };

  // Loading State
  const LoadingState = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );

  // Empty State Bundle
  const EmptyBundleState = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">Belum Ada Paket Bundle</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6 px-4">
        Buat paket bundle untuk memudahkan user melakukan top up dengan harga dan jumlah token yang tetap.
      </p>
      <Button onClick={openAddBundleModal}>
        <Plus className="h-4 w-4 mr-2" />
        Tambah Paket Bundle
      </Button>
    </div>
  );

  // Empty State Transaction
  const EmptyTransactionState = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Receipt className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">Belum Ada Transaksi Top Up</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6 px-4">
        Belum ada transaksi top up pada periode ini. Coba ubah filter periode atau tunggu transaksi masuk.
      </p>
      <Button variant="outline" onClick={() => setTxPeriod("90d")}>
        Ubah Periode
      </Button>
    </div>
  );

  // Error State
  const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">Gagal Memuat Data</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6 px-4">
        Terjadi kesalahan saat memuat data. Silakan coba lagi.
      </p>
      <Button onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Coba Lagi
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Breadcrumb - Hidden on mobile */}
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sistem-token/ikhtisar">Sistem Token</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pengadaan Token</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Pengadaan Token</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-96" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h4 className="font-semibold text-sm">Catatan Penting</h4>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                      <p>• Pengadaan token menghasilkan penambahan saldo token dan wajib tercatat pada ledger.</p>
                      <p>• Perubahan aturan harga dan batas pembelian berdampak pada revenue dan risiko penyalahgunaan, harus terkontrol.</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Kelola paket Top Up, aturan pembelian, dan pantau transaksi pengadaan token.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 h-10 sm:h-11">
              <TabsTrigger value="bundle" className="flex-1 sm:flex-none gap-1 sm:gap-2 px-3 sm:px-4 text-xs sm:text-sm">
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Paket Bundle</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex-1 sm:flex-none gap-1 sm:gap-2 px-3 sm:px-4 text-xs sm:text-sm">
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Pembelian Custom</span>
                <span className="sm:hidden">Custom</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex-1 sm:flex-none gap-1 sm:gap-2 px-3 sm:px-4 text-xs sm:text-sm">
                <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Transaksi Top Up</span>
                <span className="sm:hidden">Transaksi</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content: Paket Bundle */}
          <TabsContent value="bundle" className="space-y-4">
            {viewState === "loading" ? (
              <LoadingState />
            ) : viewState === "error" ? (
              <ErrorState onRetry={() => setViewState("data")} />
            ) : filteredBundles.length === 0 && !bundleSearch && bundleStatusFilter === "all" ? (
              <EmptyBundleState />
            ) : (
              <>
                {/* Control Bar */}
                <div className="flex flex-col gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari paket berdasarkan nama atau jumlah token..."
                      value={bundleSearch}
                      onChange={(e) => setBundleSearch(e.target.value)}
                      className="pl-9 h-9 sm:h-10 text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Select value={bundleStatusFilter} onValueChange={setBundleStatusFilter}>
                      <SelectTrigger className="w-[110px] sm:w-[130px] h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={bundleSortBy} onValueChange={setBundleSortBy}>
                      <SelectTrigger className="w-[130px] sm:w-[150px] h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="oldest">Terlama</SelectItem>
                        <SelectItem value="price_high">Harga Tertinggi</SelectItem>
                        <SelectItem value="price_low">Harga Terendah</SelectItem>
                        <SelectItem value="tokens">Token Terbanyak</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1" />
                    <Button onClick={openAddBundleModal} className="h-9 sm:h-10 text-xs sm:text-sm">
                      <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Tambah Paket Bundle</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </div>
                </div>

                {/* Bundle Table */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Nama Paket</TableHead>
                            <TableHead className="text-right min-w-[80px]">Token</TableHead>
                            <TableHead className="text-right min-w-[100px]">Harga (Rp)</TableHead>
                            <TableHead className="text-right min-w-[100px] hidden sm:table-cell">Harga/Token</TableHead>
                            <TableHead className="min-w-[80px] hidden md:table-cell">Label</TableHead>
                            <TableHead className="text-center min-w-[70px] hidden lg:table-cell">Urutan</TableHead>
                            <TableHead className="text-center min-w-[80px]">Status</TableHead>
                            <TableHead className="text-center min-w-[60px]">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBundles.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                Tidak ada paket yang ditemukan
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredBundles.map((bundle) => (
                              <TableRow key={bundle.id}>
                                <TableCell className="font-medium">{bundle.name}</TableCell>
                                <TableCell className="text-right">{formatCurrency(bundle.tokens)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(bundle.price)}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell">Rp {formatCurrency(bundle.pricePerToken)}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {bundle.label ? (
                                    <Badge variant="secondary" className="text-xs">{bundle.label}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center hidden lg:table-cell">{bundle.displayOrder}</TableCell>
                                <TableCell className="text-center">
                                  {bundle.status === "active" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                      <Check className="h-3 w-3 mr-1" />Aktif
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">
                                      <X className="h-3 w-3 mr-1" />Nonaktif
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => openEditBundleModal(bundle)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagination */}
                {filteredBundles.length > 10 && (
                  <RextraTablePagination
                    currentPage={1}
                    totalPages={Math.ceil(filteredBundles.length / 10)}
                    totalItems={filteredBundles.length}
                    itemsPerPage={10}
                    onPageChange={() => {}}
                    onItemsPerPageChange={() => {}}
                    itemsPerPageOptions={[10, 25, 50]}
                  />
                )}
              </>
            )}
          </TabsContent>

          {/* Tab Content: Pembelian Custom */}
          <TabsContent value="custom" className="space-y-4 sm:space-y-6">
            {/* Status Toggle - Compact inline */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${customConfig.enabled ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-medium">Pembelian Custom</span>
                <Badge variant={customConfig.enabled ? "default" : "secondary"} className="text-xs">
                  {customConfig.enabled ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <Switch
                checked={customConfig.enabled}
                onCheckedChange={handleToggleCustomPurchase}
              />
            </div>

            {/* Section 1: Purchase Limits */}
            <Card className={!customConfig.enabled ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Batas Pembelian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tentukan minimal dan maksimal token yang bisa dibeli per transaksi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Minimal Token</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={customConfig.minTokens}
                        onChange={(e) => {
                          setCustomConfig(prev => ({ ...prev, minTokens: parseInt(e.target.value) || 0 }));
                          setConfigDirty(true);
                        }}
                        className="h-9 sm:h-10 text-sm"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">token</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Maksimal Token</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={customConfig.maxTokens}
                        onChange={(e) => {
                          setCustomConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 0 }));
                          setConfigDirty(true);
                        }}
                        className="h-9 sm:h-10 text-sm"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">token</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    User hanya bisa membeli {formatCurrency(customConfig.minTokens)} - {formatCurrency(customConfig.maxTokens)} token per transaksi
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Base Price */}
            <Card className={!customConfig.enabled ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Harga Rekomendasi per Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Harga baseline yang akan digunakan sebagai acuan sebelum diskon.
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Harga per Token</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rp</span>
                    <Input
                      type="number"
                      value={customConfig.basePrice}
                      onChange={(e) => {
                        const newPrice = parseInt(e.target.value) || 0;
                        setCustomConfig(prev => ({
                          ...prev,
                          basePrice: newPrice,
                          tiers: prev.tiers.map(t => ({
                            ...t,
                            effectivePrice: Math.round(newPrice * (1 - t.discount / 100)),
                          })),
                        }));
                        setConfigDirty(true);
                      }}
                      className="h-9 sm:h-10 text-sm max-w-[200px]"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                    Harga ini menjadi baseline untuk tier 1 (tanpa diskon)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Tier Pricing */}
            <Card className={!customConfig.enabled ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                    Aturan Diskon Bertingkat
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTier}
                    disabled={customConfig.tiers.length >= 10}
                    className="h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Tambah Tier
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Setup tier pricing untuk memberikan diskon otomatis berdasarkan jumlah pembelian. Max 10 tier.
                </p>
                
                {/* Tier Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Dari</TableHead>
                        <TableHead className="min-w-[80px]">Sampai</TableHead>
                        <TableHead className="min-w-[90px]">Diskon (%)</TableHead>
                        <TableHead className="min-w-[100px] hidden sm:table-cell">Harga Efektif</TableHead>
                        <TableHead className="w-[50px] text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customConfig.tiers.map((tier, index) => (
                        <TableRow key={tier.id} className={tierErrors.length > 0 && index > 0 ? "border-red-300" : ""}>
                          <TableCell>
                            <Input
                              type="number"
                              value={tier.from}
                              onChange={(e) => updateTier(tier.id, "from", parseInt(e.target.value) || 0)}
                              className="h-8 text-sm w-20"
                              disabled={index === 0}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={tier.to || ""}
                              onChange={(e) => updateTier(tier.id, "to", e.target.value ? parseInt(e.target.value) : null)}
                              className="h-8 text-sm w-20"
                              placeholder="∞"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={tier.discount}
                              onChange={(e) => {
                                let val = parseInt(e.target.value) || 0;
                                if (val > 100) val = 100;
                                if (val < 0) val = 0;
                                updateTier(tier.id, "discount", val);
                              }}
                              className="h-8 text-sm w-20"
                              min={0}
                              max={100}
                            />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm font-medium">Rp {formatCurrency(tier.effectivePrice)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {index === 0 ? (
                              <span className="text-muted-foreground text-xs">—</span>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeTier(tier.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Tier Errors */}
                {tierErrors.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    {tierErrors.map((error, i) => (
                      <p key={i} className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>Tier pertama tidak bisa dihapus (baseline pricing)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Price Simulation */}
            <Card className={!customConfig.enabled ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Simulasi Harga (Preview)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Lihat estimasi harga berdasarkan tier yang sudah diatur.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm whitespace-nowrap">User beli</span>
                    <Input
                      type="number"
                      value={simulationInput}
                      onChange={(e) => setSimulationInput(e.target.value)}
                      placeholder="750"
                      className="h-9 sm:h-10 text-sm max-w-[150px]"
                    />
                    <span className="text-sm whitespace-nowrap">token</span>
                  </div>
                  <Button onClick={calculateSimulation} className="h-9 sm:h-10">
                    <Calculator className="h-4 w-4 mr-2" />
                    Hitung
                  </Button>
                </div>

                {simulationResult && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm">Breakdown Harga:</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      {simulationResult.breakdown.map((item, i) => (
                        <p key={i}>
                          • {formatCurrency(item.tokens)} token @ Rp {formatCurrency(customConfig.tiers[i]?.effectivePrice || customConfig.basePrice)} 
                          (tier {item.tier}{item.discount > 0 ? `, diskon ${item.discount}%` : ""}) = Rp {formatCurrency(item.price)}
                        </p>
                      ))}
                    </div>
                    <div className="pt-2 border-t space-y-1 font-medium text-sm">
                      <p>Total: Rp {formatCurrency(simulationResult.total)}</p>
                      <p>Rata-rata: Rp {formatCurrency(simulationResult.average)}/token</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guardrail Warning */}
            {hasGuardrailWarning && customConfig.enabled && (
              <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="h-5 w-5" />
                    Guardrail Harga
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guardrailViolations.map((tier, i) => (
                    <div key={tier.id} className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                      <p className="font-medium">Tier {customConfig.tiers.indexOf(tier) + 1}: Harga efektif Rp {formatCurrency(tier.effectivePrice)} lebih rendah dari threshold Rp {formatCurrency(Math.round(customConfig.basePrice * 0.9))}</p>
                    </div>
                  ))}
                  <div className="space-y-2 pt-2 text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                    <p>• Harga rekomendasi: Rp {formatCurrency(customConfig.basePrice)}</p>
                    <p>• Threshold minimal (90%): Rp {formatCurrency(Math.round(customConfig.basePrice * 0.9))}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="guardrail-ack"
                      checked={guardrailAcknowledged}
                      onCheckedChange={(checked) => setGuardrailAcknowledged(checked as boolean)}
                    />
                    <Label htmlFor="guardrail-ack" className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                      Saya memahami risiko pricing ini dan tetap ingin menyimpan
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => {
                setCustomConfig(mockConfig);
                setConfigDirty(false);
                setGuardrailAcknowledged(false);
              }}>
                Batal
              </Button>
              <Button onClick={handleSaveConfig} disabled={!canSaveConfig || !configDirty}>
                Simpan Pengaturan
              </Button>
            </div>
          </TabsContent>

          {/* Tab Content: Transaksi Top Up */}
          <TabsContent value="transactions" className="space-y-4">
            {viewState === "loading" ? (
              <LoadingState />
            ) : viewState === "error" ? (
              <ErrorState onRetry={() => setViewState("data")} />
            ) : (
              <>
                {/* Control Bar */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={txPeriod} onValueChange={setTxPeriod}>
                      <SelectTrigger className="w-full sm:w-[160px] h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                        <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                        <SelectItem value="90d">90 Hari Terakhir</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari user, invoice, atau reference ID..."
                        value={txSearch}
                        onChange={(e) => setTxSearch(e.target.value)}
                        className="pl-9 h-9 sm:h-10 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Select value={txTypeFilter} onValueChange={setTxTypeFilter}>
                      <SelectTrigger className="w-[100px] sm:w-[120px] h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={txStatusFilter} onValueChange={setTxStatusFilter}>
                      <SelectTrigger className="w-[130px] sm:w-[150px] h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="success">Berhasil</SelectItem>
                        <SelectItem value="pending">Menunggu</SelectItem>
                        <SelectItem value="failed">Gagal</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1" />
                    <Button variant="outline" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <Download className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>

                {filteredTransactions.length === 0 ? (
                  <EmptyTransactionState />
                ) : (
                  <>
                    {/* Transaction Table */}
                    <Card>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="min-w-[100px]">Waktu</TableHead>
                                <TableHead className="min-w-[150px]">User</TableHead>
                                <TableHead className="min-w-[90px]">Jenis</TableHead>
                                <TableHead className="text-right min-w-[70px]">Token</TableHead>
                                <TableHead className="text-right min-w-[100px] hidden sm:table-cell">Bayar (Rp)</TableHead>
                                <TableHead className="min-w-[90px]">Status</TableHead>
                                <TableHead className="min-w-[120px] hidden md:table-cell">Invoice</TableHead>
                                <TableHead className="text-center min-w-[60px]">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                  <TableCell>
                                    <div className="text-sm">{tx.timestamp}</div>
                                    <div className="text-xs text-muted-foreground">{tx.date}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm font-medium truncate max-w-[150px]">{tx.userName}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{tx.user}</div>
                                  </TableCell>
                                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                                  <TableCell className="text-right font-medium">{formatCurrency(tx.tokens)}</TableCell>
                                  <TableCell className="text-right hidden sm:table-cell">{formatCurrency(tx.amount)}</TableCell>
                                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-mono">{tx.invoiceId}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyToClipboard(tx.invoiceId)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() => openTransactionDetail(tx)}
                                    >
                                      Detail
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pagination */}
                    {filteredTransactions.length > 10 && (
                      <RextraTablePagination
                        currentPage={1}
                        totalPages={Math.ceil(filteredTransactions.length / 10)}
                        totalItems={filteredTransactions.length}
                        itemsPerPage={10}
                        onPageChange={() => {}}
                        onItemsPerPageChange={() => {}}
                        itemsPerPageOptions={[10, 25, 50]}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bundle Modal */}
      <Dialog open={bundleModalOpen} onOpenChange={setBundleModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBundle ? "Edit Paket Bundle" : "Tambah Paket Bundle"}</DialogTitle>
            <DialogDescription>
              Paket bundle memudahkan user melakukan top up dengan jumlah token dan harga tetap.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="bundle-name" className="text-sm">Nama Paket *</Label>
              <Input
                id="bundle-name"
                value={bundleForm.name}
                onChange={(e) => setBundleForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Bundle Hemat"
                className={bundleFormErrors.name ? "border-red-500" : ""}
              />
              {bundleFormErrors.name && (
                <p className="text-xs text-red-500">{bundleFormErrors.name}</p>
              )}
            </div>

            {/* Tokens */}
            <div className="space-y-2">
              <Label htmlFor="bundle-tokens" className="text-sm">Jumlah Token *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bundle-tokens"
                  type="number"
                  value={bundleForm.tokens}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, tokens: e.target.value }))}
                  placeholder="100"
                  className={bundleFormErrors.tokens ? "border-red-500" : ""}
                />
                <span className="text-sm text-muted-foreground">token</span>
              </div>
              {bundleFormErrors.tokens && (
                <p className="text-xs text-red-500">{bundleFormErrors.tokens}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="bundle-price" className="text-sm">Harga *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rp</span>
                <Input
                  id="bundle-price"
                  type="number"
                  value={bundleForm.price}
                  onChange={(e) => setBundleForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="90000"
                  className={bundleFormErrors.price ? "border-red-500" : ""}
                />
              </div>
              {bundleFormErrors.price && (
                <p className="text-xs text-red-500">{bundleFormErrors.price}</p>
              )}
            </div>

            {/* Price per token (read-only) */}
            {bundleForm.tokens && bundleForm.price && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Harga per token: Rp {formatCurrency(Math.round(parseInt(bundleForm.price) / parseInt(bundleForm.tokens)))}
                </span>
              </div>
            )}

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="bundle-label" className="text-sm">Label/Tag (opsional)</Label>
              <Input
                id="bundle-label"
                value={bundleForm.label}
                onChange={(e) => setBundleForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Popular, Best Value, Promo"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="bundle-order" className="text-sm">Urutan Tampil *</Label>
              <Input
                id="bundle-order"
                type="number"
                value={bundleForm.displayOrder}
                onChange={(e) => setBundleForm(prev => ({ ...prev, displayOrder: e.target.value }))}
                placeholder="1"
                className={bundleFormErrors.displayOrder ? "border-red-500" : ""}
              />
              {bundleFormErrors.displayOrder && (
                <p className="text-xs text-red-500">{bundleFormErrors.displayOrder}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Urutan menentukan posisi paket di UI user
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm">Status *</Label>
              <RadioGroup
                value={bundleForm.status}
                onValueChange={(value) => setBundleForm(prev => ({ ...prev, status: value as "active" | "inactive" }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="text-sm font-normal">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="status-inactive" />
                  <Label htmlFor="status-inactive" className="text-sm font-normal">Nonaktif</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBundleModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveBundle}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan paket ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Paket "{bundleToDeactivate?.name}" tidak bisa dibeli lagi setelah dinonaktifkan. Histori transaksi tetap ada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={saveBundle}>Nonaktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disable Custom Purchase Dialog */}
      <AlertDialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan pembelian custom?</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi dan riwayat tetap aman, namun opsi pembelian custom di sisi user tidak akan tersedia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisableCustom}>Nonaktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transaction Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-[440px] overflow-y-auto p-0">
          {selectedTransaction && (
            <>
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <SheetTitle className="text-base font-semibold">Detail Transaksi</SheetTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selectedTransaction.invoiceId}-20260115</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => copyToClipboard(selectedTransaction.invoiceId + "-20260115")}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedTransaction.status)}
                  <span className="text-xs text-muted-foreground">
                    {selectedTransaction.date}, {selectedTransaction.timestamp} WIB
                  </span>
                </div>
              </div>

              {/* Content with Tabs */}
              <div className="px-4 sm:px-6 py-4">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 h-9 mb-4">
                    <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                    <TabsTrigger value="payment" className="text-xs">Pembayaran</TabsTrigger>
                    <TabsTrigger value="ledger" className="text-xs">Ledger</TabsTrigger>
                  </TabsList>

                  {/* Tab: Info */}
                  <TabsContent value="info" className="space-y-4 mt-0">
                    {/* User Info - Compact Table */}
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">User</span>
                      </div>
                      <div className="divide-y text-sm">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Nama</span>
                          <span className="px-3 py-2 font-medium">{selectedTransaction.userName}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Email</span>
                          <span className="px-3 py-2 text-primary">{selectedTransaction.user}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">User ID</span>
                          <div className="px-3 py-2 flex items-center gap-2">
                            <span className="font-mono text-xs">USR-{Math.floor(Math.random() * 90000) + 10000}</span>
                            <Button variant="link" className="p-0 h-auto text-xs">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Info - Compact Table */}
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pembelian</span>
                      </div>
                      <div className="divide-y text-sm">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Jenis</span>
                          <div className="px-3 py-2">{getTypeBadge(selectedTransaction.type)}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Token</span>
                          <span className="px-3 py-2 font-medium">{formatCurrency(selectedTransaction.tokens)} token</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Total</span>
                          <span className="px-3 py-2 font-medium">Rp {formatCurrency(selectedTransaction.amount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown for Custom */}
                    {selectedTransaction.type === "custom" && (
                      <div className="rounded-lg border p-3 bg-muted/30 space-y-2 text-xs">
                        <p className="font-medium text-sm">Breakdown Harga:</p>
                        <p>• 100 token @ Rp 1,000 (tier 1) = Rp 100,000</p>
                        <p>• 400 token @ Rp 950 (tier 2, -5%) = Rp 380,000</p>
                        <p>• 250 token @ Rp 900 (tier 3, -10%) = Rp 225,000</p>
                        <div className="pt-2 border-t text-sm font-medium">
                          <p>Rata-rata: Rp {formatCurrency(Math.round(selectedTransaction.amount / selectedTransaction.tokens))}/token</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Tab: Payment */}
                  <TabsContent value="payment" className="mt-0">
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pembayaran</span>
                      </div>
                      <div className="divide-y text-sm">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Metode</span>
                          <span className="px-3 py-2">GoPay</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Gateway</span>
                          <span className="px-3 py-2">Midtrans</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Status</span>
                          <span className="px-3 py-2 text-emerald-600 font-medium">Success</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Gateway Ref</span>
                          <div className="px-3 py-2 flex items-center gap-2">
                            <span className="font-mono text-xs">MT-2026-xxxx-xxxx</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => copyToClipboard("MT-2026-xxxx-xxxx")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Paid At</span>
                          <span className="px-3 py-2 text-xs">{selectedTransaction.date}, {selectedTransaction.timestamp}:45 WIB</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab: Ledger */}
                  <TabsContent value="ledger" className="space-y-4 mt-0">
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Token Ledger</span>
                      </div>
                      <div className="divide-y text-sm">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Entry ID</span>
                          <span className="px-3 py-2 font-mono text-xs">LED-{Math.floor(Math.random() * 9000) + 1000}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Token In</span>
                          <span className="px-3 py-2 text-emerald-600 font-medium">+{formatCurrency(selectedTransaction.tokens)}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Sebelum</span>
                          <span className="px-3 py-2">{formatCurrency(Math.floor(Math.random() * 1000))}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Setelah</span>
                          <span className="px-3 py-2 font-medium">{formatCurrency(Math.floor(Math.random() * 1000) + selectedTransaction.tokens)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Metadata</span>
                      </div>
                      <div className="divide-y text-sm">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">IP</span>
                          <span className="px-3 py-2 font-mono text-xs">103.xx.xx.xx</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Device</span>
                          <span className="px-3 py-2 text-xs">Mobile - Android 13</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] items-center">
                          <span className="px-3 py-2 text-muted-foreground bg-muted/30">Location</span>
                          <span className="px-3 py-2 text-xs">Surabaya, Jawa Timur</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
