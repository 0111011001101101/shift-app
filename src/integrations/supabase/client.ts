// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://itxdiqhjhztmjfzbyafa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eGRpcWhqaHp0bWpmemJ5YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNjE2MjksImV4cCI6MjA1MjczNzYyOX0.xCE1_du43wvV0Xk3tTndt1dEn68OKIgvBk986Q63DKo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);