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
  id?: number
  key?: string
  label: string
  other_text?: string | null
}

export interface StudentFeedbackItem {
  id: number
  student: StudentInfo
  scores: StudentFeedbackScores
  obstacles: FeedbackObstacle[]
  message_to_team: string | null
  submitted_at: string
  test_category: string
  test_category_label?: string
}

export interface ExpertInfo {
  user_id?: string
  name: string
  email?: string
  profession?: string
  profession_id?: number
}

export interface FeedbackScores {
  accuracy: number
  logic: number
  usefulness: number
}

export interface ExpertFeedbackItem {
  id: number
  expert: ExpertInfo
  top5_status?: string
  top5_status_label?: string
  scores: StudentFeedbackScores & Partial<FeedbackScores>
  obstacles: FeedbackObstacle[]
  has_suggestion?: boolean
  message_to_team?: string | null
  submitted_at: string
  test_category: string
  test_category_label?: string
}

export interface GetStudentFeedbackParams {
  page?: number
  page_size?: number
  search?: string
  test_category?: string
}

export interface GetExpertFeedbackParams {
  page?: number
  page_size?: number
  search?: string
  test_category?: string
}

export interface StudentFeedbackData {
  items: StudentFeedbackItem[]
  total?: number
  page?: number
  page_size?: number
  pagination?: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface ExpertFeedbackData {
  items: ExpertFeedbackItem[]
  total?: number
  page?: number
  page_size?: number
  pagination?: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface StudentFeedbackResponse {
  success: boolean
  message: string
  data: StudentFeedbackData
}

export interface ExpertFeedbackResponse {
  success: boolean
  message: string
  data: ExpertFeedbackData
}
