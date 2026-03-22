import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Download,
  Eye,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { RextraTableHeader } from "@/components/shared/RextraTableHeader";
import { RextraTablePagination } from "@/components/shared/RextraTablePagination";
import { cn } from "@/lib/utils";
import { ExportDataDialog } from "@/components/shared/ExportDataDialog";
import { MahasiswaVisualization } from "@/components/kenali-diri/MahasiswaVisualization";
import { ExpertVisualization } from "@/components/kenali-diri/ExpertVisualization";
import { ExpertDetailDrawer } from "@/components/kenali-diri/ExpertDetailDrawer";
import { ExpertDeleteDialog } from "@/components/kenali-diri/ExpertDeleteDialog";
import { MahasiswaDetailDrawer } from "@/components/kenali-diri/MahasiswaDetailDrawer";
import { MahasiswaDeleteDialog } from "@/components/kenali-diri/MahasiswaDeleteDialog";
import { toast } from "sonner";

// Mahasiswa feedback type
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

// Mock data for Mahasiswa feedback (Likert 1-7)
const mahasiswaFeedbackData: MahasiswaFeedback[] = [
  {
    id: "MHS001",
    userName: "Siti Nurhaliza",
    kemudahanTes: 6,
    relevansiRekomendasi: 5,
    kepuasanFitur: 6,
    kendala: ["Waktu loading lama", "Tampilan kurang responsif"],
    masukan: "Secara keseluruhan tes ini cukup membantu, tapi ada beberapa bagian yang perlu diperbaiki terutama kecepatan loading.",
    tanggal: "10 Des 2025",
    programStudi: "Teknik Informatika",
    angkatan: "2021",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS002",
    userName: "Budi Santoso",
    kemudahanTes: 7,
    relevansiRekomendasi: 7,
    kepuasanFitur: 6,
    kendala: [],
    masukan: "Sangat membantu dalam mengenali potensi karier saya. Terima kasih!",
    tanggal: "09 Des 2025",
    programStudi: "Manajemen",
    angkatan: "2022",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS003",
    userName: "Rina Wulandari",
    kemudahanTes: 4,
    relevansiRekomendasi: 3,
    kepuasanFitur: 4,
    kendala: ["Pertanyaan membingungkan", "Hasil kurang akurat", "Tidak ada penjelasan detail"],
    masukan: "Beberapa pertanyaan kurang jelas maksudnya. Hasil yang keluar juga tidak terlalu sesuai dengan ekspektasi saya.",
    tanggal: "08 Des 2025",
    programStudi: "Psikologi",
    angkatan: "2020",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS004",
    userName: "Andi Pratama",
    kemudahanTes: 5,
    relevansiRekomendasi: 6,
    kepuasanFitur: 5,
    kendala: ["Navigasi kurang jelas"],
    tanggal: "07 Des 2025",
    programStudi: "Teknik Elektro",
    angkatan: "2021",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS005",
    userName: "Dewi Lestari",
    kemudahanTes: 7,
    relevansiRekomendasi: 6,
    kepuasanFitur: 7,
    kendala: [],
    masukan: "Fitur ini sangat bermanfaat untuk mahasiswa yang bingung menentukan arah karier.",
    tanggal: "06 Des 2025",
    programStudi: "Akuntansi",
    angkatan: "2022",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS006",
    userName: "Ahmad Rizki",
    kemudahanTes: 6,
    relevansiRekomendasi: 5,
    kepuasanFitur: 6,
    kendala: ["Loading terlalu lama"],
    tanggal: "05 Des 2025",
    programStudi: "Sistem Informasi",
    angkatan: "2021",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS007",
    userName: "Putri Handayani",
    kemudahanTes: 3,
    relevansiRekomendasi: 4,
    kepuasanFitur: 3,
    kendala: ["Error saat submit", "Halaman tidak responsive", "Data hilang"],
    masukan: "Pengalaman kurang baik karena banyak error. Mohon diperbaiki.",
    tanggal: "04 Des 2025",
    programStudi: "Desain Komunikasi Visual",
    angkatan: "2020",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS008",
    userName: "Fajar Nugroho",
    kemudahanTes: 6,
    relevansiRekomendasi: 7,
    kepuasanFitur: 6,
    kendala: [],
    tanggal: "03 Des 2025",
    programStudi: "Teknik Mesin",
    angkatan: "2021",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS009",
    userName: "Maya Sari",
    kemudahanTes: 5,
    relevansiRekomendasi: 5,
    kepuasanFitur: 5,
    kendala: ["Font terlalu kecil"],
    masukan: "Ukuran font sebaiknya diperbesar agar lebih mudah dibaca.",
    tanggal: "02 Des 2025",
    programStudi: "Ilmu Komunikasi",
    angkatan: "2022",
    kategoriTes: "Tes Profil Karier",
  },
  {
    id: "MHS010",
    userName: "Reza Firmansyah",
    kemudahanTes: 7,
    relevansiRekomendasi: 6,
    kepuasanFitur: 7,
    kendala: [],
    masukan: "Sangat bagus! Rekomendasi profesinya akurat.",
    tanggal: "01 Des 2025",
    programStudi: "Teknik Informatika",
    angkatan: "2021",
    kategoriTes: "Tes Profil Karier",
  },
];

