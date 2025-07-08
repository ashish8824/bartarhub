import { supabase } from "@/lib/supabase";

export async function createBarterRequest(
  requestedSkillId: string,
  message: string,
  senderId: string,
  receiverId: string
) {
  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    requested_skill_id: requestedSkillId,
    message,
  };

  console.log("🔍 Inserting barter request payload:", payload);

  const { data, error } = await supabase
    .from("barters")
    .insert([payload])
    .select();

  if (error) {
    console.error(
      "❌ Error sending barter request:",
      error.message,
      error.details,
      error
    );
    return null;
  }

  console.log("✅ Barter request sent successfully:", data);
  return data;
}

export async function getInboxBarters(userId: string) {
  const { data, error } = await supabase
    .from("barters")
    .select(
      `
      *,
      sender_profile:users!barters_sender_id_fkey(username, avatar_url),
      receiver_profile:users!barters_receiver_id_fkey(username, avatar_url)
    `
    )
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inbox barters:", error);
    return [];
  }

  return data;
}

export async function getSentBarters(userId: string) {
  const { data, error } = await supabase
    .from("barters")
    .select(
      `
      *,
      sender_profile:users!barters_sender_id_fkey(username, avatar_url),
      receiver_profile:users!barters_receiver_id_fkey(username, avatar_url)
    `
    )
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sent barters:", error);
    return [];
  }

  return data;
}

// Update barter status
export async function updateBarterStatus(id: string, status: BarterStatus) {
  const { error } = await supabase
    .from("barters")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating barter status:", error);
    return false;
  }

  return true;
}
