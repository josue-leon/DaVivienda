import { AsyncLocalStorage } from "async_hooks"

import { Prisma } from "~prisma/prisma-client"

const storage = new AsyncLocalStorage<Prisma.TransactionClient>()

export const PrismaContext = {
  run: <T>(trx: Prisma.TransactionClient, callback: () => Promise<T>): Promise<T> => {
    return storage.run(trx, callback)
  },
  get: (): Prisma.TransactionClient | undefined => {
    return storage.getStore()
  }
}
