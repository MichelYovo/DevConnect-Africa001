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
