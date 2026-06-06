const nodemailer = require("nodemailer");
const { env } = require("../config/env");

let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  if (env.SMTP_HOST) {
    // Use configured SMTP (e.g. Gmail, Outlook, etc.)
    _transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  } else {
    // Fallback: create a test Ethereal account (dev only — prints preview URL)
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧  Using Ethereal test email. Preview at: https://ethereal.email");
  }

  return _transporter;
}

/**
 * Send a password-reset email.
 * @param {string} to   - recipient email
 * @param {string} link - full reset URL (with token)
 */
async function sendPasswordResetEmail(to, link) {
  const transporter = await getTransporter();

  const from = env.SMTP_FROM || `"SchoolzPro" <noreply@schoolzpro.com>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject: "SchoolzPro – Reset Your Password",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f1117;color:#e2e8f0;border-radius:16px;padding:40px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-flex;background:#4f46e5;border-radius:16px;padding:12px 20px;margin-bottom:16px;">
            <span style="font-size:24px;">⚡</span>
          </div>
          <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:4px;text-transform:uppercase;">
            SCHOOLZ<span style="color:#6366f1;">PRO</span>
          </h1>
        </div>
        <h2 style="font-size:20px;margin-bottom:8px;">Password Reset Request</h2>
        <p style="color:#94a3b8;line-height:1.6;">
          We received a request to reset the password for your SchoolzPro account associated with <strong>${to}</strong>.
          Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${link}" 
             style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;">
            Reset Password
          </a>
        </div>
        <p style="color:#64748b;font-size:12px;line-height:1.6;">
          If you did not request a password reset, you can safely ignore this email. 
          Your password will not change until you click the link above and create a new one.
        </p>
        <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;" />
        <p style="color:#475569;font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} SchoolzPro. Secure Examination Platform.
        </p>
      </div>
    `,
    text: `Reset your SchoolzPro password:\n\n${link}\n\nThis link expires in 1 hour.\n\nIf you did not request this, ignore this email.`,
  });

  // In development, log the Ethereal preview URL
  if (!env.SMTP_HOST) {
    console.log("📧  Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

module.exports = { sendPasswordResetEmail };
