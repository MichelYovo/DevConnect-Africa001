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
import DeveloperProfileModal from "./components/DeveloperProfileModal";
import RecruitmentCart from "./components/RecruitmentCart";
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Database,
  ArrowUpRight,
  Shield,
  Heart
} from "lucide-react";

function MainAppContent() {
  const { currentView, setView, toastMessage, clearToast, currentUser, language } = useApp();

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return currentUser ? <DashboardView /> : <LandingView />;
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
        return currentUser ? <DashboardView /> : <LandingView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans transition-all flex flex-col justify-between selection:bg-green-500 selection:text-black relative">
      
      {/* Kora/Gravity premium animated ambient background glows */}
      <BackgroundGlow />

      <div className="space-y-6">
        {/* Navigation Header */}
        <Header />

        {/* Primary Page Canvas Content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          {renderView()}
        </main>
      </div>

      {/* Profile Details Modal */}
      <DeveloperProfileModal />

      {/* Recruitment Shortlist Cart */}
      <RecruitmentCart />

      {/* Modern, high-craft Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-white/5 bg-white dark:bg-[#09090b]/40 py-12 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Left Brand Identity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0a0a0a] border border-green-500/30 text-green-500 shadow-md">
                  <svg className="h-3.5 w-3.5 stroke-green-500 stroke-[2] fill-none" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" fill="currentColor" />
                    <circle cx="5" cy="12" r="2" fill="currentColor" />
                    <circle cx="19" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="19" r="2" fill="currentColor" />
                    <path d="M12 7v10M7 12h10" />
                  </svg>
                </div>
                <span className="font-bold tracking-tight text-zinc-900 dark:text-white">
                  DevConnect Africa
                </span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-xs">
                Une plateforme panafricaine de référence visant à cartographier et connecter les meilleurs talents technologiques en Afrique (Dakar, Lagos, Nairobi, Kigali, Lomé).
              </p>
            </div>

            {/* Quick Map Location Links */}
            <div className="flex flex-wrap gap-4 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>Dakar Hub</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Nairobi Node</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                <span>Lomé Tech</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                <span>Lagos Core</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                <span>Kigali Valley</span>
              </div>
            </div>

            {/* CTA action schema (Admin only) */}
            {currentUser && currentUser.email === "michelame.yovo@gmail.com" && (
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
              <span className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse shrink-0" />
                <span>Excellence</span>
              </span>
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
