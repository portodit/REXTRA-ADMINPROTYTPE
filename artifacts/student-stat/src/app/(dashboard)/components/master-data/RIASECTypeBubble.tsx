'use client'

export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

interface RIASECTypeBubbleProps {
  type: RIASECType
}

const typeColorMap: Record<RIASECType, string> = {
  R: 'bg-[#F97316]/15 text-[#FB923C] border-[#FB923C] border-1',
  I: 'bg-[#3B82F6]/15 text-[#60A5FA] border-[#60A5FA] border-1',
  A: 'bg-[#A855F7]/15 text-[#C084FC] border-[#C084FC] border-1',
  S: 'bg-[#10B981]/15 text-[#34D399] border-[#34D399] border-1',
  E: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#FBBF24] border-1',
  C: 'bg-[#06B6D4]/15 text-[#22D3EE] border-[#22D3EE] border-1',
}

export function RIASECTypeBubble({ type }: RIASECTypeBubbleProps) {
  return (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold
        ${typeColorMap[type]}`}
    >
      {type}
    </div>
  )
}
