import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Plus, Pencil, Trash2, Copy, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DurationSwitcher } from "./DurationSwitcher";
import { supabase } from "@/integrations/supabase/client";
import type { PlanDuration, AccessMapping, DurationMonth, RestrictionType, DurationMode } from "./types";
import { DURATION_LABELS } from "./types";

interface EntitlementOption {
  id: string;
  name: string;
  key: string;
  category: string;
  restrictionType: RestrictionType;
  tokenCost: number;
}

interface Props {
  durations: PlanDuration[];
  accessMappings: AccessMapping[];
  durationMode: DurationMode;
  isPaid: boolean;
  onAddMapping: (mapping: Omit<AccessMapping, "id">) => Promise<AccessMapping | null>;
  onUpdateMapping: (id: string, updates: Partial<AccessMapping>) => Promise<boolean>;
  onDeleteMapping: (id: string) => Promise<boolean>;
  onCopyConfig: (sourceId: string, targetId: string, copyAccess: boolean, copyPricing: boolean, copyPoints: boolean, overwrite: boolean) => Promise<boolean>;
}

const restrictionLabels: Record<RestrictionType, string> = {
  unlimited: "Unlimited",
  token_gated: "Token",
  frequency_limited: "Batas Pakai",
  locked: "Terkunci",
};

