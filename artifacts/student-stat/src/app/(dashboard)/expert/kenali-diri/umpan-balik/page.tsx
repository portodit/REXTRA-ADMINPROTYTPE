import DataTabs from '@/app/(dashboard)/components/DataTabs'
import UmpanBalikFilterTabs from '@/app/(dashboard)/components/UmpanBalikFilterTabs'
import { getExpertFeedbacks } from './hooks/mutation'
import React from 'react'
import { ExpertFeedbackItem } from '@/types/kenali-diri'

export default async function UmpanBalik() {
  let expertData: ExpertFeedbackItem[] = []

  try {
    const response = await getExpertFeedbacks({ page: 1, page_size: 25 })
    if (response.success) {
      expertData = response.data.items
    }
  } catch (error) {
    console.error('[UmpanBalik] Failed to fetch expert feedbacks:', error)
  }

  return (
    <div className="flex min-h-screen bg-white p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <UmpanBalikFilterTabs />
        <DataTabs isExpert={true} expertData={expertData} />
      </div>
    </div>
  )
}
