// server/userStore.js
// Manajemen Akun, Kata Sandi, dan Audit Trail Aktivitas Produksi Naskah GENTRA
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// Akun Bawaan Sistem Awal
const DEFAULT_USERS = [
  {
    id: 'user_admin_01',
    email: 'admin@gentra.internal',
    password: 'admin2026',
    name: 'MASTER ADMIN',
    role: 'Master Admin',
    department: 'Biro Administrasi Pimpinan (Adpim) Jabar',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user_prod_01',
    email: 'tim@gentra.internal',
    password: 'gentra2026',
    name: 'TIM PRODUKSI MEDIA',
    role: 'Tim Produksi',
    department: 'Divisi Produksi Konten Kreatif',
    isActive: true,
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'user_diskominfo_01',
    email: 'diskominfo@jabarprov.go.id',
    password: 'jabar2026',
    name: 'DISPUTAR KOMINFO JABAR',
    role: 'Editor Naskah Pemda',
    department: 'Dinas Komunikasi dan Informatika Jabar',
    isActive: true,
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'user_penyiar_01',
    email: 'penyiar@gentra.internal',
    password: 'suara2026',
    name: 'PENGISI SUARA RESMI',
    role: 'Pengisi Suara',
    department: 'Talenta Suara & Budaya Pasundan',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z'
  }
];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf8');
    }
    if (!fs.existsSync(ACTIVITIES_FILE)) {
      fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    // Fallback in-memory jika serverless read-only filesystem
  }
}

// In-Memory Fallback untuk lingkungan Serverless Read-Only (Vercel)
let inMemoryUsers = [...DEFAULT_USERS];
let inMemoryActivities = [];

export function getAllUsers() {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const users = JSON.parse(data);
      inMemoryUsers = users;
      return users;
    }
  } catch (e) {}
  return inMemoryUsers;
}

export function saveUser({ email, password, name, role, department = 'Pemprov Jawa Barat', isActive = true }) {
  ensureDataDir();
  const users = getAllUsers();
  const cleanEmail = String(email || '').toLowerCase().trim();

  if (!cleanEmail) throw new Error('Email akun wajib diisi.');
  if (!password || password.length < 4) throw new Error('Kata sandi minimal 4 karakter.');

  const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (existingIdx >= 0) {
    // Update existing user
    users[existingIdx] = {
      ...users[existingIdx],
      name: name || users[existingIdx].name,
      password: password || users[existingIdx].password,
      role: role || users[existingIdx].role,
      department: department || users[existingIdx].department,
      isActive: isActive !== undefined ? isActive : users[existingIdx].isActive,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      password,
      name: name || cleanEmail.split('@')[0].toUpperCase(),
      role: role || 'Tim Produksi',
      department,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
  }

  inMemoryUsers = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {}

  return users;
}

export function deleteUser(email) {
  ensureDataDir();
  const users = getAllUsers();
  const cleanEmail = String(email || '').toLowerCase().trim();

  // Lindungi akun Master Admin bawaan agar tidak terhapus total
  if (cleanEmail === 'admin@gentra.internal') {
    throw new Error('Akun Master Admin utama tidak boleh dihapus.');
  }

  const filtered = users.filter(u => u.email.toLowerCase() !== cleanEmail);
  inMemoryUsers = filtered;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  } catch (e) {}

  return filtered;
}

export function authenticateUser(email, password) {
  const users = getAllUsers();
  const cleanEmail = String(email || '').toLowerCase().trim();
  const cleanPass = String(password || '').trim();

  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return { success: false, message: 'Akun email tidak terdaftar.' };
  }

  if (!user.isActive) {
    return { success: false, message: 'Akun ini dinonaktifkan oleh administrator.' };
  }

  if (user.password !== cleanPass) {
    return { success: false, message: 'Kata sandi salah.' };
  }

  // Sanitasi output password
  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}

// ==========================================
// AUDIT LOG & RIWAYAT PEMBUATAN NASKAH
// ==========================================
export function getActivities(emailFilter = null, limit = 100) {
  ensureDataDir();
  let activities = inMemoryActivities;
  try {
    if (fs.existsSync(ACTIVITIES_FILE)) {
      const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
      activities = JSON.parse(data);
      inMemoryActivities = activities;
    }
  } catch (e) {}

  if (emailFilter) {
    const clean = String(emailFilter).toLowerCase().trim();
    activities = activities.filter(a => a.userEmail?.toLowerCase() === clean);
  }

  // Sort newest first
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function logActivity({
  userEmail,
  userName,
  action = 'Sintesis Audio Voice Over',
  scriptText = '',
  voiceUsed = 'Anita',
  originalVoiceName = 'Anita',
  backendVoiceId = 'Aoede',
  engine = 'Google Gemini Neural',
  charCount = 0,
  wordCount = 0,
  speed = 1.0,
  dialect = 'sunda'
}) {
  ensureDataDir();
  const activities = getActivities(null, 500);

  const cleanText = String(scriptText || '').trim();
  const computedCharCount = charCount || cleanText.length;
  const computedWordCount = wordCount || (cleanText ? cleanText.split(/\s+/).length : 0);

  const newEntry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userEmail: userEmail || 'tim@gentra.internal',
    userName: userName || userEmail?.split('@')[0]?.toUpperCase() || 'TIM PRODUKSI',
    action,
    scriptText: cleanText,
    scriptSnippet: cleanText.length > 90 ? cleanText.slice(0, 90) + '...' : cleanText,
    charCount: computedCharCount,
    wordCount: computedWordCount,
    voiceUsed,
    originalVoiceName: originalVoiceName || voiceUsed,
    backendVoiceId: backendVoiceId || 'Aoede',
    engine,
    speed,
    dialect,
    timestamp: new Date().toISOString()
  };

  activities.unshift(newEntry);
  inMemoryActivities = activities.slice(0, 500);

  try {
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(inMemoryActivities, null, 2), 'utf8');
  } catch (e) {}

  return newEntry;
}

// Rekapitulasi Statistik Pembuatan per Akun
export function getUserCreationSummary() {
  const users = getAllUsers();
  const activities = getActivities(null, 1000);

  return users.map(user => {
    const userActs = activities.filter(a => a.userEmail?.toLowerCase() === user.email.toLowerCase());
    const totalChars = userActs.reduce((acc, curr) => acc + (curr.charCount || 0), 0);
    const totalWords = userActs.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
    const voiceovers = userActs.filter(a => a.action?.includes('Sintesis') || a.action?.includes('Voice Over'));
    const scripts = userActs.filter(a => a.action?.includes('Naskah') || a.action?.includes('Copywriting') || a.action?.includes('ILM'));

    const lastActive = userActs.length > 0 ? userActs[0].timestamp : user.createdAt;

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      totalCreations: userActs.length,
      totalAudioGenerated: voiceovers.length,
      totalScriptsGenerated: scripts.length,
      totalCharacters: totalChars,
      totalWords: totalWords,
      lastActive,
      recentScripts: userActs.slice(0, 5).map(a => ({
        id: a.id,
        action: a.action,
        snippet: a.scriptSnippet,
        text: a.scriptText,
        voiceUsed: a.voiceUsed,
        charCount: a.charCount,
        timestamp: a.timestamp
      }))
    };
  });
}
