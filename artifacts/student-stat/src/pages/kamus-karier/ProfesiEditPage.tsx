import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Trash2, Plus, GripVertical, Briefcase, Code, Heart, Lightbulb, Users, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Category icon mapping
const categoryIconMap: Record<string, React.ElementType> = {
  "Data & AI": Code,
  "Software Development": Code,
  "Design": Heart,
  "Marketing": TrendingUp,
  "Business": Briefcase,
  "Product": Lightbulb,
  "Operations": Users,
};

// Mock categories
const categories = [
  { id: "1", name: "Data & AI", icon: "Code" },
  { id: "2", name: "Software Development", icon: "Code" },
  { id: "3", name: "Design", icon: "Heart" },
  { id: "4", name: "Marketing", icon: "TrendingUp" },
  { id: "5", name: "Business", icon: "Briefcase" },
];

const subCategories = [
  "Data Engineering",
  "Data Science",
  "Machine Learning",
  "Business Intelligence",
  "Data Analytics",
  "AI Research",
];

const riasecOptions = ["R", "I", "A", "S", "E", "C"];

// Mock data for editing
const mockProfesiData = {
  id: "PRF001",
  name: "Data Engineer",
  alias: "Insinyur Data",
  category: "Data & AI",
  subCategories: ["Data Engineering", "Data Science"],
  riasec: ["I", "C", "R"],
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  updatedAt: "2024-01-15",
  description: "Data Engineer merupakan profesional yang mengintegrasikan keahlian pengolahan data dan rekayasa sistem untuk merancang, membangun, serta mengelola infrastruktur data yang andal guna menghasilkan data yang siap digunakan untuk analisis dan pengambilan keputusan.",
  activities: [
    "Mengelola dan memproses data dari berbagai sumber secara akurat.",
    "Merancang dan membangun pipeline ETL/ELT untuk kebutuhan analitik.",
    "Mengelola database dan data warehouse agar performa tetap optimal.",
    "Memastikan kualitas data melalui validasi, monitoring, dan dokumentasi.",
    "Berkolaborasi dengan Data Analyst dan Data Scientist untuk kebutuhan data.",
  ],
  hardSkills: [
    { name: "Data Modeling & Architecture", priority: "Wajib" },
    { name: "ETL Pipeline", priority: "Wajib" },
    { name: "Database Management", priority: "Wajib" },
    { name: "Cloud Computing Concepts", priority: "Dianjurkan" },
    { name: "Data Warehousing", priority: "Dianjurkan" },
  ],
  softSkills: [
    { name: "Berpikir Analitis", priority: "Wajib" },
    { name: "Pemecahan Masalah", priority: "Wajib" },
    { name: "Komunikasi Tim", priority: "Dianjurkan" },
    { name: "Ketelitian", priority: "Dianjurkan" },
    { name: "Manajemen Waktu", priority: "Dianjurkan" },
  ],
  tools: [
    { name: "Python", label: "Wajib" },
    { name: "SQL", label: "Wajib" },
    { name: "Apache Spark", label: "Umum Digunakan" },
    { name: "Hadoop", label: "Umum Digunakan" },
    { name: "Airflow", label: "Umum Digunakan" },
    { name: "AWS", label: "Umum Digunakan" },
    { name: "Google BigQuery", label: "Umum Digunakan" },
  ],
  formalEducation: [
    "Teknik Informatika / Ilmu Komputer",
    "Sistem Informasi",
    "Statistika / Matematika",
  ],
  nonFormalEducation: [
    { name: "Bootcamp Data Engineering", type: "Bootcamp", link: "" },
    { name: "Sertifikasi Cloud & Data Platform", type: "Sertifikasi", link: "" },
    { name: "Kursus Online Data Pipeline & Warehouse", type: "Kursus", link: "" },
  ],
  careerPath: [
    { position: "Junior Data Engineer", experience: "0–2 tahun", salary: "Rp7–12 juta" },
    { position: "Senior Data Engineer", experience: "3–5 tahun", salary: "Rp20–35 juta" },
    { position: "Lead Data Engineer", experience: "5+ tahun", salary: "Rp35–60 juta" },
    { position: "Head of Data Infrastructure", experience: "8+ tahun", salary: "Rp60–100 juta+" },
  ],
  marketConditions: [
    "Tersedia 1.300+ lowongan Data Engineer di Indonesia, dengan konsentrasi tertinggi di Jakarta (1.000+).",
    "Permintaan profesi ini tumbuh sekitar 25% per tahun seiring meningkatnya kebutuhan pengelolaan data berskala besar.",
    "Termasuk dalam 10 besar profesi teknologi paling dibutuhkan di kawasan ASEAN.",
    "Kebutuhan meningkat dipengaruhi transformasi digital, adopsi cloud computing, dan perkembangan AI.",
  ],
};

