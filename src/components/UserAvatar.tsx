interface Props {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

export default function UserAvatar({
  src,
  alt = "avatar",
  size = "md",
}: Props) {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt}
      className={`rounded-full object-cover ${sizeMap[size]}`}
    />
  );
}
