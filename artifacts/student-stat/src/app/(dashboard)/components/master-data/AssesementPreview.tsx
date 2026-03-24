'use client'
import React from 'react'
import Typography from '@/components/Typography'
import { Target, Zap, Lightbulb, Users, Home, Eye } from 'lucide-react'
// Assuming AssessmentData and the item type are exported from assessmentTypes
import { AssessmentData, AssessmentItem } from './assesmentTypes'
import { RIASECTypeBubble } from './RIASECTypeBubble'

/**
 * Interface for PreviewCard Props
 */
interface PreviewCardProps {
  title: string
  icon: React.ReactNode
  items: AssessmentItem[]
  bgColor: string
  borderColor: string
  className?: string // Optional property
}

export default function AssessmentPreview({ data }: { data: AssessmentData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-3 items-center border-b border-[#E2E4E9] py-3 w-fit pr-8">
          <div className="flex items-center gap-2 bg-[#E3FFEE]/15 outline outline-1 outline-[#16A34A] rounded-lg py-1 px-6">
            <Typography
              variant="l2"
              weight="semibold"
              className="text-[#16A34A]"
            >
              Preview
            </Typography>
            <Eye className="text-[#16A34A] w-4 h-4" />
          </div>
          <Typography variant="l2" weight="regular" className="text-[#676F7E]">
            Halaman Preview Informasi
          </Typography>
        </div>

        <div className="flex flex-row gap-x-3">
          <RIASECTypeBubble type={'R'} />
          <div className="flex flex-col">
            <div className="flex bg-[#EDEFF2] rounded-lg w-auto h-fit py-1 px-3">
              <Typography variant="l2" className="text-[#676F7E]">
                ID: #001
              </Typography>
            </div>
            <Typography
              variant="l2"
              className="text-[#676F7E] text-center mt-1"
            >
              Realistic
            </Typography>
          </div>
        </div>
      </div>

      <div className="bg-[#669AFF]/10 border border-[#669AFF]/20 p-8 rounded-xl">
        <div className="flex flex-row gap-x-3">
          <Typography
            variant="t2"
            weight="semibold"
            className="text-black mb-2"
          >
            Tentang Kode
          </Typography>
        </div>
        <Typography variant="l2" className="text-[#676F7E] leading-relaxed">
          {data.summary.content}
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PreviewCard
          title="Tantangan Profil"
          icon={<Target className="text-orange-500" />}
          items={data.sections.tantangan}
          bgColor="bg-orange-50"
          borderColor="border-orange-100"
        />
        <PreviewCard
          title="Kekuatan Profil"
          icon={<Zap className="text-green-500" />}
          items={data.sections.kekuatan}
          bgColor="bg-green-50"
          borderColor="border-green-100"
        />
        <PreviewCard
          title="Strategi Pengembangan Diri"
          icon={<Lightbulb className="text-blue-500" />}
          items={data.sections.strategi}
          bgColor="bg-[#CCDDFF]/25"
          borderColor="border-blue-100"
        />
        <PreviewCard
          title="Gaya Interaksi & Kolaborasi"
          icon={<Users className="text-indigo-500" />}
          items={data.sections.interaksi}
          bgColor="bg-[#D3D4D4]/25"
          borderColor="border-indigo-100"
        />
        <PreviewCard
          title="Lingkungan Kerja Yang Ideal"
          icon={<Home className="text-slate-500" />}
          items={data.sections.lingkungan}
          bgColor="bg-[#D3D4D4]/25"
          borderColor="border-slate-100"
        />
      </div>
    </div>
  )
}

function PreviewCard({
  title,
  icon,
  items,
  bgColor,
  borderColor,
  className = '',
}: PreviewCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border ${bgColor} ${borderColor} ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <Typography variant="t2" weight="semibold">
          {title}
        </Typography>
      </div>
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item: AssessmentItem) => (
            <div key={item.id} className="flex flex-row gap-x-3">
              {/* Note: Rendering the icon again inside the loop matches your original code */}
              {icon}
              <div className="flex flex-col">
                <Typography
                  variant="l1"
                  weight="semibold"
                  className="block mb-1"
                >
                  {item.title || 'Tanpa Judul'}
                </Typography>
                <Typography
                  variant="l2"
                  className="text-[#676F7E] leading-snug"
                >
                  {item.description || 'Tidak ada deskripsi.'}
                </Typography>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="l1" className="italic text-slate-400">
            Belum ada data.
          </Typography>
        )}
      </div>
    </div>
  )
}
