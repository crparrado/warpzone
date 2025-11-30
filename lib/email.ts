import { Resend } from 'resend';
import ReservationEmail from '@/components/emails/ReservationEmail';
import ParsecEmail from '@/components/emails/ParsecEmail';
import { PurchaseEmail } from '@/components/emails/PurchaseEmail';
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail';

// Initialize Resend with API Key (we need to add this to .env)
// This global initialization is removed as per instruction to initialize inside functions.


export async function sendConfirmationEmail(email: string, reservationId: string, startTime: Date | string, userName: string, pcName: string, gameName?: string) {
  console.log(`[EMAIL] Attempting to send confirmation to ${email}`);

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables.");
    return;
  }

  const resend = new Resend(apiKey);

  // Ensure date is a Date object
  const dateObj = new Date(startTime);
  // Fix Timezone to Chile
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('es-CL', { timeZone: 'America/Santiago', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : "Fecha inválida";
  const timeStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' })
    : "Hora inválida";

  // Sanitize props to prevent React rendering crashes
  const safeUserName = userName || "Gamer";
  const safePcName = pcName || "PC Gamer";
  const safeReservationId = reservationId ? String(reservationId) : "N/A";
  const safeGameName = gameName || "Escritorio Remoto";

  try {
    const data = await resend.emails.send({
      from: 'Warpzone <reservas@warpzone.cl>',
      to: [email],
      subject: '¡Reserva Confirmada en Warpzone! 🎮',
      react: ReservationEmail({
        userName: safeUserName,
        pcName: safePcName,
        date: dateStr,
        time: timeStr,
        reservationId: safeReservationId,
        gameName: safeGameName
      }),
    });
    console.log("✅ Email sent successfully:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Fallback: Rich HTML Template matching the Cyber Gamer aesthetic
    try {
      console.log("⚠️ Attempting fallback to rich HTML...");
      await resend.emails.send({
        from: 'Warpzone <reservas@warpzone.cl>',
        to: [email],
        subject: '¡Reserva Confirmada en Warpzone! 🎮',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);">
                
                <!-- Header -->
                <div style="background-color: #000; padding: 30px 0; text-align: center; border-bottom: 1px solid #333;">
                  <h1 style="color: #00f3ff; font-size: 36px; font-weight: 900; letter-spacing: 6px; margin: 0; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);">WARPZONE</h1>
                  <p style="color: #666; font-size: 10px; letter-spacing: 4px; margin: 5px 0 0;">REMOTE GAMING SYSTEMS</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px;">
                  <h2 style="color: #fff; font-size: 24px; margin: 0 0 20px;">HOLA <span style="color: #ff00ff; text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);">${safeUserName.toUpperCase()}</span>,</h2>
                  <p style="color: #aaa; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
                    Tu estación de batalla ha sido reservada. El sistema está preparando tu acceso.
                  </p>

                  <!-- Card -->
                  <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">FECHA</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">${dateStr}</div>
                        </td>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">HORA</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">${timeStr}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">EQUIPO</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">${safePcName}</div>
                        </td>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">JUEGO</div>
                          <div style="color: #00f3ff; font-size: 18px; font-weight: bold;">${safeGameName}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">ID RESERVA</div>
                          <div style="color: #666; font-size: 14px; font-family: monospace;">#${safeReservationId.slice(0, 8)}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Instructions -->
                  <div style="background-color: rgba(0, 243, 255, 0.05); border-left: 4px solid #00f3ff; padding: 20px; margin-bottom: 30px;">
                    <div style="color: #00f3ff; font-size: 14px; font-weight: bold; margin-bottom: 10px;">⚠️ INSTRUCCIONES DE ACCESO</div>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">1. Recibirás un correo con el <strong>Link de Parsec</strong> 5 minutos antes de tu hora.</p>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">2. Asegúrate de tener <a href="https://parsec.app/" style="color: #00f3ff; text-decoration: underline;">Parsec instalado</a>.</p>
                  </div>

                  <a href="https://warpzone.cl/dashboard" style="display: block; background-color: #ff00ff; border-radius: 4px; color: #000; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; padding: 16px 0; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);">
                    GESTIONAR MI RESERVA
                  </a>
                </div>

                <!-- Footer -->
                <div style="background-color: #000; color: #444; font-size: 12px; text-align: center; padding: 20px;">
                  WARPZONE CHILE<br />Santiago de Chile
                </div>
              </div>
            </body>
          </html>
        `,
      });
      console.log("✅ Fallback email sent.");
    } catch (fallbackError) {
      console.error("❌ Fallback failed:", fallbackError);
    }
  }
}

export async function sendParsecLinkEmail(email: string, parsecLink: string, userName?: string, gameName?: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables for Parsec link email.");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: 'Warpzone <reservas@warpzone.cl>',
      to: [email],
      subject: '🎮 Tu Link de Acceso Warpzone',
      react: ParsecEmail({ parsecLink, userName, gameName }),
    });
    console.log(`✅ Parsec link email sent to ${email}`);
  } catch (error) {
    console.error("Error sending Parsec link:", error);
    // Fallback
    try {
      await resend.emails.send({
        from: 'Warpzone <reservas@warpzone.cl>',
        to: [email],
        subject: '🎮 Tu Link de Acceso Warpzone',
        html: `<p>Tu link de conexión: <a href="${parsecLink}">${parsecLink}</a></p>`
      });
    } catch (e) {
      console.error("Fallback failed", e);
    }
  }
}

export async function sendPurchaseConfirmationEmail(email: string, userName: string, productName: string, amount: number, minutes: number, purchaseId: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables for purchase email.");
    return;
  }

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleDateString('es-CL', { timeZone: 'America/Santiago', year: 'numeric', month: 'long', day: 'numeric' });

  // Sanitize
  const safeUserName = userName || "Gamer";

  try {
    await resend.emails.send({
      from: 'Warpzone <pagos@warpzone.cl>',
      to: [email],
      subject: '💎 ¡Recarga Exitosa! Créditos Agregados',
      react: PurchaseEmail({
        userName: safeUserName,
        productName,
        amount,
        minutes,
        purchaseId,
        date: dateStr
      }),
    });
    console.log(`✅ Purchase confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending purchase email:", error);
    // Fallback
    try {
      await resend.emails.send({
        from: 'Warpzone <pagos@warpzone.cl>',
        to: [email],
        subject: '💎 ¡Recarga Exitosa! Créditos Agregados',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);">
                
                <!-- Header -->
                <div style="background-color: #000; padding: 30px 0; text-align: center; border-bottom: 1px solid #333;">
                  <h1 style="color: #00f3ff; font-size: 36px; font-weight: 900; letter-spacing: 6px; margin: 0; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);">WARPZONE</h1>
                  <p style="color: #666; font-size: 10px; letter-spacing: 4px; margin: 5px 0 0;">REMOTE GAMING SYSTEMS</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px;">
                  <h2 style="color: #fff; font-size: 24px; margin: 0 0 20px;">¡RECARGA EXITOSA!</h2>
                  <h3 style="color: #fff; font-size: 20px; margin: 0 0 20px;">HOLA <span style="color: #ff00ff; text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);">${safeUserName.toUpperCase()}</span>,</h3>
                  <p style="color: #aaa; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
                    Tus créditos han sido agregados correctamente a tu cuenta. Ya estás listo para jugar.
                  </p>

                  <!-- Card -->
                  <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">PRODUCTO</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">${productName}</div>
                        </td>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">CRÉDITOS</div>
                          <div style="color: #00f3ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 5px rgba(0, 243, 255, 0.3);">+${minutes / 60} HRS</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">MONTO</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">$${amount.toLocaleString('es-CL')}</div>
                        </td>
                        <td style="padding-bottom: 15px;">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">FECHA</div>
                          <div style="color: #fff; font-size: 18px; font-weight: bold;">${dateStr}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div style="color: #666; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px;">ID TRANSACCIÓN</div>
                          <div style="color: #666; font-size: 14px; font-family: monospace;">#${purchaseId.slice(0, 8)}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <a href="https://warpzone.cl/dashboard" style="display: block; background-color: #ff00ff; border-radius: 4px; color: #000; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; padding: 16px 0; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);">
                    IR AL DASHBOARD
                  </a>
                </div>

                <!-- Footer -->
                <div style="background-color: #000; color: #444; font-size: 12px; text-align: center; padding: 20px;">
                  WARPZONE CHILE<br />Santiago de Chile
                </div>
              </div>
            </body>
          </html>
        `
      });
    } catch (e) {
      console.error("Fallback failed", e);
    }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, userName?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://warpzone.cl';
  const resetLink = `${appUrl}/auth/reset-password?token=${resetToken}`;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables for password reset email.");
    return;
  }

  const resend = new Resend(apiKey);
  const safeUserName = userName || "Gamer";

  try {
    await resend.emails.send({
      from: 'Warpzone <soporte@warpzone.cl>',
      to: [email],
      subject: '🔐 Recuperación de Contraseña - Warpzone',
      react: ResetPasswordEmail({ resetLink, userName: safeUserName }),
    });
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // Fallback
    try {
      await resend.emails.send({
        from: 'Warpzone <soporte@warpzone.cl>',
        to: [email],
        subject: '🔐 Recuperación de Contraseña - Warpzone',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);">
                <div style="background-color: #000; padding: 30px 0; text-align: center; border-bottom: 1px solid #333;">
                  <h1 style="color: #00f3ff; font-size: 36px; font-weight: 900; letter-spacing: 6px; margin: 0; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);">WARPZONE</h1>
                </div>
                <div style="padding: 40px; text-align: center;">
                  <h2 style="color: #fff; font-size: 24px; margin: 0 0 20px;">RECUPERACIÓN DE CLAVE</h2>
                  <p style="color: #aaa; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
                    Haz clic en el siguiente enlace para restablecer tu contraseña:
                  </p>
                  <a href="${resetLink}" style="display: inline-block; background-color: #00f3ff; border-radius: 4px; color: #000; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 30px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);">
                    RESTABLECER CONTRASEÑA
                  </a>
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Si no solicitaste este cambio, ignora este correo.
                  </p>
                </div>
                <div style="background-color: #000; color: #444; font-size: 12px; text-align: center; padding: 20px;">
                  WARPZONE CHILE<br />Santiago de Chile
                </div>
              </div>
            </body>
          </html>
        `
      });
    } catch (e) {
      console.error("Fallback failed", e);
    }
  }
}

export async function sendAdminPurchaseNotification(userName: string, userEmail: string, productName: string, amount: number, purchaseId: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables for admin notification.");
    return;
  }

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const admins = ["crparrado@gmail.com", "martongas89@gmail.com"];

  try {
    await resend.emails.send({
      from: 'Warpzone System <system@warpzone.cl>',
      to: admins,
      subject: `💰 Nueva Compra: ${userName} - $${amount.toLocaleString('es-CL')}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #00f3ff; padding-bottom: 10px;">Nueva Compra Registrada</h2>
              
              <div style="margin: 20px 0;">
                <p><strong>Usuario:</strong> ${userName} (${userEmail})</p>
                <p><strong>Producto:</strong> ${productName}</p>
                <p><strong>Monto:</strong> $${amount.toLocaleString('es-CL')}</p>
                <p><strong>Fecha:</strong> ${dateStr}</p>
                <p><strong>ID Transacción:</strong> ${purchaseId}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                Notificación automática del sistema Warpzone.
              </div>
            </div>
          </body>
        </html>
      `
    });
    console.log(`✅ Admin notification sent to ${admins.join(', ')}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
}
