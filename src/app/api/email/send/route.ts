import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // Mock sending email locally if API key is not configured yet
      const body = await req.json().catch(() => ({}));
      console.log("[Mock Email Sent]:", body);
      return NextResponse.json({
        success: true,
        message: "Simulasi pengiriman email berhasil (RESEND_API_KEY belum terpasang)."
      });
    }

    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Parameter request tidak lengkap. Diperlukan to, subject, dan html." },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);
    const data = await resend.emails.send({
      from: "Pulihku <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email via Resend:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim email." },
      { status: 500 }
    );
  }
}
