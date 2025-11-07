import { Decimal } from "@prisma/client/runtime/library"

import { PrismaClient, TipoTransaccion } from "./prisma-client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...")

  console.log("🗑️  Limpiando datos existentes...")
  await prisma.sesionCompra.deleteMany()
  await prisma.transaccion.deleteMany()
  await prisma.cliente.deleteMany()

  // Crear clientes de prueba
  console.log("👥 Creando clientes de prueba...")

  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        documento: "1134854312",
        nombres: "Juan Pérez García",
        email: "juan.perez@example.com",
        celular: "3001234567",
        saldo: new Decimal(100000)
      }
    }),
    prisma.cliente.create({
      data: {
        documento: "9876543210",
        nombres: "María López Rodríguez",
        email: "maria.lopez@example.com",
        celular: "3009876543",
        saldo: new Decimal(250000)
      }
    }),
    prisma.cliente.create({
      data: {
        documento: "1122334455",
        nombres: "Carlos Martínez Sánchez",
        email: "carlos.martinez@example.com",
        celular: "3111223344",
        saldo: new Decimal(50000)
      }
    }),
    prisma.cliente.create({
      data: {
        documento: "5566778899",
        nombres: "Ana Gómez Torres",
        email: "ana.gomez@example.com",
        celular: "3155667788",
        saldo: new Decimal(500000)
      }
    }),
    prisma.cliente.create({
      data: {
        documento: "9988776655",
        nombres: "Luis Ramírez Castro",
        email: "luis.ramirez@example.com",
        celular: "3199887766",
        saldo: new Decimal(0)
      }
    })
  ])

  console.log(`✅ ${clientes.length} clientes creados`)

  // Crear transacciones de ejemplo
  console.log("💰 Creando transacciones de ejemplo...")

  const transacciones: any[] = []

  // Transacciones para Juan (cliente 1)
  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[0].id,
        tipo: TipoTransaccion.RECARGA,
        monto: new Decimal(50000),
        descripcion: "Recarga inicial"
      }
    })
  )

  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[0].id,
        tipo: TipoTransaccion.RECARGA,
        monto: new Decimal(50000),
        descripcion: "Segunda recarga"
      }
    })
  )

  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[0].id,
        tipo: TipoTransaccion.COMPRA,
        monto: new Decimal(30000),
        descripcion: "Compra en tienda online"
      }
    })
  )

  // Transacciones para María (cliente 2)
  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[1].id,
        tipo: TipoTransaccion.RECARGA,
        monto: new Decimal(250000),
        descripcion: "Recarga inicial"
      }
    })
  )

  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[1].id,
        tipo: TipoTransaccion.COMPRA,
        monto: new Decimal(75000),
        descripcion: "Pago de servicios"
      }
    })
  )

  // Transacciones para Carlos (cliente 3)
  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[2].id,
        tipo: TipoTransaccion.RECARGA,
        monto: new Decimal(100000),
        descripcion: "Recarga inicial"
      }
    })
  )

  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[2].id,
        tipo: TipoTransaccion.COMPRA,
        monto: new Decimal(50000),
        descripcion: "Compra de productos"
      }
    })
  )

  // Transacciones para Ana (cliente 4)
  transacciones.push(
    await prisma.transaccion.create({
      data: {
        clienteId: clientes[3].id,
        tipo: TipoTransaccion.RECARGA,
        monto: new Decimal(500000),
        descripcion: "Recarga grande"
      }
    })
  )

  console.log(`✅ ${transacciones.length} transacciones creadas`)

  // Crear una sesión de compra de ejemplo (expirada)
  console.log("🔐 Creando sesión de compra de ejemplo...")

  const expiredDate = new Date()
  // 30 minutos en el pasado
  expiredDate.setMinutes(expiredDate.getMinutes() - 30)

  await prisma.sesionCompra.create({
    data: {
      clienteId: clientes[0].id,
      monto: new Decimal(10000),
      token: "123456",
      usado: false,
      expiraEn: expiredDate
    }
  })

  console.log("✅ Sesión de compra creada")

  // Mostrar resumen
  console.log("\n📊 Resumen de datos creados:")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  for (const cliente of clientes) {
    const numTransacciones = await prisma.transaccion.count({
      where: { clienteId: cliente.id }
    })
    console.log(`👤 ${cliente.nombres}`)
    console.log(`   Documento: ${cliente.documento}`)
    console.log(`   Celular: ${cliente.celular}`)
    console.log(`   Email: ${cliente.email}`)
    console.log(`   Saldo: $${cliente.saldo.toString()}`)
    console.log(`   Transacciones: ${numTransacciones}`)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  }

  console.log("\n✅ Seed completado exitosamente!")
  console.log("\n💡 Puedes usar estos datos para probar la API:")
  console.log("   - Documento: 1134854312, Celular: 3001234567 (Juan)")
  console.log("   - Documento: 9876543210, Celular: 3009876543 (María)")
  console.log("   - Documento: 9988776655, Celular: 3199887766 (Luis - sin saldo)")
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
