import { useRouter, useParams } from 'next/navigation'
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft, Edit, Building2, Landmark, Briefcase,
  Users, Star, MapPin, Mail, ExternalLink, Info,
  Eye as EyeIcon, Target, Trophy, FileText,
  ChevronDown, AlertCircle, RefreshCw, Bug, X,
  CheckCircle2, XCircle, ChevronUp, Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const tipeOrganisasiIcons: Record<string, React.ElementType> = {
  "Perusahaan Negara": Landmark,
  "Perusahaan Swasta": Building2,
  "Perusahaan Startup": Briefcase,
};

// Full mock data
const fullDetailData = {
  id: "3",
  nama: "PT Telekomunikasi Indonesia Tbk",
  namaLokal: "Telkom Indonesia",
  tipeOrganisasi: "Perusahaan Negara",
  sektorIndustri: "Technology",
  lokasi: "Bandung",
  diperbarui: "13 Jan 2026",
  logoUrl: null,
  ringkasan: {
    jumlahKaryawan: "± 24.000 karyawan",
    pesertaProgram: "3.500+ pengguna mengikuti program karier Telkom Indonesia",
    dreamCompany: "5.000+ pengguna menjadikan Telkom Indonesia sebagai perusahaan impian",
    alamat: "Jl. Japati No.1, Bandung, Indonesia",
    email: "corporate@telkom.co.id",
    website: "www.telkom.co.id",
  },
  tentang: [
    "PT Telkom Indonesia (Persero) Tbk merupakan perusahaan yang bergerak di bidang teknologi informasi dan telekomunikasi. Didirikan pada tahun 1965, Telkom Indonesia telah berkembang menjadi salah satu perusahaan telekomunikasi terbesar di Indonesia dengan cakupan layanan nasional dan internasional.",
    "Perusahaan menyediakan berbagai layanan seperti jaringan telekomunikasi, layanan internet broadband, solusi digital enterprise, serta layanan data center dan cloud computing. Telkom melayani segmen pasar individu, bisnis, hingga pemerintahan.",
    "Sebagai Badan Usaha Milik Negara (BUMN), Telkom Indonesia menjalankan operasionalnya dengan pendekatan transformasi digital yang berkelanjutan serta berorientasi pada penguatan infrastruktur nasional.",
  ],
  gambar: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
  ],
  visi: "Menjadi perusahaan digital telco pilihan utama untuk memajukan masyarakat.",
  misi: [
    "Mempercepat pembangunan infrastruktur dan platform digital",
    "Mengembangkan talenta digital yang kompeten",
    "Memberikan layanan terbaik bagi pelanggan",
    "Menciptakan nilai tambah bagi pemangku kepentingan",
  ],
  capaian: [
    { tahun: "2024", nama: "Forbes Global 2000", lembaga: "Forbes" },
    { tahun: "2023", nama: "Indonesia Best Employer Award", lembaga: "SWA Magazine" },
    { tahun: "2023", nama: "Great Place to Work Certified", lembaga: "GPTW Institute" },
    { tahun: "2022", nama: "Best Digital Transformation", lembaga: "IDC Indonesia" },
  ],
  dokumenPublik: [
    { nama: "Company Profile 2024", url: "https://telkom.co.id/company-profile-2024" },
    { nama: "Annual Report 2023", url: "https://telkom.co.id/annual-report-2023" },
    { nama: "Sustainability Report 2023", url: "https://telkom.co.id/sustainability-2023" },
    { nama: "Code of Conduct", url: "https://telkom.co.id/code-of-conduct" },
  ],
};

// Preset detail data at different completeness levels
const getDetailPreset = (level: number) => {
  const base = { ...fullDetailData };
  if (level === 100) return base;
  if (level === 75) return { ...base, gambar: [], dokumenPublik: [] };
  if (level === 50) return { ...base, gambar: [], visi: null, misi: [], dokumenPublik: [] };
  // 25%
  return {
    ...base,
    ringkasan: { ...base.ringkasan, pesertaProgram: null, dreamCompany: null, website: null },
    tentang: [],
    gambar: [],
    visi: null,
    misi: [],
    capaian: [],
    dokumenPublik: [],
  };
};

const kelengkapanSections = [
  { key: "ringkasan", label: "Ringkasan" },
  { key: "tentang", label: "Tentang" },
  { key: "gambar", label: "Visual" },
  { key: "visi", label: "Visi" },
  { key: "misi", label: "Misi" },
  { key: "capaian", label: "Capaian" },
  { key: "dokumen", label: "Dokumen" },
];

