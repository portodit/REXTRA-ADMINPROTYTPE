'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import NextImage from '@/components/NextImage'
import Typography from '@/components/Typography'
import Button from '@/components/Button'
import Input from '@/components/form/Input'
import { useChangePassword } from '@/hooks/auth/useChangePassword'
import { ChangePasswordSchema } from '@/validation/changePassword'

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>

function ChangePasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') ?? null

  const methods = useForm<ChangePasswordForm>({
    mode: 'onBlur',
    resolver: zodResolver(ChangePasswordSchema),
  })

  const { handleSubmit, formState: { isValid } } = methods
  const { mutate, isPending } = useChangePassword(token)

  const onSubmit = (data: ChangePasswordForm) => {
    mutate(data.new_password)
  }

  return (
    <div className="w-full lg:pl-20 lg:pr-28 lg:w-1/2 pr-5 pl-[23px] pt-8 pb-16 max-w-lg lg:max-w-full md:max-w-2xl mx-auto relative">
      <div className="pb-[72px] lg:pb-[40px] pt-6 lg:flex hidden">
        <NextImage
          src="/auth/logo-rextra.webp"
          alt="logo rextra"
          width={176}
          height={49}
          className="left-[72px]"
        />
        <NextImage
          src="/auth/topstar-authlg.svg"
          alt="Wave"
          width={579}
          height={556}
          className={cn(
            'absolute top-0',
            'right-0 w-[579px] max-w-full pointer-events-none select-none hidden lg:block',
          )}
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
          <div className="flex flex-col lg:gap-2 md:gap-3 gap-3">
            <div>
              <Typography
                variant="h5"
                className="text-[32px] md:text-[32px] font-bold text-[#212729] leading-[1.4]"
              >
                Ubah Kata Sandi
              </Typography>
            </div>
            <div>
              <Typography
                variant="bt"
                className="text-justify text-sm font-normal text-[#494848] mb-[26px] leading-[1.55]"
              >
                Hi Admin! Masukkan kata sandi baru kamu, dan kamu akan diarahkan ke halaman login untuk login kembali.
              </Typography>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <Input
              label="Password Baru"
              id="new_password"
              type="password"
              placeholder="Masukkan password baru"
              className="w-full h-[48px] text-black rounded-[10px] font-Poppins font-medium"
              labelTextClasname="max-md:text-[12px] text-[14px] leading-[18px] mb-2 font-Poppins font-medium"
            />
            <Input
              label="Konfirmasi Password"
              id="confirm_password"
              type="password"
              placeholder="Konfirmasi password"
              className="w-full h-[48px] text-black rounded-[10px] font-Poppins font-medium"
              labelTextClasname="max-md:text-[12px] text-[14px] leading-[18px] mb-2 font-Poppins font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || isPending}
            isLoading={isPending}
            className="w-full bg-[#005DFF] px-4 py-3 rounded-[10px] font-semibold hover:bg-blue-700 transition"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <Typography className="text-white text-lg">Memproses</Typography>
              </div>
            ) : (
              <Typography className="text-white text-lg">Ubah Kata Sandi</Typography>
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* ─── Right panel: blue with mascot ─── */}
      <div className="w-full lg:w-1/2 bg-transparent lg:bg-[#005DFF] text-white p-6 flex flex-col items-center text-center relative overflow-hidden lg:order-2">
        <NextImage
          src="/auth/butterfly.png"
          alt="Butterfly"
          width={65}
          height={64}
          className={cn(
            'absolute top-[75px] right-3',
            'w-[65px] max-w-full pointer-events-none select-none lg:flex hidden z-[3]',
          )}
        />
        <NextImage
          src="/auth/butterfly.png"
          alt="Butterfly"
          width={65}
          height={64}
          className={cn(
            'absolute top-[384px] left-[280px]',
            'w-[65px] max-w-full pointer-events-none select-none lg:flex hidden z-[3] rotate-[30deg]',
          )}
        />
        <NextImage
          src="/auth/butterfly.png"
          alt="Butterfly"
          width={65}
          height={64}
          className={cn(
            'absolute top-[366px] left-[34px]',
            'w-[65px] max-w-full pointer-events-none select-none lg:flex hidden z-[3] rotate-[40deg]',
          )}
        />
        <NextImage
          src="/auth/text.png"
          alt="REXTRA Admin"
          width={519}
          height={297}
          className={cn(
            'absolute top-[88px]',
            'w-[519px] max-w-full pointer-events-none select-none lg:flex hidden z-[4]',
          )}
        />
        <NextImage
          src="/auth/reset-sandi-mascot.png"
          alt="Reset Sandi Mascot"
          width={540}
          height={550}
          className={cn(
            'absolute bottom-0 right-0',
            'w-[540px] max-w-full pointer-events-none select-none lg:flex hidden z-[3]',
          )}
        />
        <NextImage
          src="/auth/wave-rextra-top.svg"
          alt="Wave"
          width={272}
          height={179}
          className={cn(
            'absolute top-0 left-0',
            'w-[272px] max-w-full pointer-events-none select-none lg:flex hidden',
          )}
        />
        <NextImage
          src="/auth/star-right.png"
          alt="Star Right"
          width={500}
          height={678}
          className={cn(
            'absolute right-0 top-[55%] -translate-y-1/2',
            'w-[500px] max-w-full pointer-events-none select-none lg:flex hidden z-[2]',
          )}
        />
        <NextImage
          src="/auth/star-bottom.png"
          alt="Star Bottom"
          width={779}
          height={747}
          className={cn(
            'absolute left-0 bottom-0',
            'w-[779px] max-w-full pointer-events-none select-none lg:flex hidden z-[2]',
          )}
        />
      </div>

      {/* Mobile decorations */}
      <NextImage
        src="/auth/rightstar-auth.svg"
        alt="Wave"
        width={674}
        height={667}
        className={cn(
          'absolute bottom-0',
          'right-0 w-[674px] max-w-sm sm:max-w-md pointer-events-none select-none lg:hidden flex',
        )}
      />
      <NextImage
        src="/auth/topstar-auth.svg"
        alt="Wave"
        width={579}
        height={559}
        className={cn(
          'absolute top-0',
          'left-0 w-[579px] max-w-sm sm:max-w-md pointer-events-none select-none lg:hidden flex',
        )}
      />
      <NextImage
        src="/auth/leftstar-authlg.svg"
        alt="Wave"
        width={570}
        height={551}
        className={cn(
          'absolute bottom-0',
          'left-0 w-[570px] max-w-full pointer-events-none select-none hidden lg:flex',
        )}
      />

      {/* ─── Left panel: form ─── */}
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <ChangePasswordForm />
      </Suspense>
    </div>
  )
}
