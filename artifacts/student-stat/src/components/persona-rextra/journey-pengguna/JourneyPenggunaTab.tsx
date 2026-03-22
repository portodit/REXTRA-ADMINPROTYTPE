import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PersonaBadge, StatusBadge } from "../PersonaBadge";
import { DemoStateFAB, type DemoState } from "../DemoStateFAB";
import { MOCK_JOURNEY_USERS, SUMMARY_STATS, type JourneyUser } from "./mockJourneyData";
import { Search, Users, Trophy, AlertTriangle, RefreshCw, Eye, Download, Inbox } from "lucide-react";

export function JourneyPenggunaTab() {
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [search, setSearch] = useState("");
  const [filterPersonaAwal, setFilterPersonaAwal] = useState("semua");
  const [filterPersonaAktif, setFilterPersonaAktif] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [activeStatCard, setActiveStatCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStatClick = (key: string) => {
    if (activeStatCard === key) {
      setActiveStatCard(null);
      setFilterPersonaAwal("semua");
      setFilterPersonaAktif("semua");
      setFilterStatus("semua");
    } else {
      setActiveStatCard(key);
      setFilterPersonaAwal("semua");
      setFilterPersonaAktif("semua");
      setFilterStatus("semua");
      if (key === "pathfinder" || key === "builder" || key === "achiever") {
        setFilterPersonaAwal(key.charAt(0).toUpperCase() + key.slice(1));
      } else if (key === "selesai") {
        setFilterPersonaAktif("Journey Selesai");
      }
    }
  };

  const filteredUsers = MOCK_JOURNEY_USERS.filter(u => {
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !(u.nim || "").toLowerCase().includes(q)) return false;
    }
    if (filterPersonaAwal !== "semua" && u.personaAwal !== filterPersonaAwal) return false;
    if (filterPersonaAktif !== "semua" && u.personaAktif !== filterPersonaAktif) return false;
    if (filterStatus !== "semua" && u.statusJourney !== filterStatus) return false;
    return true;
  });

  const hasActiveFilter = search !== "" || filterPersonaAwal !== "semua" || filterPersonaAktif !== "semua" || filterStatus !== "semua";

  const resetFilters = () => {
    setSearch("");
    setFilterPersonaAwal("semua");
    setFilterPersonaAktif("semua");
    setFilterStatus("semua");
    setActiveStatCard(null);
  };

  const openDetail = (user: JourneyUser) => {
    navigate(`/persona-rextra/journey/${user.id}`);
  };

  // ─── Loading ───
  if (demoState === "loading") {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5"><Skeleton className="h-6 w-52" /><Skeleton className="h-3.5 w-80" /></div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <div className="flex gap-3"><Skeleton className="h-9 flex-1" /><Skeleton className="h-9 w-36" /><Skeleton className="h-9 w-36" /><Skeleton className="h-9 w-36" /></div>
        <Card className="shadow-none">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </Card>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Error ───
  if (demoState === "error") {
    return (
      <div className="space-y-5">
        <div className="rounded-lg bg-red-50 border border-red-200 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Gagal memuat data journey pengguna</p>
              <p className="text-xs text-red-600 mt-1.5">Terjadi kesalahan saat mengambil data. Pastikan koneksi stabil dan coba muat ulang.</p>
              <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-50" onClick={() => setDemoState("data")}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Coba Lagi
              </Button>
            </div>
          </div>
        </div>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Empty ───
  if (demoState === "empty") {
    return (
      <div className="space-y-5">
        <HeaderSection />
        <div className="grid grid-cols-5 gap-3">
          {["Total User Aktif", "Pathfinder", "Builder", "Achiever", "Journey Selesai"].map(l => (
            <StatCard key={l} label={l} value={0} active={false} onClick={() => {}} />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4"><Inbox className="h-8 w-8 text-muted-foreground" /></div>
          <p className="text-sm font-semibold text-foreground">Belum ada data journey pengguna</p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">Data pengguna akan tampil di sini setelah hasil profiling persona dan snapshot journey berhasil terbentuk.</p>
        </div>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Empty Filter ───
  if (demoState === "empty-filter") {
    return (
      <div className="space-y-5">
        <HeaderSection />
        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Total User Aktif" value={SUMMARY_STATS.totalAktif} icon={<Users className="h-4 w-4" />} active={false} onClick={() => {}} />
          <StatCard label="Pathfinder" value={SUMMARY_STATS.pathfinder} active={false} onClick={() => {}} persona="Pathfinder" />
          <StatCard label="Builder" value={SUMMARY_STATS.builder} active={false} onClick={() => {}} persona="Builder" />
          <StatCard label="Achiever" value={SUMMARY_STATS.achiever} active={false} onClick={() => {}} persona="Achiever" />
          <StatCard label="Journey Selesai" value={SUMMARY_STATS.selesai} icon={<Trophy className="h-4 w-4" />} active={false} onClick={() => {}} />
        </div>
        <ToolbarSection search="rencana karier" onSearchChange={() => {}} filterPersonaAwal="Builder" onFilterPersonaAwalChange={() => {}} filterPersonaAktif="semua" onFilterPersonaAktifChange={() => {}} filterStatus="semua" onFilterStatusChange={() => {}} />
        <div className="text-xs text-muted-foreground px-1">
          Filter aktif: Persona Awal Builder, Pencarian "rencana karier".{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setDemoState("data")}>Reset filter</Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
          <p className="text-sm font-semibold text-foreground">Tidak ada pengguna yang sesuai</p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">Coba ubah kata kunci pencarian atau reset filter yang sedang digunakan.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setDemoState("data")}>Reset Filter</Button>
        </div>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Data (default) ───
  return (
    <div className="space-y-5">
      <HeaderSection />

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Total User Aktif" value={SUMMARY_STATS.totalAktif} icon={<Users className="h-4 w-4" />} active={activeStatCard === "total"} onClick={() => handleStatClick("total")} />
        <StatCard label="Pathfinder" value={SUMMARY_STATS.pathfinder} active={activeStatCard === "pathfinder"} onClick={() => handleStatClick("pathfinder")} persona="Pathfinder" />
        <StatCard label="Builder" value={SUMMARY_STATS.builder} active={activeStatCard === "builder"} onClick={() => handleStatClick("builder")} persona="Builder" />
        <StatCard label="Achiever" value={SUMMARY_STATS.achiever} active={activeStatCard === "achiever"} onClick={() => handleStatClick("achiever")} persona="Achiever" />
        <StatCard label="Journey Selesai" value={SUMMARY_STATS.selesai} icon={<Trophy className="h-4 w-4" />} active={activeStatCard === "selesai"} onClick={() => handleStatClick("selesai")} />
      </div>

      {/* Toolbar */}
      <ToolbarSection
        search={search} onSearchChange={setSearch}
        filterPersonaAwal={filterPersonaAwal} onFilterPersonaAwalChange={setFilterPersonaAwal}
        filterPersonaAktif={filterPersonaAktif} onFilterPersonaAktifChange={setFilterPersonaAktif}
        filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}
      />

      {hasActiveFilter && (
        <div className="text-xs text-muted-foreground px-1">
          Menampilkan {filteredUsers.length} dari {MOCK_JOURNEY_USERS.length} pengguna.{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetFilters}>Reset filter</Button>
        </div>
      )}

      {/* Table */}
      <Card className="shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pengguna</TableHead>
              <TableHead>Email / NIM</TableHead>
              <TableHead>Persona Awal</TableHead>
              <TableHead>Persona Aktif</TableHead>
              <TableHead>Status Journey</TableHead>
              <TableHead>Progress Wajib</TableHead>
              <TableHead>Total Selesai</TableHead>
              <TableHead>Profiling</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(u => (
              <TableRow key={u.id} className="cursor-pointer" onClick={() => openDetail(u)}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                      {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs">{u.email}</p>
                    {u.nim && <p className="text-[11px] text-muted-foreground">{u.nim}</p>}
                  </div>
                </TableCell>
                <TableCell><PersonaBadge label={u.personaAwal} /></TableCell>
                <TableCell><PersonaBadge label={u.personaAktif === "Journey Selesai" ? "Achiever" : u.personaAktif} className={u.personaAktif === "Journey Selesai" ? "!bg-green-100 !text-green-800" : undefined} /></TableCell>
                <TableCell><StatusBadge label={u.statusJourney} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={(u.progressWajib.done / u.progressWajib.total) * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{u.progressWajib.done}/{u.progressWajib.total}</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs">{u.totalMisiSelesai} misi</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{u.tanggalProfiling}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{u.terakhirDiperbarui}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); openDetail(u); }}>
                    <Eye className="h-3.5 w-3.5 mr-1" />Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function HeaderSection() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-bold text-foreground">Journey Pengguna</h2>
        <p className="text-xs text-muted-foreground mt-1">Pantau hasil profiling persona, distribusi user per fase, dan progress penyelesaian misi tiap pengguna.</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <Button variant="outline" size="sm"><RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh</Button>
      </div>
    </div>
  );
}

const PERSONA_ACCENT: Record<string, string> = {
  Pathfinder: "border-violet-300 bg-violet-50",
  Builder: "border-blue-300 bg-blue-50",
  Achiever: "border-emerald-300 bg-emerald-50",
};

function StatCard({ label, value, icon, active, onClick, persona }: { label: string; value: number; icon?: React.ReactNode; active: boolean; onClick: () => void; persona?: string }) {
  const accent = persona ? PERSONA_ACCENT[persona] : undefined;
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all hover:shadow-sm ${active ? "ring-2 ring-primary border-primary" : accent || "border-border bg-card"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {persona && <PersonaBadge label={persona} className="text-[10px] px-1.5 py-0" />}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </button>
  );
}

function ToolbarSection({
  search, onSearchChange,
  filterPersonaAwal, onFilterPersonaAwalChange,
  filterPersonaAktif, onFilterPersonaAktifChange,
  filterStatus, onFilterStatusChange,
}: {
  search: string; onSearchChange: (v: string) => void;
  filterPersonaAwal: string; onFilterPersonaAwalChange: (v: string) => void;
  filterPersonaAktif: string; onFilterPersonaAktifChange: (v: string) => void;
  filterStatus: string; onFilterStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="h-9 text-sm pl-9" placeholder="Cari nama, email, atau NIM pengguna..." value={search} onChange={e => onSearchChange(e.target.value)} />
      </div>
      <Select value={filterPersonaAwal} onValueChange={onFilterPersonaAwalChange}>
        <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Persona Awal" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Persona Awal</SelectItem>
          <SelectItem value="Pathfinder">Pathfinder</SelectItem>
          <SelectItem value="Builder">Builder</SelectItem>
          <SelectItem value="Achiever">Achiever</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterPersonaAktif} onValueChange={onFilterPersonaAktifChange}>
        <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Persona Aktif" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Persona Aktif</SelectItem>
          <SelectItem value="Pathfinder">Pathfinder</SelectItem>
          <SelectItem value="Builder">Builder</SelectItem>
          <SelectItem value="Achiever">Achiever</SelectItem>
          <SelectItem value="Journey Selesai">Journey Selesai</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Status Journey" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Status Journey</SelectItem>
          <SelectItem value="Belum Mulai">Belum Mulai</SelectItem>
          <SelectItem value="Sedang Berjalan">Sedang Berjalan</SelectItem>
          <SelectItem value="Persona Selesai">Persona Selesai</SelectItem>
          <SelectItem value="Journey Selesai">Journey Selesai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
