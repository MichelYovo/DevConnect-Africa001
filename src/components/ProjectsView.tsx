import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getShortFormattedDate } from "../i18n";
import { TOGO_CITIES } from "../data";
import { 
  Plus, 
  MapPin, 
  ExternalLink, 
  Github, 
  Heart, 
  Search, 
  Trash2, 
  Edit, 
  PlusCircle, 
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function ProjectsView() {
  const { 
    currentUser, 
    projects, 
    createProject, 
    updateProject, 
    deleteProject, 
    toggleLikeProject, 
    language,
    profiles
  } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // Project Creation/Editing Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createProject({
      title,
      description,
      techStack: techStack.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setDemoUrl("");
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId || !title || !description) return;

    updateProject(editingProjectId, {
      title,
      description,
      techStack: techStack.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setDemoUrl("");
    setEditingProjectId(null);
  };

  const openEditModal = (proj: any) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechStack(proj.techStack.join(", "));
    setGithubUrl(proj.githubUrl);
    setDemoUrl(proj.demoUrl);
  };

  // Filter projects list
  const filteredProjects = projects.filter((proj) => {
    // Search query matching title, description, or technology stack
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // City filter matching author's profile city
    if (selectedCity !== "all") {
      const authorProfile = profiles.find(p => p.id === proj.authorId);
      const authorCity = authorProfile ? authorProfile.location : "Lomé";
      return matchesSearch && authorCity === selectedCity;
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header and Add Project Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {getTranslation(language, "projects")}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm">
            Découvrez ou partagez des applications, librairies et initiatives nées au Togo.
          </p>
        </div>

        {currentUser ? (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-green-500/15"
          >
            <Plus className="h-4 w-4" />
            {getTranslation(language, "createProject")}
          </button>
        ) : (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
          >
            Se connecter pour publier
          </button>
        )}
      </div>

      {/* Search and City Filter row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, description ou technologie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-xs sm:text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white transition-all shadow-sm"
          />
        </div>

        {/* City Filter Selection */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-xs sm:text-sm focus:border-green-500 outline-none text-zinc-700 dark:text-zinc-300 transition-all shadow-sm"
          >
            <option value="all">Filtre : Toutes les villes du Togo</option>
            {TOGO_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl space-y-3 shadow-sm">
          <Layers className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm text-zinc-500">
            {getTranslation(language, "noProjectsYet")}
          </p>
          {(searchQuery || selectedCity !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedCity("all"); }}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const authorProfile = profiles.find(p => p.id === proj.authorId);
            const authorCity = authorProfile ? authorProfile.location : "Lomé";
            const isMyProject = currentUser && proj.authorId === currentUser.id;

            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-green-500/10 dark:hover:border-green-500/20 transition-all"
              >
                <div className="space-y-4">
                  
                  {/* Author metadata block */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.authorAvatar}
                        alt={proj.authorName}
                        className="h-6 w-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="leading-none">
                        <div className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">{proj.authorName}</div>
                        <div className="text-[9px] text-zinc-400 flex items-center gap-0.5">
                          <MapPin className="h-2 w-2 text-yellow-500" />
                          {authorCity}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {getShortFormattedDate(language, proj.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 hover:text-green-500 dark:hover:text-green-400 cursor-pointer">
                      {proj.title}
                      {isMyProject && (
                        <span className="text-[8px] bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-extrabold uppercase">
                          Mien
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-[#09090b]/60 text-zinc-600 dark:text-zinc-300 border border-zinc-200/30 dark:border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                <div className="border-t border-zinc-100 dark:border-white/5 mt-6 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLikeProject(proj.id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        currentUser && proj.likedBy.includes(currentUser.id)
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                          : "text-zinc-400 hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${currentUser && proj.likedBy.includes(currentUser.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{proj.likes}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* User Edit / Delete controls if it's their project */}
                    {isMyProject ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(proj)}
                          title="Modifier"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-green-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Supprimer ce projet ?")) {
                              deleteProject(proj.id);
                            }
                          }}
                          title="Supprimer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        title="GitHub Depot"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        Demo
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal create project overlay */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-green-500" />
                {getTranslation(language, "createProject")}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectTitle")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : AgroMarket Togo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectDesc")} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez votre application, sa genèse, et son impact pour la communauté tech togolaise..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectTech")}
                </label>
                <input
                  type="text"
                  placeholder="Ex : React, TypeScript, Tailwind, Supabase"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "githubRepo")}
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/votre-depot"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "liveDemo")}
                  </label>
                  <input
                    type="url"
                    placeholder="https://votre-projet.tg"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-white/5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200/60 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold"
                >
                  {getTranslation(language, "cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs cursor-pointer shadow"
                >
                  {getTranslation(language, "create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal edit project overlay */}
      {editingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit className="h-5 w-5 text-green-500" />
                {getTranslation(language, "editProject")}
              </h3>
              <button
                onClick={() => setEditingProjectId(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectTitle")} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectDesc")} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "projectTech")}
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "githubRepo")}
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "liveDemo")}
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-white/5 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProjectId(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200/60 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold"
                >
                  {getTranslation(language, "cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs cursor-pointer shadow"
                >
                  {getTranslation(language, "update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
