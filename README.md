<p align="center">
  <img src="cliente-app/src/assets/LogoDavivienda.svg" alt="DaVivienda Logo" width="400">
</p>

# DaVivienda - Billetera Virtual

## 🚀 Inicio Rápido con Docker

```bash
🚨 IMPORTANTE

Antes de desplegar, renombrar los archivos:

.env.example >> .env
```

**Iniciar:**
```bash
docker-compose up -d
```
*Tiempo estimado: ~2 minutos*

**Detener:**
```bash
docker-compose down
```

**Detener y eliminar volúmenes:**
```bash
docker-compose down -v
```

## Inicio Manual (Sin Docker)

### 1. Iniciar MySQL
```bash
cd servidor-database
docker-compose up -d
```

### 2. Ejecutar Migraciones
```bash
cd servidor-database
npx prisma migrate deploy
```

### 3. Instalar Dependencias
```bash
cd servidor-database
pnpm i

cd ../servidor-client
pnpm i

cd ../cliente-app
pnpm i
```

### 4. Iniciar Servidores

**Servidor Database (Puerto 3000)**
```bash
cd servidor-database
pnpm start:dev
```

**Servidor Client (Puerto 3001)**
```bash
cd servidor-client
pnpm start:dev
```

**Cliente App (Puerto 5173)**
```bash
cd cliente-app
pnpm dev
```

## Puertos y Servicios

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| MySQL | 33060 | - | Base de datos |
| phpMyAdmin | 8081 | http://localhost:8081 | Administrador de base de datos |
| Servidor Database | 3000 | http://localhost:3000/docs | API de capa de datos/persistencia |
| Servidor Client | 3001 | http://localhost:3001/docs | API Gateway/lógica de negocio |
| Cliente App | 5173 | http://localhost:5173 | Aplicación web (Vite) |

## Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Backend Framework** | NestJS |
| **HTTP Server** | Fastify |
| **ORM** | Prisma |
| **Base de Datos** | MySQL 8.0 |
| **Frontend Framework** | React 19 |
| **Lenguaje** | TypeScript |
| **Build Tool** | Vite |
| **UI Library** | Material-UI (MUI) |
| **Package Manager** | pnpm |
| **Containerización** | Docker, Docker Compose |
| **Runtime** | Node.js 22 |
| **API Documentation** | Swagger/OpenAPI |
| **API Code Generation** | OpenAPI Generator |
| **API Testing** | Postman |

## Colecciones de Postman

Archivos de colección para probar las APIs:

- `postman-servidor-database.json` - Colección para Servidor Database
- `postman-servidor-client.json` - Colección para Servidor Client

Importar estos archivos en [Postman](https://www.postman.com/) para probar los endpoints.

