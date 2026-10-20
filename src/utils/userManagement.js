// src/utils/userManagement.js
// Single Source of Truth untuk Manajemen Akun Pengguna & Audit Trail Naskah
// Bekerja Dual-Storage (Browser safeStorage + Serverless API Fallback)
import { safeGetItem, safeSetItem } from './safeStorage.js';

export const USERS_STORAGE_KEY = 'gentra_user_accounts_v1';
export const ACTIVITIES_STORAGE_KEY = 'gentra_account_activities_v1';
export const USERS_EVENT = 'gentra_accounts_updated';
export const ACTIVITIES_EVENT = 'gentra_activities_updated';

// Master Password Resmi Sovereign GENTRA Pemprov Jabar
export const OFFICIAL_MASTER_PASSWORD = 'GENTRA-MASTER-2026';
export const LEGACY_MASTER_KEY = 'admin2026';

export function getMasterPassword() {
  try {
    return safeGetItem('gentra_master_key') || OFFICIAL_MASTER_PASSWORD;
  } catch (e) {
    return OFFICIAL_MASTER_PASSWORD;
  }
}

export function isMasterPassword(inputPassword) {
  if (!inputPassword) return false;
  const clean = String(inputPassword).trim();
  const configured = getMasterPassword();
  return (
    clean === configured ||
    clean === OFFICIAL_MASTER_PASSWORD ||
    clean === LEGACY_MASTER_KEY ||
    clean === 'GENTRA-MASTER-ADMIN'
  );
}

// 4 Akun Bawaan Internal Awal
export const DEFAULT_CLIENT_USERS = [
  {
    id: 'usr_admin',
    email: 'admin@gentra.internal',
    password: 'admin2026',
    name: 'MASTER ADMIN',
    role: 'Master Admin',
    department: 'Biro Administrasi Pimpinan (Adpim) Jabar',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr_prod',
    email: 'tim@gentra.internal',
    password: 'gentra2026',
    name: 'TIM PRODUKSI MEDIA',
    role: 'Tim Produksi',
    department: 'Divisi Produksi Konten Kreatif',
    isActive: true,
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'usr_diskominfo',
    email: 'diskominfo@jabarprov.go.id',
    password: 'jabar2026',
    name: 'DISPUTAR KOMINFO JABAR',
    role: 'Editor Naskah Pemda',
    department: 'Dinas Komunikasi dan Informatika Jabar',
    isActive: true,
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'usr_penyiar',
    email: 'penyiar@gentra.internal',
    password: 'suara2026',
    name: 'PENGISI SUARA RESMI',
    role: 'Pengisi Suara',
    department: 'Talenta Suara & Budaya Pasundan',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z'
  }
];

// --- 1. Ambil Seluruh Pengguna Terdaftar ---
export function getRegisteredUsers(currentUser = null) {
  let userList = [];
  try {
    const raw = safeGetItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        userList = [...parsed];
      }
    }
  } catch (e) {
    console.warn("Gagal membaca akun tersimpan:", e);
  }

  // Jika belum ada akun tersimpan, inisialisasi akun bawaan resmi
  if (userList.length === 0) {
    userList = DEFAULT_CLIENT_USERS.map(u => ({ ...u }));
    try {
      safeSetItem(USERS_STORAGE_KEY, JSON.stringify(userList));
    } catch (e) {}
  } else {
    // Pastikan akun bawaan default tetap tersedia jika belum ada di list
    const existingEmails = new Set(userList.map(u => (u.email || '').toLowerCase().trim()));
    const missingDefaults = DEFAULT_CLIENT_USERS.filter(d => !existingEmails.has(d.email.toLowerCase().trim()));
    if (missingDefaults.length > 0) {
      userList = [...userList, ...missingDefaults.map(d => ({ ...d }))];
      try {
        safeSetItem(USERS_STORAGE_KEY, JSON.stringify(userList));
      } catch (e) {}
    }
  }

  // Jika sesi currentUser aktif valid dan merupakan Master Admin yang belum terdaftar di list
  if (currentUser && currentUser.email) {
    const cleanAuthEmail = String(currentUser.email).toLowerCase().trim();
    const foundAuth = userList.find(u => (u.email || '').toLowerCase().trim() === cleanAuthEmail);
    if (!foundAuth && (currentUser.role === 'Master Admin' || cleanAuthEmail.includes('admin'))) {
      userList.push({
        id: currentUser.id || `usr_${cleanAuthEmail.replace(/[^a-z0-9]/g, '_')}`,
        email: currentUser.email,
        password: currentUser.password || 'admin2026',
        name: currentUser.name || cleanAuthEmail.split('@')[0].toUpperCase(),
        role: 'Master Admin',
        department: currentUser.department || 'Biro Administrasi Pimpinan (Adpim) Jabar',
        isActive: true,
        createdAt: currentUser.loginAt || new Date().toISOString()
      });
      try {
        safeSetItem(USERS_STORAGE_KEY, JSON.stringify(userList));
      } catch (e) {}
    }
  }

  return userList;
}

