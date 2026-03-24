'use client'

import Typography from '@/components/Typography'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TestTable, { MahasiswaTestTable } from './TestTable'
import KontrolPencarianUmpanBalik, {
  UmpanBalikFilters,
} from './KontrolDanPencarianUmpanBalik'
import { TooltipProps } from 'recharts'
import TestExpertDataTable, { TestResult } from './TestExpertTable'
import { useState } from 'react'
import { VisualizationPanel } from './visualisasi/VisualizationPanel'

// const chartData = [
//   { month: 'Sen', peserta: 25, feedback: 8 },
//   { month: 'Sel', peserta: 32, feedback: 12 },
//   { month: 'Rab', peserta: 28, feedback: 10 },
//   { month: 'Kam', peserta: 35, feedback: 15 },
//   { month: 'Jum', peserta: 40, feedback: 18 },
//   { month: 'Sab', peserta: 20, feedback: 8 },
//   { month: 'Min', peserta: 15, feedback: 5 },
// ]

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

// const pieChartConfig = {
//   visitors: {
//     label: 'Visitors',
//   },
//   chrome: {
//     label: 'Chrome',
//     color: 'var(--chart-1)',
//   },
//   safari: {
//     label: 'Safari',
//     color: 'var(--chart-2)',
//   },
//   firefox: {
//     label: 'Firefox',
//     color: 'var(--chart-3)',
//   },
//   edge: {
//     label: 'Edge',
//     color: 'var(--chart-4)',
//   },
//   other: {
//     label: 'Other',
//     color: 'var(--chart-5)',
//   },
// } satisfies ChartConfig

// const barChartConfig1 = {
//   desktop: {
//     label: 'Desktop',
//     color: 'var(--chart-1)',
//   },
// } satisfies ChartConfig

// const barChartData2 = [
//   { label: 'Durasi tes terlalu lama', value: 6, highlight: true },
//   { label: 'Navigasi membingungkan', value: 3 },
//   { label: 'Pertanyaan membingungkan', value: 2 },
//   { label: 'Error/bug sistem', value: 2 },
//   { label: 'Penjelasan sulit dipahami', value: 2 },
//   { label: 'Instruksi kurang jelas', value: 2 },
// ]

// const barChartConfig2 = {
//   value: {
//     label: 'Jumlah',
//     color: '#DC2626',
//   },
// } satisfies ChartConfig

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

// const stackedBarChartConfig = {
//   low: { label: 'Rendah', color: '#6EA3FF' },
//   mid: { label: 'Sedang', color: '#0046CC' },
//   high: { label: 'Tinggi', color: '#001F5B' },
// } satisfies ChartConfig

export const CustomAreaChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null

  const peserta = payload.find((p) => p.dataKey === 'peserta')?.value
  const feedback = payload.find((p) => p.dataKey === 'feedback')?.value

  return (
    <div className="rounded-md border border-gray-200 bg-[#212729] px-3 py-2 shadow-md">
      <Typography
        variant="l1"
        weight="bold"
        font="Poppins"
        className="text-white"
      >
        {label}
      </Typography>

      {typeof peserta === 'number' && (
        <Typography
          variant="l1"
          weight="regular"
          font="Poppins"
          className="text-[#1CB0B4]"
        >
          Peserta Tes: {peserta}
        </Typography>
      )}

      {typeof feedback === 'number' && (
        <Typography
          variant="l1"
          weight="regular"
          font="Poppins"
          className="text-[#3379FF]"
        >
          Pengisi Feedback: {feedback}
        </Typography>
      )}
    </div>
  )
}

export const CustomPieChartTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0]
  const label = item.name // "mengisi" | "tidak_mengisi"
  const value = item.value // number
  // const color = item.payload?.fill // slice color (if any)

  return (
    <div className="rounded-md border border-gray-200 bg-[#212729] px-3 py-2 shadow-md">
      <div className="flex items-center gap-2 mt-1">
        <Typography
          variant="l1"
          weight="regular"
          font="Poppins"
          className="text-white"
        >
          {label?.replace('_', ' ')}: {value}
        </Typography>
      </div>
    </div>
  )
}

