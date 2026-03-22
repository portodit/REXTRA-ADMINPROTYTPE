import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Target, Brain, Award, ChevronDown, Lightbulb, FileX } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ExpertVisualizationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Mock data for expert feedback
const expertFeedbackData = [
  { akurasi: 6, logika: 7, manfaat: 6, topNStatus: "P1", kendala: [] },
  { akurasi: 5, logika: 5, manfaat: 6, topNStatus: "P3-5", kendala: ["Penjelasan hasil tes terlalu panjang"] },
  { akurasi: 6, logika: 6, manfaat: 7, topNStatus: "P3-5", kendala: [] },
  { akurasi: 7, logika: 7, manfaat: 7, topNStatus: "P1", kendala: [] },
  { akurasi: 3, logika: 4, manfaat: 4, topNStatus: "Tidak muncul", kendala: ["Ada pertanyaan yang membingungkan", "Penjelasan hasil tes sulit dipahami"] },
  { akurasi: 6, logika: 6, manfaat: 6, topNStatus: "P2", kendala: ["Durasi tes terasa terlalu lama"] },
  { akurasi: 7, logika: 6, manfaat: 7, topNStatus: "P1", kendala: [] },
  { akurasi: 7, logika: 7, manfaat: 6, topNStatus: "P1", kendala: [] },
  { akurasi: 5, logika: 5, manfaat: 5, topNStatus: "P2", kendala: [] },
  { akurasi: 4, logika: 4, manfaat: 5, topNStatus: "P3-5", kendala: ["Tampilan atau navigasi membingungkan"] },
];

// Mock participant data
const participantData = {
  weekly: [
    { name: "Sen", assessed: 3, feedback: 2 },
    { name: "Sel", assessed: 5, feedback: 4 },
    { name: "Rab", assessed: 4, feedback: 3 },
    { name: "Kam", assessed: 6, feedback: 5 },
    { name: "Jum", assessed: 8, feedback: 7 },
    { name: "Sab", assessed: 2, feedback: 2 },
    { name: "Min", assessed: 1, feedback: 1 },
  ],
  monthly: [
    { name: "Minggu 1", assessed: 15, feedback: 12 },
    { name: "Minggu 2", assessed: 22, feedback: 18 },
    { name: "Minggu 3", assessed: 28, feedback: 24 },
    { name: "Minggu 4", assessed: 20, feedback: 16 },
  ],
  allTime: [
    { name: "Jan", assessed: 45, feedback: 38 },
    { name: "Feb", assessed: 52, feedback: 44 },
    { name: "Mar", assessed: 68, feedback: 55 },
    { name: "Apr", assessed: 75, feedback: 62 },
    { name: "Mei", assessed: 82, feedback: 70 },
    { name: "Jun", assessed: 90, feedback: 78 },
  ],
};

// Period options based on granularity
const periodOptions = {
  weekly: [
    { value: "16-22-des-2025", label: "16–22 Des 2025" },
    { value: "09-15-des-2025", label: "09–15 Des 2025" },
    { value: "02-08-des-2025", label: "02–08 Des 2025" },
    { value: "25-01-des-2025", label: "25 Nov–01 Des 2025" },
  ],
  monthly: [
    { value: "des-2025", label: "Desember 2025" },
    { value: "nov-2025", label: "November 2025" },
    { value: "okt-2025", label: "Oktober 2025" },
    { value: "sep-2025", label: "September 2025" },
  ],
  allTime: [
    { value: "jan-des-2025", label: "Jan 2025–Des 2025" },
    { value: "jan-jun-2025", label: "Jan 2025–Jun 2025" },
    { value: "jul-des-2025", label: "Jul 2025–Des 2025" },
  ],
};

const COLORS = {
  primary: "#3B82F6",
  secondary: "#93C5FD",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
};

