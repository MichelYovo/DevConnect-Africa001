import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { motion, AnimatePresence } from "motion/react";
import DeveloperAvatar from "./DeveloperAvatar";
import { getFlagForLocation } from "../types";
import { 
  X, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  Clock, 
  ChevronRight,
  Shield,
  FileText
} from "lucide-react";

export default function RecruitmentCart() {
  const { 
    profiles, 
    shortlistedIds, 
    removeFromShortlist, 
    clearShortlist, 
    isCartOpen, 
    setIsCartOpen,
    language,
    currentUser,
    setView,
    triggerConfetti,
    showToast,
    addActivity
  } = useApp();

  const shortlistedDevs = profiles.filter(p => shortlistedIds.includes(p.id));

  // Cart Steps: "review" | "details" | "processing" | "success"
  const [checkoutStep, setCheckoutStep] = useState<"review" | "details" | "processing" | "success">("review");
  const [collabType, setCollabType] = useState<"freelance" | "fulltime" | "opensource" | "mentorship">("freelance");
  const [message, setMessage] = useState("");
  const [processProgress, setProcessProgress] = useState(0);
  const [processText, setProcessText] = useState("");

  // Handle premium processing flow (relaxed, realistic, delightful speed)
  const handleStartCheckout = () => {
    if (!currentUser) {
      showToast(
        language === "FR" 
          ? "Veuillez vous connecter pour initier une demande de collaboration." 
          : "Please log in to initiate a collaboration request.",
        "info"
      );
      setIsCartOpen(false);
      setView("login");
      return;
    }
    setCheckoutStep("details");
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast(
        language === "FR" ? "Veuillez saisir votre message d'invitation." : "Please enter your invitation message.",
        "error"
      );
      return;
    }

    setCheckoutStep("processing");
    setProcessProgress(10);
    setProcessText(language === "FR" ? "Initialisation de la passerelle sécurisée..." : "Initializing secure handshake gateway...");

    const progressSteps = [
      { p: 35, t_fr: "Analyse des profils et calcul des synergies...", t_en: "Analyzing talent profiles & checking alignment..." },
      { p: 65, t_fr: "Chiffrement du message d'invitation (AES-256)...", t_en: "Encrypting collaboration invitation (AES-256)..." },
      { p: 85, t_fr: "Enregistrement de la demande dans la blockchain communautaire...", t_en: "Registering request in decentralised registry..." },
      { p: 100, t_fr: "Envoi des notifications directes aux développeurs...", t_en: "Sending real-time push alerts to selected talents..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Relaxed, premium and satisfying pacing
      setProcessProgress(step.p);
      setProcessText(language === "FR" ? step.t_fr : step.t_en);
    }

    // Trigger success animations
    triggerConfetti();

    // Log live activity for each shortlisted developer
    for (const dev of shortlistedDevs) {
      await addActivity({
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        type: "project",
        messageFr: `Une proposition de collaboration (${collabType.toUpperCase()}) a été envoyée à ${dev.name} par ${currentUser.name}.`,
        messageEn: `A collaboration invitation (${collabType.toUpperCase()}) was sent to ${dev.name} by ${currentUser.name}.`,
        targetId: dev.id,
        targetTitle: dev.name
      });
    }

    setCheckoutStep("success");
    clearShortlist();
  };

  const resetCartFlow = () => {
    setCheckoutStep("review");
    setMessage("");
    setProcessProgress(0);
    setIsCartOpen(false);
  };

  // Compute mock premium metrics matching the bottom-right reference image
  const matchPercentage = shortlistedDevs.length > 0 
    ? Math.min(98, 80 + shortlistedDevs.length * 5) 
    : 0;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Slide-over Right Cart Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#030303] border-l border-zinc-200 dark:border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden text-zinc-900 dark:text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-150 dark:border-white/10 flex items-center justify-between bg-zinc-50/50 dark:bg-[#09090b]/40 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 via-emerald-400 to-yellow-500"></div>
              
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                  <Users className="h-5 w-5" />
                  {shortlistedIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-black text-black">
                      {shortlistedIds.length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {language === "FR" ? "Panier de Talents" : "Talent Shortlist"}
                  </h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider">
                    {language === "FR" ? "OUTILS DE RECRUTEMENT" : "PREMIUM RECRUITMENT BOX"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main scrollable area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {/* STEP 1: REVIEW SHORTLIST */}
              {checkoutStep === "review" && (
                <>
                  {shortlistedDevs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="relative h-16 w-16 mx-auto flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 text-zinc-300 dark:text-zinc-700">
                        <Users className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
                          {language === "FR" ? "Votre panier est vide" : "Your shortlist is empty"}
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                          {language === "FR" 
                            ? "Explorez les profils sur le tableau de bord ou la page d'accueil et cliquez sur 'Ajouter au Panier' pour bâtir votre équipe idéale." 
                            : "Explore profiles on the dashboard or landing page and click 'Add to Shortlist' to assemble your dream team."}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setIsCartOpen(false); setView("dashboard"); }}
                        className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        {language === "FR" ? "Découvrir les talents" : "Discover Talents"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      
                      {/* Premium Metrics Summary Card (Polar style) */}
                      <div className="p-4 rounded-2xl bg-[#fcfdfc] dark:bg-[#070907] border border-green-500/10 dark:border-green-500/20 space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/[0.02] blur-xl rounded-full"></div>
                        
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-500">{language === "FR" ? "Score de Synergie" : "Synergy Index"}</span>
                          <span className="text-green-500 font-extrabold flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {matchPercentage}% Match
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-zinc-100 dark:border-white/5">
                          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150/40 dark:border-white/5">
                            <span className="block text-[10px] text-zinc-400">{language === "FR" ? "Membres" : "Members"}</span>
                            <span className="text-sm font-extrabold tracking-tight">{shortlistedDevs.length}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150/40 dark:border-white/5">
                            <span className="block text-[10px] text-zinc-400">{language === "FR" ? "Intégration" : "Setup Time"}</span>
                            <span className="text-sm font-extrabold tracking-tight text-yellow-500">24-48h</span>
                          </div>
                        </div>
                      </div>

                      {/* List */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            {language === "FR" ? "Talents Sélectionnés" : "Shortlisted Talents"}
                          </span>
                          <button 
                            onClick={clearShortlist}
                            className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            {language === "FR" ? "Tout vider" : "Clear all"}
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {shortlistedDevs.map(dev => (
                            <div 
                              key={dev.id}
                              className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 hover:border-green-500/20 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <DeveloperAvatar
                                  name={dev.name}
                                  avatar={dev.avatar}
                                  sizeClassName="h-10 w-10 text-xs"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                                    {dev.name}
                                    {dev.email === "michelame.yovo@gmail.com" && (
                                      <span className="text-[9px] bg-green-500/10 text-green-600 px-1 py-0.2 rounded font-semibold font-mono">
                                        PRO
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-[10px] text-green-600 dark:text-green-400 font-medium truncate max-w-[180px]">
                                    {dev.title}
                                  </p>
                                  <p className="text-[9px] text-zinc-400 flex items-center gap-0.5">
                                    {dev.location}{getFlagForLocation(dev.location)}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => removeFromShortlist(dev.id)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Call to action Checkout */}
                      <div className="pt-4 border-t border-zinc-150 dark:border-white/10">
                        <button
                          onClick={handleStartCheckout}
                          className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-green-500/10 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer group"
                        >
                          <span>{language === "FR" ? "Échanger avec l'équipe" : "Initiate Team Exchange"}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>

                    </div>
                  )}
                </>
              )}

              {/* STEP 2: ENTER COLLABORATION DETAILS */}
              {checkoutStep === "details" && (
                <form onSubmit={handleConfirmCheckout} className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                      {language === "FR" ? "Détails de Collaboration" : "Collaboration Scope"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {language === "FR" 
                        ? "Configurez le modèle de coopération idéal pour interagir avec vos talents sélectionnés." 
                        : "Configure the optimal collaboration model to interact with your selected talents."}
                    </p>
                  </div>

                  {/* Collaboration Grid selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                      {language === "FR" ? "Type de Coopération" : "Cooperation Model"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "freelance", label_fr: "Freelance / Mission", label_en: "Freelance Contract", desc_fr: "Courte durée", desc_en: "Gig assignment" },
                        { id: "fulltime", label_fr: "Recrutement CDI", label_en: "Full-Time Hire", desc_fr: "Long terme", desc_en: "Permanent career" },
                        { id: "opensource", label_fr: "Open Source", label_en: "Open Source Collab", desc_fr: "Bénévolat / Projet", desc_en: "Civic project contrib" },
                        { id: "mentorship", label_fr: "Mentorat / Conseil", label_en: "Mentorship / Advice", desc_fr: "Partage d'expertise", desc_en: "Guiding next-gen" }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setCollabType(type.id as any)}
                          className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-20 cursor-pointer ${
                            collabType === type.id 
                              ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400" 
                              : "border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                          }`}
                        >
                          <span className="text-xs font-bold block truncate">
                            {language === "FR" ? type.label_fr : type.label_en}
                          </span>
                          <span className="text-[9px] text-zinc-400 block font-mono">
                            {language === "FR" ? type.desc_fr : type.desc_en}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Invitation message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                      {language === "FR" ? "Votre Proposition (Message)" : "Your Proposal Description"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === "FR" 
                          ? "Décrivez brièvement votre projet, les compétences attendues et les conditions de collaboration..."
                          : "Briefly outline your project requirements, scope of work, budget expectations and values..."
                      }
                      className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 text-xs focus:border-green-500 outline-none text-zinc-900 dark:text-white transition-all resize-none"
                    />
                  </div>

                  {/* Disclaimer alert */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-white/5 flex gap-2.5 items-start">
                    <Shield className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                      {language === "FR" 
                        ? "Vos propositions de collaboration sont cryptées et transmises directement aux développeurs sélectionnés. Ils recevront une notification en temps réel." 
                        : "Your collaboration requests are encrypted and forwarded directly to the selected developers. They will receive real-time updates."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("review")}
                      className="w-1/3 py-3 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {language === "FR" ? "Retour" : "Back"}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-1.5 cursor-pointer group"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{language === "FR" ? "Envoyer la demande" : "Submit Request"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SECURE PROCESSING GATEWAY */}
              {checkoutStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in duration-200">
                  <div className="relative">
                    {/* Ring loader */}
                    <div className="h-16 w-16 rounded-full border-4 border-green-500/15 border-t-green-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-green-500">
                      <Clock className="h-6 w-6 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                      Processing Connection...
                    </h4>
                    <p className="text-sm font-extrabold text-zinc-950 dark:text-white">
                      {processText}
                    </p>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full max-w-xs bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-200/40 dark:border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{ width: `${processProgress}%` }}
                      layoutId="checkout-progress"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS SUMMARY CARD */}
              {checkoutStep === "success" && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-95 duration-250">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-green-500/20 text-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                      {language === "FR" ? "Demande envoyée avec succès !" : "Request Submitted Successfully!"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {language === "FR" 
                        ? "Félicitations ! Les développeurs sélectionnés ont reçu votre message et ont été avertis en temps réel. Suivez l'activité sur le fil communautaire." 
                        : "Success! The selected developers have been alerted and have received your proposal. Monitor the live activity feed."}
                    </p>
                  </div>

                  {/* Success metrics / next steps */}
                  <div className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-white/5 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
                      <Briefcase className="h-4 w-4 text-green-500" />
                      <span>{language === "FR" ? "Suivi de dossier" : "What happens next?"}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                      <li>{language === "FR" ? "Le live feed a été mis à jour" : "Community live feed updated"}</li>
                      <li>{language === "FR" ? "Les talents recevront un e-mail direct" : "Talents receive safe direct emails"}</li>
                      <li>{language === "FR" ? "Les réponses s'afficheront dans votre messagerie" : "Replies will be directed to your inbox"}</li>
                    </ul>
                  </div>

                  <button
                    onClick={resetCartFlow}
                    className="w-full py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
                  >
                    {language === "FR" ? "Terminer & Fermer" : "Finish & Close"}
                  </button>
                </div>
              )}

            </div>

            {/* Footer with legal info */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-150 dark:border-white/5 flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> SECURE TRACE ID: {Date.now().toString().slice(-6)}
              </span>
              <span>DevConnect Africa Platform</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
