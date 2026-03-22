import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, GripVertical, Filter } from "lucide-react";
import { PersonaBadge, StatusBadge } from "./PersonaBadge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function PreviewJourneyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("Pathfinder");
  const [filterKat, setFilterKat] = useState<"semua" | "Wajib" | "Dianjurkan">("semua");

  const data = PREVIEW_DATA[activeTab];
  const filtered = filterKat === "semua" ? data.items : data.items.filter(i => i.kat === filterKat);

  // Renumber after filter
  const numbered = filtered.map((item, idx) => ({ ...item, displayNo: idx + 1 }));
  const totalSteps = numbered.length;
  const wajibCount = data.items.filter(i => i.kat === "Wajib").length;
  const dianjurkanCount = data.items.filter(i => i.kat === "Dianjurkan").length;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Preview Journey Persona</DialogTitle>
          <DialogDescription>Simulasi komposisi journey berdasarkan persona awal pengguna.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setFilterKat("semua"); }} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="Pathfinder">🧭 Pathfinder</TabsTrigger>
              <TabsTrigger value="Builder">🔨 Builder</TabsTrigger>
              <TabsTrigger value="Achiever">🏆 Achiever</TabsTrigger>
            </TabsList>
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

          {/* Summary */}
          <div className="flex gap-4 text-xs text-muted-foreground py-3 border-b">
            <span>Total: <strong className="text-foreground">{data.items.length}</strong></span>
            <span>Wajib: <strong className="text-foreground">{wajibCount}</strong></span>
            <span>Dianjurkan: <strong className="text-foreground">{dianjurkanCount}</strong></span>
          </div>

          {["Pathfinder", "Builder", "Achiever"].map(persona => (
            <TabsContent key={persona} value={persona} className="flex-1 overflow-y-auto mt-0 pt-4">
              {numbered.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">Tidak ada misi dengan kategori "{filterKat}"</p>
                </div>
              ) : (
                <div className="relative pl-8">
                  {/* Vertical progress line */}
                  <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-border" />

                  <div className="space-y-0">
                    {numbered.map((item, idx) => (
                      <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Step circle */}
                        <div className={`absolute left-[-22px] flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 z-10 ${
                          item.kat === "Wajib"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border"
                        }`}>
                          {item.displayNo}
                        </div>

                        {/* Card */}
                        <div className="flex-1 rounded-lg border p-4 bg-card hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Fitur: {item.fitur}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge label={item.kat} />
                              <span className="text-xs font-medium text-emerald-600">+{item.reward}pt</span>
                            </div>
                          </div>
                          {/* Mini progress */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Step {item.displayNo} of {totalSteps}</span>
                              <span>{Math.round((item.displayNo / totalSteps) * 100)}%</span>
                            </div>
                            <Progress value={(item.displayNo / totalSteps) * 100} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </DialogFooter>
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
