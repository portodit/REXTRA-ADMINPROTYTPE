import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Search, Plus, Lock, Edit2, Copy, Power, PowerOff,
} from "lucide-react";
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AddEditMappingDrawer, MappingData } from "./AddEditMappingDrawer";

export interface EntitlementMapping {
  id: string;
  entitlementId: string;
  entitlementName: string;
  entitlementKey: string;
  restrictionType: "unlimited" | "token_gated" | "frequency_limited" | "locked";
  tokenCost: number;
  usageQuota: number;
  isActive: boolean;
  lastUpdated: string;
}

// Demo data
const demoMappings: EntitlementMapping[] = [
  {
    id: "1", entitlementId: "ent1", entitlementName: "Lihat Profil Karier",
    entitlementKey: "career_profile.view", restrictionType: "unlimited",
    tokenCost: 0, usageQuota: 0, isActive: true, lastUpdated: "20/01/2025 14:30",
  },
  {
    id: "2", entitlementId: "ent2", entitlementName: "Gunakan AI Career Coach",
    entitlementKey: "ai_coach.use", restrictionType: "token_gated",
    tokenCost: 5, usageQuota: 0, isActive: true, lastUpdated: "19/01/2025 10:15",
  },
  {
    id: "3", entitlementId: "ent3", entitlementName: "Auto Fill CV",
    entitlementKey: "portfolio.auto_fill.use", restrictionType: "frequency_limited",
    tokenCost: 0, usageQuota: 10, isActive: true, lastUpdated: "18/01/2025 09:00",
  },
  {
    id: "4", entitlementId: "ent4", entitlementName: "Download Laporan",
    entitlementKey: "report.download", restrictionType: "token_gated",
    tokenCost: 10, usageQuota: 0, isActive: false, lastUpdated: "17/01/2025 16:45",
  },
  {
    id: "5", entitlementId: "ent5", entitlementName: "Akses Premium Template",
    entitlementKey: "template.premium.view", restrictionType: "unlimited",
    tokenCost: 0, usageQuota: 0, isActive: true, lastUpdated: "16/01/2025 11:20",
  },
];

interface AccessMappingTabProps {
  packageId: string;
  packageName: string;
}

type DemoState = "data" | "loading" | "empty";

