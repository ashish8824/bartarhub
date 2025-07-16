import { supabase } from "@/lib/supabase";

export async function updateUserProfile(
  userId: string,
  values: Record<string, unknown>
) {
  const { error } = await supabase
    .from("users")
    .update(values)
    .eq("id", userId);

  return !error;
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(`public/${fileName}`, file, { upsert: true });

  if (error) return null;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(`public/${fileName}`);

  return data.publicUrl;
}
