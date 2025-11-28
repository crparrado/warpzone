import { Resend } from 'resend';
import ReservationEmail from '@/components/emails/ReservationEmail';

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
      html: `
                <div style="background:#000; color:#fff; padding:40px; font-family:sans-serif;">
                    <h1 style="color:#00f3ff;">¡HORA DE JUGAR!</h1>
                    <p>Tu sesión está por comenzar.</p>
                    <div style="background:#111; padding:20px; border:1px solid #333; margin:20px 0;">
                        <p style="margin:0; color:#888;">LINK DE CONEXIÓN:</p>
                        <a href="${parsecLink}" style="color:#ff00ff; font-size:18px; font-weight:bold;">${parsecLink}</a>
                    </div>
                    <p>Abre Parsec y pega este link en la sección "Arcade" o "Computers".</p>
                </div>
            `
    });
  } catch (error) {
    console.error("Error sending Parsec link:", error);
  }
}

