'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Typography from '@/components/Typography'
import { ThumbsUp, MessageSquareText, Radar, Smile } from 'lucide-react'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Pie,
  Bar,
  Cell,
  AreaChart,
  PieChart,
  BarChart,
} from 'recharts'
import {
  CustomAreaChartTooltip,
  CustomPieChartTooltip,
  CustomBarChartTooltip,
  CustomPieChartTooltip2,
  CustomStackedBarChartTooltip,
} from '../DataTabs'
import KontrolVisualisasi from '../KontrolVisualisasi'
import ChartLayout from './ChartLayout'
import ScoreCard from './ScoreCard'
import { ExpertFeedbackItem } from '@/types/kenali-diri'

// Config

// const pieChartData = [
//   { label: 'Mengisi', value: 275, fill: '#0046CC' },
//   { label: 'Tidak_Mengisi', value: 200, fill: '#6EA3FF' },
// ]

// const pieChartData2 = [
//   { label: 'Tidak Ada Kendala', value: 275, fill: '#F8D4D4' },
//   { label: 'Ada Kendala', value: 200, fill: '#DC2626' },
// ]

// const chartData3 = [
//   { scale: '1', value: 1 },
//   { scale: '2', value: 1 },
//   { scale: '3', value: 1 },
//   { scale: '4', value: 1 },
//   { scale: '5', value: 3 },
//   { scale: '6', value: 5, highlight: true }, // highlighted bar
//   { scale: '7', value: 4 },
// ]

const pieChartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

const barChartConfig1 = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

// const barChartData2 = [
//   { label: 'Durasi tes terlalu lama', value: 6, highlight: true },
//   { label: 'Navigasi membingungkan', value: 3 },
//   { label: 'Pertanyaan membingungkan', value: 2 },
//   { label: 'Error/bug sistem', value: 2 },
//   { label: 'Penjelasan sulit dipahami', value: 2 },
//   { label: 'Instruksi kurang jelas', value: 2 },
// ]

const barChartConfig2 = {
  value: {
    label: 'Jumlah',
    color: '#DC2626',
  },
} satisfies ChartConfig

// const stackedBarChartData = [
//   {
//     label: 'Kemudahan',
//     low: 15,
//     mid: 8,
//     high: 77,
//   },
//   {
//     label: 'Relevansi',
//     low: 15,
//     mid: 15,
//     high: 70,
//   },
//   {
//     label: 'Kepuasan',
//     low: 15,
//     mid: 8,
//     high: 77,
//   },
// ]

const stackedBarChartConfig = {
  low: { label: 'Rendah', color: '#6EA3FF' },
  mid: { label: 'Sedang', color: '#0046CC' },
  high: { label: 'Tinggi', color: '#001F5B' },
} satisfies ChartConfig

// ─── Data derivation helpers ──────────────────────────────────────────────────

interface ScoreDistributionEntry {
  scale: string
  value: number
  highlight: boolean
}

function getScoreDistribution(scores: number[]): ScoreDistributionEntry[] {
  const counts = Array.from({ length: 7 }, (_, i) => ({
    scale: String(i + 1),
    value: 0,
    highlight: false,
  }))

  scores.forEach((s) => {
    if (s >= 1 && s <= 7) counts[s - 1].value++
  })

  const max = Math.max(...counts.map((c) => c.value))
  if (max > 0) {
    const lastMaxIdx = [...counts].reverse().findIndex((c) => c.value === max)
    counts[counts.length - 1 - lastMaxIdx].highlight = true
  }

  return counts
}

interface ScoreBuckets {
  low: number // % scores 1–3
  mid: number // % scores 4–5
  high: number // % scores 6–7
}

