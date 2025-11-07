import { Injectable } from "@nestjs/common"

import type { Prisma } from "~prisma/prisma-client"

import { PrismaContext } from "./prisma-context"
import { PrismaService } from "./prisma.service"

@Injectable()
export class UnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async runInTransaction<T>(callback: (trx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (trx) => {
      return PrismaContext.run(trx, () => callback(trx))
    })
  }
}
