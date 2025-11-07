import { ApiProperty } from "@nestjs/swagger"

class ClienteSaldoEntity {
  @ApiProperty({ example: "1234567890", description: "Documento del cliente" })
  documento: string

  @ApiProperty({ example: "Juan Pérez García", description: "Nombre del cliente" })
  nombres: string

  @ApiProperty({
    example: "j***z@example.com",
    description: "Email del cliente (parcialmente oculto)"
  })
  email: string
}

class EstadisticasEntity {
  @ApiProperty({ example: "200000", description: "Total de recargas realizadas" })
  totalRecargas: string

  @ApiProperty({ example: "75000", description: "Total de compras realizadas" })
  totalCompras: string

  @ApiProperty({ example: 4, description: "Número de recargas" })
  numeroRecargas: number

  @ApiProperty({ example: 3, description: "Número de compras" })
  numeroCompras: number
}

export class SaldoResponseEntity {
  @ApiProperty({ type: ClienteSaldoEntity })
  cliente: ClienteSaldoEntity

  @ApiProperty({ example: "125000", description: "Saldo actual" })
  saldo: string

  @ApiProperty({ type: EstadisticasEntity })
  estadisticas: EstadisticasEntity

  @ApiProperty({ example: "2025-11-05T10:40:00.000Z", description: "Fecha de consulta" })
  fechaConsulta: string
}
