// api/tts/synthesize.js
// Vercel Serverless Function: POST /api/tts/synthesize
import { 
  synthesizeGemini, 
  synthesizeElevenLabs, 
  synthesizeAzure, 
  synthesizeGoogleCloud, 
  synthesizeVoicebox 
} from '../../server/ttsService.js';
import { getEnvKeys, setCorsHeaders, parseBody } from '../_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Gunakan POST.' });
  }

  try {
    const body = parseBody(req);
    const { engine = 'gemini', text, voice, personaPrompt, speed, pitch, dialect } = body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Parameter text tidak boleh kosong.' });
    }

    const envKeys = getEnvKeys();
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

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
