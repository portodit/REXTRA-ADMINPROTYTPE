'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500">Halaman tidak ditemukan</p>
      <Link href="/persona-rextra" className="text-blue-600 underline">
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
