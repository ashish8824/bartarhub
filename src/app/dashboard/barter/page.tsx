"use client";

import { useUser } from "@/hooks/useUser";
import { useInboxBarters, useSentBarters } from "@/hooks/useBarters";
import { updateBarterStatus } from "@/services/barterService";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BarterPage() {
  const { user, loading: userLoading } = useUser();
  const [view, setView] = useState<"inbox" | "sent">("inbox");

  const { barters: inboxBarters, loading: inboxLoading } = useInboxBarters(
    user?.id || ""
  );
  const { barters: sentBarters, loading: sentLoading } = useSentBarters(
    user?.id || ""
  );

  const handleStatusChange = async (
    id: string,
    status: "in_progress" | "declined"
  ) => {
    const success = await updateBarterStatus(id, status);
    if (success) {
      toast.success(
        `Barter ${status === "in_progress" ? "accepted" : "declined"}`
      );
    } else {
      toast.error("Failed to update status");
    }
  };

  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading barters...
      </div>
    );
  }

  const currentBarters = view === "inbox" ? inboxBarters : sentBarters;
  const isLoading = view === "inbox" ? inboxLoading : sentLoading;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Barter Requests
      </h1>

      {/* Toggle View */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("inbox")}
          className={`px-4 py-2 rounded ${
            view === "inbox" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setView("sent")}
          className={`px-4 py-2 rounded ${
            view === "sent" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Sent
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : currentBarters.length === 0 ? (
        <p className="text-gray-500">No {view} barters yet.</p>
      ) : (
        <div className="space-y-4">
          {currentBarters.map((barter) => (
            <div
              key={barter.id}
              className="border rounded-lg p-4 bg-white shadow space-y-2"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>
                      {view === "inbox"
                        ? barter.sender_profile?.username || "Unknown Sender"
                        : barter.receiver_profile?.username ||
                          "Unknown Receiver"}
                    </strong>{" "}
                    wants to barter
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    "{barter.message}"
                  </p>
                </div>
                <span
                  className={`inline-block text-xs py-3 px-2 font-semibold rounded capitalize ${
                    barter.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : barter.status === "in_progress"
                      ? "bg-blue-200 text-blue-800"
                      : barter.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {barter.status.replace("_", " ")}
                </span>
              </div>

              {/* Accept/Decline - Only Receiver should see this */}
              {view === "inbox" &&
                barter.status === "pending" &&
                barter.receiver_id === user?.id && (
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() =>
                        handleStatusChange(barter.id, "in_progress")
                      }
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(barter.id, "declined")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}

              {/* If current user is sender, and waiting on receiver */}
              {view === "inbox" &&
                barter.status === "pending" &&
                barter.receiver_id !== user?.id && (
                  <p className="text-xs text-gray-400 italic pt-1">
                    Waiting for the receiver to respond
                  </p>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
