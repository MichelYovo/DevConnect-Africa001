import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation, getFormattedDate } from "../i18n";
import DeveloperAvatar from "./DeveloperAvatar";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  PlusCircle, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

const EVENT_LOCATIONS = ["En ligne", "Togo", "Kenya", "Sénégal", "Nigéria", "Rwanda"];

export default function EventsView() {
  const { 
    currentUser, 
    events, 
    createEvent, 
    toggleAttendEvent, 
    language,
    profiles
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("all");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Dakar, Sénégal");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !venue || !date) return;

    createEvent({
      title,
      description,
      location,
      venue,
      date: new Date(date).toISOString(),
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setLocation("Dakar, Sénégal");
    setVenue("");
    setDate("");
    setIsCreateOpen(false);
  };

  // Filter events
  const filteredEvents = events.filter((evt) => {
    if (selectedCity !== "all" && !evt.location.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {getTranslation(language, "upcomingEvents")}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm">
            Participez aux meetups, hackathons et ateliers pour monter en compétences et élargir votre réseau.
          </p>
        </div>

        {currentUser ? (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-green-500/15"
          >
            <Plus className="h-4 w-4" />
            {getTranslation(language, "addEvent")}
          </button>
        ) : (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
          >
            Se connecter pour programmer un meetup
          </button>
        )}
      </div>

      {/* Filter city selector */}
      <div className="flex flex-wrap gap-2 items-center bg-zinc-50 dark:bg-[#09090b]/40 p-3 rounded-2xl border border-zinc-200/50 dark:border-white/10">
        <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-2">
          Ville :
        </span>
        <button
          onClick={() => setSelectedCity("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCity === "all"
              ? "bg-green-500 text-black shadow-sm"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          Toutes
        </button>
        {EVENT_LOCATIONS.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              selectedCity === city
                ? "bg-green-500 text-black shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <MapPin className="h-3 w-3 text-yellow-500" />
            {city}
          </button>
        ))}
      </div>

      {/* Events timeline grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl space-y-3 shadow-sm">
          <Calendar className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm text-zinc-500">
            {getTranslation(language, "noEventsYet")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isAttending = currentUser && evt.attendees.includes(currentUser.id);
            const eventAttendeesProfiles = profiles.filter((p) => evt.attendees.includes(p.id));

            return (
              <div
                key={evt.id}
                className="bg-white dark:bg-[#09090b]/40 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-green-500/10 dark:hover:border-green-500/20 transition-all relative overflow-hidden"
              >
                
                {/* City badge badge */}
                <div className="absolute top-4 right-4 bg-zinc-50 dark:bg-[#09090b]/60 border border-zinc-150 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-bold px-3 py-1 rounded-full text-[10px] flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-yellow-500" />
                  {evt.location}
                </div>

                <div className="space-y-4">
                  
                  {/* Event Date Info */}
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-mono font-bold uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getFormattedDate(language, evt.date)}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Room / Organizer */}
                  <div className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-150 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-400">{getTranslation(language, "venue")} :</span>
                      <span className="text-zinc-750 dark:text-zinc-300">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-400">{getTranslation(language, "organizedBy")} :</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">{evt.organizer}</span>
                    </div>
                  </div>

                  {/* List attendees avatars */}
                  {eventAttendeesProfiles.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                        Déjà inscrits ({eventAttendeesProfiles.length})
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-2 overflow-hidden">
                          {eventAttendeesProfiles.slice(0, 6).map((ap) => (
                            <div key={ap.id} className="inline-block ring-2 ring-white dark:ring-zinc-950 rounded-full" title={ap.name}>
                              <DeveloperAvatar
                                name={ap.name}
                                avatar={ap.avatar}
                                sizeClassName="h-6 w-6 text-[8px]"
                              />
                            </div>
                          ))}
                        </div>
                        {eventAttendeesProfiles.length > 6 && (
                          <span className="text-[10px] font-mono font-bold text-zinc-500 pl-1">
                            +{eventAttendeesProfiles.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-900 mt-6 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <span>{evt.attendees.length} {getTranslation(language, "attendeesCount")}</span>
                  </div>

                  <button
                    onClick={() => toggleAttendEvent(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isAttending
                        ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/30 dark:border-rose-900/30"
                        : "bg-green-500 hover:bg-green-400 text-black shadow shadow-green-500/10"
                    }`}
                  >
                    {isAttending
                      ? getTranslation(language, "leaveEvent")
                      : getTranslation(language, "joinEvent")
                    }
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal create event overlay */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-green-500" />
                {getTranslation(language, "addEvent")}
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
                  {getTranslation(language, "eventTitle")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Ateliers IA Générative et LLM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "eventDesc")} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez les objectifs, le niveau requis, et le déroulé de l'événement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "city")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dakar, Sénégal ou En ligne"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-700 dark:text-zinc-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {getTranslation(language, "eventDate")} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-700 dark:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  {getTranslation(language, "eventVenue")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Woelab Prime, Amadahomé"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm focus:border-green-500 outline-none text-zinc-900 dark:text-white"
                />
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
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs cursor-pointer shadow"
                >
                  {getTranslation(language, "createEvent")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
