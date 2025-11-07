import "dotenv/config"
import dotenvExpand from "dotenv-expand"
import { defineConfig } from "prisma/config"

dotenvExpand.expand({parsed: process.env as any})

export default defineConfig({
  schema: "prisma/schema"
})
