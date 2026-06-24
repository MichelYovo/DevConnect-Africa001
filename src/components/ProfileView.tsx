import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import { TOGO_CITIES } from "../data";
import { 
  User, 
  MapPin, 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  Award, 
  Image, 
  Save, 
  CheckCircle2, 
  X,
  Plus
} from "lucide-react";

export default function ProfileView() {
  const { currentUser, updateProfile, language } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <User className="h-12 w-12 text-zinc-400 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Non connecté</h2>
        <p className="text-zinc-500 text-sm">
          Veuillez vous connecter pour gérer et modifier votre profil de développeur.
        </p>
      </div>
    );
  }

  // Local states initialized with currentUser values
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [github, setGithub] = useState(currentUser.github);
  const [linkedin, setLinkedin] = useState(currentUser.linkedin);
  const [email, setEmail] = useState(currentUser.email);
  
  // Skills tags list management
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() !== "" && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      bio,
      location,
      avatar,
      github,
      linkedin,
      email,
      skills
    });
  };

  // Quick preset avatars
  const avatarPresets = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {getTranslation(language, "profile")} de développeur
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Configurez votre vitrine professionnelle pour attirer des recruteurs et des partenaires de projets au Togo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column preview and Avatar selections */}
        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-6 text-center space-y-4 shadow-sm">
            <div className="relative inline-block mx-auto">
              <img
                src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={name}
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-green-500/10 mx-auto"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-zinc-900 dark:text-white">{name || "Nom complet"}</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-bold">{title || "Poste"}</p>
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-yellow-500" />
                {location}, Togo 🇹🇬
              </p>
            </div>
          </div>

          {/* Quick preset selection */}
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 space-y-3 shadow-sm">
            <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Presets d'Avatar
            </span>
            <div className="grid grid-cols-4 gap-2">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer h-11 w-11 ${
                    avatar === preset ? "border-green-500 ring-2 ring-green-500/10" : "border-transparent"
                  }`}
                >
                  <img
                    src={preset}
                    alt="Preset"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right column editor form */}
        <div className="md:col-span-2">
          
          <form onSubmit={handleSave} className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "fullName")} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "titleJob")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Senior Dev Flutter & Python"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                {getTranslation(language, "bio")} *
              </label>
              <textarea
                required
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "city")} *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-700 dark:text-zinc-300"
                >
                  {TOGO_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "country")}
                </label>
                <input
                  type="text"
                  disabled
                  value={getTranslation(language, "defaultCountryTogo")}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-100 dark:bg-[#09090b]/60 text-sm text-zinc-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                {getTranslation(language, "avatarUrl")}
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>

            <div className="border-t border-zinc-100 dark:border-white/5 pt-5 space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                {getTranslation(language, "skills")}
              </span>
              
              {/* Added skills tags */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-dashed border-zinc-200/60 dark:border-white/10">
                {skills.length === 0 ? (
                  <span className="text-xs text-zinc-400 italic p-1">Aucune compétence ajoutée</span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#09090b]/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/30 dark:border-white/5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add skill input form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter (ex : Flutter, Docker, Figma)"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  {getTranslation(language, "addSkill")}
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-white/5 pt-5 space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                {getTranslation(language, "links")}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block flex items-center gap-1">
                    <Github className="h-3.5 w-3.5" />
                    {getTranslation(language, "githubUrl")}
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/votre-user"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block flex items-center gap-1">
                    <Linkedin className="h-3.5 w-3.5 text-green-500" />
                    {getTranslation(language, "linkedinUrl")}
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/votre-nom"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/15"
              >
                <Save className="h-4 w-4" />
                {getTranslation(language, "save")}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
