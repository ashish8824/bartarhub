import { supabase } from "@/lib/supabase";

export async function fetchMessages(barterId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender_profile:users!sender_id(username, avatar_url)")
    .eq("barter_id", barterId)
    .order("sent_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

export async function sendMessage(
  barterId: string,
  senderId: string,
  content: string
) {
  const { error } = await supabase.from("messages").insert([
    {
      barter_id: barterId,
      sender_id: senderId,
      content,
      sent_at: new Date().toISOString(),
    },
  ]);

  return !error;
}
