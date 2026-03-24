import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import DateRangePicker from './DateRangePicker'

export default function FilterBar() {
  return (
    <div className="bg-white rounded-xl p-5 grid grid-cols-5 gap-4 shadow">
      <DateRangePicker label="Mulai" />
      <DateRangePicker label="Selesai" />

      <div>
        <Typography variant="l2">Kategori Tes</Typography>
        <Input placeholder="Tes Profil Karir" />
      </div>

      <div>
        <Typography variant="l2">Hasil Tes</Typography>
        <Input placeholder="Semua Hasil" />
      </div>

      <div>
        <Typography variant="l2">Urutkan Berdasarkan</Typography>
        <Input placeholder="Nama A-Z" />
      </div>

      <div className="col-span-5 flex gap-2 mt-3">
        <Button>
          <Typography variant="l2">Terapkan Filter</Typography>
        </Button>
        <Button variant="outline">
          <Typography variant="l2" className="text-red-500">
            Reset Filter
          </Typography>
        </Button>
      </div>
    </div>
  )
}
