import { Profile, Project, Event } from "./types";

export const TOGO_CITIES = [
  "Lomé",
  "Kara",
  "Sokodé",
  "Atakpamé",
  "Tsévié",
  "Kpalimé"
];

export const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Koffi Mensah",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    title: "Senior Full Stack Developer",
    bio: "Passionné par l'architecture logicielle et les technologies cloud. Organisateur du Lomé JS Meetup. Mentor pour les jeunes développeurs au Togo.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Docker", "PostgreSQL"],
    location: "Lomé",
    github: "https://github.com/koffimensah",
    linkedin: "https://linkedin.com/in/koffi-mensah-dev",
    email: "koffi.mensah@devconnect.tg",
    isDemo: true
  },
  {
    id: "demo-2",
    name: "Abla Lawson",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    title: "UI/UX & Product Designer",
    bio: "Créatrice d'expériences numériques intuitives et engageantes. Je travaille avec les startups locales pour transformer leurs concepts en interfaces époustouflantes.",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Tailwind CSS", "Prototyping", "Design Systems"],
    location: "Kpalimé",
    github: "https://github.com/abladesign",
    linkedin: "https://linkedin.com/in/abla-lawson-ux",
    email: "abla.lawson@design.tg",
    isDemo: true
  },
  {
    id: "demo-3",
    name: "Yaovi Amegadjie",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Backend & DevOps Engineer",
    bio: "Spécialiste Go et Python. J'optimise les bases de données et gère les infrastructures Cloud. Fervent partisan de l'open source.",
    skills: ["Go", "Python", "Kubernetes", "AWS", "CI/CD", "Redis"],
    location: "Kara",
    github: "https://github.com/yaovi_devops",
    linkedin: "https://linkedin.com/in/yaovi-amegadjie",
    email: "yaovi.a@cloud.tg",
    isDemo: true
  },
  {
    id: "demo-4",
    name: "Enyonam Kpogo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Mobile App Developer",
    bio: "Développeuse Flutter et Swift. J'adore créer des applications mobiles fluides et performantes pour résoudre les défis quotidiens des Togolais.",
    skills: ["Flutter", "Dart", "Swift", "Firebase", "App Store Deployment", "Git"],
    location: "Lomé",
    github: "https://github.com/enyonam_flutter",
    linkedin: "https://linkedin.com/in/enyonam-kpogo",
    email: "enyonam.kpogo@mobile.tg",
    isDemo: true
  },
  {
    id: "demo-5",
    name: "Tété Ayayi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Data Analyst & AI Enthusiast",
    bio: "Analyse des données pour guider la prise de décision. J'explore l'utilisation du Machine Learning pour l'agriculture connectée au Togo.",
    skills: ["Python", "SQL", "Pandas", "Power BI", "Machine Learning", "Data Viz"],
    location: "Sokodé",
    github: "https://github.com/tete_data",
    linkedin: "https://linkedin.com/in/tete-ayayi-data",
    email: "tete.ayayi@data.tg",
    isDemo: true
  },
  {
    id: "demo-6",
    name: "Akouvi Agbogli",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    title: "Étudiante en Génie Logiciel",
    bio: "Étudiante à l'Université de Lomé (FDS). Passionnée de programmation et avide d'apprendre de nouvelles technologies. Membre active du club info.",
    skills: ["HTML/CSS", "JavaScript", "Java", "SQL", "Tailwind CSS", "Git"],
    location: "Tsévié",
    github: "https://github.com/akouvi_student",
    linkedin: "https://linkedin.com/in/akouvi-agbogli",
    email: "akouvi.agbogli@univ-lome.tg",
    isDemo: true
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "AgroMarket Togo",
    description: "Une plateforme de mise en relation directe entre les agriculteurs des régions du Togo (Kara, Plateaux, Maritime) et les acheteurs urbains à Lomé pour éviter les intermédiaires et assurer des prix justes.",
    techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Leaflet Maps"],
    githubUrl: "https://github.com/koffimensah/agromarket-togo",
    demoUrl: "https://agromarket.tg",
    authorId: "demo-1",
    authorName: "Koffi Mensah",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-04-10T10:00:00Z",
    likes: 24,
    likedBy: ["demo-3", "demo-4"]
  },
  {
    id: "proj-2",
    title: "Lomé Transport Web Tracker",
    description: "Application mobile et web pour suivre en temps réel les trajets des taxis collectifs et bus de Lomé, permettant d'estimer les heures d'arrivée et d'optimiser la mobilité urbaine.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Express.js"],
    githubUrl: "https://github.com/enyonam_flutter/lome-transit-tracker",
    demoUrl: "https://lometransit.tg",
    authorId: "demo-4",
    authorName: "Enyonam Kpogo",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-05-15T14:30:00Z",
    likes: 18,
    likedBy: ["demo-1", "demo-2", "demo-5"]
  },
  {
    id: "proj-3",
    title: "Kpalimé Tourisme Virtuel",
    description: "Guide touristique immersif en 3D et carte interactive de la région de Kpalimé (Mont Agou, cascades de Womé). Conçu pour stimuler le tourisme vert togolais.",
    techStack: ["Figma", "Three.js", "React Three Fiber", "Tailwind CSS"],
    githubUrl: "https://github.com/abladesign/kpalime-virtual-tour",
    demoUrl: "https://visitkpalime.tg",
    authorId: "demo-2",
    authorName: "Abla Lawson",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-06-01T09:15:00Z",
    likes: 31,
    likedBy: ["demo-1", "demo-3", "demo-6"]
  }
];

