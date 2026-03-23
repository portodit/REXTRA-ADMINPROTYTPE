import Link from 'next/link'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'
import CustomButton from '@/components/CustomButton'
import FormInput from '@/components/form/FormInput'
import { useLoginMutation } from '@/hooks/auth/useLoginMutation'
import { LoginSchema } from '@/validation/login'

export default function LoginPage() {
  const methods = useForm<z.infer<typeof LoginSchema>>({
    mode: 'onChange',
    resolver: zodResolver(LoginSchema),
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

  const { mutate, isPending } = useLoginMutation()

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* ─── Left panel: form ─── */}
      <div className="w-full lg:pl-20 lg:pr-28 lg:w-1/2 pr-5 pl-[23px] pt-8 pb-16 max-w-lg lg:max-w-full md:max-w-2xl mx-auto relative">
        <div className="pb-[72px] lg:pb-[40px] pt-6 lg:flex hidden">
          <img
            src="/images/auth/logo-rextra.webp"
            alt="logo rextra"
            width={137}
            height={25}
            className="left-[72px]"
          />
          <img
            src="/images/auth/topstar-authlg.svg"
            alt="Wave"
            className={cn(
              'absolute top-0',
              'right-0 w-[579px] max-w-full pointer-events-none select-none hidden lg:block',
            )}
          />
        </div>

        <FormProvider {...methods}>
          <form className="mt-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:gap-2 md:gap-3 gap-3 mb-6">
              <Typography
                variant="h5"
                className="text-[32px] md:text-[32px] font-bold text-[#212729] leading-[1.4]"
              >
                Masuk ke REXTRA
              </Typography>
              <Typography
                variant="bt"
                className="text-justify text-sm font-normal text-[#494848] leading-[1.55]"
              >
                Halo, Admin! Masuk untuk mengelola dan memantau platform REXTRA.
              </Typography>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <FormInput
                label="Email"
                id="email"
                type="email"
                placeholder="Masukkan Alamat Email Kamu"
                validation={{ required: 'Email harus diisi' }}
                className="w-full h-[48px] text-black rounded-[10px]"
                labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
              />
              <FormInput
                label="Kata Sandi"
                id="password"
                type="password"
                placeholder="Masukkan Kata Sandi"
                validation={{ required: 'Password harus diisi' }}
                className="w-full h-[48px] text-black rounded-[10px]"
                labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
              />
            </div>

            <div className="flex justify-end mb-6">
              <Link href="/forgot-password"
                className="text-sm text-[#003499] underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <CustomButton
              type="submit"
              disabled={!isValid || isPending}
              isLoading={isPending}
              className="w-full bg-[#005DFF] px-4 py-3 rounded-[10px] font-semibold hover:bg-blue-700 transition text-white h-[48px]"
            >
              {isPending ? (
                <span className="text-white text-lg">Memproses...</span>
              ) : (
                <span className="text-white text-lg">Masuk</span>
              )}
            </CustomButton>

          </form>
        </FormProvider>
      </div>

      {/* ─── Right panel: blue with mascot ─── */}
      <div className="w-full lg:w-1/2 bg-transparent lg:bg-[#005DFF] text-white p-6 flex flex-col items-center text-center relative overflow-hidden lg:order-2">
        <img
          src="/images/auth/butterfly.png"
          alt="Butterfly"
          className="absolute top-[75px] right-3 w-[65px] max-w-full pointer-events-none select-none lg:flex hidden z-[3]"
        />
        <img
          src="/images/auth/wave-rextra-top.svg"
          alt="Wave Top"
          className="absolute top-0 left-0 w-full pointer-events-none select-none hidden lg:block"
        />
        <img
          src="/images/auth/wave-rextra.svg"
          alt="Wave"
          className="absolute bottom-0 left-0 w-full pointer-events-none select-none hidden lg:block"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16 pb-8 hidden lg:flex">
          <img
            src="/images/auth/mascot-rextra.png"
            alt="Mascot REXTRA"
            className="w-[320px] max-w-full object-contain"
          />
          <Typography
            variant="h5"
            weight="bold"
            className="text-white mt-6 text-center"
          >
            Selamat Datang di REXTRA Admin
          </Typography>
          <Typography
            variant="bt"
            className="text-white/80 mt-2 text-center max-w-xs"
          >
            Kelola dan pantau semua fitur platform dengan mudah.
          </Typography>
        </div>

        {/* Mobile decorative images */}
        <img
          src="/images/auth/bintang1.png"
          alt="bintang1"
          className="absolute inset-0 z-0 md:hidden block"
        />
      </div>
    </div>
  )
}
