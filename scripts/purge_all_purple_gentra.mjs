import fs from 'fs';
import path from 'path';

const studioFile = path.resolve('src/components/GentraStudio.jsx');
let content = fs.readFileSync(studioFile, 'utf8');

// 1. Rename Agus to Mugi
content = content.replace(
  "{ id: 'Charon', name: 'Agus', desc: 'Deep & Naratif (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Naratif)', isCustom: false },",
  "{ id: 'Charon', name: 'Mugi', desc: 'Deep & Naratif (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Naratif)', isCustom: false },"
);

content = content.replace(
  "  'Agus': '/audio/previews/agus.wav',",
  "  'Mugi': '/audio/previews/mugi.wav',\n  'Agus': '/audio/previews/mugi.wav',"
);

content = content.replace(
  "    'Agus': 'from-blue-600 via-indigo-700 to-slate-800',",
  "    'Mugi': 'from-blue-600 via-slate-700 to-slate-800',\n    'Agus': 'from-blue-600 via-slate-700 to-slate-800',"
);

// 2. Server dropdown Pajajaran purple -> volt/lime
content = content.replace(
  "activeEngine === 'elevenlabs'\n                          ? isDarkTheme ? 'bg-[#181A20] border border-purple-500/50 text-purple-300' : 'bg-purple-50 border border-purple-300 text-purple-900'\n                          : isDarkTheme ? 'hover:bg-[#181A20] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'",
  "activeEngine === 'elevenlabs'\n                          ? isDarkTheme ? 'bg-[#181A20] border border-[#CCFF00]/50 text-[#CCFF00]' : 'bg-amber-50 border border-amber-300 text-amber-900'\n                          : isDarkTheme ? 'hover:bg-[#181A20] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'"
);

content = content.replace(
  '<div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">\n                          <Sparkles className="w-4 h-4 text-purple-400" />\n                        </div>',
  '<div className="w-7 h-7 rounded-lg bg-[#CCFF00]/20 flex items-center justify-center shrink-0">\n                          <Sparkles className="w-4 h-4 text-[#CCFF00]" />\n                        </div>'
);

content = content.replace(
  '<span className="text-[9px] px-1 py-0.2 rounded font-black bg-purple-500/20 text-purple-400 shrink-0">Studio</span>',
  '<span className="text-[9px] px-1 py-0.2 rounded font-black bg-[#CCFF00]/20 text-[#CCFF00] shrink-0">Studio</span>'
);

content = content.replace(
  '{activeEngine === \'elevenlabs\' && (\n                        <Check className="w-4 h-4 text-purple-400 shrink-0" />\n                      )}',
  '{activeEngine === \'elevenlabs\' && (\n                        <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />\n                      )}'
);

// 3. Moon icon & theme switch
content = content.replace(
  "isDarkTheme \n                    ? 'bg-[#14161B] border-[#20232B] text-indigo-400 hover:bg-[#181A20] hover:scale-105' \n                    : 'bg-zinc-100 border-zinc-200 text-amber-600 hover:bg-zinc-200 hover:scale-105'",
  "isDarkTheme \n                    ? 'bg-[#14161B] border-[#20232B] text-[#CCFF00] hover:bg-[#181A20] hover:scale-105' \n                    : 'bg-zinc-100 border-zinc-200 text-amber-600 hover:bg-zinc-200 hover:scale-105'"
);

content = content.replace(
  '{isDarkTheme ? <Moon className="w-4 h-4 fill-current text-indigo-400" /> : <Sun className="w-4 h-4 fill-current text-amber-500" />}',
  '{isDarkTheme ? <Moon className="w-4 h-4 fill-current text-[#CCFF00]" /> : <Sun className="w-4 h-4 fill-current text-amber-500" />}'
);

// 4. API indicator pulse
content = content.replace(
  ": isDarkTheme ? 'bg-[#14161B] border-[#20232B] hover:bg-[#181A20]' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'",
  ": isDarkTheme ? 'bg-[#14161B] border-[#20232B] hover:bg-[#181A20]' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'"
);

content = content.replace(
  '<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>',
  '<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>'
);

content = content.replace(
  "apiQuotaStatus === 'active' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)]' :",
  "apiQuotaStatus === 'active' ? 'bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]' :"
);

// 5. Navbar Lab Suara & User icons
content = content.replace(
  "<FlaskConical className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-indigo-400' : 'text-amber-500'}`} />",
  "<FlaskConical className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-amber-500'}`} />"
);

content = content.replace(
  "<User className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-indigo-400' : 'text-slate-700'}`} />",
  "<User className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />"
);

// 6. Input Teks Header
content = content.replace(
  "<Sparkles className={`w-5 h-5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />",
  "<Sparkles className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />"
);

content = content.replace(
  "showEmotionTags\n                        ? isDarkTheme \n                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' \n                          : 'bg-indigo-50 text-indigo-700 border-indigo-300'",
  "showEmotionTags\n                        ? isDarkTheme \n                          ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 font-bold' \n                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'"
);

