import { Profile, Project, Event } from "./types";

const avatarKoffi = "/src/assets/images/avatar_koffi_mensah_1782487814653.jpg";
const avatarAbla = "/src/assets/images/avatar_abla_lawson_1782487831921.jpg";
const avatarFatoumata = "/src/assets/images/avatar_fatoumata_diop_1782487845452.jpg";
const avatarEnyonam = "/src/assets/images/avatar_enyonam_kpogo_1782487856413.jpg";
const avatarChinedu = "/src/assets/images/avatar_chinedu_okafor_1782487870160.jpg";
const avatarMwangi = "/src/assets/images/avatar_mwangi_mwangi_1782487884586.jpg";

export const AFRICAN_COUNTRIES = [
  "Togo",
  "Sénégal",
  "Côte d'Ivoire",
  "Bénin",
  "Cameroun",
  "Nigéria",
  "Kenya",
  "Ghana",
  "Afrique du Sud",
  "Rwanda"
];

export const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Koffi Mensah",
    avatar: avatarKoffi,
    title: "Senior Full Stack Developer",
    bio: "Passionné par l'architecture logicielle et les technologies cloud. Organisateur du Lomé JS Meetup. Mentor pour les jeunes développeurs au Togo et en Afrique de l'Ouest.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Docker", "PostgreSQL"],
    location: "Lomé, Togo",
    github: "https://github.com/koffimensah",
    linkedin: "https://linkedin.com/in/koffi-mensah-dev",
    email: "koffi.mensah@devconnect.tg",
    isDemo: true
  },
  {
    id: "demo-2",
    name: "Abla Lawson",
    avatar: avatarAbla,
    title: "UI/UX & Product Designer",
    bio: "Créatrice d'expériences numériques intuitives et engageantes. Je travaille avec les startups africaines pour transformer leurs concepts en interfaces époustouflantes.",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Tailwind CSS", "Prototyping", "Design Systems"],
    location: "Kpalimé, Togo",
    github: "https://github.com/abladesign",
    linkedin: "https://linkedin.com/in/abla-lawson-ux",
    email: "abla.lawson@design.tg",
    isDemo: true
  },
  {
    id: "demo-3",
    name: "Fatoumata Diop",
    avatar: avatarFatoumata,
    title: "AI Researcher & Python Core",
    bio: "Basée à Dakar, Sénégal. Spécialisée dans le NLP appliqué aux langues locales africaines (Wolof, Bambara, Éwé). Fervente partisane de l'IA inclusive.",
    skills: ["Python", "TensorFlow", "NLP", "Machine Learning", "PyTorch", "Flask"],
    location: "Dakar, Sénégal",
    github: "https://github.com/fatoumata_diop",
    linkedin: "https://linkedin.com/in/fatoumata-diop-ai",
    email: "fatoumata@diop-ai.sn",
    isDemo: true
  },
  {
    id: "demo-4",
    name: "Enyonam Kpogo",
    avatar: avatarEnyonam,
    title: "Mobile App Developer",
    bio: "Développeuse Flutter et Swift. J'adore créer des applications mobiles fluides et performantes pour résoudre les défis quotidiens des Africains.",
    skills: ["Flutter", "Dart", "Swift", "Firebase", "App Store Deployment", "Git"],
    location: "Abidjan, Côte d'Ivoire",
    github: "https://github.com/enyonam_flutter",
    linkedin: "https://linkedin.com/in/enyonam-kpogo",
    email: "enyonam.kpogo@mobile.tg",
    isDemo: true
  },
  {
    id: "demo-5",
    name: "Chinedu Okafor",
    avatar: avatarChinedu,
    title: "Backend & Systems Architect",
    bio: "From Lagos, Nigeria. Building scalable concurrent APIs and microservices. Contributor to various open-source distributed systems projects.",
    skills: ["Go", "Rust", "Kubernetes", "Kafka", "PostgreSQL", "gRPC"],
    location: "Lagos, Nigéria",
    github: "https://github.com/chinedu_systems",
    linkedin: "https://linkedin.com/in/chinedu-okafor-arch",
    email: "chinedu@systems.ng",
    isDemo: true
  },
  {
    id: "demo-6",
    name: "Mwangi Mwangi",
    avatar: avatarMwangi,
    title: "FinTech Consultant & Web3 Lead",
    bio: "Nairobi, Kenya. Exploring the convergence of mobile money APIs (M-Pesa) and decentralized finance. Blockchain enthusiast.",
    skills: ["Solidity", "TypeScript", "Node.js", "Web3", "Cryptography", "Express"],
    location: "Nairobi, Kenya",
    github: "https://github.com/mwangi_web3",
    linkedin: "https://linkedin.com/in/mwangi-web3",
    email: "mwangi@fintech.ke",
    isDemo: true
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "AgroMarket Africa",
    description: "Une plateforme de mise en relation directe entre les agriculteurs des régions rurales d'Afrique subsaharienne et les acheteurs urbains pour éviter les intermédiaires spéculatifs et assurer des prix justes.",
    techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Leaflet Maps"],
    githubUrl: "https://github.com/koffimensah/agromarket-togo",
    demoUrl: "https://agromarket.tg",
    authorId: "demo-1",
    authorName: "Koffi Mensah",
    authorAvatar: avatarKoffi,
    createdAt: "2026-04-10T10:00:00Z",
    likes: 38,
    likedBy: ["demo-3", "demo-4", "demo-5"],
    techStackIdeal: `### 🔮 Architecture Idéale de l'Oracle IA


1. **Frontend & SSR** : **Next.js 14+ (App Router)** pour un excellent référencement SEO de vos produits et des performances optimales.
2. **Paiements Mobiles (Afrique de l'Ouest)** :
   - Intégration de **FedaPay** ou **PayGate** pour récolter les fonds via **T-Money** et **Flooz** au Togo.
   - Intégration de **Wave** et **Orange Money** pour la sous-région (Sénégal, Côte d'Ivoire).
3. **Base de Données** : **PostgreSQL** hébergée sur **Supabase** pour une gestion des stocks fiable en temps réel avec synchronisation directe.
4. **Hébergement** : Déploiement automatisé sur **Cloud Run** ou **Vercel** pour assurer une montée en charge progressive et économique.
5. **Alerte SMS** : Intégration de l'API **Semoa** pour notifier instantanément les agriculteurs par SMS de chaque vente effectuée, même sans connexion Internet.`,
    pitchDeck: `# Slide 1 : Le Problème ⚠️
Les petits agriculteurs perdent jusqu'à 40% de leurs récoltes faute de débouchés fiables, tandis que les intermédiaires spéculatifs rognent leurs marges bénéficiaires.

---
# Slide 2 : La Solution 💡
Une marketplace mobile et web simplifiée qui connecte directement et en direct les coopératives agricoles aux acheteurs urbains grossistes, sécurisée par Mobile Money.

---
# Slide 3 : Le Marché Africain 🌍
- **TAM** : $250 milliards de valeur de production agricole en Afrique subsaharienne.
- **SAM** : Marché de gros agroalimentaire régional de $12 milliards en Afrique de l'Ouest.
- **SOM** : Togo et pays côtiers limitrophes représentant $45 millions d'échanges à numériser.

---
# Slide 4 : Modèle Économique 💰
- **Commission** : 5% sur chaque transaction sécurisée par notre plateforme.
- **SaaS Premium** : Abonnement de $8/mois pour les coopératives désirant des statistiques de prix avancées et des prévisions de vente.

---
# Slide 5 : Appel à l'Action 🚀
Rejoignez notre révolution verte ! Nous recherchons :
- **50 coopératives pilotes** au Togo et au Bénin.
- Un financement de **$150,000** en pré-amorçage pour déployer nos premiers hubs logistiques.`
  },
  {
    id: "proj-2",
    title: "Pan-African Transit Tracker",
    description: "Application intelligente pour suivre en temps réel les transports collectifs (gbaka, trotro, zemidjan) dans les grandes métropoles (Abidjan, Lomé, Lagos), optimisant le temps de trajet.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Express.js"],
    githubUrl: "https://github.com/enyonam_flutter/lome-transit-tracker",
    demoUrl: "https://lometransit.tg",
    authorId: "demo-4",
    authorName: "Enyonam Kpogo",
    authorAvatar: avatarEnyonam,
    createdAt: "2026-05-15T14:30:00Z",
    likes: 29,
    likedBy: ["demo-1", "demo-2", "demo-5", "demo-6"]
  },
  {
    id: "proj-3",
    title: "AfriVoice Wolof/Ewe NLP",
    description: "Moteur d'intelligence artificielle open-source de transcription et de synthèse vocale pour les langues wolof et éwé, conçu pour autonomiser les populations rurales illettrées.",
    techStack: ["Python", "TensorFlow", "HuggingFace", "FastAPI"],
    githubUrl: "https://github.com/fatoumata_diop/afrivoice-nlp",
    demoUrl: "https://afrivoice.sn",
    authorId: "demo-3",
    authorName: "Fatoumata Diop",
    authorAvatar: avatarFatoumata,
    createdAt: "2026-06-01T09:15:00Z",
    likes: 47,
    likedBy: ["demo-1", "demo-3", "demo-6", "demo-2"]
  }
];

