import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, Project, Event, Language, Theme, ViewType } from "../types";
import { DEMO_PROFILES, DEMO_PROJECTS, DEMO_EVENTS } from "../data";

interface AppContextProps {
  currentUser: Profile | null;
  profiles: Profile[];
  projects: Project[];
  events: Event[];
  language: Language;
  theme: Theme;
  currentView: ViewType;
  selectedCityFilter: string;
  searchSkillQuery: string;
  togoOnlyFilter: boolean;
  
  // Actions
  setView: (view: ViewType) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setCityFilter: (city: string) => void;
  setSkillQuery: (query: string) => void;
  setTogoOnly: (val: boolean) => void;
  
  // Auth
  login: (email: string, password?: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  loginWithGoogleProfile: (profile: Profile) => void;
  logout: () => void;
  
  // Profile
  updateProfile: (updated: Partial<Profile>) => { success: boolean };
  
  // Projects CRUD
  createProject: (project: Omit<Project, "id" | "authorId" | "authorName" | "authorAvatar" | "createdAt" | "likes" | "likedBy">) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleLikeProject: (id: string) => void;
  
  // Events
  createEvent: (event: Omit<Event, "id" | "organizerId" | "organizer" | "attendees">) => void;
  toggleAttendEvent: (id: string) => void;
  
  // Simulator triggers
  triggerConfetti: () => void;
  toastMessage: { text: string; type: "success" | "error" | "info" } | null;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Persistence Loading
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("dc_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("dc_profiles");
    return saved ? JSON.parse(saved) : DEMO_PROFILES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("dc_projects");
    return saved ? JSON.parse(saved) : DEMO_PROJECTS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("dc_events");
    return saved ? JSON.parse(saved) : DEMO_EVENTS;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("dc_language");
    return (saved as Language) || "FR";
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("dc_theme");
    return (saved as Theme) || "dark"; // Defaulting to an elegant Dark Theme (Vercel-style)
  });

  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");
  const [searchSkillQuery, setSearchSkillQuery] = useState<string>("");
  const [togoOnlyFilter, setTogoOnlyFilter] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("dc_current_user", currentUser ? JSON.stringify(currentUser) : "");
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("dc_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("dc_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("dc_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("dc_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("dc_theme", theme);
    applyTheme(theme);
  }, [theme]);

