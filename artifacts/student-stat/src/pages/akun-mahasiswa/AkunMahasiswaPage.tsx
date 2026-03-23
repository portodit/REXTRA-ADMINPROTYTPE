'use client'

import { Users } from 'lucide-react'

export default function AkunMahasiswaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Akun Mahasiswa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola data akun mahasiswa platform REXTRA.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Halaman dalam pengembangan</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Fitur manajemen akun mahasiswa akan segera tersedia.
        </p>
      </div>
    </div>
  )
}
