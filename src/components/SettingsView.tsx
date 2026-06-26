import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { 
  Globe, 
  Sun, 
  Moon, 
  Laptop, 
  Linkedin, 
  Database, 
  CheckCircle, 
  Settings, 
  Import, 
  RefreshCw,
  Share2,
  Info
} from "lucide-react";

export default function SettingsView() {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    showToast 
  } = useApp();

  const [syncing, setSyncing] = React.useState(false);

  const handleSyncLinkedIn = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast(
        language === "FR" 
          ? "Synchronisation LinkedIn simulée réussie !" 
          : "Simulated LinkedIn synchronization successful!", 
        "success"
      );
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {getTranslation(language, "settings")}
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Ajustez vos préférences d'affichage et explorez les modules de synchronisation professionnelle de DevConnect.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Preferences block */}
        <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-white/5 pb-3">
            <Settings className="h-5 w-5 text-green-500" />
            Préférences de l'application
          </h3>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              {getTranslation(language, "language")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage("FR")}
                className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === "FR"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold"
                    : "border-zinc-200/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                }`}
              >
                <span>🇫🇷</span>
                <span>{getTranslation(language, "langFR")}</span>
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === "EN"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold"
                    : "border-zinc-200/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                }`}
              >
                <span>🇺🇸</span>
                <span>{getTranslation(language, "langEN")}</span>
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              {getTranslation(language, "theme")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === "light"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-zinc-200/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                }`}
              >
                <Sun className="h-4 w-4 text-yellow-500" />
                <span>{getTranslation(language, "themeLight")}</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-zinc-200/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                }`}
              >
                <Moon className="h-4 w-4 text-green-400" />
                <span>{getTranslation(language, "themeDark")}</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === "system"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-zinc-200/60 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                }`}
              >
                <Laptop className="h-4 w-4 text-yellow-500" />
                <span>{getTranslation(language, "themeSystem")}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
