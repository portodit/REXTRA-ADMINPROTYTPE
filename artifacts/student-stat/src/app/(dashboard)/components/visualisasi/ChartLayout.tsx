'use client'
import Typography from '@/components/Typography'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

interface DetailSelengkapnya {
  detail: string
  implikasi: string
  aksi_prioritas: string
}

interface ChartLayoutProps {
  children: React.ReactNode
  title: string
  periode: string
  description: string
  className?: string
  isShowDetailSelengkapnyaButton?: boolean
  detailSelengkapnya?: DetailSelengkapnya
}

const ChartLayout = ({
  title,
  periode,
  description,
  children,
  className = '',
  isShowDetailSelengkapnyaButton = false,
  detailSelengkapnya,
}: ChartLayoutProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div
      className={`flex flex-col p-6 border-[1px] border-[#B5B7B8] rounded-xl h-full ${className}`}
    >
      <div className="flex flex-row mb-12 items-stretch">
        <div className="w-[3px] self-stretch rounded-lg bg-[#0046CC] mr-4" />

        <div className="flex flex-col">
          <Typography
            variant="h6"
            weight="semibold"
            font="Poppins"
            className="text-[#0046CC]"
          >
            {title}
          </Typography>
          <Typography
            variant="l1"
            weight="regular"
            font="Poppins"
            className="text-[#464B4D]"
          >
            {periode}
          </Typography>
        </div>
      </div>

      {children}
      <div className="border-1 border-[#FF7409] bg-[#FFF1E3] rounded-lg flex flex-row p-6 mt-12 gap-x-3">
        <div className="bg-[#FFDEBB] p-1 rounded-lg w-fit h-fit">
          <Lightbulb className="text-[#FF7409] p-1" />
        </div>
        <div className="flex flex-col ">
          <Typography
            variant="l1"
            weight="regular"
            font="Poppins"
            className="text-[#212729] my-auto"
          >
            {description}
          </Typography>
          {isShowDetailSelengkapnyaButton && !isOpen && (
            <div
              className="flex flex-row gap-x-1 hover:cursor-pointer"
              onClick={() => setOpen(!isOpen)}
            >
              <Typography
                variant="l2"
                weight="regular"
                font="Poppins"
                className="text-[#FF7409] my-auto"
              >
                Lihat detail selengkapnya
              </Typography>
              <ChevronDown className="text-[#FF7409]" />
            </div>
          )}
          {isShowDetailSelengkapnyaButton && isOpen && (
            <div
              className="flex flex-row gap-x-1 hover:cursor-pointer"
              onClick={() => setOpen(!isOpen)}
            >
              <Typography
                variant="l2"
                weight="regular"
                font="Poppins"
                className="text-[#FF7409] my-auto"
              >
                Sembunyikan detail
              </Typography>
              <ChevronUp className="text-[#FF7409]" />
            </div>
          )}

          {isOpen && (
            <>
              <div className="flex flex-col my-1">
                <Typography
                  variant="l2"
                  weight="regular"
                  font="Poppins"
                  className="text-[#212729] my-auto"
                >
                  <span className="font-semibold">• Detail: </span>
                  {detailSelengkapnya?.detail}
                </Typography>
              </div>
              <div className="flex flex-col my-1">
                <Typography
                  variant="l2"
                  weight="regular"
                  font="Poppins"
                  className="text-[#212729] my-auto"
                >
                  <span className="font-semibold">• Implikasi: </span>
                  {detailSelengkapnya?.implikasi}
                </Typography>
              </div>
              <div className="flex flex-col my-1">
                <Typography
                  variant="l2"
                  weight="regular"
                  font="Poppins"
                  className="text-[#212729] my-auto"
                >
                  <span className="font-semibold">• Aksi Prioritas: </span>
                  {detailSelengkapnya?.aksi_prioritas}
                </Typography>
              </div>

              <Typography
                variant="l2"
                weight="regular"
                font="Poppins"
                className="text-[#FF7409] my-auto italic mt-3"
              >
                Catatan: Jumlah respon masih terbatas (15), sehingga
                interpretasi bersifat indikatif dan perlu dikonfirmasi dengan
                sampel yang lebih besar
              </Typography>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartLayout
