'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import { AssessmentData } from './assesmentTypes'
import AssessmentEditor from './AssesmentEditor'
import { ArrowLeft } from 'lucide-react'
import AssessmentPreview from './AssesementPreview'

const initialData: AssessmentData = {
  summary: {
    code: 'A1-001',
    title: 'Analisis Profil',
    content: 'Deskripsi profil pengguna...',
  },
  sections: {
    kekuatan: [
      {
        id: '1',
        title: 'Pemecah Masalah',
        description: 'Mampu menganalisis situasi kompleks...',
      },
    ],
    tantangan: [],
    strategi: [],
    interaksi: [],
    lingkungan: [],
  },
}

export default function AssessmentPage() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [data, setData] = useState<AssessmentData>(initialData)

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full flex flex-row justify-between items-center p-6 bg-white shadow-sm border-b">
        <Button variant="ghost" className="flex flex-row gap-x-3">
          <ArrowLeft className="text-[#14181F]" />
          <Typography variant="l2" weight="regular" className="text-[#14181F]">
            Back
          </Typography>
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="min-w-[140px] gap-2 bg-[#0046CC] hover:bg-[#0046CC]/75 text-white cursor-pointer"
          >
            {mode === 'edit' ? 'Preview' : 'Edit'}
          </Button>
        </div>
      </header>

      <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {mode === 'edit' ? (
            <AssessmentEditor data={data} setData={setData} />
          ) : (
            <AssessmentPreview data={data} />
          )}
        </div>
      </div>
    </>
  )
}
