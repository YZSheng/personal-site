import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

export const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  invariant(supabaseUrl);
  invariant(supabaseAnonKey);
  return createClient(supabaseUrl, supabaseAnonKey);
};

