import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, GripVertical, Filter, ListChecks, Star, Hash } from "lucide-react";
import { PersonaBadge, StatusBadge } from "./PersonaBadge";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Mission } from "./mockData";
import { toast } from "sonner";

// ─── Delete Mission Modal ────────────────────────────────────────────
export function DeleteMissionModal({ open, onClose, mission }: { open: boolean; onClose: () => void; mission: Mission | null }) {
  if (!mission) return null;
  const usedByUsers = mission.usedByUsers > 0;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={usedByUsers ? "text-destructive" : ""}>
            {usedByUsers ? "Misi sudah digunakan oleh journey pengguna" : "Hapus misi ini?"}
          </DialogTitle>
          <DialogDescription>
            {usedByUsers ? (
              <>Misi <strong>{mission.code}</strong> sudah dipakai pada snapshot journey {mission.usedByUsers} pengguna. Menghapusnya dapat memengaruhi riwayat dan monitoring journey.<br /><br />Disarankan: pilih <strong>Nonaktifkan</strong> daripada hapus permanen.</>
            ) : (
              "Misi akan hilang dari konfigurasi dan tidak bisa dipulihkan."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          {usedByUsers && <Button variant="secondary" onClick={() => { onClose(); toast.success("Misi berhasil dinonaktifkan."); }}>Nonaktifkan saja</Button>}
          <Button variant="destructive" onClick={() => { onClose(); toast.success("Misi berhasil dihapus."); }}>Lanjut Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Deactivate Mission Modal ────────────────────────────────────────
export function DeactivateMissionModal({ open, onClose, mission }: { open: boolean; onClose: () => void; mission: Mission | null }) {
  const [confirmed, setConfirmed] = useState(false);
  if (!mission) return null;

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { onClose(); setConfirmed(false); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nonaktifkan misi ini?</DialogTitle>
          <DialogDescription>
            Misi ini sudah digunakan oleh {mission.usedByUsers} pengguna. Menonaktifkan tidak akan menghapus data journey yang sudah ada, tetapi misi ini tidak akan digunakan untuk konfigurasi journey baru.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 text-sm">
          <Checkbox id="confirm-deactivate" checked={confirmed} onCheckedChange={v => setConfirmed(!!v)} />
          <label htmlFor="confirm-deactivate">Saya memahami dampaknya.</label>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button disabled={!confirmed} onClick={() => { onClose(); setConfirmed(false); toast.success("Misi berhasil dinonaktifkan."); }}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Preview Journey Modal ───────────────────────────────────────────
const PREVIEW_DATA: Record<string, { items: { no: number; name: string; kat: "Wajib" | "Dianjurkan"; fitur: string; reward: number }[] }> = {
  Pathfinder: {
    items: [
      { no: 1, name: "Simpan data pendidikan", kat: "Wajib", fitur: "Jejak Studi", reward: 100 },
      { no: 2, name: "Tetapkan tujuan karier", kat: "Wajib", fitur: "Kenali Diri", reward: 100 },
      { no: 3, name: "Jelajahi profesi", kat: "Dianjurkan", fitur: "Jelajah Profesi", reward: 100 },
      { no: 4, name: "Susun rencana karier", kat: "Wajib", fitur: "Rencana Karier", reward: 100 },
    ],
  },
  Builder: {
    items: [
      { no: 1, name: "Simpan data pendidikan", kat: "Wajib", fitur: "Jejak Studi", reward: 100 },
      { no: 2, name: "Susun rencana karier lanjutan", kat: "Wajib", fitur: "Rencana Karier", reward: 100 },
      { no: 3, name: "Uji kecocokan profesi", kat: "Dianjurkan", fitur: "Uji Kecocokan", reward: 100 },
    ],
  },
  Achiever: {
    items: [
      { no: 1, name: "Buat CV terpersonalisasi", kat: "Wajib", fitur: "CV Generator", reward: 150 },
      { no: 2, name: "Simulasi wawancara", kat: "Wajib", fitur: "AI Interviewer", reward: 150 },
    ],
  },
};

const PERSONA_CONFIG: Record<string, {
  icon: string;
  label: string;
  activeClass: string;
  badgeClass: string;
  lineClass: string;
  circleActive: string;
  circleInactive: string;
}> = {
  Pathfinder: {
    icon: "🧭",
    label: "Pathfinder",
    activeClass: "border-violet-400 bg-violet-50 text-violet-800 shadow-sm",
    badgeClass: "bg-violet-100 text-violet-700 border border-violet-200",
    lineClass: "bg-violet-200",
    circleActive: "bg-violet-600 text-white border-violet-600",
    circleInactive: "bg-white text-muted-foreground border-border",
  },
  Builder: {
    icon: "🔨",
    label: "Builder",
    activeClass: "border-blue-400 bg-blue-50 text-blue-800 shadow-sm",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
    lineClass: "bg-blue-200",
    circleActive: "bg-blue-600 text-white border-blue-600",
    circleInactive: "bg-white text-muted-foreground border-border",
  },
  Achiever: {
    icon: "🏆",
    label: "Achiever",
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm",
    badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    lineClass: "bg-emerald-200",
    circleActive: "bg-emerald-600 text-white border-emerald-600",
    circleInactive: "bg-white text-muted-foreground border-border",
  },
};

export function PreviewJourneyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("Pathfinder");
  const [filterKat, setFilterKat] = useState<"semua" | "Wajib" | "Dianjurkan">("semua");

  const data = PREVIEW_DATA[activeTab];
  const filtered = filterKat === "semua" ? data.items : data.items.filter(i => i.kat === filterKat);
  const numbered = filtered.map((item, idx) => ({ ...item, displayNo: idx + 1 }));
  const totalSteps = numbered.length;
  const wajibCount = data.items.filter(i => i.kat === "Wajib").length;
  const dianjurkanCount = data.items.filter(i => i.kat === "Dianjurkan").length;

  const cfg = PERSONA_CONFIG[activeTab];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterKat("semua");
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-base font-bold mb-0.5">Preview Journey Persona</DialogTitle>
          <DialogDescription className="text-xs">Simulasi komposisi journey berdasarkan persona awal pengguna.</DialogDescription>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden px-6">
          {/* Persona Tab Switcher */}
          <div className="flex gap-2 py-4">
            {["Pathfinder", "Builder", "Achiever"].map(tab => {
              const c = PERSONA_CONFIG[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold ${
                    isActive ? c.activeClass : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-base leading-none">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Summary overview cards */}
          <div className="grid grid-cols-3 gap-2 pb-4 border-b">
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3.5 py-2.5 border border-border/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/10">
                <Hash className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none mb-0.5">Total</p>
                <p className="text-lg font-bold text-foreground leading-none">{data.items.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-primary/8 px-3.5 py-2.5 border border-primary/20">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <ListChecks className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-primary/80 uppercase tracking-wide leading-none mb-0.5">Wajib</p>
                <p className="text-lg font-bold text-primary leading-none">{wajibCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 px-3.5 py-2.5 border border-amber-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                <Star className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-amber-700 uppercase tracking-wide leading-none mb-0.5">Dianjurkan</p>
                <p className="text-lg font-bold text-amber-700 leading-none">{dianjurkanCount}</p>
              </div>
            </div>
          </div>

          {/* Filter + Mission list */}
          <div className="flex items-center justify-end pt-3 pb-2">
            <Select value={filterKat} onValueChange={v => setFilterKat(v as typeof filterKat)}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kategori</SelectItem>
                <SelectItem value="Wajib">Wajib saja</SelectItem>
                <SelectItem value="Dianjurkan">Dianjurkan saja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mission list */}
          <div className="flex-1 overflow-y-auto pb-4">
            {numbered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Tidak ada misi dengan kategori "{filterKat}"</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className={`absolute left-[13px] top-4 bottom-4 w-0.5 ${cfg.lineClass}`} />

                <div className="space-y-3">
                  {numbered.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {/* Circle — centered with card */}
                      <div className={`relative z-10 shrink-0 flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 shadow-sm ${
                        item.kat === "Wajib" ? cfg.circleActive : cfg.circleInactive
                      }`}>
                        {item.displayNo}
                      </div>

                      {/* Card */}
                      <div className="flex-1 rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Fitur: {item.fitur}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge label={item.kat} />
                            <span className="text-xs font-semibold text-emerald-600">+{item.reward}pt</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                            <span>Step {item.displayNo} of {totalSteps}</span>
                            <span className="font-medium">{Math.round((item.displayNo / totalSteps) * 100)}%</span>
                          </div>
                          <Progress value={(item.displayNo / totalSteps) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reorder Mission Modal ───────────────────────────────────────────
export function ReorderMissionModal({ open, onClose, missions }: { open: boolean; onClose: () => void; missions: Mission[] }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atur Urutan Misi</DialogTitle>
          <DialogDescription>Seret item untuk mengubah urutan. Perubahan akan memengaruhi prioritas journey pengguna baru.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {missions.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <span className="text-xs text-muted-foreground w-6 font-medium">{i + 1}</span>
              <span className="text-sm flex-1">{m.name}</span>
              <StatusBadge label={m.kategori} />
            </div>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { onClose(); toast.success("Urutan berhasil diperbarui."); }}>Simpan Urutan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
