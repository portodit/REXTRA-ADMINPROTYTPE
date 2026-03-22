import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Save,
  Play,
  Power,
  Info,
  Zap,
  Star,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MembershipPackage, PackageStatus } from "./MembershipStatusCard";
import { SaveChangesModal, DeactivateModal, ActivateModal } from "./MembershipStatusModals";
import { toast } from "@/hooks/use-toast";

interface MembershipStatusDetailProps {
  pkg: MembershipPackage;
  onUpdate: (updated: MembershipPackage) => void;
}

const statusConfig: Record<PackageStatus, { label: string; dot: string; bg: string; text: string }> = {
  draft: { label: "Draft", dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground" },
  aktif: { label: "Aktif", dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  nonaktif: { label: "Nonaktif", dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive" },
};

export function MembershipStatusDetail({ pkg, onUpdate }: MembershipStatusDetailProps) {
  const isPaid = pkg.category === "paid";

  // Form state
  const [price, setPrice] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [pointsActive, setPointsActive] = useState(false);
  const [pointsValue, setPointsValue] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  // Reset form on pkg change
  useEffect(() => {
    setPrice(pkg.price !== null ? String(pkg.price) : "");
    setToken(pkg.tokenPerMonth !== null ? String(pkg.tokenPerMonth) : "");
    setPointsActive(pkg.pointsActive);
    setPointsValue(pkg.pointsValue !== null ? String(pkg.pointsValue) : "");
    setErrors({});
  }, [pkg.id]);

  const sc = statusConfig[pkg.status];

  // Validation
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (isPaid) {
      const p = Number(price);
      if (!price || p <= 0) e.price = "Harga wajib diisi dan harus lebih dari 0.";
    }
    const t = Number(token);
    if (token === "" || t < 0) e.token = "Token wajib diisi dan tidak boleh negatif.";
    if (pointsActive) {
      const pv = Number(pointsValue);
      if (!pointsValue || pv <= 0) e.pointsValue = "Nilai poin wajib diisi saat reward poin aktif.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Completeness
  const isPriceValid = isPaid ? (Number(price) > 0) : true;
  const isTokenValid = token !== "";
  const isPointsValid = pointsActive ? (Number(pointsValue) > 0) : true;
  const isComplete = isPriceValid && isTokenValid && isPointsValid;

  // Change detection
  const hasChanges = useMemo(() => {
    if (String(pkg.price ?? "") !== price) return true;
    if (String(pkg.tokenPerMonth ?? "") !== token) return true;
    if (pkg.pointsActive !== pointsActive) return true;
    if (pkg.pointsActive && String(pkg.pointsValue ?? "") !== pointsValue) return true;
    return false;
  }, [pkg, price, token, pointsActive, pointsValue]);

  // Change summary for save modal
  const changeSummary = useMemo(() => {
    const changes: { field: string; oldValue: string; newValue: string }[] = [];
    const fmt = (v: number | null) => v !== null ? `Rp ${v.toLocaleString("id-ID")}` : "(Belum diset)";

    if (String(pkg.price ?? "") !== price) {
      changes.push({ field: "Harga", oldValue: fmt(pkg.price), newValue: price ? `Rp ${Number(price).toLocaleString("id-ID")}` : "(Belum diset)" });
    }
    if (String(pkg.tokenPerMonth ?? "") !== token) {
      changes.push({ field: "Token/bulan", oldValue: pkg.tokenPerMonth !== null ? String(pkg.tokenPerMonth) : "-", newValue: token || "-" });
    }
    if (pkg.pointsActive !== pointsActive || (pkg.pointsActive && String(pkg.pointsValue ?? "") !== pointsValue)) {
      const oldPoin = pkg.pointsActive ? `Aktif (nilai: ${pkg.pointsValue})` : "Nonaktif";
      const newPoin = pointsActive ? `Aktif (nilai: ${pointsValue})` : "Nonaktif";
      changes.push({ field: "Reward poin", oldValue: oldPoin, newValue: newPoin });
    }
    return changes;
  }, [pkg, price, token, pointsActive, pointsValue]);

  // Status transition: nonaktif only from aktif
  const canDeactivate = pkg.status === "aktif";
  // Can activate from draft (if complete) or from nonaktif (if complete)
  const canActivate = (pkg.status === "draft" || pkg.status === "nonaktif") && isComplete;

  const doSave = () => {
    if (!validate()) {
      toast({ variant: "destructive", title: "Validasi gagal", description: "Periksa kembali input." });
      return;
    }
    if (pkg.status === "aktif") {
      setShowSaveModal(true);
      return;
    }
    executeSave();
  };

  const executeSave = () => {
    const updated: MembershipPackage = {
      ...pkg,
      price: isPaid ? Number(price) : 0,
      tokenPerMonth: token !== "" ? Number(token) : null,
      pointsActive,
      pointsValue: pointsActive ? Number(pointsValue) : null,
      lastUpdated: new Date().toLocaleString("id-ID", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }).replace(",", ""),
      lastUpdatedBy: "Current User",
    };
    onUpdate(updated);
    setShowSaveModal(false);
    toast({
      title: pkg.status === "draft" ? "Draft berhasil disimpan" : "Perubahan berhasil disimpan",
    });
  };

  const doActivate = () => {
    const updated: MembershipPackage = {
      ...pkg,
      status: "aktif",
      price: isPaid ? Number(price) : 0,
      tokenPerMonth: token !== "" ? Number(token) : null,
      pointsActive,
      pointsValue: pointsActive ? Number(pointsValue) : null,
      lastUpdated: new Date().toLocaleString("id-ID", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }).replace(",", ""),
      lastUpdatedBy: "Current User",
    };
    onUpdate(updated);
    setShowActivateModal(false);
    toast({ title: "Paket berhasil diaktifkan" });
  };

  const doDeactivate = () => {
    if (!isComplete) {
      const updatedDraft: MembershipPackage = {
        ...pkg,
        status: "draft",
        price: isPaid ? Number(price) : 0,
        tokenPerMonth: token !== "" ? Number(token) : null,
        pointsActive,
        pointsValue: pointsActive ? Number(pointsValue) : null,
        lastUpdated: new Date().toLocaleString("id-ID", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }).replace(",", ""),
        lastUpdatedBy: "Current User",
      };
      onUpdate(updatedDraft);
      setShowDeactivateModal(false);
      toast({
        variant: "destructive",
        title: "Konfigurasi belum lengkap",
        description: "Paket otomatis dipindahkan ke Draft karena data belum lengkap.",
      });
      return;
    }

    onUpdate({
      ...pkg,
      status: "nonaktif",
      price: isPaid ? Number(price) : 0,
      tokenPerMonth: token !== "" ? Number(token) : null,
      pointsActive,
      pointsValue: pointsActive ? Number(pointsValue) : null,
      lastUpdated: new Date().toLocaleString("id-ID", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }).replace(",", ""),
      lastUpdatedBy: "Current User",
    });
    setShowDeactivateModal(false);
    toast({ title: "Paket berhasil dinonaktifkan" });
  };

  /** Format poin display */
  const formatPointsPreview = () => {
    if (!pointsActive || !pointsValue || Number(pointsValue) <= 0) return "-";
    return pointsValue;
  };

  return (
    <div className="space-y-6">
      {/* Header Detail (E2) */}
      <Card className="border-border/60">
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src={pkg.emblem} alt={pkg.name} className="h-11 w-11 object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">{pkg.name}</h2>
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", sc.bg, sc.text)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                    {sc.label}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                  <span>Harga: {isPaid ? (price ? `Rp ${Number(price).toLocaleString("id-ID")}/bulan` : "(Belum diset)") : "Gratis"}</span>
                  <span className="text-border">·</span>
                  <span>Token: {token || "-"}</span>
                  <span className="text-border">·</span>
                  <span>Poin: {formatPointsPreview()}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {pkg.status === "draft" && (
                <>
                  <Button variant="outline" onClick={doSave} disabled={!hasChanges} className="gap-2">
                    <Save className="h-3.5 w-3.5" />
                    Simpan Draft
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={() => {
                            if (!validate()) return;
                            setShowActivateModal(true);
                          }}
                          disabled={!isComplete}
                          className="gap-2"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Aktifkan Paket
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isComplete && (
                      <TooltipContent>Lengkapi Harga/Token/Poin terlebih dahulu.</TooltipContent>
                    )}
                  </Tooltip>
                </>
              )}
              {pkg.status === "aktif" && (
                <>
                  <Button variant="outline" onClick={doSave} disabled={!hasChanges} className="gap-2">
                    <Save className="h-3.5 w-3.5" />
                    Simpan Perubahan
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => setShowDeactivateModal(true)}
                          disabled={!isComplete}
                        >
                          <Power className="h-3.5 w-3.5" />
                          Nonaktifkan Paket
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isComplete && (
                      <TooltipContent>Paket belum lengkap, statusnya harus Draft.</TooltipContent>
                    )}
                  </Tooltip>
                </>
              )}
              {pkg.status === "nonaktif" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={() => {
                            if (!validate()) return;
                            setShowActivateModal(true);
                          }}
                          disabled={!isComplete}
                          className="gap-2"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Aktifkan Paket
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isComplete && (
                      <TooltipContent>Lengkapi Harga/Token/Poin terlebih dahulu.</TooltipContent>
                    )}
                  </Tooltip>
                  <Button variant="outline" onClick={doSave} disabled={!hasChanges} className="gap-2">
                    <Save className="h-3.5 w-3.5" />
                    Kelola Paket
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* F1: Pembiayaan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            Pembiayaan
          </CardTitle>
          <p className="text-sm text-muted-foreground">Atur harga paket dan periode penagihan.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPaid ? (
            <>
              <div className="space-y-2">
                <Label>Harga per bulan *</Label>
                <div className="relative max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Masukkan harga (Rp)"
                    className={cn("pl-10", errors.price && "border-destructive")}
                  />
                </div>
                {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                <p className="text-xs text-muted-foreground">Perubahan harga berlaku untuk pembelian/renew berikutnya.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Periode:</span>
                <Badge variant="secondary" className="rounded-md text-xs">/bulan (V1 fixed)</Badge>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <Info className="inline h-3 w-3 mr-1" />
                V2: Durasi 1/3/6/12 bulan + diskon + bonus token + mode otomatis/manual.
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md">Gratis</Badge>
              <span className="text-sm text-muted-foreground">Harga locked untuk paket free tier.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* F2: Token */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Token</CardTitle>
          <p className="text-sm text-muted-foreground">Atur alokasi token yang didapat per periode.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Token per bulan</Label>
            <Input
              type="number"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masukkan jumlah token"
              className={cn("max-w-sm", errors.token && "border-destructive")}
            />
            {errors.token && <p className="text-xs text-destructive">{errors.token}</p>}
            <p className="text-xs text-muted-foreground">Token akan direset setiap periode.</p>
          </div>
        </CardContent>
      </Card>

      {/* F3: Reward Poin */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Reward Poin</CardTitle>
          <p className="text-sm text-muted-foreground">Atur apakah paket memberikan reward poin dan parameternya.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Aktifkan reward poin</Label>
            <Switch checked={pointsActive} onCheckedChange={setPointsActive} />
          </div>
          {pointsActive && (
            <div className="space-y-2">
              <Label>Nilai poin *</Label>
              <Input
                type="number"
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
                placeholder="Masukkan nilai poin (misal: 100)"
                className={cn("max-w-sm", errors.pointsValue && "border-destructive")}
              />
              {errors.pointsValue && <p className="text-xs text-destructive">{errors.pointsValue}</p>}
              <p className="text-xs text-muted-foreground">
                Nilai poin per durasi. V1 = 1 durasi (1 bulan). V2 mendukung multi-durasi (3/6/9/12 bulan) dengan nilai poin bertingkat.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <SaveChangesModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={executeSave}
        changes={changeSummary}
      />
      <DeactivateModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={doDeactivate}
        activeUsers={pkg.activeUsers}
      />
      <ActivateModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={doActivate}
        isComplete={isComplete}
      />
    </div>
  );
}
