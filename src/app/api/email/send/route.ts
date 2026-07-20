import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      // Mock sending email locally if credentials are not configured yet
      const body = await req.json().catch(() => ({}));
      console.log("[Mock Email Sent (Nodemailer credentials missing)]:", body);
      return NextResponse.json({ 
        success: true, 
        message: "Simulasi pengiriman email berhasil (EMAIL_USER / EMAIL_PASS belum dikonfigurasi)." 
      });
    }

    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Parameter request tidak lengkap. Diperlukan to, subject, dan html." },
        { status: 400 }
      );
    }

    // Configure Nodemailer Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass, // App Password (16 characters)
      },
    });

    const info = await transporter.sendMail({
      from: `"Pulihku" <${emailUser}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data: info });
  } catch (error: any) {
    console.error("Error sending email via Nodemailer:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mengirim email." },
      { status: 500 }
    );
  }
}
