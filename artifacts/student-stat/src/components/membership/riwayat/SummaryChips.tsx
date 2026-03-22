import { Users, Crown, Zap, UserX, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SummaryData {
  totalUsers: number;
  rextraClub: number;
  trialClub: number;
  nonClub: number;
  expiring: number;
}

type SummaryFilter = "all" | "REXTRA Club" | "Trial Club" | "Non-Club" | "expiring";

interface SummaryChipsProps {
  data?: SummaryData;
  isLoading?: boolean;
  activeFilter?: SummaryFilter;
  onFilterClick?: (filter: SummaryFilter) => void;
}

export type { SummaryData, SummaryFilter };

export function SummaryChips({ data, isLoading, activeFilter, onFilterClick }: SummaryChipsProps) {
  const chips: { label: string; value: number; icon: typeof Users; filter: SummaryFilter; bgColor: string; iconColor: string; activeBorder: string }[] = [
    {
      label: "Total Pengguna",
      value: data?.totalUsers ?? 0,
      icon: Users,
      filter: "all",
      bgColor: "bg-muted/40",
      iconColor: "text-muted-foreground",
      activeBorder: "border-primary",
    },
    {
      label: "REXTRA Club",
      value: data?.rextraClub ?? 0,
      icon: Crown,
      filter: "REXTRA Club",
      bgColor: "bg-success/5",
      iconColor: "text-success",
      activeBorder: "border-success",
    },
    {
      label: "Trial Club",
      value: data?.trialClub ?? 0,
      icon: Zap,
      filter: "Trial Club",
      bgColor: "bg-primary/5",
      iconColor: "text-primary",
      activeBorder: "border-primary",
    },
    {
      label: "Non-Club",
      value: data?.nonClub ?? 0,
      icon: UserX,
      filter: "Non-Club",
      bgColor: "bg-muted/40",
      iconColor: "text-muted-foreground",
      activeBorder: "border-muted-foreground",
    },
    {
      label: "Akan berakhir ≤7 hari",
      value: data?.expiring ?? 0,
      icon: AlertTriangle,
      filter: "expiring",
      bgColor: "bg-warning/5",
      iconColor: "text-warning",
      activeBorder: "border-warning",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {chips.map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.filter;
        return (
          <button
            key={chip.label}
            type="button"
            onClick={() => onFilterClick?.(chip.filter)}
            className={cn(
              "rounded-xl p-3 md:p-4 border text-left transition-all duration-200 cursor-pointer",
              chip.bgColor,
              isActive
                ? `${chip.activeBorder} border-2 shadow-sm`
                : "border-border/50 hover:border-border hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <chip.icon className={`h-4 w-4 ${chip.iconColor}`} />
              <span className="text-xs font-medium text-muted-foreground truncate">
                {chip.label}
              </span>
            </div>
            <p className="text-lg md:text-xl font-semibold text-foreground">
              {chip.value.toLocaleString("id-ID")}
            </p>
          </button>
        );
      })}
    </div>
  );
}