interface FormData {
  name: string;
  alias: string;
  category: string;
  subCategories: string[];
  riasec: string[];
  image: string | null;
  description: string;
  activities: string[];
  hardSkills: { name: string; priority: string }[];
  softSkills: { name: string; priority: string }[];
  tools: { name: string; label: string }[];
  formalEducation: string[];
  nonFormalEducation: { name: string; type: string; link: string }[];
  careerPath: { position: string; experience: string; salary: string }[];
  marketConditions: string[];
}

export default function ProfesiEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    alias: "",
    category: "",
    subCategories: [],
    riasec: ["", "", ""],
    image: null,
    description: "",
    activities: [],
    hardSkills: [],
    softSkills: [],
    tools: [],
    formalEducation: [],
    nonFormalEducation: [],
    careerPath: [],
    marketConditions: [],
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // New item inputs
  const [newActivity, setNewActivity] = useState("");
  const [newHardSkill, setNewHardSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newTool, setNewTool] = useState("");
  const [newFormalEdu, setNewFormalEdu] = useState("");
  const [newMarketCondition, setNewMarketCondition] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setFormData({
        name: mockProfesiData.name,
        alias: mockProfesiData.alias || "",
        category: mockProfesiData.category,
        subCategories: mockProfesiData.subCategories,
        riasec: mockProfesiData.riasec,
        image: mockProfesiData.image,
        description: mockProfesiData.description,
        activities: mockProfesiData.activities,
        hardSkills: mockProfesiData.hardSkills,
        softSkills: mockProfesiData.softSkills,
        tools: mockProfesiData.tools,
        formalEducation: mockProfesiData.formalEducation,
        nonFormalEducation: mockProfesiData.nonFormalEducation,
        careerPath: mockProfesiData.careerPath,
        marketConditions: mockProfesiData.marketConditions,
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setPendingNavigation(`/kamus-karier/master-data/profesi/${id}`);
      setShowExitDialog(true);
    } else {
      navigate(`/kamus-karier/master-data/profesi/${id}`);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama profesi wajib diisi.";
    } else if (formData.name.length < 3 || formData.name.length > 60) {
      newErrors.name = "Nama profesi harus 3-60 karakter.";
    }

    if (!formData.category) {
      newErrors.category = "Kategori wajib dipilih.";
    }

    if (formData.riasec.some(r => !r)) {
      newErrors.riasec = "RIASEC wajib diisi lengkap (3 huruf).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi field yang wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setHasChanges(false);
    
    toast({
      title: "Berhasil",
      description: "Perubahan berhasil disimpan.",
    });
    
    navigate(`/kamus-karier/master-data/profesi/${id}`);
  };

  // Helper functions for array operations
  const addItem = <T,>(arr: T[], item: T, setter: (val: T[]) => void) => {
    setter([...arr, item]);
    setHasChanges(true);
  };

  const removeItem = <T,>(arr: T[], index: number, setter: (val: T[]) => void) => {
    setter(arr.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateItem = <T,>(arr: T[], index: number, item: T, setter: (val: T[]) => void) => {
    const newArr = [...arr];
    newArr[index] = item;
    setter(newArr);
    setHasChanges(true);
  };

  const CategoryIcon = formData.category ? categoryIconMap[formData.category] || Briefcase : Briefcase;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-9 w-36 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>

          <h1 className="text-lg font-semibold text-foreground">
            Edit Profesi Digital
          </h1>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Batalkan
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Highlight Profesi - Editable */}
        <div className="rounded-xl border border-[#cacaca]/60 bg-card overflow-hidden">
          <div className="p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Informasi Utama Profesi</h2>
            
            {/* Image Upload */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">
                Gambar Profesi <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                {formData.image ? (
                  <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-border">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Upload className="h-3 w-3" />
                        Ganti
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateFormData("image", null)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full max-w-md rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Klik untuk upload gambar</span>
                    <span className="text-xs text-muted-foreground">Rasio 16:9, JPG/PNG, max 2MB</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Rekomendasi: 1920×1080 px (minimal 1280×720 px), format JPG/PNG, ukuran ≤ 2 MB
              </p>
            </div>

            {/* Name & Alias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Nama Profesi <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Contoh: Data Engineer"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">3-60 karakter, gunakan title case</p>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Alias (Opsional)</Label>
                <Input
                  value={formData.alias}
                  onChange={(e) => updateFormData("alias", e.target.value)}
                  placeholder="Contoh: Insinyur Data"
                />
              </div>
            </div>

            {/* Category & Sub-category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Kategori Utama <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => updateFormData("category", val)}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <span className="flex items-center gap-2">
                          {cat.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Sub-kategori</Label>
                <Select
                  value=""
                  onValueChange={(val) => {
                    if (!formData.subCategories.includes(val)) {
                      updateFormData("subCategories", [...formData.subCategories, val]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sub-kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.filter(sc => !formData.subCategories.includes(sc)).map(sc => (
                      <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.subCategories.map((sc, i) => (
                      <Badge key={sc} variant="secondary" className="gap-1">
                        {sc}
                        <button
                          onClick={() => updateFormData("subCategories", formData.subCategories.filter((_, idx) => idx !== i))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIASEC */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">
                RIASEC <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Dominan:</span>
                  <Select
                    value={formData.riasec[0]}
                    onValueChange={(val) => updateFormData("riasec", [val, formData.riasec[1], formData.riasec[2]])}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {riasecOptions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Ke-2:</span>
                  <Select
                    value={formData.riasec[1]}
                    onValueChange={(val) => updateFormData("riasec", [formData.riasec[0], val, formData.riasec[2]])}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {riasecOptions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Ke-3:</span>
                  <Select
                    value={formData.riasec[2]}
                    onValueChange={(val) => updateFormData("riasec", [formData.riasec[0], formData.riasec[1], val])}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {riasecOptions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className="ml-4 font-mono">
                  {formData.riasec.filter(Boolean).join("") || "---"}
                </Badge>
              </div>
              {errors.riasec && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.riasec}
                </p>
              )}
            </div>

            {/* Metadata (Read-only) */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border">
              <span>ID: {mockProfesiData.id}</span>
              <span>Terakhir diperbarui: {mockProfesiData.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto">
            <TabsTrigger
              value="profil"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
            >
              Profil Profesi
            </TabsTrigger>
            <TabsTrigger
              value="kualifikasi"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
            >
              Kualifikasi Profesi
            </TabsTrigger>
            <TabsTrigger
              value="prospek"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
            >
              Prospek Kerja Profesi
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profil Profesi */}
          <TabsContent value="profil" className="mt-6 space-y-6">
            {/* Tentang Profesi */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Tentang Profesi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tulis deskripsi ringkas namun komprehensif tentang peran, konteks industri, dan dampaknya.
              </p>
              <Textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Data Engineer merupakan profesional yang mengintegrasikan keahlian pengolahan data dan rekayasa sistem untuk merancang, membangun, serta mengelola infrastruktur data yang andal…"
                className="min-h-[160px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Disarankan 600–1.200 karakter. Saat ini: {formData.description.length} karakter
              </p>
            </div>

            {/* Aktivitas Profesi */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Aktivitas Profesi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dalam menjalankan perannya, profesi ini umumnya melakukan aktivitas berikut:
              </p>
              
              <div className="space-y-2 mb-4">
                {formData.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 group">
                    <GripVertical className="h-5 w-5 text-muted-foreground/50 mt-2 cursor-grab" />
                    <Input
                      value={activity}
                      onChange={(e) => {
                        const newActivities = [...formData.activities];
                        newActivities[index] = e.target.value;
                        updateFormData("activities", newActivities);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateFormData("activities", formData.activities.filter((_, i) => i !== index))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Contoh: Merancang dan membangun pipeline data untuk analitik."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newActivity.trim()) {
                      updateFormData("activities", [...formData.activities, newActivity.trim()]);
                      setNewActivity("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (newActivity.trim()) {
                      updateFormData("activities", [...formData.activities, newActivity.trim()]);
                      setNewActivity("");
                    }
                  }}
                  className="gap-1 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Aktivitas
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Disarankan 5–10 item. Awali dengan kata kerja (Mengelola, Merancang, Membangun).
              </p>
            </div>
          </TabsContent>

          {/* Tab 2: Kualifikasi Profesi */}
          <TabsContent value="kualifikasi" className="mt-6 space-y-6">
            {/* Kompetensi Profesi */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Kompetensi Profesi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Untuk bekerja di profesi ini, kamu perlu menguasai kompetensi utama serta kompetensi pendukung berikut.
              </p>

              {/* Hard Skills */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Kompetensi Utama (Hard Skills)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.hardSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant={skill.priority === "Wajib" ? "default" : "secondary"}
                      className="gap-1 pr-1"
                    >
                      {skill.name}
                      <span className="text-xs opacity-70">({skill.priority})</span>
                      <button
                        onClick={() => updateFormData("hardSkills", formData.hardSkills.filter((_, i) => i !== index))}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newHardSkill}
                    onChange={(e) => setNewHardSkill(e.target.value)}
                    placeholder="Contoh: ETL Pipeline"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newHardSkill.trim()) {
                        updateFormData("hardSkills", [...formData.hardSkills, { name: newHardSkill.trim(), priority: "Dianjurkan" }]);
                        setNewHardSkill("");
                      }
                    }}
                  />
                  <Select
                    onValueChange={(priority) => {
                      if (newHardSkill.trim()) {
                        updateFormData("hardSkills", [...formData.hardSkills, { name: newHardSkill.trim(), priority }]);
                        setNewHardSkill("");
                      }
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wajib">Wajib</SelectItem>
                      <SelectItem value="Dianjurkan">Dianjurkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Kompetensi Pendukung (Soft Skills)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.softSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant={skill.priority === "Wajib" ? "default" : "secondary"}
                      className="gap-1 pr-1"
                    >
                      {skill.name}
                      <span className="text-xs opacity-70">({skill.priority})</span>
                      <button
                        onClick={() => updateFormData("softSkills", formData.softSkills.filter((_, i) => i !== index))}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    placeholder="Contoh: Berpikir Analitis"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSoftSkill.trim()) {
                        updateFormData("softSkills", [...formData.softSkills, { name: newSoftSkill.trim(), priority: "Dianjurkan" }]);
                        setNewSoftSkill("");
                      }
                    }}
                  />
                  <Select
                    onValueChange={(priority) => {
                      if (newSoftSkill.trim()) {
                        updateFormData("softSkills", [...formData.softSkills, { name: newSoftSkill.trim(), priority }]);
                        setNewSoftSkill("");
                      }
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wajib">Wajib</SelectItem>
                      <SelectItem value="Dianjurkan">Dianjurkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Perangkat & Teknologi */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Perangkat & Teknologi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Berikut perangkat maupun teknologi yang umum digunakan dalam profesi ini.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tools.map((tool, index) => (
                  <Badge
                    key={index}
                    variant={tool.label === "Wajib" ? "default" : "secondary"}
                    className="gap-1 pr-1"
                  >
                    {tool.name}
                    <span className="text-xs opacity-70">({tool.label})</span>
                    <button
                      onClick={() => updateFormData("tools", formData.tools.filter((_, i) => i !== index))}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="Contoh: Apache Spark"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTool.trim()) {
                      updateFormData("tools", [...formData.tools, { name: newTool.trim(), label: "Umum Digunakan" }]);
                      setNewTool("");
                    }
                  }}
                />
                <Select
                  onValueChange={(label) => {
                    if (newTool.trim()) {
                      updateFormData("tools", [...formData.tools, { name: newTool.trim(), label }]);
                      setNewTool("");
                    }
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wajib">Wajib</SelectItem>
                    <SelectItem value="Umum Digunakan">Umum Digunakan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Disarankan 8–20 item.</p>
            </div>

            {/* Pendidikan Profesi */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Pendidikan Profesi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Profesi ini umumnya didukung oleh pendidikan formal serta pembelajaran non-formal yang memperkuat kompetensi dan kesiapan kerja.
              </p>

              {/* Formal Education */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Pendidikan Formal</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.formalEducation.map((edu, index) => (
                    <Badge key={index} variant="outline" className="gap-1 pr-1">
                      {edu}
                      <button
                        onClick={() => updateFormData("formalEducation", formData.formalEducation.filter((_, i) => i !== index))}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newFormalEdu}
                    onChange={(e) => setNewFormalEdu(e.target.value)}
                    placeholder="Contoh: Teknik Informatika / Ilmu Komputer"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newFormalEdu.trim()) {
                        updateFormData("formalEducation", [...formData.formalEducation, newFormalEdu.trim()]);
                        setNewFormalEdu("");
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (newFormalEdu.trim()) {
                        updateFormData("formalEducation", [...formData.formalEducation, newFormalEdu.trim()]);
                        setNewFormalEdu("");
                      }
                    }}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </div>
              </div>

              {/* Non-Formal Education */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Pendidikan Non-Formal</Label>
                <div className="space-y-2 mb-3">
                  {formData.nonFormalEducation.map((edu, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                      <Input
                        value={edu.name}
                        onChange={(e) => {
                          const newEdu = [...formData.nonFormalEducation];
                          newEdu[index] = { ...edu, name: e.target.value };
                          updateFormData("nonFormalEducation", newEdu);
                        }}
                        placeholder="Nama Program"
                        className="flex-1"
                      />
                      <Select
                        value={edu.type}
                        onValueChange={(type) => {
                          const newEdu = [...formData.nonFormalEducation];
                          newEdu[index] = { ...edu, type };
                          updateFormData("nonFormalEducation", newEdu);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                          <SelectItem value="Sertifikasi">Sertifikasi</SelectItem>
                          <SelectItem value="Kursus">Kursus</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={edu.link}
                        onChange={(e) => {
                          const newEdu = [...formData.nonFormalEducation];
                          newEdu[index] = { ...edu, link: e.target.value };
                          updateFormData("nonFormalEducation", newEdu);
                        }}
                        placeholder="https://..."
                        className="w-48"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateFormData("nonFormalEducation", formData.nonFormalEducation.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => updateFormData("nonFormalEducation", [...formData.nonFormalEducation, { name: "", type: "Bootcamp", link: "" }])}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Program
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Prospek Kerja Profesi */}
          <TabsContent value="prospek" className="mt-6 space-y-6">
            {/* Jenjang Karier */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Jenjang Karier</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Profesi ini memiliki jalur karier yang berkembang bertahap, dari level awal hingga peran strategis seiring peningkatan pengalaman dan kompetensi.
              </p>

              <div className="space-y-3 mb-4">
                {formData.careerPath.map((level, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <Input
                      value={level.position}
                      onChange={(e) => {
                        const newPath = [...formData.careerPath];
                        newPath[index] = { ...level, position: e.target.value };
                        updateFormData("careerPath", newPath);
                      }}
                      placeholder="Nama Posisi"
                      className="flex-1"
                    />
                    <Input
                      value={level.experience}
                      onChange={(e) => {
                        const newPath = [...formData.careerPath];
                        newPath[index] = { ...level, experience: e.target.value };
                        updateFormData("careerPath", newPath);
                      }}
                      placeholder="0–2 tahun"
                      className="w-32"
                    />
                    <Input
                      value={level.salary}
                      onChange={(e) => {
                        const newPath = [...formData.careerPath];
                        newPath[index] = { ...level, salary: e.target.value };
                        updateFormData("careerPath", newPath);
                      }}
                      placeholder="Rp7–12 juta"
                      className="w-40"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateFormData("careerPath", formData.careerPath.filter((_, i) => i !== index))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => updateFormData("careerPath", [...formData.careerPath, { position: "", experience: "", salary: "" }])}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Tambah Level Karier
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Disarankan 4–6 level.</p>
            </div>

            {/* Kondisi Pasar Kerja */}
            <div className="rounded-xl border border-[#cacaca]/60 bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Kondisi Pasar Kerja</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Berikut gambaran kondisi pasar kerja dan kebutuhan industri terhadap profesi ini berdasarkan data dan tren terkini.
              </p>

              <div className="space-y-2 mb-4">
                {formData.marketConditions.map((condition, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <Input
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...formData.marketConditions];
                        newConditions[index] = e.target.value;
                        updateFormData("marketConditions", newConditions);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateFormData("marketConditions", formData.marketConditions.filter((_, i) => i !== index))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newMarketCondition}
                  onChange={(e) => setNewMarketCondition(e.target.value)}
                  placeholder="Contoh: Permintaan profesi ini tumbuh sekitar 25% per tahun..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMarketCondition.trim()) {
                      updateFormData("marketConditions", [...formData.marketConditions, newMarketCondition.trim()]);
                      setNewMarketCondition("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (newMarketCondition.trim()) {
                      updateFormData("marketConditions", [...formData.marketConditions, newMarketCondition.trim()]);
                      setNewMarketCondition("");
                    }
                  }}
                  className="gap-1 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Poin
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Disarankan 3–5 poin dengan data spesifik.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perubahan belum disimpan</DialogTitle>
            <DialogDescription>
              Keluar tanpa menyimpan? Perubahan yang telah dibuat akan hilang.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Tetap di halaman
            </Button>
            <Button variant="destructive" onClick={handleConfirmExit}>
              Tinggalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
