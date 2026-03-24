import DataTabs from '@/app/(dashboard)/components/DataTabs'
import UmpanBalikFilterTabs from '@/app/(dashboard)/components/UmpanBalikFilterTabs'
import { StudentFeedbackItem } from '@/types/kenali-diri'
import React from 'react'
import { getStudentFeedbacks } from './hooks/mutation'

export default async function UmpanBalik() {
  let studentData: StudentFeedbackItem[] = []

  try {
    const response = await getStudentFeedbacks({ page: 1, page_size: 25 })
    if (response.success) {
      studentData = response.data.items
    }
  } catch (error) {
    console.error('[UmpanBalik] Failed to fetch student feedbacks:', error)
  }

  return (
    <div className="flex min-h-screen bg-white p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <UmpanBalikFilterTabs />
        <DataTabs isExpert={false} mahasiswaData={studentData} />
      </div>
    </div>
  )
}
