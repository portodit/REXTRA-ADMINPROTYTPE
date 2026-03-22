import { cn } from "@/lib/utils";

const PERSONA_COLORS: Record<string, string> = {
  Pathfinder: "bg-violet-100 text-violet-800",
  Builder: "bg-blue-100 text-blue-800",
  Achiever: "bg-emerald-100 text-emerald-800",
};

const STATUS_COLORS: Record<string, string> = {
  Wajib: "bg-green-100 text-green-800",
  Dianjurkan: "bg-blue-100 text-blue-700",
  Aktif: "bg-green-100 text-green-800",
  Nonaktif: "bg-muted text-muted-foreground",
  Selesai: "bg-green-100 text-green-800",
  Berjalan: "bg-amber-100 text-amber-800",
  "Belum Mulai": "bg-muted text-muted-foreground",
  Tertahan: "bg-red-100 text-red-800",
  "Journey Selesai": "bg-green-100 text-green-800",
};

export function PersonaBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", PERSONA_COLORS[label] || "bg-muted text-muted-foreground", className)}>
      {label}
    </span>
  );
}

export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", STATUS_COLORS[label] || "bg-muted text-muted-foreground", className)}>
      {label}
    </span>
  );
}
