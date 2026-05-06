import { formatDateIT, formatDateLong } from "../utils/dateFormat.js";

const baseStyles = `
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  body{margin:0;padding:0;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif}
  table{border-collapse:collapse}
  img{border:0;outline:none;text-decoration:none}
  a{color:#e63312;text-decoration:none}
`;

function buildWrapper(headerHtml, bodyHtml, footerHtml) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>${baseStyles}</style>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
  ${headerHtml}
  ${bodyHtml}
  ${footerHtml}
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildHeader(companyName, badge = "") {
  return `
  <tr>
    <td style="background:#111111;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="height:4px;background:linear-gradient(90deg,#e63312,#ff4d2e);font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:28px 36px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">${companyName}</p>
            <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;color:#888888;letter-spacing:3px;text-transform:uppercase;">Guida Sicura</p>
          </td>
          ${badge ? `<td style="padding:28px 36px 28px 0;text-align:right;vertical-align:middle;">${badge}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>`;
}

function buildFooter(
  companyName,
  pivaLine,
  note = "Tutti i diritti riservati",
) {
  return `
  <tr>
    <td style="background:#111111;padding:18px 36px;text-align:center;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:.5px;color:#ffffff;">
        &copy; 2026 ${companyName}${pivaLine} &nbsp;·&nbsp; ${note}
      </p>
    </td>
  </tr>`;
}

export function buildClienteEmail(booking, companyInfoData) {
  const c = companyInfoData.company || companyInfoData;
  const companyName = c.name || "Palmino Motors";
  const fullAddress = `${c.address}, ${c.city}${c.cap ? " " + c.cap : ""}`;
  const dateShort = formatDateIT(booking.date);
  const dateLong = formatDateLong(booking.date);
  const sessionText = booking.session === 'morning' ? 'Mattina' : 'Pomeriggio';

  const badge = `<span style="display:inline-block;background:#e63312;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 12px;border-radius:3px;">Guida Sicura</span>`;

  const hero = `
  <tr>
    <td style="background:#e63312;padding:22px 36px;text-align:center;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:900;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">&#10003; Prenotazione Confermata!</p>
      <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:.5px;">
        ${dateLong} &nbsp;·&nbsp; ${sessionText}
      </p>
    </td>
  </tr>`;

  const body = `
  <tr>
    <td style="padding:32px 36px;background:#ffffff;">
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;">
        Ciao <strong>${booking.nome} ${booking.cognome}</strong>,
      </p>
      <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#555555;line-height:1.65;">
        la tua prenotazione per la Guida Sicura è stata <strong style="color:#1a1a1a;">confermata</strong>. Non vediamo l'ora di averti con noi!
      </p>

      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#e63312;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #e63312;padding-bottom:6px;">Dettagli Prenotazione</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;width:32%;border-bottom:1px solid #e8e8e8;">Data</td>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;border-bottom:1px solid #e8e8e8;">${dateLong}</td>
        </tr>
        <tr>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;border-bottom:1px solid #e8e8e8;">Sessione</td>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#e63312;font-weight:900;letter-spacing:.5px;border-bottom:1px solid #e8e8e8;">${sessionText}</td>
        </tr>
        <tr>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;border-bottom:1px solid #e8e8e8;">Servizio</td>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;border-bottom:1px solid #e8e8e8;">Guida Sicura</td>
        </tr>
        <tr>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;">Durata</td>
          <td style="padding:11px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;">30 minuti</td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#fff5f3;border-left:4px solid #e63312;border-radius:0 5px 5px 0;padding:13px 16px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;line-height:1.6;">
              &#9888;&nbsp; Presentati <strong>10 minuti prima</strong> dell'orario con <strong>documento d'identità</strong> e <strong>patente di guida</strong>.
            </p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#e63312;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #e63312;padding-bottom:6px;">Dove Siamo</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:14px 16px;background:#f8f8f8;">
            <p style="margin:0 0 3px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;">&#128205; ${fullAddress}</p>
            <a href="${mapsUrl}" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#e63312;font-weight:700;text-decoration:none;letter-spacing:.5px;text-transform:uppercase;">Apri in Google Maps &rarr;</a>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding-top:20px;border-top:1px solid #e8e8e8;">
            <p style="margin:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;">Per informazioni o modifiche:</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;">
              &#128222;&nbsp;
              <a href="tel:${(c.phone || "").replace(/\s/g, "")}" style="color:#1a1a1a;text-decoration:none;font-weight:700;">${c.phone || ""}</a>
              &nbsp;&nbsp;&nbsp;
              &#9993;&nbsp;
              <a href="mailto:${c.email || ""}" style="color:#e63312;text-decoration:none;font-weight:700;">${c.email || ""}</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return buildWrapper(
    buildHeader(companyName, badge) + hero,
    body,
    buildFooter(companyName),
  );
}

