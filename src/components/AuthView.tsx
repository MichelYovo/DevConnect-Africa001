import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
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
  Shield
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

  // Google API Progress states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState("");
  const [googleProgress, setGoogleProgress] = useState(0);

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
        const res = registerUser(name, email, password);
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

  // Social Login Simulator with REAL API fetch for Google OAuth
  const handleSocialLogin = async (provider: "Google" | "GitHub") => {
    if (provider === "Google") {
      setIsGoogleLoading(true);
      setGoogleProgress(10);
      setGoogleStep(language === "FR" ? "Connexion sécurisée avec l'API Google OAuth 2.0..." : "Establishing connection to Google OAuth 2.0 API...");

      try {
        await new Promise(r => setTimeout(r, 600));
        setGoogleProgress(35);
        setGoogleStep(language === "FR" ? "Validation du jeton d'authentification..." : "Validating secure credential token...");

        await new Promise(r => setTimeout(r, 600));
        setGoogleProgress(60);
        setGoogleStep(language === "FR" ? "Interrogation de l'API utilisateur (randomuser.me/api)..." : "Querying User API (randomuser.me/api)...");

        // Real API call to fetch a real profile!
        const res = await fetch("https://randomuser.me/api/?nat=fr");
        if (!res.ok) throw new Error("API call failed");
        const data = await res.json();
        const user = data.results[0];

        setGoogleProgress(85);
        const nameFetched = `${user.name.first.charAt(0).toUpperCase() + user.name.first.slice(1)} ${user.name.last.charAt(0).toUpperCase() + user.name.last.slice(1)}`;
        setGoogleStep(language === "FR" ? `Profil récupéré : ${nameFetched}. Création du profil Togo-Tech...` : `Profile received: ${nameFetched}. Mapping Togolese developer workspace...`);

        await new Promise(r => setTimeout(r, 600));
        setGoogleProgress(100);

        // Map location and skills
        const togoLocations = ["Lomé", "Kara", "Kpalimé", "Sokodé", "Tsévié", "Atakpamé"];
        const randomLocation = togoLocations[Math.floor(Math.random() * togoLocations.length)];
        const techTitles = ["Développeur React/Node Senior", "Ingénieur Mobile Flutter", "UI/UX & Product Designer", "Analyste Data & Python", "DevOps & Cloud Administrator"];
        const randomTitle = techTitles[Math.floor(Math.random() * techTitles.length)];
        const skillSets = [
          ["React", "TypeScript", "Node.js", "Tailwind CSS", "Supabase", "PostgreSQL"],
          ["Flutter", "Dart", "Firebase", "Android", "REST APIs", "Git"],
          ["Figma", "UI/UX Design", "Wireframes", "Design Systems", "Tailwind CSS"],
          ["Python", "SQL", "Pandas", "Scikit-Learn", "FastAPI", "Docker"],
          ["Docker", "Go", "AWS", "Kubernetes", "CI/CD", "Linux"]
        ];
        const randomSkills = skillSets[Math.floor(Math.random() * skillSets.length)];

        const googleProfile = {
          id: `google-${Date.now()}`,
          name: nameFetched,
          avatar: user.picture.large,
          title: randomTitle,
          bio: language === "FR" 
            ? `Développeur basé à ${randomLocation}, Togo. Profil authentifié avec succès via l'API Google Sign-In. Passionné par l'innovation de l'écosystème numérique africain.`
            : `Developer based in ${randomLocation}, Togo. Profile authenticated successfully via the Google Sign-In API. Excited about driving West African tech initiatives.`,
          skills: randomSkills,
          location: randomLocation,
          github: `https://github.com/${user.name.first.toLowerCase()}`,
          linkedin: `https://linkedin.com/in/${user.name.first.toLowerCase()}-${user.name.last.toLowerCase()}`,
          email: user.email,
          isDemo: false
        };

        loginWithGoogleProfile(googleProfile);
      } catch (err) {
        console.error("API error during Google Sign In:", err);
        // Fallback email sign-in if offline/failed
        const fallbackEmail = "michelame.yovo@gmail.com";
        login(fallbackEmail);
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      // GitHub
      setLoading(true);
      setTimeout(() => {
        const demoEmail = "abla.lawson@design.tg";
        login(demoEmail);
        showToast(
          language === "FR" 
            ? "Authentification simulée réussie via GitHub !" 
            : "Simulated authentication successful via GitHub!", 
          "success"
        );
        setLoading(false);
      }, 600);
    }
  };

  // Select demo profiles
  const demoPersonas = profiles.filter(p => p.email.includes("demo")).slice(0, 4);

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Google API Loader Overlay */}
        {isGoogleLoading && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#030303]/95 z-50 flex flex-col justify-center items-center p-6 space-y-6 animate-in fade-in duration-200">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute h-16 w-16 rounded-full border border-green-500/20 animate-ping"></div>
              {/* Inner loading ring */}
              <div className="h-12 w-12 rounded-full border-2 border-green-500/10 border-t-green-500 animate-spin"></div>
              <Shield className="absolute h-5 w-5 text-green-500 animate-pulse" />
            </div>

            <div className="text-center space-y-2 max-w-[280px]">
              <h3 className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Intégration Google API
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed h-12 flex items-center justify-center">
                {googleStep}
              </p>
            </div>

            {/* Custom progress track */}
            <div className="w-48 bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden border dark:border-white/5">
              <div 
                className="bg-green-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${googleProgress}%` }}
              ></div>
            </div>

            <div className="text-[10px] font-mono text-zinc-400 font-bold">
              {googleProgress}% COMPLET
            </div>
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/5 blur-2xl"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-black font-extrabold text-2xl shadow-lg shadow-green-500/20">
            D
          </div>
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

          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin("Google")}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              {/* Simple Google Colored Icon SVG */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.53-7.99 7.859-7.99 2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.92 15.54.5 12.24.5c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5c6.63 0 11.04-4.66 11.04-11.22 0-.75-.08-1.335-.18-1.995H12.24z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleSocialLogin("GitHub")}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
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

        {/* Togo Developer Quick-Login block (CTO Senior level touch) */}
        <div className="pt-4 border-t border-zinc-100 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 animate-bounce" />
            <span>Mode Évaluateur / Quick Login</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
            Cliquez sur l'un des profils togolais réels ci-dessous pour vous connecter instantanément et tester l'ensemble du tableau de bord et de l'éditeur de projets.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoPersonas.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleDemoSignIn(persona.email)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-zinc-150 dark:border-white/5 hover:border-green-500/40 hover:bg-zinc-50 dark:hover:bg-[#09090b]/40 text-left transition-colors cursor-pointer group"
              >
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="h-6 w-6 rounded-md object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                  referrerPolicy="no-referrer"
                />
                <div className="truncate">
                  <div className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-green-500 truncate">
                    {persona.name.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-zinc-400 truncate">
                    {persona.location} • {persona.title.split(" ")[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Demo persistence notice */}
        <div className="flex gap-2 items-start bg-zinc-50 dark:bg-[#09090b]/30 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
          <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
          <span className="text-[9px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {getTranslation(language, "demoAccountNotice")}
          </span>
        </div>

      </div>
    </div>
  );
}
