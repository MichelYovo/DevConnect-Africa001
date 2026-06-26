import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { Profile, Project, Event } from "../types";
import DeveloperAvatar from "./DeveloperAvatar";
import { 
  Users, 
  Trash2, 
  MapPin, 
  Shield, 
  Search, 
  Plus, 
  Layers,
  Calendar,
  Briefcase,
  UserPlus,
  Mail,
  UserCheck
} from "lucide-react";
import { AFRICAN_COUNTRIES } from "../data";

export default function AdminView() {
  const { 
    profiles, 
    projects, 
    events, 
    language, 
    deleteProject, 
    deleteEvent, 
    addProfile, 
    deleteProfile, 
    toggleAdminStatus, 
    currentUser,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"users" | "publications">("users");
  const [searchQuery, setSearchQuery] = useState("");
  
  // "Add Developer" Form Local States
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserTitle, setNewUserTitle] = useState("");
  const [newUserLocation, setNewUserLocation] = useState("Dakar, Sénégal");
  const [newUserBio, setNewUserBio] = useState("");
  const [newUserSkills, setNewUserSkills] = useState("");

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserTitle.trim()) {
      showToast(
        language === "FR" ? "Veuillez remplir les champs obligatoires." : "Please fill in the required fields.",
        "error"
      );
      return;
    }

    // Verify duplicate email
    if (profiles.some(p => p.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
      showToast(
        language === "FR" ? "Cet email est déjà enregistré." : "This email is already registered.",
        "error"
      );
      return;
    }

    const skillsArray = newUserSkills
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      avatar: "", // defaults to custom typographic initials
      title: newUserTitle.trim(),
      bio: newUserBio.trim() || "Développeur de la communauté DevConnect Africa.",
      skills: skillsArray.length > 0 ? skillsArray : ["React", "JavaScript"],
      location: newUserLocation,
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: newUserEmail.trim().toLowerCase(),
      isAdmin: false
    };

    addProfile(newProfile);

    // Reset fields
    setNewUserName("");
    setNewUserEmail("");
    setNewUserTitle("");
    setNewUserBio("");
    setNewUserSkills("");
  };

  const handleDeleteUserClick = (id: string, name: string) => {
    if (currentUser && currentUser.id === id) {
      showToast(
        language === "FR" ? "Vous ne pouvez pas supprimer votre propre compte admin !" : "You cannot delete your own admin account!",
        "error"
      );
      return;
    }

    const confirmText = language === "FR" 
      ? `Êtes-vous sûr de vouloir supprimer définitivement le développeur ${name} ?`
      : `Are you sure you want to permanently delete developer ${name}?`;

    if (window.confirm(confirmText)) {
      deleteProfile(id);
    }
  };

  const handleToggleAdminClick = (id: string, name: string, currentStatus: boolean) => {
    const confirmText = language === "FR"
      ? `Voulez-vous modifier le rôle de ${name} ?`
      : `Do you want to change the role of ${name}?`;

    if (window.confirm(confirmText)) {
      toggleAdminStatus(id, !currentStatus);
    }
  };

  const handleDeleteProjectClick = (id: string, title: string) => {
    const confirmText = language === "FR"
      ? `Voulez-vous supprimer définitivement la publication du projet "${title}" ?`
      : `Do you want to permanently delete the project publication "${title}"?`;

    if (window.confirm(confirmText)) {
      deleteProject(id);
    }
  };

  const handleDeleteEventClick = (id: string, title: string) => {
    const confirmText = language === "FR"
      ? `Voulez-vous supprimer définitivement l'événement "${title}" ?`
      : `Do you want to permanently delete the event "${title}"?`;

    if (window.confirm(confirmText)) {
      deleteEvent(id);
    }
  };

  // Filter users based on search query
  const filteredProfiles = profiles.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 px-2 sm:px-4 text-[11px]">
      
      {/* Centered Minimal Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-bold tracking-widest uppercase border border-green-500/20">
          <Shield className="h-2.5 w-2.5 animate-pulse" />
          Espace d'Administration Sécurisé
        </div>
        <h1 className="text-xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
          Gestion du Hub DevConnect
        </h1>
        <p className="max-w-xl mx-auto text-zinc-500 dark:text-zinc-400 text-[10px]">
          Ajoutez de nouveaux membres, attribuez des rôles d'administration et supervisez les publications de projets ou d'événements technologiques au Togo.
        </p>

        {/* Tab triggers */}
        <div className="inline-flex bg-zinc-100 dark:bg-zinc-900/60 p-0.5 rounded-full border border-zinc-200/50 dark:border-white/5 mt-2">
          <button
            onClick={() => { setActiveTab("users"); setSearchQuery(""); }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "users"
                ? "bg-white dark:bg-[#09090b] text-green-500 shadow-sm border border-zinc-200/50 dark:border-white/10"
                : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Membres ({profiles.length})</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("publications"); setSearchQuery(""); }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "publications"
                ? "bg-white dark:bg-[#09090b] text-green-500 shadow-sm border border-zinc-200/50 dark:border-white/10"
                : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Publications ({projects.length + events.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Users (Manage & Add People) */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add People Form Panel (Ultra compact styling) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-xl p-4 space-y-4 shadow-sm sticky top-28">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-green-500" />
                  Inscrire un Développeur
                </h3>
                <p className="text-zinc-500 text-[9px] mt-0.5">
                  Ajoutez un nouveau profil de développeur manuellement dans l'annuaire DevConnect Africa.
                </p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Koffi Adebayor"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: k.adebayor@tech.tg"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                    Poste / Spécialisation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Développeur Flutter & Mobile"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                      Localisation (Ville, Pays) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dakar, Sénégal"
                      value={newUserLocation}
                      onChange={(e) => setNewUserLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                      Compétences
                    </label>
                    <input
                      type="text"
                      placeholder="React, Swift, Go"
                      value={newUserSkills}
                      onChange={(e) => setNewUserSkills(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white"
                      title="Séparez les compétences par des virgules"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase tracking-wider">
                    Biographie
                  </label>
                  <textarea
                    placeholder="Courte description du développeur..."
                    rows={2}
                    value={newUserBio}
                    onChange={(e) => setNewUserBio(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] outline-none focus:border-green-500 text-zinc-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-extrabold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-green-500/10"
                >
                  <Plus className="h-3 w-3" />
                  Ajouter le Développeur
                </button>
              </form>
            </div>
          </div>

          {/* User profiles database listing (Denser grid style) */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, poste ou ville au Togo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-[10px] focus:border-green-500 outline-none text-zinc-900 dark:text-white transition-all shadow-sm"
              />
            </div>

            {/* List Table wrapper - Compact columns and cell margins */}
            <div className="bg-white dark:bg-[#09090b]/30 border border-zinc-200/60 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/40 dark:bg-[#09090b]/40 font-mono font-bold text-zinc-400 uppercase tracking-wider text-[9px]">
                      <th className="p-2.5 pl-4">Développeur</th>
                      <th className="p-2.5">Poste / Spécialisation</th>
                      <th className="p-2.5">Ville</th>
                      <th className="p-2.5">Statut</th>
                      <th className="p-2.5 text-right pr-4">Gestion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {filteredProfiles.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                        
                        {/* Name & Avatar initials */}
                        <td className="p-2.5 pl-4 flex items-center gap-2">
                          <DeveloperAvatar
                            name={user.name}
                            avatar={user.avatar}
                            sizeClassName="h-7 w-7 text-[10px]"
                          />
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white text-[11px] leading-tight">{user.name}</div>
                            <div className="text-[9px] text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="h-2.5 w-2.5 text-zinc-400 dark:text-zinc-600" />
                              {user.email}
                            </div>
                          </div>
                        </td>

                        {/* Title */}
                        <td className="p-2.5 text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[150px]">
                          {user.title}
                        </td>

                        {/* Location */}
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-0.5 text-zinc-500 dark:text-zinc-400 font-medium">
                            <MapPin className="h-3 w-3 text-yellow-500" />
                            {user.location}, TG
                          </span>
                        </td>

                        {/* Status (Admin / User) */}
                        <td className="p-2.5">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center gap-0.5 bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full font-bold font-mono text-[8px] border border-green-500/15">
                              <Shield className="h-2.5 w-2.5" />
                              ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 px-1.5 py-0.5 rounded-full font-bold font-mono text-[8px]">
                              MEMBRE
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-2.5 text-right pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleAdminClick(user.id, user.name, !!user.isAdmin)}
                              className={`px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                                user.isAdmin
                                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                  : "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400"
                              }`}
                              title="Changer le rôle d'accès"
                            >
                              Rôle
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUserClick(user.id, user.name)}
                              disabled={user.email === "michelame.yovo@gmail.com"}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Exclure ce membre"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProfiles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-400 italic">
                          Aucun membre inscrit ne correspond à votre filtre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Publications (Projects & Events Management) */}
      {activeTab === "publications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Projects Management section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1.5 border-b border-zinc-100 dark:border-white/5">
              <Briefcase className="h-4 w-4 text-green-500" />
              <h3 className="font-extrabold text-[10px] text-zinc-950 dark:text-white uppercase tracking-wider">
                Projets Partagés ({projects.length})
              </h3>
            </div>

            <div className="space-y-2">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="p-3 bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-xl flex justify-between items-start gap-3 hover:border-zinc-300 dark:hover:border-white/15 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-[11px] text-zinc-900 dark:text-white leading-tight">
                      {proj.title}
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <DeveloperAvatar
                        name={proj.authorName}
                        avatar={proj.authorAvatar}
                        sizeClassName="h-4 w-4 text-[7px]"
                      />
                      <span className="text-[9px] text-zinc-400">
                        Par <strong className="font-bold text-zinc-600 dark:text-zinc-300">{proj.authorName}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProjectClick(proj.id, proj.title)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 shrink-0 transition-all cursor-pointer"
                    title="Supprimer la publication"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-white/5 rounded-xl text-zinc-400 italic">
                  Aucun projet publié à ce jour.
                </div>
              )}
            </div>
          </div>

          {/* Events Management section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1.5 border-b border-zinc-100 dark:border-white/5">
              <Calendar className="h-4 w-4 text-green-500" />
              <h3 className="font-extrabold text-[10px] text-zinc-950 dark:text-white uppercase tracking-wider">
                Événements Programmés ({events.length})
              </h3>
            </div>

            <div className="space-y-2">
              {events.map((evt) => {
                const eventDate = new Date(evt.date);
                const formattedDate = isNaN(eventDate.getTime()) 
                  ? evt.date 
                  : eventDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

                return (
                  <div 
                    key={evt.id} 
                    className="p-3 bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-xl flex justify-between items-start gap-3 hover:border-zinc-300 dark:hover:border-white/15 transition-all"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-[11px] text-zinc-900 dark:text-white leading-tight">
                        {evt.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[10px] line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 pt-0.5">
                        <MapPin className="h-2.5 w-2.5 text-yellow-500" />
                        <span>{evt.venue} ({evt.location})</span>
                        <span>•</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{formattedDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEventClick(evt.id, evt.title)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 shrink-0 transition-all cursor-pointer"
                      title="Annuler l'événement"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}

              {events.length === 0 && (
                <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-white/5 rounded-xl text-zinc-400 italic">
                  Aucun événement programmé à ce jour.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
