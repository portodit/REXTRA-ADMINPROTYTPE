export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_records: number
  per_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface KenaliDiriHistoryItem {
  test_id: string
  user_name: string
  category_name: string
  status: 'completed' | 'in_progress' | 'abandoned'
  result_code: string
  started_at: string
  completed_at?: string
  riasec_code_type?: 'single' | 'dual' | 'triple'
}

export interface BulkDeleteRequest {
  test_ids: string[]
}

export interface BulkDeleteResponse {
  success: boolean
  message: string
}

export interface ExportHistoryRequest {
  format: 'csv' | 'xlsx'
  category_id?: number
  status?: 'completed' | 'in_progress' | 'abandoned'
  start_date?: string
  end_date?: string
}

export interface StudentInfo {
  user_id: string
  name: string
  email: string
}

export interface StudentFeedbackScores {
  ease: number
  relevance: number
  satisfaction: number
}

export interface FeedbackObstacle {
  id: number
  label: string
}

export interface StudentFeedbackItem {
  id: number
  student: StudentInfo
  scores: StudentFeedbackScores
  obstacles: FeedbackObstacle[]
  message_to_team: string | null
  submitted_at: string
  test_category: string
}

export interface ExpertInfo {
  user_id: string
  name: string
  email: string
}

export interface ExpertFeedbackItem {
  id: number
  expert: ExpertInfo
  scores: StudentFeedbackScores
  obstacles: FeedbackObstacle[]
  message_to_team: string | null
  submitted_at: string
  test_category: string
  top5_status?: string
}

export interface GetStudentFeedbackParams {
  page?: number
  page_size?: number
  search?: string
  test_category?: string
}

export interface StudentFeedbackResponse {
  success: boolean
  message: string
  data: {
    items: StudentFeedbackItem[]
    total: number
    page: number
    page_size: number
  }
}