// --- 2. Buat / Perbarui Akun Pengguna & Sandi ---
export function saveUserAccount({ email, password, name, role = 'Tim Produksi', department = 'Pemprov Jabar', isActive = true }) {
  const users = getRegisteredUsers();
  const cleanEmail = String(email || '').toLowerCase().trim();

  if (!cleanEmail) throw new Error('Email akun wajib diisi.');
  if (!password || (password !== '••••••••' && password.length < 4)) throw new Error('Kata sandi minimal 4 karakter.');

  const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (existingIdx >= 0) {
    users[existingIdx] = {
      ...users[existingIdx],
      name: name || users[existingIdx].name,
      password: (password && password !== '••••••••') ? password : users[existingIdx].password,
      role: role || users[existingIdx].role,
      department: department || users[existingIdx].department,
      isActive: isActive !== undefined ? isActive : users[existingIdx].isActive,
      updatedAt: new Date().toISOString()
    };
  } else {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      password: password || 'gentra2026',
      name: name || cleanEmail.split('@')[0].toUpperCase(),
      role: role || 'Tim Produksi',
      department,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
  }

  try {
    safeSetItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}

  // Kirim event sync
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(USERS_EVENT, { detail: users }));
    } catch (e) {}
  }

  // Sync background ke serverless API jika online
  if (typeof fetch !== 'undefined') {
    fetch('/api/auth/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password, name, role, department, isActive })
    }).catch(() => {});
  }

  return users;
}

// --- 3. Hapus Akun Pengguna ---
export function deleteUserAccount(email) {
  const cleanEmail = String(email || '').toLowerCase().trim();
  if (cleanEmail === 'admin@gentra.internal') {
    throw new Error('Akun Master Admin utama dilindungi dan tidak boleh dihapus.');
  }

  const users = getRegisteredUsers().filter(u => u.email.toLowerCase() !== cleanEmail);

  try {
    safeSetItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(USERS_EVENT, { detail: users }));
    } catch (e) {}
  }

  if (typeof fetch !== 'undefined') {
    fetch(`/api/auth/users?email=${encodeURIComponent(cleanEmail)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  return users;
}

// --- 4. Autentikasi Pengguna saat Login ---
export function authenticateAccount(email, password) {
  const cleanEmail = String(email || '').toLowerCase().trim();
  const cleanPass = String(password || '').trim();

  if (!cleanEmail) {
    return { success: false, message: 'Email atau identitas akun wajib diisi.' };
  }
  if (!cleanPass) {
    return { success: false, message: 'Kata sandi akses akun wajib diisi.' };
  }

  const users = getRegisteredUsers();
  const isMaster = isMasterPassword(cleanPass);

  // 1. Jalur Akses Master Password Sovereign (Override Pemulihan & Administrator Utama)
  if (isMaster) {
    const foundUser = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail);
    if (foundUser) {
      return {
        success: true,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          department: foundUser.department,
          loginAt: new Date().toISOString(),
          isMasterSovereign: true
        }
      };
    }

    // Jika email berciri administrator (admin@... atau internal), izinkan sesi Master Admin
    if (cleanEmail.includes('admin') || cleanEmail.endsWith('@gentra.internal') || cleanEmail.includes('jabarprov')) {
      const adminUser = {
        id: `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase(),
        role: 'Master Admin',
        department: 'Biro Administrasi Pimpinan (Adpim) Jabar',
        loginAt: new Date().toISOString(),
        isMasterSovereign: true
      };
      saveUserAccount({
        email: cleanEmail,
        password: cleanPass,
        name: adminUser.name,
        role: adminUser.role,
        department: adminUser.department
      });
      return {
        success: true,
        user: adminUser
      };
    }

    return {
      success: false,
      message: 'Master Password valid, namun identitas email belum terdaftar di sistem.'
    };
  }

  // 2. Jalur Autentikasi Standar: Wajib cocok dengan Akun Terdaftar Resmi
  const found = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail);
  if (!found) {
    return {
      success: false,
      message: 'Akun email tidak terdaftar. Pastikan akun telah didaftarkan pada Manajemen Akun GENTRA.'
    };
  }

  if (!found.isActive) {
    return {
      success: false,
      message: 'Akun ini dinonaktifkan oleh Administrator. Hubungi Biro Administrasi Pimpinan Jabar.'
    };
  }

  // Verifikasi kecocokan kata sandi
  if (found.password !== cleanPass) {
    return {
      success: false,
      message: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi akun Anda.'
    };
  }

  return {
    success: true,
    user: {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      department: found.department,
      loginAt: new Date().toISOString()
    }
  };
}

// ==========================================
// AUDIT LOG & RIWAYAT AKTIVITAS NASKAH KLIEN
// ==========================================

