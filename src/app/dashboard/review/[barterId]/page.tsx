"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { submitReview } from "@/services/reviewService";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ReviewPage() {
  const { barterId } = useParams();
  const router = useRouter();
  const { user } = useUserProfile();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [barterExists, setBarterExists] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    async function checkBarter() {
      if (!user?.id || !barterId) return;

      const { data, error } = await supabase
        .from("barters")
        .select("*")
        .or(
          `and(id.eq.${barterId},sender_id.eq.${user.id}),and(id.eq.${barterId},receiver_id.eq.${user.id})`
        )
        .single();

      if (!error && data) {
        setBarterExists(true);
      } else {
        console.error("Barter check failed:", error);
        setBarterExists(false);
        router.replace("/dashboard");
      }
    }

    checkBarter();
  }, [user, barterId, router]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);

    const { error } = await submitReview(
      barterId as string,
      user.id,
      rating,
      comment
    );

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  if (barterExists === null) {
    return (
      <div className="text-center text-gray-500 p-6">
        Checking barter access...
      </div>
    );
  }

  if (barterExists === false) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Leave a Review</h1>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment (optional)"
        className="w-full border border-gray-300 rounded p-3 mb-4"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
