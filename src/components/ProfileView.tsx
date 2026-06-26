import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../i18n";
import DeveloperAvatar from "./DeveloperAvatar";
import { getFlagForLocation } from "../types";
import { 
  User, 
  MapPin, 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  Award, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  X,
  Plus,
  Upload,
  Trash2
} from "lucide-react";

export default function ProfileView() {
  const { currentUser, updateProfile, language, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Convert uploaded image file directly to persistent base64 representation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) {
      showToast(
        language === "FR" ? "La taille de l'image ne doit pas dépasser 2 Mo." : "Image size must not exceed 2MB.",
        "error"
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setAvatar(base64Image);
      // Save immediately to profile to ensure persistence across tab changes and reconnections
      updateProfile({ avatar: base64Image });
      showToast(
        language === "FR" ? "Image de profil mise à jour et enregistrée avec succès !" : "Profile picture updated and saved successfully!",
        "success"
      );
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearAvatar = () => {
    setAvatar("");
    // Clear immediately in profile to ensure persistence
    updateProfile({ avatar: "" });
    showToast(
      language === "FR" ? "Photo de profil supprimée et enregistrée avec succès !" : "Profile picture removed and saved successfully!",
      "info"
    );
  };

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
          
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="relative inline-block mx-auto">
              <DeveloperAvatar
                name={name}
                avatar={avatar}
                sizeClassName="h-28 w-28 text-3xl"
              />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-zinc-900 dark:text-white">{name || "Nom complet"}</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-bold leading-tight">{title || "Poste"}</p>
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-yellow-500" />
                {location}{getFlagForLocation(location)}
              </p>
            </div>
          </div>

          {/* New Interactive Custom Image Upload Selector */}
          <div className="bg-white dark:bg-[#09090b]/40 border border-zinc-200/60 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Photo de Profil
            </span>
            
            <div className="space-y-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button
                type="button"
                onClick={triggerFileSelect}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-200/80 dark:border-white/10 hover:border-green-500/50 dark:hover:border-green-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex flex-col items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                <span>Importer une image</span>
              </button>

              {avatar && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="w-full py-2 rounded-xl text-[10px] font-black text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Effacer la photo de profil
                </button>
              )}
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
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {language === "FR" ? "Localisation (Ville, Pays) *" : "Location (City, Country) *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dakar, Sénégal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>
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
