export interface AssessmentItem {
  id: string
  title: string
  description: string
}

export interface AssessmentData {
  summary: {
    code: string
    title: string
    content: string
  }
  sections: {
    kekuatan: AssessmentItem[]
    tantangan: AssessmentItem[]
    strategi: AssessmentItem[]
    interaksi: AssessmentItem[]
    lingkungan: AssessmentItem[]
  }
}
