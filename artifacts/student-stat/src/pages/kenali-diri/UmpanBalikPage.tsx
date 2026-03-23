import React, { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import UmpanBalikFilterTabs from '@/components/kenali-diri/UmpanBalikFilterTabs'
import KontrolUmpanBalik, { UmpanBalikFilters } from '@/components/kenali-diri/KontrolUmpanBalik'
import StudentFeedbackTable from '@/components/kenali-diri/StudentFeedbackTable'
import { useStudentFeedbacks } from '@/hooks/kenali-diri/useStudentFeedbacks'
import { StudentFeedbackItem } from '@/types/kenali-diri'

export default function UmpanBalikPage() {
  const { data, isLoading } = useStudentFeedbacks({ page: 1, page_size: 500 })

  const [filters, setFilters] = useState<UmpanBalikFilters>({
    search: '',
    test_category: '',
    sort: '',
    status: '',
  })

  const feedbackItems: StudentFeedbackItem[] = data?.data?.items ?? []

  const filteredData = useMemo(() => {
    let result = [...feedbackItems]

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          item.student.email.toLowerCase().includes(q),
      )
    }

    if (filters.test_category) {
      result = result.filter((item) => item.test_category === filters.test_category)
    }

    if (filters.status === 'has_suggestion') {
      result = result.filter((item) => item.message_to_team)
    } else if (filters.status === 'no_suggestion') {
      result = result.filter((item) => !item.message_to_team)
    }

    if (filters.sort === 'oldest') {
      result.sort(
        (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
      )
    } else {
      result.sort(
        (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
      )
    }

    return result
  }, [feedbackItems, filters])

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-white p-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <UmpanBalikFilterTabs />
          <KontrolUmpanBalik filters={filters} onFiltersChange={setFilters} />
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
          ) : (
            <StudentFeedbackTable tableData={filteredData} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
