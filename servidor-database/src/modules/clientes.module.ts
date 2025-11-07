import { ClienteController } from "src/controllers/cliente.controller"

import { Module } from "@nestjs/common"

import { DatabaseModule } from "./database.module"

@Module({
  imports: [DatabaseModule],
  controllers: [ClienteController]
})
export class ClientesModule {}
