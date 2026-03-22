import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonaBadge, StatusBadge } from "@/components/persona-rextra/PersonaBadge";
import { MOCK_JOURNEY_USERS, MOCK_TRANSITIONS, MOCK_USER_MISSIONS } from "@/components/persona-rextra/journey-pengguna/mockJourneyData";
import {
  ArrowLeft, User, Award, CalendarDays, CheckCircle2, Circle, Clock,
  ChevronRight, Zap
} from "lucide-react";

const MISSION_STATUS_ICON: Record<string, React.ReactNode> = {
  "Selesai": <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
  "Auto-pass": <Zap className="h-3.5 w-3.5 text-amber-600" />,
  "Sedang Berjalan": <Clock className="h-3.5 w-3.5 text-blue-600" />,
  "Belum Mulai": <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
};

export default function JourneyUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_JOURNEY_USERS.find(u => u.id === userId);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm font-semibold">Pengguna tidak ditemukan</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/persona-rextra")}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Kembali
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const progressPct = user.progressWajib.total > 0 ? (user.progressWajib.done / user.progressWajib.total) * 100 : 0;
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/persona-rextra")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">{user.name}</h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <PersonaBadge label={user.personaAktif === "Journey Selesai" ? "Achiever" : user.personaAktif} />
                <StatusBadge label={user.statusJourney} />
              </div>
            </div>
          </div>
        </div>

        {/* Combined: Info Pengguna + Progress Journey */}
        <Card className="shadow-none">
          {/* Top: Info Pengguna */}
          <div className="p-5 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-5">
              <User className="h-3.5 w-3.5" /> Informasi Pengguna
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
              <InfoItem label="Persona Awal">
                <PersonaBadge label={user.personaAwal} />
              </InfoItem>
              <InfoItem label="Persona Aktif">
                <PersonaBadge
                  label={user.personaAktif === "Journey Selesai" ? "Achiever" : user.personaAktif}
                  className={user.personaAktif === "Journey Selesai" ? "!bg-green-100 !text-green-800" : undefined}
                />
              </InfoItem>
              <InfoItem label="Tanggal Profiling">
                <span className="text-sm font-semibold text-foreground">{user.tanggalProfiling}</span>
              </InfoItem>
              <InfoItem label="Terakhir Diperbarui">
                <span className="text-sm font-semibold text-foreground">{user.terakhirDiperbarui}</span>
              </InfoItem>
            </div>
          </div>

          {/* Bottom: Progress Journey */}
          <div className="p-5 space-y-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> Progress Journey
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Misi Wajib Selesai" value={`${user.progressWajib.done} / ${user.progressWajib.total}`} accent />
              <MiniStat label="Total Misi Selesai" value={`${user.totalMisiSelesai} misi`} />
              <MiniStat label="Dianjurkan Selesai" value={`${Math.max(0, user.totalMisiSelesai - user.progressWajib.done)} misi`} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress misi wajib fase aktif</span>
                <span className="font-mono font-semibold">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <CalendarDays className="h-3.5 w-3.5" /> Riwayat Transisi
              </h4>
              <div className="flex items-center gap-2">
                {MOCK_TRANSITIONS.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`flex-1 flex items-center gap-3 rounded-lg border px-4 py-3 ${t.status === "Selesai" ? "bg-green-50 border-green-200" : t.status === "Aktif" ? "bg-primary/5 border-primary/30" : "bg-muted/50 border-border"}`}>
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${t.status === "Selesai" ? "bg-green-500" : t.status === "Aktif" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <div className="min-w-0">
                        <PersonaBadge label={t.persona} className="text-xs" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {t.status === "Selesai" ? `${t.startDate} — ${t.endDate}` : t.status === "Aktif" ? `Sejak ${t.startDate}` : "Belum dimulai"}
                        </p>
                      </div>
                    </div>
                    {i < MOCK_TRANSITIONS.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Missions Table */}
        <Card className="shadow-none overflow-hidden">
          <div className="p-5 pb-3 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Daftar Misi User
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Misi</TableHead>
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
                    <div className="flex items-center gap-2">
                      {MISSION_STATUS_ICON[m.statusMisi]}
                      <span className="text-sm">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><PersonaBadge label={m.persona} className="text-[10px] px-1.5" /></TableCell>
                  <TableCell><StatusBadge label={m.kategori} className="text-[10px] px-1.5" /></TableCell>
                  <TableCell><StatusBadge label={m.statusMisi} className="text-[10px] px-1.5" /></TableCell>
                  <TableCell><span className="text-xs text-muted-foreground">{m.tanggalSelesai || "—"}</span></TableCell>
                  <TableCell>
                    <span className={`text-xs ${m.reward.includes("Sudah") ? "text-green-700 font-medium" : "text-muted-foreground"}`}>{m.reward}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
      {children}
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3.5 text-center ${accent ? "bg-primary/5 border-primary/20" : "bg-muted/40"}`}>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
