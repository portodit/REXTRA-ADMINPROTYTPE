import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Clock, Info, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanDuration, DurationMonth, DurationMode, AccessMapping } from "./types";
import { DURATION_LABELS, ALL_DURATIONS } from "./types";

interface DurationPanelProps {
  durations: PlanDuration[];
  isPaid: boolean;
  planId: string;
  durationMode: DurationMode;
  accessMappings: AccessMapping[];
  onToggleDuration: (month: DurationMonth, active: boolean) => Promise<boolean>;
  onDurationModeChange: (mode: DurationMode) => void;
  onStarterDurationChange?: (months: number) => void;
  onCopyConfig: (sourceId: string, targetId: string, copyAccess: boolean, copyPricing: boolean, copyPoints: boolean, overwrite: boolean) => Promise<boolean>;
}


export function DurationPanel({ durations, isPaid, planId, durationMode, accessMappings, onToggleDuration, onDurationModeChange, onStarterDurationChange, onCopyConfig }: DurationPanelProps) {
  const [deactivateTarget, setDeactivateTarget] = useState<DurationMonth | null>(null);
  const [deactivateChecked, setDeactivateChecked] = useState(false);

  const activeDurations = durations.filter((d) => d.isActive);

  const handleToggle = async (month: DurationMonth, current: boolean) => {
    if (current) {
      setDeactivateTarget(month);
      setDeactivateChecked(false);
    } else {
      await onToggleDuration(month, true);
    }
  };

  const confirmDeactivate = async () => {
    if (deactivateTarget === null) return;
    await onToggleDuration(deactivateTarget, false);
    setDeactivateTarget(null);
  };

  const DurationChips = () => (
    <div className="flex flex-wrap gap-2">
      {ALL_DURATIONS.map((m) => {
        const dur = durations.find((d) => d.durationMonths === m);
        const isActive = dur?.isActive ?? false;
        return (
          <button
            key={m}
            onClick={() => handleToggle(m, isActive)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer select-none",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            )}
          >
            <div className={cn(
              "h-2 w-2 rounded-full shrink-0",
              isActive ? "bg-primary-foreground" : "bg-muted-foreground/40"
            )} />
            {DURATION_LABELS[m]}
          </button>
        );
      })}
    </div>
  );

  // Standard plan — no duration at all
  if (planId === "standard") {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Pengaturan Durasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Tanpa Durasi — Berlaku Selamanya</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Standard adalah status default untuk user yang <strong>tidak berlangganan</strong> Rextra Club atau yang masa trial (Starter)-nya telah berakhir. 
                Status ini otomatis diberikan dan tidak memiliki batas waktu.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Starter plan — single configurable duration
  if (planId === "starter") {
    const starterDur = durations[0];
    const currentMonths = starterDur?.durationMonths || 1;

    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Pengaturan Masa Trial</CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tentukan berapa lama masa trial Starter untuk user baru. Perubahan durasi <strong>hanya berlaku untuk user baru</strong> — user yang sedang berjalan tidak terpengaruh.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Durasi Trial</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={String(currentMonths)}
                  onChange={(e) => onStarterDurationChange?.(Number(e.target.value) || 1)}
                  className="w-24 h-10 text-center text-lg font-semibold"
                />
                <span className="text-sm text-muted-foreground font-medium">
                  bulan ({currentMonths * 30} hari)
                </span>
              </div>
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50 w-full">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Konfigurasi akses berlaku universal — <strong>tidak dibedakan</strong> per durasi seperti paket berbayar.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free plan (fallback, shouldn't reach here for standard/starter)
  if (!isPaid) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Pengaturan Durasi</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pilih apakah paket gratis ini memiliki masa berlaku atau tanpa batas waktu.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={durationMode}
            onValueChange={(v) => onDurationModeChange(v as DurationMode)}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tanpa_durasi" id="tanpa" />
              <Label htmlFor="tanpa" className="cursor-pointer">Tanpa Durasi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dengan_durasi" id="dengan" />
              <Label htmlFor="dengan" className="cursor-pointer">Dengan Durasi</Label>
            </div>
          </RadioGroup>

          {durationMode === "dengan_durasi" && (
            <div className="pt-2">
              <DurationChips />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Paid plan (Basic, Pro, Max)
  return (
    <>
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Durasi yang Dijual</CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aktifkan durasi yang tersedia untuk user. Konfigurasi akses, harga, token, dan poin akan mengikuti durasi yang dipilih.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <DurationChips />
        </CardContent>
      </Card>

      {/* Deactivate Duration Modal */}
      <Dialog open={deactivateTarget !== null} onOpenChange={() => setDeactivateTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Nonaktifkan durasi ini?</DialogTitle>
                <DialogDescription className="mt-1">
                  Durasi ini dihentikan untuk purchase/renew baru. User existing tetap berjalan sampai expiry.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-2">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id="confirm-deactivate-dur"
                checked={deactivateChecked}
                onCheckedChange={(v) => setDeactivateChecked(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="confirm-deactivate-dur" className="text-sm font-normal cursor-pointer leading-relaxed">
                Saya memahami dampaknya.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDeactivate} disabled={!deactivateChecked}>
              Nonaktifkan Durasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
