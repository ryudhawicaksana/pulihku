import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pwzuhpvxtecpqfqjwzqj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_B_OYTMlYlHVFQYtEd2RqPQ_tEQzJ70C";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
