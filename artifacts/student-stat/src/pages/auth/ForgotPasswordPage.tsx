import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'
import CustomButton from '@/components/CustomButton'
import FormInput from '@/components/form/FormInput'
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'

const ForgotSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
})

export default function ForgotPasswordPage() {
  const methods = useForm<z.infer<typeof ForgotSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(ForgotSchema),
  })

  const { handleSubmit, formState: { isValid } } = methods
  const { mutate, isPending } = useForgotPassword()

  const onSubmit = (data: z.infer<typeof ForgotSchema>) => {
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
                className="text-[32px] font-bold text-[#212729] leading-[1.4]"
              >
                Lupa Kata Sandi
              </Typography>
              <Typography
                variant="bt"
                className="text-justify text-sm font-normal text-[#494848] mb-[26px] leading-[1.55]"
              >
                Hi Admin! Masukkan email kamu, dan kami akan kirimkan tautan untuk atur ulang kata sandi.
              </Typography>
            </div>

            <div className="mb-6">
              <FormInput
                label="Email"
                id="email"
                type="email"
                placeholder="Masukkan Email Kamu"
                validation={{ required: 'Email harus diisi' }}
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
                <span className="text-white text-lg">Kirim Tautan</span>
              )}
            </CustomButton>
          </form>
        </FormProvider>
      </div>

      {/* ─── Right panel: blue with mascot ─── */}
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
            alt="Reset Password Mascot"
            className="w-[300px] object-contain"
          />
          <Typography variant="h5" weight="bold" className="text-white mt-6 text-center">
            Atur Ulang Kata Sandi
          </Typography>
          <Typography variant="bt" className="text-white/80 mt-2 text-center max-w-xs">
            Kami akan kirimkan tautan ke email Anda.
          </Typography>
        </div>
      </div>
    </div>
  )
}
