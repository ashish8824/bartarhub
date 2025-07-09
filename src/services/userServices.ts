import { supabase } from "@/lib/supabase";

export async function getCurrentUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch user profile:", error.message);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: { username: string; bio?: string; avatar_url?: string }
) {
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Failed to update user profile:", error.message);
    return false;
  }

  return true;
}