export const DEMO_EVENTS: Event[] = [
  {
    id: "evt-1",
    title: "Lomé Javascript Meetup #5",
    description: "Le rendez-vous incontournable des passionnés de JS, React, Node et TypeScript à Lomé. Au programme : des talks techniques, des partages d'expériences sur les architectures SPA et du réseautage professionnel.",
    date: "2026-07-15T18:30:00Z",
    location: "Lomé",
    venue: "Woelab Prime (Amadahomé)",
    organizer: "Koffi Mensah",
    organizerId: "demo-1",
    attendees: ["demo-2", "demo-4", "demo-6"]
  },
  {
    id: "evt-2",
    title: "Kara Tech Bootcamp 2026",
    description: "Un week-end intensif de formation sur le Cloud, la conteneurisation Docker/Kubernetes et l'intégration continue. Idéal pour les étudiants et professionnels de la région de la Kara souhaitant booster leurs compétences DevOps.",
    date: "2026-08-08T09:00:00Z",
    location: "Kara",
    venue: "Université de Kara - Amphi 500",
    organizer: "Yaovi Amegadjie",
    organizerId: "demo-3",
    attendees: ["demo-1", "demo-5"]
  },
  {
    id: "evt-3",
    title: "Atelier UI/UX Design & Figma",
    description: "Atelier pratique pour maîtriser les grilles, les variables de couleurs, les auto-layouts avancés et les composants interactifs sur Figma. Apprenez à concevoir des produits calqués sur les standards de Vercel et Stripe.",
    date: "2026-07-22T14:00:00Z",
    location: "Kpalimé",
    venue: "Espace Créatif Kpalimé & Coworking",
    organizer: "Abla Lawson",
    organizerId: "demo-2",
    attendees: ["demo-4", "demo-6"]
  },
  {
    id: "evt-4",
    title: "Togo IA Hackathon",
    description: "Compétition de 48 heures pour créer des solutions d'intelligence artificielle appliquées à la santé et à l'éducation en milieu rural au Togo. Des mentors experts guideront les équipes.",
    date: "2026-09-01T08:00:00Z",
    location: "Lomé",
    venue: "Energy Generation Campus",
    organizer: "DevConnect Togo Community",
    organizerId: "system",
    attendees: ["demo-1", "demo-2", "demo-3", "demo-4", "demo-5", "demo-6"]
  }
];
