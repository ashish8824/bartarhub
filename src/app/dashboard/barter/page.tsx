"use client";

import { useUser } from "@/hooks/useUser";
import { useInboxBarters, useSentBarters } from "@/hooks/useBarters";
import { updateBarterStatus } from "@/services/barterService";
import { useState } from "react";
import toast from "react-hot-toast";
import { Barter } from "@/types";
import { useRouter } from "next/navigation";

export default function BarterPage() {
  const { user, loading: userLoading } = useUser();
  const [view, setView] = useState<"inbox" | "sent">("inbox");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "completed" | "declined"
  >("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const router = useRouter();

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

  const allBarters = view === "inbox" ? inboxBarters : sentBarters;
  const isLoading = view === "inbox" ? inboxLoading : sentLoading;

  // Apply status filter
  const filteredBarters =
    statusFilter === "all"
      ? allBarters
      : allBarters.filter((barter) => barter.status === statusFilter);

  // Apply sorting
  const sortedBarters = [...filteredBarters].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedBarters.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedBarters = sortedBarters.slice(startIdx, startIdx + pageSize);

  const handlePageChange = (delta: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), totalPages));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">
        Barter Requests
      </h1>

      {/* Top Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Toggle View */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("inbox")}
            className={`px-4 py-1 rounded ${
              view === "inbox" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setView("sent")}
            className={`px-4 py-1 rounded ${
              view === "sent" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Sent
          </button>
        </div>

        {/* Filter by status */}
        <div>
          <label className="text-sm mr-2">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="text-sm mr-2">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as "asc" | "desc");
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Barter List */}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : paginatedBarters.length === 0 ? (
        <p className="text-gray-500">No {statusFilter} barters found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedBarters.map((barter) => (
            <div
              key={barter.id}
              className="border rounded-lg p-4 bg-white shadow space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>
                      {view === "inbox"
                        ? barter.sender_profile?.username || "Unknown"
                        : barter.receiver_profile?.username || "Unknown"}
                    </strong>{" "}
                    wants to barter
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    "{barter.message}"
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded capitalize ${
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

              <div className="flex gap-2 justify-end pt-2">
                {view === "inbox" && barter.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(barter.id, "in_progress")
                      }
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(barter.id, "declined")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </>
                )}

                {barter?.status === "in_progress" && (
                  <button
                    onClick={() =>
                      router.push(`/dashboard/review/${barter.id}`)
                    }
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mt-4"
                  >
                    Leave a Review
                  </button>
                )}

                {/* View Barter Button (always shown) */}
                <a
                  href={`/dashboard/barter/${barter.id}`}
                  className="bg-indigo-600 text-white px-4 pt-5 rounded text-sm hover:bg-indigo-700 inline-block"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4 items-center">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
