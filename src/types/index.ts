
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  password: z.string().min(6, { message: "Lösenordet måste vara minst 6 tecken." }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  password: z.string().min(6, { message: "Lösenordet måste vara minst 6 tecken." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte.",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof RegisterSchema>;

export interface Idea {
  id: string;
  content: string;
  createdAt: Date;
}
