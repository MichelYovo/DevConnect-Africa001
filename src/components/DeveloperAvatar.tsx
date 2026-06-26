import React, { useState } from "react";

interface DeveloperAvatarProps {
  name: string;
  avatar?: string;
  sizeClassName?: string;
  status?: boolean;
}

// Generate premium, aesthetic gradient colors based on name hash for unique visual identity
function getGradientForName(name: string) {
  const gradients = [
    "from-emerald-500 to-teal-600 text-emerald-100",
    "from-green-400 to-emerald-600 text-green-100",
    "from-yellow-400 to-orange-500 text-yellow-950",
    "from-green-500 to-yellow-500 text-zinc-900",
    "from-indigo-500 to-purple-600 text-indigo-100",
    "from-blue-500 to-emerald-500 text-blue-100",
    "from-zinc-700 to-zinc-900 text-zinc-100",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function DeveloperAvatar({ name, avatar, sizeClassName = "h-10 w-10 text-xs", status }: DeveloperAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "??";

  const gradientClass = getGradientForName(name || "User");

  return (
    <div className={`relative shrink-0 select-none ${sizeClassName}`}>
      {avatar && !hasError ? (
        <img
          src={avatar}
          alt={name}
          className="h-full w-full rounded-xl object-cover ring-1 ring-zinc-200/50 dark:ring-white/10"
          referrerPolicy="no-referrer"
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        <div className={`h-full w-full rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center font-display font-bold tracking-wider ring-1 ring-zinc-200/50 dark:ring-white/10 shadow-sm shadow-green-500/5`}>
          {initials}
        </div>
      )}
      
      {status && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 ring-1 ring-emerald-500/30 animate-pulse"></span>
      )}
    </div>
  );
}
