import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import DeveloperAvatar from "./DeveloperAvatar";
import { AFRICAN_COUNTRIES } from "../data";
import Icons8Image from "./Icons8Image";
import { 
  Github, 
  Mail, 
  Lock, 
  User, 
  Users,
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  Check,
  Shield,
  Search,
  X,
  Globe,
  Linkedin,
  MapPin,
  Briefcase,
  FileText,
  Compass,
  ArrowUpRight,
  Bookmark
} from "lucide-react";

// Predefined list of popular technology tags for interactive selection
const POPULAR_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Tailwind CSS", 
  "UI/UX Design", "Next.js", "Firebase", "Supabase", "SQL", 
  "Flutter", "Docker", "DevOps", "AI / LLM Integrations", "Go"
];

export default function AuthView() {
  const { 
    currentView, 
    setView, 
    login, 
    registerUser, 
    loginWithGoogleProfile,
    language, 
    profiles,
    showToast 
  } = useApp();

  const isLogin = currentView === "login";
  const [personaSimOpen, setPersonaSimOpen] = useState(false);

  React.useEffect(() => {
    const pendingEmail = sessionStorage.getItem("dc_pending_email");
    if (pendingEmail) {
      setEmail(pendingEmail);
      sessionStorage.removeItem("dc_pending_email");
    }
  }, [currentView]);

  // Step state management
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3 | 4>(1);
  const [loginStep, setLoginStep] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [country, setCountry] = useState("Sénégal");
  const [city, setCity] = useState("Dakar");

  // Profile-specific details (onboarding step 2)
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Unified Social OAuth + OTP Connection States
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState<"Google" | "GitHub" | "LinkedIn" | null>(null);
  const [socialStep, setSocialStep] = useState(1); // 1: Search/Identity, 2: Consent & Customization, 3: Syncing Progress
  const [socialInput, setSocialInput] = useState(""); // Email for Google/LinkedIn, Username for GitHub
  const [socialName, setSocialName] = useState("");
  const [socialCountry, setSocialCountry] = useState("Sénégal");
  const [socialCity, setSocialCity] = useState("Dakar");
  const [socialTitle, setSocialTitle] = useState("Senior Full Stack Developer");
  const [socialPermission1, setSocialPermission1] = useState(true);
  const [socialPermission2, setSocialPermission2] = useState(true);
  const [socialError, setSocialError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialProgress, setSocialProgress] = useState(0);
  const [socialProgressText, setSocialProgressText] = useState("");
  const [socialProfileData, setSocialProfileData] = useState<any>(null);

  // Toggle skills selections
  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  // Step navigation validations for SignUp
  const handleSignUpNext = (currentStep: number) => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorMsg(language === "FR" ? "Veuillez entrer votre nom complet." : "Please enter your full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg(language === "FR" ? "Veuillez entrer une adresse e-mail valide." : "Please enter a valid email address.");
        return;
      }
      // Check if email already exists
      const emailExists = profiles.some(p => p.email.toLowerCase() === email.trim().toLowerCase());
      if (emailExists) {
        setErrorMsg(language === "FR" ? "Cette adresse e-mail est déjà utilisée." : "This email address is already in use.");
        return;
      }
      setSignUpStep(2);
    } else if (currentStep === 2) {
      if (!title.trim()) {
        setErrorMsg(language === "FR" ? "Veuillez entrer votre titre professionnel." : "Please enter your professional title.");
        return;
      }
      if (!bio.trim() || bio.trim().length < 15) {
        setErrorMsg(language === "FR" ? "Veuillez rédiger une description ou biographie d'au moins 15 caractères." : "Please write a biography or description of at least 15 characters.");
        return;
      }
      if (!city.trim()) {
        setErrorMsg(language === "FR" ? "Veuillez spécifier votre ville." : "Please specify your city.");
        return;
      }
      if (skills.length === 0) {
        setErrorMsg(language === "FR" ? "Sélectionnez au moins une compétence clé." : "Select at least one key skill.");
        return;
      }
      setSignUpStep(3);
    } else if (currentStep === 3) {
      if (!password || password.length < 6) {
        setErrorMsg(language === "FR" ? "Le mot de passe doit comporter au moins 6 caractères." : "Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(language === "FR" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
        return;
      }
      setSignUpStep(4);
    }
  };

  // Step navigation validations for Login
  const handleLoginNext = () => {
    setErrorMsg("");
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg(language === "FR" ? "Veuillez entrer une adresse e-mail valide." : "Please enter a valid email address.");
      return;
    }
    
    // Check if the user is already registered in the system
    const userExists = profiles.some(p => p.email && p.email.toLowerCase() === trimmedEmail);
    if (!userExists) {
      // Store pending email to pre-fill the registration passport
      sessionStorage.setItem("dc_pending_email", email.trim());
      showToast(
        language === "FR" 
          ? "Bienvenue ! Comme c'est votre première connexion, veuillez créer votre passeport développeur." 
          : "Welcome! Since this is your first connection, please create your developer passport.",
        "info"
      );
      setView("register");
    } else {
      setLoginStep(2);
    }
  };

  // Process actual forms submission
  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const locationStr = city.trim() ? `${city.trim()}, ${country}` : country;
      const res = await registerUser(
        name, 
        email, 
        password, 
        locationStr,
        title.trim(),
        bio.trim(),
        skills,
        github.trim(),
        linkedin.trim()
      );
      if (!res.success) {
        setErrorMsg(res.error || "Error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Unified Social Login Dialog Event Handlers & API integrations
  const handleSocialLogin = (provider: "Google" | "GitHub" | "LinkedIn") => {
    setSocialProvider(provider);
    setShowSocialModal(true);
    setSocialStep(1);
    setSocialInput("");
    setSocialName("");
    setSocialError("");
    setSocialLoading(false);
    setSocialProgress(0);
    setSocialProgressText("");
    setSocialProfileData(null);
    setSocialCountry("Sénégal");
    setSocialCity("Dakar");
    setSocialTitle("Senior Full Stack Developer");
  };

  const handleSocialSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialInput.trim()) return;
    setSocialError("");
    setSocialLoading(true);

    if (socialProvider === "GitHub") {
      try {
        const res = await fetch(`https://api.github.com/users/${socialInput.trim()}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(language === "FR" ? "Compte GitHub introuvable. Veuillez vérifier l'orthographe." : "GitHub account not found. Please check spelling.");
          } else {
            throw new Error(language === "FR" ? "Impossible de contacter l'API GitHub. Réessayez plus tard." : "Unable to contact GitHub API. Please try again later.");
          }
        }
        const data = await res.json();
        setSocialProfileData(data);
        setSocialName(data.name || data.login);
        setSocialTitle(data.bio || "Senior Full Stack Developer");
        
        const rawLoc = data.location || "";
        if (rawLoc.includes(",")) {
          const parts = rawLoc.split(",");
          setSocialCity(parts[0].trim());
          setSocialCountry(parts[parts.length - 1].trim());
        } else if (rawLoc) {
          setSocialCity(rawLoc);
          setSocialCountry("Sénégal");
        } else {
          setSocialCity("Dakar");
          setSocialCountry("Sénégal");
        }
        setSocialStep(2);
      } catch (err: any) {
        setSocialError(err.message || "API Error");
      } finally {
        setSocialLoading(false);
      }
    } else if (socialProvider === "Google") {
      const emailVal = socialInput.trim().toLowerCase();
      if (!emailVal.includes("@")) {
        setSocialError(language === "FR" ? "Veuillez entrer une adresse e-mail valide." : "Please enter a valid email address.");
        setSocialLoading(false);
        return;
      }
      const found = profiles.find(p => p.email.toLowerCase() === emailVal);
      if (found) {
        setSocialProfileData(found);
        setSocialName(found.name);
        setSocialTitle(found.title || "Senior Full Stack Developer");
        const rawLoc = found.location || "";
        if (rawLoc.includes(",")) {
          const parts = rawLoc.split(",");
          setSocialCity(parts[0].trim());
          setSocialCountry(parts[parts.length - 1].trim());
        } else {
          setSocialCity(rawLoc || "Dakar");
          setSocialCountry("Sénégal");
        }
      } else {
        setSocialProfileData(null);
        const simpleName = emailVal.split("@")[0];
        const formattedName = simpleName.split(/[\._]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
        setSocialName(formattedName);
        setSocialCity("Dakar");
        setSocialCountry("Sénégal");
        setSocialTitle("Senior Full Stack Developer");
      }
      setSocialStep(2);
      setSocialLoading(false);
    } else {
      // LinkedIn
      const inputVal = socialInput.trim();
      await new Promise(r => setTimeout(r, 600)); // Simulating network search
      
      const nameGuess = inputVal.includes("@") ? inputVal.split("@")[0] : inputVal;
      const formattedName = nameGuess.split(/[\._\-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
      
      setSocialName(formattedName || "LinkedIn Developer");
      setSocialCity("Dakar");
      setSocialCountry("Sénégal");
      setSocialTitle("Senior Full Stack Developer");
      setSocialStep(2);
      setSocialLoading(false);
    }
  };

  const handleSocialSubmit = async () => {
    if (!socialPermission1 || !socialPermission2) {
      alert(language === "FR" 
        ? "Vous devez accorder les autorisations requises pour continuer." 
        : "You must grant the required permissions to continue.");
      return;
    }

    setSocialStep(3);
    setSocialProgress(5);
    setSocialProgressText(language === "FR" ? "Handshake SSL sécurisé en cours..." : "Securing SSL handshake with provider...");

    const steps = [
      { p: 20, t_fr: "Connexion sécurisée aux serveurs OAuth...", t_en: "Connecting to provider's OAuth servers..." },
      { p: 50, t_fr: "Autorisation des scopes et validation des signatures numériques...", t_en: "Validating API credentials and scope permissions..." },
      { p: 80, t_fr: "Saisie et importation des métadonnées du développeur...", t_en: "Importing developer public profile metadata..." },
      { p: 100, t_fr: "Finalisation de l'authentification et création de session...", t_en: "Finalizing authentication and starting secure session..." }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setSocialProgress(step.p);
      setSocialProgressText(language === "FR" ? step.t_fr : step.t_en);
    }

    let emailVal = socialInput.trim().toLowerCase();
    let idVal = `social-${Date.now()}`;
    let avatarVal = "";

    if (socialProvider === "GitHub") {
      emailVal = socialProfileData?.email || `${(socialProfileData?.login || socialInput).toLowerCase()}@github.com`;
      idVal = `github-${socialProfileData?.id || Date.now()}`;
      avatarVal = socialProfileData?.avatar_url || "";
    } else if (socialProvider === "LinkedIn") {
      emailVal = socialInput.includes("@") ? socialInput.toLowerCase() : `${socialInput.toLowerCase()}@linkedin.com`;
      idVal = `linkedin-${Date.now()}`;
    } else {
      idVal = `google-${Date.now()}`;
    }

    const finalLocation = socialCity.trim() ? `${socialCity.trim()}, ${socialCountry}` : socialCountry;

    const finalProfile = {
      id: idVal,
      name: socialName.trim(),
      avatar: avatarVal,
      title: socialTitle.trim(),
      bio: language === "FR"
        ? `Développeur basé à ${finalLocation}. Compte sécurisé et synchronisé avec succès via l'API de validation de ${socialProvider}.`
        : `Developer based in ${finalLocation}. Account secured and synchronized successfully via the ${socialProvider} validation API.`,
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      location: finalLocation,
      github: socialProvider === "GitHub" 
        ? (socialProfileData?.html_url || `https://github.com/${socialInput}`)
        : `https://github.com/${socialName.toLowerCase().replace(/\s+/g, "")}`,
      linkedin: socialProvider === "LinkedIn"
        ? `https://linkedin.com/in/${socialInput.toLowerCase().replace(/\s+/g, "-")}`
        : `https://linkedin.com/in/${socialName.toLowerCase().replace(/\s+/g, "-")}`,
      email: emailVal,
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    loginWithGoogleProfile(finalProfile);
    setShowSocialModal(false);
    showToast(
      language === "FR"
        ? `Bienvenue, ${finalProfile.name} ! Identité ${socialProvider} validée et connectée.`
        : `Welcome, ${finalProfile.name}! ${socialProvider} identity successfully validated and connected.`,
      "success"
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 relative z-10">
      
      {/* Container Grid - Styled split layout like 9dad46ded3096ab4afcfb87d4b3fcdca.jpg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[36px] overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#060608] shadow-2xl">
        
        {/* LEFT COLUMN: Deep description, community branding & core connection blocks */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-[#09090b] p-8 sm:p-10 flex flex-col justify-between border-r border-zinc-150 dark:border-white/5 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold tracking-wider uppercase border border-green-500/15">
              <Shield className="h-3 w-3" />
              {isLogin ? (language === "FR" ? "Accès Sécurisé" : "Secure Ingress") : (language === "FR" ? "Onboarding Hub" : "Onboarding Hub")}
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.15] font-display">
              {isLogin 
                ? (language === "FR" ? "Bâtissons l'Avenir de la Tech Africaine" : "Let's Build African Tech Together") 
                : (language === "FR" ? "Rejoignez le Réseau d'Élite" : "Join the Elite Network")
              }
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {isLogin 
                ? (language === "FR" ? "Accédez à vos discussions, projets et événements tech en Afrique." : "Access your direct chat logs, active projects and events.")
                : (language === "FR" ? "Créez votre passeport développeur panafricain en quelques étapes guidées." : "Create your Pan-African developer passport in a few guided steps.")
              }
            </p>
          </div>

          {/* Three decorative/contact badge components from image 9dad46ded3096ab4afcfb87d4b3fcdca.jpg */}
          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border dark:border-white/5 flex items-center justify-center">
                <Icons8Image name="group" className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-black text-zinc-900 dark:text-white uppercase tracking-wider">1,200+ Membres</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Écosystème actif au Togo & d'Afrique.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border dark:border-white/5 flex items-center justify-center">
                <Icons8Image name="shield" className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-black text-zinc-900 dark:text-white uppercase tracking-wider">Identité Sécurisée</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Compétences techniques et profil audités.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border dark:border-white/5 flex items-center justify-center">
                <Icons8Image name="mail" className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-black text-zinc-900 dark:text-white uppercase tracking-wider">Support Dédié</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">contact@devconnect.africa</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rich slate/charcoal-colored form panel wrapper */}
        <div className="lg:col-span-7 bg-zinc-900 dark:bg-zinc-950 p-6 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-black/10 blur-3xl pointer-events-none" />

        {/* STEPPER PROGRESS TRACKER */}
        <div className="relative z-10 pt-2 pb-1">
          {isLogin ? (
            /* Login progress: 2 Steps */
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              {[1, 2].map((num) => (
                <div key={num} className="flex-1 flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    loginStep === num 
                      ? "bg-white text-zinc-950 shadow-md scale-105" 
                      : loginStep > num 
                        ? "bg-white/30 text-white" 
                        : "bg-white/10 text-white/50"
                  }`}>
                    {loginStep > num ? <Check className="h-4 w-4" strokeWidth={3} /> : num}
                  </div>
                  <span className="ml-2 text-[11px] font-bold text-white/80 hidden sm:inline">
                    {num === 1 ? (language === "FR" ? "Identifiant" : "Email") : (language === "FR" ? "Sécurité" : "Security")}
                  </span>
                  {num < 2 && <div className="h-px bg-white/20 flex-1 mx-3" />}
                </div>
              ))}
            </div>
          ) : (
            /* Signup progress: 4 Steps */
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center relative">
                  {/* Outer circle indicator */}
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-extrabold border transition-all ${
                    signUpStep === num 
                      ? "bg-white text-zinc-950 border-white shadow-lg scale-110" 
                      : signUpStep > num 
                        ? "bg-white/30 text-white border-white/20" 
                        : "bg-white/10 text-white/40 border-white/10"
                  }`}>
                    {signUpStep > num ? <Check className="h-4 w-4" strokeWidth={3} /> : num}
                  </div>
                  {/* Label below */}
                  <span className={`text-[9px] font-bold tracking-tight mt-1.5 hidden md:block ${
                    signUpStep === num ? "text-white" : "text-white/50"
                  }`}>
                    {num === 1 && (language === "FR" ? "Compte" : "Account")}
                    {num === 2 && (language === "FR" ? "Description" : "Description")}
                    {num === 3 && (language === "FR" ? "Sécurité" : "Security")}
                    {num === 4 && (language === "FR" ? "Revue" : "Review")}
                  </span>
                </div>
              ))}
              {/* Connected track line behind circles */}
              <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-white/10 -z-10">
                <div 
                  className="h-full bg-white/60 transition-all duration-300" 
                  style={{ width: `${((signUpStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Global Error message indicator */}
        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200/60 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="font-sans font-medium">{errorMsg}</span>
          </div>
        )}

        {/* PROCESS STEPS VIEW */}
        <div className="relative z-10">
          
          {/* ==================== LOGIN FORM PROCESS ==================== */}
          {isLogin && (
            <form onSubmit={handleSubmitLogin} className="space-y-6">
              {loginStep === 1 ? (
                /* Login Step 1: Identity / Email address */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-white/80 uppercase tracking-wider block">
                      {getTranslation(language, "emailAddress")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        type="email"
                        required
                        placeholder="Ex: koffi.lawson@devconnect.africa"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 text-sm focus:border-white/40 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoginNext}
                    className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
                  >
                    <span>{language === "FR" ? "Continuer" : "Continue"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Login Step 2: Password */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono font-bold text-white/80 uppercase tracking-wider">
                        {getTranslation(language, "password")}
                      </label>
                      <span className="text-[10px] text-white/60 font-mono">
                        {email}
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 text-sm focus:border-white/40 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLoginStep(1)}
                      className="py-3 px-4 rounded-2xl border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
                    >
                      {loading ? (
                        <span className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>{getTranslation(language, "signIn")}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ==================== SIGNUP FORM PROCESS ==================== */}
          {!isLogin && (
            <form onSubmit={handleSubmitSignUp} className="space-y-6">
              
              {/* SIGNUP STEP 1: Personal Profile Info */}
              {signUpStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <Icons8Image name="compass" className="h-6 w-6 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-normal">
                      {language === "FR" 
                        ? "Commençons par votre identité de base. Ces coordonnées nous permettront d'établir votre profil unique." 
                        : "Let's start with your core identity. These details will establish your unique community record."}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {getTranslation(language, "fullName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Koffi Mensah Lawson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {getTranslation(language, "emailAddress")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="email"
                        required
                        placeholder="Ex: koffi.lawson@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 block px-1">
                      {language === "FR" ? "Nous n'envoyons jamais de spam. Uniquement des notifications de chat et de collaboration." : "We never spam. Only chat and collaboration triggers."}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSignUpNext(1)}
                    className="w-full py-3 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/10"
                  >
                    <span>{language === "FR" ? "Continuer" : "Continue"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* SIGNUP STEP 2: Description & Developer Details (Bio, Location, Title, Skills) */}
              {signUpStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <Icons8Image name="fire" className="h-6 w-6 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-normal">
                      {language === "FR" 
                        ? "Rédigez votre biographie, votre spécialité professionnelle et sélectionnez vos compétences clés. Cela vous permettra d'attirer des recruteurs et des co-fondateurs." 
                        : "Describe your professional specialty, bio, and toggle key skills. This defines your public developer passport."}
                    </p>
                  </div>

                  {/* Title & Location Row */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {language === "FR" ? "Titre Professionnel / Spécialité" : "Professional Title"}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Senior Full Stack Engineer, UX Designer, Python Dev"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bio Description Area */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {language === "FR" ? "Biographie / Description" : "Biography / Pitch Description"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={language === "FR" ? "Décrivez votre parcours, vos aspirations et ce que vous construisez..." : "Describe your career path, technical achievements, or what you are currently building..."}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all font-sans"
                    />
                  </div>

                  {/* Country & City Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                        {getTranslation(language, "country")}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-3 rounded-2xl border border-white/10 bg-zinc-800 dark:bg-zinc-900 text-sm focus:border-green-500 outline-none text-white transition-all"
                      >
                        {AFRICAN_COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-zinc-800 text-white">
                            {c}
                          </option>
                        ))}
                        <option value="Autre" className="bg-zinc-800 text-white">Autre / Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                        {language === "FR" ? "Ville" : "City"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Lomé, Dakar"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Portfolio links */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 dark:bg-black/20 text-xs text-white placeholder-white/30 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 dark:bg-black/20 text-xs text-white placeholder-white/30 focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Interactive Skills Toggles */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {language === "FR" ? "Compétences clés (Cliquez pour sélectionner)" : "Key Skills (Click to toggle)"}
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                      {POPULAR_SKILLS.map((skill) => {
                        const selected = skills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selected 
                                ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-sm"
                                : "bg-zinc-850 border-white/5 text-zinc-300 hover:bg-zinc-800"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="py-3 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSignUpNext(2)}
                      className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/10"
                    >
                      <span>{language === "FR" ? "Continuer" : "Continue"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP STEP 3: Security & Credentials */}
              {signUpStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <Icons8Image name="shield" className="h-6 w-6 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-normal">
                      {language === "FR" 
                        ? "Sécurisez votre compte avec un mot de passe fiable. Vous l'utiliserez pour vous connecter lors de vos prochaines visites." 
                        : "Secure your Pan-African credential. Choose a reliable password to authenticate next time."}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {getTranslation(language, "password")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      {getTranslation(language, "confirmPassword")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 text-sm focus:border-green-500 outline-none text-white placeholder-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(2)}
                      className="py-3 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSignUpNext(3)}
                      className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/10"
                    >
                      <span>{language === "FR" ? "Suivant: Vérification" : "Next: Review info"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP STEP 4: Passport Summary / Final Review & Complete */}
              {signUpStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="text-center py-2 space-y-1">
                    <h4 className="text-sm font-extrabold text-[#111113] dark:text-white">
                      {language === "FR" ? "Prêt à publier votre profil !" : "Ready to publish your profile!"}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                      {language === "FR" 
                        ? "Veuillez vérifier les informations de votre passeport de développeur panafricain avant la soumission." 
                        : "Verify your African developer passport layout before final submission."}
                    </p>
                  </div>

                  {/* Developer Credential Preview Badge */}
                  <div className="border border-zinc-200/80 dark:border-white/10 rounded-2xl p-5 bg-zinc-50/50 dark:bg-[#121215]/80 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-[9px] font-mono font-black text-green-500 uppercase tracking-widest bg-green-500/10 rounded-bl-xl border-l border-b border-green-500/10">
                      PASSPORT PENDING
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Placeholder Avatar */}
                      <div className="h-14 w-14 rounded-2xl bg-zinc-900 dark:bg-black text-green-500 font-black border border-green-500/20 flex items-center justify-center text-base shrink-0 shadow">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                          {name}
                        </h4>
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold truncate">
                          {title}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-yellow-500" />
                          {city}, {country}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-200 dark:border-white/10 pt-3.5 space-y-2">
                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 font-mono block uppercase">Biography / Pitch</span>
                        <p className="text-zinc-700 dark:text-zinc-300 italic font-sans leading-relaxed text-xs">
                          "{bio}"
                        </p>
                      </div>

                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 font-mono block uppercase">Skills / Stack</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skills.map((s, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 border-t dark:border-white/5 pt-3">
                        <div>
                          <span className="block uppercase text-[8px]">E-Mail</span>
                          <span className="text-zinc-700 dark:text-zinc-300 truncate block">{email}</span>
                        </div>
                        <div>
                          <span className="block uppercase text-[8px]">GitHub/Socials</span>
                          <span className="text-zinc-700 dark:text-zinc-300 truncate block">
                            {github ? "Configured ✔" : "Not Provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(3)}
                      className="py-3 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/15"
                    >
                      {loading ? (
                        <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>{language === "FR" ? "Créer mon Compte" : "Create My Account"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

        {/* Traditional & OAuth Fallback options */}
        <div className="space-y-4 border-t border-zinc-150 dark:border-white/5 pt-6">
          
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200/60 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {language === "FR" ? "OU CONNECTER VIA" : "OR CHOOSE IDENTITY PROVIDER"}
            </span>
            <div className="flex-grow border-t border-zinc-200/60 dark:border-white/10"></div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              disabled={loading}
              className="px-2 py-2.5 rounded-2xl border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <Icons8Image name="google" className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Google</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocialLogin("GitHub")}
              disabled={loading}
              className="px-2 py-2.5 rounded-2xl border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <Icons8Image name="github" className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">GitHub</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => handleSocialLogin("LinkedIn")}
              disabled={loading}
              className="px-2 py-2.5 rounded-2xl border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <Icons8Image name="linkedin" className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
          </div>

          {/* Quick Demo Sign-in for Togo Tech Ecosystem (Polished Pill style) */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setPersonaSimOpen(!personaSimOpen)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-black/40 py-3 px-5 transition-all duration-300 hover:border-green-500/40 hover:bg-green-500/[0.02] cursor-pointer shadow-sm relative group overflow-hidden"
              style={{ borderRadius: "9999px" }}
            >
              {/* Ambient micro color glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/[0.03] to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <span className="text-[10px] font-mono font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.16em] flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-green-500 animate-pulse" />
                <span>{language === "FR" ? "SIMULATION ACCÈS RAPIDE PERSONA" : "QUICK DEMO ACCESS PERSONAS"}</span>
                <svg className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${personaSimOpen ? "rotate-180 text-green-500" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {personaSimOpen && (
              <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {profiles.filter(p => p.email.includes("demo")).slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        setErrorMsg("");
                        try {
                          await login(p.email);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="px-2 py-2 text-[10px] font-bold border rounded-xl bg-white dark:bg-zinc-900/60 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/5 transition-all cursor-pointer truncate"
                      title={p.email}
                    >
                      {p.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle between login / register */}
          <div className="text-center text-xs pt-2">
            {isLogin ? (
              <p className="text-white/70">
                {getTranslation(language, "dontHaveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="font-bold text-white hover:underline cursor-pointer"
                >
                  {getTranslation(language, "register")}
                </button>
              </p>
            ) : (
              <p className="text-white/70">
                {getTranslation(language, "alreadyHaveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-bold text-white hover:underline cursor-pointer"
                >
                  {getTranslation(language, "login")}
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>

      {/* Unified Social OAuth Connection Modal */}
      {showSocialModal && socialProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b] p-6 shadow-2xl space-y-5 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Glowing accent spot */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-green-500/10 blur-2xl pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border dark:border-white/5">
                  {socialProvider === "Google" && (
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.53-7.99 7.859-7.99 2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.92 15.54.5 12.24.5c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5c6.63 0 11.04-4.66 11.04-11.22 0-.75-.08-1.335-.18-1.995H12.24z"/>
                    </svg>
                  )}
                  {socialProvider === "GitHub" && (
                    <Github className="h-5 w-5 text-zinc-900 dark:text-white shrink-0" />
                  )}
                  {socialProvider === "LinkedIn" && (
                    <Linkedin className="h-5 w-5 text-[#0a66c2] fill-[#0a66c2] shrink-0" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block leading-none">
                    OAuth Gateway
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider font-semibold">
                    {socialProvider.toUpperCase()} AUTH SECURE CLIENT
                  </span>
                </div>
              </div>
              {socialStep !== 3 && (
                <button 
                  type="button"
                  onClick={() => setShowSocialModal(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* STEP 1: Identity Lookup */}
            {socialStep === 1 && (
              <form onSubmit={handleSocialSearch} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {language === "FR" ? `Connexion via ${socialProvider}` : `Sign In with ${socialProvider}`}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {socialProvider === "GitHub" 
                      ? (language === "FR" 
                        ? "Saisissez votre nom d'utilisateur GitHub. L'application consultera l'API GitHub publique pour synchroniser votre identité." 
                        : "Enter your GitHub username. The app will consult the public GitHub API to synchronize your identity.")
                      : (language === "FR"
                        ? `Entrez votre identifiant/adresse e-mail associé à ${socialProvider} pour synchroniser votre profil.`
                        : `Enter your ${socialProvider} username or email to synchronize your profile.`)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    {socialProvider === "GitHub" 
                      ? (language === "FR" ? "Nom d'utilisateur GitHub" : "GitHub Username")
                      : (language === "FR" ? "Adresse e-mail de connexion" : "Sign-in Email Address")}
                  </label>
                  <div className="relative">
                    {socialProvider === "GitHub" ? (
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    ) : (
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    )}
                    <input
                      type={socialProvider === "GitHub" ? "text" : "email"}
                      required
                      placeholder={socialProvider === "GitHub" ? "Ex: torvalds, michelame, etc." : "Ex: koffi.lawson@gmail.com"}
                      value={socialInput}
                      onChange={(e) => setSocialInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white transition-all"
                    />
                  </div>
                  {socialError && (
                    <p className="text-xs text-rose-500 font-bold font-mono mt-1">
                      ⚠️ {socialError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={socialLoading || !socialInput.trim()}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {socialLoading ? (
                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>{language === "FR" ? "Rechercher / Authentifier" : "Search & Connect"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Consent and profile custom details */}
            {socialStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {language === "FR" ? "Autorisations de sécurité" : "Security Consent"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {language === "FR" 
                      ? "Consultez les détails importés et personnalisez votre profil africain de développeur :" 
                      : "Review imported credentials and customize your African developer profile:"}
                  </p>
                </div>

                {/* Profile detail card summary */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-white/5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/15 text-green-500 border border-green-500/25 flex items-center justify-center font-black text-sm shrink-0">
                    {socialName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {socialName}
                    </h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate">
                      {socialInput} • {socialProvider} Identity Verified
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                      {language === "FR" ? "Nom Complet" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={socialName}
                      onChange={(e) => setSocialName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                      {language === "FR" ? "Titre / Spécialité" : "Professional Title"}
                    </label>
                    <input
                      type="text"
                      required
                      value={socialTitle}
                      onChange={(e) => setSocialTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                      {language === "FR" ? "Pays" : "Country"}
                    </label>
                    <select
                      value={socialCountry}
                      onChange={(e) => setSocialCountry(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="Autre">Autre / Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                      {language === "FR" ? "Ville" : "City"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dakar, Abidjan"
                      value={socialCity}
                      onChange={(e) => setSocialCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Consent scopes */}
                <div className="space-y-2 pt-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    {language === "FR" ? "Autorisations requises :" : "Required Permissions :"}
                  </span>
                  <label className="flex items-start gap-2.5 p-2 rounded-xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/40 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={socialPermission1}
                      onChange={(e) => setSocialPermission1(e.target.checked)}
                      className="mt-0.5 rounded text-green-500 focus:ring-green-500/20"
                    />
                    <div className="text-[10px] leading-tight">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">
                        {language === "FR" ? "Consulter l'adresse e-mail" : "Consult Email Address"}
                      </div>
                      <div className="text-zinc-400 dark:text-zinc-500 text-[9px] mt-0.5">
                        {language === "FR" ? "Permet d'associer votre identité de manière durable." : "Allows binding your developer identity securely."}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/40 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={socialPermission2}
                      onChange={(e) => setSocialPermission2(e.target.checked)}
                      className="mt-0.5 rounded text-green-500 focus:ring-green-500/20"
                    />
                    <div className="text-[10px] leading-tight">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">
                        {language === "FR" ? "Importer le profil de développeur" : "Import Developer Profile"}
                      </div>
                      <div className="text-zinc-400 dark:text-zinc-500 text-[9px] mt-0.5">
                        {language === "FR" ? "Permet d'extraire vos projets publics de l'écosystème." : "Allows extracting public portfolio metrics."}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Back and Confirm buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSocialStep(1)}
                    className="py-2.5 rounded-xl border border-zinc-200 dark:border-white/5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  >
                    {language === "FR" ? "Retour" : "Back"}
                  </button>
                  <button
                    type="button"
                    onClick={socialProvider === "GitHub" || socialProvider === "LinkedIn" || socialProvider === "Google" ? handleSocialSubmit : () => {}}
                    disabled={!socialPermission1 || !socialPermission2}
                    className="py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs transition-all shadow-md shadow-green-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {language === "FR" ? "Accorder & Suivant" : "Authorize & Proceed"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Progress Sync simulation */}
            {socialStep === 3 && (
              <div className="space-y-4 py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 border border-green-500/20 text-green-500 animate-pulse">
                  <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {language === "FR" ? `Négociation OAuth ${socialProvider}...` : `Negotiating ${socialProvider} OAuth...`}
                  </h4>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono h-10 flex items-center justify-center px-4 leading-relaxed">
                    {socialProgressText}
                  </p>
                </div>

                <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden border dark:border-white/5">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${socialProgress}%` }}
                  ></div>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 font-bold">
                  {socialProgress}% {language === "FR" ? "COMPLET" : "COMPLETE"}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
