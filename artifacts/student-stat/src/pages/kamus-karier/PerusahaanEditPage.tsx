import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, X, Upload, Trash2, Plus, Loader2, AlertCircle,
  Building2, Landmark, Briefcase, Globe, GraduationCap, Heart,
  Users, Star, MapPin, Mail, ExternalLink, Target, Trophy, FileText,
  Eye, ChevronUp, CheckCircle2, XCircle, Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Kelengkapan fields
const kelengkapanSections = [
  { key: "foto", label: "Foto Profil & Sampul", anchor: "foto" },
  { key: "ringkasan", label: "Ringkasan Perusahaan", anchor: "ringkasan" },
  { key: "tentang", label: "Tentang Perusahaan", anchor: "tentang" },
  { key: "gambar", label: "Visual Pendukung", anchor: "gambar" },
  { key: "visi", label: "Visi Perusahaan", anchor: "visi" },
  { key: "misi", label: "Misi Perusahaan", anchor: "misi" },
  { key: "capaian", label: "Capaian Perusahaan", anchor: "capaian" },
  { key: "dokumen", label: "Dokumen Publik", anchor: "dokumen" },
];

const tipeOrganisasiOptions = [
  "Perusahaan Negara", "Perusahaan Swasta", "Perusahaan Startup",
];

const sektorIndustriOptions = [
  "Technology", "Finance", "FMCG", "Retail", "Manufacturing", "Energy",
  "Healthcare", "Education", "Media", "Logistics", "Construction", "Consulting",
];

