const nodemailer = require("nodemailer");
const { env } = require("../config/env");

let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    _transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    console.log(`📧  Mailer: ${env.SMTP_HOST}:${env.SMTP_PORT} (${env.SMTP_USER})`);
  } else {
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log(`📧  Mailer: Ethereal test account — ${testAccount.user}`);
    console.log("    View sent emails at: https://ethereal.email/messages");
  }

  return _transporter;
}

async function verifyMailer() {
  try {
    const t = await getTransporter();
    await t.verify();
    console.log("✅  Mailer: SMTP connection verified.");
  } catch (err) {
    console.warn("⚠️   Mailer: SMTP verification failed —", err.message);
  }
}

function htmlWrapper(content) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#070c18;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#0f1420;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
      <div style="background:linear-gradient(135deg,#3730a3,#4f46e5);padding:36px 40px;text-align:center;">
        <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:12px 20px;margin-bottom:14px;">
          <span style="font-size:28px;">⚡</span>
        </div>
        <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;letter-spacing:6px;text-transform:uppercase;">
          SCHOOLZ<span style="color:#a5b4fc;">PRO</span>
        </h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:3px;text-transform:uppercase;">
          Secure Examination Platform
        </p>
      </div>
      <div style="padding:40px;">
        ${content}
      </div>
      <div style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
        <p style="margin:0;color:#475569;font-size:11px;">
          © ${new Date().getFullYear()} SchoolzPro. Do not reply to this email.
        </p>
      </div>
    </div>
  </body>
  </html>`;
}

async function sendPasswordResetEmail(to, link) {
  const transporter = await getTransporter();
  const from = env.SMTP_FROM || env.SMTP_USER || `"SchoolzPro" <noreply@schoolzpro.com>`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 12px;color:#e2e8f0;font-size:22px;font-weight:800;">Password Reset Request</h2>
    <p style="color:#94a3b8;line-height:1.7;font-size:14px;">
      We received a request to reset the password for your SchoolzPro account (<strong style="color:#e2e8f0;">${to}</strong>).
      Click the button below to create a new password. This link expires in <strong style="color:#e2e8f0;">1 hour</strong>.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${link}"
         style="display:inline-block;background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;text-decoration:none;
                padding:16px 40px;border-radius:12px;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;
                box-shadow:0 8px 24px rgba(99,102,241,0.4);">
        Reset My Password
      </a>
    </div>
    <p style="color:#64748b;font-size:12px;line-height:1.6;text-align:center;">
      If you did not request this, ignore this email. Your password stays unchanged.
    </p>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:16px;margin-top:24px;">
      <p style="margin:0;color:#64748b;font-size:11px;">
        ⏳ Link expires in: <strong style="color:#818cf8;">1 hour</strong><br/>
        If the button does not work, copy and paste this link into your browser:<br/>
        <span style="color:#6366f1;word-break:break-all;">${link}</span>
      </p>
    </div>
  `);

  const info = await transporter.sendMail({
    from,
    to,
    subject: "🔐 SchoolzPro – Reset Your Password",
    html,
    text: `Reset your SchoolzPro password:\n\n${link}\n\nThis link expires in 1 hour.`,
  });

  if (!env.SMTP_HOST) {
    console.log("📧  Password reset preview:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

async function sendContactEmail({ adminEmail, senderName, senderEmail, subject, message }) {
  const transporter = await getTransporter();
  const from = env.SMTP_FROM || env.SMTP_USER || `"SchoolzPro" <noreply@schoolzpro.com>`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 12px;color:#e2e8f0;font-size:22px;font-weight:800;">📬 New Support Message</h2>
    <p style="color:#94a3b8;font-size:13px;margin-bottom:24px;">A user has sent a message through the SchoolzPro contact form.</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:100px;">From</td>
          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${senderName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td>
          <td style="padding:8px 0;color:#818cf8;font-size:13px;"><a href="mailto:${senderEmail}" style="color:#818cf8;">${senderEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Subject</td>
          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;">${subject}</td>
        </tr>
      </table>
    </div>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;">
      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
      <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
    </div>
    <div style="text-align:center;margin-top:28px;">
      <a href="mailto:${senderEmail}?subject=Re: ${subject}"
         style="display:inline-block;background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:12px;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
        Reply to ${senderName}
      </a>
    </div>
  `);

  const info = await transporter.sendMail({
    from,
    to: adminEmail,
    replyTo: `"${senderName}" <${senderEmail}>`,
    subject: `📬 [SchoolzPro Contact] ${subject}`,
    html,
    text: `New message from ${senderName} (${senderEmail})\n\nSubject: ${subject}\n\n${message}`,
  });

  if (!env.SMTP_HOST) {
    console.log("📧  Contact email preview:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

async function sendWelcomeEmail(to, name) {
  const transporter = await getTransporter();
  const from = env.SMTP_FROM || env.SMTP_USER || `"SchoolzPro" <noreply@schoolzpro.com>`;
  const loginUrl = `${env.CLIENT_ORIGIN.split(",")[0].trim()}/login`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 12px;color:#e2e8f0;font-size:22px;font-weight:800;">Welcome to SchoolzPro! 🎉</h2>
    <p style="color:#94a3b8;line-height:1.7;font-size:14px;">
      Hi <strong style="color:#e2e8f0;">${name}</strong>, your account has been successfully created.
      You can now log in and start taking examinations.
    </p>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#94a3b8;font-size:13px;">🎯 <strong style="color:#e2e8f0;">What you can do:</strong></p>
      <ul style="margin:12px 0 0;padding-left:20px;color:#94a3b8;font-size:13px;line-height:2;">
        <li>Take online examinations assigned to you</li>
        <li>View your results and scores</li>
        <li>Check the leaderboard rankings</li>
        <li>Download your achievement certificates</li>
      </ul>
    </div>
    <div style="text-align:center;margin-top:28px;">
      <a href="${loginUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;text-decoration:none;
                padding:16px 40px;border-radius:12px;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;
                box-shadow:0 8px 24px rgba(99,102,241,0.4);">
        Login Now
      </a>
    </div>
  `);

  const info = await transporter.sendMail({
    from,
    to,
    subject: "🎉 Welcome to SchoolzPro!",
    html,
    text: `Welcome ${name}!\n\nYour SchoolzPro account is ready.\nLogin at: ${loginUrl}`,
  });

  if (!env.SMTP_HOST) {
    console.log("📧  Welcome email preview:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

module.exports = { getTransporter, verifyMailer, sendPasswordResetEmail, sendContactEmail, sendWelcomeEmail };
