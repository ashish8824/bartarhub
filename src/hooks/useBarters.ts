import { useEffect, useState } from "react";
import { getInboxBarters, getSentBarters } from "@/services/barterService";
import { Barter } from "@/types";

export function useInboxBarters(userId: string) {
  const [barters, setBarters] = useState<Barter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const data = await getInboxBarters(userId);
      setBarters(data);
      setLoading(false);
    })();
  }, [userId]);

  return { barters, loading };
}

export function useSentBarters(userId: string) {
  const [barters, setBarters] = useState<Barter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const data = await getSentBarters(userId);
      setBarters(data);
      setLoading(false);
    })();
  }, [userId]);

  return { barters, loading };
}
