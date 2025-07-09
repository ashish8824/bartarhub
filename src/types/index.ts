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
  offered_skill_id: string | null;
  requested_skill_id: string;
  status: "pending" | "in_progress" | "completed" | "declined";
  message: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    username: string;
    avatar_url: string | null;
  };
  receiver_profile?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  barter_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  sender_profile?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  bio: string;
  avatar_url: string;
}
