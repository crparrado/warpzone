import { Resend } from 'resend';
import ReservationEmail from '@/components/emails/ReservationEmail';
import ParsecEmail from '@/components/emails/ParsecEmail';

// Initialize Resend with API Key (we need to add this to .env)
// This global initialization is removed as per instruction to initialize inside functions.

export async function sendConfirmationEmail(email: string, reservationId: string, startTime: Date, userName: string, pcName: string) {
  console.log(`[EMAIL] Attempting to send confirmation to ${email}`);

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("⚠️ RESEND_API_KEY missing in environment variables.");
    return;
  }

  // Initialize Resend inside the function to ensure env vars are loaded (like in the test route)
  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'Warpzone <reservas@warpzone.cl>',
      to: [email],
      subject: '¡Reserva Confirmada en Warpzone! 🎮',
      react: ReservationEmail({
        userName,
        pcName,
        date: startTime.toLocaleDateString(),
        time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reservationId
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
        subject: '¡Reserva Confirmada en Warpzone! 🎮 (Fallback)',
        html: `<p>Hola ${userName}, tu reserva para el PC ${pcName} ha sido confirmada.</p>`,
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

