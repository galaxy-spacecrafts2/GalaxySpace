import { z } from "zod"

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().url().optional(),
  emailVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

// Session schema
export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export type Session = z.infer<typeof sessionSchema>

// Auth response types
export interface AuthResponse {
  user: User | null
  session: Session | null
  error?: string
}

// Login credentials
export const loginCredentialsSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(8, "Senha deve ter no minimo 8 caracteres"),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>

// Signup credentials
export const signupCredentialsSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  username: z.string().min(3, "Username deve ter no minimo 3 caracteres").regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, numeros e underscores"),
  password: z.string().min(8, "Senha deve ter no minimo 8 caracteres"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, "Voce deve aceitar os termos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas nao coincidem",
  path: ["confirmPassword"],
})

export type SignupCredentials = z.infer<typeof signupCredentialsSchema>
