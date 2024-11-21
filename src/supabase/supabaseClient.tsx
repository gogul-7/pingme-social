import { createClient } from "@supabase/supabase-js";
import { server_url, supabase_key } from "../utils/constants";

const supabaseUrl = server_url;
const supabaseKey = supabase_key;

export const supabase = createClient(supabaseUrl, supabaseKey);
