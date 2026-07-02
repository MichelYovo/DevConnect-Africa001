import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getFormattedDate } from "../i18n";
import { motion } from "motion/react";
import DeveloperAvatar from "./DeveloperAvatar";
import { getFlagForLocation } from "../types";
import { 
  ArrowRight, 
  MapPin, 
  Code, 
  Calendar, 
  Heart, 
  Users, 
  Cpu, 
  Award, 
  Sparkles,
  Search,
  CheckCircle2,
  Database,
  Github,
  Linkedin
} from "lucide-react";

export default function LandingView() {
  const { 
    setView, 
    language, 
    profiles, 
    projects, 
    events, 
    toggleAttendEvent, 
    toggleLikeProject,
    currentUser,
    shortlistedIds,
    addToShortlist,
    removeFromShortlist
  } = useApp();

  // Selected developer profile for high-polish modal showcase
  const [selectedDevId, setSelectedDevId] = React.useState<string | null>(null);

  // Togo stats computed dynamically
  const togoDevelopersCount = profiles.filter(p => p.location && p.location !== "").length;
  const togoProjectsCount = projects.length;
  const togoEventsCount = events.length;

  const handleJoinCommunity = () => {
    if (currentUser) {
      setView("dashboard");
    } else {
      setView("register");
    }
  };

  // Track mouse coordinates over the hero card for the "Anti-Gravité" and "LoopAudit" spotlight pull effect
  const heroCardRef = React.useRef<HTMLDivElement>(null);
  const [heroMouse, setHeroMouse] = React.useState({ x: 0, y: 0, opacity: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    setHeroMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleHeroMouseLeave = () => {
    setHeroMouse(prev => ({ ...prev, opacity: 0 }));
  };

  const selectedDev = profiles.find(p => p.id === selectedDevId);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section (Partify & LoopAudit Inspired) */}
      <section className="relative pt-6 pb-12 overflow-hidden">
                {/* Soft, beautiful external backdrop ambient glow (Responsive for Light/Dark) */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_50rem_at_50%_50%,rgba(99,102,241,0.06),transparent_80%)] dark:bg-[radial-gradient(50rem_50rem_at_50%_50%,rgba(99,102,241,0.03),transparent_80%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[140px]"></div>

        {/* The Floating Bento Card */}
        <div 
          ref={heroCardRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative max-w-7xl mx-auto rounded-[36px] border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#030303] text-zinc-900 dark:text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl transition-all duration-300 group"
        >
          
          {/* Subtle Grid overlay inside the card */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Magnetic/Interactive spotlight trail that pulls on cursor */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: heroMouse.opacity,
              background: `radial-gradient(280px circle at ${heroMouse.x}px ${heroMouse.y}px, rgba(99, 102, 241, 0.08), transparent 80%)`,
            }}
          />

          {/* TWO COLUMN GRID LAYOUT (Partify Inspired) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* LEFT COLUMN: Texts, high-impact headlines and organic highlights */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* The Pill Indicator */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-500/5 px-4 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 backdrop-blur w-fit"
              >
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>1200+ développeurs africains déjà connectés</span>
              </motion.div>

              {/* Title with Partify-style organic highlighting loops */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.2] font-display"
                >
                  {language === "FR" ? (
                    <span className="block space-y-3">
                      <span>Découvrez la force de la</span>{" "}
                      <span className="inline-block px-3.5 py-1 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transform -rotate-1">
                        collaboration collective
                      </span>{" "}
                      <span>avec</span>{" "}
                      <span className="inline-block px-3.5 py-1 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transform rotate-1">
                        DevConnect Africa.
                      </span>
                    </span>
                  ) : (
                    <span className="block space-y-3">
                      <span>Discover the power of</span>{" "}
                      <span className="inline-block px-3.5 py-1 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transform -rotate-1">
                        collective sourcing
                      </span>{" "}
                      <span>with</span>{" "}
                      <span className="inline-block px-3.5 py-1 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transform rotate-1">
                        DevConnect Africa.
                      </span>
                    </span>
                  )}
                </motion.h1>
              </div>

              {/* Description Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl"
              >
                {getTranslation(language, "landingSubtitle")}
              </motion.p>

              {/* Two Call to Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  onClick={handleJoinCommunity}
                  className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-extrabold text-xs transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 group"
                >
                  {getTranslation(language, "getStarted")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setView("projects")}
                  className="px-6 py-3 rounded-full border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-white dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white transition-all backdrop-blur"
                >
                  {getTranslation(language, "viewProjects")}
                </button>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Interactive Modular SVG "Fluid Pipeline Grid" (Partify mimic) */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-[320px] sm:h-[350px] bg-zinc-50 dark:bg-zinc-900/30 rounded-[32px] border border-zinc-150 dark:border-white/5 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-indigo-500/25 transition-colors duration-500">
                
                {/* Thin inner coordinates/grid line effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_100%,transparent_100%)] pointer-events-none" />

                {/* Highly polished decorative SVG Fluid Pathways */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 400 350">
                  
                  {/* Decorative curved track Indigo */}
                  <path 
                    d="M 60,100 Q 60,50 110,50 L 220,50 Q 270,50 270,100 L 270,140 Q 270,190 320,190" 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="28" 
                    strokeLinecap="round" 
                    className="opacity-75 dark:opacity-85" 
                  />
                  {/* Inner neon tube accent line */}
                  <path 
                    d="M 60,100 Q 60,50 110,50 L 220,50 Q 270,50 270,100 L 270,140 Q 270,190 320,190" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    className="opacity-90"
                  />

                  {/* Decorative curved track Blue */}
                  <path 
                    d="M 120,280 L 210,280 Q 260,280 260,230 L 260,180 Q 260,130 310,130 L 340,130" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="24" 
                    strokeLinecap="round" 
                    className="opacity-60 dark:opacity-75" 
                  />
                  {/* Inner Blue tube accent line */}
                  <path 
                    d="M 120,280 L 210,280 Q 260,280 260,230 L 260,180 Q 260,130 310,130 L 340,130" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    className="opacity-95"
                  />

                  {/* Moving signal lights along tracks using animateMotion */}
                  <circle r="6" fill="#ffffff" className="filter drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
                    <animateMotion 
                      dur="3.5s" 
                      repeatCount="indefinite" 
                      path="M 60,100 Q 60,50 110,50 L 220,50 Q 270,50 270,100 L 270,140 Q 270,190 320,190" 
                    />
                  </circle>

                  <circle r="5" fill="#ffffff" className="filter drop-shadow-[0_0_6px_rgba(255,255,255,1)]">
                    <animateMotion 
                      dur="4.5s" 
                      repeatCount="indefinite" 
                      path="M 120,280 L 210,280 Q 260,280 260,230 L 260,180 Q 260,130 310,130 L 340,130" 
                    />
                  </circle>

                </svg>

                {/* Overlay Interactive Hub City Nodes with micro styling */}
                <div className="absolute top-[35px] left-[95px] flex items-center gap-1.5 px-2 py-1 rounded-full bg-white dark:bg-zinc-950 shadow-md border border-zinc-150 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer select-none">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">Lomé TG 🇹🇬</span>
                </div>

                <div className="absolute top-[85px] left-[255px] flex items-center gap-1.5 px-2 py-1 rounded-full bg-white dark:bg-zinc-950 shadow-md border border-zinc-150 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer select-none">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">Dakar SN 🇸🇳</span>
                </div>

                <div className="absolute top-[265px] left-[105px] flex items-center gap-1.5 px-2 py-1 rounded-full bg-white dark:bg-zinc-950 shadow-md border border-zinc-150 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer select-none">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">Abidjan CI 🇨🇮</span>
                </div>

                <div className="absolute top-[175px] left-[250px] flex items-center gap-1.5 px-2 py-1 rounded-full bg-white dark:bg-zinc-950 shadow-md border border-zinc-150 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer select-none">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">Lagos NG 🇳🇬</span>
                </div>

                {/* Floating active count indicator widget inside the modular space */}
                <div className="absolute bottom-4 right-4 p-3.5 rounded-2xl bg-zinc-950/90 text-white backdrop-blur border border-white/10 text-left max-w-[130px] shadow-xl space-y-0.5">
                  <p className="text-[9px] font-mono font-black tracking-wider text-indigo-400 uppercase leading-none">NETWORK HUB</p>
                  <p className="text-sm font-black tracking-tight leading-none">ACTIVE</p>
                  <p className="text-[10px] font-mono text-zinc-400">All Nodes Live</p>
                </div>

              </div>
            </div>

          </div>

        </div>

          {/* THREE BOTTOM SECTIONS WITH THIN DIVIDERS & MODERN ICONOGRAPHY (c5f745a834-like footer layout) */}
          <div className="border-t border-zinc-150 dark:border-white/5 mt-10 md:mt-12 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            
            {/* Compartment 1 */}
            <div className="space-y-2 group/comp cursor-pointer">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 text-green-500 transition-colors group-hover/comp:bg-green-500/10">
                  <Users className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1">
                  <span>{language === "FR" ? "Monde de Possibilités" : "A World of Possibilities"}</span>
                  <span className="text-green-500 group-hover/comp:translate-x-1 transition-transform inline-block">&gt;</span>
                </h4>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                {language === "FR" 
                  ? "Découvrez notre annuaire de talents validés et nos événements exclusifs organisés localement."
                  : "Discover our comprehensive registry of validated tech talents and exclusive local community events."}
              </p>
            </div>

            {/* Compartment 2 */}
            <div className="space-y-2 group/comp cursor-pointer">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 text-yellow-500 transition-colors group-hover/comp:bg-yellow-500/10">
                  <Award className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1">
                  <span>{language === "FR" ? "La Qualité en Confiance" : "Quality You Can Trust"}</span>
                  <span className="text-yellow-500 group-hover/comp:translate-x-1 transition-transform inline-block">&gt;</span>
                </h4>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                {language === "FR" 
                  ? "Explorez des profils vérifiés avec des compétences professionnelles évaluées avec exactitude."
                  : "Explore certified profiles with assessed technical expertise and real direct project references."}
              </p>
            </div>

            {/* Compartment 3 */}
            <div className="space-y-2 group/comp cursor-pointer">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 text-purple-500 transition-colors group-hover/comp:bg-purple-500/10">
                  <Code className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1">
                  <span>{language === "FR" ? "Projets Collaboratifs" : "Get Projects Faster"}</span>
                  <span className="text-purple-500 group-hover/comp:translate-x-1 transition-transform inline-block">&gt;</span>
                </h4>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                {language === "FR" 
                  ? "Associez-vous à d'autres développeurs africains d'élite et livrez des solutions tech d'excellence."
                  : "Team up with elite African developers to construct and deploy production-grade software solutions."}
              </p>
            </div>

          </div>

      </section>

      {/* 2. Live Togo Community Stats Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-950/40 rounded-3xl border border-zinc-200/50 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-green-500/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-yellow-400/5 blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
                {getTranslation(language, "communityStats")}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {getTranslation(language, "aboutTogoCommunityText")}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                <Sparkles className="h-3 w-3 text-green-500 shrink-0" />
                <span className="text-xs font-mono">
                  Données simulées locales sauvegardées en temps réel
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-3 gap-4 sm:gap-6">
              
              {/* Stat 1 */}
              <div className="bg-white dark:bg-[#09090b]/60 border border-zinc-200/60 dark:border-white/10 p-6 rounded-2xl text-center space-y-1 shadow-sm hover:border-green-500/30 transition-colors">
                <div className="flex justify-center text-green-500">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {togoDevelopersCount}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {getTranslation(language, "totalDevelopers")}
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white dark:bg-[#09090b]/60 border border-zinc-200/60 dark:border-white/10 p-6 rounded-2xl text-center space-y-1 shadow-sm hover:border-green-500/30 transition-colors">
                <div className="flex justify-center text-yellow-500">
                  <Code className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {togoProjectsCount}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {getTranslation(language, "activeProjects")}
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white dark:bg-[#09090b]/60 border border-zinc-200/60 dark:border-white/10 p-6 rounded-2xl text-center space-y-1 shadow-sm hover:border-green-500/30 transition-colors">
                <div className="flex justify-center text-green-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {togoEventsCount}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {getTranslation(language, "scheduledEvents")}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Highlighted Togo Developers Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
                {getTranslation(language, "exploreProfiles")}
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Découvrez les talents africains par excellence basés à Lomé, Dakar, Abidjan, Lagos, Nairobi et au-delà.
            </p>
          </div>
          <button
            onClick={() => setView("dashboard")}
            className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 group self-start sm:self-auto"
          >
            {getTranslation(language, "exploreProfiles")} ({profiles.length})
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.slice(0, 6).map((dev) => (
            <motion.div
              key={dev.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedDevId(dev.id)}
              className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-green-500/20 dark:hover:border-green-500/30 transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                
                {/* Header Profile */}
                <div className="flex gap-4">
                  <DeveloperAvatar
                    name={dev.name}
                    avatar={dev.avatar}
                    sizeClassName="h-14 w-14"
                  />
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex items-center gap-1.5">
                      {dev.name}
                      {dev.email === "michelame.yovo@gmail.com" && (
                        <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-bold font-mono">
                          PRO
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {dev.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-zinc-400 dark:text-zinc-500 text-[11px]">
                      <MapPin className="h-3 w-3 text-yellow-500" />
                      <span>{dev.location}{getFlagForLocation(dev.location)}</span>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {dev.bio}
                </p>

                {/* Skills badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dev.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300 border border-zinc-200/40 dark:border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                  {dev.skills.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-green-500 font-semibold">
                      +{dev.skills.length - 4}
                    </span>
                  )}
                </div>

              </div>

              <div className="border-t border-zinc-100 dark:border-white/5 mt-5 pt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <span 
                  onClick={() => setSelectedDevId(dev.id)}
                  className="text-[10px] font-bold text-green-600 dark:text-green-400 group-hover:underline cursor-pointer"
                >
                  Voir le profil complet
                </span>
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
                      : "bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/25"
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
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Showcase Top Togo Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.4)]"></span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
                {getTranslation(language, "viewProjects")}
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Des applications concrètes construites par la communauté pour répondre aux besoins locaux du continent africain.
            </p>
          </div>
          <button
            onClick={() => setView("projects")}
            className="text-xs font-bold text-yellow-500 hover:underline flex items-center gap-1 group self-start sm:self-auto"
          >
            Explorer tous les projets ({projects.length})
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-yellow-500/20 dark:hover:border-yellow-500/30 transition-all"
            >
              <div className="space-y-4">
                
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <DeveloperAvatar
                    name={proj.authorName}
                    avatar={proj.authorAvatar}
                    sizeClassName="h-5 w-5 text-[8px]"
                  />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {getTranslation(language, "author")} : <strong className="font-semibold text-zinc-700 dark:text-zinc-300">{proj.authorName}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white hover:text-green-500 dark:hover:text-green-400 cursor-pointer" onClick={() => setView("projects")}>
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                    {proj.description}
                  </p>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border dark:border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

              <div className="border-t border-zinc-100 dark:border-white/5 mt-6 pt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleLikeProject(proj.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                  <span>{proj.likes}</span>
                </button>
                <div className="flex items-center gap-3 text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                    >
                      GitHub
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-green-600 dark:text-green-400 hover:underline"
                    >
                      Demo Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Highlighted Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
                {getTranslation(language, "upcomingEvents")}
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Formations IA, Meetups Javascript, Hackathons, et Ateliers interactifs à Lomé, Dakar, Abidjan, Lagos, Nairobi et en ligne.
            </p>
          </div>
          <button
            onClick={() => setView("events")}
            className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 group self-start sm:self-auto"
          >
            Voir tous les événements ({events.length})
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.slice(0, 2).map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-green-500/20 dark:hover:border-green-500/30 transition-all relative overflow-hidden"
            >
              {/* Event Badge City */}
              <div className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3 text-yellow-500" />
                {evt.location}
              </div>

              <div className="space-y-4">
                <div className="text-xs text-green-600 dark:text-green-400 font-mono font-bold tracking-wider">
                  {getFormattedDate(language, evt.date)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{getTranslation(language, "venue")} :</span>
                    <span>{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{getTranslation(language, "organizedBy")} :</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">{evt.organizer}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-white/5 mt-6 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <span>{evt.attendees.length} {getTranslation(language, "attendeesCount")}</span>
                </div>
                <button
                  onClick={() => toggleAttendEvent(evt.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentUser && evt.attendees.includes(currentUser.id)
                      ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200"
                      : "bg-green-500 text-black hover:bg-green-400 shadow-sm shadow-green-500/10 font-bold"
                  }`}
                >
                  {currentUser && evt.attendees.includes(currentUser.id)
                    ? getTranslation(language, "leaveEvent")
                    : getTranslation(language, "joinEvent")
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. High-polish Developer Profile Details Modal */}
      {selectedDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDevId(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
            >
              &times;
            </button>

            {/* Banner block color */}
            <div className="h-32 bg-gradient-to-r from-zinc-900 via-zinc-800 to-indigo-950 relative">
              <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:linear-gradient(to-bottom,white,transparent)]" />
              <div className="absolute top-4 right-1/4 h-20 w-40 bg-indigo-500/10 blur-2xl rounded-full" />
            </div>

            <div className="px-6 pb-8 -mt-16 space-y-6">
              
              {/* Profile Meta Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <DeveloperAvatar
                  name={selectedDev.name}
                  avatar={selectedDev.avatar}
                  sizeClassName="h-28 w-28 text-3xl ring-4 ring-white dark:ring-zinc-950 shadow-lg"
                />
                <div className="pb-1">
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    {selectedDev.name}
                    {selectedDev.email === "michelame.yovo@gmail.com" && (
                      <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold">
                        PRO
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {selectedDev.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5 text-yellow-500" />
                    <span>{selectedDev.location}{getFlagForLocation(selectedDev.location)}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span>{selectedDev.email}</span>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {getTranslation(language, "bio")}
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850">
                  {selectedDev.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {getTranslation(language, "skills")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDev.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Links */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <h4 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {getTranslation(language, "links")}
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedDev.github && (
                    <a
                      href={selectedDev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      GitHub Profile
                    </a>
                  )}
                  {selectedDev.linkedin && (
                    <a
                      href={selectedDev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-sm font-semibold text-green-700 dark:text-green-300 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Professional
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Footer detail */}
            <div className="bg-zinc-50 dark:bg-zinc-900 px-6 py-4 flex justify-between items-center text-xs text-zinc-500">
              <span>DevConnect verified profile</span>
              <button
                onClick={() => setSelectedDevId(null)}
                className="font-bold text-green-600 dark:text-green-400 hover:underline"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
