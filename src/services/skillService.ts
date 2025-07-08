// src/services/skillService.ts
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";

export async function getSkills(userId: string): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching skills:", error.message);
    return [];
  }

  return data;
}

export async function addSkill(
  skill: Omit<Skill, "id" | "created_at">
): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .insert([skill])
    .select()
    .single(); // returns exactly one row

  if (error) throw error;

  return data;
}

export async function deleteSkill(skillId: string) {
  const { error } = await supabase.from("skills").delete().eq("id", skillId);
  if (error) throw error;
}

// src/services/skillService.ts
export async function updateSkill(skill: Skill) {
  const { data, error } = await supabase
    .from("skills")
    .update({
      title: skill.title,
      description: skill.description,
      type: skill.type,
    })
    .eq("id", skill.id)
    .select()
    .single(); // Ensures it returns just the updated skill

  if (error) throw error;
  return data;
}

export async function getAllSkillsExceptMine(currentUserId: string) {
  const { data, error } = await supabase
    .from("skills")
    .select("*, users(username, avatar_url)")
    .neq("user_id", currentUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }

  return data;
}
