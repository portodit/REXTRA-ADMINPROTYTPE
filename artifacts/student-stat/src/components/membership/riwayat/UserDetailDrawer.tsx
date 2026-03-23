import { MemberUser } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, Gift, Lock, ArrowRight, 
  ShoppingCart, TrendingUp, TrendingDown, Play, XCircle, RotateCcw
} from "lucide-react";
import { generateMockJourneyEvents } from "./mockData";
import { useMemo } from "react";
import { CategoryBadge, TierBadge } from "./StatusBadges";

// Import emblem assets
import emblemStarter from "@/assets/emblem-starter.png";
import emblemBasic from "@/assets/emblem-basic.png";
import emblemPro from "@/assets/emblem-pro.png";
import emblemMax from "@/assets/emblem-max.png";

interface UserDetailDrawerProps {
  user: MemberUser | null;
  open: boolean;
  onClose: () => void;
}

const tierEmblems: Record<string, string> = {
  Max: emblemMax.src,
  Pro: emblemPro.src,
  Basic: emblemBasic.src,
  Starter: emblemStarter.src,
  Standard: emblemStarter.src,
};

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  Max: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Pro: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Basic: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Starter: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Standard: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

const eventIcons: Record<string, React.ElementType> = {
  "First Purchase": ShoppingCart,
  "Renewal": RotateCcw,
  "Upgrade": TrendingUp,
  "Downgrade": TrendingDown,
  "Trial Start": Play,
  "Expired": XCircle,
};

export function UserDetailDrawer({ user, open, onClose }: UserDetailDrawerProps) {
  const journeyEvents = useMemo(() => 
    user ? generateMockJourneyEvents(user.id) : [], 
    [user]
  );

  const summaryStats = useMemo(() => {
    if (!journeyEvents.length) return { totalPurchase: 0, totalDuration: 0, transactionCount: 0 };
    
    const purchaseEvents = journeyEvents.filter(e => !e.isFuture && e.total !== undefined);
    const totalPurchase = purchaseEvents.reduce((sum, e) => sum + (e.total || 0), 0);
    const totalDuration = purchaseEvents.reduce((sum, e) => {
      const durationMatch = e.duration?.match(/(\d+)/);
      return sum + (durationMatch ? parseInt(durationMatch[1]) : 0);
    }, 0);
    
    return { totalPurchase, totalDuration, transactionCount: purchaseEvents.length };
  }, [journeyEvents]);

  if (!user) return null;

  const tierColor = tierColors[user.tier] || tierColors.Standard;
  const tierEmblem = tierEmblems[user.tier] || emblemStarter.src;

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  const getCountdownText = () => {
    if (user.tier === "Standard" && !user.endDate) return "Tanpa masa berlaku";
    if (user.validityStatus === "Berakhir") return `Berakhir ${Math.abs(user.remainingDays)} hari lalu`;
    if (user.validityStatus === "Akan berakhir") return `Sisa ${user.remainingDays} hari`;
    return `Sisa ${user.remainingDays} hari`;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 md:p-6 border-b border-border">
          <SheetTitle className="text-left text-lg">Detail Status Membership</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="current" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto w-full justify-start shrink-0 px-4 md:px-6">
            <TabsTrigger
              value="current"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Membership Terkini
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
            >
              Riwayat Membership
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* TAB 1: Membership Terkini */}
            <TabsContent value="current" className="mt-0 p-4 md:p-6 space-y-5">
              {/* STATUS MEMBERSHIP TERKINI */}
              <section className="relative border border-border/60 rounded-xl p-4 space-y-4">
                <div className="absolute -top-2 -right-2">
                  <CategoryBadge category={user.category} />
                </div>
                
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  STATUS MEMBERSHIP TERKINI
                </h3>
                
                {/* Tier Display with Emblem */}
                <div className={`flex items-center gap-4 p-3 rounded-xl ${tierColor.bg} ${tierColor.border} border`}>
                  <img 
                    src={tierEmblem} 
                    alt={user.tier} 
                    className="h-12 w-12 object-contain drop-shadow-md"
                  />
                  <div className="flex-1">
                    <span className={`text-lg font-bold ${tierColor.text}`}>{user.tier}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.name} • {user.email}</p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="text-[10px] text-muted-foreground uppercase">Bergabung</p>
                    <p className="font-medium text-xs">{user.startDate.toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    user.validityStatus === "Berakhir" ? "bg-destructive/5" :
                    user.validityStatus === "Akan berakhir" ? "bg-warning/5" :
                    "bg-muted/30"
                  }`}>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {user.validityStatus === "Berakhir" ? "Berakhir" : "Berakhir"}
                    </p>
                    <p className={`font-medium text-xs ${
                      user.validityStatus === "Berakhir" ? "text-destructive" :
                      user.validityStatus === "Akan berakhir" ? "text-warning" :
                      "text-foreground"
                    }`}>
                      {user.endDate ? user.endDate.toLocaleDateString("id-ID") : "Tidak terbatas"}
                    </p>
                  </div>
                </div>

                {/* Countdown */}
                <p className={`text-sm font-semibold ${
                  user.validityStatus === "Berakhir" ? "text-destructive" :
                  user.validityStatus === "Akan berakhir" ? "text-warning" :
                  "text-muted-foreground"
                }`}>
                  {getCountdownText()}
                </p>
              </section>

              {/* BENEFIT STATUS MEMBERSHIP */}
              <section className="border border-border/60 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  BENEFIT STATUS MEMBERSHIP
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-bold text-lg">{user.tokenBalance.toLocaleString("id-ID")}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Token</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-bold text-lg">{user.pointsBalance.toLocaleString("id-ID")}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Poin</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-bold text-lg">{user.entitlementCount}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Akses</p>
                  </div>
                </div>
              </section>

              {/* RINGKASAN */}
              <section className="border border-border/60 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  RINGKASAN MEMBERSHIP
                </h3>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="font-bold text-lg">{summaryStats.transactionCount}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Transaksi</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="font-bold text-lg">{summaryStats.totalDuration}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Total Bulan</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg">
                    <p className="font-bold text-xs">{formatCurrency(summaryStats.totalPurchase)}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Total Bayar</p>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* TAB 2: Riwayat Membership */}
            <TabsContent value="history" className="mt-0 p-4 md:p-6 space-y-4">
              <div className="relative pl-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-border" />
                
                {journeyEvents.map((event) => {
                  const EventIcon = eventIcons[event.title.split(" ")[0] + " " + (event.title.split(" ")[1] || "")] || ShoppingCart;
                  return (
                    <div key={event.id} className="relative pb-4 last:pb-0">
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                        event.isFuture 
                          ? 'bg-muted border-2 border-border' 
                          : 'bg-primary shadow-sm shadow-primary/30'
                      }`}>
                        {!event.isFuture && <EventIcon className="h-2 w-2 text-primary-foreground" />}
                      </div>

                      <div className={`ml-2 p-3 rounded-lg border ${
                        event.isFuture 
                          ? 'bg-muted/30 border-dashed border-muted-foreground/30' 
                          : 'bg-card border-border/50'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium text-sm ${event.isFuture ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {event.title}
                          </p>
                          {event.total && !event.isFuture && (
                            <span className="text-xs font-semibold text-primary shrink-0">{formatCurrency(event.total)}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">
                            {event.date.toLocaleDateString("id-ID")}
                          </span>
                          {!event.isFuture && (
                            <div className="flex items-center gap-1">
                              <TierBadge tier={event.statusBefore} size="sm" />
                              <ArrowRight className="h-2 w-2 text-muted-foreground" />
                              <TierBadge tier={event.statusAfter} size="sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
