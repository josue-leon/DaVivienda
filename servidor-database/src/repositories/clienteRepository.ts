import { Decimal } from "@prisma/client/runtime/library"
import { PrismaService } from "src/prisma/prisma.service"

import { Injectable } from "@nestjs/common"

import { CustomError } from "~/globals/custom.errors"
import { EnumError404 } from "~/globals/errors"
import { PrismaContext } from "~/prisma/prisma-context"
import { Prisma } from "~prisma/prisma-client"

@Injectable()
export class ClienteRepository {
  private readonly table = "cliente" satisfies Uncapitalize<Prisma.ModelName>
  // static readonly nameTable = "cliente" satisfies Uncapitalize<Prisma.ModelName>;
  // private readonly db: Prisma.ClienteDelegate<DefaultArgs, Prisma.PrismaClientOptions>

  constructor(private readonly prisma: PrismaService) {
    console.log("> Instancia creada para <ClienteRepository>")
  }

  private get db() {
    return (PrismaContext.get() ?? this.prisma)[this.table]
  }

  /**
   * Crear un nuevo cliente
   */
  async create(data: {
    documento: string
    nombres: string
    email: string
    celular: string
    saldo?: Decimal
  }) {
    return this.db.create({
      data: {
        documento: data.documento,
        nombres: data.nombres,
        email: data.email,
        celular: data.celular,
        saldo: data.saldo || new Decimal(0)
      }
    })
  }

  /**
   * Buscar cliente por documento
   */
  async findByDocumento(documento: string) {
    return this.db.findUnique({
      where: { documento }
    })
  }

  /**
   * Buscar cliente por email
   */
  async findByEmail(email: string) {
    return this.db.findUnique({
      where: { email }
    })
  }

  /**
   * Buscar cliente por ID
   */
  async findById(id: number) {
    return this.db.findUnique({
      where: { id }
    })
  }

  /**
   * Buscar y validar cliente por documento y celular
   * Esta validación es requerida para las operaciones de la billetera
   */
  async findByDocumentoAndCelular(documento: string, celular: string) {
    return this.db.findFirst({
      where: {
        documento,
        celular
      }
    })
  }

  /**
   * Actualizar el saldo de un cliente
   */
  async updateSaldo(clienteId: number, nuevoSaldo: Decimal) {
    return this.db.update({
      where: { id: clienteId },
      data: { saldo: nuevoSaldo }
    })
  }

  /**
   * Incrementar saldo (para recargas)
   */
  async incrementarSaldo(clienteId: number, monto: Decimal) {
    const cliente = await this.db.findUnique({ where: { id: clienteId } })
    if (!cliente) {
      throw new CustomError(EnumError404.ClienteNoEncontrado)
    }
    const nuevoSaldo = new Decimal(cliente.saldo.toString()).plus(monto)
    return this.updateSaldo(clienteId, nuevoSaldo)
  }

  /**
   * Decrementar saldo (para compras)
   */
  async decrementarSaldo(clienteId: number, monto: Decimal) {
    const cliente = await this.db.findUnique({ where: { id: clienteId } })
    if (!cliente) {
      throw new CustomError(EnumError404.ClienteNoEncontrado)
    }
    const nuevoSaldo = new Decimal(cliente.saldo.toString()).minus(monto)
    return this.updateSaldo(clienteId, nuevoSaldo)
  }

  /**
   * Obtener todos los clientes (para administración)
   */
  async findAll() {
    return this.db.findMany({
      orderBy: { createdAt: "desc" }
    })
  }

  /**
   * Contar total de clientes
   */
  async count() {
    return this.db.count()
  }

  /**
   * Verificar si existe un cliente por documento
   */
  async existsByDocumento(documento: string) {
    const count = await this.db.count({
      where: { documento }
    })
    return count > 0
  }

  /**
   * Verificar si existe un cliente por email
   */
  async existsByEmail(email: string) {
    const count = await this.db.count({
      where: { email }
    })
    return count > 0
  }

  async obtenerClientes() {
    return this.db.findMany()
  }
}