// Expert feedback type
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

// Mock data for Expert feedback
const expertFeedbackData: ExpertFeedback[] = [
  {
    id: "#FBX-00123",
    nama: "Dinda Aulia",
    profesi: "UI/UX Designer",
    gelar: "S.Kom",
    pengalamanTahun: 5,
    pendidikanTerakhir: "S1",
    perguruanTinggi: "Universitas Indonesia",
    programStudi: "Teknik Informatika",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["UI/UX Designer", "Product Designer", "Visual Designer", "Interaction Designer", "UX Researcher"],
    topNStatus: "P1",
    akurasi: 6,
    logika: 7,
    manfaat: 6,
    kendala: [],
    masukan: "Rekomendasi sangat akurat dan sesuai dengan profil saya. Penjelasan mengenai kecocokan profesi cukup detail dan membantu.",
    tanggal: "10 Des 2025",
  },
  {
    id: "#FBX-00124",
    nama: "Budi Hartono",
    profesi: "Data Scientist",
    gelar: "M.Sc",
    pengalamanTahun: 8,
    pendidikanTerakhir: "S2",
    perguruanTinggi: "Institut Teknologi Bandung",
    programStudi: "Ilmu Komputer",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Data Analyst", "Machine Learning Engineer", "Data Scientist", "Business Intelligence Analyst", "AI Researcher"],
    topNStatus: "P3-5",
    akurasi: 5,
    logika: 5,
    manfaat: 6,
    kendala: ["Penjelasan hasil tes terlalu panjang atau sulit dipahami"],
    masukan: "Profesi Data Scientist muncul di posisi 3, cukup relevan namun ada beberapa rekomendasi yang kurang sesuai dengan keahlian teknis yang saya miliki.",
    tanggal: "09 Des 2025",
  },
  {
    id: "#FBX-00125",
    nama: "Sari Indah",
    profesi: "Marketing Manager",
    gelar: "MBA",
    pengalamanTahun: 10,
    pendidikanTerakhir: "S2",
    perguruanTinggi: "Universitas Gadjah Mada",
    programStudi: "Manajemen",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Marketing Specialist", "Brand Manager", "Marketing Manager", "Digital Marketing", "Content Strategist"],
    topNStatus: "P3-5",
    akurasi: 6,
    logika: 6,
    manfaat: 7,
    kendala: [],
    masukan: "Rekomendasi cukup baik, namun urutan prioritas bisa lebih akurat jika mempertimbangkan pengalaman kerja yang lebih spesifik.",
    tanggal: "08 Des 2025",
  },
  {
    id: "#FBX-00126",
    nama: "Ahmad Fauzan",
    profesi: "Software Engineer",
    gelar: "S.T",
    pengalamanTahun: 6,
    pendidikanTerakhir: "S1",
    perguruanTinggi: "Universitas Brawijaya",
    programStudi: "Teknik Elektro",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Software Engineer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "System Architect"],
    topNStatus: "P1",
    akurasi: 7,
    logika: 7,
    manfaat: 7,
    kendala: [],
    masukan: "Sangat akurat! Profesi Software Engineer tepat di urutan pertama. Penjelasan logis dan komprehensif.",
    tanggal: "07 Des 2025",
  },
  {
    id: "#FBX-00127",
    nama: "Lisa Permata",
    profesi: "Financial Analyst",
    gelar: "S.E",
    pengalamanTahun: 4,
    pendidikanTerakhir: "S1",
    perguruanTinggi: "Universitas Airlangga",
    programStudi: "Akuntansi",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Accountant", "Auditor", "Tax Consultant", "Budget Analyst", "Controller"],
    topNStatus: "Tidak muncul",
    akurasi: 3,
    logika: 4,
    manfaat: 4,
    kendala: ["Ada pertanyaan yang membingungkan", "Penjelasan hasil tes terlalu panjang atau sulit dipahami"],
    masukan: "Profesi Financial Analyst tidak muncul di rekomendasi teratas. Hasil lebih mengarah ke akuntansi tradisional, padahal pekerjaan saya lebih ke analisis keuangan dan investasi.",
    tanggal: "06 Des 2025",
  },
  {
    id: "#FBX-00128",
    nama: "Rendi Kurniawan",
    profesi: "Product Manager",
    gelar: "S.Kom",
    pengalamanTahun: 7,
    pendidikanTerakhir: "S1",
    perguruanTinggi: "Universitas Binus",
    programStudi: "Sistem Informasi",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Business Analyst", "Product Manager", "Project Manager", "Scrum Master", "Product Owner"],
    topNStatus: "P2",
    akurasi: 6,
    logika: 6,
    manfaat: 6,
    kendala: ["Durasi tes terasa terlalu lama"],
    masukan: "Cukup akurat, Product Manager ada di posisi 2. Saran: pertanyaan bisa lebih ringkas tanpa mengurangi akurasi.",
    tanggal: "05 Des 2025",
  },
  {
    id: "#FBX-00129",
    nama: "Anisa Rahma",
    profesi: "HR Manager",
    gelar: "M.M",
    pengalamanTahun: 12,
    pendidikanTerakhir: "S2",
    perguruanTinggi: "Universitas Padjadjaran",
    programStudi: "Manajemen SDM",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["HR Manager", "Talent Acquisition Manager", "HR Business Partner", "People Operations", "Training Manager"],
    topNStatus: "P1",
    akurasi: 7,
    logika: 6,
    manfaat: 7,
    kendala: [],
    masukan: "Hasil sangat memuaskan dan sesuai dengan jalur karier saya. Rekomendasi relevan dan penjelasan mudah dipahami.",
    tanggal: "04 Des 2025",
  },
  {
    id: "#FBX-00130",
    nama: "Doni Pratama",
    profesi: "Graphic Designer",
    gelar: "S.Ds",
    pengalamanTahun: 3,
    pendidikanTerakhir: "S1",
    perguruanTinggi: "Institut Seni Indonesia",
    programStudi: "Desain Komunikasi Visual",
    kategoriTes: "Tes Profil Karier",
    top5Recommendations: ["Graphic Designer", "Visual Designer", "Creative Director", "Art Director", "Brand Designer"],
    topNStatus: "P1",
    akurasi: 7,
    logika: 7,
    manfaat: 6,
    kendala: [],
    masukan: "Rekomendasi tepat sasaran. Semua profesi yang direkomendasikan sangat relevan dengan bidang desain.",
    tanggal: "03 Des 2025",
  },
];

