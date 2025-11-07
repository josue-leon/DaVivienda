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
  NODE_ENV: z.string().optional(),

  // API Key para seguridad del servidor-client
  API_KEY: z.string().trim().min(1, "API_KEY es requerido"),

  // Conexión al servidor-database
  DATABASE_SERVER_URL: z.string().url("DATABASE_SERVER_URL debe ser una URL válida"),
  DATABASE_SERVER_API_KEY: z.string().trim().min(1, "DATABASE_SERVER_API_KEY es requerido"),
})

export const envs = envSchema.parse(process.env)
