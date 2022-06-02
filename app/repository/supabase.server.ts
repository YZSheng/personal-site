import { createClient, SupabaseClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

const getSupabase = (): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  invariant(supabaseUrl);
  invariant(supabaseAnonKey);
  return createClient(supabaseUrl, supabaseAnonKey);
};

const supabase = getSupabase();

export default supabase;
