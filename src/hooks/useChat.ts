import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types";

export function useChat(barterId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barterId) return;

    // Initial fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("barter_id", barterId)
        .order("sent_at", { ascending: true });

      if (error) {
        console.error("Failed to load messages:", error);
      } else {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`messages-${barterId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `barter_id=eq.${barterId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [barterId]);

  return { messages, loading };
}
