import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import authApi from '@/lib/authApi'
import { GetStudentFeedbackParams, StudentFeedbackResponse } from '@/types/kenali-diri'

export const useStudentFeedbacks = (params?: GetStudentFeedbackParams) => {
  return useQuery<StudentFeedbackResponse, AxiosError>({
    queryKey: ['student-feedbacks', params],
    queryFn: async () => {
      const res = await authApi.get<StudentFeedbackResponse>(
        '/api/v1/admin/kenali-diri/feedback/student',
        { params },
      )
      return res.data
    },
  })
}
