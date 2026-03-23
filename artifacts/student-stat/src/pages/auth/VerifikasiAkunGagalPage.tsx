import Link from 'next/link'
import React from 'react'
import Typography from '@/components/Typography'
import { Button } from '@/components/ui/button'

export default function VerifikasiAkunGagalPage() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-white px-4 text-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-[url('/images/auth/auth-admin-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed brightness-60 hidden md:block"
        aria-hidden="true"
      />
      <img
        src="/images/auth/bintang1.png"
        alt="bintang1"
        className="absolute inset-0 z-0 md:hidden block"
      />
      <img
        src="/images/auth/bintang2.png"
        alt="bintang2"
        className="absolute md:hidden block z-10 bottom-0 right-0 w-[290px] h-auto translate-x-1/4 translate-y-1/4 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-[655px] rounded-[20px] bg-white px-6 sm:px-10 py-10 text-center shadow-xl">
        <Typography
          variant="h4"
          font="Montserrat"
          weight="bold"
          className="text-center text-[#212729] text-[24px] leading-tight"
        >
          Verifikasi Gagal
        </Typography>
        <Typography
          variant="bt"
          font="Montserrat"
          weight="regular"
          className="mt-2 mb-8 text-center text-[#494848] text-[14px]"
        >
          Tautan verifikasi tidak valid atau sudah kedaluwarsa. Silakan minta tautan verifikasi baru.
        </Typography>

        <img
          src="/images/auth/auth-user-verifikasi-akun-gagal.png"
          alt="Verifikasi Gagal"
          className="mx-auto object-contain w-[249px] h-[241px] aspect-auto"
        />

        <Link href="/verifikasi-akun" className="block">
          <Button className="w-full sm:w-3/4 mx-auto mt-5 bg-[#0046CC] hover:bg-[#0046CC]/80 rounded-lg">
            <Typography
              variant="bt"
              font="Poppins"
              weight="semibold"
              className="text-white text-[18px]"
            >
              Kirim Tautan Baru
            </Typography>
          </Button>
        </Link>
        <Typography
          variant="t2"
          font="Poppins"
          weight="regular"
          className="text-center text-[#494848] text-[14px] mt-2"
        >
          <Link href="/login" className="underline text-[#003499]">
            Kembali ke Login
          </Link>
        </Typography>
      </div>
    </div>
  )
}
