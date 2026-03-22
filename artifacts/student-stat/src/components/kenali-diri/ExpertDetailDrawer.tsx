import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Award, MessageSquare, AlertTriangle, Star, Target, Brain, TrendingUp, Calendar, Briefcase, GraduationCap, Building } from "lucide-react";

interface ExpertFeedback {
  id: string;
  nama: string;
  profesi: string;
  gelar?: string;
  pengalamanTahun?: number;
  pendidikanTerakhir?: string;
  perguruanTinggi?: string;
  programStudi?: string;
  kategoriTes: string;
  top5Recommendations: string[];
  topNStatus: "P1" | "P2" | "P3-5" | "Tidak muncul";
  akurasi: number;
  logika: number;
  manfaat: number;
  kendala: string[];
  masukan: string;
  tanggal: string;
}

interface ExpertDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: ExpertFeedback | null;
}

export function ExpertDetailDrawer({ open, onOpenChange, feedback }: ExpertDetailDrawerProps) {
  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 6) return "bg-success/15 text-success border-success/30";
    if (score >= 4) return "bg-warning/15 text-warning border-warning/30";
    return "bg-destructive/15 text-destructive border-destructive/30";
  };

  const getTopNColor = (status: string) => {
    switch (status) {
      case "P1":
        return "bg-success/15 text-success border-success/30";
      case "P2":
        return "bg-blue-500/15 text-blue-600 border-blue-500/30";
      case "P3-5":
        return "bg-amber-500/15 text-amber-600 border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatPendidikan = (pendidikan?: string) => {
    switch (pendidikan) {
      case "S1":
        return "Sarjana (S1)";
      case "S2":
        return "Magister (S2)";
      case "S3":
        return "Doktor (S3)";
      case "D3":
        return "Diploma III (D3)";
      case "D4":
        return "Diploma IV (D4)";
      default:
        return pendidikan || "-";
    }
  };

  const formatPengalaman = (tahun?: number) => {
    if (!tahun) return "-";
    if (tahun < 3) return `${tahun} tahun (< 3 tahun)`;
    if (tahun <= 5) return `${tahun} tahun (3–5 tahun)`;
    if (tahun <= 10) return `${tahun} tahun (6–10 tahun)`;
    return `${tahun} tahun (> 10 tahun)`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              Detail Feedback Expert
            </SheetTitle>
          </SheetHeader>
          <Separator />
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-5">
            {/* Section 1: Identitas Responden */}
            <section className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <User className="h-4 w-4 text-primary" />
                Identitas Responden
              </h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {/* ID Feedback */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Feedback</p>
                  <p className="font-mono font-semibold text-foreground bg-muted/50 px-2 py-1 rounded inline-block">{feedback.id}</p>
                </div>
                
                {/* Tanggal */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Tanggal
                  </p>
                  <p className="text-foreground font-medium">{feedback.tanggal}</p>
                </div>
                
                {/* Nama Expert */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Expert</p>
                  <p className="font-semibold text-foreground">{feedback.nama}</p>
                </div>
                
                {/* Profesi */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    Profesi
                  </p>
                  <p className="text-foreground">{feedback.profesi}</p>
                </div>
                
                {/* Gelar */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gelar</p>
                  <p className="text-foreground">{feedback.gelar || "-"}</p>
                </div>
                
                {/* Pengalaman */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pengalaman</p>
                  <Badge variant="secondary" className="font-medium text-xs">
                    {formatPengalaman(feedback.pengalamanTahun)}
                  </Badge>
                </div>
                
                {/* Pendidikan Terakhir */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    Pendidikan Terakhir
                  </p>
                  <Badge variant="secondary" className="font-medium text-xs">
                    {formatPendidikan(feedback.pendidikanTerakhir)}
                  </Badge>
                </div>
                
                {/* Perguruan Tinggi */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Perguruan Tinggi
                  </p>
                  <p className="text-foreground">{feedback.perguruanTinggi || "-"}</p>
                </div>
                
                {/* Program Studi - Full Width */}
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Program Studi</p>
                  <p className="text-foreground">{feedback.programStudi || "-"}</p>
                </div>
                
                {/* Kategori Tes - Full Width with Badge */}
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kategori Tes</p>
                  <Badge className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/15 font-medium">
                    {feedback.kategoriTes}
                  </Badge>
                </div>
              </div>
            </section>

            {/* Section 2: 5 Rekomendasi Profesi Teratas */}
            <section className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                  <Award className="h-4 w-4 text-primary" />
                  5 Rekomendasi Profesi Teratas
                </h3>
                <Badge className={`${getTopNColor(feedback.topNStatus)} font-semibold px-3`}>
                  {feedback.topNStatus}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {feedback.top5Recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors"
                  >
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
                      index === 0 
                        ? "bg-primary text-primary-foreground" 
                        : index === 1 
                          ? "bg-primary/60 text-primary-foreground"
                          : "bg-primary/20 text-primary"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Penilaian Likert (1-7) */}
            <section className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <Star className="h-4 w-4 text-primary" />
                Penilaian Likert (1–7)
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Akurasi Profil */}
                <div className="p-4 rounded-lg bg-muted/40 border border-border/50 text-center space-y-2.5 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Target className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Akurasi Profil</p>
                  <Badge className={`${getScoreColor(feedback.akurasi)} text-base font-bold px-4 py-1.5`}>
                    {feedback.akurasi}/7
                  </Badge>
                </div>
                
                {/* Logika Penjelasan */}
                <div className="p-4 rounded-lg bg-muted/40 border border-border/50 text-center space-y-2.5 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Brain className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Logika Penjelasan</p>
                  <Badge className={`${getScoreColor(feedback.logika)} text-base font-bold px-4 py-1.5`}>
                    {feedback.logika}/7
                  </Badge>
                </div>
                
                {/* Potensi Manfaat */}
                <div className="p-4 rounded-lg bg-muted/40 border border-border/50 text-center space-y-2.5 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Potensi Manfaat</p>
                  <Badge className={`${getScoreColor(feedback.manfaat)} text-base font-bold px-4 py-1.5`}>
                    {feedback.manfaat}/7
                  </Badge>
                </div>
              </div>
            </section>

            {/* Section 4: Kendala yang Dilaporkan */}
            <section className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Kendala yang Dilaporkan
              </h3>
              
              {feedback.kendala.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {feedback.kendala.map((k, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="text-xs bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 py-1.5 px-3"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <p className="text-sm text-success font-medium">
                    Tidak ada kendala dilaporkan
                  </p>
                </div>
              )}
            </section>

            {/* Section 5: Masukan / Saran Perbaikan */}
            <section className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <MessageSquare className="h-4 w-4 text-primary" />
                Masukan / Saran Perbaikan
              </h3>
              
              {feedback.masukan ? (
                <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {feedback.masukan}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground italic">
                    Tidak ada masukan tertulis.
                  </p>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}