content = content.replace(
  "<Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />\n                    <span>{showEmotionTags ? 'Sembunyikan Tag Emosi' : 'Tag Emosi & Gaya'}</span>",
  "<Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />\n                    <span>{showEmotionTags ? 'Sembunyikan Tag Emosi' : 'Tag Emosi & Gaya'}</span>"
);

content = content.replace(
  "<Mic className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />\n                    <span>Transkripsi Suara AI</span>",
  "<Mic className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />\n                    <span>Transkripsi Suara AI</span>"
);

// 7. Toolbar Tag Emosi
content = content.replace(
  "<Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />\n                      <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkTheme ? 'text-indigo-300' : 'text-indigo-700'}`}>\n                        Tag Emosi & Gaya Bicara\n                      </span>",
  "<Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />\n                      <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>\n                        Tag Emosi & Gaya Bicara\n                      </span>"
);

// 8. Textarea focus
content = content.replace(
  "isDarkTheme \n                  ? 'bg-[#0E1017] border-[#262B3A] focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30' \n                  : 'bg-slate-50/70 border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-600/20'",
  "isDarkTheme \n                  ? 'bg-[#0E1017] border-[#262B3A] focus-within:border-[#CCFF00] focus-within:ring-1 focus-within:ring-[#CCFF00]/30' \n                  : 'bg-slate-50/70 border-slate-200 focus-within:border-slate-800 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-800/20'"
);

// 9. Neural pulse dot & User icon
content = content.replace(
  "<span className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-indigo-400 shadow-[0_0_8px_#818CF8]' : 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]'}`}></span>",
  "<span className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]' : 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]'}`}></span>"
);

content = content.replace(
  "<User className={`w-5 h-5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />\n                  <h2 className={`text-base sm:text-lg font-bold tracking-wide ${headingColor}`}>\n                    Pilih Karakter Suara ({filteredVoices.length})\n                  </h2>",
  "<User className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />\n                  <h2 className={`text-base sm:text-lg font-bold tracking-wide ${headingColor}`}>\n                    Pilih Karakter Suara ({filteredVoices.length})\n                  </h2>"
);

// 10. Pengaturan Gaya Bicara & Emosi
content = content.replace(
  "<Settings2 className={`w-5 h-5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />",
  "<Settings2 className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />"
);

content = content.replace(
  "isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-indigo-400' : 'border-slate-200 bg-white text-indigo-600 shadow-2xs'",
  "isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-[#CCFF00] font-bold' : 'border-slate-200 bg-white text-slate-900 shadow-2xs'"
);

content = content.replace(
  "<span className={`font-bold ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}>1.0x (Normal)</span>",
  "<span className={`font-bold ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>1.0x (Normal)</span>"
);

content = content.replace(
  "isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-indigo-400' : 'border-slate-200 bg-white text-indigo-600 shadow-2xs'",
  "isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-[#CCFF00] font-bold' : 'border-slate-200 bg-white text-slate-900 shadow-2xs'"
);

content = content.replace(
  "<span className={`font-bold ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}>0 (Kalibrasi Asli)</span>",
  "<span className={`font-bold ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>0 (Kalibrasi Asli)</span>"
);

// 11. Ekspresi Emosi grid (Netral, Ramah, etc.)
content = content.replace(
  `                          className={\`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all \${
                            isEmoSelected 
                              ? 'bg-indigo-600 border-2 border-indigo-500 text-white shadow-md shadow-indigo-600/20 scale-105' 
                              : isDarkTheme 
                                ? 'bg-[#0E1017] border-[#282D3D] text-zinc-300 hover:border-zinc-700 hover:text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }\`}
                        >
                          <div className={isEmoSelected ? 'text-white' : isDarkTheme ? 'text-zinc-400' : 'text-slate-500'}>`,
  `                          className={\`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all \${
                            isEmoSelected 
                              ? isDarkTheme 
                                ? 'bg-[#CCFF00] border-2 border-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/25 scale-105' 
                                : 'bg-slate-950 border-2 border-slate-950 text-white shadow-md scale-105'
                              : isDarkTheme 
                                ? 'bg-[#0E1017] border-[#282D3D] text-zinc-300 hover:border-zinc-700 hover:text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }\`}
                        >
                          <div className={isEmoSelected ? (isDarkTheme ? 'text-black' : 'text-white') : isDarkTheme ? 'text-zinc-400' : 'text-slate-500'}>`
);

// 12. Audio Player & Equalizer
content = content.replace(
  "<CheckCircle className={`w-5 h-5 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} /> Audio Selesai Diproses",
  "<CheckCircle className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-emerald-600'}`} /> Audio Selesai Diproses"
);

content = content.replace(
  "isDarkTheme ? 'border-[#282D3D] bg-[#181B26] text-indigo-300' : 'border-slate-200 bg-slate-100 text-indigo-700'",
  "isDarkTheme ? 'border-[#282D3D] bg-[#181B26] text-[#CCFF00]' : 'border-slate-200 bg-slate-100 text-slate-800'"
);

