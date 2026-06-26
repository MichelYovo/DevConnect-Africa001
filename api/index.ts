import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Route for Gemini Oracle AI
app.post("/api/oracle/generate", async (req, res) => {
  try {
    const { title, description, techStack } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Le titre et la description sont requis." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Clé API Gemini manquante. Veuillez configurer GEMINI_API_KEY dans vos secrets de l'application." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
Vous êtes l'Oracle IA de DevConnect Africa, un architecte logiciel de classe mondiale et un expert de l'écosystème technologique africain (notamment en Afrique de l'Ouest, de l'Est et du Centre).

Votre tâche est de générer la stack technique idéale et un pitch deck professionnel pour le projet suivant :
Titre du projet : ${title}
Description du projet : ${description}
Stack actuelle (si spécifiée) : ${techStack ? techStack.join(", ") : "Aucune"}

Veuillez structurer votre réponse au format JSON avec EXACTEMENT ces clés :
1. "techStackIdeal" : Un texte détaillé en Markdown (en français) décrivant la stack technique idéale pour ce projet en Afrique. Intégrez spécifiquement des solutions de paiement locales adaptées comme FedaPay, PayGate, Semoa, Flooz, T-Money, Wave ou Orange Money selon les cas d'utilisation, expliquez les raisons des choix d'architecture (ex: Next.js, hosting sans serveur, DB performante) et proposez une feuille de route d'implémentation étape par étape.
2. "pitchDeck" : Un pitch deck professionnel et captivant de 5 slides rédigé en Markdown (en français) utilisant des séparateurs de slides clairs (comme des balises <div class="slide"> ou des sections) comprenant : Problème, Solution, Taille du marché en Afrique, Modèle économique (Business Model), et Appel à l'action / Prochaines étapes.
3. "suggestedTags" : Un tableau de chaînes de caractères (tags) suggérant les technologies idéales (ex: ["Next.js", "FedaPay", "Supabase", "React"]).

Générez uniquement l'objet JSON brut valide, sans inclure de balises de code Markdown de type \`\`\`json au début ou à la fin.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Aucune réponse générée par l'Oracle.");
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    const result = JSON.parse(cleanedText);
    res.json(result);

  } catch (error: any) {
    console.error("Erreur Oracle IA:", error);
    res.status(500).json({ error: error.message || "Une erreur interne s'est produite lors de l'appel à l'Oracle." });
  }
});

export default app;
