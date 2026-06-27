import { createClient } from "@supabase/supabase-js";

// Helper to deterministically map any string ID (e.g. user-123, github-abc) to a valid UUID format
// to satisfy PostgreSQL UUID constraints.
export function toUuid(str: string): string {
  if (!str) {
    return "00000000-0000-0000-0000-000000000000";
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }

  // Deterministic 32-character hex generator
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 |= 0;
    hash2 = (hash2 << 7) - hash2 + char * 31;
    hash2 |= 0;
  }

  let hex = "";
  for (let i = 0; i < 32; i++) {
    const seed = Math.abs((i < 16 ? hash1 : hash2) + i * 997);
    const val = (seed + (str.charCodeAt(i % str.length) || 0)) % 16;
    hex += val.toString(16);
  }

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

// Lazy initialization of Supabase client to avoid crashes if environment variables are not configured
let supabaseInstance: any = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey);
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Supabase synchronization helpers
export async function syncProfileToSupabase(profile: any) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, reason: "Supabase not configured" };

  try {
    const uuid = toUuid(profile.id);
    let locationVal = "Lomé";
    let countryVal = "Togo";

    if (profile.location) {
      if (profile.location.includes(",")) {
        const parts = profile.location.split(",");
        locationVal = parts[0].trim();
        countryVal = parts[parts.length - 1].trim();
      } else {
        locationVal = profile.location;
      }
    }

    const payload = {
      id: uuid,
      name: profile.name,
      avatar: profile.avatar || "",
      title: profile.title || "Developer",
      bio: profile.bio || "",
      skills: profile.skills || [],
      location: locationVal,
      country: countryVal,
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      email: profile.email
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.warn("Supabase profile sync error:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Exception during Supabase profile sync:", err);
    return { success: false, err };
  }
}

export async function syncProjectToSupabase(project: any) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, reason: "Supabase not configured" };

  try {
    const payload = {
      id: toUuid(project.id),
      title: project.title,
      description: project.description,
      tech_stack: project.techStack || [],
      github_url: project.githubUrl || "",
      demo_url: project.demoUrl || "",
      author_id: toUuid(project.authorId),
      author_name: project.authorName,
      author_avatar: project.authorAvatar || "",
      likes: project.likes || 0,
      liked_by: (project.likedBy || []).map((id: string) => toUuid(id))
    };

    const { error } = await supabase
      .from("projects")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.warn("Supabase project sync error:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Exception during Supabase project sync:", err);
    return { success: false, err };
  }
}

export async function syncEventToSupabase(event: any) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, reason: "Supabase not configured" };

  try {
    const payload = {
      id: toUuid(event.id),
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString(),
      location: event.location,
      venue: event.venue || "Online",
      organizer: event.organizer || "Community",
      organizer_id: event.organizerId ? toUuid(event.organizerId) : null,
      attendees: (event.attendees || []).map((id: string) => toUuid(id))
    };

    const { error } = await supabase
      .from("events")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.warn("Supabase event sync error:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Exception during Supabase event sync:", err);
    return { success: false, err };
  }
}

export async function deleteProfileFromSupabase(id: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("profiles").delete().eq("id", toUuid(id));
  } catch (err) {
    console.error("Supabase delete profile error:", err);
  }
}

export async function deleteProjectFromSupabase(id: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("projects").delete().eq("id", toUuid(id));
  } catch (err) {
    console.error("Supabase delete project error:", err);
  }
}

export async function deleteEventFromSupabase(id: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("events").delete().eq("id", toUuid(id));
  } catch (err) {
    console.error("Supabase delete event error:", err);
  }
}