const calcKelengkapan = (data: any) => {
  const k = {
    ringkasan: !!(data.ringkasan?.jumlahKaryawan && data.ringkasan?.alamat && data.ringkasan?.email),
    tentang: data.tentang?.length > 0,
    gambar: data.gambar?.length > 0,
    visi: !!data.visi,
    misi: data.misi?.length > 0,
    capaian: data.capaian?.length > 0,
    dokumen: data.dokumenPublik?.length > 0,
  };
  const filled = Object.values(k).filter(Boolean).length;
  const persen = Math.round((filled / kelengkapanSections.length) * 100);
  const missing = kelengkapanSections.filter(s => !k[s.key as keyof typeof k]);
  return { k, filled, persen, missing };
};

const PerusahaanDetail = () => {
  const router = useRouter();
  const id = useParams<{ id: string }>()?.id ?? "";
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [visiOpen, setVisiOpen] = useState(false);
  const [misiOpen, setMisiOpen] = useState(false);
  const [showDemoFab, setShowDemoFab] = useState(false);
  const [demoLevel, setDemoLevel] = useState(100);

  const data = getDetailPreset(demoLevel);
  const { persen, missing } = calcKelengkapan(data);
  const OrgIcon = tipeOrganisasiIcons[data.tipeOrganisasi] || Building2;

  const handleBack = () => router.push("/kamus-karier/master-data");
  const handleEdit = () => router.push(`/kamus-karier/master-data/perusahaan/${id}/edit`);
  const handleRetry = () => setHasError(false);

  const applyDemoState = (level: number) => {
    setDemoLevel(level);
    setShowDemoFab(false);
    toast({ title: `Demo: ${level}%`, description: `Data diubah ke kelengkapan ${level}%.` });
  };

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Detail Perusahaan</h1>
            <div className="w-20" />
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Gagal memuat detail perusahaan.</h2>
            <p className="text-sm text-muted-foreground mb-4">Silakan coba lagi atau kembali ke halaman sebelumnya.</p>
            <Button onClick={handleRetry} className="gap-2"><RefreshCw className="h-4 w-4" />Coba lagi</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-b border-border -mt-4 sm:-mt-6 mb-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
            <h1 className="text-base font-semibold text-foreground hidden sm:block">Detail Profil Perusahaan</h1>
            <Button size="sm" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </div>
        </div>

        {/* Highlight Card */}
        {isLoading ? (
          <div className="border border-border/60 rounded-lg bg-card p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ) : (
          <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <OrgIcon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{data.nama}</h1>
                  {data.namaLokal && <p className="text-base text-muted-foreground mt-0.5">{data.namaLokal}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipe Organisasi</p>
                  <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                    <OrgIcon className="h-3.5 w-3.5" /> {data.tipeOrganisasi}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sektor Industri</p>
                  <Badge variant="secondary" className="py-1.5 px-3">{data.sektorIndustri}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Terakhir diperbarui</p>
                  <p className="text-sm text-foreground">{data.diperbarui}</p>
                </div>
              </div>

              {/* Kelengkapan Data */}
              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kelengkapan Data</p>
                  <span className="text-sm font-bold text-primary">{persen}%</span>
                </div>
                <Progress value={persen} className="h-2 mb-2" />
                {persen < 100 && missing.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {missing.map(s => (
                      <Badge key={s.key} variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
                        {s.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/40">
                <p className="text-xs text-muted-foreground">ID Perusahaan: {data.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {!isLoading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-auto p-1.5 bg-muted/50 rounded-lg">
              <TabsTrigger value="profil" className="text-sm py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
                Profil Perusahaan
              </TabsTrigger>
              <TabsTrigger value="program" disabled className="text-sm py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all opacity-50">
                Program Karier
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profil" className="mt-6 space-y-5">
              {/* Ringkasan Perusahaan */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Ringkasan Perusahaan</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-5">
                    Ringkasan ini memberikan gambaran cepat mengenai skala, daya tarik, dan informasi resmi perusahaan sebagai referensi awal.
                  </p>
                  {data.ringkasan ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoRow icon={Users} label="Jumlah Karyawan" value={data.ringkasan.jumlahKaryawan} />
                      {data.ringkasan.pesertaProgram && <InfoRow icon={Briefcase} label="Peserta Program Karier" value={data.ringkasan.pesertaProgram} />}
                      {data.ringkasan.dreamCompany && <InfoRow icon={Star} label="Dream Company" value={data.ringkasan.dreamCompany} />}
                      <InfoRow icon={MapPin} label="Alamat" value={data.ringkasan.alamat} />
                      <InfoRow icon={Mail} label="Email" value={data.ringkasan.email} />
                      {data.ringkasan.website && <InfoRow icon={ExternalLink} label="Website" value={data.ringkasan.website} isLink />}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Ringkasan belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Tentang Perusahaan */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Tentang Perusahaan</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Bagian ini menjelaskan profil perusahaan secara lebih mendalam, termasuk bidang usaha utama, sejarah berdiri, serta karakter organisasi.
                  </p>
                  {data.tentang?.length > 0 ? (
                    <div className="space-y-3">
                      {data.tentang.map((p: string, idx: number) => (
                        <p key={idx} className="text-sm text-foreground leading-relaxed">{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Deskripsi belum tersedia.</p>
                  )}
                  {/* Visual Pendukung */}
                  {data.gambar?.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Visual Pendukung</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {data.gambar.slice(0, 4).map((url: string, idx: number) => (
                          <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
                            <img src={url} alt={`Visual ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Visi Perusahaan */}
              <Collapsible open={visiOpen} onOpenChange={setVisiOpen}>
                <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-4 bg-muted/30 border-b border-border/40 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <EyeIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-semibold text-foreground">Visi Perusahaan</h3>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", visiOpen && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground mb-3">Visi perusahaan menggambarkan arah jangka panjang dan aspirasi strategis yang ingin dicapai oleh organisasi.</p>
                      {data.visi ? (
                        <p className="text-sm text-foreground font-medium leading-relaxed">{data.visi}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Visi belum tersedia.</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Misi Perusahaan */}
              <Collapsible open={misiOpen} onOpenChange={setMisiOpen}>
                <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-4 bg-muted/30 border-b border-border/40 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-semibold text-foreground">Misi Perusahaan</h3>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", misiOpen && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground mb-3">Misi perusahaan menjelaskan langkah dan pendekatan strategis dalam mewujudkan visi yang telah ditetapkan.</p>
                      {data.misi?.length > 0 ? (
                        <ul className="space-y-2">
                          {data.misi.map((m: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-sm text-foreground">{m}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Misi belum tersedia.</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Capaian Perusahaan */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Capaian Perusahaan</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Capaian perusahaan mencerminkan pengakuan atas kinerja, reputasi, dan kualitas organisasi sebagai tempat membangun karier profesional.
                  </p>
                  {data.capaian?.length > 0 ? (
                    <div className="space-y-3">
                      {data.capaian.map((c: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/40">
                          <Badge variant="outline" className="font-mono text-xs shrink-0">{c.tahun}</Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{c.nama}</p>
                            <p className="text-xs text-muted-foreground">{c.lembaga}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Capaian belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Dokumen Publik */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Dokumen Publik</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Dokumen publik disediakan sebagai referensi resmi bagi pengguna yang ingin memahami perusahaan secara lebih mendalam.
                  </p>
                  {data.dokumenPublik?.length > 0 ? (
                    <div className="space-y-2">
                      {data.dokumenPublik.map((doc: any, idx: number) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <LinkIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-foreground">{doc.nama}</span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Dokumen belum tersedia.</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="program" className="mt-6">
              <div className="border border-border/60 rounded-lg bg-card p-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-medium text-lg text-foreground">Segera Hadir</p>
                <p className="text-sm text-muted-foreground">Tab Program Karier sedang dalam pengembangan.</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Demo FAB - toggle completeness states */}
      <div className="fixed bottom-6 left-6 z-30">
        <div className={cn("transition-all duration-300")}>
          {showDemoFab && (
            <div className="bg-card border border-border rounded-lg shadow-lg p-3 mb-2 w-48 animate-in slide-in-from-bottom-2 fade-in">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Kelengkapan:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[25, 50, 75, 100].map(level => (
                  <button
                    key={level}
                    onClick={() => applyDemoState(level)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      demoLevel === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button
            onClick={() => setShowDemoFab(!showDemoFab)}
            className="h-10 w-10 rounded-full shadow-lg gap-0 p-0"
            variant="outline"
            size="icon"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper component
const InfoRow = ({ icon: Icon, label, value, isLink }: { icon: React.ElementType; label: string; value: string; isLink?: boolean }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      {isLink ? (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">{value}</a>
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  </div>
);

export default PerusahaanDetail;
