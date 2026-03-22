import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Zap, Star, Settings, Play, Users } from "lucide-react";

export type PackageStatus = "draft" | "aktif" | "nonaktif";

export interface MembershipPackage {
  id: string;
  name: string;
  category: "paid" | "unpaid";
  status: PackageStatus;
  emblem: string;
  price: number | null;
  tokenPerMonth: number | null;
  pointsActive: boolean;
  pointsValue: number | null;
  description: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  activeUsers: number;
}

export interface PlanDurationSummary {
  id: string;
  duration_months: number;
  is_active: boolean | null;
  token_amount: number | null;
  bonus_token: number | null;
  price: number | null;
  final_price: number | null;
  points_value: number | null;
  points_active: boolean | null;
  bonus_points: number | null;
  mapping_count?: number;
}

interface MembershipStatusCardProps {
  pkg: MembershipPackage;
  durations?: PlanDurationSummary[];
  onSelect: () => void;
  onActivate?: () => void;
  isSelected?: boolean;
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  draft: { label: "Draft", dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground" },
  aktif: { label: "Aktif", dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  nonaktif: { label: "Nonaktif", dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive" },
};

function formatRange(values: number[]): string {
  if (values.length === 0) return "-";
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return String(min);
  return `${min}–${max}`;
}

/** Check if a single duration is "complete" (price, token, points, AND access mappings) */
function isDurationComplete(d: PlanDurationSummary, isPaid: boolean): boolean {
  const hasPrice = isPaid ? (d.price !== null && d.price > 0) : true;
  const hasToken = d.token_amount !== null && d.token_amount > 0;
  const hasPoints = d.points_active ? (d.points_value !== null && d.points_value > 0) : true;
  const hasMappings = (d.mapping_count ?? 0) > 0;
  return hasPrice && hasToken && hasPoints && hasMappings;
}

export function MembershipStatusCard({ pkg, durations = [], onSelect, onActivate }: MembershipStatusCardProps) {
  const isPaid = pkg.category === "paid";
  const isFreeTier = pkg.category === "unpaid";

  // Duration stats (only ON durations)
  const activeDurations = durations.filter(d => d.is_active);
  const totalActive = activeDurations.length;
  const durationsComplete = activeDurations.filter(d => isDurationComplete(d, isPaid)).length;
  const allComplete = totalActive > 0 && durationsComplete === totalActive;

  // Token & points ranges (only from ON durations)
  const tokenValues = activeDurations.map(d => (d.token_amount || 0) + (d.bonus_token || 0)).filter(v => v > 0);
  const pointValues = activeDurations
    .filter(d => d.points_active)
    .map(d => (d.points_value || 0) + (d.bonus_points || 0))
    .filter(v => v > 0);

  const sc = statusConfig[pkg.status] || statusConfig.draft;

  const tierLabel = pkg.id === "starter" ? "TRIAL CLUB" : isPaid ? "REXTRA CLUB" : "NON CLUB";

  const formatPrice = (price: number | null) => {
    if (!isPaid) return "Gratis";
    if (price === null || price === 0) return null;
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const priceDisplay = formatPrice(pkg.price);
  const tokenDisplay = tokenValues.length > 0 ? `${formatRange(tokenValues)} token` : "-";
  const pointsDisplay = pointValues.length > 0 ? `${formatRange(pointValues)} poin` : "-";

  const isNonaktif = pkg.status === "nonaktif";

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl border p-5 cursor-pointer transition-all duration-300 flex flex-col",
        "bg-card border-border",
        "hover:bg-primary/5 hover:border-primary/40 hover:shadow-md",
      )}
      onClick={onSelect}
    >
      {/* Status Badge + Tier Label */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", sc.bg, sc.text)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot, pkg.status === "aktif" && "animate-pulse")} />
          {sc.label}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tierLabel}
        </span>
      </div>

      {/* Emblem + Name + Price */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative shrink-0">
          <img src={pkg.emblem} alt={pkg.name} className="h-12 w-12 object-contain drop-shadow-md" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-foreground truncate">{pkg.name}</h4>
          <div className="mt-0.5">
            {!isPaid ? (
              <span className="text-sm font-semibold text-success">Gratis</span>
            ) : priceDisplay ? (
              <span className="text-sm font-semibold text-foreground">
                {priceDisplay}
                <span className="text-xs font-normal text-muted-foreground"> /bulan</span>
              </span>
            ) : (
              <span className="text-sm italic text-muted-foreground">(Belum diset)</span>
            )}
          </div>
        </div>
      </div>

      {/* Token + Poin range (premium only) */}
      {!isFreeTier && (
        <div className="mb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {tokenDisplay}
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3" />
              {pointsDisplay}
            </span>
          </div>
        </div>
      )}

      {/* Config status badge (premium only) */}
      {!isFreeTier && (
        <div className="mb-4">
          {totalActive === 0 ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[11px] font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              Belum ada durasi aktif
            </div>
          ) : allComplete ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/10 text-success text-[11px] font-medium">
              <Check className="h-3.5 w-3.5" />
              Semua durasi siap ({totalActive}/{totalActive})
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-warning/10 text-warning text-[11px] font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              {durationsComplete} dari {totalActive} durasi siap
            </div>
          )}
        </div>
      )}

      {/* User count */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {pkg.activeUsers.toLocaleString("id-ID")} pengguna
        </span>
      </div>

      {/* CTA - pushed to bottom */}
      <div className="flex gap-2 mt-auto pt-2">
        {isNonaktif ? (
          <>
            <Button
              size="sm"
              className="flex-1 gap-2 font-semibold"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
              <Settings className="h-3.5 w-3.5" />
              Kelola Paket
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onActivate?.();
              }}
            >
              <Play className="h-3.5 w-3.5" />
              Aktifkan
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="w-full gap-2 font-semibold"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            <Settings className="h-3.5 w-3.5" />
            Kelola Paket
          </Button>
        )}
      </div>
    </div>
  );
}

/** Utility: check if a plan can be activated (at least 1 complete duration) */
export function canActivatePlan(durations: PlanDurationSummary[], isPaid: boolean): boolean {
  const active = durations.filter(d => d.is_active);
  if (active.length === 0) return false;
  return active.some(d => isDurationComplete(d, isPaid));
}
