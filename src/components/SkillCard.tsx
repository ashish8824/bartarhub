import { Trash2, Pencil, Handshake } from "lucide-react";
import { Skill } from "@/types";
import { useState } from "react";

type Props = {
  skill: Skill;
  onDelete?: (id: string) => void;
  onUpdate?: (updated: Skill) => void;
  onRequestBarter?: (skill: Skill) => void;
};

export default function SkillCard({
  skill,
  onDelete,
  onUpdate,
  onRequestBarter,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(skill.title);
  const [description, setDescription] = useState(skill.description || "");
  const [type, setType] = useState<"OFFER" | "REQUEST">(skill.type);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = () => {
    const updated = {
      ...skill,
      title,
      description,
      type,
    };
    onUpdate?.(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(skill.id);
    setShowDeleteConfirm(false);
  };

  const isFeed = !onDelete && !onUpdate;

  return (
    <div className="p-4 bg-white border rounded shadow space-y-2 relative">
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "OFFER" | "REQUEST")}
            className="w-full border p-2 rounded text-sm"
          >
            <option value="OFFER">Offering</option>
            <option value="REQUEST">Requesting</option>
          </select>
          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-indigo-500 text-white text-sm rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-indigo-800">
            {skill.title}
          </h3>
          <p className="text-sm text-gray-600">{skill.description}</p>
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              {skill.type}
            </span>
            {skill.profiles?.name && isFeed && (
              <span className="text-xs text-gray-500">
                Posted by <strong>{skill.profiles.name}</strong>
              </span>
            )}
          </div>

          {onRequestBarter && isFeed && (
            <button
              onClick={() => onRequestBarter(skill)}
              className="mt-3 w-full bg-emerald-600 text-white text-sm py-2 rounded hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <Handshake size={16} />
              Request Barter
            </button>
          )}

          {!isFeed && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded shadow-lg text-center space-y-3 w-72">
            <p className="text-sm text-gray-800">
              Are you sure you want to delete <strong>{skill.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
