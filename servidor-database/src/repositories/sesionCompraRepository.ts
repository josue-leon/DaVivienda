import { Decimal } from "@prisma/client/runtime/library"
import { PrismaService } from "src/prisma/prisma.service"

import { Injectable } from "@nestjs/common"

import { PrismaContext } from "~/prisma/prisma-context"
import { Prisma } from "~prisma/prisma-client"

@Injectable()
export class SesionCompraRepository {
  private readonly table = "sesionCompra" satisfies Uncapitalize<Prisma.ModelName>
  //private readonly db: Prisma.SesionCompraDelegate<DefaultArgs, Prisma.PrismaClientOptions>

  constructor(private readonly prisma: PrismaService) {
    console.log("> Instancia creada para <SesionCompraRepository>")
  }

  private get db() {
    return (PrismaContext.get() ?? this.prisma)[this.table]
  }

  /**
   * Crear una nueva sesión de compra con token
   */
  async create(data: { clienteId: number; monto: Decimal; token: string; expiraEn: Date }) {
    return this.db.create({
      data: {
        clienteId: data.clienteId,
        monto: data.monto,
        token: data.token,
        expiraEn: data.expiraEn,
        usado: false
      },
      include: {
        cliente: {
          select: {
            id: true,
            documento: true,
            nombres: true,
            email: true,
            celular: true
          }
        }
      }
    })
  }

  /**
   * Buscar sesión por ID
   */
  async findById(id: string) {
    return this.db.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            documento: true,
            nombres: true,
            saldo: true
          }
        }
      }
    })
  }

  /**
   * Validar token de sesión
   * Verifica que el ID de sesión y el token coincidan
   */
  async validateToken(idSesion: string, token: string) {
    return this.db.findFirst({
      where: {
        id: idSesion,
        token: token
      },
      include: {
        cliente: {
          select: {
            id: true,
            documento: true,
            nombres: true,
            saldo: true
          }
        }
      }
    })
  }

  /**
   * Marcar sesión como usada
   */
  async markAsUsed(idSesion: string) {
    return this.db.update({
      where: { id: idSesion },
      data: { usado: true }
    })
  }

  /**
   * Verificar si una sesión está expirada
   */
  async isExpired(idSesion: string): Promise<boolean> {
    const sesion = await this.db.findUnique({
      where: { id: idSesion },
      select: { expiraEn: true }
    })

    if (!sesion) {
      return true
    }

    return new Date() > sesion.expiraEn
  }

  /**
   * Verificar si una sesión ya fue usada
   */
  async isUsed(idSesion: string): Promise<boolean> {
    const sesion = await this.db.findUnique({
      where: { id: idSesion },
      select: { usado: true }
    })

    return sesion?.usado || false
  }

  /**
   * Eliminar sesiones expiradas (tarea de limpieza)
   */
  async deleteExpiredSessions() {
    const now = new Date()
    return this.db.deleteMany({
      where: {
        expiraEn: {
          lt: now
        }
      }
    })
  }

  /**
   * Eliminar sesiones usadas antiguas (más de 24 horas)
   */
  async deleteOldUsedSessions() {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return this.db.deleteMany({
      where: {
        usado: true,
        createdAt: {
          lt: yesterday
        }
      }
    })
  }

  /**
   * Obtener sesiones activas de un cliente
   */
  async findActiveSessionsByCliente(clienteId: number) {
    const now = new Date()
    return this.db.findMany({
      where: {
        clienteId,
        usado: false,
        expiraEn: {
          gt: now
        }
      },
      orderBy: { createdAt: "desc" }
    })
  }

  /**
   * Contar sesiones activas de un cliente
   */
  async countActiveSessionsByCliente(clienteId: number): Promise<number> {
    const now = new Date()
    return this.db.count({
      where: {
        clienteId,
        usado: false,
        expiraEn: {
          gt: now
        }
      }
    })
  }

  /**
   * Obtener todas las sesiones de un cliente
   */
  async findByClienteId(clienteId: number) {
    return this.db.findMany({
      where: { clienteId },
      orderBy: { createdAt: "desc" }
    })
  }

  /**
   * Obtener estadísticas de sesiones
   */
  async getEstadisticas() {
    const now = new Date()

    const totalSesiones = await this.db.count()
    const sesionesUsadas = await this.db.count({ where: { usado: true } })
    const sesionesExpiradas = await this.db.count({
      where: {
        usado: false,
        expiraEn: { lt: now }
      }
    })
    const sesionesActivas = await this.db.count({
      where: {
        usado: false,
        expiraEn: { gt: now }
      }
    })

    return {
      totalSesiones,
      sesionesUsadas,
      sesionesExpiradas,
      sesionesActivas
    }
  }
}
