import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(20, 'Password maksimal 20 karakter'),
})
