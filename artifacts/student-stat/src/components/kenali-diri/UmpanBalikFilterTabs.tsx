import React from 'react'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'

const tabs = [
  { label: 'Mahasiswa', key: 'mahasiswa' },
  { label: 'Expert', key: 'expert' },
] as const

type TabKey = (typeof tabs)[number]['key']

interface UmpanBalikFilterTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export default function UmpanBalikFilterTabs({ activeTab, onTabChange }: UmpanBalikFilterTabsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <Typography variant="h5" weight="bold" font="Poppins">
          Umpan Balik Fitur Kenali Diri
        </Typography>
        <Typography variant="l1" className="text-gray-500" font="Poppins">
          Menyajikan data respon umpan balik pengguna fitur Kenali Diri
        </Typography>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center gap-4 w-full">
        <div
          className="
            flex gap-2
            w-fit
            bg-[#D3D4D4]/15
            outline outline-1 outline-[#B5B7B8]
            rounded-lg
            p-1
          "
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`
                  whitespace-nowrap rounded-lg shadow-none transition-all
                  ${
                    isActive
                      ? 'bg-[#CCDDFF] border-[#669AFF] border text-[#003499] hover:bg-[#CCDDFF] hover:border hover:border-[#669AFF]'
                      : 'bg-transparent text-[#494848] hover:bg-[#CCDDFF]/50 shadow-none'
                  }
                `}
              >
                <Typography variant="l2" weight={isActive ? 'semibold' : 'regular'}>
                  {tab.label}
                </Typography>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export type { TabKey as UmpanBalikTabKey }
