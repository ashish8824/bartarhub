"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useChat } from "@/hooks/useChat";
import ChatBubble from "@/components/ChatBubble";
import { sendMessage } from "@/services/messageService";
import { useEffect, useRef, useState } from "react";
import { getBarterById } from "@/services/barterService";
import { Barter } from "@/types";
import BarterDetailCard from "@/components/BarterDetailCard";

export default function BarterChatPage() {
  const { barterId } = useParams();
  const { user } = useUser();
  const { messages, loading: chatLoading } = useChat(barterId as string);
  const [newMessage, setNewMessage] = useState("");
  const [barter, setBarter] = useState<Barter | null>(null);
  const [loadingBarter, setLoadingBarter] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!barterId) return;
    (async () => {
      const data = await getBarterById(barterId as string);
      setBarter(data);
      setLoadingBarter(false);
    })();
  }, [barterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const success = await sendMessage(barterId as string, user!.id, trimmed);
    if (success) {
      setNewMessage("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-[90vh] flex flex-col gap-4">
      {/* Barter summary card */}
      {loadingBarter ? (
        <p className="text-gray-500 text-sm">Loading barter details...</p>
      ) : barter ? (
        <BarterDetailCard barter={barter} />
      ) : (
        <p className="text-red-500 text-sm">Barter not found.</p>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col border rounded bg-white p-4 overflow-hidden">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">Chat</h2>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {chatLoading ? (
            <p className="text-sm text-gray-500">Loading messages...</p>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isSender={msg.sender_id === user?.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <p className="text-xs text-gray-500 mt-2 italic">Typing...</p>
        )}

        {/* Input section */}
        <div className="mt-4 pt-2 border-t">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
              className="flex-1 border rounded p-2 text-sm resize-none"
            />

            {/* Emoji picker placeholder button */}

            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