// Full mock data (100%)
const generateRextraUrl = (docName: string, companyName: string): string => {
  const slug = `${docName}-${companyName}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `rextra.id/s/${slug}`;
};

const fullMockData = {
  nama: "PT Telekomunikasi Indonesia Tbk",
  namaLokal: "Telkom Indonesia",
  tipeOrganisasi: "Perusahaan Negara",
  sektorIndustri: "Technology",
  lokasi: "Bandung",
  jumlahKaryawan: "± 24.000 karyawan",
  pesertaProgram: "3.500+",
  dreamCompany: "5.000+",
  alamat: "Jl. Japati No.1, Bandung, Indonesia",
  email: "corporate@telkom.co.id",
  website: "www.telkom.co.id",
  fotoProfil: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  fotoSampul: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=300&fit=crop",
  tentang: [
    "PT Telkom Indonesia (Persero) Tbk merupakan perusahaan yang bergerak di bidang teknologi informasi dan telekomunikasi.",
    "Perusahaan menyediakan berbagai layanan seperti jaringan telekomunikasi, layanan internet broadband, solusi digital enterprise.",
    "Sebagai BUMN, Telkom Indonesia menjalankan operasionalnya dengan pendekatan transformasi digital yang berkelanjutan.",
  ],
  gambar: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
  ],
  visi: "Menjadi perusahaan digital telco pilihan utama untuk memajukan masyarakat.",
  misi: [
    "Mempercepat pembangunan infrastruktur dan platform digital",
    "Mengembangkan talenta digital yang kompeten",
    "Memberikan layanan terbaik bagi pelanggan",
  ],
  capaian: [
    { tahun: "2024", nama: "Forbes Global 2000", lembaga: "Forbes" },
    { tahun: "2023", nama: "Indonesia Best Employer Award", lembaga: "SWA Magazine" },
  ],
  dokumenPublik: [
    { nama: "Company Profile 2024", url: "https://telkom.co.id/company-profile-2024", urlRextra: "rextra.id/s/company-profile-2024-telkom-indonesia" },
    { nama: "Annual Report 2023", url: "https://telkom.co.id/annual-report-2023", urlRextra: "rextra.id/s/annual-report-2023-telkom-indonesia" },
  ],
};

// Preset data at different completeness levels
const getPresetData = (level: number): FormData => {
  if (level === 100) return { ...fullMockData };
  if (level === 75) return {
    ...fullMockData,
    gambar: [],
    dokumenPublik: [],
  };
  if (level === 50) return {
    ...fullMockData,
    fotoProfil: "",
    fotoSampul: "",
    gambar: [],
    visi: "",
    misi: [],
    dokumenPublik: [],
  };
  // 25%
  return {
    nama: fullMockData.nama,
    namaLokal: fullMockData.namaLokal,
    tipeOrganisasi: fullMockData.tipeOrganisasi,
    sektorIndustri: fullMockData.sektorIndustri,
    lokasi: fullMockData.lokasi,
    jumlahKaryawan: fullMockData.jumlahKaryawan,
    pesertaProgram: "",
    dreamCompany: "",
    alamat: fullMockData.alamat,
    email: fullMockData.email,
    website: "",
    fotoProfil: "",
    fotoSampul: "",
    tentang: [],
    gambar: [],
    visi: "",
    misi: [],
    capaian: [],
    dokumenPublik: [],
  };
};

interface FormData {
  nama: string;
  namaLokal: string;
  tipeOrganisasi: string;
  sektorIndustri: string;
  lokasi: string;
  jumlahKaryawan: string;
  pesertaProgram: string;
  dreamCompany: string;
  alamat: string;
  email: string;
  website: string;
  fotoProfil: string;
  fotoSampul: string;
  tentang: string[];
  gambar: string[];
  visi: string;
  misi: string[];
  capaian: { tahun: string; nama: string; lembaga: string }[];
  dokumenPublik: { nama: string; url: string; urlRextra: string }[];
}

export default function PerusahaanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showFab, setShowFab] = useState(false);
  const [showDemoFab, setShowDemoFab] = useState(false);

  const [formData, setFormData] = useState<FormData>(getPresetData(100));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(getPresetData(100));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  // Calculate kelengkapan
  const getKelengkapan = () => {
    return {
      foto: !!(formData.fotoProfil && formData.fotoSampul),
      ringkasan: !!(formData.jumlahKaryawan && formData.alamat && formData.email),
      tentang: formData.tentang.some(t => t.trim().length > 0),
      gambar: formData.gambar.length > 0,
      visi: formData.visi.trim().length > 0,
      misi: formData.misi.length > 0 && formData.misi.some(m => m.trim().length > 0),
      capaian: formData.capaian.length > 0,
      dokumen: formData.dokumenPublik.length > 0,
    };
  };

  const kelengkapan = getKelengkapan();
  const filledCount = Object.values(kelengkapan).filter(Boolean).length;
  const kelengkapanPersen = Math.round((filledCount / kelengkapanSections.length) * 100);
  const missingSections = kelengkapanSections.filter(s => !kelengkapan[s.key as keyof typeof kelengkapan]);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleBack = () => {
    if (hasChanges) {
      setPendingNavigation(`/kamus-karier/master-data/perusahaan/${id}`);
      setShowExitDialog(true);
    } else {
      navigate(`/kamus-karier/master-data/perusahaan/${id}`);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    if (pendingNavigation) navigate(pendingNavigation);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = "Nama perusahaan wajib diisi.";
    if (!formData.tipeOrganisasi) newErrors.tipeOrganisasi = "Tipe organisasi wajib dipilih.";
    if (!formData.sektorIndustri) newErrors.sektorIndustri = "Sektor industri wajib dipilih.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({ title: "Validasi Gagal", description: "Mohon lengkapi field yang wajib diisi.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    toast({ title: "Berhasil", description: "Perubahan berhasil disimpan." });
    navigate(`/kamus-karier/master-data/perusahaan/${id}`);
  };

  const scrollToSection = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowFab(false);
  };

  const applyDemoState = (level: number) => {
    setFormData(getPresetData(level));
    setHasChanges(true);
    setShowDemoFab(false);
    toast({ title: `Demo: ${level}%`, description: `Data diubah ke kelengkapan ${level}%.` });
  };

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
          <div className="h-32 bg-muted animate-pulse rounded-xl" />
          <div className="h-96 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">Edit Perusahaan</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <X className="h-4 w-4" /> <span className="hidden sm:inline">Batalkan</span>
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="hidden sm:inline">Simpan Perubahan</span>
              <span className="sm:hidden">Simpan</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Kelengkapan Data Progress */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Kelengkapan Data</h2>
            <span className="text-2xl font-bold text-primary">{kelengkapanPersen}%</span>
          </div>
          <Progress value={kelengkapanPersen} className="h-2.5 mb-3" />
          {kelengkapanPersen === 100 ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Semua data perusahaan sudah lengkap
            </p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Pengisian data perusahaan ini masih {kelengkapanPersen}%. Lengkapi bagian berikut:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missingSections.map(s => (
                  <button
                    key={s.key}
                    onClick={() => scrollToSection(s.anchor)}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Foto Profil & Sampul */}
        <div id="foto" className="rounded-xl border border-border bg-card overflow-hidden scroll-mt-24">
          <div className="flex items-center gap-2 px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Foto Profil & Sampul</h3>
            {kelengkapan.foto ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground px-5 sm:px-6 mb-4">Upload logo perusahaan dan foto sampul utama yang akan ditampilkan di halaman perusahaan.</p>

          {/* Layout: Side by side on desktop, stacked on mobile */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Foto Profil (Logo) */}
              <div className="flex-shrink-0">
                <Label className="text-sm font-medium mb-2 block">Foto Profil (Logo)</Label>
                {formData.fotoProfil ? (
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-border bg-card group">
                    <img src={formData.fotoProfil} alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <Button size="sm" variant="secondary" className="gap-1 h-7 text-xs">
                        <Upload className="h-3 w-3" /> Ganti
                      </Button>
                      <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => updateField("fotoProfil", "")}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Upload Logo</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-1.5 block">Rasio 1:1 · 200×200px</span>
              </div>

              {/* Foto Sampul */}
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium mb-2 block">Foto Sampul Utama <span className="text-muted-foreground font-normal">(Landscape)</span></Label>
                {formData.fotoSampul ? (
                  <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden border border-border group">
                    <img src={formData.fotoSampul} alt="Sampul" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Upload className="h-3 w-3" /> Ganti
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateField("fotoSampul", "")}>
                        <Trash2 className="h-3 w-3" /> Hapus
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[3/1] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-foreground block">Upload Foto Sampul</span>
                      <span className="text-xs text-muted-foreground">Rasio 3:1 · 1200×400px</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Utama */}
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Informasi Utama Perusahaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Nama Perusahaan <span className="text-destructive">*</span></Label>
              <Input value={formData.nama} onChange={(e) => updateField("nama", e.target.value)} placeholder="Contoh: PT Telkom Indonesia" className={errors.nama ? "border-destructive" : ""} />
              {errors.nama && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.nama}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Nama Lokal (Opsional)</Label>
              <Input value={formData.namaLokal} onChange={(e) => updateField("namaLokal", e.target.value)} placeholder="Contoh: Telkom Indonesia" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Tipe Organisasi <span className="text-destructive">*</span></Label>
              <Select value={formData.tipeOrganisasi} onValueChange={(val) => updateField("tipeOrganisasi", val)}>
                <SelectTrigger className={errors.tipeOrganisasi ? "border-destructive" : ""}><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                <SelectContent>{tipeOrganisasiOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              {errors.tipeOrganisasi && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.tipeOrganisasi}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Sektor Industri <span className="text-destructive">*</span></Label>
              <Select value={formData.sektorIndustri} onValueChange={(val) => updateField("sektorIndustri", val)}>
                <SelectTrigger className={errors.sektorIndustri ? "border-destructive" : ""}><SelectValue placeholder="Pilih sektor" /></SelectTrigger>
                <SelectContent>{sektorIndustriOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              {errors.sektorIndustri && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.sektorIndustri}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Lokasi</Label>
              <Input value={formData.lokasi} onChange={(e) => updateField("lokasi", e.target.value)} placeholder="Contoh: Jakarta" />
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border">
            <span>ID: {id}</span>
            <span>Terakhir diperbarui: 2026-01-13</span>
          </div>
        </div>

        {/* Ringkasan Perusahaan */}
        <div id="ringkasan" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Ringkasan Perusahaan</h3>
            {kelengkapan.ringkasan ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-4">Informasi ringkas mengenai skala dan kontak perusahaan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label className="text-sm mb-2 block">Jumlah Karyawan</Label><Input value={formData.jumlahKaryawan} onChange={(e) => updateField("jumlahKaryawan", e.target.value)} placeholder="Contoh: ± 24.000 karyawan" /></div>
            <div><Label className="text-sm mb-2 block">Peserta Program Karier</Label><Input value={formData.pesertaProgram} onChange={(e) => updateField("pesertaProgram", e.target.value)} placeholder="Contoh: 3.500+" /></div>
            <div><Label className="text-sm mb-2 block">Dream Company Count</Label><Input value={formData.dreamCompany} onChange={(e) => updateField("dreamCompany", e.target.value)} placeholder="Contoh: 5.000+" /></div>
            <div><Label className="text-sm mb-2 block">Alamat</Label><Input value={formData.alamat} onChange={(e) => updateField("alamat", e.target.value)} placeholder="Jl. Japati No.1, Bandung" /></div>
            <div><Label className="text-sm mb-2 block">Email</Label><Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="corporate@telkom.co.id" /></div>
            <div><Label className="text-sm mb-2 block">Website</Label><Input value={formData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="www.telkom.co.id" /></div>
          </div>
        </div>

        {/* Tentang Perusahaan */}
        <div id="tentang" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Tentang Perusahaan</h3>
            {kelengkapan.tentang ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-4">Tulis deskripsi dalam beberapa paragraf: identitas, produk/layanan, dan karakter organisasi.</p>
          {formData.tentang.map((p, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-muted-foreground">Paragraf {idx + 1}</Label>
                {formData.tentang.length > 1 && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10" onClick={() => updateField("tentang", formData.tentang.filter((_, i) => i !== idx))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Textarea value={p} onChange={(e) => { const n = [...formData.tentang]; n[idx] = e.target.value; updateField("tentang", n); }} rows={3} />
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => updateField("tentang", [...formData.tentang, ""])}>
            <Plus className="h-3.5 w-3.5" /> Tambah Paragraf
          </Button>
        </div>

        {/* Visual Pendukung */}
        <div id="gambar" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Visual Pendukung</h3>
            {kelengkapan.gambar ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">Maksimal 4 gambar (kantor, aktivitas karyawan, infrastruktur, leadership team).</p>
          <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 bg-accent/50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
            Visual pendukung ini akan disematkan pada section <strong>Tentang Perusahaan</strong> di halaman detail.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {formData.gambar.map((url, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group">
                <img src={url} alt={`Visual ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateField("gambar", formData.gambar.filter((_, i) => i !== idx))}>
                    <Trash2 className="h-3 w-3" /> Hapus
                  </Button>
                </div>
              </div>
            ))}
            {formData.gambar.length < 4 && (
              <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </div>
            )}
          </div>
        </div>

        {/* Visi */}
        <div id="visi" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Visi Perusahaan</h3>
            {kelengkapan.visi ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">Arah jangka panjang dan aspirasi strategis perusahaan.</p>
          <Textarea value={formData.visi} onChange={(e) => updateField("visi", e.target.value)} placeholder="Masukkan visi perusahaan..." rows={2} />
        </div>

        {/* Misi */}
        <div id="misi" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Misi Perusahaan</h3>
            {kelengkapan.misi ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">Langkah strategis dalam mewujudkan visi.</p>
          {formData.misi.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
              <Input value={m} onChange={(e) => { const n = [...formData.misi]; n[idx] = e.target.value; updateField("misi", n); }} className="flex-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0" onClick={() => updateField("misi", formData.misi.filter((_, i) => i !== idx))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5 mt-1" onClick={() => updateField("misi", [...formData.misi, ""])}>
            <Plus className="h-3.5 w-3.5" /> Tambah Misi
          </Button>
        </div>

        {/* Capaian */}
        <div id="capaian" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Capaian Perusahaan</h3>
            {kelengkapan.capaian ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">Format: Tahun – Nama Penghargaan – Lembaga Pemberi.</p>
          {formData.capaian.map((c, idx) => (
            <div key={idx} className="grid grid-cols-[80px_1fr_1fr_40px] gap-2 mb-2 items-center">
              <Input value={c.tahun} onChange={(e) => { const n = [...formData.capaian]; n[idx] = { ...c, tahun: e.target.value }; updateField("capaian", n); }} placeholder="2024" className="text-center" />
              <Input value={c.nama} onChange={(e) => { const n = [...formData.capaian]; n[idx] = { ...c, nama: e.target.value }; updateField("capaian", n); }} placeholder="Nama penghargaan" />
              <Input value={c.lembaga} onChange={(e) => { const n = [...formData.capaian]; n[idx] = { ...c, lembaga: e.target.value }; updateField("capaian", n); }} placeholder="Lembaga pemberi" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => updateField("capaian", formData.capaian.filter((_, i) => i !== idx))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5 mt-1" onClick={() => updateField("capaian", [...formData.capaian, { tahun: "", nama: "", lembaga: "" }])}>
            <Plus className="h-3.5 w-3.5" /> Tambah Capaian
          </Button>
        </div>

        {/* Dokumen Publik */}
        <div id="dokumen" className="rounded-xl border border-border bg-card p-5 sm:p-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Dokumen Publik</h3>
            {kelengkapan.dokumen ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> : <XCircle className="h-4 w-4 text-destructive ml-auto" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">Daftar dokumen resmi perusahaan dengan tautan langsung.</p>
          <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Link harus diawali dengan <code className="px-1 py-0.5 rounded bg-muted font-mono text-[11px]">https://</code>, <code className="px-1 py-0.5 rounded bg-muted font-mono text-[11px]">http://</code>, atau <code className="px-1 py-0.5 rounded bg-muted font-mono text-[11px]">www.</code>
          </p>
          {/* Header */}
          {formData.dokumenPublik.length > 0 && (
            <div className="grid grid-cols-[1fr_2fr_2fr_40px] gap-2 mb-2 items-center">
              <span className="text-xs font-medium text-muted-foreground">Nama</span>
              <span className="text-xs font-medium text-muted-foreground">URL Asli</span>
              <span className="text-xs font-medium text-muted-foreground">URL Rextra (auto)</span>
              <span />
            </div>
          )}
          {formData.dokumenPublik.map((doc, idx) => {
            const autoRextraUrl = doc.nama.trim()
              ? generateRextraUrl(doc.nama, formData.namaLokal || formData.nama)
              : "";
            return (
              <div key={idx} className="grid grid-cols-[1fr_2fr_2fr_40px] gap-2 mb-2 items-center">
                <Input
                  value={doc.nama}
                  onChange={(e) => {
                    const n = [...formData.dokumenPublik];
                    const newName = e.target.value;
                    const newRextra = newName.trim()
                      ? generateRextraUrl(newName, formData.namaLokal || formData.nama)
                      : "";
                    n[idx] = { ...doc, nama: newName, urlRextra: newRextra };
                    updateField("dokumenPublik", n);
                  }}
                  placeholder="Nama dokumen"
                />
                <Input
                  value={doc.url}
                  onChange={(e) => {
                    const n = [...formData.dokumenPublik];
                    n[idx] = { ...doc, url: e.target.value };
                    updateField("dokumenPublik", n);
                  }}
                  placeholder="https://example.com/dokumen.pdf"
                />
                <div className="flex items-center gap-1.5">
                  <Input
                    value={autoRextraUrl}
                    readOnly
                    className="bg-muted/50 text-muted-foreground text-xs font-mono cursor-default"
                    placeholder="Auto-generate dari nama"
                  />
                  {autoRextraUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(autoRextraUrl);
                        toast({ title: "Disalin!", description: autoRextraUrl });
                      }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => updateField("dokumenPublik", formData.dokumenPublik.filter((_, i) => i !== idx))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
          <Button variant="outline" size="sm" className="gap-1.5 mt-1" onClick={() => updateField("dokumenPublik", [...formData.dokumenPublik, { nama: "", url: "", urlRextra: "" }])}>
            <Plus className="h-3.5 w-3.5" /> Tambah Dokumen
          </Button>
        </div>

        {/* Bottom spacer for FAB */}
        <div className="h-20" />
      </div>

      {/* Floating Action Button - completeness navigator */}
      {kelengkapanPersen < 100 && (
        <div className="fixed bottom-6 right-6 z-30">
          <div className={cn("transition-all duration-300", showFab ? "mb-2" : "")}>
            {showFab && (
              <div className="bg-card border border-border rounded-lg shadow-lg p-3 mb-2 w-64 animate-in slide-in-from-bottom-2 fade-in">
                <p className="text-xs font-semibold text-foreground mb-2">Section belum lengkap:</p>
                <div className="space-y-1">
                  {missingSections.map(s => (
                    <button key={s.key} onClick={() => scrollToSection(s.anchor)} className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-muted text-sm text-foreground transition-colors">
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button
              onClick={() => setShowFab(!showFab)}
              className="h-12 w-12 rounded-full shadow-lg gap-0 p-0"
              variant="destructive"
            >
              {showFab ? <X className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {missingSections.length}
            </Badge>
          </div>
        </div>
      )}

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
                      kelengkapanPersen === level
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

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keluar tanpa menyimpan?</DialogTitle>
            <DialogDescription>Perubahan yang belum disimpan akan hilang.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Kembali Edit</Button>
            <Button variant="destructive" onClick={handleConfirmExit}>Ya, Keluar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
