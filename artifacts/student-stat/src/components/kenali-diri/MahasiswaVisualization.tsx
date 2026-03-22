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
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  MessageSquareText,
  ThumbsUp,
  Target,
  Smile,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

// Mock data for Mahasiswa feedback (Likert 1-7)
const mahasiswaFeedbackData = [
  { id: "MHS001", kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ["Durasi tes terasa terlalu lama", "Tampilan atau navigasi membingungkan"], date: "2025-05-01" },
  { id: "MHS002", kemudahanTes: 7, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [], date: "2025-05-01" },
  { id: "MHS003", kemudahanTes: 4, relevansiRekomendasi: 3, kepuasanFitur: 4, kendala: ["Ada pertanyaan yang membingungkan", "Penjelasan hasil tes terlalu panjang atau sulit dipahami", "Kendala lainnya"], date: "2025-05-02" },
  { id: "MHS004", kemudahanTes: 5, relevansiRekomendasi: 6, kepuasanFitur: 5, kendala: ["Tampilan atau navigasi membingungkan"], date: "2025-05-02" },
  { id: "MHS005", kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [], date: "2025-05-03" },
  { id: "MHS006", kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ["Durasi tes terasa terlalu lama"], date: "2025-05-03" },
  { id: "MHS007", kemudahanTes: 3, relevansiRekomendasi: 4, kepuasanFitur: 3, kendala: ["Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)", "Tampilan atau navigasi membingungkan", "Kendala lainnya"], date: "2025-05-04" },
  { id: "MHS008", kemudahanTes: 6, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [], date: "2025-05-04" },
  { id: "MHS009", kemudahanTes: 5, relevansiRekomendasi: 5, kepuasanFitur: 5, kendala: ["Penjelasan hasil tes terlalu panjang atau sulit dipahami"], date: "2025-05-05" },
  { id: "MHS010", kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [], date: "2025-05-05" },
  { id: "MHS011", kemudahanTes: 6, relevansiRekomendasi: 6, kepuasanFitur: 6, kendala: [], date: "2025-05-06" },
  { id: "MHS012", kemudahanTes: 2, relevansiRekomendasi: 2, kepuasanFitur: 2, kendala: ["Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)", "Ada pertanyaan yang membingungkan"], date: "2025-05-06" },
  { id: "MHS013", kemudahanTes: 7, relevansiRekomendasi: 7, kepuasanFitur: 7, kendala: [], date: "2025-05-07" },
  { id: "MHS014", kemudahanTes: 5, relevansiRekomendasi: 4, kepuasanFitur: 5, kendala: ["Durasi tes terasa terlalu lama"], date: "2025-05-07" },
  { id: "MHS015", kemudahanTes: 6, relevansiRekomendasi: 6, kepuasanFitur: 6, kendala: [], date: "2025-05-07" },
];

// Mock data for test participants (more than feedback submitters)
const testParticipantsData = {
  weekly: [
    { day: "Sen", pesertaTes: 25, pengisiFeedback: 8 },
    { day: "Sel", pesertaTes: 32, pengisiFeedback: 12 },
    { day: "Rab", pesertaTes: 28, pengisiFeedback: 10 },
    { day: "Kam", pesertaTes: 35, pengisiFeedback: 15 },
    { day: "Jum", pesertaTes: 40, pengisiFeedback: 18 },
    { day: "Sab", pesertaTes: 20, pengisiFeedback: 8 },
    { day: "Min", pesertaTes: 15, pengisiFeedback: 5 },
  ],
  monthly: [
    { week: "Week 1", pesertaTes: 120, pengisiFeedback: 45 },
    { week: "Week 2", pesertaTes: 145, pengisiFeedback: 58 },
    { week: "Week 3", pesertaTes: 160, pengisiFeedback: 72 },
    { week: "Week 4", pesertaTes: 180, pengisiFeedback: 85 },
  ],
  allTime: [
    { month: "Jan", pesertaTes: 450, pengisiFeedback: 180 },
    { month: "Feb", pesertaTes: 520, pengisiFeedback: 210 },
    { month: "Mar", pesertaTes: 580, pengisiFeedback: 245 },
    { month: "Apr", pesertaTes: 620, pengisiFeedback: 280 },
    { month: "Mei", pesertaTes: 680, pengisiFeedback: 320 },
  ],
};

// Previous period mock data for trend calculation
const previousPeriodData = {
  totalFeedback: 12,
  avgKemudahan: 5.1,
  avgRelevansi: 4.8,
  avgKepuasan: 4.9,
};

// Modern vibrant colors
const COLORS = {
  blue: "#6366F1",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#A855F7",
  cyan: "#06B6D4",
  pink: "#EC4899",
};

