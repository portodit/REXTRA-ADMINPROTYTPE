import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, AlertTriangle, RefreshCw, Search } from "lucide-react";
import { GlobalRulesPanel } from "./GlobalRulesPanel";
import { PersonaCard } from "./PersonaCard";
import { AddEditMissionDrawer } from "./AddEditMissionDrawer";
import { UserListDrawer } from "./UserListDrawer";
import { DeleteMissionModal, DeactivateMissionModal, PreviewJourneyModal, ReorderMissionModal } from "./MissionModals";
import { DemoStateFAB, type DemoState } from "./DemoStateFAB";
import { MOCK_PERSONAS, type Mission, type PersonaData } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const EMPTY_PERSONAS: PersonaData[] = [
  { id: "pathfinder", name: "Pathfinder", description: "Fase eksplorasi awal dan pembangunan fondasi karier.", colorClass: "bg-violet-100 text-violet-800", missions: [] },
  { id: "builder", name: "Builder", description: "Fase pengembangan portofolio dan personal branding.", colorClass: "bg-blue-100 text-blue-800", missions: [] },
  { id: "achiever", name: "Achiever", description: "Fase persiapan seleksi rekrutmen dan transisi karier.", colorClass: "bg-emerald-100 text-emerald-800", missions: [] },
];

