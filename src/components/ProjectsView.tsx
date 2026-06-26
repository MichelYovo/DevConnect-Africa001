import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getShortFormattedDate } from "../i18n";
import { AFRICAN_COUNTRIES } from "../data";
import DeveloperAvatar from "./DeveloperAvatar";
import ReactMarkdown from "react-markdown";
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

  // Oracle and Pitch Deck states
  const [expandedOracleProjId, setExpandedOracleProjId] = useState<string | null>(null);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, "stack" | "pitch">>({});
  const [loadingOracleProjId, setLoadingOracleProjId] = useState<string | null>(null);
  const [currentSlideMap, setCurrentSlideMap] = useState<Record<string, number>>({});
  
  const [useOracleOnCreate, setUseOracleOnCreate] = useState(false);
  const [isGeneratingOnCreate, setIsGeneratingOnCreate] = useState(false);

  const parseSlides = (markdownText?: string): string[] => {
    if (!markdownText) return [];
    // Split by "---" or slide boundaries
    let parts = markdownText.split(/---|\n## /);
    return parts
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map((p, idx) => {
        if (idx > 0 && !p.startsWith("#") && !p.startsWith("##")) {
          return "## " + p;
        }
        return p;
      });
  };

  const handleGenerateOracle = async (projId: string, projTitle: string, projDesc: string, projTech: string[]) => {
    setLoadingOracleProjId(projId);
    try {
      const res = await fetch("/api/oracle/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projTitle,
          description: projDesc,
          techStack: projTech
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Une erreur est survenue.");
      }
      const data = await res.json();
      
      // Save to the project
      updateProject(projId, {
        techStackIdeal: data.techStackIdeal,
        pitchDeck: data.pitchDeck,
        techStack: [...new Set([...projTech, ...(data.suggestedTags || [])])]
      });
      
      // Set active tab to stack
      setActiveTabMap(prev => ({ ...prev, [projId]: "stack" }));
      // Open the oracle view for this project
      setExpandedOracleProjId(projId);
    } catch (err: any) {
      console.error(err);
      alert("Erreur de l'Oracle IA : " + err.message);
    } finally {
      setLoadingOracleProjId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    let finalTechStackIdeal = "";
    let finalPitchDeck = "";
    let finalTechStack = techStack.split(",").map((t) => t.trim()).filter((t) => t !== "");

    if (useOracleOnCreate) {
      setIsGeneratingOnCreate(true);
      try {
        const res = await fetch("/api/oracle/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            techStack: finalTechStack
          })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Génération échouée.");
        }
        const data = await res.json();
        finalTechStackIdeal = data.techStackIdeal;
        finalPitchDeck = data.pitchDeck;
        if (data.suggestedTags) {
          finalTechStack = [...new Set([...finalTechStack, ...data.suggestedTags])];
        }
      } catch (err: any) {
        console.error(err);
        alert("Erreur lors de la génération par l'Oracle IA : " + err.message + ". Le projet sera créé sans détails Oracle.");
      } finally {
        setIsGeneratingOnCreate(false);
      }
    }

    createProject({
      title,
      description,
      techStack: finalTechStack,
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
      techStackIdeal: finalTechStackIdeal || undefined,
      pitchDeck: finalPitchDeck || undefined
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setDemoUrl("");
    setUseOracleOnCreate(false);
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

    // City/Country filter matching author's profile location
    if (selectedCity !== "all") {
      const authorProfile = profiles.find(p => p.id === proj.authorId);
      const authorCity = authorProfile ? authorProfile.location : "Dakar, Sénégal";
      return matchesSearch && authorCity.toLowerCase().includes(selectedCity.toLowerCase());
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
            {language === "FR" 
              ? "Découvrez ou partagez des applications, librairies et initiatives nées en Afrique." 
              : "Discover or share applications, libraries and initiatives born in Africa."
            }
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

        {/* Country Filter Selection */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b]/40 text-xs sm:text-sm focus:border-green-500 outline-none text-zinc-700 dark:text-zinc-300 transition-all shadow-sm"
          >
            <option value="all">{language === "FR" ? "Filtre : Tous les pays d'Afrique" : "Filter: All African Countries"}</option>
            {AFRICAN_COUNTRIES.map((ctry) => (
              <option key={ctry} value={ctry}>
                {ctry}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const authorProfile = profiles.find(p => p.id === proj.authorId);
            const authorCity = authorProfile ? authorProfile.location : "Lomé";
            const isMyProject = currentUser && proj.authorId === currentUser.id;

            const activeTab = activeTabMap[proj.id] || "stack";
            const slides = parseSlides(proj.pitchDeck);
            const currentSlide = currentSlideMap[proj.id] || 0;
            const hasOracle = proj.techStackIdeal || proj.pitchDeck;
            const isExpanded = expandedOracleProjId === proj.id;

            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-green-500/10 dark:hover:border-green-500/20 transition-all"
              >
                <div className="space-y-4">
                  
                  {/* Author metadata block */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DeveloperAvatar
                        name={proj.authorName}
                        avatar={proj.authorAvatar}
                        sizeClassName="h-6 w-6 text-[9px]"
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

                {/* Accordion area for Oracle IA & Pitch Deck */}
                <div className="border-t border-zinc-100 dark:border-white/5 mt-4 pt-4">
                  <button
                    onClick={() => setExpandedOracleProjId(isExpanded ? null : proj.id)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-50 dark:bg-[#09090b]/60 border border-zinc-200/50 dark:border-white/5 flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-green-500/20 dark:hover:border-green-500/30 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-green-500" />
                      {hasOracle ? "🔮 Oracle IA & Pitch Deck" : "🔮 Consulter l'Oracle IA"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {isExpanded ? "Masquer ▲" : "Afficher ▼"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      {hasOracle ? (
                        <div className="space-y-3">
                          {/* Tabs header */}
                          <div className="flex border-b border-zinc-100 dark:border-white/5">
                            <button
                              onClick={() => setActiveTabMap(prev => ({ ...prev, [proj.id]: "stack" }))}
                              className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
                                activeTab === "stack"
                                  ? "border-green-500 text-green-600 dark:text-green-400"
                                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                              }`}
                            >
                              Stack Idéale (Oracle)
                            </button>
                            <button
                              onClick={() => setActiveTabMap(prev => ({ ...prev, [proj.id]: "pitch" }))}
                              className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${
                                activeTab === "pitch"
                                  ? "border-green-500 text-green-600 dark:text-green-400"
                                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                              }`}
                            >
                              Pitch Deck (Slides)
                            </button>
                          </div>

                          {/* Tab Content */}
                          {activeTab === "stack" ? (
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-300 space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                              <div className="markdown-body prose prose-sm dark:prose-invert">
                                <ReactMarkdown>{proj.techStackIdeal || ""}</ReactMarkdown>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {slides.length > 0 ? (
                                <div className="p-4 bg-gradient-to-br from-green-950/20 to-black rounded-xl border border-green-500/10 min-h-48 flex flex-col justify-between relative overflow-hidden text-zinc-200 shadow-inner">
                                  <div className="absolute top-1 right-2 text-[9px] font-mono font-bold text-green-500/40">
                                    SLIDE {currentSlide + 1} / {slides.length}
                                  </div>
                                  <div className="markdown-body prose prose-sm dark:prose-invert text-xs sm:text-sm mt-2 flex-1">
                                    <ReactMarkdown>{slides[currentSlide]}</ReactMarkdown>
                                  </div>
                                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                                    <button
                                      disabled={currentSlide === 0}
                                      onClick={() => setCurrentSlideMap(prev => ({ ...prev, [proj.id]: Math.max(0, currentSlide - 1) }))}
                                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-[10px] font-bold cursor-pointer transition-colors"
                                    >
                                      ◀ Précédent
                                    </button>
                                    <button
                                      disabled={currentSlide === slides.length - 1}
                                      onClick={() => setCurrentSlideMap(prev => ({ ...prev, [proj.id]: Math.min(slides.length - 1, currentSlide + 1) }))}
                                      className="px-2.5 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-30 text-[10px] font-bold cursor-pointer transition-colors"
                                    >
                                      Suivant ▶
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 text-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-white/5">
                                  Aucun slide de Pitch Deck disponible.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 text-center space-y-3">
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            L'Oracle IA n'a pas encore analysé ce projet. Demandez une recommandation de stack technique panafricaine (Next.js, FedaPay, PayGate, etc.) et un Pitch Deck en un clic !
                          </p>
                          <button
                            onClick={() => handleGenerateOracle(proj.id, proj.title, proj.description, proj.techStack)}
                            disabled={loadingOracleProjId === proj.id}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-green-500/10"
                          >
                            {loadingOracleProjId === proj.id ? (
                              <>
                                <span className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                Consultation de l'Oracle...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3.5 w-3.5" />
                                Consulter l'Oracle IA
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

              {/* Oracle integration trigger checkbox */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <input
                  type="checkbox"
                  id="useOracle"
                  checked={useOracleOnCreate}
                  disabled={isGeneratingOnCreate}
                  onChange={(e) => setUseOracleOnCreate(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="useOracle" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <span className="flex items-center gap-1 font-extrabold text-green-600 dark:text-green-400">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Consulter l'Oracle IA de DevConnect
                  </span>
                  Générer instantanément la stack technique idéale panafricaine (Next.js, FedaPay, PayGate, etc.) et le pitch deck professionnel à partir du titre et de la description.
                </label>
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
                  disabled={isGeneratingOnCreate}
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs cursor-pointer shadow flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingOnCreate ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    getTranslation(language, "create")
                  )}
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
