import nodemailer from 'nodemailer';

interface SendEmailProps {
  email: string;
  token: string;
  name?: string;
}

/**
 * Send verification email to user
 * Phase 1: Synchronous (will be async in Phase 3)
 * Phase 3: Will be executed by background job worker
 */
export const sendVerificationEmail = async ({ email, token, name }: SendEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const userName = name ? `${name},` : 'User,';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Hello ${userName}</p>
      <p>Thank you for creating an account. Please verify your email address by clicking the link below:</p>
      <p style="margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email Address
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 40px;">
        This link will expire in 15 minutes. If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.SMTP_ACCOUNT,
        pass: process.env.SMTP_PASSWORD,
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    });

    await transporter.verify();

    const result = await transporter.sendMail({
      from: process.env.SMTP_ACCOUNT,
      subject: 'Verify Your Email Address',
      to: email,
      html: htmlContent,
      text: `Click here to verify: ${verificationUrl}`,
    });

    console.log('[Email] Verification email sent:', { email, messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] Error sending verification email:', {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error; // Re-throw so caller can handle
  }
};

export const sendVerificationForgotPassword = async (email: string, token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <p style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 40px;">
        This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.SMTP_ACCOUNT,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    const result = await transporter.sendMail({
      from: process.env.SMTP_ACCOUNT,
      subject: 'Reset Your Password',
      to: email,
      html: htmlContent,
      text: `Click here to reset password: ${resetUrl}`,
    });

    console.log('[Email] Password reset email sent:', { email, messageId: result.messageId });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] Error sending password reset email:', {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
