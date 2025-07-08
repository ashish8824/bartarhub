import { Skill } from "@/types";
import { useEffect, useRef, useState } from "react";
import { createBarterRequest } from "@/services/barterService";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  skill: Skill | null;
  currentUserId: string;
};

export default function RequestBarterModal({
  open,
  onClose,
  skill,
  currentUserId,
}: Props) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSendRequest = async () => {
    if (!skill || !message.trim()) return;

    const success = await createBarterRequest(
      skill.id,
      message.trim(),
      currentUserId,
      skill.user_id
    );

    if (success) {
      toast.success("Your barter request has been sent!");
      onClose();
      setMessage("");
    } else {
      toast.error("Failed to send request");
    }
  };

  // Auto-focus textarea on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Close on click outside or Esc key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const receiverName = skill?.profiles?.name || "them";

  return (
    <AnimatePresence>
      {open && skill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4"
          >
            <h3 className="text-lg font-bold text-indigo-700">
              Request Barter
            </h3>
            <p className="text-sm text-gray-700">
              What do you want to say to <strong>{receiverName}</strong>?
            </p>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 text-sm"
              placeholder="Write your message here..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!message.trim()}
                className={`px-4 py-1 text-sm rounded ${
                  message.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-200 text-white cursor-not-allowed"
                }`}
              >
                Send Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
