import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.HF_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "HF_API_KEY atau GEMINI_API_KEY tidak dikonfigurasi di server." },
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

    const systemPrompt = `Anda adalah AI Sahabat Pulih, seorang asisten rehabilitasi mandiri yang empati, ramah, dan profesional.
Tugas Anda adalah mendengarkan keluh kesah pengguna yang sedang berjuang mengatasi kecanduan pornografi tanpa menghakimi.
Gunakan prinsip-prinsip terapi kognitif perilaku (CBT), dorong mindfulness, dan tawarkan teknik relaksasi pernapasan atau aktivitas fisik pengalih perhatian (seperti push-up 10x, minum air putih) jika pengguna melaporkan dorongan (craving) yang sangat kuat.
Pastikan gaya bahasa Anda hangat, suportif, menggunakan bahasa Indonesia yang santun tetapi akrab. Jangan menghakimi ketika pengguna mengalami relapse, melainkan berikan penguatan bahwa pemulihan adalah proses naik-turun dan ajak mereka untuk mulai kembali dengan komitmen baru.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    const modelId = "Qwen/Qwen2.5-7B-Instruct";
    const response = await fetch(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: formattedMessages,
          max_tokens: 1000,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server saat memproses obrolan." },
      { status: 500 }
    );
  }
}