function getScoreBuckets(scores: number[]): ScoreBuckets {
  const total = scores.length || 1
  const low = scores.filter((s) => s >= 1 && s <= 3).length
  const mid = scores.filter((s) => s >= 4 && s <= 5).length
  const high = scores.filter((s) => s >= 6 && s <= 7).length
  return {
    low: Math.round((low / total) * 100),
    mid: Math.round((mid / total) * 100),
    high: Math.round((high / total) * 100),
  }
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VisualizationPanel({
  expertData,
}: {
  expertData: ExpertFeedbackItem[]
}) {
  // ── Score card metrics ────────────────────────────────────────────────────
  const totalFeedback = expertData.length
  const avgAccuracy = avg(expertData.map((d) => d.scores.accuracy ?? 0))
  const avgLogic = avg(expertData.map((d) => d.scores.logic ?? 0))
  const avgUsefulness = avg(expertData.map((d) => d.scores.usefulness ?? 0))

  // ── Trend chart: group feedbacks by weekday of submitted_at ───────────────
  const DAY_ORDER = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const dayMap: Record<string, number> = Object.fromEntries(
    DAY_ORDER.map((d) => [d, 0]),
  )

  expertData.forEach((item) => {
    const day = new Date(item.submitted_at).toLocaleDateString('id-ID', {
      weekday: 'short',
    })
    // id-ID gives "Sen", "Sel", etc.
    const key = day.charAt(0).toUpperCase() + day.slice(1, 3)
    if (key in dayMap) dayMap[key]++
  })

  const trendChartData = DAY_ORDER.map((day) => ({
    month: day,
    feedback: dayMap[day],
    // We don't have participant count from this endpoint — mirror feedback as proxy
    peserta: dayMap[day],
  }))

  // ── Pie chart 1: feedback ratio (filled vs not) ────────────────────────────
  // This endpoint only returns submitted feedbacks, so "Tidak Mengisi" is unknown.
  // Showing total submitted vs 0 unfilled — replace with a dedicated API when available.
  const pieChartData = [
    { label: 'Mengisi', value: totalFeedback, fill: '#0046CC' },
    { label: 'Tidak_Mengisi', value: 0, fill: '#6EA3FF' },
  ]

  // ── Score distributions (1–7) ─────────────────────────────────────────────
  const accuracyDist = getScoreDistribution(
    expertData.map((d) => d.scores.accuracy ?? 0),
  )
  const logicDist = getScoreDistribution(expertData.map((d) => d.scores.logic ?? 0))
  const usefulnessDist = getScoreDistribution(
    expertData.map((d) => d.scores.usefulness ?? 0),
  )

  // ── Pie chart 2: kendala ratio ────────────────────────────────────────────
  const adaKendala = expertData.filter((d) =>
    d.obstacles.some((o) => o.key !== 'NO_ISSUE'),
  ).length
  const tidakKendala = totalFeedback - adaKendala

  const pieChartData2 = [
    { label: 'Tidak Ada Kendala', value: tidakKendala, fill: '#F8D4D4' },
    { label: 'Ada Kendala', value: adaKendala, fill: '#DC2626' },
  ]

  // ── Bar chart 2: ragam kendala ────────────────────────────────────────────
  const obstacleCountMap: Record<string, { label: string; value: number }> = {}
  expertData.forEach((item) => {
    item.obstacles.forEach((obs) => {
      if (!obs.key || obs.key === 'NO_ISSUE') return
      if (!obstacleCountMap[obs.key]) {
        obstacleCountMap[obs.key] = { label: obs.label, value: 0 }
      }
      obstacleCountMap[obs.key].value++
    })
  })

  const ragamKendalaData = Object.values(obstacleCountMap)
    .sort((a, b) => b.value - a.value)
    .map((entry, i) => ({ ...entry, highlight: i === 0 }))

  // ── Stacked bar: score composition ───────────────────────────────────────
  const accuracyBuckets = getScoreBuckets(
    expertData.map((d) => d.scores.accuracy ?? 0),
  )
  const logicBuckets = getScoreBuckets(expertData.map((d) => d.scores.logic ?? 0))
  const usefulnessBuckets = getScoreBuckets(
    expertData.map((d) => d.scores.usefulness ?? 0),
  )

  const stackedBarData = [
    { label: 'Kemudahan', ...accuracyBuckets },
    { label: 'Relevansi', ...logicBuckets },
    { label: 'Kepuasan', ...usefulnessBuckets },
  ]

  // ── Render (exact same JSX as before — only data sources changed) ─────────
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-1 mb-12">
        <Typography variant="h6" weight="bold" font="Poppins">
          Visualisasi Data Umpan Balik
        </Typography>
        <Typography variant="l1" className="text-gray-500" font="Poppins">
          Ringkasan visual untuk memahami tren kemudahan, relevansi rekomendasi,
          kepuasan, kendala penggunaan, serta partisipasi pengisian feedback
        </Typography>
      </div>
      <KontrolVisualisasi />

      {/* ── Score Cards ─────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex xl:flex-row gap-y-6 xl:gap-x-6 mb-12">
        <ScoreCard
          title="Total Feedback"
          score={totalFeedback}
          outOf={0}
          displayOutOf={false}
          description="Jumlah umpan balik yang masuk"
        >
          <div className="bg-[#CCDDFF] p-1 rounded-lg">
            <ThumbsUp className="text-[#0046CC] p-1" />
          </div>
        </ScoreCard>
        <ScoreCard
          title="Rata-Rata Kemudahan"
          score={avgAccuracy}
          outOf={7}
          displayOutOf={true}
          description="Rata-rata skor akurasi"
        >
          <div className="bg-[#CCDDFF] p-1 rounded-lg">
            <MessageSquareText className="text-[#0046CC] p-1" />
          </div>
        </ScoreCard>
        <ScoreCard
          title="Rata-Rata Relevansi"
          score={avgLogic}
          outOf={7}
          displayOutOf={true}
          description="Rata-rata skor logika"
        >
          <div className="bg-[#CCDDFF] p-1 rounded-lg">
            <Radar className="text-[#0046CC] p-1" />
          </div>
        </ScoreCard>
        <ScoreCard
          title="Rata-Rata Kepuasan"
          score={avgUsefulness}
          outOf={7}
          displayOutOf={true}
          description="Rata-rata skor manfaat"
        >
          <div className="bg-[#CCDDFF] p-1 rounded-lg">
            <Smile className="text-[#0046CC] p-1" />
          </div>
        </ScoreCard>
      </div>

      {/* ── Trend + Pie 1 ───────────────────────────────────────────────── */}
      <div className="flex flex-col xl:grid xl:grid-cols-[2fr_1fr] gap-3">
        <ChartLayout
          title="Tren Peserta Tes vs Pengisi Feedback"
          periode="Data berdasarkan tanggal pengiriman feedback"
          description="Distribusi pengiriman feedback per hari dalam seminggu."
          className="w-full"
          detailSelengkapnya={{
            detail:
              'Sebaran skor terkonsentrasi pada nilai tinggi, dengan 88% respon berada di skor 6–7',
            implikasi:
              'Pengalaman pengguna sudah kuat dan konsisten pada aspek ini.',
            aksi_prioritas:
              'Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah',
          }}
        >
          <div className="w-full h-[320px]">
            <div className="w-full flex flex-row gap-x-8 justify-center items-center">
              <div className="flex flex-row items-center gap-x-2">
                <svg
                  width="44"
                  height="12"
                  viewBox="0 0 44 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="44"
                    y2="6"
                    stroke="#5BB1B3"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="22"
                    cy="6"
                    r="5"
                    fill="#FFFFFF"
                    stroke="#5BB1B3"
                    strokeWidth="3"
                  />
                </svg>
                <Typography
                  variant="l2"
                  weight="regular"
                  className="text-[#1CB0B4]"
                >
                  Peserta Tes
                </Typography>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <svg
                  width="44"
                  height="12"
                  viewBox="0 0 44 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="44"
                    y2="6"
                    stroke="#0046CC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="22"
                    cy="6"
                    r="5"
                    fill="#FFFFFF"
                    stroke="#0046CC"
                    strokeWidth="3"
                  />
                </svg>
                <Typography
                  variant="l2"
                  weight="regular"
                  className="text-[#0046CC]"
                >
                  Pengisi Feedback
                </Typography>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillPeserta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1CB5B5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1CB5B5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillFeedback" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0046CC" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0046CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) => v.slice(0, 3)}
                  tick={{ fill: '#6B6F70', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={{ fill: '#6B6F70', fontSize: 12 }}
                />
                <Tooltip content={<CustomAreaChartTooltip />} cursor={false} />
                <Area
                  type="natural"
                  dataKey="feedback"
                  name="Pengisi Feedback"
                  stroke="#0046CC"
                  strokeWidth={2}
                  fill="url(#fillFeedback)"
                  dot={{ r: 4, fill: '#003499' }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="natural"
                  dataKey="peserta"
                  name="Peserta Tes"
                  stroke="#1CB5B5"
                  strokeWidth={2}
                  fill="url(#fillPeserta)"
                  dot={{ r: 4, fill: '#0E8F8F' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartLayout>

        <ChartLayout
          title="Rasio Pengisian Feedback"
          periode="Data berdasarkan feedback yang masuk"
          description="Jumlah expert yang mengisi feedback."
          className="w-full"
          detailSelengkapnya={{
            detail:
              'Sebaran skor terkonsentrasi pada nilai tinggi, dengan 88% respon berada di skor 6–7',
            implikasi:
              'Pengalaman pengguna sudah kuat dan konsisten pada aspek ini.',
            aksi_prioritas:
              'Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah',
          }}
        >
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto w-full max-w-[260px] h-[260px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<CustomPieChartTooltip />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={0}
                  strokeWidth={2}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="w-full flex flex-row gap-x-6 justify-center">
            <div className="flex flex-row gap-x-2">
              <div className="p-2 rounded-sm bg-[#0046CC]" />
              <Typography
                variant="l2"
                weight="regular"
                className="text-[#212729]"
              >
                Mengisi feedback
              </Typography>
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="p-2 rounded-sm bg-[#CCDDFF]" />
              <Typography
                variant="l2"
                weight="regular"
                className="text-[#212729]"
              >
                Tidak mengisi feedback
              </Typography>
            </div>
          </div>
        </ChartLayout>
      </div>

      {/* ── Score distribution bar charts ────────────────────────────────── */}
      <div className="flex flex-col mt-3 gap-y-3">
        {(
          [
            {
              title: 'Tingkat Kemudahan Menyelesaikan Tes',
              data: accuracyDist,
            },
            { title: 'Tingkat Relevansi Rekomendasi Profesi', data: logicDist },
            { title: 'Tingkat Kepuasan Keseluruhan', data: usefulnessDist },
          ] as { title: string; data: ScoreDistributionEntry[] }[]
        ).map(({ title, data }) => (
          <ChartLayout
            key={title}
            title={title}
            periode="Data berdasarkan seluruh feedback yang masuk"
            description="Distribusi skor 1–7 dari seluruh responden."
            className="w-full"
            isShowDetailSelengkapnyaButton={true}
            detailSelengkapnya={{
              detail:
                'Sebaran skor terkonsentrasi pada nilai tinggi, dengan 88% respon berada di skor 6–7',
              implikasi:
                'Pengalaman pengguna sudah kuat dan konsisten pada aspek ini.',
              aksi_prioritas:
                'Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah',
            }}
          >
            <ChartContainer config={barChartConfig1} className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, left: 8, right: 8, bottom: 0 }}
                  barCategoryGap={4}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <XAxis
                    dataKey="scale"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<CustomBarChartTooltip />}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.highlight ? '#0046CC' : '#D6E4FF'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <Typography
              variant="l2"
              weight="regular"
              className="text-[#6B6F70] text-center mt-2"
            >
              Skala 1-7
            </Typography>
          </ChartLayout>
        ))}
      </div>

      {/* ── Kendala pie + ragam bar ──────────────────────────────────────── */}
      <div className="flex flex-col xl:grid xl:grid-cols-[1fr_2fr] gap-3 mt-3">
        <ChartLayout
          title="Tingkat Kendala Penggunaan"
          periode="Data berdasarkan seluruh feedback yang masuk"
          description="Proporsi feedback yang melaporkan kendala."
          className="w-full"
        >
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto w-full max-w-[260px] h-[260px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<CustomPieChartTooltip2 />}
                />
                <Pie
                  data={pieChartData2}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={0}
                  strokeWidth={2}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="w-full flex flex-row gap-x-6 justify-center">
            <div className="flex flex-row gap-x-2">
              <div className="p-2 rounded-sm bg-[#DC2626]" />
              <Typography
                variant="l2"
                weight="regular"
                className="text-[#212729]"
              >
                Ada kendala
              </Typography>
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="p-2 rounded-sm bg-[#F8D4D4]" />
              <Typography
                variant="l2"
                weight="regular"
                className="text-[#212729]"
              >
                Tidak ada kendala
              </Typography>
            </div>
          </div>
        </ChartLayout>

        <ChartLayout
          title="Ragam Kendala Penggunaan"
          periode="Data berdasarkan seluruh feedback yang masuk"
          description="Kendala yang paling sering dilaporkan oleh expert."
          className="w-full"
          detailSelengkapnya={{
            detail:
              'Sebaran skor terkonsentrasi pada nilai tinggi, dengan 88% respon berada di skor 6–7',
            implikasi:
              'Pengalaman pengguna sudah kuat dan konsisten pada aspek ini.',
            aksi_prioritas:
              'Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah',
          }}
        >
          {ragamKendalaData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <Typography variant="l1" font="Poppins">
                Tidak ada kendala dilaporkan.
              </Typography>
            </div>
          ) : (
            <ChartContainer config={barChartConfig2} className="h-[300px]">
              <BarChart
                data={ragamKendalaData}
                layout="vertical"
                margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
                barCategoryGap={10}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#111827', fontSize: 12 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  width={180}
                  tick={{
                    fill: '#212729',
                    fontSize: 14,
                    textAnchor: 'start',
                    dx: -160,
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<CustomStackedBarChartTooltip />}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={34}>
                  {ragamKendalaData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.highlight ? '#DC2626' : '#FADDDD'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </ChartLayout>
      </div>

      {/* ── Stacked bar: score composition ──────────────────────────────── */}
      <div className="flex flex-row mt-3">
        <ChartLayout
          title="Komposisi Penilaian: Kemudahan, Relevansi, Kepuasan"
          periode="Data berdasarkan seluruh feedback yang masuk"
          description="Seluruh metrik menunjukkan dominasi penilaian positif. Fokus berikutnya dapat diarahkan pada peningkatan skala dan konsistensi"
          className="w-full"
          detailSelengkapnya={{
            detail:
              'Sebaran skor terkonsentrasi pada nilai tinggi, dengan 88% respon berada di skor 6–7',
            implikasi:
              'Pengalaman pengguna sudah kuat dan konsisten pada aspek ini.',
            aksi_prioritas:
              'Pertahankan alur yang ada, lalu fokus pada peningkatan kecil untuk kelompok minor yang masih memberi skor rendah',
          }}
        >
          <ChartContainer config={stackedBarChartConfig} className="h-[260px]">
            <BarChart
              data={stackedBarData}
              layout="vertical"
              margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
              barCategoryGap={5}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#000000' }}
              />
              <YAxis
                dataKey="label"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#000000',
                  fontSize: 14,
                  textAnchor: 'start',
                  dx: -100,
                }}
                width={140}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="low"
                stackId="a"
                fill="#6EA3FF"
                radius={[8, 0, 0, 8]}
              />
              <Bar dataKey="mid" stackId="a" fill="#0046CC" />
              <Bar
                dataKey="high"
                stackId="a"
                fill="#001F5B"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ChartLayout>
      </div>
    </div>
  )
}
