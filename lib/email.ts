import { Resend } from 'resend';
import ReservationEmail from '@/components/emails/ReservationEmail';
import ParsecEmail from '@/components/emails/ParsecEmail';

// Initialize Resend with API Key (we need to add this to .env)
// This global initialization is removed as per instruction to initialize inside functions.

export async function sendConfirmationEmail(email: string, reservationId: string, startTime: Date | string, userName: string, pcName: string) {
  console.log(`[EMAIL] Attempting to send confirmation to ${email}`);

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables.");
    return;
  }

  const resend = new Resend(apiKey);

  // Ensure date is a Date object
  const dateObj = new Date(startTime);
  const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : "Fecha inválida";
  const timeStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Hora inválida";

  try {
    const data = await resend.emails.send({
      from: 'Warpzone <reservas@warpzone.cl>',
      to: [email],
      subject: '¡Reserva Confirmada en Warpzone! 🎮',
      react: ReservationEmail({
        userName,
        pcName,
        date: dateStr,
        time: timeStr,
        reservationId: reservationId || "N/A"
      }),
    });
    console.log("✅ Email sent successfully:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Fallback: Try sending simple HTML if React component fails
    try {
      console.log("⚠️ Attempting fallback to simple HTML...");
      await resend.emails.send({
        from: 'Warpzone <reservas@warpzone.cl>',
        to: [email],
        subject: '¡Reserva Confirmada en Warpzone! 🎮',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1>¡Reserva Confirmada!</h1>
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Tu reserva para el <strong>${pcName}</strong> ha sido confirmada.</p>
            <p><strong>Fecha:</strong> ${dateStr}</p>
            <p><strong>Hora:</strong> ${timeStr}</p>
            <p>Recibirás tu link de conexión 5 minutos antes.</p>
          </div>
        `,
      });
      console.log("✅ Fallback email sent.");
    } catch (fallbackError) {
      console.error("❌ Fallback failed:", fallbackError);
    }
  }
}

export async function sendParsecLinkEmail(email: string, parsecLink: string) {
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
      react: ParsecEmail({ parsecLink }),
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