export function getAccountActivities(emailFilter = null) {
  try {
    const raw = safeGetItem(ACTIVITIES_STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];
    if (emailFilter) {
      const clean = String(emailFilter).toLowerCase().trim();
      list = list.filter(a => a.userEmail?.toLowerCase() === clean);
    }
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (e) {
    return [];
  }
}

export function logAccountActivity({
  userEmail,
  userName,
  action,
  type,
  scriptText = '',
  script = '',
  text = '',
  voiceUsed = 'Mugi',
  originalVoiceName,
  backendVoiceId = 'Charon',
  engine = 'Google Gemini Neural',
  charCount = 0,
  wordCount = 0,
  speed = 1.0,
  dialect = 'sunda'
}) {
  const activities = getAccountActivities(null);
  const cleanText = String(scriptText || script || text || '').trim();
  const computedCharCount = charCount || cleanText.length;
  const computedWordCount = wordCount || (cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0);
  const cleanEmail = String(userEmail || 'tim@gentra.internal').trim();
  const cleanName = userName || cleanEmail.split('@')[0]?.toUpperCase() || 'TIM PRODUKSI';

  // Tentukan deskripsi aksi otomatis
  const resolvedAction = action || (
    type === 'AUDIO_GENERATION' ? 'Sintesis Audio Voice Over' :
    type === 'SCRIPT_GENERATION' ? 'Pembuatan Naskah ILM' :
    'Sintesis Audio Voice Over'
  );

  const entry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userEmail: cleanEmail,
    userName: cleanName,
    action: resolvedAction,
    type: type || (resolvedAction.includes('Naskah') ? 'SCRIPT_GENERATION' : 'AUDIO_GENERATION'),
    scriptText: cleanText,
    script: cleanText,
    scriptSnippet: cleanText.length > 80 ? cleanText.slice(0, 80) + '...' : cleanText,
    charCount: computedCharCount,
    wordCount: computedWordCount,
    voiceUsed,
    backendVoiceId: backendVoiceId || 'Charon',
    engine,
    speed,
    dialect,
    timestamp: new Date().toISOString()
  };

  activities.unshift(entry);
  const trimmed = activities.slice(0, 300); // Pertahankan 300 aktivitas terakhir

  try {
    safeSetItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(ACTIVITIES_EVENT, { detail: trimmed }));
    } catch (e) {}
  }

  // Sinkronisasi background ke serverless API jika online
  if (typeof fetch !== 'undefined') {
    fetch('/api/auth/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  }

  return entry;
}

// Rekapitulasi Statistik untuk Tampilan Dashboard Admin
export function getAccountMetricsSummary(currentUser = null) {
  const users = getRegisteredUsers(currentUser);
  const activities = getAccountActivities(null);

  const isAudioAct = (a) => a.action?.includes('Sintesis') || a.action?.includes('Voice Over') || a.type === 'AUDIO_GENERATION';
  const isScriptAct = (a) => a.action?.includes('Naskah') || a.action?.includes('ILM') || a.action?.includes('Copywriting') || a.type === 'SCRIPT_GENERATION';

  const totalAudioOverall = activities.filter(isAudioAct).length;
  const totalScriptsOverall = activities.filter(isScriptAct).length;
  const totalCharactersOverall = activities.reduce((sum, a) => sum + (a.charCount || a.scriptText?.length || a.script?.length || 0), 0);

  const matchesAccount = (act, user) => {
    if (!act || !user) return false;
    const actEmail = String(act.userEmail || '').toLowerCase().trim();
    const uEmail = String(user.email || '').toLowerCase().trim();
    if (actEmail && uEmail && actEmail === uEmail) return true;
    const actPrefix = actEmail.split('@')[0];
    const uPrefix = uEmail.split('@')[0];
    if (actPrefix && uPrefix && actPrefix === uPrefix) return true;
    if (act.userName && user.name && String(act.userName).trim().toUpperCase() === String(user.name).trim().toUpperCase()) return true;
    return false;
  };

  const userStats = users.map(u => {
    const userActs = activities.filter(a => matchesAccount(a, u));
    const totalChars = userActs.reduce((acc, a) => acc + (a.charCount || a.scriptText?.length || a.script?.length || 0), 0);
    const audioCount = userActs.filter(isAudioAct).length;
    const scriptCount = userActs.filter(isScriptAct).length;
    const lastActive = userActs.length > 0 ? userActs[0].timestamp : (u.createdAt || u.updatedAt || new Date().toISOString());

    return {
      ...u,
      totalCreations: userActs.length,
      totalAudioGenerated: audioCount,
      totalScriptsGenerated: scriptCount,
      totalCharacters: totalChars,
      lastActive,
      activities: userActs
    };
  });

  return {
    totalAccounts: users.length,
    activeAccounts: users.filter(u => u.isActive).length,
    totalAudioOverall,
    totalScriptsOverall,
    totalCharactersOverall,
    userStats
  };
}