export const CustomPieChartTooltip2 = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0]
  const label = item.name // "mengisi" | "tidak_mengisi"
  const value = item.value // number

  return (
    <div className="rounded-md border border-gray-200 bg-[#212729] px-3 py-2 shadow-md">
      <div className="flex items-center gap-2 mt-1">
        <Typography
          variant="l1"
          weight="regular"
          font="Poppins"
          className="text-white"
        >
          {label?.replace('_', ' ').replace('_', ' ')}: {value}
        </Typography>
      </div>
    </div>
  )
}

export const CustomBarChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null

  const value = payload[0].value

  return (
    <div className="rounded-md border border-gray-200 bg-[#212729] px-3 py-2 shadow-md">
      <Typography
        variant="l1"
        weight="bold"
        font="Poppins"
        className="text-white"
      >
        Skor {label}
      </Typography>

      {typeof value === 'number' && (
        <Typography
          variant="l2"
          weight="regular"
          font="Poppins"
          className="text-[#669AFF]"
        >
          {value} respon
        </Typography>
      )}
    </div>
  )
}

export const CustomStackedBarChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null

  const value = payload[0].value

  return (
    <div className="rounded-md border border-gray-200 bg-[#212729] px-3 py-2 shadow-md">
      <Typography
        variant="l1"
        weight="semibold"
        font="Poppins"
        className="text-white"
      >
        Skor {label}
      </Typography>

      {typeof value === 'number' && (
        <Typography
          variant="l2"
          weight="regular"
          font="Poppins"
          className="text-[#E86E6E]"
        >
          {value} respon
        </Typography>
      )}
    </div>
  )
}
export default function DataTabs({
  isExpert = false,
  expertData,
  mahasiswaData,
}: {
  isExpert?: boolean
  expertData?: TestResult[]
  mahasiswaData?: MahasiswaTestTable[]
}) {
  const [filters, setFilters] = useState<UmpanBalikFilters>({
    search: '',
    test_category: '',
    sort: '',
    status: '',
  })

  return (
    <div className="w-full ">
      <Tabs defaultValue="raw" className="w-full">
        <div className="w-full flex flex-row border-b-[1px] border-[#6B6F70] p-0">
          <TabsList className="translate-y-[2px] bg-transparent border-b w-1/4 justify-start rounded-none h-auto p-0 ">
            <TabsTrigger
              value="raw"
              className="rounded-none border-b-4 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#003499] data-[state=active]:text-[#003499]"
            >
              <Typography variant="l1" weight="medium" className="">
                Data mentah
              </Typography>
            </TabsTrigger>

            <TabsTrigger
              value="visual"
              className="rounded-none border-b-4 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#003499] data-[state=active]:text-[#003499]"
            >
              <Typography variant="l1" weight="medium" className="">
                Visualisasi
              </Typography>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="raw" className="pt-6">
          <RawDataPanel
            isExpert={isExpert}
            mahasiswaData={mahasiswaData}
            expertData={expertData}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="visual" className="pt-6">
          <VisualizationPanel expertData={expertData ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RawDataPanel({
  isExpert = false,
  expertData,
  mahasiswaData,
  filters,
  onFiltersChange,
}: {
  isExpert?: boolean
  expertData?: TestResult[]
  mahasiswaData?: MahasiswaTestTable[]
  filters: UmpanBalikFilters
  onFiltersChange: (f: UmpanBalikFilters) => void
}) {
  const filteredExpertData = (expertData ?? [])
    .filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.expert.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.expert.profession ?? '')
          .toLowerCase()
          .includes(filters.search.toLowerCase())

      const matchesCategory =
        !filters.test_category || item.test_category === filters.test_category

      const matchesStatus =
        !filters.status ||
        (filters.status === 'has_suggestion' && item.has_suggestion) ||
        (filters.status === 'no_suggestion' && !item.has_suggestion)

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (filters.sort === 'oldest') {
        return (
          new Date(a.submitted_at).getTime() -
          new Date(b.submitted_at).getTime()
        )
      }
      // Default: latest first
      return (
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      )
    })

  return (
    <>
      <KontrolPencarianUmpanBalik
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {isExpert ? (
        <TestExpertDataTable tableData={filteredExpertData} />
      ) : (
        <TestTable tableData={mahasiswaData ?? []} />
      )}
    </>
  )
}
