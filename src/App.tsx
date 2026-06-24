import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import LandingView from "./components/LandingView";
import AuthView from "./components/AuthView";
import DashboardView from "./components/DashboardView";
import ProjectsView from "./components/ProjectsView";
import EventsView from "./components/EventsView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import SupabaseSqlView from "./components/SupabaseSqlView";
import AdminView from "./components/AdminView";
import BackgroundGlow from "./components/BackgroundGlow";
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Database,
  ArrowUpRight,
  Shield
} from "lucide-react";

function MainAppContent() {
  const { currentView, setView, toastMessage, clearToast, currentUser, language } = useApp();

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView />;
      case "login":
      case "register":
        return <AuthView />;
      case "dashboard":
        return <DashboardView />;
      case "projects":
        return <ProjectsView />;
      case "events":
        return <EventsView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "admin":
        return <AdminView />;
      case "supabase-sql":
        return <SupabaseSqlView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans transition-all flex flex-col justify-between selection:bg-green-500 selection:text-black relative">
      
      {/* Kora/Gravity premium animated ambient background glows */}
      <BackgroundGlow />

      <div className="space-y-6">
        {/* Navigation Header */}
        <Header />

        {/* Dynamic sub-header navigation path bar (Vercel style) */}
        {currentUser && (
          <div className="border-b border-zinc-200/60 dark:border-white/5 bg-white/60 dark:bg-[#09090b]/40 backdrop-blur-md -mt-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-12 items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  <button 
                    onClick={() => setView("dashboard")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentView === "dashboard" 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold border border-green-500/10" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Tableau de bord
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-800">/</span>
                  <button 
                    onClick={() => setView("profile")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentView === "profile" 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold border border-green-500/10" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Gérer Profil
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-800">/</span>
                  <button 
                    onClick={() => setView("projects")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentView === "projects" 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold border border-green-500/10" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Mes Projets
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-800">/</span>
                  <button 
                    onClick={() => setView("settings")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      currentView === "settings" 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold border border-green-500/10" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Paramètres
                  </button>

                  {currentUser && (currentUser.email === "michelame.yovo@gmail.com" || currentUser.isAdmin) && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-800">/</span>
                      <button 
                        onClick={() => setView("admin")}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          currentView === "admin" 
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold border border-green-500/10" 
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                        }`}
                      >
                        Console Admin
                      </button>
                    </>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                  <MapPin className="h-3 w-3 text-yellow-500 animate-pulse" />
                  <span>Session Togo active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Page Canvas Content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          {renderView()}
        </main>
      </div>

      {/* Modern, high-craft Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-white/5 bg-white dark:bg-[#09090b]/40 py-12 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Left Brand Identity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500 text-black font-extrabold text-[11px]">
                  D
                </div>
                <span className="font-bold tracking-tight text-zinc-900 dark:text-white">
                  DevConnect Togo
                </span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-xs">
                Une plateforme de référence visant à cartographier et connecter les meilleurs talents technologiques au Togo (Lomé, Kara, Kpalimé).
              </p>
            </div>

            {/* Quick Map Location Links */}
            <div className="flex flex-wrap gap-4 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>Lomé Capitale</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Kara Campus</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                <span>Kpalimé Hub</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                <span>Sokodé Code</span>
              </div>
            </div>

            {/* CTA action schema (Admin only) */}
            {currentUser && (currentUser.email === "michelame.yovo@gmail.com" || currentUser.isAdmin) && (
              <div className="flex gap-4 font-semibold">
                <button 
                  onClick={() => setView("admin")}
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Console Administrateur
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            )}

          </div>

          <hr className="border-zinc-200/60 dark:border-white/5" />

          {/* Copy section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono">
            <span>
              &copy; {new Date().getFullYear()} DevConnect Africa. Tous droits réservés.
            </span>
            <div className="flex gap-3">
              <span>Made with 🇹🇬 Excellence</span>
              <span>•</span>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline text-green-600 dark:text-green-400 font-bold"
              >
                Supabase Backed
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Animated Toast Message Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border bg-white dark:bg-zinc-900 p-4 shadow-2xl flex items-start gap-3 border-zinc-200/60 dark:border-white/10 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="mt-0.5 shrink-0">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : toastMessage.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-rose-500" />
            ) : (
              <HelpCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              Notification
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
              {toastMessage.text}
            </p>
          </div>
          <button
            onClick={clearToast}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
