import { PrismaClient } from "prisma/prisma-client"

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    console.log("> Instancia creada para <Prisma>")
    super({
      // omit: {}
      // log: ["query", "error"]
    })
  }

  async onModuleInit() {
    await this.$connect()

    Object.assign(
      this,
      this.$extends({
        query: {
          // cliente: {}
        }
      })
    )
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
