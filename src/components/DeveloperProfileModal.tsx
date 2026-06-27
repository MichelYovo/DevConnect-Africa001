import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import DeveloperAvatar from "./DeveloperAvatar";
import { getFlagForLocation } from "../types";
import { 
  X, 
  MapPin, 
  Mail, 
  Github, 
  Linkedin, 
  Code, 
  Calendar, 
  Send, 
  Check, 
  MessageSquare,
  Sparkles,
  Briefcase
} from "lucide-react";

export default function DeveloperProfileModal() {
  const { 
    selectedProfileId, 
    setSelectedProfileId, 
    profiles, 
    projects, 
    events, 
    language,
    currentUser,
    showToast
  } = useApp();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: "me" | "them"; text: string; time: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "events" | "chat">("about");

  if (!selectedProfileId) return null;

  const profile = profiles.find(p => p.id === selectedProfileId);
  if (!profile) return null;

  // Find projects authored by this developer
  const devProjects = projects.filter(p => p.authorId === profile.id);

  // Find events organized or attended by this developer
  const devEvents = events.filter(e => e.attendees.includes(profile.id) || e.organizerId === profile.id);

  // Simulated online/offline status (all users in the tech ecosystem are active)
  const isOnline = profile.id === currentUser?.id || !profile.email.includes("offline");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (!currentUser) {
      showToast(
        language === "FR" 
          ? "Veuillez vous connecter pour envoyer un message." 
          : "Please log in to send a message.", 
        "error"
      );
      return;
    }

    setIsSending(true);
    const userMsg = messageText;
    setMessageText("");

    // Add user message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: "me", text: userMsg, time: now }]);

    setTimeout(() => {
      setIsSending(false);
      // Automatic smart reply from the connected developer
      const automaticRepliesFr = [
        `Salut ! Merci pour ton message. Je suis très intéressé par ton profil et j'aimerais beaucoup collaborer sur des projets web.`,
        `Bonjour ! Merci d'avoir pris contact. Je suis actuellement basé à ${profile.location} et ouvert à de nouvelles opportunités. Parlons-en plus en détail !`,
        `Ravi de te connecter ! Ton message m'intéresse beaucoup. Je te recontacte très vite dès que je me libère du code !`,
        `Génial de voir d'autres passionnés de tech en Afrique ! Faisons un appel Zoom ou un café virtuel bientôt.`
      ];

      const automaticRepliesEn = [
        `Hi! Thanks for reaching out. I am really interested in your profile and would love to collaborate on some web projects.`,
        `Hello! Thanks for connecting. I am currently based in ${profile.location} and open to new opportunities. Let's discuss further!`,
        `Nice to connect with you! I got your message and will get back to you as soon as I finish my current coding session.`,
        `Great to connect with fellow tech enthusiasts in Africa! Let's arrange a virtual coffee or Zoom call soon.`
      ];

      const replies = language === "FR" ? automaticRepliesFr : automaticRepliesEn;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setChatHistory(prev => [...prev, { 
        sender: "them", 
        text: randomReply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      
      showToast(
        language === "FR" 
          ? `Nouveau message de ${profile.name}` 
          : `New message from ${profile.name}`, 
        "info"
      );
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setSelectedProfileId(null)}
      />

      {/* Modal Container */}
      <div 
        className="bg-white dark:bg-[#0c0c0e] border border-zinc-200/80 dark:border-white/10 rounded-[28px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        id="dev-profile-modal"
      >
        {/* Banner with color flare */}
        <div className="h-32 bg-gradient-to-r from-zinc-900 via-zinc-800 to-green-950 relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(t-bottom,white,transparent)]"></div>
          {/* Subtle color spot */}
          <div className="absolute top-4 right-1/4 h-20 w-40 bg-green-500/10 blur-2xl rounded-full"></div>
          
          {/* Close button */}
          <button 
            onClick={() => setSelectedProfileId(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/5"
            id="close-profile-modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute -bottom-10 left-6 sm:left-8 flex items-end gap-3.5">
            <DeveloperAvatar 
              name={profile.name} 
              avatar={profile.avatar} 
              sizeClassName="h-20 w-20 sm:h-24 sm:w-24 text-xl ring-4 ring-white dark:ring-[#0c0c0e] rounded-[24px]"
              status={isOnline}
            />
            <div className="mb-2 hidden sm:block">
              {isOnline ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {language === "FR" ? "Connecté(e)" : "Online"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold">
                  {language === "FR" ? "Hors ligne" : "Offline"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Info Header */}
        <div className="pt-12 sm:pt-14 px-6 sm:px-8 pb-4 border-b border-zinc-100 dark:border-white/5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                {profile.name}
              </h2>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {profile.title}
              </p>
            </div>
            
            {/* Location & flag */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-yellow-500" />
              <span>{profile.location}{getFlagForLocation(profile.location)}</span>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a 
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-green-500 dark:text-zinc-400 dark:hover:text-green-400 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="font-mono">{profile.email}</span>
            </a>
            {profile.github && (
              <a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 px-6 sm:px-8">
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "about"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {language === "FR" ? "À propos" : "About"}
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "projects"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            {language === "FR" ? "Projets" : "Projects"}
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              {devProjects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "events"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            {language === "FR" ? "Événements" : "Events"}
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              {devEvents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "chat"
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-green-500" />
            {language === "FR" ? "Discuter" : "Chat"}
            {chatHistory.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
            )}
          </button>
        </div>

        {/* Tab content area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 min-h-[250px]">
          
          {/* TAB: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Bio block */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-green-500" />
                  {language === "FR" ? "BIOGRAPHIE" : "BIOGRAPHY"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-black/30 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                  {profile.bio || (language === "FR" ? "Aucune biographie rédigée pour le moment." : "No biography provided yet.")}
                </p>
              </div>

              {/* Skills block */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  {language === "FR" ? "COMPÉTENCES CLÉS" : "KEY SKILLS"}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-green-500/5 text-green-600 dark:text-green-400 border border-green-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status block (for mobile layout support) */}
              <div className="sm:hidden border-t border-zinc-100 dark:border-white/5 pt-4 flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-500">Status:</span>
                {isOnline ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    {language === "FR" ? "En ligne" : "Online"}
                  </span>
                ) : (
                  <span className="text-zinc-400">{language === "FR" ? "Hors ligne" : "Offline"}</span>
                )}
              </div>

            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {language === "FR" 
                  ? `PROJETS PUBLIÉS PAR ${profile.name.toUpperCase()}` 
                  : `PROJECTS PUBLISHED BY ${profile.name.toUpperCase()}`}
              </h3>

              {devProjects.length === 0 ? (
                <div className="text-center py-8 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-dashed dark:border-white/5">
                  <Code className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">
                    {language === "FR" 
                      ? "Ce développeur n'a pas encore partagé de projets." 
                      : "This developer has not shared any projects yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {devProjects.map((proj) => (
                    <div 
                      key={proj.id} 
                      className="p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-[#0f0f11]/30 hover:border-green-500/20 dark:hover:border-green-500/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex justify-between items-center">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-zinc-400 font-normal">
                            {new Date(proj.createdAt).toLocaleDateString()}
                          </span>
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                          {proj.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {proj.techStack.map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {language === "FR" ? "ÉVÉNEMENTS LIÉS" : "RELATED EVENTS"}
              </h3>

              {devEvents.length === 0 ? (
                <div className="text-center py-8 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-dashed dark:border-white/5">
                  <Calendar className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">
                    {language === "FR" 
                      ? "Ce développeur ne participe à aucun événement pour le moment." 
                      : "This developer is not participating in any events yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {devEvents.map((evt) => {
                    const isOrganizer = evt.organizerId === profile.id;
                    return (
                      <div 
                        key={evt.id} 
                        className="p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-[#0f0f11]/30 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mb-2 ${
                              isOrganizer 
                                ? "bg-amber-500/10 text-amber-500" 
                                : "bg-green-500/10 text-green-500"
                            }`}>
                              {isOrganizer 
                                ? (language === "FR" ? "Organisateur" : "Organizer") 
                                : (language === "FR" ? "Participant" : "Attendee")}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                              {evt.title}
                            </h4>
                          </div>
                          <div className="text-right text-[10px] font-mono text-zinc-400">
                            {new Date(evt.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-2 font-mono">
                          <MapPin className="h-3 w-3 text-yellow-500" />
                          <span>{evt.venue}, {evt.location}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: CHAT / CONVERSATION */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-full max-h-[350px] animate-in fade-in duration-150">
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1 min-h-[160px] scrollbar-thin">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-500 space-y-2">
                    <MessageSquare className="h-8 w-8 mx-auto text-zinc-300" />
                    <p>
                      {language === "FR" 
                        ? `Envoyez un message direct à ${profile.name} pour démarrer une collaboration !` 
                        : `Send a direct message to ${profile.name} to start collaborating!`}
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col ${chat.sender === "me" ? "items-end" : "items-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        chat.sender === "me"
                          ? "bg-green-500 text-black font-semibold rounded-tr-none"
                          : "bg-zinc-100 dark:bg-[#1a1a1e] text-zinc-900 dark:text-zinc-200 rounded-tl-none border dark:border-white/5"
                      }`}>
                        {chat.text}
                      </div>
                      <span className="text-[9px] text-zinc-400 font-mono mt-0.5 px-1">{chat.time}</span>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-xs px-2 font-mono">
                    <span className="h-1 w-1 rounded-full bg-green-500 animate-ping"></span>
                    <span>{profile.name} {language === "FR" ? "écrit..." : "is typing..."}</span>
                  </div>
                )}
              </div>

              {/* Message send form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-zinc-100 dark:border-white/5 pt-3">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={
                    language === "FR" 
                      ? `Écrire à ${profile.name}...` 
                      : `Write to ${profile.name}...`
                  }
                  className="flex-1 bg-zinc-50 dark:bg-[#111113] border dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-green-500 focus:bg-white text-zinc-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  className="p-2.5 rounded-xl bg-green-500 text-black hover:bg-green-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-md shadow-green-500/15"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-black/40 border-t border-zinc-100 dark:border-white/5 px-6 sm:px-8 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-[10px] font-mono text-zinc-400">
          <span>ID: {profile.id}</span>
          <span>{language === "FR" ? "Rejoint le :" : "Joined on:"} {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>

      </div>
    </div>
  );
}