export function ExpertVisualization({ selectedCategory, onCategoryChange }: ExpertVisualizationProps) {
  const [timeGranularity, setTimeGranularity] = useState<"weekly" | "monthly" | "allTime">("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periodOptions.monthly[0].value);

  // Handle granularity change - reset period to first option
  const handleGranularityChange = (value: "weekly" | "monthly" | "allTime") => {
    setTimeGranularity(value);
    setSelectedPeriod(periodOptions[value][0].value);
  };

  // Get current period label
  const getCurrentPeriodLabel = () => {
    const options = periodOptions[timeGranularity];
    const found = options.find(opt => opt.value === selectedPeriod);
    return found?.label || options[0].label;
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    switch (selectedCategory) {
      case "tes-profil-karier":
        return "Tes Profil Karier";
      case "tes-riasec":
        return "Tes RIASEC";
      case "tes-kepribadian":
        return "Tes Kepribadian";
      default:
        return "Tes Profil Karier";
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFeedback = expertFeedbackData.length;
    const avgAkurasi = expertFeedbackData.reduce((sum, d) => sum + d.akurasi, 0) / totalFeedback;
    const avgLogika = expertFeedbackData.reduce((sum, d) => sum + d.logika, 0) / totalFeedback;
    const avgManfaat = expertFeedbackData.reduce((sum, d) => sum + d.manfaat, 0) / totalFeedback;

    return {
      totalFeedback,
      avgAkurasi: avgAkurasi.toFixed(1),
      avgLogika: avgLogika.toFixed(1),
      avgManfaat: avgManfaat.toFixed(1),
      prevPeriodLabel: timeGranularity === "weekly" ? "minggu sebelumnya" : timeGranularity === "monthly" ? "bulan sebelumnya" : "periode sebelumnya",
    };
  }, [timeGranularity]);

  // Distribution data for bar charts
  const prepareDistributionData = (field: "akurasi" | "logika" | "manfaat") => {
    const distribution = Array(7).fill(0);
    expertFeedbackData.forEach((item) => {
      distribution[item[field] - 1]++;
    });
    return distribution.map((count, index) => ({
      score: index + 1,
      count,
      percentage: ((count / expertFeedbackData.length) * 100).toFixed(1),
    }));
  };

  // Get max count for Y-axis domain
  const getMaxCount = (field: "akurasi" | "logika" | "manfaat") => {
    const data = prepareDistributionData(field);
    const max = Math.max(...data.map(d => d.count));
    return Math.ceil(max / 2) * 2 + 2; // Round up to even number + buffer
  };

  // Top N Status distribution
  const topNDistribution = useMemo(() => {
    const counts = { P1: 0, P2: 0, "P3-5": 0, "Tidak muncul": 0 };
    expertFeedbackData.forEach((item) => {
      counts[item.topNStatus as keyof typeof counts]++;
    });
    return [
      { name: "P1 (Peringkat 1)", value: counts.P1, color: COLORS.success },
      { name: "P2 (Peringkat 2)", value: counts.P2, color: COLORS.primary },
      { name: "P3–5 (Peringkat 3–5)", value: counts["P3-5"], color: COLORS.warning },
      { name: "Tidak Muncul", value: counts["Tidak muncul"], color: COLORS.danger },
    ];
  }, []);

  // Kendala distribution
  const kendalaDistribution = useMemo(() => {
    const kendalaCount: Record<string, number> = {};
    let noKendala = 0;
    expertFeedbackData.forEach((item) => {
      if (item.kendala.length === 0) {
        noKendala++;
      } else {
        item.kendala.forEach((k) => {
          kendalaCount[k] = (kendalaCount[k] || 0) + 1;
        });
      }
    });
    const details = Object.entries(kendalaCount)
      .map(([name, count]) => ({ 
        name, 
        count,
        percentage: ((count / expertFeedbackData.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      hasKendala: expertFeedbackData.length - noKendala,
      noKendala,
      details,
      total: expertFeedbackData.length,
    };
  }, []);

  // Get max count for kendala bar chart
  const getMaxKendalaCount = () => {
    if (kendalaDistribution.details.length === 0) return 5;
    const max = Math.max(...kendalaDistribution.details.map(d => d.count));
    return Math.ceil(max / 2) * 2 + 2;
  };

  const getParticipantData = () => {
    switch (timeGranularity) {
      case "weekly":
        return participantData.weekly;
      case "monthly":
        return participantData.monthly;
      case "allTime":
        return participantData.allTime;
    }
  };

  // Calculate trend insights
  const trendInsights = useMemo(() => {
    const data = getParticipantData();
    const peakAssess = data.reduce((max, d) => d.assessed > max.assessed ? d : max, data[0]);
    const peakFeedback = data.reduce((max, d) => d.feedback > max.feedback ? d : max, data[0]);
    const peakGap = data.reduce((max, d) => (d.assessed - d.feedback) > (max.assessed - max.feedback) ? d : max, data[0]);
    
    return {
      peakAssessBucket: peakAssess.name,
      peakAssessValue: peakAssess.assessed,
      peakFeedbackBucket: peakFeedback.name,
      peakFeedbackValue: peakFeedback.feedback,
      peakGapBucket: peakGap.name,
      gapAssess: peakGap.assessed,
      gapFeedback: peakGap.feedback,
    };
  }, [timeGranularity]);

  // Calculate likert insights
  const getLikertInsights = (field: "akurasi" | "logika" | "manfaat") => {
    const data = prepareDistributionData(field);
    const dominant = data.reduce((max, d) => d.count > max.count ? d : max, data[0]);
    const lowScoreCount = data.filter(d => d.score <= 3).reduce((sum, d) => sum + d.count, 0);
    const avg = field === "akurasi" ? stats.avgAkurasi : field === "logika" ? stats.avgLogika : stats.avgManfaat;
    
    return {
      dominantScore: dominant.score,
      dominantCount: dominant.count,
      avgScore: avg,
      lowScoreCount,
    };
  };

  // Custom tooltips
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-1">{label}</p>
          <p className="text-sm text-primary">Asesmen: {payload[0]?.value}</p>
          <p className="text-sm text-success">Feedback: {payload[1]?.value}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = topNDistribution.reduce((sum, d) => sum + d.value, 0);
      const pct = ((data.value / total) * 100).toFixed(0);
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} respon ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  const HistogramTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">Skor {label}</p>
          <p className="text-sm text-muted-foreground">{payload[0]?.value} respon</p>
        </div>
      );
    }
    return null;
  };

  const KendalaTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 max-w-xs">
          <p className="font-medium text-foreground text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.count} respon ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  // Insight Component with expand/collapse
  const InsightPanel = ({ 
    summary, 
    details 
  }: { 
    summary: string; 
    details: { label: string; value: string }[];
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed flex-1">
            <p className="font-medium">{summary}</p>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mt-2 font-medium transition-colors"
            >
              <span>{isOpen ? "Sembunyikan detail" : "Lihat detail lengkap"}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-3 space-y-1.5 pt-1">
                    {details.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ y: -10, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: index * 0.05 }}
                        className="text-xs"
                      >
                        <strong>{item.label}:</strong> {item.value}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Rounded bar shape
  const RoundedBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const radius = Math.min(4, width / 2);
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
      </g>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <FileX className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">Belum ada data pada periode ini</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Coba ubah Periode atau Kategori Tes untuk melihat ringkasan visual.
      </p>
    </div>
  );

  // Check if data exists (mock - always true for demo)
  const hasData = expertFeedbackData.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Visualisasi Data Umpan Balik Expert</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Ringkasan visual untuk memahami tren akurasi, logika penjelasan, manfaat rekomendasi, dan validitas hasil asesmen dari perspektif expert.
        </p>
      </div>

      {/* Controls - 3 Dropdowns */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Kontrol Visualisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kategori Tes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Kategori Tes</Label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori tes..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                  <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                  <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rentang Waktu */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Rentang Waktu</Label>
              <Select value={timeGranularity} onValueChange={(v) => handleGranularityChange(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih rentang waktu..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="allTime">Sepanjang Waktu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Periode */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Periode</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    timeGranularity === "monthly" ? "Pilih bulan..." :
                    timeGranularity === "weekly" ? "Pilih minggu..." :
                    "Pilih rentang..."
                  } />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions[timeGranularity].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasData ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Total Feedback</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalFeedback}</p>
                    <p className="text-xs text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> Naik 12% dibanding {stats.prevPeriodLabel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Rata-rata Akurasi</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgAkurasi}/7</p>
                    <p className="text-xs text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> Naik 5% dibanding {stats.prevPeriodLabel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Rata-rata Logika</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgLogika}/7</p>
                    <p className="text-xs text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> Naik 3% dibanding {stats.prevPeriodLabel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Rata-rata Manfaat</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgManfaat}/7</p>
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <TrendingDown className="h-3 w-3" /> Turun 2% dibanding {stats.prevPeriodLabel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart 1 & 2: Participant Trend & Top N Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart: Expert vs Feedback */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tren Expert Menyelesaikan Asesmen vs Mengisi Feedback</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()}
                  {timeGranularity === "monthly" && " (dibagi per minggu)"}
                  {timeGranularity === "weekly" && " (harian)"}
                  {timeGranularity === "allTime" && " (ringkasan bulanan)"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getParticipantData()}>
                      <defs>
                        <linearGradient id="expertAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expertFeedbackGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<TrendTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="assessed" name="Expert Selesai Asesmen" stroke={COLORS.primary} fill="url(#expertAreaGradient)" strokeWidth={2} />
                      <Area type="monotone" dataKey="feedback" name="Pengisi Feedback" stroke={COLORS.success} fill="url(#expertFeedbackGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <InsightPanel
                  summary={`Pengisian feedback mengikuti tren asesmen, namun gap paling besar terjadi di ${trendInsights.peakGapBucket}.`}
                  details={[
                    { label: "Bucket tertinggi asesmen", value: `${trendInsights.peakAssessBucket} (${trendInsights.peakAssessValue} expert)` },
                    { label: "Bucket tertinggi feedback", value: `${trendInsights.peakFeedbackBucket} (${trendInsights.peakFeedbackValue} respon)` },
                    { label: "Gap terbesar", value: `${trendInsights.peakGapBucket} (Asesmen ${trendInsights.gapAssess} vs Feedback ${trendInsights.gapFeedback})` },
                    { label: "Saran", value: "Tingkatkan reminder pengisian feedback setelah expert menyelesaikan asesmen." },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Pie Chart: Top N Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Distribusi Status Top 5</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={stats.totalFeedback}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topNDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {topNDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const topSlice = topNDistribution.reduce((max, d) => d.value > max.value ? d : max, topNDistribution[0]);
                  const minSlice = topNDistribution.reduce((min, d) => d.value < min.value ? d : min, topNDistribution[0]);
                  const topPct = ((topSlice.value / stats.totalFeedback) * 100).toFixed(0);
                  const minPct = ((minSlice.value / stats.totalFeedback) * 100).toFixed(0);
                  
                  return (
                    <InsightPanel
                      summary={`Status Top 5 didominasi ${topSlice.name} (${topPct}%).`}
                      details={[
                        { label: "Porsi terbesar", value: `${topSlice.name} = ${topSlice.value} respon (${topPct}%)` },
                        { label: "Porsi terkecil", value: `${minSlice.name} = ${minSlice.value} respon (${minPct}%)` },
                        { label: "Catatan", value: "Expert yang profesinya muncul di P1 menunjukkan akurasi rekomendasi tinggi." },
                        { label: "Saran", value: "Telusuri kasus \"Tidak Muncul\" untuk perbaikan pemetaan profesi." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Chart 3, 4, 5: Score Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Akurasi Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tingkat Akurasi Profil</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={stats.totalFeedback}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDistributionData("akurasi")} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                        domain={[0, getMaxCount("akurasi")]}
                        tickCount={5}
                      />
                      <Tooltip content={<HistogramTooltip />} />
                      <Bar dataKey="count" name="Jumlah" fill={COLORS.primary} shape={<RoundedBar />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const insights = getLikertInsights("akurasi");
                  return (
                    <InsightPanel
                      summary={`Mayoritas respon berada di skor ${insights.dominantScore}–7, menunjukkan penilaian cenderung tinggi.`}
                      details={[
                        { label: "Skor dominan", value: `${insights.dominantScore} (${insights.dominantCount} respon)` },
                        { label: "Skor rata-rata", value: `${insights.avgScore}/7` },
                        { label: "Skor rendah (≤3)", value: `${insights.lowScoreCount} respon` },
                        { label: "Saran", value: "Pertahankan algoritma pemetaan, fokus pada kasus skor rendah untuk perbaikan." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>

            {/* Logika Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tingkat Logika Penjelasan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={stats.totalFeedback}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDistributionData("logika")} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                        domain={[0, getMaxCount("logika")]}
                        tickCount={5}
                      />
                      <Tooltip content={<HistogramTooltip />} />
                      <Bar dataKey="count" name="Jumlah" fill={COLORS.purple} shape={<RoundedBar />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const insights = getLikertInsights("logika");
                  return (
                    <InsightPanel
                      summary={`Penilaian logika penjelasan cenderung positif dengan skor rata-rata ${insights.avgScore}/7.`}
                      details={[
                        { label: "Skor dominan", value: `${insights.dominantScore} (${insights.dominantCount} respon)` },
                        { label: "Skor rata-rata", value: `${insights.avgScore}/7` },
                        { label: "Skor rendah (≤3)", value: `${insights.lowScoreCount} respon` },
                        { label: "Saran", value: "Tingkatkan kualitas penjelasan untuk kasus-kasus yang masih mendapat skor menengah." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>

            {/* Manfaat Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tingkat Potensi Manfaat</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={stats.totalFeedback}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDistributionData("manfaat")} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                        domain={[0, getMaxCount("manfaat")]}
                        tickCount={5}
                      />
                      <Tooltip content={<HistogramTooltip />} />
                      <Bar dataKey="count" name="Jumlah" fill={COLORS.success} shape={<RoundedBar />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const insights = getLikertInsights("manfaat");
                  return (
                    <InsightPanel
                      summary={`Expert menilai rekomendasi berpotensi bermanfaat bagi mahasiswa dengan skor rata-rata ${insights.avgScore}/7.`}
                      details={[
                        { label: "Skor dominan", value: `${insights.dominantScore} (${insights.dominantCount} respon)` },
                        { label: "Skor rata-rata", value: `${insights.avgScore}/7` },
                        { label: "Skor rendah (≤3)", value: `${insights.lowScoreCount} respon` },
                        { label: "Saran", value: "Gunakan feedback expert untuk memperkuat narasi manfaat kepada mahasiswa." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Chart 6 & 7: Kendala */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kendala Pie Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tingkat Kendala Expert</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={kendalaDistribution.total}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Tidak ada kendala", value: kendalaDistribution.noKendala, color: COLORS.primary },
                          { name: "Ada kendala", value: kendalaDistribution.hasKendala, color: COLORS.warning },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill={COLORS.primary} />
                        <Cell fill={COLORS.warning} />
                      </Pie>
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          const total = kendalaDistribution.total;
                          const pct = ((Number(data.value) / total) * 100).toFixed(0);
                          return (
                            <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                              <p className="font-medium text-foreground">{data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.value} respon ({pct}%)</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const noKendalaPct = ((kendalaDistribution.noKendala / kendalaDistribution.total) * 100).toFixed(0);
                  const hasKendalaPct = ((kendalaDistribution.hasKendala / kendalaDistribution.total) * 100).toFixed(0);
                  const summary = kendalaDistribution.noKendala > kendalaDistribution.hasKendala
                    ? `Sebagian besar expert tidak mengalami kendala (${noKendalaPct}%).`
                    : `Proporsi expert yang mengalami kendala cukup signifikan (${hasKendalaPct}%).`;
                  
                  return (
                    <InsightPanel
                      summary={summary}
                      details={[
                        { label: "Tidak ada kendala", value: `${kendalaDistribution.noKendala} respon (${noKendalaPct}%)` },
                        { label: "Ada kendala", value: `${kendalaDistribution.hasKendala} respon (${hasKendalaPct}%)` },
                        { label: "Catatan", value: kendalaDistribution.noKendala > kendalaDistribution.hasKendala 
                          ? "Pengalaman validasi relatif lancar." 
                          : "Perlu evaluasi proses validasi lebih lanjut." },
                        { label: "Saran", value: "Telusuri detail kendala di chart Ragam Kendala untuk prioritas perbaikan." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>

            {/* Kendala Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Ragam Kendala Expert</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kategori {getCategoryDisplayName()} • {getCurrentPeriodLabel()} • N={kendalaDistribution.hasKendala}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {kendalaDistribution.details.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={kendalaDistribution.details} layout="vertical" barCategoryGap="15%">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                        <XAxis 
                          type="number" 
                          tick={{ fontSize: 12 }} 
                          tickLine={false} 
                          axisLine={false} 
                          allowDecimals={false}
                          domain={[0, getMaxKendalaCount()]}
                          tickCount={5}
                          label={{ value: 'Jumlah Respon', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 10 }} 
                          tickLine={false} 
                          axisLine={false} 
                          width={160}
                          tickFormatter={(value) => value.length > 25 ? value.substring(0, 25) + '...' : value}
                        />
                        <Tooltip content={<KendalaTooltip />} />
                        <Bar dataKey="count" name="Jumlah Respon" fill={COLORS.warning} shape={<RoundedBar />} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground italic">Tidak ada kendala yang dilaporkan oleh expert.</p>
                    </div>
                  )}
                </div>
                {kendalaDistribution.details.length > 0 && (() => {
                  const topObstacle = kendalaDistribution.details[0];
                  const secondObstacle = kendalaDistribution.details[1];
                  const topPct = ((topObstacle.count / kendalaDistribution.total) * 100).toFixed(0);
                  
                  return (
                    <InsightPanel
                      summary={`Kendala paling sering adalah "${topObstacle.name.length > 40 ? topObstacle.name.substring(0, 40) + '...' : topObstacle.name}" (${topObstacle.count} respon).`}
                      details={[
                        { label: "Top 1 kendala", value: `${topObstacle.name} = ${topObstacle.count} respon (${topPct}%)` },
                        ...(secondObstacle ? [{ 
                          label: "Top 2 kendala", 
                          value: `${secondObstacle.name} = ${secondObstacle.count} respon (${secondObstacle.percentage}%)` 
                        }] : []),
                        { label: "Total respon dengan kendala", value: `${kendalaDistribution.hasKendala} dari ${kendalaDistribution.total}` },
                        { label: "Saran", value: "Prioritaskan perbaikan pada kendala yang paling sering dilaporkan." },
                      ]}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
