import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Edit, 
  Code, 
  Palette, 
  PenTool, 
  Megaphone, 
  Settings, 
  BarChart3, 
  FileText,
  Briefcase,
  GraduationCap,
  Laptop,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Info,
  CheckCircle2,
  Award,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data types
interface Profesi {
  id: string;
  nama: string;
  alias?: string;
  kategori: string;
  kategoriIcon: React.ElementType;
  subKategori: string[];
  riasec: string;
  diperbarui: string;
}

// Category icon mapping
const categoryIconMap: Record<string, React.ElementType> = {
  "Teknologi": Code,
  "Desain": Palette,
  "Marketing": Megaphone,
  "Manajemen": Settings,
  "Bisnis": BarChart3,
  "Konten": PenTool,
};

// Mock profesi data
const mockProfesiData: Record<string, Profesi> = {
  "1": {
    id: "1",
    nama: "Software Engineer",
    alias: "Pengembang Perangkat Lunak",
    kategori: "Teknologi",
    kategoriIcon: Code,
    subKategori: ["Backend", "Frontend", "Fullstack"],
    riasec: "IRC",
    diperbarui: "11 Jan 2026",
  },
  "2": {
    id: "2",
    nama: "Data Engineer",
    alias: "Insinyur Data",
    kategori: "Teknologi",
    kategoriIcon: Code,
    subKategori: ["Data Pipeline", "Data Warehouse", "ETL"],
    riasec: "ICR",
    diperbarui: "10 Jan 2026",
  },
};

// Extended mock detail data
const mockDetailData = {
  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
  tentangProfesi: "Data Engineer merupakan profesional yang mengintegrasikan keahlian pengolahan data dan rekayasa sistem untuk merancang, membangun, serta mengelola infrastruktur data yang andal guna menghasilkan data yang siap digunakan untuk analisis dan pengambilan keputusan. Profesi ini berkembang seiring meningkatnya kebutuhan industri terhadap pengelolaan data berskala besar, sehingga menempatkannya sebagai fungsi penting dalam ekosistem data modern. Dalam skala yang lebih luas, peran ini memiliki dampak strategis terhadap keberlangsungan organisasi karena memastikan data tersedia, akurat, dan mudah diakses untuk mendukung keputusan bisnis.",
  aktivitasProfesi: [
    "Mengelola dan memproses data dari berbagai sumber secara akurat.",
    "Merancang dan membangun pipeline ETL/ELT untuk kebutuhan analitik.",
    "Mengelola database dan data warehouse agar performa tetap optimal.",
    "Memastikan kualitas data melalui validasi, monitoring, dan dokumentasi.",
    "Berkolaborasi dengan Data Analyst dan Data Scientist untuk kebutuhan data."
  ],
  kompetensiUtama: [
    { nama: "Data Modeling & Architecture", prioritas: "Wajib" },
    { nama: "ETL Pipeline", prioritas: "Wajib" },
    { nama: "Database Management", prioritas: "Wajib" },
    { nama: "Cloud Computing Concepts", prioritas: "Dianjurkan" },
    { nama: "Data Warehousing", prioritas: "Dianjurkan" }
  ],
  kompetensiPendukung: [
    { nama: "Berpikir Analitis", prioritas: "Wajib" },
    { nama: "Pemecahan Masalah", prioritas: "Wajib" },
    { nama: "Komunikasi Tim", prioritas: "Wajib" },
    { nama: "Ketelitian", prioritas: "Dianjurkan" },
    { nama: "Manajemen Waktu", prioritas: "Dianjurkan" }
  ],
  perangkatTeknologi: {
    "Bahasa & Tools": ["Python", "SQL", "Scala"],
    "Platform & Framework": ["Apache Spark", "Hadoop", "Airflow"],
    "Cloud & Data Platform": ["AWS", "Google BigQuery", "Snowflake"]
  },
  pendidikanFormal: [
    "Teknik Informatika / Ilmu Komputer",
    "Sistem Informasi", 
    "Statistika / Matematika"
  ],
  pendidikanNonFormal: [
    { nama: "Bootcamp Data Engineering", tipe: "Bootcamp" },
    { nama: "Sertifikasi Cloud & Data Platform", tipe: "Sertifikasi" },
    { nama: "Kursus Online Data Pipeline & Warehouse", tipe: "Kursus" }
  ],
  jenjangKarier: [
    { posisi: "Junior Data Engineer", pengalaman: "0–2 tahun", gaji: "Rp7–12 juta" },
    { posisi: "Senior Data Engineer", pengalaman: "3–5 tahun", gaji: "Rp20–35 juta" },
    { posisi: "Lead Data Engineer", pengalaman: "5+ tahun", gaji: "Rp35–60 juta" },
    { posisi: "Head of Data Infrastructure", pengalaman: "8+ tahun", gaji: "Rp60–100 juta+" }
  ],
  kondisiPasarKerja: [
    "Tersedia 1.300+ lowongan Data Engineer di Indonesia, dengan konsentrasi tertinggi di Jakarta (1.000+).",
    "Permintaan profesi ini tumbuh sekitar 25% per tahun seiring meningkatnya kebutuhan pengelolaan data berskala besar.",
    "Termasuk dalam 10 besar profesi teknologi paling dibutuhkan di kawasan ASEAN.",
    "Kebutuhan meningkat dipengaruhi transformasi digital, adopsi cloud computing, dan perkembangan AI."
  ]
};

const ProfesiDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("profil");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Get profesi data (in real app, fetch from API)
  const profesi = id ? mockProfesiData[id] || mockProfesiData["2"] : null;

  const handleBack = () => {
    navigate("/kamus-karier/master-data");
  };

  const handleEdit = () => {
    navigate(`/kamus-karier/master-data/profesi/${id}/edit`);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Error state
  if (hasError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Detail Item Profesi Digital</h1>
            <div className="w-20" />
          </div>

          {/* Error Content */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Gagal memuat detail profesi.</h2>
            <p className="text-sm text-muted-foreground mb-4">Silakan coba lagi atau kembali ke halaman sebelumnya.</p>
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba lagi
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Top Bar - Sticky */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mx-6 px-6 py-4 border-b border-border -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <h1 className="text-base font-semibold text-foreground hidden sm:block">
              Detail Item Profesi Digital
            </h1>
            <Button size="sm" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Highlight Profesi Card */}
        {isLoading ? (
          <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
            <Skeleton className="w-full h-56" />
            <div className="p-5 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        ) : profesi && (
          <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
            {/* Profession Image */}
            <div className="relative w-full h-56 md:h-64 bg-muted">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Gambar belum tersedia</p>
                  </div>
                </div>
              ) : (
                <img
                  src={mockDetailData.imageUrl}
                  alt={profesi.nama}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Profession Info */}
            <div className="p-5 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profesi.nama}</h1>
                {profesi.alias && (
                  <p className="text-base text-muted-foreground mt-1">{profesi.alias}</p>
                )}
              </div>

              {/* Meta Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Kategori */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kategori</p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                    <profesi.kategoriIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{profesi.kategori}</span>
                  </div>
                </div>

                {/* Sub-kategori */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sub-kategori</p>
                  <div className="flex flex-wrap gap-2">
                    {profesi.subKategori.length > 0 ? (
                      <>
                        {profesi.subKategori.slice(0, 2).map((sub, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                          >
                            {sub}
                          </span>
                        ))}
                        {profesi.subKategori.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                            +{profesi.subKategori.length - 2}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Belum ditentukan</span>
                    )}
                  </div>
                </div>

                {/* RIASEC */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RIASEC</p>
                  <Badge variant="outline" className="gap-1.5 font-semibold text-sm py-1.5 px-3">
                    RIASEC: {profesi.riasec}
                  </Badge>
                </div>

                {/* Terakhir Diperbarui */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Terakhir diperbarui</p>
                  <p className="text-sm text-foreground">{profesi.diperbarui}</p>
                </div>
              </div>

              {/* ID Profesi */}
              <div className="pt-2 border-t border-border/40">
                <p className="text-xs text-muted-foreground">ID Profesi: {profesi.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Menu */}
        {!isLoading && profesi && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1.5 bg-muted/50 rounded-lg">
              <TabsTrigger 
                value="profil" 
                className="text-sm py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                Profil Profesi
              </TabsTrigger>
              <TabsTrigger 
                value="kualifikasi"
                className="text-sm py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                Kualifikasi Profesi
              </TabsTrigger>
              <TabsTrigger 
                value="prospek"
                className="text-sm py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                Prospek Kerja Profesi
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Profil Profesi */}
            <TabsContent value="profil" className="mt-6 space-y-5">
              {/* Tentang Profesi */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Tentang Profesi</h3>
                </div>
                <div className="p-5">
                  {mockDetailData.tentangProfesi ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mockDetailData.tentangProfesi}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Deskripsi profesi belum tersedia.
                    </p>
                  )}
                </div>
              </div>

              {/* Aktivitas Profesi */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Aktivitas Profesi</h3>
                </div>
                <div className="p-5">
                  {mockDetailData.aktivitasProfesi.length > 0 ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Dalam menjalankan perannya, profesi ini umumnya melakukan aktivitas berikut:
                      </p>
                      <ul className="space-y-3">
                        {mockDetailData.aktivitasProfesi.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm text-foreground">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aktivitas profesi belum tersedia.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Kualifikasi Profesi */}
            <TabsContent value="kualifikasi" className="mt-6 space-y-5">
              {/* Kompetensi Profesi */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Kompetensi Profesi</h3>
                </div>
                <div className="p-5 space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Untuk bekerja di profesi ini, kamu perlu menguasai kompetensi utama serta kompetensi pendukung berikut.
                  </p>
                  
                  {/* Hard Skills */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Kompetensi Utama (Hard Skills)</p>
                    {mockDetailData.kompetensiUtama.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {mockDetailData.kompetensiUtama.map((skill, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary"
                          >
                            <span className="text-secondary-foreground">{skill.nama}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              skill.prioritas === "Wajib" 
                                ? "bg-primary/20 text-primary" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {skill.prioritas}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Kompetensi utama belum tersedia.</p>
                    )}
                  </div>
                  
                  {/* Soft Skills */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Kompetensi Pendukung (Soft Skills)</p>
                    {mockDetailData.kompetensiPendukung.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {mockDetailData.kompetensiPendukung.map((skill, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary"
                          >
                            <span className="text-secondary-foreground">{skill.nama}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              skill.prioritas === "Wajib" 
                                ? "bg-primary/20 text-primary" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {skill.prioritas}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Kompetensi pendukung belum tersedia.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Perangkat & Teknologi */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Laptop className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Perangkat & Teknologi</h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Berikut perangkat maupun teknologi yang umum digunakan dalam profesi ini.
                  </p>
                  {Object.keys(mockDetailData.perangkatTeknologi).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(mockDetailData.perangkatTeknologi).map(([group, tools]) => (
                        <div key={group}>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{group}</p>
                          <div className="flex flex-wrap gap-2">
                            {tools.map((tool, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-accent text-accent-foreground"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Perangkat dan teknologi belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Pendidikan Profesi */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Pendidikan Profesi</h3>
                </div>
                <div className="p-5 space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Profesi ini umumnya didukung oleh latar belakang pendidikan formal serta pembelajaran non-formal yang memperkuat kompetensi dan kesiapan kerja.
                  </p>
                  
                  {/* Formal Education */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Pendidikan Formal</p>
                    {mockDetailData.pendidikanFormal.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {mockDetailData.pendidikanFormal.map((edu, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-secondary text-secondary-foreground"
                          >
                            {edu}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Pendidikan formal belum tersedia.</p>
                    )}
                  </div>
                  
                  {/* Non-Formal Education */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Pendidikan Non-Formal</p>
                    {mockDetailData.pendidikanNonFormal.length > 0 ? (
                      <div className="space-y-2.5">
                        {mockDetailData.pendidikanNonFormal.map((program, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border/40"
                          >
                            <span className="text-sm font-medium text-foreground">{program.nama}</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                              {program.tipe}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Pendidikan non-formal belum tersedia.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Prospek Kerja Profesi */}
            <TabsContent value="prospek" className="mt-6 space-y-5">
              {/* Jenjang Karier */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Jenjang Karier</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-5">
                    Profesi ini memiliki jalur karier yang berkembang secara bertahap, dari level awal hingga peran strategis seiring peningkatan pengalaman dan kompetensi.
                  </p>
                  {mockDetailData.jenjangKarier.length > 0 ? (
                    <div className="relative pl-4">
                      {/* Vertical line */}
                      <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />
                      
                      <div className="space-y-4">
                        {mockDetailData.jenjangKarier.map((level, idx) => (
                          <div key={idx} className="relative flex items-start gap-5 pl-6">
                            {/* Dot */}
                            <div className={cn(
                              "absolute left-0 top-4 w-3.5 h-3.5 rounded-full border-2 border-background ring-2",
                              idx === 0 ? "bg-primary ring-primary/30" : "bg-muted-foreground/50 ring-muted-foreground/20"
                            )} />
                            
                            <div className="flex-1 p-4 rounded-lg bg-muted/30 border border-border/40">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                  <p className="text-base font-semibold text-foreground">{level.posisi}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                      <Clock className="h-4 w-4" />
                                      {level.pengalaman}
                                    </span>
                                  </div>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                                  <DollarSign className="h-4 w-4" />
                                  {level.gaji}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Jenjang karier belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Kondisi Pasar Kerja */}
              <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2.5 px-5 py-4 bg-muted/30 border-b border-border/40">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Kondisi Pasar Kerja</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-5">
                    Berikut gambaran kondisi pasar kerja dan kebutuhan industri terhadap profesi ini berdasarkan data dan tren terkini.
                  </p>
                  {mockDetailData.kondisiPasarKerja.length > 0 ? (
                    <>
                      <ul className="space-y-3">
                        {mockDetailData.kondisiPasarKerja.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                            </div>
                            <span className="text-sm text-foreground leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-4 italic">
                        Data dapat bervariasi tergantung waktu dan sumber.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Kondisi pasar kerja belum tersedia.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Loading State for Tabs */}
        {isLoading && (
          <div className="space-y-5">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfesiDetail;
