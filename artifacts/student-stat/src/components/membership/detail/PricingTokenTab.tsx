import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { PlanDetail, PlanDuration, DurationMonth, PricingMode } from "./types";
import { DURATION_LABELS, ALL_DURATIONS } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  plan: PlanDetail;
  durations: PlanDuration[];
  onUpdateDuration: (durId: string, updates: Partial<PlanDuration>) => Promise<boolean>;
  onUpdatePlan: (updates: Partial<PlanDetail>) => Promise<boolean>;
}

export function PricingTokenTab({ plan, durations, onUpdateDuration, onUpdatePlan }: Props) {
  const activeDurations = durations.filter((d) => d.isActive);
  const [mode, setMode] = useState<PricingMode>(plan.pricingMode);

  // Manual mode: local form per duration
  const [manualValues, setManualValues] = useState<Record<string, { price: string; discount: string; durationPrice: string; token: string; bonusToken: string }>>({});

  // Auto mode
  const [basePrice, setBasePrice] = useState(String(plan.basePrice1m));
  const [baseToken, setBaseToken] = useState(String(plan.baseToken1m));
  const [disc3, setDisc3] = useState(String(plan.discount3m));
  const [disc6, setDisc6] = useState(String(plan.discount6m));
  const [disc12, setDisc12] = useState(String(plan.discount12m));
  const [bonus3, setBonus3] = useState(String(plan.bonusToken3m));
  const [bonus6, setBonus6] = useState(String(plan.bonusToken6m));
  const [bonus12, setBonus12] = useState(String(plan.bonusToken12m));

  // Duration price per duration (local state for auto mode)
  const [autoDurPrices, setAutoDurPrices] = useState<Record<string, string>>({});

  // Duration ON/OFF status for 3, 6, 12
  const isDur3Active = durations.find((d) => d.durationMonths === 3)?.isActive ?? false;
  const isDur6Active = durations.find((d) => d.durationMonths === 6)?.isActive ?? false;
  const isDur12Active = durations.find((d) => d.durationMonths === 12)?.isActive ?? false;

  useEffect(() => {
    const vals: typeof manualValues = {};
    const durPrices: Record<string, string> = {};
    activeDurations.forEach((d) => {
      vals[d.id] = {
        price: String(d.price),
        discount: String(d.discountPercent),
        durationPrice: String(d.durationPrice),
        token: String(d.tokenAmount),
        bonusToken: String(d.bonusToken),
      };
      durPrices[d.id] = String(d.durationPrice);
    });
    setManualValues(vals);
    setAutoDurPrices(durPrices);
  }, [durations]);

  const handleModeChange = async (newMode: PricingMode) => {
    setMode(newMode);
    await onUpdatePlan({ pricingMode: newMode });
  };

  const handleManualSave = async (durId: string) => {
    const v = manualValues[durId];
    if (!v) return;
    const price = Number(v.price);
    const discount = Number(v.discount);
    const finalPrice = Math.round(price * (1 - discount / 100));
    const durationPrice = Number(v.durationPrice);
    if (durationPrice <= 0) {
      return; // Harga durasi wajib diisi
    }
    await onUpdateDuration(durId, {
      price, discountPercent: discount, finalPrice, durationPrice,
      tokenAmount: Number(v.token), bonusToken: Number(v.bonusToken),
    });
  };

  const autoPreview = useMemo(() => {
    const bp = Number(basePrice) || 0;
    const bt = Number(baseToken) || 0;
    return ALL_DURATIONS.map((m) => {
      const dur = durations.find((d) => d.durationMonths === m);
      const isActive = dur?.isActive ?? false;
      let disc = 0;
      let bonus = 0;
      if (m === 3) { disc = Number(disc3); bonus = Number(bonus3); }
      if (m === 6) { disc = Number(disc6); bonus = Number(bonus6); }
      if (m === 12) { disc = Number(disc12); bonus = Number(bonus12); }
      const totalPrice = bp * m;
      const discountedPrice = Math.round(totalPrice * (1 - disc / 100));
      const totalToken = bt * m + bonus;
      return { month: m, isActive, totalPrice, disc, discountedPrice, totalToken, bonus };
    });
  }, [basePrice, baseToken, disc3, disc6, disc12, bonus3, bonus6, bonus12, durations]);

  const handleAutoSave = async () => {
    await onUpdatePlan({
      pricingMode: "otomatis",
      basePrice1m: Number(basePrice), baseToken1m: Number(baseToken),
      discount3m: Number(disc3), discount6m: Number(disc6), discount12m: Number(disc12),
      bonusToken3m: Number(bonus3), bonusToken6m: Number(bonus6), bonusToken12m: Number(bonus12),
    });
    for (const row of autoPreview) {
      const dur = durations.find((d) => d.durationMonths === row.month);
      if (dur && dur.isActive) {
        const dp = Number(autoDurPrices[dur.id]) || 0;
        await onUpdateDuration(dur.id, {
          price: row.discountedPrice, discountPercent: row.disc,
          finalPrice: row.discountedPrice, durationPrice: dp,
          tokenAmount: row.totalToken, bonusToken: row.bonus,
        });
      }
    }
  };

  if (activeDurations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Aktifkan minimal 1 durasi terlebih dahulu.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Pembiayaan & Token</CardTitle>
        <p className="text-sm text-muted-foreground">
          Atur harga jual, harga durasi, dan token per durasi yang aktif. <strong>Harga Durasi</strong> digunakan untuk menghitung kredit sisa hari saat upgrade/downgrade (harga durasi ÷ total hari = tarif harian × sisa hari = potongan).
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mode Pengaturan</Label>
          <p className="text-xs text-muted-foreground">Mode ini hanya mengatur harga dan token per durasi yang aktif.</p>
          <RadioGroup value={mode} onValueChange={(v) => handleModeChange(v as PricingMode)} className="flex flex-col sm:flex-row gap-4 mt-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="cursor-pointer">Manual (Fixed Value)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="otomatis" id="otomatis" />
              <Label htmlFor="otomatis" className="cursor-pointer">Otomatis (Rule-Based)</Label>
            </div>
          </RadioGroup>
        </div>

        {mode === "manual" ? (
          <div className="space-y-4">
            {/* Mobile: cards; Desktop: table */}
            <div className="hidden sm:block rounded-lg border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Harga (Rp)</TableHead>
                    <TableHead>Diskon (%)</TableHead>
                     <TableHead>Harga Akhir</TableHead>
                    <TableHead>Harga Durasi (Rp) *</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Bonus Token</TableHead>
                    <TableHead className="w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDurations.map((d) => {
                    const v = manualValues[d.id] || { price: "0", discount: "0", durationPrice: "0", token: "0", bonusToken: "0" };
                    const finalPrice = Math.round(Number(v.price) * (1 - Number(v.discount) / 100));
                    const dpNum = Number(v.durationPrice);
                    const daysInDur = d.durationMonths * 30;
                    const dailyRate = dpNum > 0 ? Math.round(dpNum / daysInDur) : 0;
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{DURATION_LABELS[d.durationMonths]}</TableCell>
                        <TableCell>
                          <Input type="number" value={v.price}
                            onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], price: e.target.value } }))}
                            className="w-28 h-8" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" value={v.discount}
                            onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], discount: e.target.value } }))}
                            className="w-20 h-8" />
                        </TableCell>
                        <TableCell className="text-sm font-medium">Rp {finalPrice.toLocaleString("id-ID")}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <Input type="number" value={v.durationPrice}
                              onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], durationPrice: e.target.value } }))}
                              className="w-28 h-8" />
                            {dailyRate > 0 && <span className="text-[10px] text-muted-foreground">≈ Rp {dailyRate.toLocaleString("id-ID")}/hari</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input type="number" value={v.token}
                            onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], token: e.target.value } }))}
                            className="w-20 h-8" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" value={v.bonusToken}
                            onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], bonusToken: e.target.value } }))}
                            className="w-20 h-8" />
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleManualSave(d.id)}>Simpan</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {activeDurations.map((d) => {
                const v = manualValues[d.id] || { price: "0", discount: "0", durationPrice: "0", token: "0", bonusToken: "0" };
                const finalPrice = Math.round(Number(v.price) * (1 - Number(v.discount) / 100));
                const dpNum = Number(v.durationPrice);
                const daysInDur = d.durationMonths * 30;
                const dailyRate = dpNum > 0 ? Math.round(dpNum / daysInDur) : 0;
                return (
                  <div key={d.id} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{DURATION_LABELS[d.durationMonths]}</span>
                      <span className="text-sm font-medium text-primary">Rp {finalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Harga (Rp)</Label>
                        <Input type="number" value={v.price}
                          onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], price: e.target.value } }))}
                          className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Diskon (%)</Label>
                        <Input type="number" value={v.discount}
                          onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], discount: e.target.value } }))}
                          className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Harga Durasi (Rp) *</Label>
                        <Input type="number" value={v.durationPrice}
                          onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], durationPrice: e.target.value } }))}
                          className="h-8 text-sm" />
                        {dailyRate > 0 && <span className="text-[10px] text-muted-foreground">≈ Rp {dailyRate.toLocaleString("id-ID")}/hari</span>}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Token</Label>
                        <Input type="number" value={v.token}
                          onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], token: e.target.value } }))}
                          className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Bonus Token</Label>
                        <Input type="number" value={v.bonusToken}
                          onChange={(e) => setManualValues((p) => ({ ...p, [d.id]: { ...p[d.id], bonusToken: e.target.value } }))}
                          className="h-8 text-sm" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleManualSave(d.id)}>Simpan</Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Base values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Harga 1 bulan (base) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                  <Input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Token 1 bulan (base) *</Label>
                <Input type="number" value={baseToken} onChange={(e) => setBaseToken(e.target.value)} />
              </div>
            </div>

            {/* Discounts - enabled/disabled based on duration status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Diskon per durasi</Label>
              <p className="text-xs text-muted-foreground">Input otomatis di-disable jika durasi tersebut sedang OFF.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className={cn(!isDur3Active && "text-muted-foreground")}>
                    Diskon 3 bulan (%)
                    {!isDur3Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={disc3} onChange={(e) => setDisc3(e.target.value)} disabled={!isDur3Active} className={cn(!isDur3Active && "opacity-50")} />
                </div>
                <div className="space-y-1.5">
                  <Label className={cn(!isDur6Active && "text-muted-foreground")}>
                    Diskon 6 bulan (%)
                    {!isDur6Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={disc6} onChange={(e) => setDisc6(e.target.value)} disabled={!isDur6Active} className={cn(!isDur6Active && "opacity-50")} />
                </div>
                <div className="space-y-1.5">
                  <Label className={cn(!isDur12Active && "text-muted-foreground")}>
                    Diskon 12 bulan (%)
                    {!isDur12Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={disc12} onChange={(e) => setDisc12(e.target.value)} disabled={!isDur12Active} className={cn(!isDur12Active && "opacity-50")} />
                </div>
              </div>
            </div>

            {/* Bonus tokens - enabled/disabled based on duration status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bonus token per durasi</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className={cn(!isDur3Active && "text-muted-foreground")}>
                    Bonus token 3 bulan
                    {!isDur3Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={bonus3} onChange={(e) => setBonus3(e.target.value)} disabled={!isDur3Active} className={cn(!isDur3Active && "opacity-50")} />
                </div>
                <div className="space-y-1.5">
                  <Label className={cn(!isDur6Active && "text-muted-foreground")}>
                    Bonus token 6 bulan
                    {!isDur6Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={bonus6} onChange={(e) => setBonus6(e.target.value)} disabled={!isDur6Active} className={cn(!isDur6Active && "opacity-50")} />
                </div>
                <div className="space-y-1.5">
                  <Label className={cn(!isDur12Active && "text-muted-foreground")}>
                    Bonus token 12 bulan
                    {!isDur12Active && <Badge variant="secondary" className="ml-2 text-[10px]">OFF</Badge>}
                  </Label>
                  <Input type="number" value={bonus12} onChange={(e) => setBonus12(e.target.value)} disabled={!isDur12Active} className={cn(!isDur12Active && "opacity-50")} />
                </div>
              </div>
            </div>

            {/* Harga Durasi per durasi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Harga Durasi per durasi *</Label>
              <p className="text-xs text-muted-foreground">Harga durasi digunakan untuk menghitung kredit sisa hari saat upgrade/downgrade. Wajib diisi untuk durasi aktif.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeDurations.map((d) => {
                  const dp = Number(autoDurPrices[d.id] || "0");
                  const daysInDur = d.durationMonths * 30;
                  const dailyRate = dp > 0 ? Math.round(dp / daysInDur) : 0;
                  return (
                    <div key={d.id} className="space-y-1.5">
                      <Label>Harga Durasi {DURATION_LABELS[d.durationMonths]} (Rp)</Label>
                      <Input
                        type="number"
                        value={autoDurPrices[d.id] || "0"}
                        onChange={(e) => setAutoDurPrices((p) => ({ ...p, [d.id]: e.target.value }))}
                      />
                      {dailyRate > 0 && <span className="text-[10px] text-muted-foreground">≈ Rp {dailyRate.toLocaleString("id-ID")}/hari</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview harga & token</Label>
              <div className="hidden sm:block rounded-lg border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Harga Total</TableHead>
                      <TableHead>Diskon</TableHead>
                      <TableHead>Harga Akhir</TableHead>
                      <TableHead>Total Token</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autoPreview.map((r) => (
                      <TableRow key={r.month} className={!r.isActive ? "opacity-40" : ""}>
                        <TableCell className="font-medium">{DURATION_LABELS[r.month as DurationMonth]}</TableCell>
                        <TableCell>
                          <Badge variant={r.isActive ? "default" : "secondary"} className="text-xs">
                            {r.isActive ? "ON" : "OFF"}
                          </Badge>
                        </TableCell>
                        <TableCell>Rp {r.totalPrice.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{r.disc}%</TableCell>
                        <TableCell className="font-semibold">Rp {r.discountedPrice.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{r.totalToken} {r.bonus > 0 && <span className="text-primary text-xs">(+{r.bonus} bonus)</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile preview cards */}
              <div className="sm:hidden space-y-2">
                {autoPreview.map((r) => (
                  <div key={r.month} className={cn("rounded-xl border p-3 space-y-1", !r.isActive && "opacity-40")}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{DURATION_LABELS[r.month as DurationMonth]}</span>
                      <Badge variant={r.isActive ? "default" : "secondary"} className="text-xs">{r.isActive ? "ON" : "OFF"}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 text-xs text-muted-foreground">
                      <span>Harga Total: Rp {r.totalPrice.toLocaleString("id-ID")}</span>
                      <span>Diskon: {r.disc}%</span>
                      <span className="font-semibold text-foreground">Akhir: Rp {r.discountedPrice.toLocaleString("id-ID")}</span>
                      <span>Token: {r.totalToken}{r.bonus > 0 ? ` (+${r.bonus})` : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleAutoSave} className="gap-2 w-full sm:w-auto">
              Terapkan & Simpan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
