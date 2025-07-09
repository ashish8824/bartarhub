import React from "react";

type Props = {
  src?: string | null;
  alt?: string | null;
  size?: number;
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
}

export default function UserAvatar({ src, alt, size = 32 }: Props) {
  const initials = getInitials(alt);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "User Avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover border border-gray-300"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold border border-gray-300"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={alt || "User"}
    >
      {initials || "?"}
    </div>
  );
}
