// components/DeleteAccountModal.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: Props) {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmationText !== "delete") {
      toast.error("Please type 'delete' to confirm");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      setLoading(false);
      return;
    }

    const { error: deleteError } = await supabase.rpc("delete_current_user");
    if (deleteError) {
      toast.error("Failed to delete account");
    } else {
      toast.success("Account deleted");
      router.push("/");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-red-600">Delete Account</h2>
        <p className="text-sm text-gray-700">
          This action is <strong>permanent</strong> and cannot be undone. All
          your data will be deleted.
        </p>
        <p className="text-sm text-gray-600">
          Please type{" "}
          <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
            delete
          </span>{" "}
          to confirm:
        </p>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmationText !== "delete" || loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
