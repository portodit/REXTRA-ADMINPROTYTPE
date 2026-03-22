import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonaBadge } from "./PersonaBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ArrowRight, Settings, Check, X, Info, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface GlobalRules {
  autoPass: boolean;
  sequentialTransition: boolean;
  showPreviousAsSuggested: boolean;
  defaultReward: number;
}

const RULE_INFO: Record<string, {
  title: string;
  shortLabel: string;
  description: string;
  activeDesc: string;
  inactiveDesc: string;
  example?: string;
}> = {
  autoPass: {
    title: "Auto-pass",
    shortLabel: "Auto-pass",
    description: "Sistem otomatis menandai misi sebagai selesai kalau data yang dibutuhkan sudah ada di sistem, tanpa user harus klik \"Kerjakan Misi\" secara manual.",
    activeDesc: "Sistem otomatis cek kondisi data dan bisa langsung complete misi tanpa tindakan manual user.",
    inactiveDesc: "Semua misi harus diselesaikan manual oleh user, meskipun data sudah tersedia di sistem.",
    example: "Contoh: misi \"Simpan data pendidikan\" → kalau user sudah punya data Jejak Studi yang lengkap di sistem, misi langsung COMPLETED tanpa perlu dikerjakan ulang.",
  },
  sequentialTransition: {
    title: "Transisi Berurutan",
    shortLabel: "Transisi berurutan",
    description: "Mengunci urutan pengerjaan misi — misi berikutnya tidak bisa dimulai sebelum misi sebelumnya yang blocking selesai.",
    activeDesc: "Misi 2 tidak bisa dikerjakan sebelum misi 1 selesai (khusus misi yang is_blocking = true).",
    inactiveDesc: "User bebas mengerjakan misi dalam urutan apapun tanpa batasan.",
  },
  showPreviousAsSuggested: {
    title: "Tampilkan Misi Fase Sebelumnya",
    shortLabel: "Misi fase sebelumnya",
    description: "Misi dari fase sebelumnya akan muncul sebagai 'Dianjurkan' di fase saat ini.",
    activeDesc: "Misi fase sebelumnya tetap muncul sebagai rekomendasi di fase aktif pengguna.",
    inactiveDesc: "Hanya misi dari fase aktif yang ditampilkan kepada pengguna.",
  },
};

