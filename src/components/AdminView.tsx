import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { Profile } from "../types";
import { 
  Users, 
  Database, 
  Trash2, 
  Activity, 
  MapPin, 
  Shield, 
  UserX, 
  CheckCircle2, 
  Search, 
  Settings, 
  RefreshCw, 
  TrendingUp, 
  Flame,
  Globe
} from "lucide-react";
import SupabaseSqlView from "./SupabaseSqlView";

// Simulated real-time actions of developers on the platform
const LIVE_ACTIONS = [
  "consulte l'AgroMarket Togo",
  "met à jour ses compétences React",
  "crée un nouveau projet de suivi de transport",
  "s'inscrit au Lomé Javascript Meetup",
  "regarde les profils de Kpalimé",
  "met à jour son dépôt GitHub",
  "analyse l'utilisation du Machine Learning",
  "programme un atelier Figma",
  "explore le tableau de bord",
  "teste la connexion Google API"
];

interface ConnectedSession {
  id: string;
  name: string;
  avatar: string;
  location: string;
  action: string;
  time: string;
  ip: string;
}

export default function AdminView() {
  const { profiles, projects, events, language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<"sessions" | "users" | "sql">("sessions");
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState<Profile[]>(profiles);
  const [connectedSessions, setConnectedSessions] = useState<ConnectedSession[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load and shuffle live simulated sessions
  useEffect(() => {
    generateLiveSessions();
    
    // Simulate real-time dynamic active user changes
    const interval = setInterval(() => {
      setConnectedSessions(prev => {
        return prev.map(s => {
          if (Math.random() > 0.6) {
            const randomAction = LIVE_ACTIONS[Math.floor(Math.random() * LIVE_ACTIONS.length)];
            return {
              ...s,
              action: randomAction,
              time: "À l'instant"
            };
          }
          return s;
        });
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [profiles]);

  const generateLiveSessions = () => {
    setRefreshing(true);
    // Select some profiles from database to show as online
    const onlineProfiles = profiles.filter((_, idx) => idx % 2 === 0 || idx === 0);
    const sessions = onlineProfiles.map((p, index) => {
      const locations = ["Lomé", "Kara", "Kpalimé", "Atakpamé", "Sokodé"];
      const matchedCity = p.location || locations[index % locations.length];
      const randomAction = LIVE_ACTIONS[index % LIVE_ACTIONS.length];
      return {
        id: `sess-${p.id}`,
        name: p.name,
        avatar: p.avatar,
        location: matchedCity,
        action: randomAction,
        time: `${Math.floor(Math.random() * 10) + 1}m`,
        ip: `197.243.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`
      };
    });
    setConnectedSessions(sessions);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Keep internal list in sync with AppContext profiles
  useEffect(() => {
    setUserList(profiles);
  }, [profiles]);

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${name} ?`)) {
      setUserList(prev => prev.filter(u => u.id !== id));
      showToast(language === "FR" ? `Profil de ${name} supprimé.` : `Profile of ${name} deleted.`, "info");
    }
  };

  const handleToggleAdminStatus = (id: string, name: string, isNowAdmin: boolean) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, isAdmin: isNowAdmin } : u));
    showToast(
      language === "FR" 
        ? `${name} est maintenant ${isNowAdmin ? "Administrateur" : "Utilisateur standard"}.` 
        : `${name} is now ${isNowAdmin ? "Administrator" : "Standard User"}.`, 
      "success"
    );
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-mono font-bold border border-green-500/10">
            <Shield className="h-3.5 w-3.5" />
            CONSOLE DE CONTRÔLE ADMIN
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white mt-2">
            Panneau de Gestion
          </h1>
          <p className="text-zinc-500 text-sm">
            Supervisez les développeurs connectés au Togo, gérez les profils et accédez aux requêtes SQL Supabase.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-zinc-100 dark:bg-[#09090b] p-1 rounded-xl border dark:border-white/5 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "sessions"
                ? "bg-white dark:bg-zinc-900 text-green-500 shadow-sm border border-zinc-200/50 dark:border-white/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Live Sessions ({connectedSessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "users"
                ? "bg-white dark:bg-zinc-900 text-green-500 shadow-sm border border-zinc-200/50 dark:border-white/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Utilisateurs ({userList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "sql"
                ? "bg-white dark:bg-zinc-900 text-green-500 shadow-sm border border-zinc-200/50 dark:border-white/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Supabase SQL</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Connected Live Sessions */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                <Globe className="h-5 w-5 animate-spin duration-10000" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">Actifs Globaux</span>
                <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{connectedSessions.length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">Lomé & Maritimes</span>
                <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">
                  {connectedSessions.filter(s => s.location === "Lomé" || s.location === "Tsévié").length}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">Total Projets</span>
                <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{projects.length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 p-5 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                <Flame className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">Meetups Togo</span>
                <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{events.length}</span>
              </div>
            </div>
          </div>

          {/* Active Sessions List */}
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-150 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-[#09090b]/20">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-white">Sessions Actives en Temps Réel</h3>
              </div>
              <button
                onClick={generateLiveSessions}
                disabled={refreshing}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-white/5">
              {connectedSessions.map((session) => (
                <div key={session.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.avatar}
                      alt={session.name}
                      className="h-10 w-10 rounded-xl object-cover ring-2 ring-green-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">{session.name}</span>
                        <span className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border dark:border-white/5">
                          {session.ip}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-yellow-500" />
                        <span>{session.location}, Togo</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Activités : <strong className="font-bold text-green-600 dark:text-green-400">{session.action}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Actif il y a {session.time}</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Profiles Registry */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Search controls */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, titre ou ville au Togo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white transition-all shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-150 dark:border-white/5 bg-zinc-50/50 dark:bg-[#09090b]/20 font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Développeur</th>
                    <th className="p-4">Titre / Rôle</th>
                    <th className="p-4">Ville</th>
                    <th className="p-4">Rôle Système</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/5 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-9 w-9 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white text-sm">{user.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{user.email}</div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-4 text-zinc-700 dark:text-zinc-300 font-medium">
                        {user.title}
                      </td>

                      {/* Location */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                          <MapPin className="h-3 w-3 text-yellow-500" />
                          {user.location || "Lomé"}
                        </span>
                      </td>

                      {/* System Role */}
                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md font-bold font-mono text-[10px] border border-green-500/15">
                            <Shield className="h-3 w-3" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-md font-semibold font-mono text-[10px]">
                            USER
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleAdminStatus(user.id, user.name, !user.isAdmin)}
                            title={user.isAdmin ? "Rétrograder en utilisateur standard" : "Promouvoir au rôle Administrateur"}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              user.isAdmin
                                ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15"
                                : "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 hover:bg-green-500/15"
                            }`}
                          >
                            Rôle
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={user.email === "michelame.yovo@gmail.com"}
                            className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        Aucun développeur ne correspond à cette recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Database & SQL Console */}
      {activeTab === "sql" && (
        <div className="animate-in fade-in duration-250">
          {/* Explanatory banner */}
          <div className="bg-zinc-50 dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 mb-6 text-xs text-zinc-500 space-y-2">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-1.5">
              <Database className="h-4 w-4 text-green-500" />
              Accès Console Exclusif à l'Administrateur
            </h4>
            <p className="leading-relaxed">
              La console d'intégration SQL de Supabase a été retirée du pied de page et des menus pour l'utilisateur standard conformément à vos instructions. Vous y accédez ici de manière sécurisée en tant qu'administrateur de DevConnect.
            </p>
          </div>
          
          <SupabaseSqlView />
        </div>
      )}

    </div>
  );
}
