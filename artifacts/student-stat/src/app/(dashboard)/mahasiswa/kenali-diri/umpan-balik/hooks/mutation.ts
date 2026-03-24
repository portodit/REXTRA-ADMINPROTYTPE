import {
  StudentFeedbackResponse,
  GetStudentFeedbackParams,
} from '@/types/kenali-diri'
import axios from 'axios'
import { cookies } from 'next/headers'

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const token = cookieStore.get('rextra_access_token')?.value
  return token
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function getStudentFeedbacks(
  params: GetStudentFeedbackParams = {},
): Promise<StudentFeedbackResponse> {
  const { page = 1, page_size = 25, search, test_category } = params

  const token = await getAuthToken()

  if (!token) {
    console.error('[getStudentFeedbacks] No access token found.')
    throw new Error('Unauthorized: No session found.')
  }

  try {
    const response = await axios.get<StudentFeedbackResponse>(
      `${BASE_URL}/api/v1/admin/kenali-diri/feedback/student`,
      {
        params: {
          page,
          page_size,
          ...(search && { search }),
          ...(test_category && { test_category }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('[getStudentFeedbacks] Token expired or invalid')
      }
    } else {
      console.error('[getStudentFeedbacks] An unexpected error occurred:', error)
    }

    throw error
  }
}