export function GlobalRulesPanel() {
  const [rules, setRules] = useState<GlobalRules>({
    autoPass: true,
    sequentialTransition: true,
    showPreviousAsSuggested: true,
    defaultReward: 100,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editRules, setEditRules] = useState<GlobalRules>(rules);

  const handleSave = () => {
    setRules(editRules);
    setEditOpen(false);
    toast.success("Aturan global berhasil diperbarui.");
  };

  const ruleItems = [
    { key: "autoPass" as const, active: rules.autoPass },
    { key: "sequentialTransition" as const, active: rules.sequentialTransition },
    { key: "showPreviousAsSuggested" as const, active: rules.showPreviousAsSuggested },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Alur Fase — compact note */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/40 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="font-medium">Alur fase:</span>
          <div className="flex items-center gap-1.5">
            <PersonaBadge label="Pathfinder" className="text-[11px] px-2.5 py-0.5" />
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <PersonaBadge label="Builder" className="text-[11px] px-2.5 py-0.5" />
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <PersonaBadge label="Achiever" className="text-[11px] px-2.5 py-0.5" />
          </div>
        </div>

        {/* Aturan Journey Global */}
        <Card className="border-border/50 shadow-none">
          <CardContent className="px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Aturan Journey</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">Global</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Pengaturan dasar yang berlaku untuk seluruh journey persona.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setEditRules(rules); setEditOpen(true); }}>
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Edit Aturan
              </Button>
            </div>

            {/* Rules as semantic label chips */}
            <div className="flex flex-wrap gap-2">
              {ruleItems.map(item => (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-help transition-colors ${
                      item.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {item.active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {RULE_INFO[item.key].shortLabel} {item.active ? "diaktifkan" : "dinonaktifkan"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[320px] p-3">
                    <p className="font-semibold text-xs mb-1">{RULE_INFO[item.key].title}</p>
                    <p className="text-xs opacity-90">{RULE_INFO[item.key].description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/5 text-primary border border-primary/20 cursor-help">
                    Reward default: {rules.defaultReward} poin
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[280px] p-3">
                  <p className="text-xs">Jumlah poin reward default yang diberikan saat pengguna menyelesaikan misi. Bisa di-override per misi.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Drawer */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Edit Aturan Journey Global</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 py-2">
            {/* Warning */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-medium mb-1">Perhatian</p>
                <p className="text-xs text-amber-700">Perubahan ini dapat memengaruhi user yang sedang berada dalam journey aktif. Tinjau dampaknya sebelum menyimpan.</p>
              </div>
            </div>

            {/* Auto-pass */}
            <RuleSettingBlock
              title="Auto-pass"
              checked={editRules.autoPass}
              onChange={v => setEditRules(p => ({ ...p, autoPass: v }))}
              info={RULE_INFO.autoPass}
              isActive={editRules.autoPass}
            />

            {/* Sequential Transition */}
            <RuleSettingBlock
              title="Transisi Berurutan"
              checked={editRules.sequentialTransition}
              onChange={v => setEditRules(p => ({ ...p, sequentialTransition: v }))}
              info={RULE_INFO.sequentialTransition}
              isActive={editRules.sequentialTransition}
            />

            {/* Show Previous as Suggested */}
            <RuleSettingBlock
              title="Tampilkan Misi Fase Sebelumnya"
              checked={editRules.showPreviousAsSuggested}
              onChange={v => setEditRules(p => ({ ...p, showPreviousAsSuggested: v }))}
              info={RULE_INFO.showPreviousAsSuggested}
              isActive={editRules.showPreviousAsSuggested}
            />

            {/* Reward Default */}
            <div className="rounded-xl border p-5 space-y-3">
              <Label className="text-sm font-semibold">Reward Default (poin)</Label>
              <Input
                type="number"
                value={editRules.defaultReward}
                onChange={e => setEditRules(p => ({ ...p, defaultReward: Number(e.target.value) }))}
                className="max-w-[200px]"
              />
              <p className="text-xs text-muted-foreground">Jumlah poin yang diberikan secara default saat pengguna menyelesaikan misi. Bisa di-override per misi.</p>
            </div>

            <Separator />

            {/* Impact */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Dampak ke User Aktif</h4>
              <p className="text-xs text-muted-foreground">Perubahan global memengaruhi pembentukan journey baru. Dampak ke snapshot user aktif mengikuti kebijakan sinkronisasi backend.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 border p-4">
                  <div className="text-xs text-muted-foreground">User journey aktif</div>
                  <div className="text-2xl font-bold mt-1">638</div>
                </div>
                <div className="rounded-xl bg-muted/50 border p-4">
                  <div className="text-xs text-muted-foreground">Misi aktif</div>
                  <div className="text-2xl font-bold mt-1">3.214</div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Batal</Button>
            <Button onClick={handleSave} className="flex-1">Simpan Perubahan</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

/* ─── Reusable rule setting block for the edit drawer ─── */
function RuleSettingBlock({
  title, checked, onChange, info, isActive,
}: {
  title: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  info: typeof RULE_INFO[string];
  isActive: boolean;
}) {
  return (
    <div className="rounded-xl border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{title}</Label>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">{info.description}</p>

      {/* Example if available */}
      {info.example && (
        <div className="rounded-lg bg-muted/60 border border-border/50 p-3">
          <p className="text-xs text-muted-foreground italic">{info.example}</p>
        </div>
      )}

      {/* Active / Inactive impact */}
      <div className="space-y-2">
        <div className={`flex gap-2.5 p-3 rounded-lg text-xs ${isActive ? "bg-emerald-50 border border-emerald-200" : "bg-muted/40 border border-border/50"}`}>
          <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`} />
          <div>
            <span className={`font-medium ${isActive ? "text-emerald-800" : "text-muted-foreground"}`}>Jika diaktifkan: </span>
            <span className={isActive ? "text-emerald-700" : "text-muted-foreground"}>{info.activeDesc}</span>
          </div>
        </div>
        <div className={`flex gap-2.5 p-3 rounded-lg text-xs ${!isActive ? "bg-amber-50 border border-amber-200" : "bg-muted/40 border border-border/50"}`}>
          <X className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${!isActive ? "text-amber-600" : "text-muted-foreground"}`} />
          <div>
            <span className={`font-medium ${!isActive ? "text-amber-800" : "text-muted-foreground"}`}>Jika dinonaktifkan: </span>
            <span className={!isActive ? "text-amber-700" : "text-muted-foreground"}>{info.inactiveDesc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
