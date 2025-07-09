import { Barter } from "@/types";
import UserAvatar from "./UserAvatar";
import { format } from "date-fns";

type Props = {
  barter: Barter;
};

export default function BarterDetailCard({ barter }: Props) {
  const statusColor = {
    pending: "bg-yellow-200 text-yellow-800",
    in_progress: "bg-blue-200 text-blue-800",
    completed: "bg-green-200 text-green-800",
    declined: "bg-red-200 text-red-800",
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-700">
          Barter Summary
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded capitalize ${
            statusColor[barter.status]
          }`}
        >
          {barter.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <UserAvatar
            src={barter.sender_profile?.avatar_url}
            alt={barter.sender_profile?.username}
          />
          <div>
            <p className="text-sm text-gray-600">Sender</p>
            <p className="text-sm font-medium text-gray-800">
              {barter.sender_profile?.username || "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserAvatar
            src={barter.receiver_profile?.avatar_url}
            alt={barter.receiver_profile?.username}
          />
          <div>
            <p className="text-sm text-gray-600">Receiver</p>
            <p className="text-sm font-medium text-gray-800">
              {barter.receiver_profile?.username || "Unknown"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Requested Skill</p>
          <p className="text-sm font-medium text-gray-800">
            {barter.requested_skill?.title || "N/A"}
          </p>
        </div>

        {barter.offered_skill_id && (
          <div>
            <p className="text-sm text-gray-600">Offered Skill</p>
            <p className="text-sm font-medium text-gray-800">
              {barter.offered_skill?.title || "N/A"}
            </p>
          </div>
        )}

        <div className="col-span-full">
          <p className="text-xs text-gray-500">
            Requested on: {format(new Date(barter.created_at), "PPP p")}
          </p>
        </div>
      </div>
    </div>
  );
}
