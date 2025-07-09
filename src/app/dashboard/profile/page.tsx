"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import toast from "react-hot-toast";
import clsx from "clsx";
import DeleteAccountModal from "@/components/DeleteAccountModal";

type FormValues = {
  username: string;
  bio: string;
  avatar: FileList;
};

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("view");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (user) {
      setValue("username", user.username || "");
      setValue("bio", user.bio || "");
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user, setValue]);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload avatar");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    let newAvatarUrl = avatarUrl;

    if (data.avatar && data.avatar.length > 0) {
      const file = data.avatar[0];
      const uploadedUrl = await uploadAvatar(file);
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      newAvatarUrl = uploadedUrl;
      setAvatarUrl(uploadedUrl);
    }

    const { error } = await supabase
      .from("users")
      .update({
        username: data.username,
        bio: data.bio,
        avatar_url: newAvatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
      setActiveTab("view");
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      console.error(error);
      toast.error("Failed to delete account");
    } else {
      toast.success("Account deleted");
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
      console.error(error);
      toast.error("Failed to send reset email");
    } else {
      toast.success("Password reset email sent");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="flex gap-4 mb-6">
        {["view", "edit", "password", "delete"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 rounded",
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {tab === "view"
              ? "View Profile"
              : tab === "edit"
              ? "Edit Profile"
              : tab === "password"
              ? "Change Password"
              : "Delete Account"}
          </button>
        ))}
      </div>

      {/* View Profile */}
      {activeTab === "view" && (
        <div className="space-y-4 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full" />
            )}
          </div>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-xl font-semibold">{user?.username}</p>
          <p className="text-gray-500">{user?.bio}</p>
        </div>
      )}

      {/* Edit Profile */}
      {activeTab === "edit" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 shadow rounded"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              {...register("username", { required: true, minLength: 3 })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-sm text-red-500">Username is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              {...register("bio")}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("view")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Change Password */}
      {activeTab === "password" && (
        <div className="bg-white p-6 shadow rounded space-y-4">
          <p>
            We'll send you an email with instructions to reset your password.
          </p>
          <button
            onClick={handlePasswordReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Reset Email
          </button>
        </div>
      )}

      {/* Delete Account */}
      {activeTab === "delete" && (
        <div className="bg-white p-6 shadow rounded space-y-4">
          <p className="text-red-600 font-medium">
            Warning: This action is irreversible.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Account
          </button>

          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          />
        </div>
      )}
    </div>
  );
}
