"use client";

import { useUser } from "@/hooks/useUser";
import { useFeedSkills } from "@/hooks/useSkills";
import SkillCard from "@/components/SkillCard";
import RequestBarterModal from "@/components/RequestBarterModal";
import { Skill } from "@/types";
import { useState } from "react";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { skills, loading } = useFeedSkills(user?.id || "");

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleBarterRequest = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleModalClose = () => {
    setSelectedSkill(null);
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Explore Skills</h2>

      {skills.length === 0 ? (
        <p className="text-gray-500">No skills posted by others yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onRequestBarter={handleBarterRequest}
            />
          ))}
        </div>
      )}

      {/* ✅ Request Barter Modal with required props */}
      <RequestBarterModal
        open={!!selectedSkill}
        onClose={handleModalClose}
        skill={selectedSkill}
        currentUserId={user?.id || ""}
      />
    </div>
  );
}
