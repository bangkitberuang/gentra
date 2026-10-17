// server/ttsMiddleware.js
import fs from 'fs';
import path from 'path';
import { 
  synthesizeGemini, 
  synthesizeElevenLabs, 
  synthesizeAzure, 
  synthesizeGoogleCloud, 
  synthesizeVoicebox,
  benchmarkAllEngines 
} from './ttsService.js';

// Baca file .env dan .env.local
function getEnvKeys() {
  const envKeys = {
    GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || '',
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY || '',
    AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION || 'southeastasia',
    GOOGLE_CLOUD_TTS_KEY: process.env.GOOGLE_CLOUD_TTS_KEY || '',
    VOICEBOX_PORT: process.env.VOICEBOX_PORT || 17493
  };

  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        content.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...vals] = trimmed.split('=');
            const val = vals.join('=').trim();
            if (key === 'VITE_GEMINI_API_KEY' || key === 'GEMINI_API_KEY') {
              if (!envKeys.GEMINI_API_KEY) envKeys.GEMINI_API_KEY = val;
            }
            if (key === 'ELEVENLABS_API_KEY' && !envKeys.ELEVENLABS_API_KEY) envKeys.ELEVENLABS_API_KEY = val;
            if (key === 'AZURE_SPEECH_KEY' && !envKeys.AZURE_SPEECH_KEY) envKeys.AZURE_SPEECH_KEY = val;
            if (key === 'AZURE_SPEECH_REGION' && !envKeys.AZURE_SPEECH_REGION) envKeys.AZURE_SPEECH_REGION = val;
            if (key === 'GOOGLE_CLOUD_TTS_KEY' && !envKeys.GOOGLE_CLOUD_TTS_KEY) envKeys.GOOGLE_CLOUD_TTS_KEY = val;
          }
        });
      }
    } catch (e) {}
  }

  return envKeys;
}

export function ttsApiPlugin() {
  return {
    name: 'gentra-tts-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/tts/')) {
          return next();
        }

        const envKeys = getEnvKeys();

        // 1. GET /api/tts/status -> Cek status konfigurasi semua engine
        if (req.method === 'GET' && req.url === '/api/tts/status') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            engines: {
              gemini: { 
                name: 'Gemini 3.8 Flash Neural', 
                provider: 'Google DeepMind',
                configured: Boolean(envKeys.GEMINI_API_KEY),
                tier: 'Cloud AI Flagship'
              },
              elevenlabs: { 
                name: 'ElevenLabs Multilingual v2', 
                provider: 'ElevenLabs Inc.',
                configured: Boolean(envKeys.ELEVENLABS_API_KEY),
                tier: 'Studio Hyper-Realistic'
              },
              azure: { 
                name: 'Microsoft Azure Neural TTS', 
                provider: 'Microsoft Cognitive Services',
                configured: Boolean(envKeys.AZURE_SPEECH_KEY),
                region: envKeys.AZURE_SPEECH_REGION,
                tier: 'Broadcast Government Standard'
              },
              google_cloud: { 
                name: 'Google Cloud Neural2', 
                provider: 'Google Cloud Platform',
                configured: Boolean(envKeys.GOOGLE_CLOUD_TTS_KEY),
                tier: 'Enterprise Cloud TTS'
              },
              voicebox: { 
                name: 'Voicebox Local Workstation', 
                provider: 'Kokoro On-Premise',
                configured: true,
                port: envKeys.VOICEBOX_PORT,
                tier: '100% Offline Sovereign Privacy'
              }
            }
          }));
          return;
        }

        // Helper untuk parse JSON body
        const readJsonBody = () => new Promise((resolve, reject) => {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (err) {
              reject(err);
            }
          });
        });

        // 2. POST /api/tts/synthesize -> Sintesis tunggal sesuai engine
        if (req.method === 'POST' && req.url === '/api/tts/synthesize') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body = await readJsonBody();
            const { engine = 'gemini', text, voice, personaPrompt, speed, pitch, dialect } = body;

            if (!text || !text.trim()) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Parameter text tidak boleh kosong.' }));
              return;
            }

            let result;
            if (engine === 'gemini') {
              result = await synthesizeGemini({
                text,
                voice,
                personaPrompt,
                speed,
                dialect,
                apiKey: envKeys.GEMINI_API_KEY
              });
            } else if (engine === 'elevenlabs') {
              result = await synthesizeElevenLabs({
                text,
                voiceId: voice,
                apiKey: envKeys.ELEVENLABS_API_KEY
              });
            } else if (engine === 'azure') {
              result = await synthesizeAzure({
                text,
                voice: voice || 'id-ID-GadisNeural',
                apiKey: envKeys.AZURE_SPEECH_KEY,
                region: envKeys.AZURE_SPEECH_REGION
              });
            } else if (engine === 'google_cloud') {
              result = await synthesizeGoogleCloud({
                text,
                voice: voice || 'id-ID-Neural2-A',
                apiKey: envKeys.GOOGLE_CLOUD_TTS_KEY
              });
            } else if (engine === 'voicebox') {
              result = await synthesizeVoicebox({
                text,
                voice,
                speed,
                port: envKeys.VOICEBOX_PORT
              });
            } else {
              throw new Error(`Engine ${engine} tidak dikenali.`);
            }

            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 3. POST /api/tts/benchmark -> Bandingkan 5 Engine Sekaligus
        if (req.method === 'POST' && req.url === '/api/tts/benchmark') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body = await readJsonBody();
            const { text, voiceConfig } = body;

            if (!text || !text.trim()) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Parameter text tidak boleh kosong.' }));
              return;
            }

            const results = await benchmarkAllEngines({
              text,
              voiceConfig,
              envKeys
            });

            res.end(JSON.stringify({
              text,
              timestamp: new Date().toISOString(),
              results
            }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}
