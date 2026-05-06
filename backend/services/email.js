import nodemailer from "nodemailer";

let transporter;

export function initEmailTransporter() {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify((error) => {
    if (error) console.log("⚠️  Errore configurazione email:", error.message);
    else console.log("📧 Server email pronto");
  });
}

export function getTransporter() {
  if (!transporter) throw new Error("Transporter email non inizializzato.");
  return transporter;
}