interface MahasiswaVisualizationProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function MahasiswaVisualization({ selectedCategory, onCategoryChange }: MahasiswaVisualizationProps) {
  const [timeRange, setTimeRange] = useState("weekly");

  // Get period label based on time range
  const getPeriodLabel = () => {
    switch (timeRange) {
      case "weekly":
        return "Data untuk periode 1–7 Mei 2025";
      case "monthly":
        return "Data untuk bulan Mei 2025 (dibagi per minggu)";
      case "all-time":
        return "Ringkasan bulanan: Jan 2025–Mei 2025";
      default:
        return "";
    }
  };

  // Get chart data based on time range
  const getParticipantData = () => {
    switch (timeRange) {
      case "weekly":
        return { data: testParticipantsData.weekly, xKey: "day" };
      case "monthly":
        return { data: testParticipantsData.monthly, xKey: "week" };
      case "all-time":
        return { data: testParticipantsData.allTime, xKey: "month" };
      default:
        return { data: testParticipantsData.weekly, xKey: "day" };
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mahasiswaFeedbackData.length;
    const avgKemudahan = mahasiswaFeedbackData.reduce((sum, d) => sum + d.kemudahanTes, 0) / total;
    const avgRelevansi = mahasiswaFeedbackData.reduce((sum, d) => sum + d.relevansiRekomendasi, 0) / total;
    const avgKepuasan = mahasiswaFeedbackData.reduce((sum, d) => sum + d.kepuasanFitur, 0) / total;

    const totalTrend = ((total - previousPeriodData.totalFeedback) / previousPeriodData.totalFeedback) * 100;
    const kemudahanTrend = ((avgKemudahan - previousPeriodData.avgKemudahan) / previousPeriodData.avgKemudahan) * 100;
    const relevansiTrend = ((avgRelevansi - previousPeriodData.avgRelevansi) / previousPeriodData.avgRelevansi) * 100;
    const kepuasanTrend = ((avgKepuasan - previousPeriodData.avgKepuasan) / previousPeriodData.avgKepuasan) * 100;

    return {
      total,
      avgKemudahan: avgKemudahan.toFixed(1),
      avgRelevansi: avgRelevansi.toFixed(1),
      avgKepuasan: avgKepuasan.toFixed(1),
      totalTrend: totalTrend.toFixed(0),
      kemudahanTrend: kemudahanTrend.toFixed(0),
      relevansiTrend: relevansiTrend.toFixed(0),
      kepuasanTrend: kepuasanTrend.toFixed(0),
    };
  }, []);

  // Prepare chart data with highlight for max value
  const prepareDistributionData = (key: "kemudahanTes" | "relevansiRekomendasi" | "kepuasanFitur", highlightColor: string) => {
    const data = [1, 2, 3, 4, 5, 6, 7].map((score) => ({
      score: score.toString(),
      count: mahasiswaFeedbackData.filter((d) => d[key] === score).length,
    }));

    const maxCount = Math.max(...data.map((d) => d.count));

    return data.map((d) => ({
      ...d,
      fill: d.count === maxCount && d.count > 0 ? highlightColor : `${highlightColor}30`,
    }));
  };

  // Calculate percentages for insights
  const calculateInsightData = (key: "kemudahanTes" | "relevansiRekomendasi" | "kepuasanFitur") => {
    const total = mahasiswaFeedbackData.length;
    const positif = mahasiswaFeedbackData.filter((d) => d[key] >= 6).length;
    const netral = mahasiswaFeedbackData.filter((d) => d[key] >= 4 && d[key] <= 5).length;
    const negatif = mahasiswaFeedbackData.filter((d) => d[key] <= 3).length;
    const avg = mahasiswaFeedbackData.reduce((sum, d) => sum + d[key], 0) / total;

    return {
      total,
      positif,
      netral,
      negatif,
      positifPct: Math.round((positif / total) * 100),
      netralPct: Math.round((netral / total) * 100),
      negatifPct: Math.round((negatif / total) * 100),
      avg: avg.toFixed(1),
    };
  };

