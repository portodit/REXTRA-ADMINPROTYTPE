import NextImage from '@/components/next-image'

export default function StatsCard() {
  return (
    <div
      className="
        w-full
        min-w-0
        bg-white
        rounded-xl
        shadow
        p-4
        flex flex-col min-[550px]:flex-row
        gap-4 lg:gap-6
        items-center min-[550px]:items-center
      "
    >
      {/* Text */}
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-[#3C41DF] truncate">
          78.000+ Users
        </h1>

        <p className="text-sm text-gray-500 mt-2 break-words">
          Selamat! kamu mendapatkan lebih banyak user yang daftar hingga hari
          ini di Rextra.
        </p>

        <button className="mt-4 px-4 py-2 bg-primary-500 text-black rounded-lg shadow-2xl text-sm">
          Lihat Data User
        </button>
      </div>

      <div className="flex items-center min-[550px]:items-center">
        <NextImage
          width={128}
          height={128}
          src="/dashboard/Mascot Wisuda.svg"
          className="
          w-28 sm:w-32
          shrink-0
        "
          alt="Mascot"
        />
      </div>
    </div>
  )
}
