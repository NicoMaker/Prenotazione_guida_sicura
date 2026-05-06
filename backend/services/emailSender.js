import { getTransporter } from "./email.js";
import { buildClienteEmail, buildManagerEmail } from "./emailTemplates.js";
import { formatDateIT } from "../utils/dateFormat.js";

export async function sendConfirmationEmails(booking, companyInfoData) {
  const transporter = getTransporter();
  const c = companyInfoData.company || companyInfoData;
  const managers = companyInfoData.managers || [];
  const companyName = c.name || "Palmino Motors";
  const dateShort = formatDateIT(booking.date);

  // ── Email cliente ──
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: `✓ Guida Sicura confermata – ${dateShort} ore ${booking.time} | ${companyName}`,
    html: buildClienteEmail(booking, companyInfoData),
  });

  // ── Email manager ──
  const managerEmails = managers
    .map((m) => m.email)
    .filter(Boolean)
    .join(", ");
  if (managerEmails) {
    await transporter.sendMail({
      from: `"${companyName}" <${process.env.EMAIL_USER}>`,
      to: managerEmails,
      subject: `[Guida Sicura] ${booking.nome} ${booking.cognome} · ${dateShort} ${booking.time}`,
      html: buildManagerEmail(booking, companyInfoData),
    });
  }

  console.log(
    `📧 Email inviate → cliente: ${booking.email} | manager: ${managerEmails}`,
  );
}
