import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("landing")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-green-500 to-yellow-400 text-black font-black shadow-md shadow-green-500/10">
              <span className="text-sm font-extrabold tracking-tight">DC</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                DevConnect <span className="text-green-500">Africa</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tracking-wider">
                  v1.0.0-mvp • Togo Hub 🇹🇬
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button 
              onClick={() => setView("landing")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentView === "landing" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25" 
                  : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              Accueil
            </button>
            
            <button 
              onClick={() => setView("projects")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentView === "projects" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25" 
                  : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {getTranslation(language, "projects")}
            </button>

            <button 
              onClick={() => setView("events")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentView === "events" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25" 
                  : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {getTranslation(language, "events")}
            </button>

            {currentUser && (currentUser.email === "michelame.yovo@gmail.com" || currentUser.isAdmin) && (
              <button 
                onClick={() => setView("admin")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  currentView === "admin" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25" 
                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-green-500" />
                Console Admin
              </button>
            )}
          </nav>

          {/* Right Side Settings & User Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Toggle */}
            <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-white/10 p-0.5 bg-zinc-50 dark:bg-[#09090b]">
              <button
                onClick={() => setLanguage("FR")}
                className={`px-2 py-1 text-[11px] font-extrabold rounded-md transition-all ${
                  language === "FR" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-transparent"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2 py-1 text-[11px] font-extrabold rounded-md transition-all ${
                  language === "EN" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-transparent"
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Picker */}
            <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-white/10 p-0.5 bg-zinc-50 dark:bg-[#09090b]">
              <button
                onClick={() => setTheme("light")}
                title={getTranslation(language, "themeLight")}
                className={`p-1 rounded-md transition-all ${
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
                className={`p-1 rounded-md transition-all ${
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
                className={`p-1 rounded-md transition-all ${
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                    currentView === "dashboard" || currentView === "profile" || currentView === "settings"
                      ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                      : "border-zinc-200 dark:border-white/10"
                  }`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-green-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {currentUser.name}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title={getTranslation(language, "logout")}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("login")}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                >
                  {getTranslation(language, "login")}
                </button>
                <button
                  onClick={() => setView("register")}
                  className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-bold hover:bg-green-400 transition-all shadow-sm shadow-green-500/15"
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
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#09090b] px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setView("landing"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border ${
                currentView === "landing" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                  : "border-transparent text-zinc-700 dark:text-zinc-300"
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => { setView("projects"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border ${
                currentView === "projects" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                  : "border-transparent text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {getTranslation(language, "projects")}
            </button>
            <button
              onClick={() => { setView("events"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border ${
                currentView === "events" 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                  : "border-transparent text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {getTranslation(language, "events")}
            </button>
            {currentUser && (currentUser.email === "michelame.yovo@gmail.com" || currentUser.isAdmin) && (
              <button
                onClick={() => { setView("admin"); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg border ${
                  currentView === "admin" 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25" 
                    : "border-transparent text-zinc-700 dark:text-zinc-300"
                }`}
              >
                Console Admin
              </button>
            )}
          </div>

          <hr className="border-zinc-200 dark:border-white/10" />

          {/* Mobile Preferences */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Language:</span>
            <div className="flex gap-1 bg-zinc-100 dark:bg-[#09090b] p-0.5 rounded-md border dark:border-white/5">
              <button
                onClick={() => setLanguage("FR")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === "FR" ? "bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" : "text-zinc-500"}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === "EN" ? "bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" : "text-zinc-500"}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Theme:</span>
            <div className="flex gap-1 bg-zinc-100 dark:bg-[#09090b] p-0.5 rounded-md border dark:border-white/5">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded ${theme === "light" ? "bg-green-500/10 text-green-600 shadow-sm" : "text-zinc-400"}`}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded ${theme === "dark" ? "bg-green-500/10 text-green-400 shadow-sm" : "text-zinc-400"}`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded ${theme === "system" ? "bg-green-500/10 text-green-500 shadow-sm" : "text-zinc-400"}`}
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-white/10" />

          {/* User Section in Mobile Drawer */}
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-zinc-50 dark:bg-[#09090b] rounded-lg border dark:border-white/5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-green-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-semibold text-zinc-800 dark:text-white">{currentUser.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{currentUser.title}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setView("dashboard"); setMobileMenuOpen(false); }}
                  className="px-3 py-2 text-xs text-center font-bold rounded-lg border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-2 text-xs text-center font-bold rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { setView("login"); setMobileMenuOpen(false); }}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 text-center"
              >
                {getTranslation(language, "login")}
              </button>
              <button
                onClick={() => { setView("register"); setMobileMenuOpen(false); }}
                className="px-3 py-2 rounded-lg bg-green-500 text-black text-xs font-bold text-center hover:bg-green-400"
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
