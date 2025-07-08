// hooks/useSkills.ts
import { useEffect, useState } from "react";
import { getAllSkillsExceptMine, getSkills } from "@/services/skillService";
import { Skill } from "@/types";

export function useSkills(userId?: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    getSkills(userId)
      .then(setSkills)
      .finally(() => setLoading(false));
  }, [userId]);

  return { skills, setSkills, loading };
}

export function useFeedSkills(currentUserId: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    getAllSkillsExceptMine(currentUserId)
      .then(setSkills)
      .finally(() => setLoading(false));
  }, [currentUserId]);

  return { skills, loading };
}
