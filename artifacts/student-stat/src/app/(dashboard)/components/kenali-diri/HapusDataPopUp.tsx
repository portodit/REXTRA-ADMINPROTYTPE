'use client'
import React from 'react'
import Typography from '@/components/Typography'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from 'lucide-react'

interface HapusDataPopUpProps {
  children: React.ReactNode
  open: boolean
  onClose: () => void
}

export default function HapusDataPopUp({
  open,
  onClose,
  children,
}: HapusDataPopUpProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[655px] rounded-[20px] bg-white px-6 sm:px-10 py-10 text-center shadow-xl">
        {/* Close */}
        <button
          className="absolute top-5 right-5 text-gray-700 hover:opacity-70"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <Image
          src="/images/dashboard/trash.png"
          alt="Hapus Data"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />

        <Typography variant="t1" weight="semibold">
          Hapus Data Hasil Tes
        </Typography>

        <div className="mt-3 flex flex-col">{children}</div>

        {/* Confirmation Checkbox */}
        <label className="mt-6 flex items-start gap-3 rounded-xl border border-red-500 bg-red-50 p-4 text-left text-sm text-gray-700 cursor-pointer">
          <Checkbox
            checked={isConfirmed}
            onCheckedChange={(v) => setIsConfirmed(Boolean(v))}
            className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
          />

          <span>
            Saya mengerti bahwa data ini akan dihapus permanen dan tidak dapat
            dikembalikan.
          </span>
        </label>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Button
            className="w-full min-w-0 bg-[#CCDDFF] text-[#0046CC] font-bold hover:bg-[#CCDDFF] hover:text-[#0046CC]"
            onClick={onClose}
          >
            Batal
          </Button>

          <Button
            className="w-full min-w-0 bg-[#3379FF] text-[#D3D4D4] font-bold hover:bg-[#3379FF] hover:text-[#D3D4D4]"
            disabled={!isConfirmed}
          >
            Hapus Data
          </Button>
        </div>
      </div>
    </div>
  )
}
