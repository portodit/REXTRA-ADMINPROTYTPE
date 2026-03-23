import React, { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import UmpanBalikFilterTabs, { UmpanBalikTabKey } from '@/components/kenali-diri/UmpanBalikFilterTabs'
import KontrolUmpanBalik, { UmpanBalikFilters } from '@/components/kenali-diri/KontrolUmpanBalik'
import StudentFeedbackTable from '@/components/kenali-diri/StudentFeedbackTable'
import ExpertFeedbackTable from '@/components/kenali-diri/ExpertFeedbackTable'
import { StudentFeedbackItem, ExpertFeedbackItem } from '@/types/kenali-diri'

/* =======================================================
   DUMMY DATA — Mahasiswa (format StudentFeedbackItem)
======================================================= */

const MAHASISWA_DATA: StudentFeedbackItem[] = [
  { id: 1, student: { user_id: 'u1', name: 'Siti Nurhaliza',  email: 'siti@email.com'  }, scores: { ease: 6, relevance: 5, satisfaction: 6 }, obstacles: [{ id: 1, label: 'Waktu loading lama' }, { id: 2, label: 'Tampilan kurang responsif' }], message_to_team: 'Secara keseluruhan cukup membantu.', submitted_at: '10 Des 2025', test_category: 'CAREER_PROFILE' },
  { id: 2, student: { user_id: 'u2', name: 'Budi Santoso',    email: 'budi@email.com'  }, scores: { ease: 7, relevance: 7, satisfaction: 6 }, obstacles: [], message_to_team: 'Sangat membantu!', submitted_at: '09 Des 2025', test_category: 'CAREER_PROFILE' },
  { id: 3, student: { user_id: 'u3', name: 'Rina Wulandari',  email: 'rina@email.com'  }, scores: { ease: 4, relevance: 3, satisfaction: 4 }, obstacles: [{ id: 3, label: 'Pertanyaan membingungkan' }], message_to_team: 'Beberapa pertanyaan kurang jelas.', submitted_at: '08 Des 2025', test_category: 'PERSONALITY' },
  { id: 4, student: { user_id: 'u4', name: 'Andi Pratama',    email: 'andi@email.com'  }, scores: { ease: 5, relevance: 6, satisfaction: 5 }, obstacles: [{ id: 4, label: 'Navigasi kurang jelas' }], message_to_team: null, submitted_at: '07 Des 2025', test_category: 'CAREER_PROFILE' },
  { id: 5, student: { user_id: 'u5', name: 'Dewi Lestari',    email: 'dewi@email.com'  }, scores: { ease: 7, relevance: 6, satisfaction: 7 }, obstacles: [], message_to_team: 'Sangat bermanfaat!', submitted_at: '06 Des 2025', test_category: 'INTEREST' },
  { id: 6, student: { user_id: 'u6', name: 'Ahmad Rizki',     email: 'ahmad@email.com' }, scores: { ease: 6, relevance: 5, satisfaction: 6 }, obstacles: [{ id: 5, label: 'Loading terlalu lama' }], message_to_team: null, submitted_at: '05 Des 2025', test_category: 'CAREER_PROFILE' },
  { id: 7, student: { user_id: 'u7', name: 'Putri Handayani', email: 'putri@email.com' }, scores: { ease: 3, relevance: 4, satisfaction: 3 }, obstacles: [{ id: 6, label: 'Error saat submit' }], message_to_team: 'Pengalaman kurang baik.', submitted_at: '04 Des 2025', test_category: 'PERSONALITY' },
  { id: 8, student: { user_id: 'u8', name: 'Fajar Nugroho',   email: 'fajar@email.com' }, scores: { ease: 6, relevance: 7, satisfaction: 6 }, obstacles: [], message_to_team: null, submitted_at: '03 Des 2025', test_category: 'INTEREST' },
  { id: 9, student: { user_id: 'u9', name: 'Maya Sari',       email: 'maya@email.com'  }, scores: { ease: 5, relevance: 5, satisfaction: 5 }, obstacles: [{ id: 7, label: 'Font terlalu kecil' }], message_to_team: 'Ukuran font diperbesar.', submitted_at: '02 Des 2025', test_category: 'CAREER_PROFILE' },
  { id: 10, student: { user_id: 'u10', name: 'Reza Firmansyah', email: 'reza@email.com' }, scores: { ease: 7, relevance: 6, satisfaction: 7 }, obstacles: [], message_to_team: 'Rekomendasi sangat akurat!', submitted_at: '01 Des 2025', test_category: 'CAREER_PROFILE' },
]

/* =======================================================
   DUMMY DATA — Expert (format ExpertFeedbackItem)
======================================================= */

const EXPERT_DATA: ExpertFeedbackItem[] = [
  { id: 1, expert: { user_id: 'e1', name: 'Dinda Aulia',     email: 'dinda@email.com' }, scores: { ease: 6, relevance: 7, satisfaction: 6 }, obstacles: [], message_to_team: 'Rekomendasi sangat akurat.', submitted_at: '10 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'P1' },
  { id: 2, expert: { user_id: 'e2', name: 'Budi Hartono',    email: 'budi@email.com'  }, scores: { ease: 5, relevance: 5, satisfaction: 6 }, obstacles: [{ id: 1, label: 'Penjelasan terlalu panjang' }], message_to_team: 'Profesi muncul di posisi 3.', submitted_at: '09 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'P3-5' },
  { id: 3, expert: { user_id: 'e3', name: 'Sari Indah',      email: 'sari@email.com'  }, scores: { ease: 6, relevance: 6, satisfaction: 7 }, obstacles: [], message_to_team: 'Cukup baik.', submitted_at: '08 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'P3-5' },
  { id: 4, expert: { user_id: 'e4', name: 'Ahmad Fauzan',    email: 'fauzan@email.com' }, scores: { ease: 7, relevance: 7, satisfaction: 7 }, obstacles: [], message_to_team: 'Sangat akurat!', submitted_at: '07 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'P1' },
  { id: 5, expert: { user_id: 'e5', name: 'Lisa Permata',    email: 'lisa@email.com'  }, scores: { ease: 3, relevance: 4, satisfaction: 4 }, obstacles: [{ id: 2, label: 'Pertanyaan membingungkan' }], message_to_team: 'Profesi tidak muncul.', submitted_at: '06 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'Tidak Muncul' },
  { id: 6, expert: { user_id: 'e6', name: 'Rendi Kurniawan', email: 'rendi@email.com' }, scores: { ease: 6, relevance: 6, satisfaction: 6 }, obstacles: [{ id: 3, label: 'Durasi tes terlalu lama' }], message_to_team: 'Cukup akurat, posisi 2.', submitted_at: '05 Des 2025', test_category: 'CAREER_PROFILE', top5_status: 'P2' },
]

/* =======================================================
   PAGE COMPONENT
======================================================= */

const DEFAULT_FILTERS: UmpanBalikFilters = {
  search: '',
  test_category: '',
  sort: '',
  status: '',
}

const ALL_VALUE = 'ALL'

export default function UmpanBalikPage() {
  const [activeTab, setActiveTab] = useState<UmpanBalikTabKey>('mahasiswa')
  const [filters, setFilters] = useState<UmpanBalikFilters>(DEFAULT_FILTERS)

  const filteredMahasiswa = useMemo(() => {
    let data = [...MAHASISWA_DATA]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter((i) => i.student.name.toLowerCase().includes(q))
    }
    if (filters.test_category && filters.test_category !== ALL_VALUE) {
      data = data.filter((i) => i.test_category === filters.test_category)
    }
    if (filters.status === 'has_suggestion') data = data.filter((i) => !!i.message_to_team)
    if (filters.status === 'no_suggestion')  data = data.filter((i) => !i.message_to_team)
    if (filters.sort === 'oldest') data.sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
    return data
  }, [filters])

  const filteredExpert = useMemo(() => {
    let data = [...EXPERT_DATA]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter((i) => i.expert.name.toLowerCase().includes(q))
    }
    if (filters.test_category && filters.test_category !== ALL_VALUE) {
      data = data.filter((i) => i.test_category === filters.test_category)
    }
    if (filters.status === 'has_suggestion') data = data.filter((i) => !!i.message_to_team)
    if (filters.status === 'no_suggestion')  data = data.filter((i) => !i.message_to_team)
    return data
  }, [filters])

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto space-y-6 p-6">
          <UmpanBalikFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <KontrolUmpanBalik filters={filters} onFiltersChange={setFilters} />
          {activeTab === 'mahasiswa' ? (
            <StudentFeedbackTable tableData={filteredMahasiswa} />
          ) : (
            <ExpertFeedbackTable tableData={filteredExpert} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
