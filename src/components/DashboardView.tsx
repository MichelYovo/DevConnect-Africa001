import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getShortFormattedDate } from "../i18n";
import { AFRICAN_COUNTRIES } from "../data";
import DeveloperAvatar from "./DeveloperAvatar";
import { getFlagForLocation } from "../types";
import { 
  Plus, 
  MapPin, 
  Search, 
  Code, 
  Calendar, 
  User, 
  Settings, 
  ExternalLink, 
  Heart,
  Github,
  Linkedin,
  Sparkles,
  Info,
  CheckCircle2,
  Globe
} from "lucide-react";

export default function DashboardView() {
  const { 
    currentUser, 
    profiles, 
    projects, 
    events, 
    activities,
    setView, 
    language,
    selectedCityFilter,
    setCityFilter,
    searchSkillQuery,
    setSkillQuery,
    toggleAttendEvent,
    toggleLikeProject,
    togoOnlyFilter,
    setTogoOnly,
    setSelectedProfileId,
    shortlistedIds,
    addToShortlist,
    removeFromShortlist
  } = useApp();

  // Search profiles state
  const [localSearch, setLocalSearch] = useState(searchSkillQuery);

  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    const parts = fullName.split(/[\s\._,]+/);
    if (parts.length > 0) {
      const first = parts[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    return fullName;
  };

  // Filter developers
  const filteredDevs = profiles.filter((p) => {
    // Country filter
    if (selectedCityFilter !== "all" && !p.location.toLowerCase().includes(selectedCityFilter.toLowerCase())) {
      return false;
    }
    // Skill/Search query
    if (localSearch.trim() !== "") {
      const q = localSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSkills = p.skills.some(s => s.toLowerCase().includes(q));
      return matchName || matchTitle || matchSkills;
    }
    return true;
  });

  // User specific statistics
  const userProjects = currentUser ? projects.filter(p => p.authorId === currentUser.id) : [];
  const userEvents = currentUser ? events.filter(e => e.attendees.includes(currentUser.id)) : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSkillQuery(e.target.value);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#09090b]/40 text-zinc-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-zinc-200/60 dark:border-white/10 relative overflow-hidden shadow-lg">
        {/* Abstract background vector accent */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 h-32 w-32 bg-blue-500/5 blur-3xl rounded-full"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-mono font-bold border border-indigo-500/10">
              <Sparkles className="h-3 w-3 text-indigo-500 shrink-0 animate-pulse" />
              <span>LIVE PAN-AFRICAN REGISTRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser 
                ? `${getTranslation(language, "welcomeUser")} ${getFirstName(currentUser.name)} !`
                : "Communauté Tech Africaine"
              }
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Découvrez les compétences des profils de développeurs à travers l'Afrique entière, initiez des partenariats et participez aux événements d'envergure.
            </p>
          </div>
          
          <div className="flex gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => setView("profile")}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-200 dark:border-white/5"
                >
                  <User className="h-4 w-4" />
                  Mon Profil
                </button>
                <button
                  onClick={() => setView("projects")}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/15"
                >
                  <Plus className="h-4 w-4" />
                  {getTranslation(language, "createProject")}
                </button>
              </>
            ) : (
              <button
                onClick={() => setView("register")}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Rejoindre le réseau
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar filters */}
        <div className="space-y-6 lg:col-span-3">
          
          {/* Quick Filters Card */}
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Filtres Communauté
            </h3>

            {/* Pan-African Network switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-[#09090b]/60 border border-zinc-150 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Réseau Afrique
                </span>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold">
                ACTIF
              </span>
            </div>

            {/* Country Filters */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                {getTranslation(language, "filterByCity")}
              </label>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setCityFilter("all")}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex justify-between items-center ${
                    selectedCityFilter === "all"
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                  }`}
                >
                  <span>Tous</span>
                  <span className="text-[10px] font-mono text-zinc-400">({profiles.length})</span>
                </button>
                {AFRICAN_COUNTRIES.map((ctry) => {
                  const count = profiles.filter(p => p.location.toLowerCase().includes(ctry.toLowerCase())).length;
                  return (
                    <button
                      key={ctry}
                      onClick={() => setCityFilter(ctry)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex justify-between items-center ${
                        selectedCityFilter === ctry
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#09090b]/30"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-yellow-500" />
                        {ctry}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User statistics if logged in */}
          {currentUser && (
            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <DeveloperAvatar
                  name={currentUser.name}
                  avatar={currentUser.avatar}
                  sizeClassName="h-8 w-8 text-[10px]"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">
                    {getFirstName(currentUser.name)}
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    {currentUser.location}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-white/5 pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Mes Projets :</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{userProjects.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Mes Événements :</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{userEvents.length}</span>
                </div>
              </div>

              {userEvents.length > 0 && (
                <div className="border-t border-zinc-100 dark:border-white/5 pt-3 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                    Inscrit aux événements
                  </span>
                  <div className="space-y-1.5">
                    {userEvents.slice(0, 3).map((e) => (
                      <div key={e.id} className="text-[11px] bg-zinc-50 dark:bg-[#09090b]/60 p-2 rounded-lg border border-zinc-150 dark:border-white/5 space-y-0.5">
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{e.title}</div>
                        <div className="text-zinc-400 flex items-center gap-1 font-mono text-[9px]">
                          <MapPin className="h-2 w-2" />
                          {e.location} • {getShortFormattedDate(language, e.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Profiles Grid / Main Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder={getTranslation(language, "searchSkills")}
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-sm focus:border-indigo-500 focus:bg-white outline-none text-zinc-900 dark:text-white transition-all shadow-sm"
            />
            {localSearch && (
              <button
                onClick={() => { setLocalSearch(""); setSkillQuery(""); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Results count info */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>
              Affichage de <strong>{filteredDevs.length}</strong> profil(s) correspondants.
            </span>
            {selectedCityFilter !== "all" && (
              <span>
                Filtre : <strong className="text-indigo-600 dark:text-indigo-400">{selectedCityFilter}</strong>
              </span>
            )}
          </div>

          {/* Grid profiles */}
          {filteredDevs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl space-y-3 shadow-sm">
              <User className="h-10 w-10 text-zinc-400 mx-auto" />
              <p className="text-sm text-zinc-500">
                Aucun développeur ne correspond à cette recherche.
              </p>
              <button
                onClick={() => { setLocalSearch(""); setSkillQuery(""); setCityFilter("all"); }}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all group"
                >
                  <div className="space-y-4">
                    
                    {/* Header */}
                    <div 
                      className="flex gap-4 cursor-pointer group/avatar"
                      onClick={() => setSelectedProfileId(dev.id)}
                    >
                      <DeveloperAvatar
                        name={dev.name}
                        avatar={dev.avatar}
                        sizeClassName="h-12 w-12 text-sm transition-transform duration-200 group-hover/avatar:scale-105"
                        status={dev.id === currentUser?.id || !dev.email.includes("offline")}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover/avatar:text-indigo-500 dark:group-hover/avatar:text-indigo-400 transition-colors flex items-center gap-1.5">
                          {dev.name}
                        </h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                          {dev.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                          <MapPin className="h-3 w-3 text-yellow-500" />
                          <span>{dev.location}{getFlagForLocation(dev.location)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p 
                      className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 cursor-pointer"
                      onClick={() => setSelectedProfileId(dev.id)}
                    >
                      {dev.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {dev.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-[#09090b]/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/30 dark:border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div className="border-t border-zinc-150 dark:border-white/5 mt-5 pt-3.5 flex justify-between items-center">
                    <button
                      onClick={() => setSelectedProfileId(dev.id)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <span>Voir le profil</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {/* Shortlist action button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (shortlistedIds.includes(dev.id)) {
                            removeFromShortlist(dev.id);
                          } else {
                            addToShortlist(dev.id);
                          }
                        }}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          shortlistedIds.includes(dev.id)
                            ? "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25"
                            : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/25"
                        }`}
                      >
                        <svg className="h-3 w-3 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                          {shortlistedIds.includes(dev.id) ? (
                            <path d="M18 6 6 18M6 6l12 12" />
                          ) : (
                            <path d="M12 5v14M5 12h14" />
                          )}
                        </svg>
                        <span>
                          {shortlistedIds.includes(dev.id) 
                            ? (language === "FR" ? "Retirer" : "Remove")
                            : (language === "FR" ? "Sélectionner" : "Shortlist")
                          }
                        </span>
                      </button>

                      {dev.github && (
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {dev.linkedin && (
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
