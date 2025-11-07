import { Decimal } from "@prisma/client/runtime/library"
import { PrismaService } from "src/prisma/prisma.service"

import { Injectable } from "@nestjs/common"

import { PrismaContext } from "~/prisma/prisma-context"
import { Prisma, TipoTransaccion } from "~prisma/prisma-client"

@Injectable()
export class TransaccionRepository {
  private readonly table = "transaccion" satisfies Uncapitalize<Prisma.ModelName>

  constructor(private readonly prisma: PrismaService) {
    console.log("> Instancia creada para <TransaccionRepository>")
  }

  private get db() {
    return (PrismaContext.get() ?? this.prisma)[this.table]
  }

  /**
   * Crear una nueva transacción
   */
  async create(data: {
    clienteId: number
    tipo: TipoTransaccion
    monto: Decimal
    descripcion?: string
  }) {
    return this.db.create({
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        monto: data.monto,
        descripcion: data.descripcion
      },
      include: {
        cliente: {
          select: {
            id: true,
            documento: true,
            nombres: true,
            email: true
          }
        }
      }
    })
  }

  /**
   * Obtener todas las transacciones de un cliente
   */
  async findByClienteId(clienteId: number) {
    return this.db.findMany({
      where: { clienteId },
      orderBy: { createdAt: "desc" },
      include: {
        cliente: {
          select: {
            documento: true,
            nombres: true
          }
        }
      }
    })
  }

  /**
   * Obtener transacciones por tipo (RECARGA o COMPRA)
   */
  async findByTipo(tipo: TipoTransaccion) {
    return this.db.findMany({
      where: { tipo },
      orderBy: { createdAt: "desc" },
      include: {
        cliente: {
          select: {
            documento: true,
            nombres: true
          }
        }
      }
    })
  }

  /**
   * Obtener transacciones de un cliente por tipo
   */
  async findByClienteIdAndTipo(clienteId: number, tipo: TipoTransaccion) {
    return this.db.findMany({
      where: {
        clienteId,
        tipo
      },
      orderBy: { createdAt: "desc" }
    })
  }

  /**
   * Obtener todas las transacciones (admin)
   */
  async findAll(limit: number = 100) {
    return this.db.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        cliente: {
          select: {
            documento: true,
            nombres: true
          }
        }
      }
    })
  }

  /**
   * Obtener el total de recargas de un cliente
   */
  async getTotalRecargasByCliente(clienteId: number): Promise<Decimal> {
    const result = await this.db.aggregate({
      where: {
        clienteId,
        tipo: TipoTransaccion.RECARGA
      },
      _sum: {
        monto: true
      }
    })
    return result._sum.monto || new Decimal(0)
  }

  /**
   * Obtener el total de compras de un cliente
   */
  async getTotalComprasByCliente(clienteId: number): Promise<Decimal> {
    const result = await this.db.aggregate({
      where: {
        clienteId,
        tipo: TipoTransaccion.COMPRA
      },
      _sum: {
        monto: true
      }
    })
    return result._sum.monto || new Decimal(0)
  }

  /**
   * Contar transacciones por tipo
   */
  async countByTipo(tipo: TipoTransaccion): Promise<number> {
    return this.db.count({
      where: { tipo }
    })
  }

  /**
   * Obtener estadísticas de un cliente
   */
  async getEstadisticasCliente(clienteId: number) {
    const totalRecargas = await this.getTotalRecargasByCliente(clienteId)
    const totalCompras = await this.getTotalComprasByCliente(clienteId)
    const numeroRecargas = await this.db.count({
      where: { clienteId, tipo: TipoTransaccion.RECARGA }
    })
    const numeroCompras = await this.db.count({
      where: { clienteId, tipo: TipoTransaccion.COMPRA }
    })

    return {
      totalRecargas,
      totalCompras,
      numeroRecargas,
      numeroCompras
    }
  }
}
