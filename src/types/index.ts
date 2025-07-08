export interface Skill {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: "OFFER" | "REQUEST"; // Must match Supabase enum
  created_at: string;
}

export type BarterStatus = "pending" | "in_progress" | "completed" | "declined";

export interface Barter {
  id: string;
  sender_id: string;
  receiver_id: string;
  requested_skill_id: string;
  offered_skill_id: string | null;
  status: BarterStatus;
  message: string;
  created_at: string;
  updated_at: string;
  // Optional populated fields
  requested_skill?: Skill;
  offered_skill?: Skill;
  sender?: { username: string; avatar_url: string };
  receiver?: { username: string; avatar_url: string };
}
