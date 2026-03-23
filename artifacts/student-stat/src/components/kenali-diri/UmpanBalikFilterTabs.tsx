import React from 'react'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { label: 'Mahasiswa', key: 'mahasiswa', path: '/kenali-diri/umpan-balik' },
  { label: 'Expert', key: 'expert', path: '/kenali-diri/umpan-balik/expert' },
]

export default function UmpanBalikFilterTabs() {
  const location = useLocation()
  const navigate = useNavigate()

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
            const isActive = location.pathname.includes(tab.key)
            return (
              <Button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={`
                  whitespace-nowrap rounded-lg shadow-none transition-all
                  ${
                    isActive
                      ? 'bg-[#CCDDFF] border-[#669AFF] border text-white hover:bg-[#CCDDFF] hover:border hover:border-[#669AFF]'
                      : 'bg-transparent text-[#669AFF] hover:bg-[#CCDDFF] hover:border hover:border-[#669AFF]'
                  }
                `}
              >
                <Typography variant="l2">{tab.label}</Typography>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
