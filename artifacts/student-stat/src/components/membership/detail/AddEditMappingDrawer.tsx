import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  RefreshCw, 
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface MappingData {
  entitlementId: string;
  entitlementName: string;
  entitlementKey: string;
  restrictionType: "unlimited" | "token_gated" | "frequency_limited" | "locked";
  tokenCost: number;
  usageQuota: number;
  isActive: boolean;
}

interface EntitlementOption {
  id: string;
  name: string;
  key: string;
  level: string;
  restrictionType: "unlimited" | "token_gated" | "frequency_limited" | "locked";
  tokenCost: number;
  status: string;
}

interface AddEditMappingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MappingData) => void;
  editingMapping: { id: string; entitlementId: string; entitlementName: string; entitlementKey: string; isActive: boolean; usageQuota?: number } | null;
  packageName: string;
  existingMappingKeys: string[];
}

export function AddEditMappingDrawer({
  isOpen,
  onClose,
  onSave,
  editingMapping,
  packageName,
  existingMappingKeys,
}: AddEditMappingDrawerProps) {
  const isEditing = !!editingMapping;
  
  const [entitlements, setEntitlements] = useState<EntitlementOption[]>([]);
  const [selectedEntitlement, setSelectedEntitlement] = useState<EntitlementOption | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [usageQuota, setUsageQuota] = useState(1);
  const [entitlementOpen, setEntitlementOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingEntitlements, setLoadingEntitlements] = useState(false);

  // Fetch entitlements from DB
  useEffect(() => {
    if (!isOpen) return;
    const fetchEntitlements = async () => {
      setLoadingEntitlements(true);
      const { data, error } = await supabase
        .from("entitlements")
        .select("id, name, key, level, restriction_type, token_cost, status")
        .eq("status", "active")
        .order("name");
      if (!error && data) {
        setEntitlements(data.map((e: any) => ({
          id: e.id,
          name: e.name,
          key: e.key,
          level: e.level,
          restrictionType: (e.restriction_type || "unlimited") as "unlimited" | "token_gated" | "frequency_limited" | "locked",
          tokenCost: e.token_cost || 0,
          status: e.status,
        })));
      }
      setLoadingEntitlements(false);
    };
    fetchEntitlements();
  }, [isOpen]);

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (editingMapping) {
        const found = entitlements.find(e => e.id === editingMapping.entitlementId);
        setSelectedEntitlement(found || null);
        setIsActive(editingMapping.isActive);
        setUsageQuota(editingMapping.usageQuota || 1);
      } else {
        setSelectedEntitlement(null);
        setIsActive(true);
        setUsageQuota(1);
      }
    }
  }, [isOpen, editingMapping, entitlements]);

  // Filter out already-mapped entitlements (except current editing)
  const availableEntitlements = useMemo(() => {
    return entitlements.filter(e => {
      if (editingMapping && e.key === editingMapping.entitlementKey) return true;
      return !existingMappingKeys.includes(e.key);
    });
  }, [entitlements, existingMappingKeys, editingMapping]);

  const handleSubmit = async () => {
    if (!selectedEntitlement) return;
    if (selectedEntitlement.restrictionType === "frequency_limited" && usageQuota <= 0) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onSave({
      entitlementId: selectedEntitlement.id,
      entitlementName: selectedEntitlement.name,
      entitlementKey: selectedEntitlement.key,
      restrictionType: selectedEntitlement.restrictionType,
      tokenCost: selectedEntitlement.tokenCost,
      usageQuota: selectedEntitlement.restrictionType === "frequency_limited" ? usageQuota : 0,
      isActive,
    });
    setIsSaving(false);
  };

  const getRestrictionLabel = (ent: EntitlementOption) => {
    switch (ent.restrictionType) {
      case "unlimited": return "Tanpa batas";
      case "token_gated": return `${ent.tokenCost} token/aksi`;
      case "frequency_limited": return "Batas pakai";
      case "locked": return "Terkunci";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Mapping" : "Tambah Mapping"}
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? `Edit mapping akses untuk paket ${packageName}`
              : `Pilih hak akses yang akan dimapping ke paket ${packageName}`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Entitlement Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Hak Akses <span className="text-destructive">*</span>
            </Label>
            {isEditing ? (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="font-medium text-sm">{selectedEntitlement?.name}</p>
                <code className="text-xs text-muted-foreground font-mono">
                  {selectedEntitlement?.key}
                </code>
              </div>
            ) : (
              <Popover open={entitlementOpen} onOpenChange={setEntitlementOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={entitlementOpen}
                    className="w-full justify-between h-auto min-h-11"
                  >
                    {selectedEntitlement ? (
                      <div className="flex flex-col items-start py-0.5">
                        <span className="font-medium">{selectedEntitlement.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {selectedEntitlement.key}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Cari dan pilih hak akses...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari nama atau key hak akses..." className="h-10" />
                    <CommandList>
                      <CommandEmpty>
                        {loadingEntitlements ? "Memuat data..." : "Tidak ada hak akses yang cocok."}
                      </CommandEmpty>
                      <CommandGroup>
                        {availableEntitlements.map((ent) => (
                          <CommandItem
                            key={ent.id}
                            value={`${ent.name} ${ent.key}`}
                            onSelect={() => {
                              setSelectedEntitlement(ent);
                              setEntitlementOpen(false);
                            }}
                            className="flex flex-col items-start py-2.5"
                          >
                            <div className="flex items-center w-full gap-2">
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  selectedEntitlement?.id === ent.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{ent.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <code className="text-xs text-muted-foreground font-mono">{ent.key}</code>
                                  <span className="text-[10px] text-muted-foreground">•</span>
                                  <span className="text-[10px] text-muted-foreground">{getRestrictionLabel(ent)}</span>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            {!selectedEntitlement && !isEditing && (
              <p className="text-xs text-muted-foreground">Pilih hak akses dari daftar master yang sudah dibuat di tab Fitur & Hak Akses.</p>
            )}
          </div>

          {/* Read-only restriction info */}
          {selectedEntitlement && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Detail Pembatasan (dari master)</Label>
              <div className="p-3 bg-muted/30 rounded-lg border text-sm space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tipe:</span>
                  {selectedEntitlement.restrictionType === "unlimited" && <Badge variant="secondary">Tanpa batas</Badge>}
                  {selectedEntitlement.restrictionType === "token_gated" && <Badge className="bg-destructive/10 text-destructive border-destructive/20">Token</Badge>}
                  {selectedEntitlement.restrictionType === "frequency_limited" && <Badge className="bg-primary/10 text-primary border-primary/20">Batas pakai</Badge>}
                </div>
                {selectedEntitlement.restrictionType === "token_gated" && (
                  <p><span className="text-muted-foreground">Biaya:</span> {selectedEntitlement.tokenCost} token per aksi</p>
                )}
                {selectedEntitlement.restrictionType === "frequency_limited" && (
                  <p className="text-muted-foreground text-xs">Kuota penggunaan ditentukan di bawah per plan & durasi ini.</p>
                )}
              </div>
            </div>
          )}

          {/* Usage Quota — only for frequency_limited */}
          {selectedEntitlement?.restrictionType === "frequency_limited" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Kuota Penggunaan <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={usageQuota}
                min={1}
                max={10000}
                onChange={e => setUsageQuota(Number(e.target.value))}
                className="w-40"
              />
              <p className="text-xs text-muted-foreground">
                Jumlah maksimal penggunaan selama periode membership aktif pada paket & durasi ini.
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-sm font-medium">Status Mapping</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isActive ? "Mapping aktif pada paket ini" : "Mapping tidak aktif"}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <SheetFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Batalkan
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={
              isSaving || 
              !selectedEntitlement ||
              (selectedEntitlement?.restrictionType === "frequency_limited" && usageQuota <= 0)
            }
            className="gap-2 min-w-28"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
