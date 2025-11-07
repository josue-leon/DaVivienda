#!/bin/bash

set -e

# ==========================================
# CONFIGURACIÓN - Edita estas variables
# ==========================================

# Puerto del servidor
PORT=3000

# Carpeta de salida de la API generada
OUTPUT_DIR="api-db"

# Endpoint de OpenAPI
OPENAPI_ENDPOINT="/docs-json"

# Host
HOST="localhost"

# Tipo de generador
GENERATOR_TYPE="typescript-axios"

# Package manager
PACKAGE_MANAGER="pnpm"

# Carpeta destino para copiar
DESTINATION_DIR="../servidor-client"

# ==========================================

SERVER_URL="http://${HOST}:${PORT}${OPENAPI_ENDPOINT}"

echo "🚀 Generando cliente API ${GENERATOR_TYPE} desde OpenAPI..."
echo ""

# Verificar que el servidor esté corriendo
if ! curl -s "${SERVER_URL}" > /dev/null; then
  echo "❌ Error: El servidor no está corriendo en ${SERVER_URL}"
  echo "   Ejecuta primero: ${PACKAGE_MANAGER} run start:dev"
  exit 1
fi

# Generar cliente
${PACKAGE_MANAGER} openapi-generator-cli generate \
  -i "${SERVER_URL}" \
  -g "${GENERATOR_TYPE}" \
  -o "./${OUTPUT_DIR}" \
  --skip-validate-spec

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Cliente API generado exitosamente en ./${OUTPUT_DIR}"
  echo ""
  echo "Puedes usar el cliente en servidor-client copiando la carpeta:"
  echo "  mkdir -p ${DESTINATION_DIR}/${OUTPUT_DIR}/"
  echo "  cp -r ${OUTPUT_DIR}/*.ts ${DESTINATION_DIR}/${OUTPUT_DIR}/"
else
  echo ""
  echo "❌ Error al generar el cliente API"
  exit 1
fi