export function buildManagerEmail(booking, companyInfoData) {
  const c = companyInfoData.company || companyInfoData;
  const companyName = c.name || "Palmino Motors";
  const dateShort = formatDateIT(booking.date);
  const dateLong = formatDateLong(booking.date);
  const phone = (booking.telefono || "").replace(/\s/g, "");
  const sessionText = booking.session === 'morning' ? 'Mattina' : 'Pomeriggio';

  
  const adminHeader = `
  <tr>
    <td style="background:#111111;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="height:4px;background:linear-gradient(90deg,#e63312,#ff4d2e);font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:22px 36px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">${companyName}</p>
            <p style="margin:3px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:8px;color:#777777;letter-spacing:3px;text-transform:uppercase;">Pannello Prenotazioni &middot; Admin</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:#1a1a1a;padding:16px 36px;border-bottom:2px solid #e63312;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">
        &#128205; Nuova prenotazione Guida Sicura ricevuta
      </p>
      <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#aaaaaa;">
        ${dateLong} &nbsp;&middot;&nbsp; <strong style="color:#e63312;">${sessionText}</strong>
      </p>
    </td>
  </tr>`;

  const body = `
  <tr>
    <td style="padding:28px 36px;background:#ffffff;">
      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#e63312;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #e63312;padding-bottom:6px;">Prenotazione</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;width:32%;border-bottom:1px solid #e8e8e8;">Data</td>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;border-bottom:1px solid #e8e8e8;">${dateLong} (${dateShort})</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;">Sessione</td>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#e63312;font-weight:900;letter-spacing:1px;">${sessionText}</td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;color:#e63312;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #e63312;padding-bottom:6px;">Cliente</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;width:32%;border-bottom:1px solid #e8e8e8;">Nome</td>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;font-weight:700;border-bottom:1px solid #e8e8e8;">${booking.nome} ${booking.cognome}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;border-bottom:1px solid #e8e8e8;">Telefono</td>
          <td style="padding:10px 16px;border-bottom:1px solid #e8e8e8;">
            <a href="tel:${phone}" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#e63312;font-weight:700;text-decoration:none;">${booking.telefono}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:.8px;font-weight:700;background:#f8f8f8;">Email</td>
          <td style="padding:10px 16px;">
            <a href="mailto:${booking.email}" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#e63312;font-weight:700;text-decoration:none;">${booking.email}</a>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
        <tr>
          <td align="center" style="padding:4px 0;">
            <a href="tel:${phone}"
               style="display:inline-block;background:#e63312;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;padding:11px 24px;border-radius:4px;margin-right:8px;">
              &#128222; Chiama
            </a>
            <a href="mailto:${booking.email}"
               style="display:inline-block;background:#111111;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;padding:11px 24px;border-radius:4px;">
              &#9993; Scrivi Email
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return buildWrapper(
    adminHeader,
    body,
    buildFooter(companyName, pivaLine, "Sistema prenotazioni automatico"),
  );
}
