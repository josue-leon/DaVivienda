-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento` VARCHAR(20) NOT NULL,
    `nombres` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `celular` VARCHAR(20) NOT NULL,
    `saldo` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `clientes_documento_key`(`documento`),
    UNIQUE INDEX `clientes_email_key`(`email`),
    INDEX `clientes_documento_idx`(`documento`),
    INDEX `clientes_email_idx`(`email`),
    INDEX `clientes_documento_celular_idx`(`documento`, `celular`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesiones_compra` (
    `id` VARCHAR(191) NOT NULL,
    `cliente_id` INTEGER NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `token` CHAR(6) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `expira_en` TIMESTAMP(6) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `sesiones_compra_id_token_idx`(`id`, `token`),
    INDEX `sesiones_compra_cliente_id_idx`(`cliente_id`),
    INDEX `sesiones_compra_usado_idx`(`usado`),
    INDEX `sesiones_compra_expira_en_idx`(`expira_en`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `tipo` ENUM('RECARGA', 'COMPRA') NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `transacciones_cliente_id_idx`(`cliente_id`),
    INDEX `transacciones_tipo_idx`(`tipo`),
    INDEX `transacciones_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sesiones_compra` ADD CONSTRAINT `sesiones_compra_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacciones` ADD CONSTRAINT `transacciones_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
