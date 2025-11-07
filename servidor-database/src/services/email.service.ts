import { envs } from "envs"
import * as nodemailer from "nodemailer"
import { formatearMoneda } from "src/utils/token.utils"

import { Injectable, Logger } from "@nestjs/common"

import { CustomError } from "~/globals/custom.errors"
import { EnumError500 } from "~/globals/errors"

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.logger.log("> Instancia creada para <EmailService>")
    // Solo inicializar si está configurado el SMTP
    if (envs.SMTP_USER && envs.SMTP_PASS) {
      this.initializeTransporter()
    } else {
      this.logger.warn("SMTP no configurado. El servicio de email está deshabilitado.")
    }
  }

  /**
   * Inicializa el transportador de Nodemailer con configuración SMTP
   */
  private initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: envs.SMTP_HOST || "smtp.gmail.com",
        port: envs.SMTP_PORT || 587,
        secure: envs.SMTP_SECURE || false, // true para puerto 465, false para otros
        auth: {
          user: envs.SMTP_USER,
          pass: envs.SMTP_PASS
        }
      })

      // Verificar conexión
      void this.transporter
        .verify()
        .then(() => {
          this.logger.log("✅ Conexión SMTP establecida correctamente")
        })
        .catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : "Error desconocido"
          this.logger.error("❌ Error al conectar con el servidor SMTP:", errorMessage)
        })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      this.logger.error(`Error al inicializar email service: ${errorMessage}`)
    }
  }

  /**
   * Envía el token de confirmación al email del cliente
   */
  async enviarTokenPago(
    email: string,
    nombres: string,
    token: string,
    monto: number,
    idSesion: string
  ): Promise<void> {
    if (!this.transporter) {
      throw new CustomError(EnumError500.EmailNoInicializado)
    }

    const expiracionMinutos = envs.TOKEN_EXPIRATION_MINUTES
    const montoFormateado = formatearMoneda(monto)

    const htmlContent = this.generarTemplateEmail(
      nombres,
      token,
      montoFormateado,
      idSesion,
      expiracionMinutos
    )

    const mailOptions = {
      from: envs.EMAIL_FROM || '"Billetera Virtual" <noreply@billetera.com>',
      to: email,
      subject: `🔐 Tu código de confirmación para pago de ${montoFormateado}`,
      html: htmlContent,
      text: this.generarTextoPlano(nombres, token, montoFormateado, idSesion, expiracionMinutos)
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`✅ Email enviado exitosamente a ${email}`)
    } catch (error) {
      this.logger.error(`❌ Error al enviar email a ${email}:`, error)
      throw new CustomError(EnumError500.ErrorEnvioEmail)
    }
  }

  /**
   * Genera el template HTML para el email
   */
  private generarTemplateEmail(
    nombres: string,
    token: string,
    montoFormateado: string,
    idSesion: string,
    expiracionMinutos: number
  ): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Confirmación - Billetera Virtual</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .token-box {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .token {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .info {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-label {
            font-weight: bold;
            color: #1976d2;
        }
        .warning {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💳 Billetera Virtual</h1>
            <p style="margin: 5px 0 0 0;">Código de Confirmación de Pago</p>
        </div>

        <div class="content">
            <p class="greeting">Hola <strong>${nombres}</strong>,</p>

            <p>Has solicitado realizar un pago. Para confirmar esta transacción, usa el siguiente código:</p>

            <div class="token-box">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">TU CÓDIGO DE CONFIRMACIÓN</div>
                <div class="token">${token}</div>
            </div>

            <div class="info">
                <p style="margin: 5px 0;"><span class="info-label">💰 Monto:</span> ${montoFormateado}</p>
                <p style="margin: 5px 0;"><span class="info-label">🆔 ID de Sesión:</span> ${idSesion}</p>
                <p style="margin: 5px 0;"><span class="info-label">⏱️ Válido por:</span> ${expiracionMinutos} minutos</p>
            </div>

            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Este código expira en <strong>${expiracionMinutos} minutos</strong></li>
                    <li>Solo se puede usar <strong>una vez</strong></li>
                    <li>No compartas este código con nadie</li>
                    <li>Si no solicitaste este pago, ignora este mensaje</li>
                </ul>
            </div>

            <p style="margin-top: 30px; color: #666;">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
            </p>
        </div>

        <div class="footer">
            <p>Este es un mensaje automático de Billetera Virtual</p>
            <p>Por favor, no respondas a este correo</p>
            <p style="margin-top: 15px;">
                &copy; ${new Date().getFullYear()} Billetera Virtual. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Genera el texto plano para clientes de email que no soportan HTML
   */
  private generarTextoPlano(
    nombres: string,
    token: string,
    montoFormateado: string,
    idSesion: string,
    expiracionMinutos: number
  ): string {
    return `
BILLETERA VIRTUAL - CÓDIGO DE CONFIRMACIÓN DE PAGO

Hola ${nombres},

Has solicitado realizar un pago. Para confirmar esta transacción, usa el siguiente código:

CÓDIGO DE CONFIRMACIÓN: ${token}

DETALLES DE LA TRANSACCIÓN:
- Monto: ${montoFormateado}
- ID de Sesión: ${idSesion}
- Válido por: ${expiracionMinutos} minutos

IMPORTANTE:
- Este código expira en ${expiracionMinutos} minutos
- Solo se puede usar una vez
- No compartas este código con nadie
- Si no solicitaste este pago, ignora este mensaje

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.

---
Este es un mensaje automático de Billetera Virtual
Por favor, no respondas a este correo

© ${new Date().getFullYear()} Billetera Virtual. Todos los derechos reservados.
    `
  }

  /**
   * Envía un email de bienvenida al registrar un nuevo cliente (opcional)
   */
  async enviarEmailBienvenida(email: string, nombres: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn("No se puede enviar email de bienvenida: transporter no inicializado")
      return
    }

    const mailOptions = {
      from: envs.EMAIL_FROM || '"Billetera Virtual" <noreply@billetera.com>',
      to: email,
      subject: "🎉 Bienvenido a Billetera Virtual",
      html: `
        <h2>¡Bienvenido ${nombres}!</h2>
        <p>Tu cuenta en Billetera Virtual ha sido creada exitosamente.</p>
        <p>Ahora puedes:</p>
        <ul>
          <li>Recargar tu billetera</li>
          <li>Realizar pagos de manera segura</li>
          <li>Consultar tu saldo en cualquier momento</li>
        </ul>
        <p>¡Gracias por confiar en nosotros!</p>
      `,
      text: `
        ¡Bienvenido ${nombres}!

        Tu cuenta en Billetera Virtual ha sido creada exitosamente.

        Ahora puedes:
        - Recargar tu billetera
        - Realizar pagos de manera segura
        - Consultar tu saldo en cualquier momento

        ¡Gracias por confiar en nosotros!
      `
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`✅ Email de bienvenida enviado a ${email}`)
    } catch (error) {
      this.logger.warn(`No se pudo enviar email de bienvenida a ${email}:`, error)
      // No lanzamos error porque no es crítico
    }
  }
}
