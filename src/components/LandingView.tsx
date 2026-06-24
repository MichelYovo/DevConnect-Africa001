import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getFormattedDate } from "../i18n";
import { motion } from "motion/react";
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
    currentUser
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

  const selectedDev = profiles.find(p => p.id === selectedDevId);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section (Bento Grid & Glass style) */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_50%_-10rem,rgba(34,197,94,0.06),transparent)]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-green-500/5 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 h-48 w-48 rounded-full bg-yellow-400/5 blur-3xl animate-pulse"></div>

        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          
          {/* Togo Tech Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-500/20 dark:border-green-500/30 bg-green-50/50 dark:bg-green-950/10 px-4 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400 backdrop-blur"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{getTranslation(language, "togoPriority")}</span>
            <span className="text-zinc-300 dark:text-zinc-700 font-normal">|</span>
            <span className="flex items-center gap-1">
              🇹🇬 Lomé • Kara • Kpalimé
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-none"
          >
            {getTranslation(language, "landingTitle")}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            {getTranslation(language, "landingSubtitle")}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={handleJoinCommunity}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold shadow-md shadow-green-500/15 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {getTranslation(language, "getStarted")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setView("projects")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-[#09090b] hover:text-zinc-950 dark:hover:text-white transition-all backdrop-blur"
            >
              {getTranslation(language, "viewProjects")}
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. Live Togo Community Stats Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-50 dark:bg-zinc-950/40 rounded-3xl border border-zinc-200/50 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-green-500/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-yellow-400/5 blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-yellow-400" />
                TOGO EXCELLENCE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {getTranslation(language, "communityStats")}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {getTranslation(language, "aboutTogoCommunityText")}
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                  ⚡ Données simulées locales sauvegardées en temps réel
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
              <span className="h-1.5 w-6 rounded bg-green-500"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {getTranslation(language, "exploreProfiles")} (Togo 🇹🇬)
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Découvrez les talents togolais par excellence basés à Lomé, Kara, Kpalimé et au-delà.
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
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-green-500/10 group-hover:ring-green-500 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex items-center gap-1.5">
                      {dev.name}
                      <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-bold font-mono">
                        PRO
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {dev.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-zinc-400 dark:text-zinc-500 text-[11px]">
                      <MapPin className="h-3 w-3 text-yellow-500" />
                      <span>{dev.location}, Togo 🇹🇬</span>
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

              <div className="border-t border-zinc-100 dark:border-white/5 mt-5 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 group-hover:underline">
                  Voir le profil complet
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {dev.email.includes("demo") ? "Compte Certifié" : "Nouveau"}
                </span>
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
              <span className="h-1.5 w-6 rounded bg-yellow-400"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {getTranslation(language, "viewProjects")} (Togo 🇹🇬)
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Des applications concrètes construites par la communauté pour répondre aux besoins locaux du Togo.
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
                  <img
                    src={proj.authorAvatar}
                    alt={proj.authorName}
                    className="h-5 w-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
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
              <span className="h-1.5 w-6 rounded bg-green-500"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {getTranslation(language, "upcomingEvents")} (Togo 🇹🇬)
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Formations IA, Meetups Javascript, Hackathons, et Ateliers interactifs à Lomé, Kara et Kpalimé.
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
            <div className="h-32 bg-gradient-to-r from-green-500 to-yellow-400"></div>

            <div className="px-6 pb-8 -mt-16 space-y-6">
              
              {/* Profile Meta Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <img
                  src={selectedDev.avatar}
                  alt={selectedDev.name}
                  className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white dark:ring-zinc-950 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="pb-1">
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    {selectedDev.name}
                    <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold">
                      PRO
                    </span>
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {selectedDev.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5 text-yellow-500" />
                    <span>{selectedDev.location}, Togo 🇹🇬</span>
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
