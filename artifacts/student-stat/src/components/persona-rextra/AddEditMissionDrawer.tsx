import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Zap, Lock, Target, Tag, Hash, Trophy, FileText, Layers, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FITUR_OPTIONS, type Mission } from "./mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  mission?: Mission | null;
  defaultPersona?: string;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <span className="text-xs font-semibold text-foreground uppercase tracking-wide">{children}</span>
    </div>
  );
}

export function AddEditMissionDrawer({ open, onClose, mission, defaultPersona }: Props) {
  const isEdit = !!mission;

  const [form, setForm] = useState({
    persona: defaultPersona || "Pathfinder",
    code: "",
    name: "",
    description: "",
    urutan: 1,
    reward: 100,
    kategori: "Wajib" as "Wajib" | "Dianjurkan",
    status: "Aktif" as "Aktif" | "Nonaktif",
    fitur: "Kenali Diri",
    labelAkses: "-",
    blocking: true,
    autoPass: false,
    autoPassType: "Manual",
  });

  useEffect(() => {
    if (mission) {
      setForm({
        persona: defaultPersona || "Pathfinder",
        code: mission.code,
        name: mission.name,
        description: mission.description,
        urutan: mission.no,
        reward: mission.reward,
        kategori: mission.kategori,
        status: mission.status,
        fitur: mission.fitur,
        labelAkses: mission.labelAkses,
        blocking: mission.blocking,
        autoPass: mission.autoPass,
        autoPassType: mission.autoPassType,
      });
    } else {
      setForm(f => ({ ...f, persona: defaultPersona || "Pathfinder", code: "", name: "", description: "", urutan: 1 }));
    }
  }, [mission, defaultPersona, open]);

  const handleSave = () => {
    toast.success(isEdit ? "Misi berhasil diperbarui." : "Misi berhasil ditambahkan.");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <SheetTitle className="text-lg font-bold">{isEdit ? "Edit" : "Tambah"} Misi Persona</SheetTitle>
          {isEdit && mission && mission.usedByUsers > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex gap-2 mt-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
              <span>Misi ini sudah digunakan oleh <strong>{mission.usedByUsers} user</strong>. Perubahan besar dapat memengaruhi konsistensi journey.</span>
            </div>
          )}
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Section: Identitas */}
          <SectionTitle icon={FileText}>Identitas Misi</SectionTitle>
          <div className="space-y-4 pl-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Persona Owner <span className="text-destructive">*</span></Label>
                <Select value={form.persona} onValueChange={v => setForm(f => ({ ...f, persona: v }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pathfinder">🧭 Pathfinder</SelectItem>
                    <SelectItem value="Builder">🔨 Builder</SelectItem>
                    <SelectItem value="Achiever">🏆 Achiever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Kode Misi <span className="text-destructive">*</span></Label>
                <Input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="PF_XXX"
                  readOnly={isEdit}
                  className={`h-10 font-mono text-xs ${isEdit ? "bg-muted cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Nama Misi <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Judul misi..." className="h-10" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Deskripsi Misi</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat tentang misi ini..." rows={3} className="resize-none" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Section: Pengaturan */}
          <SectionTitle icon={Hash}>Urutan & Reward</SectionTitle>
          <div className="space-y-4 pl-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Urutan <span className="text-destructive">*</span></Label>
                <Input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: Number(e.target.value) }))} className="h-10" min={1} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Reward Poin <span className="text-destructive">*</span>
                </Label>
                <Input type="number" value={form.reward} onChange={e => setForm(f => ({ ...f, reward: Number(e.target.value) }))} className="h-10" min={0} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Kategori Default <span className="text-destructive">*</span></Label>
                <Select value={form.kategori} onValueChange={v => setForm(f => ({ ...f, kategori: v as any }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wajib">Wajib</SelectItem>
                    <SelectItem value="Dianjurkan">Dianjurkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Status <span className="text-destructive">*</span></Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Aktif</span>
                    </SelectItem>
                    <SelectItem value="Nonaktif">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Nonaktif</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Section: Fitur & Akses */}
          <SectionTitle icon={Target}>Fitur & Akses</SectionTitle>
          <div className="space-y-4 pl-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Fitur Tujuan <span className="text-destructive">*</span></Label>
                <Select value={form.fitur} onValueChange={v => setForm(f => ({ ...f, fitur: v }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FITUR_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Label Akses</Label>
                <Select value={form.labelAkses} onValueChange={v => setForm(f => ({ ...f, labelAkses: v }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">Tidak ada</SelectItem>
                    <SelectItem value="Akses Token">Akses Token</SelectItem>
                    <SelectItem value="Akses Terbatas">Akses Terbatas</SelectItem>
                    <SelectItem value="Bebas">Bebas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Section: Perilaku Misi */}
          <SectionTitle icon={ShieldCheck}>Perilaku Misi</SectionTitle>
          <div className="space-y-3 pl-1">
            {/* Blocking toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">Misi Blocking</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Misi berikutnya terkunci sampai misi ini selesai</p>
              </div>
              <Switch checked={form.blocking} onCheckedChange={v => setForm(f => ({ ...f, blocking: v }))} />
            </div>

            {/* Auto-pass toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">Auto-pass</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Otomatis selesai jika data sudah tersedia di sistem</p>
              </div>
              <Switch checked={form.autoPass} onCheckedChange={v => setForm(f => ({ ...f, autoPass: v }))} />
            </div>

            {/* Auto-pass type - only shown when auto-pass is active */}
            {form.autoPass && (
              <div className="space-y-1.5 pl-1 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-xs font-medium text-muted-foreground">Tipe Auto-pass</Label>
                <Select value={form.autoPassType} onValueChange={v => setForm(f => ({ ...f, autoPassType: v }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data fitur tersedia">Data fitur tersedia</SelectItem>
                    <SelectItem value="Field wajib lengkap">Field wajib lengkap</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t bg-muted/30 flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="min-w-[80px]">Batal</Button>
          <Button onClick={handleSave} className="min-w-[100px]">
            {isEdit ? "Simpan Perubahan" : "Tambah Misi"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