type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";
type KendalaFilter = "all" | "no-kendala" | "has-kendala";
type TopNFilter = "all" | "P1" | "P2" | "P3-5" | "Tidak muncul";

export default function UmpanBalik() {
  // Main tab: Mahasiswa vs Expert
  const [mainTab, setMainTab] = useState<"mahasiswa" | "validator">("mahasiswa");
  
  // Sub tab for Mahasiswa: Data Mentah vs Visualisasi
  const [subTab, setSubTab] = useState<"data-mentah" | "visualisasi">("data-mentah");
  
  // Sub tab for Expert: Data Mentah vs Visualisasi
  const [expertSubTab, setExpertSubTab] = useState<"data-mentah" | "visualisasi">("data-mentah");
  
  // Category dropdown state
  const [selectedCategory, setSelectedCategory] = useState("tes-profil-karier");
  
  // Filter & search states for Mahasiswa
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [kendalaFilter, setKendalaFilter] = useState<KendalaFilter>("all");
  
  // Filter & search states for Expert
  const [expertSearchQuery, setExpertSearchQuery] = useState("");
  const [expertSortOption, setExpertSortOption] = useState<SortOption>("newest");
  const [expertTopNFilter, setExpertTopNFilter] = useState<TopNFilter>("all");
  const [expertCategory, setExpertCategory] = useState("tes-profil-karier");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Expert Pagination
  const [expertCurrentPage, setExpertCurrentPage] = useState(1);
  const [expertRowsPerPage, setExpertRowsPerPage] = useState(25);
  
  // Modal states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedExpertFeedback, setSelectedExpertFeedback] = useState<ExpertFeedback | null>(null);
  const [isExpertDetailOpen, setIsExpertDetailOpen] = useState(false);
  const [isExpertDeleteOpen, setIsExpertDeleteOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<ExpertFeedback | null>(null);
  
  // Mahasiswa modal states
  const [selectedMahasiswaFeedback, setSelectedMahasiswaFeedback] = useState<MahasiswaFeedback | null>(null);
  const [isMahasiswaDetailOpen, setIsMahasiswaDetailOpen] = useState(false);
  const [isMahasiswaDeleteOpen, setIsMahasiswaDeleteOpen] = useState(false);
  const [mahasiswaToDelete, setMahasiswaToDelete] = useState<MahasiswaFeedback | null>(null);
  
  // Checkbox selection states
  const [selectedMahasiswaIds, setSelectedMahasiswaIds] = useState<string[]>([]);
  const [selectedExpertIds, setSelectedExpertIds] = useState<string[]>([]);

  // Total data count (simulated large dataset)
  const totalDataCount = 10000;
  const expertTotalDataCount = 2000;

  // Filter and sort Mahasiswa data
  const filteredMahasiswaData = useMemo(() => {
    let data = [...mahasiswaFeedbackData];
    
    // Search filter
    if (searchQuery) {
      data = data.filter((item) =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Kendala filter
    if (kendalaFilter === "no-kendala") {
      data = data.filter((item) => item.kendala.length === 0);
    } else if (kendalaFilter === "has-kendala") {
      data = data.filter((item) => item.kendala.length > 0);
    }
    
    // Sort
    switch (sortOption) {
      case "name-asc":
        data.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      case "name-desc":
        data.sort((a, b) => b.userName.localeCompare(a.userName));
        break;
      case "newest":
        data.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "oldest":
        data.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    
    return data;
  }, [searchQuery, sortOption, kendalaFilter]);

  const totalPages = Math.ceil(filteredMahasiswaData.length / rowsPerPage);
  const paginatedData = filteredMahasiswaData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleKendalaChange = (value: KendalaFilter) => {
    setKendalaFilter(value);
    setCurrentPage(1);
  };

  // Filter and sort Expert data
  const filteredExpertData = useMemo(() => {
    let data = [...expertFeedbackData];
    
    // Search filter
    if (expertSearchQuery) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(expertSearchQuery.toLowerCase())
      );
    }
    
    // Top N filter
    if (expertTopNFilter !== "all") {
      data = data.filter((item) => item.topNStatus === expertTopNFilter);
    }
    
    // Sort
    switch (expertSortOption) {
      case "name-asc":
        data.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case "name-desc":
        data.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
      case "newest":
        data.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "oldest":
        data.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    
    return data;
  }, [expertSearchQuery, expertSortOption, expertTopNFilter]);

  const expertTotalPages = Math.ceil(filteredExpertData.length / expertRowsPerPage);
  const paginatedExpertData = filteredExpertData.slice(
    (expertCurrentPage - 1) * expertRowsPerPage,
    expertCurrentPage * expertRowsPerPage
  );

  // Expert filter handlers
  const handleExpertSearchChange = (value: string) => {
    setExpertSearchQuery(value);
    setExpertCurrentPage(1);
  };

  const handleExpertSortChange = (value: SortOption) => {
    setExpertSortOption(value);
    setExpertCurrentPage(1);
  };

  const handleExpertTopNChange = (value: TopNFilter) => {
    setExpertTopNFilter(value);
    setExpertCurrentPage(1);
  };

  // Delete handler for Expert feedback
  const handleDeleteExpert = (feedback: ExpertFeedback) => {
    setFeedbackToDelete(feedback);
    setIsExpertDeleteOpen(true);
  };

  const confirmDeleteExpert = () => {
    if (feedbackToDelete) {
      toast.success(`Feedback ${feedbackToDelete.id} berhasil dihapus`, {
        description: `Feedback dari ${feedbackToDelete.nama} telah dihapus.`,
      });
      setFeedbackToDelete(null);
    }
  };

  // Delete handler for Mahasiswa feedback
  const handleDeleteMahasiswa = (feedback: MahasiswaFeedback) => {
    setMahasiswaToDelete(feedback);
    setIsMahasiswaDeleteOpen(true);
  };

  const confirmDeleteMahasiswa = () => {
    if (mahasiswaToDelete) {
      toast.success(`Feedback ${mahasiswaToDelete.id} berhasil dihapus`, {
        description: `Feedback dari ${mahasiswaToDelete.userName} telah dihapus.`,
      });
      setMahasiswaToDelete(null);
    }
  };

  // TopN badge component – REXTRA style
  const TopNBadge = ({ status }: { status: "P1" | "P2" | "P3-5" | "Tidak muncul" }) => {
    const styles: Record<string, string> = {
      "P1": "border-emerald-500 text-emerald-600 bg-emerald-50",
      "P2": "border-blue-500 text-blue-600 bg-blue-50",
      "P3-5": "border-amber-500 text-amber-600 bg-amber-50",
      "Tidak muncul": "border-muted-foreground/40 text-muted-foreground bg-muted",
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "inline-flex items-center justify-center px-4 py-1 rounded-lg border-[1.5px] text-sm font-medium min-w-[100px] cursor-help",
              styles[status] || styles["Tidak muncul"]
            )}>
              {status}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Urutan kemunculan profesi expert (atau yang sangat mirip) pada 5 rekomendasi teratas.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Score badge component – REXTRA style
  const ScoreBadge = ({ score }: { score: number }) => {
    const color = score >= 6
      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
      : score >= 4
        ? "bg-amber-50 text-amber-700 border-amber-300"
        : "bg-red-50 text-red-700 border-red-300";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("inline-flex items-center justify-center px-3 py-0.5 rounded-full border text-sm font-medium cursor-help", color)}>
              {score}/7
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Skala Likert 1-7</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Kendala chips component – REXTRA style
  const KendalaChips = ({ kendala }: { kendala: string[] }) => {
    if (kendala.length === 0) {
      return (
        <div className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground text-center font-medium">
          Tidak ada kendala
        </div>
      );
    }

    const displayCount = 2;
    const visibleKendala = kendala.slice(0, displayCount);
    const hiddenCount = kendala.length - displayCount;

    return (
      <div className="flex flex-col items-center gap-1.5 max-w-[220px] mx-auto">
        {visibleKendala.map((k, i) => (
          <div key={i} className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-center font-medium break-words whitespace-normal">
            {k}
          </div>
        ))}
        {hiddenCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-3 py-1 text-xs rounded-lg border border-border text-muted-foreground cursor-help font-medium">
                  +{hiddenCount} lainnya
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {kendala.slice(displayCount).map((k, i) => (
                    <p key={i}>{k}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Umpan Balik Fitur Kenali Diri
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Menyajikan data respon umpan balik pengguna fitur Kenali Diri.
            </p>
          </div>
          <Button
            onClick={() => setIsExportOpen(true)}
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Ekspor Data</span>
          </Button>
        </div>

        {/* Button Group: Mahasiswa vs Expert */}
        <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMainTab("mahasiswa")}
            className={`rounded-md px-4 transition-all ${
              mainTab === "mahasiswa"
                ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            Mahasiswa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMainTab("validator")}
            className={`rounded-md px-4 transition-all ${
              mainTab === "validator"
                ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            Expert
          </Button>
        </div>

        {/* Tab Menu: Data Mentah vs Visualisasi (only for Mahasiswa) */}
        {mainTab === "mahasiswa" && (
          <div className="flex gap-6 border-b border-border">
            <button
              onClick={() => setSubTab("data-mentah")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                subTab === "data-mentah"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Data Mentah
              {subTab === "data-mentah" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
            <button
              onClick={() => setSubTab("visualisasi")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                subTab === "visualisasi"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visualisasi
              {subTab === "visualisasi" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          </div>
        )}

        {/* Content based on main tab */}
        {mainTab === "mahasiswa" ? (
          <div className="space-y-6">

            {subTab === "data-mentah" ? (
              <>
                {/* Filter & Search Section */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">
                      Kontrol & Pencarian Data
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Category Dropdown */}
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                          <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                          <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Search and Filter Controls - Only show when "Tes Profil Karier" selected */}
                      {selectedCategory === "tes-profil-karier" && (
                        <>
                          {/* Sort Dropdown */}
                          <Select
                            value={sortOption}
                            onValueChange={(value) => handleSortChange(value as SortOption)}
                          >
                            <SelectTrigger className="w-full md:w-[200px]">
                              <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name-asc">Nama pengguna A–Z</SelectItem>
                              <SelectItem value="name-desc">Nama pengguna Z–A</SelectItem>
                              <SelectItem value="newest">Feedback terbaru</SelectItem>
                              <SelectItem value="oldest">Feedback terlama</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Kendala Filter */}
                          <Select
                            value={kendalaFilter}
                            onValueChange={(value) => handleKendalaChange(value as KendalaFilter)}
                          >
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue placeholder="Kendala" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua</SelectItem>
                              <SelectItem value="no-kendala">Tidak ada kendala</SelectItem>
                              <SelectItem value="has-kendala">Ada kendala</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {/* Search Bar - Paling Kanan */}
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Ketik nama pengguna…"
                              className="pl-10"
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Table - Only show when "Tes Profil Karier" selected */}
                {selectedCategory === "tes-profil-karier" && (
                  <div className="bg-card rounded-2xl border border-border">
                    <RextraTableHeader
                      title="List Data"
                      subtitle={`Menampilkan ${Math.min(rowsPerPage, filteredMahasiswaData.length)} dari ${totalDataCount.toLocaleString("id-ID")} data umpan balik`}
                      actions={
                        <>
                          <Button className="border-destructive border bg-destructive/5 hover:bg-destructive/10 text-destructive shadow-none gap-2">
                            <Trash2 className="w-4 h-4" />
                            Hapus Data
                          </Button>
                          <Button onClick={() => setIsExportOpen(true)} className="border-primary border bg-primary/5 hover:bg-primary/10 text-primary shadow-none gap-2">
                            Ekspor Data
                            <UploadCloud className="w-4 h-4" />
                          </Button>
                        </>
                      }
                    />
                    <div className="overflow-x-auto">
                      <div className="min-w-[700px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]">
                                  <Checkbox
                                    checked={paginatedData.length > 0 && selectedMahasiswaIds.length === paginatedData.length}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedMahasiswaIds(paginatedData.map((f) => f.id));
                                      } else {
                                        setSelectedMahasiswaIds([]);
                                      }
                                    }}
                                    aria-label="Pilih semua"
                                    className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </TableHead>
                                <TableHead className="w-[100px]">ID Feedback</TableHead>
                                <TableHead className="min-w-[150px]">Nama Pengguna</TableHead>
                                <TableHead className="text-center">Kemudahan Tes</TableHead>
                                <TableHead className="text-center">Relevansi Rekomendasi</TableHead>
                                <TableHead className="text-center">Kepuasan Fitur</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-center w-[120px]">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedData.map((feedback) => (
                                <TableRow
                                  key={feedback.id}
                                  className={`hover:bg-muted/30 transition-colors ${selectedMahasiswaIds.includes(feedback.id) ? 'bg-primary/5' : ''}`}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedMahasiswaIds.includes(feedback.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedMahasiswaIds([...selectedMahasiswaIds, feedback.id]);
                                        } else {
                                          setSelectedMahasiswaIds(selectedMahasiswaIds.filter((id) => id !== feedback.id));
                                        }
                                      }}
                                      aria-label={`Pilih ${feedback.userName}`}
                                      className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-sm text-muted-foreground">
                                    {feedback.id}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {feedback.userName}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <ScoreBadge score={feedback.kemudahanTes} />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <ScoreBadge score={feedback.relevansiRekomendasi} />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <ScoreBadge score={feedback.kepuasanFitur} />
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">
                                    {feedback.tanggal || "-"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setSelectedMahasiswaFeedback(feedback);
                                                setIsMahasiswaDetailOpen(true);
                                              }}
                                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Lihat Detail</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleDeleteMahasiswa(feedback)}
                                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Hapus Feedback</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <RextraTablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalDataCount}
                        itemsPerPage={rowsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(v) => { setRowsPerPage(v); setCurrentPage(1); }}
                      />
                  </div>
                )}
              </>
            ) : (
              // Visualisasi Tab
              <MahasiswaVisualization 
                selectedCategory={selectedCategory} 
                onCategoryChange={setSelectedCategory} 
              />
            )}
          </div>
        ) : (
          // Expert Tab Content
          <div className="space-y-6">
            {/* Tab Menu: Data Mentah vs Visualisasi for Expert */}
            <div className="flex gap-6 border-b border-border">
              <button
                onClick={() => setExpertSubTab("data-mentah")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  expertSubTab === "data-mentah"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Data Mentah
                {expertSubTab === "data-mentah" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
                )}
              </button>
              <button
                onClick={() => setExpertSubTab("visualisasi")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  expertSubTab === "visualisasi"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Visualisasi
                {expertSubTab === "visualisasi" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
                )}
              </button>
            </div>

            {expertSubTab === "data-mentah" ? (
              <>
                {/* Filter & Search Section for Expert */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">
                      Kontrol & Pencarian Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Category Dropdown */}
                      <Select
                        value={expertCategory}
                        onValueChange={setExpertCategory}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                          <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                          <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Search Bar */}
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ketik nama expert…"
                          className="pl-10"
                          value={expertSearchQuery}
                          onChange={(e) => handleExpertSearchChange(e.target.value)}
                        />
                      </div>
                      
                      {/* Sort Dropdown */}
                      <Select
                        value={expertSortOption}
                        onValueChange={(value) => handleExpertSortChange(value as SortOption)}
                      >
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name-asc">Nama A–Z</SelectItem>
                          <SelectItem value="name-desc">Nama Z–A</SelectItem>
                          <SelectItem value="newest">Feedback terbaru</SelectItem>
                          <SelectItem value="oldest">Feedback terlama</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Top N Filter */}
                      <Select
                        value={expertTopNFilter}
                        onValueChange={(value) => handleExpertTopNChange(value as TopNFilter)}
                      >
                        <SelectTrigger className="w-full md:w-[160px]">
                          <SelectValue placeholder="Status Top 5" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="P1">Muncul di P1</SelectItem>
                          <SelectItem value="P2">Muncul di P2</SelectItem>
                          <SelectItem value="P3-5">Muncul di P3–5</SelectItem>
                          <SelectItem value="Tidak muncul">Tidak muncul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Expert Data Table */}
                <div className="bg-card rounded-2xl border border-border">
                  <RextraTableHeader
                    title="List Data"
                    subtitle={`Menampilkan ${Math.min(expertRowsPerPage, filteredExpertData.length)} dari ${expertTotalDataCount.toLocaleString("id-ID")} data umpan balik`}
                    actions={
                      <>
                        <Button className="border-destructive border bg-destructive/5 hover:bg-destructive/10 text-destructive shadow-none gap-2">
                          <Trash2 className="w-4 h-4" />
                          Hapus Data
                        </Button>
                        <Button onClick={() => setIsExportOpen(true)} className="border-primary border bg-primary/5 hover:bg-primary/10 text-primary shadow-none gap-2">
                          Ekspor Data
                          <UploadCloud className="w-4 h-4" />
                        </Button>
                      </>
                    }
                  />
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">
                                <Checkbox
                                  checked={paginatedExpertData.length > 0 && selectedExpertIds.length === paginatedExpertData.length}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedExpertIds(paginatedExpertData.map((f) => f.id));
                                    } else {
                                      setSelectedExpertIds([]);
                                    }
                                  }}
                                  aria-label="Pilih semua"
                                  className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </TableHead>
                              <TableHead className="w-[100px]">ID Feedback</TableHead>
                              <TableHead className="min-w-[140px]">Nama Expert</TableHead>
                              <TableHead className="text-center">Akurasi</TableHead>
                              <TableHead className="text-center">Logika</TableHead>
                              <TableHead className="text-center">Manfaat</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead className="text-center w-[120px]">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedExpertData.map((feedback) => (
                              <TableRow
                                key={feedback.id}
                                className={`hover:bg-muted/30 transition-colors ${selectedExpertIds.includes(feedback.id) ? 'bg-primary/5' : ''}`}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedExpertIds.includes(feedback.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedExpertIds([...selectedExpertIds, feedback.id]);
                                      } else {
                                        setSelectedExpertIds(selectedExpertIds.filter((id) => id !== feedback.id));
                                      }
                                    }}
                                    aria-label={`Pilih ${feedback.nama}`}
                                    className="rounded-[4px] border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                  {feedback.id}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {feedback.nama}
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.akurasi} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.logika} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <ScoreBadge score={feedback.manfaat} />
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                  {feedback.tanggal}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              setSelectedExpertFeedback(feedback);
                                              setIsExpertDetailOpen(true);
                                            }}
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Lihat Detail</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteExpert(feedback)}
                                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Hapus Feedback</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <RextraTablePagination
                      currentPage={expertCurrentPage}
                      totalPages={expertTotalPages}
                      totalItems={expertTotalDataCount}
                      itemsPerPage={expertRowsPerPage}
                      onPageChange={setExpertCurrentPage}
                      onItemsPerPageChange={(v) => { setExpertRowsPerPage(v); setExpertCurrentPage(1); }}
                    />
                  </div>
              </>
            ) : (
              // Expert Visualisasi Tab
              <ExpertVisualization 
                selectedCategory={expertCategory} 
                onCategoryChange={setExpertCategory} 
              />
            )}
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <ExportDataDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

      {/* Expert Detail Drawer */}
      <ExpertDetailDrawer
        open={isExpertDetailOpen}
        onOpenChange={setIsExpertDetailOpen}
        feedback={selectedExpertFeedback}
      />

      {/* Expert Delete Dialog */}
      <ExpertDeleteDialog
        open={isExpertDeleteOpen}
        onOpenChange={setIsExpertDeleteOpen}
        feedbackId={feedbackToDelete?.id || null}
        expertName={feedbackToDelete?.nama || null}
        onConfirm={confirmDeleteExpert}
      />

      {/* Mahasiswa Detail Drawer */}
      <MahasiswaDetailDrawer
        open={isMahasiswaDetailOpen}
        onOpenChange={setIsMahasiswaDetailOpen}
        feedback={selectedMahasiswaFeedback}
      />

      {/* Mahasiswa Delete Dialog */}
      <MahasiswaDeleteDialog
        open={isMahasiswaDeleteOpen}
        onOpenChange={setIsMahasiswaDeleteOpen}
        feedbackId={mahasiswaToDelete?.id || null}
        userName={mahasiswaToDelete?.userName || null}
        onConfirm={confirmDeleteMahasiswa}
      />
    </DashboardLayout>
  );
}
