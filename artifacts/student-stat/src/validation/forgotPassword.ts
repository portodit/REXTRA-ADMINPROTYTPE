import { z } from 'zod'

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid (harus mengandung @)'),
})
