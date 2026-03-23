import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'
import CustomButton from '@/components/CustomButton'
import FormInput from '@/components/form/FormInput'
import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation'
import { RegisterSchema } from '@/validation/register'

export default function RegisterPage() {
  const methods = useForm<z.infer<typeof RegisterSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(RegisterSchema),
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

  const { mutate, isPending } = useRegisterMutation()

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* ─── Left panel: form ─── */}
      <div className="w-full lg:pl-20 lg:pr-28 lg:w-1/2 pr-5 pl-[23px] pt-8 pb-16 max-w-lg lg:max-w-full md:max-w-2xl mx-auto relative">
        <div className="pb-[72px] lg:pb-[40px] pt-6 lg:flex hidden">
          <img
            src="/images/auth/logo-rextra.svg"
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
                Daftar Akun REXTRA
              </Typography>
              <Typography
                variant="bt"
                className="text-justify text-sm font-normal text-[#494848] mb-[26px] leading-[1.55]"
              >
                Yuk, buat akun untuk mulai persiapan dan wujudkan karier digital impian bersama REXTRA!
              </Typography>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <FormInput
                label="Nama Lengkap"
                id="fullname"
                placeholder="Masukkan Nama Lengkap Kamu"
                className="w-full h-[48px] text-black rounded-[10px]"
                labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
              />
              <FormInput
                label="Email"
                id="email"
                type="email"
                placeholder="Masukkan Alamat Email Kamu"
                validation={{
                  required: 'Email harus diisi',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: 'Format email tidak valid',
                  },
                }}
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
              <FormInput
                label="Konfirmasi Kata Sandi"
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi Kata Sandi"
                validation={{ required: 'Konfirmasi password harus diisi' }}
                className="w-full h-[48px] text-black rounded-[10px]"
                labelTextClasname="text-[14px] leading-[18px] mb-2 font-medium"
              />
              <FormInput
                label="Nomor Telepon (opsional)"
                id="phone_number"
                placeholder="Contoh: 081234567890"
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
                <span className="text-white text-lg">Daftar</span>
              )}
            </CustomButton>

            <div className="mt-4 text-center">
              <Typography variant="bt" className="text-[#494848] text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-[#003499] underline font-medium">
                  Masuk di sini
                </Link>
              </Typography>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* ─── Right panel: blue with mascot ─── */}
      <div className="w-full lg:w-1/2 bg-transparent lg:bg-[#005DFF] text-white p-6 flex-col items-center text-center relative overflow-hidden lg:order-2 hidden lg:flex">
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
            src="/images/auth/mascot-rextra.png"
            alt="Mascot REXTRA"
            className="w-[300px] object-contain"
          />
          <Typography variant="h5" weight="bold" className="text-white mt-6 text-center">
            Bergabung Bersama REXTRA
          </Typography>
          <Typography variant="bt" className="text-white/80 mt-2 text-center max-w-xs">
            Mulai perjalanan karier digitalmu bersama ribuan pengguna REXTRA.
          </Typography>
        </div>
      </div>
    </div>
  )
}
