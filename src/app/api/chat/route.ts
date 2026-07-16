import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY tidak dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format body request tidak valid. Diperlukan array messages." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Anda adalah AI Sahabat Pulih, seorang asisten rehabilitasi mandiri yang empati, ramah, dan profesional.
Tugas Anda adalah mendengarkan keluh kesah pengguna yang sedang berjuang mengatasi kecanduan pornografi tanpa menghakimi.
Gunakan prinsip-prinsip terapi kognitif perilaku (CBT), dorong mindfulness, dan tawarkan teknik relaksasi pernapasan atau aktivitas fisik pengalih perhatian (seperti push-up 10x, minum air putih) jika pengguna melaporkan dorongan (craving) yang sangat kuat.
Pastikan gaya bahasa Anda hangat, suportif, menggunakan bahasa Indonesia yang santun tetapi akrab. Jangan menghakimi ketika pengguna mengalami relapse, melainkan berikan penguatan bahwa pemulihan adalah proses naik-turun dan ajak mereka untuk mulai kembali dengan komitmen baru.`,
    });

    // Format chat history for Gemini API
    // Gemini expects structure: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map((msg: any) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const result = await model.generateContent({
      contents,
    });

    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memproses obrolan." },
      { status: 500 }
    );
  }
}
