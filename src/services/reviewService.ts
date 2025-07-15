// services/reviewService.ts
import { supabase } from "@/lib/supabase";
import { Review } from "@/types";

export async function getReviewsByBarterId(
  barterId: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, reviewer:reviewer_id(username, avatar_url)")
    .eq("barter_id", barterId);

  if (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }

  return data as Review[];
}

// reviewService.ts
export async function submitReview(
  barterId: string,
  userId: string,
  rating: number,
  comment: string
) {
  const { error } = await supabase.from("reviews").insert([
    {
      barter_id: barterId,
      reviewer_id: userId,
      rating,
      comment,
    },
  ]);

  return { error };
}