export function KonfigurasiJourneyTab() {
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [expandedPersonas, setExpandedPersonas] = useState<string[]>(["pathfinder"]);
  const [filterPersona, setFilterPersona] = useState("semua");
  const [filterKategori, setFilterKategori] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [search, setSearch] = useState("");

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editMission, setEditMission] = useState<Mission | null>(null);
  const [defaultPersona, setDefaultPersona] = useState<string>("Pathfinder");
  const [userListOpen, setUserListOpen] = useState(false);
  const [userListMission, setUserListMission] = useState<Mission | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMission, setDeleteMission] = useState<Mission | null>(null);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateMission, setDeactivateMission] = useState<Mission | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const togglePersona = (id: string) => {
    setExpandedPersonas(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const filteredPersonas = MOCK_PERSONAS.filter(p => filterPersona === "semua" || p.id === filterPersona.toLowerCase());

  const filterMissions = (missions: Mission[]) => {
    return missions.filter(m => {
      if (filterKategori !== "semua" && m.kategori !== filterKategori) return false;
      if (filterStatus !== "semua" && m.status !== filterStatus) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.code.toLowerCase().includes(search.toLowerCase()) && !m.fitur.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  };

  const hasActiveFilter = filterPersona !== "semua" || filterKategori !== "semua" || filterStatus !== "semua" || search !== "";

  const resetFilters = () => {
    setFilterPersona("semua");
    setFilterKategori("semua");
    setFilterStatus("semua");
    setSearch("");
  };

  // ─── Loading ───────────────────────────────────────────────────────
  if (demoState === "loading") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-5 space-y-3 shadow-none">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-52" />
              </div>
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(j => <Skeleton key={j} className="h-12 w-full" />)}
            </div>
          </Card>
        ))}
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────
  if (demoState === "error") {
    return (
      <div className="space-y-5">
        <div className="rounded-lg bg-red-50 border border-red-200 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Gagal memuat konfigurasi misi</p>
              <p className="text-xs text-red-600 mt-1.5">Terjadi kesalahan saat mengambil data. Coba muat ulang halaman.</p>
              <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-50" onClick={() => setDemoState("data")}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>

        <Card className="p-5 shadow-none">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-xs text-red-800"><strong>Konflik urutan terdeteksi:</strong> Misi PF_KD dan PF_JP memiliki urutan yang sama (2). Selesaikan konflik sebelum menyimpan.</p>
          </div>
        </Card>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Empty ─────────────────────────────────────────────────────────
  if (demoState === "empty") {
    return (
      <div className="space-y-5">
        <HeaderSection onPreview={() => setPreviewOpen(true)} onAdd={() => { setEditMission(null); setAddEditOpen(true); }} />
        <GlobalRulesPanel />
        <div className="space-y-3">
          {EMPTY_PERSONAS.map(p => (
            <PersonaCard
              key={p.id}
              persona={p}
              expanded={true}
              onToggle={() => {}}
              onAddMission={() => { setEditMission(null); setDefaultPersona(p.name); setAddEditOpen(true); }}
              onEditMission={() => {}}
              onDuplicateMission={() => {}}
              onDeactivateMission={() => {}}
              onDeleteMission={() => {}}
              onUserClick={() => {}}
            />
          ))}
        </div>
        <AddEditMissionDrawer open={addEditOpen} onClose={() => setAddEditOpen(false)} mission={editMission} defaultPersona={defaultPersona} />
        <PreviewJourneyModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Empty Filter ──────────────────────────────────────────────────
  if (demoState === "empty-filter") {
    return (
      <div className="space-y-5">
        <HeaderSection onPreview={() => setPreviewOpen(true)} onAdd={() => { setEditMission(null); setAddEditOpen(true); }} />
        <ToolbarSection
          search="rencana karier semester 5" onSearchChange={() => {}}
          filterPersona="builder" onFilterPersonaChange={() => {}}
          filterKategori="Wajib" onFilterKategoriChange={() => {}}
          filterStatus="semua" onFilterStatusChange={() => {}}
        />
        <div className="text-xs text-muted-foreground px-1">
          Filter aktif: Persona Builder, Kategori Wajib.{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setDemoState("data")}>Reset filter</Button>
        </div>
        <div className="space-y-3">
          {EMPTY_PERSONAS.map(p => (
            <PersonaCard
              key={p.id}
              persona={{ ...p, missions: [] }}
              expanded={p.id === "builder"}
              onToggle={() => {}}
              onAddMission={() => { setEditMission(null); setDefaultPersona(p.name); setAddEditOpen(true); }}
              onEditMission={() => {}}
              onDuplicateMission={() => {}}
              onDeactivateMission={() => {}}
              onDeleteMission={() => {}}
              onUserClick={() => {}}
            />
          ))}
        </div>
        <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
      </div>
    );
  }

  // ─── Data (default) ────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Callout */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1.5">Catatan Penting</p>
        <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
          <li>Sistem menggunakan satu urutan fase global: Pathfinder → Builder → Achiever.</li>
          <li>Perubahan konfigurasi hanya berlaku untuk journey yang belum dibentuk.</li>
          <li>Perubahan urutan, kategori, atau status perlu dilakukan hati-hati.</li>
        </ul>
      </div>

      <HeaderSection onPreview={() => setPreviewOpen(true)} onAdd={() => { setEditMission(null); setDefaultPersona("Pathfinder"); setAddEditOpen(true); }} />

      <GlobalRulesPanel />

      <ToolbarSection
        search={search} onSearchChange={setSearch}
        filterPersona={filterPersona} onFilterPersonaChange={setFilterPersona}
        filterKategori={filterKategori} onFilterKategoriChange={setFilterKategori}
        filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}
      />

      {hasActiveFilter && (
        <div className="text-xs text-muted-foreground px-1">
          Menampilkan {filteredPersonas.length} persona sesuai filter.{" "}
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetFilters}>Reset filter</Button>
        </div>
      )}

      {/* Persona Cards */}
      <div className="space-y-3">
        {filteredPersonas.map(p => {
          const filtered = filterMissions(p.missions);
          return (
            <PersonaCard
              key={p.id}
              persona={{ ...p, missions: filtered }}
              expanded={expandedPersonas.includes(p.id)}
              onToggle={() => togglePersona(p.id)}
              onAddMission={() => { setEditMission(null); setDefaultPersona(p.name); setAddEditOpen(true); }}
              onEditMission={m => { setEditMission(m); setDefaultPersona(p.name); setAddEditOpen(true); }}
              onDuplicateMission={m => {
                setEditMission({ ...m, code: m.code + "_COPY", status: "Nonaktif", no: p.missions.length + 1 });
                setDefaultPersona(p.name);
                setAddEditOpen(true);
              }}
              onDeactivateMission={m => { setDeactivateMission(m); setDeactivateOpen(true); }}
              onDeleteMission={m => { setDeleteMission(m); setDeleteOpen(true); }}
              onUserClick={m => { setUserListMission(m); setUserListOpen(true); }}
            />
          );
        })}
      </div>

      {/* Drawers & Modals */}
      <AddEditMissionDrawer open={addEditOpen} onClose={() => { setAddEditOpen(false); setEditMission(null); }} mission={editMission} defaultPersona={defaultPersona} />
      <UserListDrawer open={userListOpen} onClose={() => setUserListOpen(false)} mission={userListMission} />
      <DeleteMissionModal open={deleteOpen} onClose={() => setDeleteOpen(false)} mission={deleteMission} />
      <DeactivateMissionModal open={deactivateOpen} onClose={() => setDeactivateOpen(false)} mission={deactivateMission} />
      <PreviewJourneyModal open={previewOpen} onClose={() => setPreviewOpen(false)} />

      <DemoStateFAB currentState={demoState} onStateChange={setDemoState} />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────
function HeaderSection({ onPreview, onAdd }: { onPreview: () => void; onAdd: () => void }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-bold text-foreground">Konfigurasi Journey Persona</h2>
        <p className="text-xs text-muted-foreground mt-1">Kelola daftar misi dan aturan dasar journey Persona REXTRA.</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Preview Journey
        </Button>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Tambah Misi
        </Button>
      </div>
    </div>
  );
}

function ToolbarSection({
  search, onSearchChange,
  filterPersona, onFilterPersonaChange,
  filterKategori, onFilterKategoriChange,
  filterStatus, onFilterStatusChange,
}: {
  search: string; onSearchChange: (v: string) => void;
  filterPersona: string; onFilterPersonaChange: (v: string) => void;
  filterKategori: string; onFilterKategoriChange: (v: string) => void;
  filterStatus: string; onFilterStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="h-9 text-sm pl-9" placeholder="Cari misi berdasarkan nama, kode, atau fitur..." value={search} onChange={e => onSearchChange(e.target.value)} />
      </div>
      <Select value={filterPersona} onValueChange={onFilterPersonaChange}>
        <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Persona</SelectItem>
          <SelectItem value="pathfinder">Pathfinder</SelectItem>
          <SelectItem value="builder">Builder</SelectItem>
          <SelectItem value="achiever">Achiever</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterKategori} onValueChange={onFilterKategoriChange}>
        <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Kategori</SelectItem>
          <SelectItem value="Wajib">Wajib</SelectItem>
          <SelectItem value="Dianjurkan">Dianjurkan</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Status</SelectItem>
          <SelectItem value="Aktif">Aktif</SelectItem>
          <SelectItem value="Nonaktif">Nonaktif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
