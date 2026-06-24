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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column Settings controls */}
        <div className="md:col-span-2 space-y-6">
          
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

          {/* LinkedIn Integration Architecture planning block */}
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/5 blur-2xl"></div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              {getTranslation(language, "linkedinSyncTitle")}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {getTranslation(language, "linkedinSyncDesc")}
            </p>

            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-xs text-green-700 dark:text-green-400">
              {getTranslation(language, "linkedinSyncStatus")}
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                Architecture d'intégration planifiée :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-zinc-50 dark:bg-[#09090b]/60 p-3 rounded-xl border border-zinc-150 dark:border-white/5 space-y-1">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    1. OAuth official flow
                  </div>
                  <div className="text-zinc-400">
                    Consentement sécurisé via /auth/linkedin pour acquérir l'access_token officiel.
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-[#09090b]/60 p-3 rounded-xl border border-zinc-150 dark:border-white/5 space-y-1">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    2. Profile API fetch
                  </div>
                  <div className="text-zinc-400">
                    Appel de l'endpoint r_liteprofile pour extraire nom, prénom, avatar et localisation.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSyncLinkedIn}
                disabled={syncing}
                className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/15"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <Import className="h-3.5 w-3.5" />
                    Simuler l'importation LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right column Information side */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-green-950/20 via-[#09090b]/60 to-black border border-green-500/20 rounded-2xl p-6 text-white space-y-4 shadow-sm relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-yellow-500/10 blur-2xl"></div>

            <h4 className="text-sm font-bold tracking-tight">Pourquoi next-themes & next-intl ?</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Dans un environnement de production Next.js 15, nous configurons ces modules pour assurer un chargement optimal côté serveur (SSR) sans flickering de thème et un routage dynamique des locales.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase tracking-wider block">
                Statut de la stack :
              </span>
              <ul className="text-[10px] text-zinc-400 font-mono list-disc pl-4 space-y-1 mt-1">
                <li>Translations : Intégrées (FR / EN)</li>
                <li>Moteur de thèmes : Actif (Light / Dark)</li>
                <li>Persistence : localStorage + SQL Supabase</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
