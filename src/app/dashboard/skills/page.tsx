"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSkills } from "@/hooks/useSkills";
import SkillCard from "@/components/SkillCard";
import { addSkill, deleteSkill, updateSkill } from "@/services/skillService";
import toast from "react-hot-toast";
import type { Skill } from "@/types"; // ✅ FIXED

export default function SkillsPage() {
  const { user, loading: userLoading } = useUser();
  const { skills, setSkills, loading: skillsLoading } = useSkills(user?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"OFFER" | "REQUEST">("OFFER");
  const [adding, setAdding] = useState(false);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-semibold">
          You must be signed in to manage skills.
        </p>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");

    const newSkill = {
      user_id: user.id,
      title,
      description,
      type,
    };

    try {
      setAdding(true);
      const createdSkill = await addSkill(newSkill);
      const skillData = Array.isArray(createdSkill)
        ? createdSkill[0]
        : createdSkill;
      setSkills((prev) => [skillData, ...prev]);
      setTitle("");
      setDescription("");
      setType("OFFER");
      toast.success("Skill added successfully.");
    } catch (error: any) {
      console.error("Error adding skill:", error);

      if (error.code === "23505") {
        toast.error("You’ve already added this skill.");
      } else {
        toast.error(error.message || "Failed to add skill.");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted.");
    } catch (error) {
      toast.error("Failed to delete skill.");
    }
  };

  const handleUpdate = async (updatedSkill: Skill) => {
    try {
      const newSkill = await updateSkill(updatedSkill);
      setSkills((prev) =>
        prev.map((s) => (s.id === newSkill.id ? newSkill : s))
      );
      toast.success("Skill updated.");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update skill.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">My Skills</h2>

      <form
        onSubmit={handleAdd}
        className="space-y-4 bg-white p-6 rounded-lg shadow border border-gray-200"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Skill title"
          className="w-full border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description (optional)"
          className="w-full border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "OFFER" | "REQUEST")}
          className="w-full border p-3 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="OFFER">Offering</option>
          <option value="REQUEST">Requesting</option>
        </select>
        <button
          type="submit"
          disabled={adding}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add Skill"}
        </button>
      </form>

      {skillsLoading ? (
        <p className="text-center text-gray-600">Loading skills...</p>
      ) : skills.length === 0 ? (
        <p className="text-center text-gray-600">
          No skills yet. Add your first!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onDelete={handleDelete}
              onUpdate={handleUpdate} // ✅ FIXED: Using reusable update function
            />
          ))}
        </div>
      )}
    </div>
  );
}
