import { MemberUser } from "./types";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { TierBadge, CategoryBadge } from "./StatusBadges";

// Import emblem assets
import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

interface UserCardProps {
  user: MemberUser;
  onViewDetail: (user: MemberUser) => void;
}

const tierEmblems: Record<string, string> = {
  Max: emblemMax.src,
  Pro: emblemPro.src,
  Basic: emblemBasic.src,
  Starter: emblemStarter.src,
  Standard: emblemStarter.src,
};

export function UserCard({ user, onViewDetail }: UserCardProps) {
  const emblem = tierEmblems[user.tier] || emblemStarter.src;

  const getCountdownText = () => {
    if (user.tier === "Standard" && !user.endDate) {
      return { text: "Tanpa masa berlaku", className: "text-muted-foreground" };
    }
    if (user.validityStatus === "Berakhir") {
      return { text: `Berakhir ${Math.abs(user.remainingDays)} hari lalu`, className: "text-destructive" };
    }
    if (user.validityStatus === "Akan berakhir") {
      return { text: `Sisa ${user.remainingDays} hari`, className: "text-warning" };
    }
    return { text: `Sisa ${user.remainingDays} hari`, className: "text-foreground" };
  };

  const countdown = getCountdownText();

  const getStatusBorderClass = () => {
    if (user.validityStatus === "Berakhir") return "border-destructive/30";
    if (user.validityStatus === "Akan berakhir") return "border-warning/30";
    return "border-border";
  };

  return (
    <div 
      className={`group relative bg-card border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col ${getStatusBorderClass()}`}
      onClick={() => onViewDetail(user)}
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Square Avatar + Identity + Tier Emblem */}
        <div className="flex items-start gap-3">
          {/* Square rounded avatar */}
          <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0 text-sm font-semibold text-muted-foreground">
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate leading-tight text-[15px]">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
          </div>
          
          {/* Tier Emblem */}
          <div className="shrink-0">
            <img 
              src={emblem} 
              alt={user.tier} 
              className="h-11 w-11 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* User ID */}
        <div className="mt-2">
          <span className="text-[10px] text-muted-foreground">User ID</span>
          <p className="text-xs font-mono text-muted-foreground">{user.userId}</p>
        </div>

        {/* Status Badges Row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <TierBadge tier={user.tier} />
          <CategoryBadge category={user.category} />
        </div>

        {/* Dates */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Bergabung:</span>
            <span className="text-foreground font-medium">{user.startDate.toLocaleDateString("id-ID")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Berakhir:</span>
            <span className="text-foreground font-medium">
              {user.endDate ? user.endDate.toLocaleDateString("id-ID") : "Tidak terbatas"}
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-3 flex items-center gap-2">
          <Clock className={`h-3.5 w-3.5 ${countdown.className}`} />
          <span className={`text-sm font-semibold ${countdown.className}`}>
            {countdown.text}
          </span>
        </div>

        {/* CTA Button - pushed to bottom */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(user);
          }}
        >
          Lihat Detail
        </Button>
      </div>
    </div>
  );
}
