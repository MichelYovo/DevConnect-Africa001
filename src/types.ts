export interface Profile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  skills: string[];
  location: string; // Togo cities: Lomé, Kara, etc.
  github: string;
  linkedin: string;
  email: string;
  isDemo?: boolean;
  isAdmin?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // List of user IDs who liked
  techStackIdeal?: string;
  pitchDeck?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  venue: string;
  organizer: string;
  organizerId: string;
  attendees: string[]; // List of user IDs attending
}

export type Language = "FR" | "EN";
export type Theme = "light" | "dark" | "system";

export type ViewType = 
  | "landing" 
  | "login" 
  | "register" 
  | "dashboard" 
  | "projects" 
  | "events" 
  | "profile" 
  | "settings" 
  | "admin"
  | "supabase-sql";

export const getFlagForLocation = (loc: string): string => {
  if (!loc) return "";
  const lower = loc.toLowerCase();
  
  if (
    loc.includes("🇹🇬") || 
    loc.includes("🇸🇳") || 
    loc.includes("🇨🇮") || 
    loc.includes("🇳🇬") || 
    loc.includes("🇰🇪") || 
    loc.includes("🇬🇭") || 
    loc.includes("🇧🇯") || 
    loc.includes("🇨🇲") || 
    loc.includes("🇿🇦") || 
    loc.includes("🇷🇼")
  ) {
    return "";
  }

  if (lower.includes("togo")) return " 🇹🇬";
  if (lower.includes("sénégal") || lower.includes("senegal")) return " 🇸🇳";
  if (lower.includes("côte d'ivoire") || lower.includes("ivoire") || lower.includes("ivory")) return " 🇨🇮";
  if (lower.includes("nigéria") || lower.includes("nigeria")) return " 🇳🇬";
  if (lower.includes("kenya")) return " 🇰🇪";
  if (lower.includes("ghana")) return " 🇬🇭";
  if (lower.includes("bénin") || lower.includes("benin")) return " 🇧🇯";
  if (lower.includes("cameroun") || lower.includes("cameroon")) return " 🇨🇲";
  if (lower.includes("afrique du sud") || lower.includes("south africa")) return " 🇿🇦";
  if (lower.includes("rwanda")) return " 🇷🇼";
  return "";
};

