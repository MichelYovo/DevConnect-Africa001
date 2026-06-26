import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import DeveloperAvatar from "./DeveloperAvatar";
import { 
  Globe, 
  Sun, 
  Moon, 
  Laptop, 
  LogOut, 
  Menu, 
  X, 
  MapPin, 
  Terminal, 
  Github, 
  Linkedin,
  Database,
  Shield
} from "lucide-react";

export default function Header() {
  const { 
    currentUser, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    currentView, 
    setView, 
    logout 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    const parts = fullName.split(/[\s\._,]+/);
    if (parts.length > 0) {
      const first = parts[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    return fullName;
  };

  return (
    <header className="sticky top-4 z-50 max-w-[90rem] mx-auto px-4 w-full">
      {/* Floating Header Card with 32px rounded border, backdrop blur, and dual glow */}
      <div className="relative rounded-[32px] border border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-black/75 backdrop-blur-xl shadow-xl shadow-zinc-100/10 dark:shadow-black/40 overflow-hidden px-5 sm:px-8 py-3.5 sm:py-4">
        
        {/* Abstract subtle color flare behind the header inside its boundaries */}
        <div className="absolute top-0 right-1/4 h-16 w-32 bg-green-500/5 dark:bg-green-500/10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 h-12 w-24 bg-yellow-500/5 dark:bg-yellow-500/5 blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("landing")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a0a0a] dark:bg-[#000000] border border-green-500/30 text-green-500 shadow-md shadow-green-500/15 relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {/* Elegant dynamic connecting dots node logo */}
              <svg className="h-5 w-5 stroke-green-500 stroke-[2] fill-none" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" fill="currentColor" />
                <circle cx="5" cy="12" r="2" fill="currentColor" />
                <circle cx="19" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="19" r="2" fill="currentColor" />
                <path d="M12 7v10M7 12h10M8.5 8.5l7 7M15.5 8.5l-7 7" strokeDasharray="1 1" />
              </svg>
            </div>
            <div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans flex items-center gap-1">
                DevConnect <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-black">Africa</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <>
                <button 
                  onClick={() => setView("dashboard")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "dashboard" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  Tableau de bord
                </button>
 
                <button 
                  onClick={() => setView("profile")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "profile" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  Gérer Profil
                </button>
 
                <button 
                  onClick={() => setView("projects")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "projects" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  Mes Projets
                </button>
 
                <button 
                  onClick={() => setView("events")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "events" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {getTranslation(language, "events")}
                </button>
 
                <button 
                  onClick={() => setView("settings")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "settings" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  Paramètres
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setView("landing")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "landing" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  Accueil
                </button>
 
                <button 
                  onClick={() => setView("projects")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "projects" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {getTranslation(language, "projects")}
                </button>
 
                <button 
                  onClick={() => setView("events")}
                  className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                    currentView === "events" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {getTranslation(language, "events")}
                </button>
              </>
            )}
 
            {currentUser && currentUser.email === "michelame.yovo@gmail.com" && (
              <button 
                onClick={() => setView("admin")}
                className={`px-4 py-2 text-xs sm:text-[13px] font-bold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === "admin" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-green-500 animate-pulse" />
                Console Admin
              </button>
            )}
          </nav>

          {/* Right Side Settings & User Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Toggle */}
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 dark:border-white/10 p-0.5 bg-zinc-100/50 dark:bg-[#09090b]">
              <button
                onClick={() => setLanguage("FR")}
                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
                  language === "FR" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-transparent"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
                  language === "EN" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-transparent"
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Picker */}
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 dark:border-white/10 p-0.5 bg-zinc-100/50 dark:bg-[#09090b]">
              <button
                onClick={() => setTheme("light")}
                title={getTranslation(language, "themeLight")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  theme === "light" 
                    ? "bg-green-500/10 text-green-600 border border-green-500/15 shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                title={getTranslation(language, "themeDark")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-green-500/10 text-green-400 border border-green-500/15 shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                title={getTranslation(language, "themeSystem")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  theme === "system" 
                    ? "bg-green-500/10 text-green-500 border border-green-500/15 shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
                }`}
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Authenticated user button or Login */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("dashboard")}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
                    currentView === "dashboard" || currentView === "profile" || currentView === "settings"
                      ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                      : "border-zinc-200 dark:border-white/10"
                  }`}
                >
                  <DeveloperAvatar
                    name={currentUser.name}
                    avatar={currentUser.avatar}
                    sizeClassName="h-6 w-6 text-[9px]"
                  />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {getFirstName(currentUser.name)}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title={getTranslation(language, "logout")}
                  className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("login")}
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                >
                  {getTranslation(language, "login")}
                </button>
                <button
                  onClick={() => setView("register")}
                  className="px-4 py-2 rounded-full bg-green-500 text-black text-xs font-bold hover:bg-green-400 transition-all shadow-sm shadow-green-500/15 cursor-pointer"
                >
                  {getTranslation(language, "register")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 border border-zinc-200/60 dark:border-white/10 bg-white/95 dark:bg-[#030303]/95 backdrop-blur-xl px-4 py-4 space-y-4 rounded-[24px] shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setView("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "dashboard" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Tableau de bord
                </button>
                <button
                  onClick={() => { setView("profile"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "profile" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Gérer Profil
                </button>
                <button
                  onClick={() => { setView("projects"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "projects" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Mes Projets
                </button>
                <button
                  onClick={() => { setView("events"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "events" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {getTranslation(language, "events")}
                </button>
                <button
                  onClick={() => { setView("settings"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "settings" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Paramètres
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setView("landing"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "landing" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Accueil
                </button>
                <button
                  onClick={() => { setView("projects"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "projects" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {getTranslation(language, "projects")}
                </button>
                <button
                  onClick={() => { setView("events"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl border ${
                    currentView === "events" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                      : "border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {getTranslation(language, "events")}
                </button>
              </>
            )}
            {currentUser && currentUser.email === "michelame.yovo@gmail.com" && (
              <button
                onClick={() => { setView("admin"); setMobileMenuOpen(false); }}
                className={`w-full text-left col-span-2 px-3 py-2 text-xs font-bold rounded-xl border ${
                  currentView === "admin" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                    : "border-transparent text-zinc-700 dark:text-zinc-300"
                }`}
              >
                Console Admin
              </button>
            )}
          </div>

          <hr className="border-zinc-200 dark:border-white/5" />

          {/* Mobile Preferences */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Language:</span>
            <div className="flex gap-1 bg-zinc-100 dark:bg-[#09090b] p-0.5 rounded-full border dark:border-white/5">
              <button
                onClick={() => setLanguage("FR")}
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${language === "FR" ? "bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" : "text-zinc-500"}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${language === "EN" ? "bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" : "text-zinc-500"}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Theme:</span>
            <div className="flex gap-1 bg-zinc-100 dark:bg-[#09090b] p-0.5 rounded-full border dark:border-white/5">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full ${theme === "light" ? "bg-green-500/10 text-green-600 shadow-sm" : "text-zinc-400"}`}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full ${theme === "dark" ? "bg-green-500/10 text-green-400 shadow-sm" : "text-zinc-400"}`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full ${theme === "system" ? "bg-green-500/10 text-green-500 shadow-sm" : "text-zinc-400"}`}
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-white/5" />

          {/* User Section in Mobile Drawer */}
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2.5 py-2 bg-zinc-50 dark:bg-[#09090b]/50 rounded-xl border dark:border-white/5">
                <DeveloperAvatar
                  name={currentUser.name}
                  avatar={currentUser.avatar}
                  sizeClassName="h-8 w-8 text-xs"
                />
                <div>
                  <div className="text-sm font-semibold text-zinc-800 dark:text-white">{getFirstName(currentUser.name)}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{currentUser.title}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setView("dashboard"); setMobileMenuOpen(false); }}
                  className="px-3 py-2 text-xs text-center font-bold rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-2 text-xs text-center font-bold rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { setView("login"); setMobileMenuOpen(false); }}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 text-center"
              >
                {getTranslation(language, "login")}
              </button>
              <button
                onClick={() => { setView("register"); setMobileMenuOpen(false); }}
                className="px-3 py-2 rounded-xl bg-green-500 text-black text-xs font-bold text-center hover:bg-green-400"
              >
                {getTranslation(language, "register")}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

