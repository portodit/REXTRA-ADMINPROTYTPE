import NextImage from '@/components/next-image'

export default function WelcomeCard() {
  return (
    <div
      className="
        w-full
        min-w-0
        bg-gradient-to-br from-[#5A7CFF] to-[#3C41DF]
        rounded-xl
        p-4
        text-white
      "
    >
      <div className="flex flex-col gap-4 min-w-0">
        <NextImage
          width={56}
          height={56}
          alt="Gajah"
          src="/dashboard/Gajah.jpg"
          className="w-14 h-14 shrink-0"
          imgClassName="rounded-full object-cover"
        />

        <div className="min-w-0">
          <h2 className="text-base font-semibold truncate">Hi Admin Rextra!</h2>

          <p className="text-sm text-white/80 break-words">
            Are you ready to take on today’s activities?
          </p>
        </div>
      </div>
    </div>
  )
}
