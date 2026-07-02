import React from "react";

export type Icons8Name = 
  | "google"
  | "github"
  | "linkedin"
  | "group"
  | "shield"
  | "mail"
  | "code"
  | "calendar"
  | "heart"
  | "marker"
  | "award"
  | "compass"
  | "search"
  | "settings"
  | "database"
  | "cpu"
  | "briefcase"
  | "chat"
  | "fire"
  | "ok";

interface Icons8Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: Icons8Name;
  className?: string;
}

const iconsMap: Record<Icons8Name, string> = {
  google: "https://img.icons8.com/color/48/google-logo.png",
  github: "https://img.icons8.com/fluency/48/github.png",
  linkedin: "https://img.icons8.com/color/48/linkedin.png",
  group: "https://img.icons8.com/fluency/48/group.png",
  shield: "https://img.icons8.com/fluency/48/shield.png",
  mail: "https://img.icons8.com/fluency/48/new-post.png",
  code: "https://img.icons8.com/fluency/48/code.png",
  calendar: "https://img.icons8.com/fluency/48/calendar.png",
  heart: "https://img.icons8.com/fluency/48/hearts.png",
  marker: "https://img.icons8.com/fluency/48/marker.png",
  award: "https://img.icons8.com/fluency/48/medal-first-place.png",
  compass: "https://img.icons8.com/fluency/48/compass.png",
  search: "https://img.icons8.com/fluency/48/search.png",
  settings: "https://img.icons8.com/fluency/48/settings.png",
  database: "https://img.icons8.com/fluency/48/database.png",
  cpu: "https://img.icons8.com/fluency/48/cpu.png",
  briefcase: "https://img.icons8.com/fluency/48/briefcase.png",
  chat: "https://img.icons8.com/fluency/48/comments.png",
  fire: "https://img.icons8.com/fluency/48/fire.png",
  ok: "https://img.icons8.com/fluency/48/ok.png",
};

export default function Icons8Image({ name, className = "h-5 w-5", ...props }: Icons8Props) {
  return (
    <img
      src={iconsMap[name]}
      alt={name}
      className={`${className} object-contain shrink-0`}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
