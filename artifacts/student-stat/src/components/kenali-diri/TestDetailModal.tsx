import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Hash,
  User,
  Clock,
  CheckCircle,
  Award,
  X,
  Heart,
  Star,
  Globe,
  DollarSign,
  Check,
  Circle,
  Activity,
  Target,
} from "lucide-react";

interface TestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testData?: {
    id: string;
    userName: string;
    startTime: string;
    endTime: string;
    status: "Selesai" | "Sedang Berjalan" | "Dihentikan";
    result: string;
  };
}

const riasecData = [
  { type: "Realistic", score: 85, rank: 1 },
  { type: "Investigative", score: 78, rank: 2 },
  { type: "Artistic", score: 72, rank: 3 },
  { type: "Social", score: 65, rank: 4 },
  { type: "Enterprising", score: 58, rank: 5 },
  { type: "Conventional", score: 45, rank: 6 },
];

const ikigaiData = [
  {
    icon: Heart,
    title: "Love (Minat)",
    description: "Kamu paling antusias saat membuat sesuatu yang visual dan interaktif, terutama desain produk digital.",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    icon: Star,
    title: "Good At (Keahlian)",
    description: "Kekuatan utamamu ada pada analisis informasi teknis dan menerjemahkannya menjadi konsep visual.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    icon: Globe,
    title: "Needs (Kebutuhan Pasar)",
    description: "Industri butuh jembatan antara coding yang rumit dengan tampilan UI yang ramah pengguna.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    icon: DollarSign,
    title: "Paid (Nilai Ekonomi)",
    description: "Skill prototyping dan logika teknismu punya bayaran tinggi di sektor Tech Startup.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
];

const recommendationData = [
  {
    rank: 1,
    title: "UI/UX Designer",
    matchPercent: 94,
    description: "Profesi ini mengakomodasi minat Artistic (Desain) dan Investigative (Riset User), serta sangat dibutuhkan di pasar saat ini.",
    isSelected: true,
  },
  {
    rank: 2,
    title: "Frontend Developer",
    matchPercent: 88,
    description: "Cocok dengan sisi Realistic (Coding) dan Investigative, namun aspek Love sedikit lebih rendah dibandingkan UI/UX.",
    isSelected: false,
  },
];

export function TestDetailModal({
  open,
  onOpenChange,
  testData = {
    id: "PK1",
    userName: "Adhitya Pratama",
    startTime: "10.00 WIB 10 Desember 2025",
    endTime: "11.00 WIB 10 Desember 2025",
    status: "Selesai",
    result: "Profil Kode RIA",
  },
}: TestDetailModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "Sedang Berjalan":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "Dihentikan":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-300 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-900 border-0 font-bold">
            #{rank}
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-slate-300 to-gray-400 text-slate-800 border-0 font-bold">
            #{rank}
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-orange-300 to-amber-500 text-orange-900 border-0 font-bold">
            #{rank}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium">
            #{rank}
          </Badge>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-card p-4 sm:p-6">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-lg sm:text-xl font-bold text-foreground">
            Detail Hasil Tes Profil Karier
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm text-muted-foreground">
            Menampilkan data hasil tes Profil Karier pengguna.
          </SheetDescription>
        </SheetHeader>

        {/* Section: Informasi Umum - Vertical 5 rows x 2 columns */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Informasi Umum
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border/50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="text-xs sm:text-sm">ID Tes</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground pl-6 sm:pl-0">{testData.id}</span>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border/50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Nama Pengguna</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground pl-6 sm:pl-0">{testData.userName}</span>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border/50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Waktu Mulai</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground pl-6 sm:pl-0">{testData.startTime}</span>
            </div>

            {/* Row 4 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border/50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Waktu Selesai</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground pl-6 sm:pl-0">{testData.endTime}</span>
            </div>

            {/* Row 5 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border/50 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Status Tes</span>
              </div>
              <div className="pl-6 sm:pl-0">{getStatusBadge(testData.status)}</div>
            </div>

            {/* Row 6 */}
            <div className="flex flex-col sm:flex-row sm:items-center py-2 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Hasil Tes</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-primary pl-6 sm:pl-0">{testData.result}</span>
            </div>
          </div>
        </div>

        {/* Section: Detail Hasil Tes */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Detail Hasil Tes
          </h3>

          <Tabs defaultValue="riasec" className="w-full">
            <TabsList className="bg-transparent border-b border-border w-full justify-start gap-6 h-auto p-0 mb-6">
              <TabsTrigger
                value="riasec"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground"
              >
                RIASEC
              </TabsTrigger>
              <TabsTrigger
                value="ikigai"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground"
              >
                IKIGAI
              </TabsTrigger>
              <TabsTrigger
                value="rekomendasi"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground"
              >
                Rekomendasi
              </TabsTrigger>
            </TabsList>

            {/* Tab RIASEC */}
            <TabsContent value="riasec" className="space-y-4">
              {/* Section: Penilaian RIASEC */}
              <div className="p-5 rounded-md border border-[#cacaca]" style={{ borderWidth: '0.6px' }}>
                <h4 className="text-sm font-semibold text-foreground mb-2">Penilaian RIASEC</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Menampilkan skor dan peringkat untuk setiap tipe kepribadian RIASEC berdasarkan hasil tes pengguna.
                </p>
                
                <div className="rounded-md border border-[#cacaca] overflow-hidden" style={{ borderWidth: '0.6px' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Tipe Kepribadian</TableHead>
                        <TableHead className="font-semibold text-center">Nilai Skor</TableHead>
                        <TableHead className="font-semibold text-center">Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riasecData.map((item) => (
                        <TableRow key={item.type} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{item.type}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{item.score}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{getRankBadge(item.rank)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Section: Classification Type */}
              <div className="p-5 rounded-md border border-[#cacaca]" style={{ borderWidth: '0.6px' }}>
                <h4 className="text-sm font-semibold text-foreground mb-2">Classification Type</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Klasifikasi tipe kepribadian berdasarkan dominasi skor RIASEC.
                </p>
                
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-blue-100">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Triple</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Anda memiliki profil Kompleks (Triple), yang berarti fleksibilitas tinggi dalam peran teknis, analitis, dan kreatif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab IKIGAI */}
            <TabsContent value="ikigai" className="space-y-4">
              {/* Section: Hasil Analisis IKIGAI */}
              <div className="p-5 rounded-md border border-[#cacaca]" style={{ borderWidth: '0.6px' }}>
                <h4 className="text-sm font-semibold text-foreground mb-2">Hasil Analisis IKIGAI</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Menampilkan soft skill dan preferensi pribadi pengguna berdasarkan tes IKIGAI yang mencakup empat aspek utama.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ikigaiData.map((item) => (
                    <div
                      key={item.title}
                      className={`p-4 rounded-md border ${item.borderColor} ${item.bgColor} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md bg-white/80`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Rekomendasi */}
            <TabsContent value="rekomendasi" className="space-y-4">
              {/* Section: Rekomendasi Karier */}
              <div className="p-5 rounded-md border border-[#cacaca]" style={{ borderWidth: '0.6px' }}>
                <h4 className="text-sm font-semibold text-foreground mb-2">Rekomendasi Karier</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Dua rekomendasi profesi yang didasarkan pada hasil tes RIASEC dan IKIGAI pengguna.
                </p>
                
                <div className="space-y-4">
                  {recommendationData.map((rec) => (
                    <div
                      key={rec.rank}
                      className={`p-5 rounded-md border-2 transition-all hover:shadow-md ${
                        rec.isSelected
                          ? "border-emerald-400 bg-white"
                          : "border-[#cacaca] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-foreground">{rec.title}</h4>
                            <Badge
                              className={`${
                                rec.rank === 1
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {rec.matchPercent}% Match
                            </Badge>
                            {rec.rank === 1 && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border">
                        {rec.isSelected ? (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Dipilih sebagai Rencana Karier</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Circle className="h-4 w-4" />
                            <span className="text-sm">Tidak Dipilih</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