export function AccessConfigTab({ durations, accessMappings, durationMode, isPaid, onAddMapping, onUpdateMapping, onDeleteMapping, onCopyConfig }: Props) {
  const activeDurations = durations.filter((d) => d.isActive);
  const hasDurations = durationMode === "dengan_durasi";

  const [selectedDuration, setSelectedDuration] = useState<DurationMonth | null>(
    hasDurations ? (activeDurations[0]?.durationMonths ?? null) : null
  );
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "aktif" | "nonaktif">("all");
  const [filterRestriction, setFilterRestriction] = useState<"all" | RestrictionType>("all");

  // Add/Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMapping, setEditMapping] = useState<AccessMapping | null>(null);

  // Copy Modal
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copySource, setCopySource] = useState("");
  const [copyTarget, setCopyTarget] = useState("");
  const [copyOverwrite, setCopyOverwrite] = useState(true);
  const [copying, setCopying] = useState(false);

  // Entitlement picker
  const [entitlements, setEntitlements] = useState<EntitlementOption[]>([]);
  const [selectedEntitlement, setSelectedEntitlement] = useState<EntitlementOption | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Form state
  const [formUsageQuota, setFormUsageQuota] = useState("0");
  const [formStatus, setFormStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [saving, setSaving] = useState(false);

  const selectedDur = hasDurations
    ? durations.find((d) => d.durationMonths === selectedDuration)
    : durations[0];

  const currentMappings = useMemo(() => {
    if (!selectedDur) return [];
    let filtered = accessMappings.filter((m) => m.planDurationId === selectedDur.id);
    if (filterStatus !== "all") filtered = filtered.filter((m) => m.status === filterStatus);
    if (filterRestriction !== "all") filtered = filtered.filter((m) => m.restrictionType === filterRestriction);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((m) => m.entitlementName.toLowerCase().includes(q) || m.entitlementKey.toLowerCase().includes(q));
    }
    return filtered;
  }, [selectedDur, accessMappings, filterStatus, filterRestriction, search]);

  // Fetch entitlements from DB
  const fetchEntitlements = async () => {
    const { data, error } = await supabase
      .from("entitlements")
      .select("id, name, key, restriction_type, token_cost, action_category_id, feature_id")
      .eq("status", "active")
      .order("name");
    if (!error && data) {
      const { data: cats } = await supabase.from("action_categories").select("id, name");
      const catMap: Record<string, string> = {};
      (cats || []).forEach((c: any) => { catMap[c.id] = c.name; });

      // Fetch features for category label
      const { data: features } = await supabase.from("features").select("id, name");
      const featMap: Record<string, string> = {};
      (features || []).forEach((f: any) => { featMap[f.id] = f.name; });

      setEntitlements(data.map((e: any) => ({
        id: e.id,
        name: e.name,
        key: e.key,
        category: featMap[e.feature_id] || catMap[e.action_category_id] || "",
        restrictionType: (e.restriction_type || "unlimited") as RestrictionType,
        tokenCost: e.token_cost || 0,
      })));
    }
  };

  useEffect(() => {
    fetchEntitlements();
  }, []);

  // Filter out entitlements already mapped to current duration
  const availableEntitlements = useMemo(() => {
    if (!selectedDur) return entitlements;
    const mappedKeys = new Set(
      accessMappings
        .filter((m) => m.planDurationId === selectedDur.id)
        .map((m) => m.entitlementKey)
    );
    return entitlements.filter((e) => !mappedKeys.has(e.key));
  }, [entitlements, accessMappings, selectedDur]);

  const resetForm = () => {
    setSelectedEntitlement(null);
    setFormUsageQuota("0"); setFormStatus("aktif");
  };

  const openAdd = () => { resetForm(); setEditMapping(null); setShowAddModal(true); };

  const openEdit = (m: AccessMapping) => {
    setEditMapping(m);
    setSelectedEntitlement(null);
    setFormUsageQuota(String(m.usageQuota));
    setFormStatus(m.status);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!selectedDur) return;
    setSaving(true);
    if (editMapping) {
      await onUpdateMapping(editMapping.id, {
        usageQuota: Number(formUsageQuota),
        status: formStatus,
      });
    } else {
      if (!selectedEntitlement) { setSaving(false); return; }
      await onAddMapping({
        planDurationId: selectedDur.id,
        entitlementId: selectedEntitlement.id,
        entitlementName: selectedEntitlement.name,
        entitlementKey: selectedEntitlement.key,
        category: selectedEntitlement.category,
        restrictionType: selectedEntitlement.restrictionType,
        tokenCost: selectedEntitlement.tokenCost,
        usageQuota: selectedEntitlement.restrictionType === "frequency_limited" ? Number(formUsageQuota) : 0,
        status: formStatus,
      });
    }
    setSaving(false);
    setShowAddModal(false);
  };

  const handleCopy = async () => {
    if (!copySource || !copyTarget) return;
    setCopying(true);
    await onCopyConfig(copySource, copyTarget, true, false, false, copyOverwrite);
    setCopying(false);
    setShowCopyModal(false);
  };

  const getRestrictionBadgeClass = (type: RestrictionType) => {
    switch (type) {
      case "unlimited": return "text-primary border-primary/30";
      case "token_gated": return "text-accent-foreground border-accent";
      case "frequency_limited": return "text-warning border-warning/30";
      case "locked": return "text-muted-foreground border-muted-foreground/30";
    }
  };

  if (!hasDurations && activeDurations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Aktifkan minimal 1 durasi terlebih dahulu.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Konfigurasi Akses</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Mapping entitlement → plan → pembatasan akses{hasDurations ? " per durasi" : ""}.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {hasDurations && activeDurations.length > 0 && (
                <DurationSwitcher
                  durations={durations}
                  selectedDuration={selectedDuration}
                  onSelect={setSelectedDuration}
                />
              )}
              {hasDurations && activeDurations.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => setShowCopyModal(true)} className="gap-1.5 shrink-0 h-9">
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Salin dari durasi…</span>
                  <span className="sm:hidden">Salin</span>
                </Button>
              )}
              <div className="hidden sm:block w-px h-6 bg-border mx-1" />
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama hak akses atau key…" className="pl-9 h-9" />
              </div>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-[100px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRestriction} onValueChange={(v) => setFilterRestriction(v as any)}>
                <SelectTrigger className="w-[120px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                  <SelectItem value="token_gated">Token</SelectItem>
                  <SelectItem value="frequency_limited">Batas Pakai</SelectItem>
                  <SelectItem value="locked">Terkunci</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openAdd} className="gap-1.5 h-9 shrink-0">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tambah Mapping</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          {currentMappings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-foreground mb-1">Belum ada mapping</p>
              <p className="text-xs text-muted-foreground mb-3">Tambahkan mapping entitlement untuk durasi ini.</p>
              <Button variant="outline" size="sm" onClick={openAdd} className="gap-2">
                <Plus className="h-3.5 w-3.5" />
                Tambah Mapping
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fitur</TableHead>
                    <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                    <TableHead className="hidden md:table-cell">Key</TableHead>
                    <TableHead>Pembatasan</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-16">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMappings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <span className="font-medium">{m.entitlementName}</span>
                        <span className="block sm:hidden text-xs text-muted-foreground">{m.category || ""}</span>
                        <span className="block md:hidden text-xs text-muted-foreground font-mono">{m.entitlementKey}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">{m.category || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{m.entitlementKey}</code></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs", getRestrictionBadgeClass(m.restrictionType))}>
                          {restrictionLabels[m.restrictionType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {m.restrictionType === "unlimited" && "-"}
                        {m.restrictionType === "token_gated" && `${m.tokenCost} token/aksi`}
                        {m.restrictionType === "frequency_limited" && `Maks ${m.usageQuota}x`}
                        {m.restrictionType === "locked" && "🔒"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "aktif" ? "default" : "secondary"} className="text-xs">
                          {m.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(m)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDeleteMapping(m.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMapping ? "Edit Mapping" : "Tambah Mapping"}</DialogTitle>
            <DialogDescription>
              {editMapping ? "Ubah kuota penggunaan dan status mapping." : "Pilih hak akses yang sudah terdaftar."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editMapping ? (
              <>
                {/* Searchable Entitlement Picker */}
                <div className="space-y-1.5">
                  <Label>Hak Akses (Pilih hak akses) *</Label>
                  <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={pickerOpen} className="w-full justify-between font-normal h-10">
                        {selectedEntitlement ? (
                          <span className="truncate">{selectedEntitlement.name}</span>
                        ) : (
                          <span className="text-muted-foreground">Cari dan pilih hak akses…</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Cari nama atau key…" />
                        <CommandList>
                          <CommandEmpty>Tidak ditemukan hak akses.</CommandEmpty>
                          <CommandGroup>
                            {availableEntitlements.map((e) => (
                              <CommandItem
                                key={e.id}
                                value={`${e.name} ${e.key}`}
                                onSelect={() => {
                                  setSelectedEntitlement(e);
                                  setPickerOpen(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", selectedEntitlement?.id === e.id ? "opacity-100" : "opacity-0")} />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-medium truncate">{e.name}</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    <code>{e.key}</code>
                                    {" · "}
                                    {restrictionLabels[e.restrictionType]}
                                    {e.restrictionType === "token_gated" && ` (${e.tokenCost} token)`}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected entitlement info */}
                {selectedEntitlement && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{selectedEntitlement.name}</span>
                      <Badge variant="outline" className={cn("text-xs", getRestrictionBadgeClass(selectedEntitlement.restrictionType))}>
                        {restrictionLabels[selectedEntitlement.restrictionType]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Key: <code>{selectedEntitlement.key}</code>
                      {selectedEntitlement.restrictionType === "token_gated" && ` · Biaya: ${selectedEntitlement.tokenCost} token/aksi`}
                    </p>
                  </div>
                )}

                {/* Usage quota for frequency_limited */}
                {selectedEntitlement?.restrictionType === "frequency_limited" && (
                  <div className="space-y-1.5">
                    <Label>Kuota Penggunaan *</Label>
                    <Input type="number" min="1" value={formUsageQuota} onChange={(e) => setFormUsageQuota(e.target.value)} placeholder="e.g. 6" />
                    <p className="text-xs text-muted-foreground">Jumlah maksimal penggunaan selama membership aktif pada plan & durasi ini.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{editMapping.entitlementName}</span>
                    <Badge variant="outline" className={cn("text-xs", getRestrictionBadgeClass(editMapping.restrictionType))}>
                      {restrictionLabels[editMapping.restrictionType]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Key: <code>{editMapping.entitlementKey}</code>
                    {editMapping.restrictionType === "token_gated" && ` · Biaya: ${editMapping.tokenCost} token/aksi`}
                  </p>
                </div>
                {editMapping.restrictionType === "frequency_limited" && (
                  <div className="space-y-1.5">
                    <Label>Kuota Penggunaan *</Label>
                    <Input type="number" min="1" value={formUsageQuota} onChange={(e) => setFormUsageQuota(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Jumlah maksimal penggunaan selama membership aktif pada plan & durasi ini.</p>
                  </div>
                )}
              </>
            )}
            <div className="space-y-1.5">
              <Label>Status *</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as "aktif" | "nonaktif")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving || (!editMapping && !selectedEntitlement)}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Modal */}
      <Dialog open={showCopyModal} onOpenChange={setShowCopyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salin konfigurasi akses dari durasi</DialogTitle>
            <DialogDescription>
              Salin mapping fitur & sub-fitur dari durasi lain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Source durasi *</Label>
                <Select value={copySource} onValueChange={setCopySource}>
                  <SelectTrigger><SelectValue placeholder="Pilih…" /></SelectTrigger>
                  <SelectContent>
                    {activeDurations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {DURATION_LABELS[d.durationMonths]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Target durasi *</Label>
                <Select value={copyTarget} onValueChange={setCopyTarget}>
                  <SelectTrigger><SelectValue placeholder="Pilih…" /></SelectTrigger>
                  <SelectContent>
                    {activeDurations
                      .filter((d) => d.id !== copySource)
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {DURATION_LABELS[d.durationMonths]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Switch checked={copyOverwrite} onCheckedChange={setCopyOverwrite} />
              <span>Timpa mapping target yang sudah ada</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyModal(false)}>Batal</Button>
            <Button onClick={handleCopy} disabled={!copySource || !copyTarget || copying}>
              {copying ? "Menyalin..." : "Salin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
