import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export async function GET(req: Request) {
  try {
    // Basic auth check for Cron jobs (Vercel sets CRON_SECRET or auth headers)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all active user profiles
    const { data: users, error } = await supabase
      .from("users_pemulihan")
      .select("*");

    if (error) throw error;
    if (!users || users.length === 0) {
      return NextResponse.json({ message: "Tidak ada pengguna untuk diperiksa." });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let updatedCount = 0;

    for (const user of users) {
      // Check if user already logged their status for yesterday
      const { data: dailyLog } = await supabase
        .from("users_daily_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", yesterdayStr)
        .maybeSingle();

      // If user has no log for yesterday, they missed check-in
      if (!dailyLog) {
        if (user.streak_freezes_count && user.streak_freezes_count > 0) {
          // Consume a Streak Freeze
          await supabase
            .from("users_pemulihan")
            .update({
              streak_freezes_count: user.streak_freezes_count - 1
            })
            .eq("id", user.id);

          // Add a log for yesterday as clean to preserve streak
          await supabase
            .from("users_daily_logs")
            .insert({
              user_id: user.id,
              log_date: yesterdayStr,
              clean_status: true,
              notes: "Diberlakukan otomatis via Streak Freeze."
            });

          updatedCount++;
        } else {
          // No freeze available, reset streak (start_date set to today)
          const currentStreak = differenceInDays(new Date(), parseISO(user.start_date));
          const newBestStreak = Math.max(user.best_streak || 0, currentStreak);

          await supabase
            .from("users_pemulihan")
            .update({
              start_date: new Date().toISOString(),
              best_streak: newBestStreak,
            })
            .eq("id", user.id);

          // Log relapse/break status for yesterday
          await supabase
            .from("users_daily_logs")
            .insert({
              user_id: user.id,
              log_date: yesterdayStr,
              clean_status: false,
              notes: "Reset otomatis karena tidak check-in."
            });

          updatedCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pemeriksaan selesai. ${updatedCount} profil pengguna diperbarui.` 
    });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
