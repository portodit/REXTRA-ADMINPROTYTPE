'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Trash2,
  Pen,
  Zap,
  Target,
  Lightbulb,
  Users,
  Home,
  LucideIcon, // Import the type for Lucide icons
} from 'lucide-react'
import Typography from '@/components/Typography'
import { AssessmentData } from './assesmentTypes'
import { Label } from '@/components/ui/label'

// 1. Labels for the UI
const sectionLabels: Record<string, string> = {
  kekuatan: 'Kekuatan Profil',
  tantangan: 'Tantangan Profil',
  strategi: 'Strategi Pengembangan Diri',
  interaksi: 'Gaya Interaksi & Kolaborasi',
  lingkungan: 'Lingkungan Kerja Yang Ideal',
  strengths: 'Kekuatan Profil',
  challenges: 'Tantangan Profil',
  strategies: 'Strategi Pengembangan Diri',
  collaboration: 'Gaya Interaksi & Kolaborasi',
  environment: 'Lingkungan Kerja Yang Ideal',
}

// 2. Configuration for Icons and Colors - Typed with LucideIcon
interface SectionStyle {
  icon: LucideIcon
  bg: string
  text: string
}

const sectionConfig: Record<string, SectionStyle> = {
  kekuatan: { icon: Zap, bg: 'bg-[#D0EDDB]', text: 'text-[#16A34A]' },
  strengths: { icon: Zap, bg: 'bg-[#D0EDDB]', text: 'text-[#16A34A]' },
  tantangan: { icon: Target, bg: 'bg-[#FFDCC2]', text: 'text-[#EA580C]' },
  challenges: { icon: Target, bg: 'bg-[#FFDCC2]', text: 'text-[#EA580C]' },
  strategi: { icon: Lightbulb, bg: 'bg-[#D1E9FF]', text: 'text-[#2563EB]' },
  strategies: { icon: Lightbulb, bg: 'bg-[#D1E9FF]', text: 'text-[#2563EB]' },
  interaksi: { icon: Users, bg: 'bg-[#E0E7FF]', text: 'text-[#4F46E5]' },
  collaboration: { icon: Users, bg: 'bg-[#E0E7FF]', text: 'text-[#4F46E5]' },
  lingkungan: { icon: Home, bg: 'bg-[#F1F5F9]', text: 'text-[#475569]' },
  environment: { icon: Home, bg: 'bg-[#F1F5F9]', text: 'text-[#475569]' },
}

export default function AssessmentEditor({
  data,
  setData,
}: {
  data: AssessmentData
  setData: Dispatch<SetStateAction<AssessmentData>> // Fixed: Replaced any
}) {
  const addItem = (section: keyof AssessmentData['sections']) => {
    const newItem = { id: Date.now().toString(), title: '', description: '' }
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: [...prev.sections[section], newItem],
      },
    }))
  }

  const removeItem = (
    section: keyof AssessmentData['sections'],
    id: string,
  ) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].filter((i) => i.id !== id),
      },
    }))
  }

  const updateItem = (
    section: keyof AssessmentData['sections'],
    id: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].map((i) =>
          i.id === id ? { ...i, [field]: value } : i,
        ),
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row gap-x-3 items-center border-b border-[#E2E4E9] py-3 w-fit pr-8">
        <div className="flex items-center gap-2 bg-[#FFF1E3]/15 outline outline-1 outline-[#FF7409] rounded-lg py-1 px-6">
          <Typography variant="l2" weight="semibold" className="text-[#FF7409]">
            Editor
          </Typography>
          <Pen className="text-[#FF7409] w-4 h-4" />
        </div>
        <Typography variant="l2" weight="regular" className="text-[#676F7E]">
          Halaman Edit Informasi
        </Typography>
      </div>

      {/* Basic Information Section */}
      <section className="bg-white rounded-xl border border-[#676F7E] overflow-hidden">
        <div className="bg-[#669AFF] px-6 py-3">
          <Typography variant="l1" weight="regular" className="text-white">
            Informasi Dasar
          </Typography>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>
                <Typography variant="l2" className="text-[#676F7E]">
                  Kode
                </Typography>
              </Label>
              <Input
                value={data.summary.code}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    summary: { ...prev.summary, code: e.target.value },
                  }))
                }
                className="border-[#6B6F70] text-[#14181F]"
              />
            </div>
            <div className="space-y-3">
              <Label>
                <Typography variant="l2" className="text-[#676F7E]">
                  Judul
                </Typography>
              </Label>
              <Input
                value={data.summary.title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    summary: { ...prev.summary, title: e.target.value },
                  }))
                }
                className="border-[#6B6F70] text-[#14181F]"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>
              <Typography variant="l2" className="text-[#676F7E]">
                Deskripsi
              </Typography>
            </Label>
            <Textarea
              value={data.summary.content}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  summary: { ...prev.summary, content: e.target.value },
                }))
              }
              className="border-[#6B6F70] min-h-[100px] text-[#14181F]"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Sections Loop */}
      {(
        Object.keys(data.sections) as Array<keyof AssessmentData['sections']>
      ).map((key) => {
        const config = sectionConfig[key] || sectionConfig['lingkungan']
        const Icon = config.icon

        return (
          <section
            key={key}
            className="bg-white rounded-xl border border-[#676F7E] overflow-hidden"
          >
            <div className="flex flex-row items-center gap-3 border-b border-[#676F7E] px-6 py-3">
              <div
                className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${config.text}`} />
              </div>

              <Typography variant="l1" className="text-[#14181F] capitalize">
                {sectionLabels[key] || key.replace(/([A-Z])/g, ' $1')}
              </Typography>

              <div
                className={`flex w-6 h-6 justify-center items-center ${config.bg} rounded-lg`}
              >
                <Typography variant="l2" className={config.text}>
                  {data.sections[key].length}
                </Typography>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {data.sections[key].map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg space-y-2 relative group"
                >
                  <Input
                    placeholder="Judul Poin"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(key, item.id, 'title', e.target.value)
                    }
                    className="border-[#6B6F70] text-[#14181F]"
                  />
                  <Textarea
                    placeholder="Deskripsi Poin"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(key, item.id, 'description', e.target.value)
                    }
                    className="border-[#6B6F70] text-[#14181F]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-6 -top-6 hover:cursor-pointer text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(key, item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                className="bg-[#E2E4E9] text-[#212729] w-1/2 mx-auto flex items-center justify-center hover:bg-[#D0D3D9]"
                onClick={() => addItem(key)}
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Item
              </Button>
            </div>
          </section>
        )
      })}
    </div>
  )
}
