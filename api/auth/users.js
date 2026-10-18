// api/auth/users.js
// Vercel Serverless Function: Manajemen Akun & Kata Sandi
import { getAllUsers, saveUser, deleteUser, getUserCreationSummary } from '../../server/userStore.js';
import { setCorsHeaders, parseBody } from '../_utils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { summary } = req.query || {};
      if (summary === 'true') {
        const stats = getUserCreationSummary();
        return res.status(200).json({ success: true, summary: stats });
      }
      const users = getAllUsers().map(({ password, ...u }) => ({
        ...u,
        hasPassword: Boolean(password)
      }));
      return res.status(200).json({ success: true, users });
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      const { email, password, name, role, department, isActive } = body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email dan kata sandi wajib diisi.' });
      }

      const updatedUsers = saveUser({ email, password, name, role, department, isActive });
      return res.status(200).json({
        success: true,
        message: `Akun ${email} berhasil disimpan.`,
        users: updatedUsers.map(({ password, ...u }) => u)
      });
    }

    if (req.method === 'DELETE') {
      const { email } = req.query || parseBody(req);
      if (!email) {
        return res.status(400).json({ success: false, error: 'Parameter email wajib disertakan.' });
      }
      const updated = deleteUser(email);
      return res.status(200).json({ success: true, message: `Akun ${email} berhasil dihapus.`, users: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
