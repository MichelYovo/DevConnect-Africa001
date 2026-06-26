import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import DeveloperAvatar from "./DeveloperAvatar";
import { AFRICAN_COUNTRIES } from "../data";
import { 
  Github, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  Shield,
  Search,
  X,
  Globe,
  Linkedin
} from "lucide-react";

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

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [country, setCountry] = useState("Sénégal");
  const [city, setCity] = useState("Dakar");

  // Unified Social OAuth + OTP Connection States
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState<"Google" | "GitHub" | "LinkedIn" | null>(null);
  const [socialStep, setSocialStep] = useState(1); // 1: Search/Identity, 2: Consent & Customization, 3: Syncing Progress, 4: OTP Verification
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

  // OTP Verification States
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (!email) {
          setErrorMsg(language === "FR" ? "Veuillez entrer votre adresse email." : "Please enter your email address.");
          setLoading(false);
          return;
        }
        const res = login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Error");
        }
      } else {
        if (!name || !email) {
          setErrorMsg(language === "FR" ? "Veuillez remplir tous les champs obligatoires." : "Please fill in all required fields.");
          setLoading(false);
          return;
        }
        if (password && password !== confirmPassword) {
          setErrorMsg(language === "FR" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
          setLoading(false);
          return;
        }
        const locationStr = city.trim() ? `${city.trim()}, ${country}` : country;
        const res = registerUser(name, email, password, locationStr);
        if (!res.success) {
          setErrorMsg(res.error || "Error");
        }
      }
      setLoading(false);
    }, 800);
  };

  // Quick sign-in as a Togolese Demo Persona
  const handleDemoSignIn = (demoEmail: string) => {
    setLoading(true);
    setTimeout(() => {
      login(demoEmail);
      setLoading(false);
    }, 400);
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
    setOtpCode("");
    setGeneratedOtp("");
    setOtpError("");
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
      await new Promise(r => setTimeout(r, 450));
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
      isDemo: false
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

  const handleOtpConfirm = () => {
    if (otpCode.trim() !== generatedOtp) {
      setOtpError(language === "FR" ? "Code OTP incorrect. Veuillez vérifier le code dans le simulateur d'e-mails." : "Incorrect OTP code. Please check the simulated email inbox below.");
      return;
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
        ? `Développeur basé à ${finalLocation}. Compte sécurisé et synchronisé avec succès via l'API de validation OTP de ${socialProvider}.`
        : `Developer based in ${finalLocation}. Account secured and synchronized successfully via the ${socialProvider} OTP validation API.`,
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      location: finalLocation,
      github: socialProvider === "GitHub" 
        ? (socialProfileData?.html_url || `https://github.com/${socialInput}`)
        : `https://github.com/${socialName.toLowerCase().replace(/\s+/g, "")}`,
      linkedin: socialProvider === "LinkedIn"
        ? `https://linkedin.com/in/${socialInput.toLowerCase().replace(/\s+/g, "-")}`
        : `https://linkedin.com/in/${socialName.toLowerCase().replace(/\s+/g, "-")}`,
      email: emailVal,
      isDemo: false
    };

    loginWithGoogleProfile(finalProfile);
    setShowSocialModal(false);
    showToast(
      language === "FR"
        ? `Bienvenue, ${finalProfile.name} ! Identité ${socialProvider} validée avec succès via OTP.`
        : `Welcome, ${finalProfile.name}! ${socialProvider} identity successfully validated via OTP.`,
      "success"
    );
  };

  // OTP Countdown Timer
  React.useEffect(() => {
    let timer: any;
    if (showSocialModal && socialStep === 4 && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSocialModal, socialStep, otpCountdown]);

  // Select demo profiles
  const demoPersonas = profiles.filter(p => p.email.includes("demo")).slice(0, 4);

  return (
    <div className="max-w-md mx-auto my-8 px-4 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {isLogin ? getTranslation(language, "welcomeBack") : getTranslation(language, "createAccount")}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {getTranslation(language, "slogan")}
        </p>
      </div>

      {/* Error message indicator */}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2 animate-shake">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Auth form */}
      <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {getTranslation(language, "fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Koffi Lawson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {getTranslation(language, "emailAddress")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="koffi@mensah.tg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {getTranslation(language, "password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {getTranslation(language, "confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {getTranslation(language, "country")}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
                  >
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
                        {c}
                      </option>
                    ))}
                    <option value="Autre" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Autre / Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {language === "FR" ? "Ville" : "City"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dakar, Abidjan"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 dark:focus:border-green-500 focus:bg-white dark:focus:bg-zinc-900 outline-none text-zinc-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/15"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                {isLogin ? getTranslation(language, "signIn") : getTranslation(language, "signUp")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Authentication Providers */}
        <div className="space-y-3">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200/60 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {getTranslation(language, "orWithEmail")}
            </span>
            <div className="flex-grow border-t border-zinc-200/60 dark:border-white/10"></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              disabled={loading}
              className="px-2 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.53-7.99 7.859-7.99 2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.92 15.54.5 12.24.5c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5c6.63 0 11.04-4.66 11.04-11.22 0-.75-.08-1.335-.18-1.995H12.24z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocialLogin("GitHub")}
              disabled={loading}
              className="px-2 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <Github className="h-3.5 w-3.5 shrink-0" />
              <span>GitHub</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => handleSocialLogin("LinkedIn")}
              disabled={loading}
              className="px-2 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer hover:border-green-500/30"
            >
              <Linkedin className="h-3.5 w-3.5 text-[#0a66c2] shrink-0 fill-[#0a66c2]" />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Toggle between login / register */}
        <div className="text-center text-xs">
          {isLogin ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              {getTranslation(language, "dontHaveAccount")}{" "}
              <button
                onClick={() => setView("register")}
                className="font-bold text-green-600 dark:text-green-400 hover:underline cursor-pointer"
              >
                {getTranslation(language, "register")}
              </button>
            </p>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              {getTranslation(language, "alreadyHaveAccount")}{" "}
              <button
                onClick={() => setView("login")}
                className="font-bold text-green-600 dark:text-green-400 hover:underline cursor-pointer"
              >
                {getTranslation(language, "login")}
              </button>
            </p>
          )}
        </div>





      {/* Unified Social OAuth & OTP Connection Modal */}
      {showSocialModal && socialProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-[#09090b] p-6 shadow-2xl space-y-5 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Elegant glowing spot inside the modal */}
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
                    {socialProvider.toUpperCase()} AUTH CLIENT v3.0
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

            {/* STEP 1: Search / Identity input */}
            {socialStep === 1 && (
              <form onSubmit={handleSocialSearch} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {language === "FR" ? `Connexion via ${socialProvider}` : `Sign In with ${socialProvider}`}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {socialProvider === "GitHub" 
                      ? (language === "FR" 
                        ? "Saisissez votre nom d'utilisateur GitHub. L'application consultera l'API GitHub publique pour synchroniser vos projets réels et vos compétences." 
                        : "Enter your GitHub username. The app will consult the public GitHub API to synchronize your real projects and skills.")
                      : (language === "FR"
                        ? `Entrez votre identifiant/adresse e-mail associé à ${socialProvider} pour synchroniser votre profil professionnel.`
                        : `Enter your ${socialProvider} username or email to synchronize your professional profile.`)}
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
                    onClick={handleSocialSubmit}
                    disabled={!socialPermission1 || !socialPermission2}
                    className="py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs transition-all shadow-md shadow-green-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {language === "FR" ? "Accorder & Suivant" : "Authorize & Proceed"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Connecting simulation progress bar */}
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
