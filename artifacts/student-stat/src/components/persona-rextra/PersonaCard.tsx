import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MissionTable } from "./MissionTable";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonaData, Mission } from "./mockData";

interface PersonaCardProps {
  persona: PersonaData;
  expanded: boolean;
  onToggle: () => void;
  onAddMission: () => void;
  onEditMission: (m: Mission) => void;
  onDuplicateMission: (m: Mission) => void;
  onDeactivateMission: (m: Mission) => void;
  onDeleteMission: (m: Mission) => void;
  onUserClick: (m: Mission) => void;
}

const PERSONA_ICONS: Record<string, string> = {
  Pathfinder: "🧭",
  Builder: "🔨",
  Achiever: "🏆",
};

export function PersonaCard({
  persona, expanded, onToggle, onAddMission,
  onEditMission, onDuplicateMission, onDeactivateMission, onDeleteMission, onUserClick,
}: PersonaCardProps) {
  const wajibCount = persona.missions.filter(m => m.kategori === "Wajib").length;
  const dianjurkanCount = persona.missions.filter(m => m.kategori === "Dianjurkan").length;

  return (
    <Card className="border-border/50 overflow-hidden shadow-none gap-0 py-0">
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className="w-full flex items-center justify-between p-5 bg-muted/30 hover:bg-muted/50 transition-colors text-left cursor-pointer select-none"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{PERSONA_ICONS[persona.name] || "📌"}</span>
            <h3 className="text-base font-bold text-foreground">{persona.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground ml-8">{persona.description}</p>
          <div className="flex gap-4 text-xs text-muted-foreground ml-8">
            <span>Total misi: <strong className="text-foreground">{persona.missions.length}</strong></span>
            <span>Wajib: <strong className="text-foreground">{wajibCount}</strong></span>
            <span>Dianjurkan: <strong className="text-foreground">{dianjurkanCount}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={e => { e.stopPropagation(); onAddMission(); }}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Tambah Misi
          </Button>
          {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>

      {/* Body */}
      <div className={cn("transition-all duration-300 overflow-hidden", expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0")}>
        {persona.missions.length > 0 ? (
          <MissionTable
            missions={persona.missions}
            onEdit={onEditMission}
            onDuplicate={onDuplicateMission}
            onDeactivate={onDeactivateMission}
            onDelete={onDeleteMission}
            onUserClick={onUserClick}
          />
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-foreground mb-1">Belum ada misi untuk {persona.name}</p>
            <p className="text-xs text-muted-foreground mb-4">Tambahkan misi pertama untuk mulai membentuk journey pada fase ini.</p>
            <Button size="sm" onClick={onAddMission}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Misi
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
