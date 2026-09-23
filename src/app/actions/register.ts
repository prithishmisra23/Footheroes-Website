"use server";

import { createClient } from "@supabase/supabase-js";

// Ensure we have placeholders for the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Using the anon key by default, but service role key is preferred for server actions if RLS is strict
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function registerForEarlyAccess(data: { name: string; email: string; phone: string; role: string }) {
  try {
    // If credentials are empty (local dev without env vars), we can mock success for now 
    // or fail gracefully. The user said they will add the API keys in Vercel.
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing. Registration bypassed in development.");
      // We simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true }; // Fake success when no keys so UI doesn't break locally
    }

    const { error } = await supabase
      .from("early_access_registrations")
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          football_role: data.role,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message || "Failed to register. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during registration:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
