// src/utils/userManagement.js
// Single Source of Truth untuk Manajemen Akun Pengguna & Audit Trail Naskah
// Bekerja Dual-Storage (Browser safeStorage + Serverless API Fallback)
import { safeGetItem, safeSetItem } from './safeStorage.js';

export const USERS_STORAGE_KEY = 'gentra_user_accounts_v1';
export const ACTIVITIES_STORAGE_KEY = 'gentra_account_activities_v1';
export const USERS_EVENT = 'gentra_accounts_updated';
export const ACTIVITIES_EVENT = 'gentra_activities_updated';

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

// --- 1. Ambil Seluruh Pengguna ---
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

  if (userList.length === 0) {
    userList = DEFAULT_CLIENT_USERS.map(u => ({ ...u }));
  } else {
    // Gabungkan akun default jika belum ada
    const existingEmails = new Set(userList.map(u => (u.email || '').toLowerCase().trim()));
    const missingDefaults = DEFAULT_CLIENT_USERS.filter(d => !existingEmails.has(d.email.toLowerCase().trim()));
    if (missingDefaults.length > 0) {
      userList = [...userList, ...missingDefaults.map(d => ({ ...d }))];
    }
  }

  let hasChanges = false;

  // 1. Sinkronisasi akun aktif saat ini (currentUser atau gentra_auth_user)
  let activeUser = currentUser;
  if (!activeUser && typeof window !== 'undefined') {
    try {
      const rawAuth = safeGetItem('gentra_auth_user');
      if (rawAuth) activeUser = JSON.parse(rawAuth);
    } catch (e) {}
  }

  if (activeUser && activeUser.email) {
    const cleanAuthEmail = String(activeUser.email).toLowerCase().trim();
    const foundAuth = userList.find(u => (u.email || '').toLowerCase().trim() === cleanAuthEmail);
    if (!foundAuth) {
      userList.push({
        id: activeUser.id || `usr_${cleanAuthEmail.replace(/[^a-z0-9]/g, '_')}`,
        email: activeUser.email,
        password: activeUser.password || '••••••••',
        name: activeUser.name || cleanAuthEmail.split('@')[0].toUpperCase(),
        role: activeUser.role || (cleanAuthEmail.includes('admin') ? 'Master Admin' : 'Tim Produksi'),
        department: activeUser.department || 'Divisi Produksi Konten Kreatif',
        isActive: true,
        createdAt: activeUser.loginAt || new Date().toISOString()
      });
      hasChanges = true;
    }
  }

  // 2. Sinkronisasi dari audit trail aktivitas (jika ada aktivitas dari akun lain seperti 'bangkit')
  try {
    const rawActs = safeGetItem(ACTIVITIES_STORAGE_KEY);
    if (rawActs) {
      const parsedActs = JSON.parse(rawActs);
      if (Array.isArray(parsedActs)) {
        const knownEmails = new Set(userList.map(u => (u.email || '').toLowerCase().trim()));
        for (const act of parsedActs) {
          if (act.userEmail) {
            const cleanActEmail = String(act.userEmail).toLowerCase().trim();
            if (!knownEmails.has(cleanActEmail)) {
              knownEmails.add(cleanActEmail);
              userList.push({
                id: `usr_${cleanActEmail.replace(/[^a-z0-9]/g, '_')}`,
                email: act.userEmail,
                password: '••••••••',
                name: act.userName || cleanActEmail.split('@')[0].toUpperCase(),
                role: cleanActEmail.includes('admin') ? 'Master Admin' : 'Tim Produksi',
                department: 'Divisi Produksi Konten Kreatif',
                isActive: true,
                createdAt: act.timestamp || new Date().toISOString()
              });
              hasChanges = true;
            }
          }
        }
      }
    }
  } catch (e) {}

  if (hasChanges) {
    try {
      safeSetItem(USERS_STORAGE_KEY, JSON.stringify(userList));
    } catch (e) {}
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
  const users = getRegisteredUsers();

  // Master key override fleksibel (default: admin2026 atau key di local storage)
  const masterKey = safeGetItem('gentra_master_key') || 'admin2026';
  if (cleanPass === masterKey && (cleanEmail.includes('admin') || cleanEmail.endsWith('@gentra.internal'))) {
    const adminUser = {
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase(),
      role: 'Master Admin',
      department: 'Biro Administrasi Pimpinan (Adpim) Jabar',
      loginAt: new Date().toISOString()
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

  const found = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    // Jika password >= 4 karakter dan email valid, izinkan akses dan simpan ke database akun
    if (cleanPass.length >= 4) {
      const isRoleAdmin = cleanEmail.includes('admin') || cleanPass === 'admin2026';
      const newUser = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase(),
        role: isRoleAdmin ? 'Master Admin' : 'Tim Produksi',
        department: isRoleAdmin ? 'Biro Administrasi Pimpinan (Adpim) Jabar' : 'Divisi Produksi Konten Kreatif',
        loginAt: new Date().toISOString()
      };
      saveUserAccount({
        email: cleanEmail,
        password: cleanPass,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department
      });
      return {
        success: true,
        user: newUser
      };
    }
    return { success: false, message: 'Akun email tidak terdaftar.' };
  }

  if (!found.isActive) {
    return { success: false, message: 'Akun ini dinonaktifkan oleh administrator.' };
  }

  if (found.password !== cleanPass && found.password !== '••••••••' && cleanPass !== masterKey) {
    return { success: false, message: 'Kata sandi salah. Silakan periksa kembali.' };
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

  // Pastikan akun pengunggah tercatat di daftar pengguna
  try {
    const registered = getRegisteredUsers();
    if (!registered.some(u => (u.email || '').toLowerCase().trim() === cleanEmail.toLowerCase())) {
      saveUserAccount({
        email: cleanEmail,
        password: '••••••••',
        name: cleanName,
        role: cleanEmail.includes('admin') ? 'Master Admin' : 'Tim Produksi',
        department: 'Divisi Produksi Konten Kreatif'
      });
    }
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
