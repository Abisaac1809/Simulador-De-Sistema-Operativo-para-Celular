import { z } from 'zod'

const venezuelanPhoneRegex = /^0?4\d{9}$/

const phoneValidation = z
  .string()
  .min(1, 'El teléfono es requerido')
  .regex(venezuelanPhoneRegex, 'Número inválido. Usa el formato 04245607741 o 4245607741')

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre debe tener menos de 100 caracteres'),
  phone: phoneValidation,
  email: z.string().email('Formato de correo electrónico inválido')
})

export const UpdateUserSchema = z
  .object({
    phone: phoneValidation.optional(),
    name: z.string().optional(),
    email: z.string().email('Formato de correo electrónico inválido').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionarse al menos un campo (teléfono o nombre)',
  })

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

