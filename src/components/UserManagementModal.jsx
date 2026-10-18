// src/components/UserManagementModal.jsx
// Modal Manajemen Pembuat Akun, Sandi & Audit Riwayat Naskah GENTRA
import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Key,
  UserPlus,
  Trash2,
  Edit3,
  Check,
  X,
  Lock,
  Mail,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  UserCheck,
  UserX,
  Volume2
} from 'lucide-react';
import {
  getRegisteredUsers,
  saveUserAccount,
  deleteUserAccount,
  getAccountActivities,
  getAccountMetricsSummary,
  USERS_EVENT,
  ACTIVITIES_EVENT
} from '../utils/userManagement.js';

export const UserManagementModal = ({ isOpen, onClose, isDarkTheme, currentUser }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'activities' | 'stats'
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [activities, setActivities] = useState(() => getAccountActivities());
  const [summary, setSummary] = useState(() => getAccountMetricsSummary());

  // Filter & Search State
  const [userSearch, setUserSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');

  // Modal Detail Naskah
  const [selectedScriptDetail, setSelectedScriptDetail] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form Buat / Edit Akun
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'Tim Produksi',
    department: 'Biro Administrasi Pimpinan Jabar',
    isActive: true
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Sinkronisasi data real-time
  const refreshData = () => {
    setUsers(getRegisteredUsers());
    setActivities(getAccountActivities());
    setSummary(getAccountMetricsSummary());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener(USERS_EVENT, refreshData);
    window.addEventListener(ACTIVITIES_EVENT, refreshData);
    return () => {
      window.removeEventListener(USERS_EVENT, refreshData);
      window.removeEventListener(ACTIVITIES_EVENT, refreshData);
    };
  }, []);

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditForm({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'Tim Produksi',
      department: 'Biro Administrasi Pimpinan Jabar',
      isActive: true
    });
    setFormError('');
    setFormSuccess('');
  };

  const handleStartEdit = (user) => {
    setIsEditing(true);
    setEditForm({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      role: user.role || 'Tim Produksi',
      department: user.department || '',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setFormError('');
    setFormSuccess('');
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      saveUserAccount(editForm);
      setFormSuccess(`Akun "${editForm.name}" berhasil disimpan.`);
      setTimeout(() => {
        setIsEditing(false);
        setFormSuccess('');
      }, 1000);
      refreshData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDeleteUser = (email, name) => {
    if (window.confirm(`Hapus akun "${name}" (${email}) secara permanen?`)) {
      try {
        deleteUserAccount(email);
        refreshData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleActive = (user) => {
    try {
      saveUserAccount({
        ...user,
        isActive: !user.isActive
      });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCopyScript = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportActivitiesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `gentra_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Filtered Users
  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtered Activities
  const filteredActivities = activities.filter(a => {
    const matchesUser = selectedUserFilter === 'all' || a.userEmail?.toLowerCase() === selectedUserFilter.toLowerCase();
    const matchesSearch = !activitySearch ||
      (a.scriptText || '').toLowerCase().includes(activitySearch.toLowerCase()) ||
      (a.voiceUsed || '').toLowerCase().includes(activitySearch.toLowerCase()) ||
      (a.userName || '').toLowerCase().includes(activitySearch.toLowerCase()) ||
      (a.action || '').toLowerCase().includes(activitySearch.toLowerCase());
    return matchesUser && matchesSearch;
  });

  // Styles helpers
  const bgCard = isDarkTheme ? 'bg-[#0f1713] border-emerald-950 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900';
  const subBg = isDarkTheme ? 'bg-[#15231c] border-emerald-900/60' : 'bg-zinc-50 border-zinc-200';
  const subText = isDarkTheme ? 'text-zinc-400' : 'text-zinc-600';
  const inputStyle = isDarkTheme 
    ? 'bg-[#09110d] border border-emerald-950 text-zinc-200 focus:border-emerald-500' 
    : 'bg-white border border-zinc-200 text-zinc-900 focus:border-emerald-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`border w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all ${bgCard}`}>
        
        {/* HEADER MODAL */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between gap-4 ${isDarkTheme ? 'border-emerald-950 bg-[#09110d]' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight truncate">
                  Pusat Manajemen Akun, Sandi & Audit Naskah
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 font-bold shrink-0">
                  GENTRA Enterprise v2.6.4
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  👑 Master Sovereign
                </span>
              </div>
              <p className={`text-xs mt-0.5 truncate ${subText}`}>
                Buat dan kelola akun pengguna, reset kata sandi, dan pantau riwayat naskah & volume produksi audio setiap akun.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className={`px-6 py-2.5 border-b flex items-center justify-between gap-2 flex-wrap ${isDarkTheme ? 'bg-[#0b1410] border-emerald-950' : 'bg-zinc-50 border-zinc-200'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'users'
                  ? 'bg-[#0C4E34] text-white shadow-sm'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manajemen Akun & Sandi ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'activities'
                  ? 'bg-[#0C4E34] text-white shadow-sm'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Riwayat Naskah & Produksi ({activities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'stats'
                  ? 'bg-[#0C4E34] text-white shadow-sm'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistik per Akun</span>
            </button>
          </div>

          {activeTab === 'users' && !isEditing && (
            <button
              onClick={handleStartCreate}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#d97706] text-black flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Buat Akun Baru</span>
            </button>
          )}

          {activeTab === 'activities' && (
            <button
              onClick={handleExportActivitiesJson}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${subBg}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Log JSON</span>
            </button>
          )}
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* TAB 1: MANAJEMEN AKUN & KATA SANDI */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Form Create / Edit User */}
              {isEditing ? (
                <form onSubmit={handleSaveForm} className={`p-6 rounded-3xl border space-y-4 animate-in fade-in duration-200 ${
                  isDarkTheme ? 'bg-[#091510] border-emerald-500/50' : 'bg-emerald-50/70 border-emerald-300'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-emerald-900/40">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#F59E0B]" />
                      <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                        {editForm.id ? `Edit Akun & Reset Sandi: ${editForm.name}` : 'Buat Akun Pengguna Baru'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      ✕ Batal
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-medium">
                      {formSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold block uppercase">Nama Akun / Operator:</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Agi Pratama / Diskominfo Jabar"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={`w-full p-3 rounded-xl text-xs font-medium outline-none ${inputStyle}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold block uppercase">Email / Username Akses:</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: agi@gentra.internal"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={`w-full p-3 rounded-xl text-xs font-medium outline-none ${inputStyle}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold block uppercase flex items-center justify-between">
                        <span>Kata Sandi Akses:</span>
                        <span className="text-[10px] text-amber-400 font-normal">Minimal 4 Karakter</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan kata sandi baru..."
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className={`w-full p-3 rounded-xl text-xs font-mono font-bold outline-none ${inputStyle}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold block uppercase">Hak Akses / Role:</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className={`w-full p-3 rounded-xl text-xs font-medium outline-none ${inputStyle}`}
                      >
                        <option value="Master Admin">👑 Master Admin (Akses Penuh)</option>
                        <option value="Tim Produksi">🎬 Tim Produksi (Audio & VO)</option>
                        <option value="Editor Naskah Pemda">📝 Editor Naskah Pemda</option>
                        <option value="Pengisi Suara">🎙️ Pengisi Suara (Talenta)</option>
                        <option value="Tamu / Pemda">🏛️ Tamu / Dinas Daerah</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold block uppercase">Instansi / Divisi:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Dinas Komunikasi dan Informatika Provinsi Jawa Barat"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        className={`w-full p-3 rounded-xl text-xs font-medium outline-none ${inputStyle}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-emerald-900/40">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                      />
                      <span>Status Akun Aktif (Dapat Login)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-4 h-4 text-[#F59E0B]" />
                        <span>Simpan Akun & Sandi</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : null}

              {/* Search Bar Users */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama akun, email, atau divisi..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs outline-none ${inputStyle}`}
                />
              </div>

              {/* User Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.email?.toLowerCase() === u.email.toLowerCase();
                  return (
                    <div
                      key={u.id || u.email}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        !u.isActive
                          ? 'opacity-60 bg-zinc-900/40 border-dashed border-rose-900'
                          : isDarkTheme
                          ? 'bg-[#121d17] border-emerald-950 hover:border-emerald-700/80'
                          : 'bg-white border-zinc-200 hover:border-[#0C4E34]/50 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-black tracking-tight truncate">
                                {u.name}
                              </h4>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Anda
                                </span>
                              )}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                u.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              }`}>
                                {u.isActive ? '🟢 Aktif' : '🔴 Nonaktif'}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-zinc-400 truncate mt-0.5">
                              {u.email}
                            </p>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl shrink-0 ${
                            u.role === 'Master Admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </div>

                        <div className={`text-[11px] p-2.5 rounded-xl border flex items-center justify-between gap-2 ${subBg}`}>
                          <div className="truncate">
                            <span className="text-zinc-400">Kata Sandi: </span>
                            <code className="font-mono text-amber-400 font-bold tracking-wider">
                              {u.password || '••••••••'}
                            </code>
                          </div>
                          <span className="text-[10px] text-zinc-400 shrink-0">
                            {u.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                            u.isActive ? 'text-zinc-400 hover:text-rose-400' : 'text-emerald-400 hover:text-emerald-300'
                          }`}
                        >
                          {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          <span>{u.isActive ? 'Nonaktifkan' : 'Aktifkan Akun'}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(u)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${subBg} hover:text-amber-400 hover:border-amber-400/40`}
                            title="Edit Akun & Ganti Password"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.email !== 'admin@gentra.internal' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.email, u.name)}
                              className="p-1.5 rounded-lg border border-rose-900/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT TRAIL RIWAYAT NASKAH & PRODUKSI */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari kata di dalam naskah, nama persona..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs outline-none ${inputStyle}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
                  <select
                    value={selectedUserFilter}
                    onChange={(e) => setSelectedUserFilter(e.target.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold outline-none ${inputStyle}`}
                  >
                    <option value="all">Semua Akun Pengguna ({activities.length})</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table / List Activities */}
              {filteredActivities.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center space-y-2 ${subBg}`}>
                  <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-sm font-bold">Belum Ada Riwayat Naskah</p>
                  <p className="text-xs text-zinc-400">
                    Aktivitas pembuatan naskah ILM dan sintesis audio voice over akan otomatis tercatat di sini secara real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isDarkTheme ? 'bg-[#121d17] border-emerald-950' : 'bg-white border-zinc-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-amber-400">
                            {act.userName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            ({act.userEmail})
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            {act.action}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{new Date(act.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Naskah / Script Preview */}
                      <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans ${subBg}`}>
                        <p className="line-clamp-2 italic text-zinc-200">
                          "{act.scriptText}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 flex-wrap">
                          <span>Karakter: <strong className="text-emerald-400">{act.voiceUsed}</strong></span>
                          {act.originalVoiceName && act.originalVoiceName !== act.voiceUsed && (
                            <span className="text-[10px] text-zinc-400">(Asli: {act.originalVoiceName})</span>
                          )}
                          <span>•</span>
                          <span>Panjang: <strong className="text-amber-400">{act.charCount}</strong> karakter ({act.wordCount} kata)</span>
                          <span>•</span>
                          <span>Engine: <code className="font-mono text-zinc-300">{act.engine}</code></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedScriptDetail(act)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Baca Naskah Lengkap</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STATISTIK & METRIK PER AKUN */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border space-y-1 ${subBg}`}>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Total Akun Terdaftar</span>
                  <p className="text-2xl font-black text-emerald-400">{summary.totalAccounts}</p>
                  <p className="text-[10px] text-zinc-400">{summary.activeAccounts} Akun Aktif</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${subBg}`}>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Total Audio Voice Over</span>
                  <p className="text-2xl font-black text-amber-400">{summary.totalAudioOverall}</p>
                  <p className="text-[10px] text-zinc-400">Berkas WAV Disintesis</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${subBg}`}>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Total Naskah / Script</span>
                  <p className="text-2xl font-black text-emerald-300">{summary.totalScriptsOverall}</p>
                  <p className="text-[10px] text-zinc-400">Naskah Dibuat</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${subBg}`}>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Total Karakter Naskah</span>
                  <p className="text-2xl font-black text-white">{summary.totalCharactersOverall.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-zinc-400">Huruf Diproses AI</p>
                </div>
              </div>

              {/* Table Breakdown per Akun */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Rincian Beban Kerja & Produksi per Akun:
                </h4>

                <div className="space-y-2.5">
                  {summary.userStats.map((st) => (
                    <div
                      key={st.email}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isDarkTheme ? 'bg-[#121d17] border-emerald-950' : 'bg-white border-zinc-200'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-black text-white truncate">{st.name}</h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {st.role}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-zinc-400 truncate">{st.email}</p>
                        <p className="text-[11px] text-zinc-500">
                          Terakhir Aktif: {new Date(st.lastActive).toLocaleString('id-ID')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div className="p-2.5 rounded-xl border bg-black/30 border-zinc-800 text-center min-w-[90px]">
                          <span className="text-[10px] text-zinc-400 block font-bold">Produksi Audio</span>
                          <span className="text-base font-black text-amber-400">{st.totalAudioGenerated}</span>
                        </div>

                        <div className="p-2.5 rounded-xl border bg-black/30 border-zinc-800 text-center min-w-[90px]">
                          <span className="text-[10px] text-zinc-400 block font-bold">Naskah Dibuat</span>
                          <span className="text-base font-black text-emerald-400">{st.totalScriptsGenerated}</span>
                        </div>

                        <div className="p-2.5 rounded-xl border bg-black/30 border-zinc-800 text-center min-w-[100px]">
                          <span className="text-[10px] text-zinc-400 block font-bold">Total Karakter</span>
                          <span className="text-base font-black text-white">{st.totalCharacters.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL POPUP BACA NASKAH LENGKAP */}
        {selectedScriptDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className={`border w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 ${bgCard}`}>
              <div className="flex items-center justify-between border-b pb-3 border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-black text-white">Naskah Produksi Akun</h3>
                    <p className="text-xs text-zinc-400">
                      Dibuat oleh <strong className="text-amber-400">{selectedScriptDetail.userName}</strong> ({selectedScriptDetail.userEmail})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScriptDetail(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl border bg-black/40 border-zinc-800 space-y-2 max-h-72 overflow-y-auto font-sans leading-relaxed text-sm text-zinc-200 whitespace-pre-wrap">
                {selectedScriptDetail.scriptText}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 flex-wrap gap-2">
                <div className="space-x-2">
                  <span>Karakter: <strong className="text-emerald-400">{selectedScriptDetail.voiceUsed}</strong></span>
                  <span>•</span>
                  <span>{selectedScriptDetail.charCount} Karakter</span>
                  <span>•</span>
                  <span>{new Date(selectedScriptDetail.timestamp).toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyScript(selectedScriptDetail.scriptText)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#d97706] text-black flex items-center gap-1.5 transition-colors"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copySuccess ? 'Tersalin!' : 'Salin Naskah'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedScriptDetail(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