export function AccessMappingTab({ packageId, packageName }: AccessMappingTabProps) {
  const [demoState] = useState<DemoState>("data");
  const [mappings, setMappings] = useState<EntitlementMapping[]>(demoMappings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMappingStatus, setFilterMappingStatus] = useState<string>("all");
  const [filterRestriction, setFilterRestriction] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<EntitlementMapping | null>(null);

  const filteredMappings = useMemo(() => {
    let result = [...mappings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.entitlementName.toLowerCase().includes(q) || m.entitlementKey.toLowerCase().includes(q));
    }
    if (filterMappingStatus !== "all") {
      result = result.filter(m => filterMappingStatus === "active" ? m.isActive : !m.isActive);
    }
    if (filterRestriction !== "all") {
      result = result.filter(m => m.restrictionType === filterRestriction);
    }
    switch (sortBy) {
      case "newest": result.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)); break;
      case "oldest": result.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated)); break;
      case "name-asc": result.sort((a, b) => a.entitlementName.localeCompare(b.entitlementName)); break;
      case "name-desc": result.sort((a, b) => b.entitlementName.localeCompare(a.entitlementName)); break;
    }
    return result;
  }, [mappings, searchQuery, filterMappingStatus, filterRestriction, sortBy]);

  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const paginatedMappings = filteredMappings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => ({
    total: mappings.length,
    unlimited: mappings.filter(m => m.restrictionType === "unlimited").length,
    token: mappings.filter(m => m.restrictionType === "token_gated").length,
    limit: mappings.filter(m => m.restrictionType === "frequency_limited").length,
  }), [mappings]);

  const existingMappingKeys = useMemo(() => mappings.map(m => m.entitlementKey), [mappings]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(paginatedMappings.map(m => m.id)) : new Set());
  };
  const handleSelectItem = (id: string, checked: boolean) => {
    const s = new Set(selectedIds);
    checked ? s.add(id) : s.delete(id);
    setSelectedIds(s);
  };
  const handleBulkActivate = () => {
    setMappings(prev => prev.map(m => selectedIds.has(m.id) ? { ...m, isActive: true } : m));
    toast({ title: `✓ ${selectedIds.size} mapping berhasil diaktifkan` });
    setSelectedIds(new Set());
  };
  const handleBulkDeactivate = () => {
    setMappings(prev => prev.map(m => selectedIds.has(m.id) ? { ...m, isActive: false } : m));
    toast({ title: `✓ ${selectedIds.size} mapping berhasil dinonaktifkan` });
    setSelectedIds(new Set());
  };
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "✓ Key disalin" });
  };
  const handleOpenAddDrawer = () => { setEditingMapping(null); setIsDrawerOpen(true); };
  const handleOpenEditDrawer = (m: EntitlementMapping) => { setEditingMapping(m); setIsDrawerOpen(true); };

  const handleSaveMapping = (data: MappingData) => {
    const ts = new Date().toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
    if (editingMapping) {
      setMappings(prev => prev.map(m => m.id === editingMapping.id ? { ...m, isActive: data.isActive, usageQuota: data.usageQuota, lastUpdated: ts } : m));
      toast({ title: "✓ Mapping berhasil diperbarui" });
    } else {
      const newMapping: EntitlementMapping = {
        id: `new-${Date.now()}`,
        entitlementId: data.entitlementId,
        entitlementName: data.entitlementName,
        entitlementKey: data.entitlementKey,
        restrictionType: data.restrictionType,
        tokenCost: data.tokenCost,
        usageQuota: data.usageQuota,
        isActive: data.isActive,
        lastUpdated: ts,
      };
      setMappings(prev => [newMapping, ...prev]);
      toast({ title: "✓ Mapping berhasil ditambahkan" });
    }
    setIsDrawerOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery(""); setFilterMappingStatus("all"); setFilterRestriction("all"); setSortBy("newest");
  };

  const isAllSelected = paginatedMappings.length > 0 && paginatedMappings.every(m => selectedIds.has(m.id));

  const getRestrictionBadge = (m: EntitlementMapping) => {
    switch (m.restrictionType) {
      case "unlimited": return <Badge variant="secondary" className="h-6 px-2.5 font-medium text-[10px]">Tanpa batas</Badge>;
      case "token_gated": return <Badge className="bg-destructive/10 text-destructive border-destructive/20 h-6 px-2.5 font-medium text-[10px]">Token</Badge>;
      case "frequency_limited": return <Badge className="bg-primary/10 text-primary border-primary/20 h-6 px-2.5 font-medium text-[10px]">Batas pakai</Badge>;
    }
  };

  const getParameter = (m: EntitlementMapping) => {
    switch (m.restrictionType) {
      case "unlimited": return <span className="text-muted-foreground">—</span>;
      case "token_gated": return <span>{m.tokenCost} token/aksi</span>;
      case "frequency_limited": return <span>Maks {m.usageQuota}x</span>;
    }
  };

  if (demoState === "loading") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-72" /><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      </div>
    );
  }

  if (demoState === "empty" || mappings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada mapping akses</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
          Mulai dengan menambahkan hak akses ke paket {packageName}.
        </p>
        <Button onClick={handleOpenAddDrawer} className="gap-2"><Plus className="h-4 w-4" />Tambah Mapping</Button>

        <AddEditMappingDrawer
          isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveMapping} editingMapping={editingMapping} packageName={packageName}
          existingMappingKeys={existingMappingKeys}
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Konfigurasi Akses</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pilih hak akses yang tersedia pada paket ini. Pembatasan (token/limit) mengikuti konfigurasi master.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/50 border">
            <span className="text-2xl font-bold text-foreground">{stats.total}</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-muted/30 border">
            <span className="text-2xl font-bold text-foreground">{stats.unlimited}</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Unlimited</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-destructive/5 border border-destructive/10">
            <span className="text-2xl font-bold text-destructive">{stats.token}</span>
            <span className="text-[10px] font-medium text-destructive uppercase tracking-wider">Token</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 border border-primary/10">
            <span className="text-2xl font-bold text-primary">{stats.limit}</span>
            <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Limit</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau key..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-11" />
            </div>
            <Select value={filterMappingStatus} onValueChange={setFilterMappingStatus}>
              <SelectTrigger className="w-36 h-10"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRestriction} onValueChange={setFilterRestriction}>
              <SelectTrigger className="w-36 h-10"><SelectValue placeholder="Pembatasan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pembatasan</SelectItem>
                <SelectItem value="unlimited">Tanpa batas</SelectItem>
                <SelectItem value="token_gated">Token</SelectItem>
                <SelectItem value="frequency_limited">Batas pakai</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Urutkan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenAddDrawer} className="gap-2 shrink-0"><Plus className="h-4 w-4" />Tambah Mapping</Button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium">{selectedIds.size} dipilih</span>
            <Button size="sm" variant="outline" onClick={handleBulkActivate} className="gap-1"><Power className="h-3.5 w-3.5" />Aktifkan</Button>
            <Button size="sm" variant="outline" onClick={handleBulkDeactivate} className="gap-1"><PowerOff className="h-3.5 w-3.5" />Nonaktifkan</Button>
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} /></TableHead>
                <TableHead>Nama Hak Akses</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Pembatasan</TableHead>
                <TableHead>Parameter</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[90px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Tidak ada mapping yang cocok.
                    {(searchQuery || filterMappingStatus !== "all" || filterRestriction !== "all") && (
                      <Button variant="link" size="sm" onClick={resetFilters} className="ml-2">Reset filter</Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : paginatedMappings.map(m => (
                <TableRow key={m.id} data-state={selectedIds.has(m.id) ? "selected" : undefined}>
                  <TableCell><Checkbox checked={selectedIds.has(m.id)} onCheckedChange={(c) => handleSelectItem(m.id, c as boolean)} /></TableCell>
                  <TableCell className="font-medium text-sm">{m.entitlementName}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleCopyKey(m.entitlementKey)} className="flex items-center gap-1.5 group">
                          <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{m.entitlementKey}</code>
                          <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Klik untuk menyalin</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{getRestrictionBadge(m)}</TableCell>
                  <TableCell className="text-sm">{getParameter(m)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={m.isActive ? "default" : "secondary"}>{m.isActive ? "Aktif" : "Nonaktif"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditDrawer(m)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <RextraTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMappings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
            itemsPerPageOptions={[10, 25, 50]}
          />
        )}
      </div>

      <AddEditMappingDrawer
        isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveMapping} editingMapping={editingMapping} packageName={packageName}
        existingMappingKeys={existingMappingKeys}
      />
    </TooltipProvider>
  );
}
