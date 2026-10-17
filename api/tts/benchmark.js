// api/tts/benchmark.js
// Vercel Serverless Function: POST /api/tts/benchmark
import { benchmarkAllEngines } from '../../server/ttsService.js';
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
    const { text, voiceConfig } = body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Parameter text tidak boleh kosong.' });
    }

    const envKeys = getEnvKeys();
    const results = await benchmarkAllEngines({
      text,
      voiceConfig,
      envKeys
    });

    return res.status(200).json({
      text,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
