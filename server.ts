import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API route for campus exploration using Gemini 3.8 Flash with Google Maps grounding
app.post('/api/campus-explore', async (req, res) => {
  try {
    const { query, userLocation } = req.body;
    const prompt = query || 'What are the main academic blocks, library, and canteen locations at IET DAVV Khandwa Road, Indore?';

    // Latitude & Longitude for IET DAVV Indore: 22.6806, 75.8778
    const lat = userLocation?.latitude || 22.6806;
    const lng = userLocation?.longitude || 75.8778;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert student guide for Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya (IET DAVV), Khandwa Road, Indore.
Answer the following student query concisely and accurately using Google Maps data. 
Provide specific details about IET DAVV blocks (M-Block, E-Block, CC Lab, Workshop, Library, Canteen) or nearby spots along Khandwa Road / Bhawarkua:
"${prompt}"`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract map URLs from grounding chunks as mandated by Maps grounding guidelines
    const mapLinks: Array<{ title: string; uri: string }> = [];
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if ((chunk as any).maps?.uri) {
          mapLinks.push({
            title: (chunk as any).maps.title || 'Google Maps Location',
            uri: (chunk as any).maps.uri,
          });
        }
      }
    }

    res.json({
      text,
      mapLinks,
    });
  } catch (error: any) {
    console.error('Campus explore error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to fetch campus information',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
