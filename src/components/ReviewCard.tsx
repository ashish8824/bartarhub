import { Review } from "@/types";
import UserAvatar from "./UserAvatar";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-2">
        <UserAvatar src={review.reviewer?.avatar_url} size="sm" />

        <div className="flex flex-col">
          <p className="text-sm font-medium">{review.reviewer?.username}</p>
          <div className="text-yellow-500 text-sm">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
          {review.comment && (
            <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(review.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
