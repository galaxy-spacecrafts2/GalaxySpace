import { z } from "zod"

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(8, "Senha deve ter no minimo 8 caracteres"),
  rememberMe: z.boolean().optional().default(false),
})

export const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  username: z.string()
    .min(3, "Username deve ter no minimo 3 caracteres")
    .max(20, "Username deve ter no maximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, numeros e underscores"),
  password: z.string()
    .min(8, "Senha deve ter no minimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiuscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minuscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um numero"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().optional().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas nao coincidem",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalido"),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Senha deve ter no minimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiuscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minuscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um numero"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas nao coincidem",
  path: ["confirmPassword"],
})

// =============================================================================
// USER PROFILE SCHEMAS
// =============================================================================

export const userProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  username: z.string()
    .min(3, "Username deve ter no minimo 3 caracteres")
    .max(20, "Username deve ter no maximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, numeros e underscores"),
  email: z.string().email("Email invalido"),
  bio: z.string().max(500, "Bio deve ter no maximo 500 caracteres").optional(),
  avatar: z.string().url("URL do avatar invalida").optional(),
  location: z.string().max(100, "Localizacao deve ter no maximo 100 caracteres").optional(),
  website: z.string().url("URL do website invalida").optional().or(z.literal("")),
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual e obrigatoria"),
  newPassword: z.string()
    .min(8, "Nova senha deve ter no minimo 8 caracteres")
    .regex(/[A-Z]/, "Nova senha deve conter pelo menos uma letra maiuscula")
    .regex(/[a-z]/, "Nova senha deve conter pelo menos uma letra minuscula")
    .regex(/[0-9]/, "Nova senha deve conter pelo menos um numero"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas nao coincidem",
  path: ["confirmNewPassword"],
})

// =============================================================================
// COMMUNITY SCHEMAS
// =============================================================================

export const postSchema = z.object({
  content: z.string()
    .min(1, "Conteudo e obrigatorio")
    .max(2000, "Conteudo deve ter no maximo 2000 caracteres"),
  images: z.array(z.string().url()).max(4, "Maximo de 4 imagens").optional(),
  tags: z.array(z.string()).max(5, "Maximo de 5 tags").optional(),
})

export const commentSchema = z.object({
  content: z.string()
    .min(1, "Comentario e obrigatorio")
    .max(500, "Comentario deve ter no maximo 500 caracteres"),
})

export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, "Mensagem e obrigatoria")
    .max(1000, "Mensagem deve ter no maximo 1000 caracteres"),
})

// =============================================================================
// SPACECRAFT SCHEMAS
// =============================================================================

export const spacecraftSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  type: z.enum(["fighter", "cargo", "explorer", "battleship", "transport"]),
  class: z.string().min(1, "Classe e obrigatoria"),
  manufacturer: z.string().optional(),
  description: z.string().max(1000, "Descricao deve ter no maximo 1000 caracteres").optional(),
  specs: z.object({
    speed: z.number().min(0).max(100),
    armor: z.number().min(0).max(100),
    firepower: z.number().min(0).max(100),
    cargo: z.number().min(0).max(100),
    range: z.number().min(0).max(100),
  }).optional(),
})

// =============================================================================
// SETTINGS SCHEMAS
// =============================================================================

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  communityUpdates: z.boolean(),
  newsAlerts: z.boolean(),
  missionAlerts: z.boolean(),
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "friends", "private"]),
  showOnlineStatus: z.boolean(),
  showActivity: z.boolean(),
  allowMessages: z.enum(["everyone", "friends", "none"]),
})

export const displaySettingsSchema = z.object({
  theme: z.enum(["dark", "light", "system"]),
  language: z.enum(["en", "pt", "es"]),
  compactMode: z.boolean(),
  animations: z.boolean(),
})

// =============================================================================
// CONTACT/FEEDBACK SCHEMAS
// =============================================================================

export const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  subject: z.string().min(5, "Assunto deve ter no minimo 5 caracteres"),
  message: z.string()
    .min(10, "Mensagem deve ter no minimo 10 caracteres")
    .max(2000, "Mensagem deve ter no maximo 2000 caracteres"),
})

export const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "improvement", "other"]),
  title: z.string().min(5, "Titulo deve ter no minimo 5 caracteres"),
  description: z.string()
    .min(20, "Descricao deve ter no minimo 20 caracteres")
    .max(2000, "Descricao deve ter no maximo 2000 caracteres"),
  priority: z.enum(["low", "medium", "high"]).optional(),
})

// =============================================================================
// API RESPONSE SCHEMAS
// =============================================================================

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).optional(),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }).optional(),
  })

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ChatMessageInput = z.infer<typeof chatMessageSchema>
export type SpacecraftInput = z.infer<typeof spacecraftSchema>
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>
export type DisplaySettingsInput = z.infer<typeof displaySettingsSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
