import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PlanDuration, DurationMonth } from "./types";
import { DURATION_LABELS } from "./types";

interface Props {
  durations: PlanDuration[];
  onUpdateDuration: (durId: string, updates: Partial<PlanDuration>) => Promise<boolean>;
}

interface DurationPointsForm {
  pointsActive: boolean;
  pointsValue: string;
  bonusPoints: string;
}

export function RewardPointsTab({ durations, onUpdateDuration }: Props) {
  const activeDurations = durations.filter((d) => d.isActive);

  const [forms, setForms] = useState<Record<string, DurationPointsForm>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const f: Record<string, DurationPointsForm> = {};
    activeDurations.forEach((d) => {
      f[d.id] = {
        pointsActive: d.pointsActive,
        pointsValue: String(d.pointsValue),
        bonusPoints: String(d.bonusPoints),
      };
    });
    setForms(f);
  }, [durations]);

  const updateForm = (id: string, updates: Partial<DurationPointsForm>) => {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleSave = async (dur: PlanDuration) => {
    const f = forms[dur.id];
    if (!f) return;
    setSavingId(dur.id);
    await onUpdateDuration(dur.id, {
      pointsActive: f.pointsActive,
      pointsValue: Number(f.pointsValue),
      bonusPoints: Number(f.bonusPoints),
    });
    setSavingId(null);
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
        <CardTitle className="text-base font-semibold">Reward Poin</CardTitle>
        <p className="text-sm text-muted-foreground">
          Atur reward poin yang didapat per durasi. Hanya durasi aktif yang ditampilkan.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDurations.map((dur) => {
            const f = forms[dur.id];
            if (!f) return null;
            const isSaving = savingId === dur.id;
            const invalid = f.pointsActive && (!f.pointsValue || Number(f.pointsValue) <= 0);

            return (
              <div
                key={dur.id}
                className="rounded-xl border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{DURATION_LABELS[dur.durationMonths]}</span>
                  <Switch
                    checked={f.pointsActive}
                    onCheckedChange={(v) => updateForm(dur.id, { pointsActive: v })}
                  />
                </div>

                {f.pointsActive ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nilai poin *</Label>
                      <Input
                        type="number"
                        value={f.pointsValue}
                        onChange={(e) => updateForm(dur.id, { pointsValue: e.target.value })}
                        placeholder="Masukkan nilai poin"
                        className="h-9"
                      />
                      {invalid && (
                        <p className="text-xs text-destructive">Nilai poin wajib diisi.</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Bonus poin (opsional)</Label>
                      <Input
                        type="number"
                        value={f.bonusPoints}
                        onChange={(e) => updateForm(dur.id, { bonusPoints: e.target.value })}
                        placeholder="0"
                        className="h-9"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-1">
                    Reward poin tidak diberikan pada durasi ini.
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSave(dur)}
                  disabled={isSaving || invalid}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Poin"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
