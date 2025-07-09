"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { updateUserProfile } from "@/services/profileService";
import { supabase } from "@/lib/supabase";
import { User } from "@/types";
import Image from "next/image";
import toast from "react-hot-toast";

const schema = z.object({
  username: z.string().min(3).max(20),
  bio: z.string().max(160).optional(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export default function EditProfileModal({ open, onClose, user }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      bio: user.bio || "",
    },
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.avatar_url || null
  );
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: any) => {
    let avatar_url = user.avatar_url;

    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/${user.id}-${Date.now()}`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        toast.error("Failed to upload avatar.");
        console.error(error);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(data.path);

      avatar_url = publicUrl;
    }

    const success = await updateUserProfile(user.id, {
      ...values,
      avatar_url,
    });

    console.log("success=========", success);

    if (success) {
      toast.success("Profile updated!");
      onClose();
    } else {
      toast.error("Failed to update profile.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold text-indigo-700">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
            )}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => inputFileRef.current?.click()}
            >
              Change Avatar
            </button>
            <input
              type="file"
              ref={inputFileRef}
              onChange={handleAvatarChange}
              accept="image/*"
              hidden
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              rows={3}
              {...register("bio")}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.bio && (
              <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
