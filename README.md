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

### 1. Configurar Variables de Entorno

Renombrar `.env.example` a `.env` en cada proyecto y configurar la conexión en un **MySQL real**:

**servidor-database/.env**
```bash
# Conexión a MySQL local (NO Docker)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=db_usuario
DB_PASSWORD=db_password
DB_DATABASE_NAME=billetera_virtual
```

**servidor-client/.env**
```bash
DATABASE_SERVER_URL=http://localhost:3000
DATABASE_SERVER_API_KEY=super-secret-api-key-change-in-production-123456
```

**cliente-app/.env**
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_API_KEY=client-api-key-2025
```

### 2. Instalar Dependencias

```bash
# Servidor Database
cd servidor-database
pnpm i

# Servidor Client
cd ../servidor-client
pnpm i

# Cliente App
cd ../cliente-app
pnpm i
```

### 3. Crear Base de Datos y Ejecutar Migraciones

```bash
cd servidor-database

# Crear la base de datos (si no existe)
# Conectarse a MySQL y ejecutar:
# CREATE DATABASE billetera_virtual;

# Ejecutar migraciones
npx prisma migrate reset
npx prisma migrate deploy
```

### 4. Iniciar Servidores

Abrir **3 terminales diferentes** y ejecutar:

**Terminal 1 - Servidor Database (Puerto 3000)**
```bash
cd servidor-database
pnpm start:dev
```

**Terminal 2 - Servidor Client (Puerto 3001)**
```bash
cd servidor-client
pnpm start:dev
```

**Terminal 3 - Cliente App (Puerto 5173)**
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

