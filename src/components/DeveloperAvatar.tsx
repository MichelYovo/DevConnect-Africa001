import React, { useState, useEffect } from "react";

interface DeveloperAvatarProps {
  name: string;
  avatar?: string;
  sizeClassName?: string;
  status?: boolean;
}

// Generate premium, aesthetic gradient colors based on name hash for unique visual identity
function getGradientForName(name: string) {
  const gradients = [
    "from-indigo-500 to-blue-600 text-indigo-100",
    "from-violet-500 to-indigo-600 text-violet-100",
    "from-blue-500 to-sky-600 text-blue-100",
    "from-purple-500 to-pink-600 text-purple-100",
    "from-indigo-600 to-violet-700 text-indigo-100",
    "from-slate-600 to-zinc-800 text-zinc-100",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function DeveloperAvatar({ name, avatar, sizeClassName = "h-10 w-10 text-xs", status }: DeveloperAvatarProps) {
  // Try custom avatar, then fallback default local file photo, then initials
  const [imgSrc, setImgSrc] = useState<string>("");
  const [attempt, setAttempt] = useState<"custom" | "normalized" | "fallback" | "failed">("custom");

  const cleanName = name || "User";

  // Strip accents and normalize name for the public/photo folder mapping
  const normalizedFilename = cleanName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  // Pre-configured mappings for specific users to ensure stunning portraits
  const getPreConfiguredAvatar = (nameStr: string): string | null => {
    const lower = nameStr.toLowerCase().trim();
    if (lower === "yaovi amegadjie") {
      return "/photo/chinedu_okafor.jpg";
    }
    if (lower === "tété ayayi" || lower === "tete ayayi") {
      return "/photo/mwangi_mwangi.jpg";
    }
    return null;
  };

  useEffect(() => {
    const preConfigured = getPreConfiguredAvatar(cleanName);
    if (avatar) {
      setImgSrc(avatar);
      setAttempt("custom");
    } else if (preConfigured) {
      setImgSrc(preConfigured);
      setAttempt("fallback");
    } else {
      setImgSrc(`/photo/${normalizedFilename}.jpg`);
      setAttempt("normalized");
    }
  }, [avatar, cleanName, normalizedFilename]);

  const handleError = () => {
    const preConfigured = getPreConfiguredAvatar(cleanName);
    if (attempt === "custom") {
      if (preConfigured) {
        setImgSrc(preConfigured);
        setAttempt("fallback");
      } else {
        setImgSrc(`/photo/${normalizedFilename}.jpg`);
        setAttempt("normalized");
      }
    } else if (attempt === "normalized") {
      if (preConfigured) {
        setImgSrc(preConfigured);
        setAttempt("fallback");
      } else {
        setAttempt("failed");
      }
    } else {
      setAttempt("failed");
    }
  };

  const initials = cleanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradientClass = getGradientForName(cleanName);

  return (
    <div className={`relative shrink-0 select-none ${sizeClassName}`}>
      {imgSrc && attempt !== "failed" ? (
        <img
          src={imgSrc}
          alt={cleanName}
          className="h-full w-full rounded-xl object-cover ring-1 ring-zinc-200/50 dark:ring-white/10"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        <div className={`h-full w-full rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center font-display font-bold tracking-wider ring-1 ring-zinc-200/50 dark:ring-white/10 shadow-sm shadow-indigo-500/5`}>
          {initials}
        </div>
      )}
      
      {status && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 ring-1 ring-emerald-500/30 animate-pulse"></span>
      )}
    </div>
  );
}