content = content.replace(
  "isDarkTheme ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' : 'bg-slate-950 hover:bg-slate-800 text-white shadow-slate-950/20'",
  "isDarkTheme ? 'bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black shadow-lg shadow-[#CCFF00]/25' : 'bg-slate-950 hover:bg-slate-800 text-white shadow-slate-950/20'"
);

content = content.replace(
  "<Sliders className={`w-4 h-4 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`} />",
  "<Sliders className={`w-4 h-4 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />"
);

content = content.replaceAll(
  "? (isDarkTheme ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'bg-slate-900 text-white shadow-xs font-bold')",
  "? (isDarkTheme ? 'bg-[#CCFF00] text-black shadow-xs font-black' : 'bg-slate-900 text-white shadow-xs font-bold')"
);

content = content.replace(
  "<span className={`w-2.5 h-2.5 rounded-full ${isMainAudioPlaying ? 'bg-indigo-400 animate-ping' : 'bg-zinc-600'}`} />\n                        <span className=\"font-bold tracking-wider uppercase text-[10px] text-indigo-400\">",
  "<span className={`w-2.5 h-2.5 rounded-full ${isMainAudioPlaying ? 'bg-[#CCFF00] animate-ping' : 'bg-zinc-600'}`} />\n                        <span className=\"font-bold tracking-wider uppercase text-[10px] text-[#CCFF00]\">"
);

content = content.replace(
  ": 'bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)] animate-meter'",
  ": 'bg-[#CCFF00] shadow-[0_0_6px_rgba(204,255,0,0.8)] animate-meter'"
);

content = content.replaceAll(
  "i > 20 ? 'bg-rose-500' : i > 15 ? 'bg-amber-400' : 'bg-indigo-400'",
  "i > 20 ? 'bg-rose-500' : i > 15 ? 'bg-amber-400' : 'bg-[#CCFF00]'"
);

content = content.replaceAll(
  "text-indigo-400 font-bold",
  "text-[#CCFF00] font-bold"
);

content = content.replaceAll(
  "font-bold text-indigo-400",
  "font-bold text-[#CCFF00]"
);

// 13. Riwayat, Modals, Footer
content = content.replace(
  '<History className="w-6 h-6 text-indigo-500" /> Riwayat Voice Over Gentra',
  '<History className="w-6 h-6 text-[#CCFF00]" /> Riwayat Voice Over Gentra'
);

content = content.replace(
  "isDarkTheme ? 'hover:border-indigo-500/40' : 'hover:border-slate-300'",
  "isDarkTheme ? 'hover:border-[#CCFF00]/40' : 'hover:border-slate-300'"
);

content = content.replace(
  "isDarkTheme ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/40' : 'bg-indigo-50 text-indigo-700 border-indigo-200'",
  "isDarkTheme ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30 font-bold' : 'bg-emerald-50 text-emerald-800 border-emerald-200'"
);

content = content.replace(
  "isDarkTheme \n                            ? 'bg-[#181B26] hover:bg-indigo-600 text-zinc-300 hover:text-white border-[#2A2E3D]' \n                            : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'",
  "isDarkTheme \n                            ? 'bg-[#181B26] hover:bg-[#CCFF00] text-zinc-300 hover:text-black font-bold border-[#2A2E3D]' \n                            : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'"
);

content = content.replace(
  'className="flex-1 py-3 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors"',
  'className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#CCFF00] text-black font-black hover:bg-[#b8e600] shadow-sm transition-colors"'
);

content = content.replace(
  "<div className={`p-2 rounded-xl ${isDarkTheme ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>\n                  <Mic className=\"w-5 h-5 text-indigo-500\" />\n                </div>",
  "<div className={`p-2 rounded-xl ${isDarkTheme ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>\n                  <Mic className=\"w-5 h-5 text-[#CCFF00]\" />\n                </div>"
);

content = content.replace(
  "isDarkTheme ? 'border-[#2A2E3D] hover:border-indigo-500 bg-[#0E1017]' : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-100/50'",
  "isDarkTheme ? 'border-[#2A2E3D] hover:border-[#CCFF00] bg-[#0E1017]' : 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50'"
);

content = content.replace(
  "<FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-indigo-400' : 'text-slate-400'}`} />",
  "<FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-400'}`} />"
);

content = content.replace(
  ": 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'",
  "isDarkTheme ? 'bg-[#CCFF00] text-black font-black hover:bg-[#b8e600] shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'"
);

content = content.replace(
  '<span className={isDarkTheme ? \'text-indigo-400\' : \'text-slate-900\'}>GENTRA</span>',
  '<span className={isDarkTheme ? \'text-[#CCFF00]\' : \'text-slate-900\'}>GENTRA</span>'
);

fs.writeFileSync(studioFile, content);
console.log('✅ GentraStudio.jsx updated successfully!');
