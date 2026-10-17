// api/_utils.js
// Utility helper untuk Vercel Serverless Functions GENTRA
import fs from 'fs';
import path from 'path';

export function getEnvKeys() {
  const envKeys = {
    GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || '',
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY || '',
    AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION || 'southeastasia',
    GOOGLE_CLOUD_TTS_KEY: process.env.GOOGLE_CLOUD_TTS_KEY || '',
    VOICEBOX_PORT: process.env.VOICEBOX_PORT || 17493
  };

  // Baca file .env dan .env.local jika tersedia di filesystem (berguna saat vercel dev lokal)
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
    } catch (e) {
      // Ignored: Vercel production uses process.env directly
    }
  }

  return envKeys;
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

export function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return req.body;
}