  // Generate dynamic insight based on data
  const generateLikertInsight = (key: "kemudahanTes" | "relevansiRekomendasi" | "kepuasanFitur", metricName: string) => {
    const data = calculateInsightData(key);
    const { positifPct, netralPct, negatifPct, avg, total } = data;

    let insight = { ringkasan: "", detail: "", implikasi: "", aksi: "", catatan: "" };

    // Condition checks based on brief templates
    if (positifPct >= 70) {
      insight = {
        ringkasan: `Mayoritas respon menunjukkan penilaian yang sangat positif (rata-rata ${avg}/7).`,
        detail: `Sebaran skor terkonsentrasi pada nilai tinggi, dengan ${positifPct}% respon berada di skor 6–7.`,
        implikasi: `Pengalaman pengguna sudah kuat dan konsisten pada aspek ${metricName.toLowerCase()}.`,
        aksi: `Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah.`,
        catatan: "",
      };
    } else if (positifPct >= 55 && positifPct < 70) {
      insight = {
        ringkasan: `Penilaian cenderung positif, namun masih ada ruang perbaikan (rata-rata ${avg}/7).`,
        detail: `${positifPct}% respon berada pada skor 6–7, sementara sisanya tersebar di skor menengah dan rendah.`,
        implikasi: `Sebagian pengguna merasa terbantu, tetapi pengalaman belum merata untuk semua.`,
        aksi: `Identifikasi titik friksi dari respon kendala untuk meningkatkan konsistensi pengalaman.`,
        catatan: "",
      };
    } else if (positifPct >= 45 && positifPct < 55 && negatifPct < 30) {
      insight = {
        ringkasan: `Respon cenderung mengarah positif, tetapi sebaran masih cukup variatif (rata-rata ${avg}/7).`,
        detail: `Skor tinggi mulai dominan, namun skor menengah masih signifikan (${netralPct}%).`,
        implikasi: `Pengalaman sudah berada di jalur yang tepat, namun belum sepenuhnya konsisten bagi semua responden.`,
        aksi: `Perkuat kejelasan instruksi/hasil pada bagian yang paling sering memunculkan skor menengah.`,
        catatan: "",
      };
    } else if (netralPct >= 45) {
      insight = {
        ringkasan: `Penilaian berada pada level menengah, menunjukkan pengalaman yang belum konsisten (rata-rata ${avg}/7).`,
        detail: `Skor terkonsentrasi pada rentang 4–5 dengan proporsi ${netralPct}%.`,
        implikasi: `Pengguna belum merasakan nilai atau kemudahan yang kuat; ada potensi kebingungan atau ketidakjelasan manfaat.`,
        aksi: `Prioritaskan perbaikan pada elemen yang paling sering dipilih pada daftar kendala, lalu ukur ulang setelah iterasi.`,
        catatan: "",
      };
    } else if (negatifPct >= 45 && negatifPct < 55) {
      insight = {
        ringkasan: `Penilaian cenderung negatif dan perlu perhatian (rata-rata ${avg}/7).`,
        detail: `${negatifPct}% respon berada pada skor 1–3, mengindikasikan banyak pengguna belum terbantu/nyaman.`,
        implikasi: `Risiko penurunan kepercayaan terhadap hasil/experience meningkat.`,
        aksi: `Lakukan audit cepat pada alur utama dan konten (pertanyaan/hasil) yang paling sering memunculkan kendala.`,
        catatan: "",
      };
    } else if (negatifPct >= 55) {
      insight = {
        ringkasan: `Mayoritas respon menilai buruk pada aspek ini (rata-rata ${avg}/7).`,
        detail: `Sebaran skor berat di nilai rendah, dengan ${negatifPct}% respon berada pada skor 1–3.`,
        implikasi: `Pengalaman pengguna berada pada level risiko tinggi dan berpotensi menghambat penyelesaian tes atau penerimaan hasil.`,
        aksi: `Tangani akar masalah dari kendala paling dominan terlebih dahulu; lakukan perbaikan bertahap dan validasi ulang segera.`,
        catatan: "",
      };
    } else if (positifPct >= 35 && negatifPct >= 35) {
      insight = {
        ringkasan: `Pola respon terbelah menjadi dua kelompok yang kontras (rata-rata ${avg}/7).`,
        detail: `Skor tinggi (${positifPct}%) dan skor rendah (${negatifPct}%) sama-sama besar, menandakan pengalaman tidak merata.`,
        implikasi: `Ada segmen pengguna yang berjalan lancar, sementara segmen lain mengalami hambatan serius.`,
        aksi: `Segmentasikan analisis berdasarkan kategori/angkatan/perangkat untuk menemukan penyebab perbedaan pengalaman.`,
        catatan: "",
      };
    } else {
      insight = {
        ringkasan: `Sebaran skor relatif merata sehingga belum terlihat kecenderungan dominan.`,
        detail: `Skor positif, netral, dan negatif memiliki proporsi yang tidak jauh berbeda.`,
        implikasi: `Indikasi masalah belum spesifik; kemungkinan bergantung pada konteks pengguna atau kondisi saat mengerjakan tes.`,
        aksi: `Tambahkan analisis per segmen dan lihat kendala yang paling sering muncul.`,
        catatan: "",
      };
    }

    if (total < 30) {
      insight.catatan = `Jumlah respon masih terbatas (${total}), sehingga interpretasi bersifat indikatif dan perlu dikonfirmasi dengan sampel yang lebih besar.`;
    }

    return insight;
  };

