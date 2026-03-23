import { z } from 'zod'

export const ChangePasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password harus mengandung huruf besar, huruf kecil, dan angka',
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirm_password'],
  })
