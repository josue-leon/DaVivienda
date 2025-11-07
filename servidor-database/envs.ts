import "dotenv/config"
import z from "zod"

const envSchema = z.object({
  PROJECT: z.string().trim().nonempty(),
  API_PREFIX: z.string().trim().nonempty(),

  PORT: z.preprocess((p) => +z.string().parse(p), z.number()),
  PROTOCOLO: z.enum(["http", "https"]),
  LISTEN_SERVER: z.enum(["0.0.0.0", "localhost", "127.0.0.1"]),
  IP_SERVER: z.string().trim().nonempty(),

  DOC_SWAGGER: z.string().trim().nonempty(),
  URL_JSON_SWAGGER: z.string().trim().nonempty(),
  DATABASE_URL: z.string().trim(),
  NODE_ENV: z.string().optional(),

  // API Key para seguridad
  API_KEY: z.string().trim().optional(),

  // Configuración de Email
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.preprocess((p) => (p ? +z.string().parse(p) : undefined), z.number().optional()),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  SMTP_USER: z.string().trim().optional(),
  SMTP_PASS: z.string().trim().optional(),
  EMAIL_FROM: z.string().trim().optional(),

  // Configuración de Tokens
  TOKEN_EXPIRATION_MINUTES: z.preprocess(
    (p) => (p ? +z.string().parse(p) : 15),
    z.number().default(15)
  )
})

export const envs = envSchema.parse(process.env)
