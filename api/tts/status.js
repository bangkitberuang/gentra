// api/tts/status.js
// Vercel Serverless Function: GET /api/tts/status
import { getEnvKeys, setCorsHeaders } from '../_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const envKeys = getEnvKeys();

  return res.status(200).json({
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
        configured: false,
        port: envKeys.VOICEBOX_PORT,
        tier: '100% Offline Sovereign Privacy (Workstation Only)'
      }
    }
  });
}
