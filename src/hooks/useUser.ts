"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ExtendedUser {
  id: string;
  email: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message);
        setLoading(false);
        return;
      }

      setUser(profile);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}
