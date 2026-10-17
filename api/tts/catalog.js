// api/tts/catalog.js
// Vercel Serverless Function: GET /api/tts/catalog
import { getActiveCatalog } from '../../server/ttsCatalog.js';
import { setCorsHeaders } from '../_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const catalog = getActiveCatalog();
    return res.status(200).json({ catalog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
