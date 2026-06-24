import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { SUPABASE_SQL_CODE } from "../supabaseSql";
import { 
  Database, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  CheckCircle 
} from "lucide-react";

export default function SupabaseSqlView() {
  const { language, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_CODE);
    setCopied(true);
    showToast(
      language === "FR" ? "Script SQL copié !" : "SQL Script copied!",
      "success"
    );
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
          <Database className="h-8 w-8 text-green-500" />
          {getTranslation(language, "sqlConsoleTitle")}
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm">
          {getTranslation(language, "sqlConsoleDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left explanation panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
            <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Détails des Tables
            </span>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">1. profiles</span>
                <p className="text-zinc-500 leading-relaxed">
                  Stocke la biographie, compétences, avatars et liens des développeurs, synchronisé avec auth.users.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">2. projects</span>
                <p className="text-zinc-500 leading-relaxed">
                  Contient les titres, descriptions, technologies et liens GitHub/Démo des projets partagés.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">3. events</span>
                <p className="text-zinc-500 leading-relaxed">
                  Gère les meetups techniques, dates, lieux et tableaux des participants.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 space-y-2 text-xs">
            <span className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Sécurité RLS Activée
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-normal">
              Le script SQL configure des politiques d'accès de sécurité Row-Level (RLS) pour garantir que seuls les propriétaires authentifiés de projets ou profils peuvent les modifier ou les supprimer.
            </p>
          </div>
        </div>

        {/* SQL Code Terminal */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-zinc-950 dark:bg-zinc-950 border border-zinc-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Terminal Header */}
            <div className="bg-zinc-100 dark:bg-[#09090b]/80 border-b border-zinc-200/60 dark:border-white/10 px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-[11px] font-mono text-zinc-500 ml-2 font-bold flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  supabase-migrations.sql
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-green-500/15"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{getTranslation(language, "copySql")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Code container */}
            <div className="p-5 overflow-x-auto max-h-[500px] text-xs font-mono text-zinc-300 leading-relaxed bg-[#0b0c10]">
              <pre className="whitespace-pre">{SUPABASE_SQL_CODE}</pre>
            </div>

          </div>

          <p className="text-[11px] font-mono text-zinc-400 text-center">
            💡 Astuce : Exécutez ce script dans la section SQL Editor de votre projet Supabase pour initialiser instantanément votre MVP en production.
          </p>

        </div>

      </div>

    </div>
  );
}
