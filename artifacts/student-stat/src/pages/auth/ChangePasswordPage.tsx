import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'
import CustomButton from '@/components/CustomButton'
import FormInput from '@/components/form/FormInput'
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
        <img
          src="/images/auth/logo-rextra.webp"
          alt="logo rextra"
          width={176}
          height={49}
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
          <div className="flex flex-col lg:gap-2 md:gap-3 gap-3 mb-6">
            <Typography
              variant="h5"
              className="text-[32px] font-bold text-[#212729] leading-[1.4]"
            >
              Ubah Kata Sandi
            </Typography>
            <Typography
              variant="bt"
              className="text-justify text-sm font-normal text-[#494848] mb-[26px] leading-[1.55]"
            >
              Hi Admin! Masukkan kata sandi baru kamu, dan kamu akan diarahkan ke halaman login untuk login kembali.
            </Typography>
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <FormInput
              label="Password Baru"
              id="new_password"
              type="password"
              placeholder="Masukkan password baru"
              validation={{ required: 'Password baru harus diisi' }}
              className="w-full h-[48px] text-black rounded-[10px]"
              labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
            />
            <FormInput
              label="Konfirmasi Password"
              id="confirm_password"
              type="password"
              placeholder="Konfirmasi password"
              validation={{ required: 'Konfirmasi password harus diisi' }}
              className="w-full h-[48px] text-black rounded-[10px]"
              labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
            />
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
              <span className="text-white text-lg">Ubah Kata Sandi</span>
            )}
          </CustomButton>
        </form>
      </FormProvider>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden relative">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <ChangePasswordForm />
      </Suspense>

      {/* ─── Right panel ─── */}
      <div className="w-full lg:w-1/2 bg-[#005DFF] text-white p-6 flex-col items-center text-center relative overflow-hidden lg:order-2 hidden lg:flex">
        <img
          src="/images/auth/butterfly.png"
          alt="Butterfly"
          className="absolute top-[75px] right-3 w-[65px] pointer-events-none select-none z-[3]"
        />
        <img
          src="/images/auth/wave-rextra-top.svg"
          alt=""
          className="absolute top-0 left-0 w-full pointer-events-none select-none"
        />
        <img
          src="/images/auth/wave-rextra.svg"
          alt=""
          className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16 pb-8">
          <img
            src="/images/auth/reset-sandi-mascot.png"
            alt="Reset Password"
            className="w-[300px] object-contain"
          />
          <Typography variant="h5" weight="bold" className="text-white mt-6 text-center">
            Ubah Kata Sandi
          </Typography>
        </div>
      </div>
    </div>
  )
}
