import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google GenAI client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. The Dream Architect will fall back to local neural simulation.");
}

// API endpoint for generating dreams using Gemini
app.post("/api/dream/generate", async (req, res) => {
  const { theme, companion, setting, mood } = req.body;

  if (!theme || !setting || !mood) {
    return res.status(400).json({ error: "Missing required dream parameters: theme, setting, and mood are required." });
  }

  // Fallback mock response in case API key is missing or call fails
  const localFallbackResponse = {
    protocolName: `PROTOCOL-${theme.toUpperCase().replace(/\s+/g, "-")}-${Math.floor(100 + Math.random() * 900)}`,
    frequency: mood === "nightmare" ? "4.2 Hz (Theta-Delta Transition)" : "7.8 Hz (Schumann Resonance)",
    stabilityRating: Math.floor(60 + Math.random() * 35),
    narrative: `Initiating visual anchor in the ${setting} environment. You are accompanied by ${companion || "a silent guide"}. The dream sequence starts with a vivid projection of ${theme}, tinted by an intense ${mood} emotional undertone. The local landscape shifts fluidly underfoot, reflecting your sub-conscious neural state. Visual telemetry confirms stable dream-state consolidation, with sensory nodes reporting full somatic integration. Ambient frequencies of ${mood === "nightmare" ? "low-frequency hums" : "crystal resonators"} fill the dreamscape.`,
    components: ["Neural Anchor Node", "Somatic Feedback Matrix", "Achromatic Render Engine", "Cognitive Liminal Frame"],
    riskFactor: mood === "nightmare" ? "HIGH" : mood === "fear" ? "MEDIUM" : "LOW"
  };

  if (!ai) {
    console.log("No Gemini API client configured. Returning local simulation.");
    return res.json(localFallbackResponse);
  }

  try {
    const prompt = `You are the Dream Architect, an advanced AI system in a futuristic dream cockpit. Generate a highly immersive sci-fi dream sequence.
Inputs:
- Theme of Dream: "${theme}"
- Companion: "${companion || "None/Self"}"
- Setting/Landscape: "${setting}"
- Emotional Mood: "${mood}"

You must respond with a JSON object that adheres strictly to this structure:
{
  "protocolName": "A cool futuristic name (e.g., 'ECLIPSE-V' or 'PROJECT AEON-9')",
  "frequency": "A precise brainwave frequency (e.g., '7.2 Hz' or '4.5 Hz') with a descriptive note",
  "stabilityRating": a number from 30 to 100 representing stability percentage,
  "narrative": "A highly detailed, visually stunning, sci-fi poetic narrative of 3 paragraphs describing the sensory, physical, and neural experience of being inside this dream. Make it feel authentic to the mood.",
  "components": ["An array of 4 advanced-sounding sci-fi technologies or sub-systems designed to render this dream (e.g. 'Sub-Quantum Rendering', 'Theta-Somatic Anchor')"],
  "riskFactor": "LOW", "MEDIUM", or "HIGH" (based on mood, e.g. nightmares or highly erratic settings are HIGH risk)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            protocolName: { type: Type.STRING },
            frequency: { type: Type.STRING },
            stabilityRating: { type: Type.INTEGER },
            narrative: { type: Type.STRING },
            components: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskFactor: { type: Type.STRING }
          },
          required: ["protocolName", "frequency", "stabilityRating", "narrative", "components", "riskFactor"]
        },
        temperature: 0.85
      }
    });

    const text = response.text;
    if (text) {
      const parsedData = JSON.parse(text.trim());
      return res.json(parsedData);
    } else {
      throw new Error("Empty text response from Gemini");
    }
  } catch (error) {
    console.error("Error generating dream via Gemini API, falling back:", error);
    return res.json(localFallbackResponse);
  }
});

// Serve health check
app.get("/api/health", (req, res) => {
  res.json({ status: "online", time: new Date().toISOString(), apiConnected: !!ai });
});

// Setup Vite Dev server middleware or serve built files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configuring production server serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dream Architect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Dream Architect server:", err);
});
