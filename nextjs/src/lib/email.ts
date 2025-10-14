// src/lib/email.ts
// Servicio de email con Resend para notificaciones de reservas

import { Resend } from "resend";

/**
 * Datos necesarios para enviar notificación de reserva
 */
interface NotificacionReservaData {
    idReserva: string;
	codigoReserva: string;
	nombreCliente: string;
	emailCliente: string;
	telefonoCliente: string;
	fechaInicio: string;
	fechaFin: string;
	numHuespedes: number;
	precioTotal: number;
	nombrePosada: string;
	habitaciones: Array<{
		nombre: string;
		precioPorNoche: number;
	}>;
	notasCliente?: string;
}

/**
 * Enviar notificación de nueva reserva al admin
 */
export async function enviarNotificacionReserva(data: NotificacionReservaData): Promise<{ success: boolean; error?: string }> {
	try {
        const resend = new Resend(process.env.RESEND_API_KEY);

		// Formatear fechas para mostrar
		const formatearFecha = (fecha: string) => {
			return new Date(fecha).toLocaleDateString("es-VE", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		};

		// Calcular número de noches
		const fechaInicioDate = new Date(data.fechaInicio);
		const fechaFinDate = new Date(data.fechaFin);
		const numNoches = Math.ceil((fechaFinDate.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24));

		// Crear lista de habitaciones
		const listaHabitaciones = data.habitaciones
			.map((h) => `<li><strong>${h.nombre}</strong> - $${h.precioPorNoche}/noche</li>`)
			.join("");

		// Crear el HTML del email
		const htmlEmail = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Reserva - ${data.codigoReserva}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header con color de marca -->
          <tr>
            <td style="background: linear-gradient(135deg, #1B2B3A 0%, #2D4A5E 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: bold;">
                🎉 Nueva Reserva Recibida (${data.nombrePosada})
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">
                ${data.codigoReserva}
              </p>
            </td>
          </tr>

          <!-- Información principal -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Alerta de acción -->
              <div style="background-color: #FFF3CD; border-left: 4px solid #D4AF37; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⏰ Acción requerida:</strong> Confirmar recepción de pago.
                </p>
              </div>

              <!-- Datos del cliente -->
              <h2 style="color: #1B2B3A; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                Datos del Cliente
              </h2>
              
              <table width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Nombre:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${data.nombreCliente}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Email:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    <a href="mailto:${data.emailCliente}" style="color: #1B2B3A; text-decoration: none;">
                      ${data.emailCliente}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Teléfono:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    <a href="https://wa.me/${data.telefonoCliente.replace(/\D/g, "")}" style="color: #25D366; text-decoration: none;">
                      ${data.telefonoCliente} 📱
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Detalles de la reserva -->
              <h2 style="color: #1B2B3A; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                Detalles de la Reserva
              </h2>
              
              <table width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Posada:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${data.nombrePosada}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Check-in:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${formatearFecha(data.fechaInicio)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Check-out:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${formatearFecha(data.fechaFin)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Noches:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${numNoches} ${numNoches === 1 ? "noche" : "noches"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong style="color: #1B2B3A;">Huéspedes:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                    ${data.numHuespedes} ${data.numHuespedes === 1 ? "persona" : "personas"}
                  </td>
                </tr>
              </table>

              <!-- Habitaciones -->
              <h2 style="color: #1B2B3A; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                Habitaciones Reservadas
              </h2>
              
              <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
                ${listaHabitaciones}
              </ul>

              <!-- Precio total destacado -->
              <div style="background-color: #1B2B3A; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <p style="color: #D4AF37; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Total a Cobrar
                </p>
                <p style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">
                  $${data.precioTotal.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              ${
					data.notasCliente
						? `
              <!-- Notas del cliente -->
              <div style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1B2B3A; font-size: 16px; margin: 0 0 10px 0;">
                  Notas del Cliente:
                </h3>
                <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${data.notasCliente}
                </p>
              </div>
              `
						: ""
				}

              <!-- Botones de acción -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="https://posadasmararena.com/admin/reservas/${data.idReserva}" target="_blank"
                       style="display: inline-block; background-color: #1B2B3A; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Ver Reserva en el Panel Admin
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F9FA; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">
                Este es un email automático del sistema de reservas de Mararena Posadas
              </p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Mararena Posadas - Chirimena, Higuerote
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

		// Enviar el email
		const { data: emailData, error: emailError } = await resend.emails.send({
			from: "Reservas Mararena <reservas@reservas.posadasmararena.com>",
			to: "mararenaposadas@gmail.com",
			subject: `Nueva Reserva ${data.codigoReserva} - ${data.nombreCliente}`,
			html: htmlEmail,
		});

		if (emailError) {
			console.error("Error enviando email:", emailError);
			return {
				success: false,
				error: emailError.message || "Error enviando email",
			};
		}

		console.log("Email enviado exitosamente:", emailData?.id);
		return { success: true };
	} catch (error: any) {
		console.error("Error en enviarNotificacionReserva:", error);
		return {
			success: false,
			error: error.message || "Error enviando notificación",
		};
	}
}
