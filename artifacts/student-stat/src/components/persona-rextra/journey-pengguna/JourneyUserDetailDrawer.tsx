import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PersonaBadge, StatusBadge } from "../PersonaBadge";
import { MOCK_TRANSITIONS, MOCK_USER_MISSIONS, type JourneyUser } from "./mockJourneyData";
import { User, CalendarDays, CheckCircle2, Circle, Clock, ChevronRight, Zap, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  user: JourneyUser | null;
}

const MISSION_STATUS_ICON: Record<string, React.ReactNode> = {
  "Selesai": <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
  "Auto-pass": <Zap className="h-3.5 w-3.5 text-amber-600" />,
  "Sedang Berjalan": <Clock className="h-3.5 w-3.5 text-blue-600" />,
  "Belum Mulai": <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
};

export function JourneyUserDetailDrawer({ open, onClose, user }: Props) {
  if (!user) return null;

  const progressPct = user.progressWajib.total > 0 ? (user.progressWajib.done / user.progressWajib.total) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="p-5 pb-4 border-b bg-muted/30">
          <SheetTitle className="text-base">Detail Journey Pengguna</SheetTitle>
          <p className="text-xs text-muted-foreground">{user.name} • {user.personaAktif}</p>
        </SheetHeader>

        <div className="divide-y">
          {/* Section A — Ringkasan User */}
          <section className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Ringkasan User
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <InfoRow label="Nama" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              {user.nim && <InfoRow label="NIM" value={user.nim} />}
              <div>
                <p className="text-muted-foreground mb-1">Persona Awal</p>
                <PersonaBadge label={user.personaAwal} />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Persona Aktif</p>
                <PersonaBadge label={user.personaAktif === "Journey Selesai" ? "Achiever" : user.personaAktif} />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status Journey</p>
                <StatusBadge label={user.statusJourney} />
              </div>
              <InfoRow label="Tanggal Profiling" value={user.tanggalProfiling} />
              <InfoRow label="Terakhir Diperbarui" value={user.terakhirDiperbarui} />
            </div>
          </section>

          {/* Section B — Progress Journey */}
          <section className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> Progress Journey
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Misi Wajib Selesai" value={`${user.progressWajib.done} / ${user.progressWajib.total}`} />
              <MiniStat label="Total Misi Selesai" value={`${user.totalMisiSelesai} misi`} />
              <MiniStat label="Dianjurkan Selesai" value={`${Math.max(0, user.totalMisiSelesai - user.progressWajib.done)} misi`} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress misi wajib fase aktif</span>
                <span className="font-mono font-medium">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          </section>

          {/* Section C — Riwayat Transisi */}
          <section className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Riwayat Transisi Persona
            </h3>
            <div className="relative pl-5 space-y-0">
              {MOCK_TRANSITIONS.map((t, i) => (
                <div key={i} className="relative pb-5 last:pb-0">
                  {/* Timeline line */}
                  {i < MOCK_TRANSITIONS.length - 1 && (
                    <div className="absolute left-[-13px] top-3 bottom-0 w-px bg-border" />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-[-17px] top-1 h-2.5 w-2.5 rounded-full border-2 ${t.status === "Selesai" ? "bg-green-500 border-green-500" : t.status === "Aktif" ? "bg-primary border-primary" : "bg-muted border-muted-foreground/30"}`} />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <PersonaBadge label={t.persona} className="text-[11px]" />
                        <StatusBadge label={t.status === "Selesai" ? "Selesai" : t.status === "Aktif" ? "Sedang Berjalan" : "Belum Mulai"} className="text-[10px]" />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {t.status === "Selesai" ? `${t.startDate} — ${t.endDate}` : t.status === "Aktif" ? `Sejak ${t.startDate}` : "Belum dimulai"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section D — Daftar Misi */}
          <section className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Daftar Misi User
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Misi</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Selesai</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_USER_MISSIONS.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {MISSION_STATUS_ICON[m.statusMisi]}
                          <span className="text-xs">{m.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><PersonaBadge label={m.persona} className="text-[10px] px-1.5" /></TableCell>
                      <TableCell><StatusBadge label={m.kategori} className="text-[10px] px-1.5" /></TableCell>
                      <TableCell><StatusBadge label={m.statusMisi} className="text-[10px] px-1.5" /></TableCell>
                      <TableCell><span className="text-[11px] text-muted-foreground">{m.tanggalSelesai || "—"}</span></TableCell>
                      <TableCell>
                        <span className={`text-[11px] ${m.reward.includes("Sudah") ? "text-green-700" : "text-muted-foreground"}`}>{m.reward}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Section E — Hasil Profiling */}
          <section className="p-5 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hasil Profiling</h3>
            <div className="rounded-lg bg-muted/40 border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium">Hasil Persona:</p>
                <PersonaBadge label={user.personaAwal} />
              </div>
              <p className="text-[11px] text-muted-foreground">Profiling dilakukan pada {user.tanggalProfiling}. Ringkasan jawaban dan detail scoring tersedia di sistem profiling.</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">Lihat Detail Hasil Profiling <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 border p-3 text-center">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