  // Kendala analysis
  const kendalaAnalysis = useMemo(() => {
    const noKendala = mahasiswaFeedbackData.filter((d) => d.kendala.length === 0).length;
    const hasKendala = mahasiswaFeedbackData.length - noKendala;
    const total = mahasiswaFeedbackData.length;

    const kendalaTypes: Record<string, number> = {
      "Durasi tes terlalu lama": 0,
      "Pertanyaan membingungkan": 0,
      "Error/bug sistem": 0,
      "Penjelasan sulit dipahami": 0,
      "Navigasi membingungkan": 0,
      "Kendala lainnya": 0,
    };

    const kendalaMap: Record<string, string> = {
      "Durasi tes terasa terlalu lama": "Durasi tes terlalu lama",
      "Ada pertanyaan yang membingungkan": "Pertanyaan membingungkan",
      "Mengalami error/bug (macet, loading lama, atau tidak bisa lanjut)": "Error/bug sistem",
      "Penjelasan hasil tes terlalu panjang atau sulit dipahami": "Penjelasan sulit dipahami",
      "Tampilan atau navigasi membingungkan": "Navigasi membingungkan",
      "Kendala lainnya": "Kendala lainnya",
    };

    mahasiswaFeedbackData.forEach((d) => {
      d.kendala.forEach((k) => {
        const mapped = kendalaMap[k];
        if (mapped && kendalaTypes.hasOwnProperty(mapped)) {
          kendalaTypes[mapped]++;
        }
      });
    });

    const kendalaData = Object.entries(kendalaTypes)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);

    const maxKendala = Math.max(...kendalaData.map((d) => d.count));

    return {
      noKendala,
      hasKendala,
      noKendalaPct: Math.round((noKendala / total) * 100),
      hasKendalaPct: Math.round((hasKendala / total) * 100),
      kendalaData: kendalaData.map((d) => ({
        ...d,
        fill: d.count === maxKendala && d.count > 0 ? COLORS.red : `${COLORS.red}40`,
      })),
      total,
    };
  }, []);

  // Generate kendala insight
  const generateKendalaInsight = () => {
    const { noKendalaPct, hasKendalaPct, total } = kendalaAnalysis;

    if (noKendalaPct >= 80) {
      return {
        ringkasan: "Mayoritas responden tidak mengalami kendala saat menggunakan fitur.",
        detail: `${noKendalaPct}% memilih "Tidak ada kendala", sedangkan ${hasKendalaPct}% melaporkan kendala.`,
        implikasi: "Stabilitas alur dan pemahaman pengguna sudah baik.",
        aksi: "Fokus pada perbaikan minor dari kendala yang masih muncul agar pengalaman semakin konsisten.",
      };
    } else if (noKendalaPct >= 60) {
      return {
        ringkasan: "Sebagian besar pengguna berjalan lancar, namun kendala masih cukup terasa pada kelompok tertentu.",
        detail: `${hasKendalaPct}% responden melaporkan kendala, sehingga prioritas perbaikan masih diperlukan.`,
        implikasi: "Kendala dapat menurunkan persepsi kualitas meskipun mayoritas tetap dapat menyelesaikan tes.",
        aksi: `Prioritaskan jenis kendala teratas pada grafik "Ragam Kendala".`,
      };
    } else if (noKendalaPct >= 40) {
      return {
        ringkasan: "Kendala dialami oleh proporsi pengguna yang cukup besar.",
        detail: `Perbandingan "kendala" dan "tanpa kendala" relatif berimbang.`,
        implikasi: "Pengalaman pengguna tidak stabil dan berpotensi memicu putus di tengah proses tes.",
        aksi: "Jalankan perbaikan cepat pada kendala dominan dan ukur ulang pada periode berikutnya.",
      };
    } else {
      return {
        ringkasan: "Mayoritas responden mengalami kendala saat menggunakan fitur.",
        detail: `${hasKendalaPct}% responden melaporkan kendala, menandakan masalah sistemik.`,
        implikasi: "Risiko gagal menyelesaikan tes atau menurunnya kepercayaan terhadap hasil meningkat signifikan.",
        aksi: "Prioritaskan perbaikan kendala paling berat (bug/blocked flow) sebelum melakukan iterasi konten.",
      };
    }
  };

  // Generate ragam kendala insight
  const generateRagamKendalaInsight = () => {
    const { kendalaData } = kendalaAnalysis;
    const top1 = kendalaData[0];
    const top2 = kendalaData[1];

    if (top1 && top1.pct >= 40) {
      return {
        ringkasan: `Kendala paling dominan adalah "${top1.name}".`,
        detail: `Kendala ini dipilih oleh ${top1.pct}% responden yang melaporkan kendala.`,
        implikasi: "Perbaikan pada area ini berpotensi memberi dampak terbesar terhadap peningkatan pengalaman.",
        aksi: `Jadikan "${top1.name}" sebagai prioritas utama perbaikan pada iterasi terdekat.`,
      };
    } else if (top1 && top2 && top1.pct + top2.pct >= 50) {
      return {
        ringkasan: `Dua kendala utama yang paling sering muncul adalah "${top1.name}" dan "${top2.name}".`,
        detail: `Masing-masing menyumbang ${top1.pct}% dan ${top2.pct}%, sehingga dua isu ini mendominasi keluhan pengguna.`,
        implikasi: "Fokus perbaikan pada dua area tersebut kemungkinan besar menaikkan skor kemudahan dan kepuasan.",
        aksi: "Susun perbaikan bertahap: tangani yang menghambat alur terlebih dahulu, lalu perbaiki aspek pemahaman konten.",
      };
    } else if (top1 && top1.name === "Kendala lainnya" && top1.pct >= 25) {
      return {
        ringkasan: `Banyak respon masuk ke kategori "Kendala lainnya", sehingga isu belum terdefinisi dengan jelas.`,
        detail: "Ini mengindikasikan opsi kendala belum cukup merepresentasikan masalah yang dialami pengguna.",
        implikasi: "Analisis kendala menjadi kurang tajam karena detail masalah tersembunyi dalam kategori umum.",
        aksi: `Tambahkan input singkat (opsional) untuk menjelaskan "kendala lainnya" agar klasifikasi masalah lebih akurat.`,
      };
    } else {
      return {
        ringkasan: "Kendala tersebar pada banyak jenis, tanpa satu penyebab dominan.",
        detail: `Tidak ada kendala yang menonjol kuat; keluhan muncul dalam pola "long tail".`,
        implikasi: "Masalah kemungkinan dipengaruhi variasi konteks pengguna (perangkat, koneksi, cara membaca hasil).",
        aksi: "Lakukan pengelompokan kendala (teknis vs konten vs navigasi), lalu tangani per kelompok.",
      };
    }
  };

  // Generate participant trend insight
  const generateParticipantTrendInsight = () => {
    const { data } = getParticipantData();
    const lastTwo = data.slice(-2);
    const pesertaTrend = lastTwo.length === 2 ? lastTwo[1].pesertaTes - lastTwo[0].pesertaTes : 0;
    const feedbackTrend = lastTwo.length === 2 ? lastTwo[1].pengisiFeedback - lastTwo[0].pengisiFeedback : 0;

    if (pesertaTrend > 0 && feedbackTrend > 0) {
      return "Kenaikan jumlah peserta tes diikuti kenaikan pengisi feedback. Partisipasi feedback relatif sejalan dengan penggunaan tes.";
    } else if (pesertaTrend > 0 && feedbackTrend <= 0) {
      return "Terjadi peningkatan peserta tes, namun pengisian feedback tidak meningkat sebanding. Ini menunjukkan gap partisipasi feedback yang perlu intervensi (misalnya penempatan CTA feedback atau reminder).";
    } else if (pesertaTrend <= 0 && feedbackTrend <= 0) {
      return "Penurunan peserta tes dan pengisi feedback terjadi bersamaan. Perlu peninjauan faktor penyebab (traffic, kampanye, atau kendala teknis).";
    } else {
      return "Pengisian feedback meningkat meski jumlah peserta tes stabil. Ada indikasi perbaikan funnel feedback atau peningkatan motivasi pengisian.";
    }
  };

  // Calculate feedback response rate
  const feedbackResponseRate = useMemo(() => {
    const { data } = getParticipantData();
    const totalPeserta = data.reduce((sum, d) => sum + d.pesertaTes, 0);
    const totalFeedback = data.reduce((sum, d) => sum + d.pengisiFeedback, 0);
    const rate = (totalFeedback / totalPeserta) * 100;

    return {
      totalPeserta,
      totalFeedback,
      tidakMengisi: totalPeserta - totalFeedback,
      rate: rate.toFixed(1),
      ratePct: Math.round(rate),
    };
  }, [timeRange]);

  // Generate response rate insight
  const generateResponseRateInsight = () => {
    const { ratePct, totalPeserta } = feedbackResponseRate;

    if (ratePct >= 60) {
      return "Tingkat pengisian feedback tinggi, menunjukkan funnel feedback berjalan baik pada periode ini.";
    } else if (ratePct >= 30) {
      return "Pengisian feedback berada pada level moderat. Masih ada ruang perbaikan untuk meningkatkan konversi dari peserta tes ke pengisi feedback.";
    } else if (totalPeserta < 50 && ratePct >= 40) {
      return "Meskipun jumlah peserta tes terbatas, proporsi pengisian feedback baik. Interpretasi tren perlu memperhatikan ukuran sampel.";
    } else {
      return "Pengisian feedback rendah. Disarankan evaluasi penempatan ajakan feedback, insentif, dan kemudahan form.";
    }
  };

  // Donut chart data for feedback response rate - bright blue vs dim blue
  const responseRateDonutData = [
    { name: "Mengisi feedback", value: feedbackResponseRate.totalFeedback, color: "#3B82F6" },
    { name: "Tidak mengisi", value: feedbackResponseRate.tidakMengisi, color: "#93C5FD" },
  ];

  // Donut chart data for kendala
  const kendalaDonutData = [
    { name: "Tidak ada kendala", value: kendalaAnalysis.noKendala },
    { name: "Ada kendala", value: kendalaAnalysis.hasKendala },
  ];

  // Mini trend data for cards
  const miniTrendData = [{ value: 10 }, { value: 12 }, { value: 11 }, { value: 14 }, { value: 13 }, { value: 15 }];

  // Stacked bar data (percentage based)
  const stackedBarData = useMemo(() => {
    const total = mahasiswaFeedbackData.length;
    return [
      {
        name: "Kemudahan",
        negatif: Math.round((mahasiswaFeedbackData.filter((d) => d.kemudahanTes <= 3).length / total) * 100),
        netral: Math.round((mahasiswaFeedbackData.filter((d) => d.kemudahanTes === 4).length / total) * 100),
        positif: Math.round((mahasiswaFeedbackData.filter((d) => d.kemudahanTes >= 5).length / total) * 100),
      },
      {
        name: "Relevansi",
        negatif: Math.round((mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi <= 3).length / total) * 100),
        netral: Math.round((mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi === 4).length / total) * 100),
        positif: Math.round((mahasiswaFeedbackData.filter((d) => d.relevansiRekomendasi >= 5).length / total) * 100),
      },
      {
        name: "Kepuasan",
        negatif: Math.round((mahasiswaFeedbackData.filter((d) => d.kepuasanFitur <= 3).length / total) * 100),
        netral: Math.round((mahasiswaFeedbackData.filter((d) => d.kepuasanFitur === 4).length / total) * 100),
        positif: Math.round((mahasiswaFeedbackData.filter((d) => d.kepuasanFitur >= 5).length / total) * 100),
      },
    ];
  }, []);

  // Overview Card Component
  const OverviewCard = ({
    icon: Icon,
    title,
    value,
    trend,
    trendData,
    accentColor,
  }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    trend: string;
    trendData: { value: number }[];
    accentColor: string;
  }) => {
    const trendNumber = parseFloat(trend);
    const isPositive = trendNumber >= 0;

    return (
      <Card className="border-0 bg-gradient-to-br from-card to-muted/30 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${accentColor}15` }}>
              <Icon className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <span className="text-sm text-muted-foreground font-bold">{title}</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>
                {isPositive ? "Naik" : "Turun"} {Math.abs(trendNumber)}% dibanding periode sebelumnya
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-20 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${accentColor.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={accentColor} fill={`url(#gradient-${accentColor.replace("#", "")})`} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  // Insight Box Component with structured format
  const InsightBox = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 shrink-0">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed space-y-1">{children}</div>
      </div>
    </div>
  );

  // Structured Insight Component with collapsible and framer-motion
  const StructuredInsight = ({ insight }: { insight: { ringkasan: string; detail: string; implikasi: string; aksi: string; catatan?: string } }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 shrink-0">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed flex-1">
            <p className="font-medium">{insight.ringkasan}</p>
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
                  <div className="mt-3 space-y-2 pt-1">
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <strong>Detail:</strong> {insight.detail}
                    </motion.p>
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <strong>Implikasi:</strong> {insight.implikasi}
                    </motion.p>
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <strong>Aksi Prioritas:</strong> {insight.aksi}
                    </motion.p>
                    {insight.catatan && (
                      <motion.p 
                        className="mt-2 text-amber-700 dark:text-amber-300 italic text-xs"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <strong>Catatan:</strong> {insight.catatan}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Modern Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-foreground text-background px-4 py-2.5 rounded-xl shadow-xl">
          <p className="text-sm font-semibold">Skor {label}</p>
          <p className="text-xs opacity-80">{payload[0].value} respon</p>
        </div>
      );
    }
    return null;
  };

  // Line Chart Tooltip
  const LineChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-foreground text-background px-4 py-3 rounded-xl shadow-xl">
          <p className="text-sm font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom bar shape with rounded corners
  const RoundedBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const radius = 8;

    if (height <= 0) return null;

    return (
      <g>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} style={{ filter: fill.length < 10 ? "url(#glow)" : "none" }} />
      </g>
    );
  };

  const participantData = getParticipantData();
  const kemudahanInsight = generateLikertInsight("kemudahanTes", "Kemudahan");
  const relevansiInsight = generateLikertInsight("relevansiRekomendasi", "Relevansi");
  const kepuasanInsight = generateLikertInsight("kepuasanFitur", "Kepuasan");
  const kendalaInsight = generateKendalaInsight();
  const ragamKendalaInsight = generateRagamKendalaInsight();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Visualisasi Data Umpan Balik</h2>
        <p className="text-muted-foreground mt-1">Ringkasan visual untuk memahami tren kemudahan, relevansi rekomendasi, kepuasan, kendala penggunaan, serta partisipasi pengisian feedback.</p>
      </div>

      {/* Control Section */}
      <Card className="border-0 bg-card/50 backdrop-blur rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Kontrol Visualisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full md:w-[220px] rounded-xl border-border/50">
                <SelectValue placeholder="Pilih Kategori Tes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tes-profil-karier">Tes Profil Karier</SelectItem>
                <SelectItem value="tes-riasec">Tes RIASEC</SelectItem>
                <SelectItem value="tes-kepribadian">Tes Kepribadian</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-[200px] rounded-xl border-border/50">
                <SelectValue placeholder="Rentang Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="all-time">Sepanjang Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <OverviewCard icon={MessageSquareText} title="Total Feedback" value={stats.total} trend={stats.totalTrend} trendData={miniTrendData} accentColor={COLORS.purple} />
        <OverviewCard icon={ThumbsUp} title="Rata-rata Kemudahan" value={`${stats.avgKemudahan}/7`} trend={stats.kemudahanTrend} trendData={miniTrendData} accentColor={COLORS.blue} />
        <OverviewCard icon={Target} title="Rata-rata Relevansi" value={`${stats.avgRelevansi}/7`} trend={stats.relevansiTrend} trendData={miniTrendData} accentColor={COLORS.green} />
        <OverviewCard icon={Smile} title="Rata-rata Kepuasan" value={`${stats.avgKepuasan}/7`} trend={stats.kepuasanTrend} trendData={miniTrendData} accentColor={COLORS.amber} />
      </div>

      {/* Chart 1 & 2: Participant Trend and Response Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tren Peserta Tes vs Pengisi Feedback */}
        <Card className="lg:col-span-2 border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500" />
              <div>
                <CardTitle className="text-base font-semibold">Tren Peserta Tes vs Pengisi Feedback</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{getPeriodLabel()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={participantData.data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="pesertaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="feedbackAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey={participantData.xKey} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<LineChartTooltip />} />
                  <Legend verticalAlign="top" height={40} formatter={(value) => <span className="text-sm font-medium text-foreground">{value}</span>} />
                  <Area type="monotone" dataKey="pesertaTes" name="Peserta Tes" stroke={COLORS.cyan} strokeWidth={3} fill="url(#pesertaAreaGradient)" dot={{ fill: COLORS.cyan, strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="pengisiFeedback" name="Pengisi Feedback" stroke={COLORS.purple} strokeWidth={3} fill="url(#feedbackAreaGradient)" dot={{ fill: COLORS.purple, strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <p>
                <strong>Wawasan:</strong> {generateParticipantTrendInsight()}
              </p>
            </InsightBox>
          </CardContent>
        </Card>

        {/* Chart 2: Rasio Pengisian Feedback */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
              <div>
                <CardTitle className="text-base font-semibold">Rasio Pengisian Feedback</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{getPeriodLabel()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="mengisiGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <linearGradient id="tidakMengisiGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#BFDBFE" />
                    </linearGradient>
                  </defs>
                  <Pie data={responseRateDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} stroke="none">
                    <Cell fill="url(#mengisiGradient)" />
                    <Cell fill="url(#tidakMengisiGradient)" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))", borderRadius: "12px", border: "none" }} />
                  <Legend verticalAlign="bottom" height={40} formatter={(value) => <span className="text-xs font-medium text-foreground">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              <p>
                <strong>Wawasan:</strong> {generateResponseRateInsight()}
              </p>
            </InsightBox>
          </CardContent>
        </Card>
      </div>

      {/* Charts 3, 4, 5: Likert Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Tingkat Kemudahan */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.blue }} />
              <div>
                <CardTitle className="text-base font-semibold">Tingkat Kemudahan Menyelesaikan Tes</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getPeriodLabel()} • N = {mahasiswaFeedbackData.length} respon
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("kemudahanTes", COLORS.blue)} margin={{ top: 20, right: 10, left: -10, bottom: 30 }}>
                  <XAxis dataKey="score" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} label={{ value: "Skala 1–7", position: "bottom", offset: 10, fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)", radius: 8 }} />
                  <Bar dataKey="count" shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight insight={kemudahanInsight} />
          </CardContent>
        </Card>

        {/* Chart 4: Tingkat Relevansi */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.green }} />
              <div>
                <CardTitle className="text-base font-semibold">Tingkat Relevansi Rekomendasi Profesi</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getPeriodLabel()} • N = {mahasiswaFeedbackData.length} respon
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("relevansiRekomendasi", COLORS.green)} margin={{ top: 20, right: 10, left: -10, bottom: 30 }}>
                  <XAxis dataKey="score" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} label={{ value: "Skala 1–7", position: "bottom", offset: 10, fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)", radius: 8 }} />
                  <Bar dataKey="count" shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight insight={relevansiInsight} />
          </CardContent>
        </Card>

        {/* Chart 5: Tingkat Kepuasan */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.amber }} />
              <div>
                <CardTitle className="text-base font-semibold">Tingkat Kepuasan Keseluruhan</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getPeriodLabel()} • N = {mahasiswaFeedbackData.length} respon
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareDistributionData("kepuasanFitur", COLORS.amber)} margin={{ top: 20, right: 10, left: -10, bottom: 30 }}>
                  <XAxis dataKey="score" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} label={{ value: "Skala 1–7", position: "bottom", offset: 10, fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.3)", radius: 8 }} />
                  <Bar dataKey="count" shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight insight={kepuasanInsight} />
          </CardContent>
        </Card>
      </div>

      {/* Charts 6 & 7: Kendala Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 6: Tingkat Kendala (Donut) */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-rose-500" />
              <div>
                <CardTitle className="text-base font-semibold">Tingkat Kendala Penggunaan</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getPeriodLabel()} • N = {kendalaAnalysis.total} respon
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>
                  <Pie data={kendalaDonutData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} stroke="none">
                    <Cell fill="url(#greenGradient)" />
                    <Cell fill="url(#redGradient)" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))", borderRadius: "12px", border: "none" }} />
                  <Legend verticalAlign="bottom" height={40} formatter={(value) => <span className="text-sm font-medium text-foreground">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight insight={kendalaInsight} />
          </CardContent>
        </Card>

        {/* Chart 7: Ragam Kendala */}
        <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.red }} />
              <div>
                <CardTitle className="text-base font-semibold">Ragam Kendala Penggunaan</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{getPeriodLabel()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kendalaAnalysis.kendalaData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={130} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))", borderRadius: "12px", border: "none" }} formatter={(value: number, name: string, props: any) => [`${value} respon (${props.payload.pct}%)`, "Jumlah"]} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StructuredInsight insight={ragamKendalaInsight} />
          </CardContent>
        </Card>
      </div>

      {/* Chart 8: Stacked Bar Comparison */}
      <Card className="border-0 bg-card rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-500 via-amber-500 to-emerald-500" />
            <div>
              <CardTitle className="text-base font-semibold">Komposisi Penilaian: Kemudahan, Relevansi, Kepuasan</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{getPeriodLabel()} • Dalam persentase</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedBarData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={70} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))", borderRadius: "12px", border: "none" }} formatter={(value: number) => [`${value}%`]} />
                <Legend verticalAlign="top" height={40} formatter={(value) => <span className="text-sm font-medium text-foreground capitalize">{value === "negatif" ? "Negatif (1–3)" : value === "netral" ? "Netral (4)" : "Positif (5–7)"}</span>} />
                <Bar dataKey="negatif" stackId="a" fill="#EF4444" name="Negatif" radius={[0, 0, 0, 0]} />
                <Bar dataKey="netral" stackId="a" fill="#F59E0B" name="Netral" />
                <Bar dataKey="positif" stackId="a" fill="#22C55E" name="Positif" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <InsightBox>
            <p>
              <strong>Wawasan:</strong>{" "}
              {stackedBarData.some((d) => d.negatif > d.positif)
                ? `Komponen yang paling perlu perhatian adalah ${stackedBarData.reduce((prev, curr) => (curr.negatif > prev.negatif ? curr : prev)).name}, karena proporsi penilaian negatif paling besar.`
                : stackedBarData.every((d) => d.positif >= 60)
                  ? "Seluruh metrik menunjukkan dominasi penilaian positif. Fokus berikutnya dapat diarahkan pada peningkatan skala dan konsistensi."
                  : "Pengalaman penggunaan baik, namun relevansi hasil masih perlu ditingkatkan. Ini mengindikasikan isu berada pada kualitas output, bukan alur pengerjaan."}
            </p>
          </InsightBox>
        </CardContent>
      </Card>
    </div>
  );
}