export const DEMO_EVENTS: Event[] = [
  {
    id: "evt-1",
    title: "Lomé Javascript Meetup #5",
    description: "Le rendez-vous incontournable des passionnés de JS, React, Node et TypeScript à Lomé. Au programme : des talks techniques, des partages d'expériences sur les architectures SPA et du réseautage professionnel.",
    date: "2026-07-15T18:30:00Z",
    location: "Lomé, Togo",
    venue: "Woelab Prime (Amadahomé)",
    organizer: "Koffi Mensah",
    organizerId: "demo-1",
    attendees: ["demo-2", "demo-4"]
  },
  {
    id: "evt-2",
    title: "Africa Tech Summit Nairobi 2026",
    description: "Le plus grand sommet tech d'Afrique de l'Est rassemblant investisseurs, startups et développeurs. Conférences de pointe sur la FinTech, l'IA, le Web3 et l'écosystème numérique continental.",
    date: "2026-08-12T09:00:00Z",
    location: "Nairobi, Kenya",
    venue: "Sarit Expo Centre",
    organizer: "Mwangi Mwangi",
    organizerId: "demo-6",
    attendees: ["demo-1", "demo-3", "demo-5"]
  },
  {
    id: "evt-3",
    title: "Dakar Web & AI Summit 2026",
    description: "Conférence hybride axée sur les avancées du web moderne et l'intégration de modèles d'IA génératifs dans les applications locales. Hackathon de 24h inclus !",
    date: "2026-07-28T10:00:00Z",
    location: "Dakar, Sénégal",
    venue: "Dakar Arena & Online",
    organizer: "Fatoumata Diop",
    organizerId: "demo-3",
    attendees: ["demo-4", "demo-2", "demo-6"]
  },
  {
    id: "evt-4",
    title: "Pan-African Cyber Hackathon (Online)",
    description: "Compétition de sécurité offensive et défensive ouverte à tous les développeurs et étudiants d'Afrique. Relevez des défis CTF (Capture The Flag) de niveau mondial et gagnez de fabuleux prix.",
    date: "2026-09-05T08:00:00Z",
    location: "En ligne / Online",
    venue: "Discord officiel & Plateforme CTFd",
    organizer: "DevConnect Africa Community",
    organizerId: "system",
    attendees: ["demo-1", "demo-2", "demo-3", "demo-4", "demo-5", "demo-6"]
  },
  {
    id: "evt-5",
    title: "Lagos DevFest 2026",
    description: "Le rassemblement géant de développeurs à Lagos, Nigeria. Talks exclusifs sur l'ingénierie système en Rust/Go, le cloud hybride, et les technologies d'échelles de millions d'utilisateurs actifs.",
    date: "2026-09-20T08:30:00Z",
    location: "Lagos, Nigéria",
    venue: "Landmark Centre",
    organizer: "Chinedu Okafor",
    organizerId: "demo-5",
    attendees: ["demo-1", "demo-6", "demo-3"]
  },
  {
    id: "evt-6",
    title: "Africa Startup Cup (Présentiel & En ligne)",
    description: "Une compétition internationale incroyable où les développeurs et fondateurs de toute l'Afrique présentent leurs innovations technologiques devant des jurys d'envergure globale. Sessions de mentorat de haut vol.",
    date: "2026-10-10T09:00:00Z",
    location: "Kigali, Rwanda",
    venue: "Kigali Convention Centre & Streaming",
    organizer: "DevConnect Africa",
    organizerId: "system",
    attendees: ["demo-2", "demo-4", "demo-5"]
  }
];

