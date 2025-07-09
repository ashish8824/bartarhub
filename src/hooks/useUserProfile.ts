"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (!error) setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refresh: fetchUser };
}
