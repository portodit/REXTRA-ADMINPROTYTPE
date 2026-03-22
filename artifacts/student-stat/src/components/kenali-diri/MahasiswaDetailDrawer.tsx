import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Calendar,
  Star,
  AlertTriangle,
  MessageSquare,
  Hash,
} from "lucide-react";

interface MahasiswaFeedback {
  id: string;
  userName: string;
  kemudahanTes: number;
  relevansiRekomendasi: number;
  kepuasanFitur: number;
  kendala: string[];
  masukan?: string;
  tanggal?: string;
  email?: string;
  programStudi?: string;
  angkatan?: string;
  kategoriTes?: string;
}

interface MahasiswaDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: MahasiswaFeedback | null;
}

export function MahasiswaDetailDrawer({
  open,
  onOpenChange,
  feedback,
}: MahasiswaDetailDrawerProps) {
  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 6) return "bg-success/10 text-success border-success/20";
    if (score >= 4) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <SheetHeader className="p-5">
            <SheetTitle className="text-lg font-bold text-foreground">
              Detail Feedback Mahasiswa
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-5 pb-6">
          <div className="space-y-5 pt-4">
            {/* Section 1: Identitas Responden */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <User className="h-5 w-5 text-primary" />
                Identitas Responden
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Feedback</p>
                  <p className="font-mono text-sm text-foreground">{feedback.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {feedback.tanggal || "05 Des 2025"}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Nama Mahasiswa</p>
                  <p className="text-sm font-medium text-foreground">{feedback.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Program Studi</p>
                  <p className="text-sm text-foreground">{feedback.programStudi || "Teknik Informatika"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Angkatan</p>
                  <Badge variant="secondary" className="text-xs">
                    {feedback.angkatan || "2021"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Kategori Tes</p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {feedback.kategoriTes || "Tes Profil Karier"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Section 2: Penilaian Likert (1-7) */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Star className="h-5 w-5 text-primary" />
                Penilaian Likert (1–7)
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Kemudahan Tes */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Kemudahan Tes</p>
                  <Badge className={`${getScoreColor(feedback.kemudahanTes)} text-lg font-bold px-3 py-1`}>
                    {feedback.kemudahanTes}/7
                  </Badge>
                </div>
                
                {/* Relevansi Rekomendasi */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Relevansi Rekomendasi</p>
                  <Badge className={`${getScoreColor(feedback.relevansiRekomendasi)} text-lg font-bold px-3 py-1`}>
                    {feedback.relevansiRekomendasi}/7
                  </Badge>
                </div>
                
                {/* Kepuasan Fitur */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Kepuasan Fitur</p>
                  <Badge className={`${getScoreColor(feedback.kepuasanFitur)} text-lg font-bold px-3 py-1`}>
                    {feedback.kepuasanFitur}/7
                  </Badge>
                </div>
              </div>
            </div>

            {/* Section 3: Kendala yang Dilaporkan */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Kendala yang Dilaporkan
              </div>
              
              {feedback.kendala.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada kendala dilaporkan.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {feedback.kendala.map((k, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-destructive/10 text-destructive border-destructive/20"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Masukan / Saran Perbaikan */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card/50 p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <MessageSquare className="h-5 w-5 text-primary" />
                Masukan / Saran Perbaikan
              </div>
              
              {feedback.masukan ? (
                <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {feedback.masukan}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada masukan tertulis.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
