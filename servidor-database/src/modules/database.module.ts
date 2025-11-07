import { PrismaModule } from "src/prisma/prisma.module"

import { Global, Module } from "@nestjs/common"

import { UnitOfWork } from "~/prisma/unit-of-work"
import { ClienteRepository } from "~/repositories/clienteRepository"
import { SesionCompraRepository } from "~/repositories/sesionCompraRepository"
import { TransaccionRepository } from "~/repositories/transaccionRepository"
import { BilleteraService } from "~/services/billetera.service"
import { ClienteService } from "~/services/cliente.service"
import { EmailService } from "~/services/email.service"

/**
 * Módulo global que provee acceso a todos los repositories, services etc
 */
@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    // Repositories
    ClienteRepository,
    TransaccionRepository,
    SesionCompraRepository,

    // Services
    EmailService,
    ClienteService,
    BilleteraService,

    // Otros
    UnitOfWork
  ],
  exports: [
    ClienteRepository,
    TransaccionRepository,
    SesionCompraRepository,
    EmailService,
    ClienteService,
    BilleteraService,
    UnitOfWork
  ]
})
export class DatabaseModule {}
