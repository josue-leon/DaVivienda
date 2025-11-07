import { BilleteraController } from "src/controllers/billetera.controller"

import { Module } from "@nestjs/common"

import { DatabaseModule } from "./database.module"

@Module({
  imports: [DatabaseModule],
  controllers: [BilleteraController]
})
export class BilleteraModule {}