  // Handle system dark mode changes dynamically
  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else if (t === "light") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      // System
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    }
  };

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  const setView = (view: ViewType) => {
    setCurrentView(view);
    // Smooth scroll back to top of main area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setTheme = (t: Theme) => setThemeState(t);
  const setCityFilter = (city: string) => setSelectedCityFilter(city);
  const setSkillQuery = (query: string) => setSearchSkillQuery(query);
  const setTogoOnly = (val: boolean) => setTogoOnlyFilter(val);

  // Authentication Mock with local storage persistence
  const login = (email: string, password?: string) => {
    // Check if it's one of our demo profiles
    const foundDemo = profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
    if (foundDemo) {
      setCurrentUser(foundDemo);
      showToast(language === "FR" ? `Ravi de vous revoir, ${foundDemo.name} !` : `Welcome back, ${foundDemo.name}!`, "success");
      setView("dashboard");
      return { success: true };
    }
    
    // Check other registered profiles
    const foundUser = profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      if (email.toLowerCase() === "michelame.yovo@gmail.com") {
        foundUser.isAdmin = true;
      }
      setCurrentUser(foundUser);
      showToast(language === "FR" ? `Connexion réussie, ${foundUser.name} !` : `Successfully logged in, ${foundUser.name}!`, "success");
      setView("dashboard");
      return { success: true };
    }

    // Default simulation fallback for ANY email to guarantee seamless UX
    const simpleName = email.split("@")[0];
    const formattedName = simpleName.charAt(0).toUpperCase() + simpleName.slice(1);
    const newSimulatedProfile: Profile = {
      id: `user-${Date.now()}`,
      name: formattedName,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      title: email.toLowerCase() === "michelame.yovo@gmail.com" ? "Administrateur Chef de Projet" : "Full Stack Engineer",
      bio: email.toLowerCase() === "michelame.yovo@gmail.com" ? "Administrateur principal du hub de l'écosystème tech togolais." : "Nouveau membre de la communauté tech togolaise !",
      skills: email.toLowerCase() === "michelame.yovo@gmail.com" ? ["Gouvernance", "Supabase", "React", "Togo Tech Management"] : ["React", "JavaScript", "Tailwind CSS"],
      location: "Lomé",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: email,
      isAdmin: email.toLowerCase() === "michelame.yovo@gmail.com"
    };
    
    setProfiles(prev => [newSimulatedProfile, ...prev]);
    setCurrentUser(newSimulatedProfile);
    showToast(language === "FR" ? `Nouveau profil créé et connecté ! Bienvenue !` : `New profile created and logged in! Welcome!`, "success");
    setView("dashboard");
    return { success: true };
  };

  const registerUser = (name: string, email: string, password?: string) => {
    if (!name || !email) {
      return { success: false, error: "Please provide both name and email" };
    }
    
    // Check duplicate
    if (profiles.some(p => p.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: "Email already exists" };
    }

    const newUser: Profile = {
      id: `user-${Date.now()}`,
      name,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80`,
      title: email.toLowerCase() === "michelame.yovo@gmail.com" ? "Administrateur Chef de Projet" : "Junior Web Developer",
      bio: email.toLowerCase() === "michelame.yovo@gmail.com" ? "Administrateur principal du hub de l'écosystème tech togolais." : "Développeur passionné basé au Togo, désireux d'élargir mes compétences et de collaborer sur de superbes projets.",
      skills: email.toLowerCase() === "michelame.yovo@gmail.com" ? ["Gouvernance", "Supabase", "React"] : ["HTML", "CSS", "JavaScript"],
      location: "Lomé",
      github: "",
      linkedin: "",
      email,
      isAdmin: email.toLowerCase() === "michelame.yovo@gmail.com"
    };

    setProfiles(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(language === "FR" ? `Compte créé avec succès ! Bienvenue à Lomé !` : `Account created successfully! Welcome to Lomé!`, "success");
    setView("dashboard");
    return { success: true };
  };

  const loginWithGoogleProfile = (profile: Profile) => {
    setProfiles(prev => {
      if (prev.some(p => p.email.toLowerCase() === profile.email.toLowerCase())) {
        return prev;
      }
      return [profile, ...prev];
    });
    // Check if they are admin
    if (profile.email.toLowerCase() === "michelame.yovo@gmail.com") {
      profile.isAdmin = true;
    }
    setCurrentUser(profile);
    showToast(
      language === "FR" 
        ? `Bienvenue, ${profile.name} ! Authentifié avec succès via Google API.` 
        : `Welcome, ${profile.name}! Successfully authenticated via Google API.`, 
      "success"
    );
    setView("dashboard");
  };

  const logout = () => {
    setCurrentUser(null);
    showToast(language === "FR" ? "Vous avez été déconnecté." : "You have been logged out.", "info");
    setView("landing");
  };

  // Profile Updating
  const updateProfile = (updated: Partial<Profile>) => {
    if (!currentUser) return { success: false };

    const updatedProfile = { ...currentUser, ...updated };
    setCurrentUser(updatedProfile);

    // Sync back to profiles array
    setProfiles(prev => prev.map(p => p.id === currentUser.id ? updatedProfile : p));
    
    // Sync any user projects names and avatars
    setProjects(prev => prev.map(p => p.authorId === currentUser.id ? {
      ...p,
      authorName: updatedProfile.name,
      authorAvatar: updatedProfile.avatar
    } : p));

    showToast(language === "FR" ? "Profil enregistré !" : "Profile saved successfully!", "success");
    return { success: true };
  };

  // Projects CRUD
  const createProject = (projectData: Omit<Project, "id" | "authorId" | "authorName" | "authorAvatar" | "createdAt" | "likes" | "likedBy">) => {
    if (!currentUser) return;

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    setProjects(prev => [newProject, ...prev]);
    showToast(language === "FR" ? "Projet partagé avec succès !" : "Project published successfully!", "success");
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } as Project : p));
    showToast(language === "FR" ? "Projet modifié avec succès !" : "Project updated successfully!", "success");
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast(language === "FR" ? "Projet supprimé !" : "Project deleted!", "info");
  };

  const toggleLikeProject = (id: string) => {
    if (!currentUser) {
      showToast(language === "FR" ? "Veuillez vous connecter pour aimer un projet." : "Please log in to like a project.", "error");
      return;
    }

    setProjects(prev => prev.map(proj => {
      if (proj.id !== id) return proj;

      const alreadyLiked = proj.likedBy.includes(currentUser.id);
      let newLikedBy = [];
      if (alreadyLiked) {
        newLikedBy = proj.likedBy.filter(uid => uid !== currentUser.id);
      } else {
        newLikedBy = [...proj.likedBy, currentUser.id];
      }

      return {
        ...proj,
        likedBy: newLikedBy,
        likes: newLikedBy.length
      };
    }));
  };

  // Events attending
  const createEvent = (eventData: Omit<Event, "id" | "organizerId" | "organizer" | "attendees">) => {
    if (!currentUser) return;

    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      organizer: currentUser.name,
      organizerId: currentUser.id,
      attendees: [currentUser.id]
    };

    setEvents(prev => [newEvent, ...prev]);
    showToast(language === "FR" ? "Événement programmé avec succès !" : "Event scheduled successfully!", "success");
  };

  const toggleAttendEvent = (id: string) => {
    if (!currentUser) {
      showToast(language === "FR" ? "Veuillez vous connecter pour participer." : "Please log in to participate.", "error");
      return;
    }

    setEvents(prev => prev.map(evt => {
      if (evt.id !== id) return evt;

      const attending = evt.attendees.includes(currentUser.id);
      let newAttendees = [];
      if (attending) {
        newAttendees = evt.attendees.filter(uid => uid !== currentUser.id);
        showToast(language === "FR" ? "Votre participation a été annulée." : "Your participation was canceled.", "info");
      } else {
        newAttendees = [...evt.attendees, currentUser.id];
        showToast(language === "FR" ? "Vous êtes inscrit à cet événement !" : "You are registered for this event!", "success");
      }

      return {
        ...evt,
        attendees: newAttendees
      };
    }));
  };

  const triggerConfetti = () => {
    showToast(language === "FR" ? "🎉 Succès communautaire !" : "🎉 Community Success!", "success");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        profiles,
        projects,
        events,
        language,
        theme,
        currentView,
        selectedCityFilter,
        searchSkillQuery,
        togoOnlyFilter,
        setView,
        setLanguage,
        setTheme,
        setCityFilter,
        setSkillQuery,
        setTogoOnly,
        login,
        registerUser,
        loginWithGoogleProfile,
        logout,
        updateProfile,
        createProject,
        updateProject,
        deleteProject,
        toggleLikeProject,
        createEvent,
        toggleAttendEvent,
        triggerConfetti,
        toastMessage,
        showToast,
        clearToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
