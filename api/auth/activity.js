// api/auth/activity.js
// Vercel Serverless Function: Audit Trail Aktivitas & Riwayat Naskah per Akun
import { getActivities, logActivity, getUserCreationSummary } from '../../server/userStore.js';
import { setCorsHeaders, parseBody } from '../_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { user, limit } = req.query || {};
      const activities = getActivities(user || null, limit ? parseInt(limit, 10) : 200);
      const summary = getUserCreationSummary();
      return res.status(200).json({ success: true, activities, summary });
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      const entry = logActivity(body);
      return res.status(200).json({ success: true, entry });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
