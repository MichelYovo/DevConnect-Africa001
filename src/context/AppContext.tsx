import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, Project, Event, Language, Theme, ViewType } from "../types";
import { DEMO_PROFILES, DEMO_PROJECTS, DEMO_EVENTS } from "../data";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs, 
  writeBatch 
} from "firebase/firestore";

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
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password?: string, location?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleProfile: (profile: Profile) => Promise<void>;
  logout: () => void;
  
  // Profile
  updateProfile: (updated: Partial<Profile>) => Promise<{ success: boolean }>;
  
  // Projects CRUD
  createProject: (project: Omit<Project, "id" | "authorId" | "authorName" | "authorAvatar" | "createdAt" | "likes" | "likedBy">) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleLikeProject: (id: string) => Promise<void>;
  
  // Events
  createEvent: (event: Omit<Event, "id" | "organizerId" | "organizer" | "attendees">) => Promise<void>;
  toggleAttendEvent: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Profiles Management
  addProfile: (profile: Profile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  toggleAdminStatus: (id: string, isNowAdmin: boolean) => Promise<void>;
  
  // Simulator triggers
  triggerConfetti: () => void;
  toastMessage: { text: string; type: "success" | "error" | "info" } | null;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Local persistence for session, language, theme
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("dc_current_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
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
    return (saved as Theme) || "dark";
  });

  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");
  const [searchSkillQuery, setSearchSkillQuery] = useState<string>("");
  const [togoOnlyFilter, setTogoOnlyFilter] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Sync basic settings to localStorage
  useEffect(() => {
    localStorage.setItem("dc_current_user", currentUser ? JSON.stringify(currentUser) : "");
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("dc_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("dc_theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  // Seeding helper to populate blank Firestore databases
  const seedDatabase = async () => {
    try {
      console.log("Seeding database...");
      const batch = writeBatch(db);
      
      DEMO_PROFILES.forEach((profile) => {
        const isAdmin = profile.email.toLowerCase() === "michelame.yovo@gmail.com";
        const password = isAdmin ? "DevConnectAdmin2026" : "devconnect123";
        const docRef = doc(db, "profiles", profile.id);
        batch.set(docRef, {
          ...profile,
          isAdmin,
          password
        });
      });
      
      DEMO_PROJECTS.forEach((project) => {
        const docRef = doc(db, "projects", project.id);
        batch.set(docRef, project);
      });

      DEMO_EVENTS.forEach((evt) => {
        const docRef = doc(db, "events", evt.id);
        batch.set(docRef, evt);
      });

      await batch.commit();
      console.log("Database seeded successfully!");
    } catch (err) {
      console.error("Error seeding Firestore database:", err);
      handleFirestoreError(err, OperationType.WRITE, "seed-batch");
    }
  };

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    // 1. Subscribe to profiles collection
    const unsubscribeProfiles = onSnapshot(collection(db, "profiles"), (snapshot) => {
      const list: Profile[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Profile);
      });
      
      if (list.length === 0) {
        seedDatabase();
      } else {
        setProfiles(list);
        localStorage.setItem("dc_profiles", JSON.stringify(list));
        
        // Update local session details in case profile was updated elsewhere
        if (currentUser) {
          const freshUser = list.find(p => p.id === currentUser.id);
          if (freshUser) {
            setCurrentUser(freshUser);
          }
        }
      }
    }, (error) => {
      console.error("Profiles subscription error:", error);
      handleFirestoreError(error, OperationType.GET, "profiles");
    });

    // 2. Subscribe to projects collection
    const unsubscribeProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const list: Project[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Project);
      });
      
      // Sort projects by creation date descending
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setProjects(list);
      localStorage.setItem("dc_projects", JSON.stringify(list));
    }, (error) => {
      console.error("Projects subscription error:", error);
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    // 3. Subscribe to events collection
    const unsubscribeEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const list: Event[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Event);
      });
      
      setEvents(list);
      localStorage.setItem("dc_events", JSON.stringify(list));
    }, (error) => {
      console.error("Events subscription error:", error);
      handleFirestoreError(error, OperationType.GET, "events");
    });

    return () => {
      unsubscribeProfiles();
      unsubscribeProjects();
      unsubscribeEvents();
    };
  }, [currentUser?.id]);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark" || t === "system") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else if (t === "light") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setTheme = (t: Theme) => setThemeState(t);
  const setCityFilter = (city: string) => setSelectedCityFilter(city);
  const setSkillQuery = (query: string) => setSearchSkillQuery(query);
  const setTogoOnly = (val: boolean) => setTogoOnlyFilter(val);

  // Firestore persistent authentication
  const login = async (emailStr: string, passwordStr?: string) => {
    const trimmedEmail = emailStr.trim().toLowerCase();
    const enteredPassword = passwordStr || "";
    const isAdminEmail = trimmedEmail === "michelame.yovo@gmail.com";

    // Enforce secure unique administrator password
    if (isAdminEmail) {
      if (enteredPassword !== "DevConnectAdmin2026") {
        return { 
          success: false, 
          error: language === "FR" 
            ? "Mot de passe administrateur incorrect." 
            : "Incorrect administrator password." 
        };
      }
    }

    // Lookup profile in loaded profiles
    let foundProfile = profiles.find(p => p.email.toLowerCase() === trimmedEmail);

    if (foundProfile) {
      const storedPassword = (foundProfile as any).password || "";
      if (storedPassword && enteredPassword !== storedPassword && !isAdminEmail) {
        return { 
          success: false, 
          error: language === "FR" 
            ? "Mot de passe incorrect." 
            : "Incorrect password." 
        };
      }

      // Automatically upgrade admin flag in Firestore if not yet set
      if (isAdminEmail && !foundProfile.isAdmin) {
        foundProfile.isAdmin = true;
        await setDoc(doc(db, "profiles", foundProfile.id), { ...foundProfile, isAdmin: true, password: "DevConnectAdmin2026" }, { merge: true });
      }

      setCurrentUser(foundProfile);
      showToast(
        language === "FR" 
          ? `Ravi de vous revoir, ${foundProfile.name} !` 
          : `Welcome back, ${foundProfile.name}!`, 
        "success"
      );
      setView("dashboard");
      return { success: true };
    }

    // Auto-registration fallback for easy UX (registers new user in Firestore)
    const simpleName = trimmedEmail.split("@")[0];
    const formattedName = simpleName.charAt(0).toUpperCase() + simpleName.slice(1);
    
    const newUserProfile: Profile = {
      id: isAdminEmail ? "admin-michel" : `user-${Date.now()}`,
      name: isAdminEmail ? "Michel Ame Yovo (Admin)" : formattedName,
      avatar: "",
      title: isAdminEmail ? "Administrateur Chef de Projet" : "Full Stack Engineer",
      bio: isAdminEmail 
        ? "Administrateur principal du hub de l'écosystème tech africain." 
        : "Nouveau membre de la communauté tech africaine !",
      skills: isAdminEmail 
        ? ["Gouvernance", "React", "Africa Tech Management", "Firebase"] 
        : ["React", "JavaScript", "Tailwind CSS"],
      location: "Lomé, Togo",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: trimmedEmail,
      isAdmin: isAdminEmail
    };

    try {
      await setDoc(doc(db, "profiles", newUserProfile.id), {
        ...newUserProfile,
        password: isAdminEmail ? "DevConnectAdmin2026" : (enteredPassword || "devconnect123")
      });
      
      setCurrentUser(newUserProfile);
      showToast(
        language === "FR" 
          ? `Nouveau profil créé et connecté ! Bienvenue !` 
          : `New profile created and logged in! Welcome!`, 
        "success"
      );
      setView("dashboard");
      return { success: true };
    } catch (err: any) {
      console.error("Error auto-registering user in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `profiles/${newUserProfile.id}`);
    }
  };

  const registerUser = async (name: string, email: string, password?: string, location?: string) => {
    if (!name || !email) {
      return { success: false, error: "Please provide both name and email" };
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (profiles.some(p => p.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: "Email already exists" };
    }

    const defaultLoc = location || "Dakar, Sénégal";
    const isAdminEmail = trimmedEmail === "michelame.yovo@gmail.com";

    const newUser: Profile = {
      id: isAdminEmail ? "admin-michel" : `user-${Date.now()}`,
      name: name.trim(),
      avatar: "",
      title: isAdminEmail ? "Administrateur Chef de Projet" : "Junior Web Developer",
      bio: isAdminEmail 
        ? "Administrateur principal du hub de l'écosystème tech africain." 
        : `Développeur passionné basé à ${defaultLoc}, désireux d'élargir mes compétences et de collaborer sur de superbes projets à travers l'Afrique.`,
      skills: isAdminEmail ? ["Gouvernance", "React", "Firebase"] : ["HTML", "CSS", "JavaScript"],
      location: defaultLoc,
      github: "",
      linkedin: "",
      email: trimmedEmail,
      isAdmin: isAdminEmail
    };

    try {
      await setDoc(doc(db, "profiles", newUser.id), {
        ...newUser,
        password: password || (isAdminEmail ? "DevConnectAdmin2026" : "devconnect123")
      });

      setCurrentUser(newUser);
      showToast(
        language === "FR" 
          ? `Compte créé avec succès ! Bienvenue sur DevConnect Africa !` 
          : `Account created successfully! Welcome to DevConnect Africa!`, 
        "success"
      );
      setView("dashboard");
      return { success: true };
    } catch (err: any) {
      console.error("Error registering user in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `profiles/${newUser.id}`);
    }
  };

  const loginWithGoogleProfile = async (profile: Profile) => {
    const trimmedEmail = profile.email.toLowerCase();
    const existing = profiles.find(p => p.email.toLowerCase() === trimmedEmail);
    const finalProfile = existing ? { ...existing } : profile;
    
    if (finalProfile.email.toLowerCase() === "michelame.yovo@gmail.com") {
      finalProfile.isAdmin = true;
    }

    try {
      await setDoc(doc(db, "profiles", finalProfile.id), {
        ...finalProfile,
        password: finalProfile.isAdmin ? "DevConnectAdmin2026" : "google-oauth"
      }, { merge: true });

      setCurrentUser(finalProfile);
      showToast(
        language === "FR" 
          ? `Bienvenue, ${finalProfile.name} ! Authentifié avec succès.` 
          : `Welcome, ${finalProfile.name}! Successfully authenticated.`, 
        "success"
      );
      setView("dashboard");
    } catch (err) {
      console.error("Error saving Google profile to Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `profiles/${finalProfile.id}`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast(language === "FR" ? "Vous avez été déconnecté." : "You have been logged out.", "info");
    setView("landing");
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    if (!currentUser) return { success: false };

    const updatedProfile = { ...currentUser, ...updated };
    
    try {
      await setDoc(doc(db, "profiles", currentUser.id), updatedProfile, { merge: true });
      setCurrentUser(updatedProfile);

      // Propagate changes to user's projects in real-time
      const userProjects = projects.filter(p => p.authorId === currentUser.id);
      for (const p of userProjects) {
        await updateDoc(doc(db, "projects", p.id), {
          authorName: updatedProfile.name,
          authorAvatar: updatedProfile.avatar
        });
      }

      showToast(language === "FR" ? "Profil enregistré !" : "Profile saved successfully!", "success");
      return { success: true };
    } catch (err) {
      console.error("Error updating profile in Firestore:", err);
      handleFirestoreError(err, OperationType.WRITE, `profiles/${currentUser.id}`);
    }
  };

  const createProject = async (projectData: Omit<Project, "id" | "authorId" | "authorName" | "authorAvatar" | "createdAt" | "likes" | "likedBy">) => {
    if (!currentUser) return;

    const projectId = `proj-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id: projectId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    try {
      await setDoc(doc(db, "projects", projectId), newProject);
      showToast(language === "FR" ? "Projet partagé avec succès !" : "Project published successfully!", "success");
    } catch (err) {
      console.error("Error creating project in Firestore:", err);
      handleFirestoreError(err, OperationType.CREATE, `projects/${projectId}`);
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    try {
      await updateDoc(doc(db, "projects", id), updated);
      showToast(language === "FR" ? "Projet modifié avec succès !" : "Project updated successfully!", "success");
    } catch (err) {
      console.error("Error updating project in Firestore:", err);
      handleFirestoreError(err, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      showToast(language === "FR" ? "Projet supprimé !" : "Project deleted!", "info");
    } catch (err) {
      console.error("Error deleting project from Firestore:", err);
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  const toggleLikeProject = async (id: string) => {
    if (!currentUser) {
      showToast(language === "FR" ? "Veuillez vous connecter pour aimer un projet." : "Please log in to like a project.", "error");
      return;
    }

    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    const alreadyLiked = proj.likedBy.includes(currentUser.id);
    let newLikedBy = [];
    if (alreadyLiked) {
      newLikedBy = proj.likedBy.filter(uid => uid !== currentUser.id);
    } else {
      newLikedBy = [...proj.likedBy, currentUser.id];
    }

    try {
      await updateDoc(doc(db, "projects", id), {
        likedBy: newLikedBy,
        likes: newLikedBy.length
      });
    } catch (err) {
      console.error("Error liking project in Firestore:", err);
      handleFirestoreError(err, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const createEvent = async (eventData: Omit<Event, "id" | "organizerId" | "organizer" | "attendees">) => {
    if (!currentUser) return;

    const eventId = `evt-${Date.now()}`;
    const newEvent: Event = {
      ...eventData,
      id: eventId,
      organizer: currentUser.name,
      organizerId: currentUser.id,
      attendees: [currentUser.id]
    };

    try {
      await setDoc(doc(db, "events", eventId), newEvent);
      showToast(language === "FR" ? "Événement programmé avec succès !" : "Event scheduled successfully!", "success");
    } catch (err) {
      console.error("Error creating event in Firestore:", err);
      handleFirestoreError(err, OperationType.CREATE, `events/${eventId}`);
    }
  };

  const toggleAttendEvent = async (id: string) => {
    if (!currentUser) {
      showToast(language === "FR" ? "Veuillez vous connecter pour participer." : "Please log in to participate.", "error");
      return;
    }

    const evt = events.find(e => e.id === id);
    if (!evt) return;

    const attending = evt.attendees.includes(currentUser.id);
    let newAttendees = [];
    if (attending) {
      newAttendees = evt.attendees.filter(uid => uid !== currentUser.id);
      showToast(language === "FR" ? "Votre participation a été annulée." : "Your participation was canceled.", "info");
    } else {
      newAttendees = [...evt.attendees, currentUser.id];
      showToast(language === "FR" ? "Vous êtes inscrit à cet événement !" : "You are registered for this event!", "success");
    }

    try {
      await updateDoc(doc(db, "events", id), {
        attendees: newAttendees
      });
    } catch (err) {
      console.error("Error updating event attendees in Firestore:", err);
      handleFirestoreError(err, OperationType.UPDATE, `events/${id}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      showToast(language === "FR" ? "Événement supprimé !" : "Event deleted!", "info");
    } catch (err) {
      console.error("Error deleting event from Firestore:", err);
      handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
    }
  };

  const addProfile = async (profile: Profile) => {
    try {
      await setDoc(doc(db, "profiles", profile.id), {
        ...profile,
        password: profile.isAdmin ? "DevConnectAdmin2026" : "devconnect123"
      });
      showToast(language === "FR" ? "Profil de développeur ajouté !" : "Developer profile added!", "success");
    } catch (err) {
      console.error("Error adding profile to Firestore:", err);
      handleFirestoreError(err, OperationType.CREATE, `profiles/${profile.id}`);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await deleteDoc(doc(db, "profiles", id));
      showToast(language === "FR" ? "Profil supprimé de la base !" : "Profile deleted from database!", "info");
    } catch (err) {
      console.error("Error deleting profile from Firestore:", err);
      handleFirestoreError(err, OperationType.DELETE, `profiles/${id}`);
    }
  };

  const toggleAdminStatus = async (id: string, isNowAdmin: boolean) => {
    try {
      await updateDoc(doc(db, "profiles", id), {
        isAdmin: isNowAdmin,
        password: isNowAdmin ? "DevConnectAdmin2026" : "devconnect123"
      });
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...currentUser, isAdmin: isNowAdmin };
        setCurrentUser(updatedUser);
        localStorage.setItem("dc_current_user", JSON.stringify(updatedUser));
      }
      showToast(
        language === "FR"
          ? `Rôle mis à jour avec succès !`
          : `Role updated successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error updating admin role in Firestore:", err);
      handleFirestoreError(err, OperationType.UPDATE, `profiles/${id}`);
    }
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
        deleteEvent,
        addProfile,
        deleteProfile,
        toggleAdminStatus,
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
