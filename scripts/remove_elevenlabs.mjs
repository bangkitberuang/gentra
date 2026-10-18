import fs from 'fs';
import path from 'path';

const studioFile = path.resolve('src/components/GentraStudio.jsx');
let content = fs.readFileSync(studioFile, 'utf8');

// 1. Remove ELEVENLABS_VOICES definition
const elevenRegex = /\/\/ --- Karakter Suara Khusus ElevenLabs[\s\S]*?\];\r?\n/g;
content = content.replace(elevenRegex, '');

// 2. Remove ElevenLabs category styling
const categoryElevenRegex = /\/\/ ElevenLabs Studio[\s\S]*?glow: 'shadow-purple-500\/20'\r?\n\s*};\r?\n\s*}/g;
content = content.replace(categoryElevenRegex, '');

// 3. Remove activeEngine elevenlabs check
content = content.replace(
  `} else if (activeEngine === 'elevenlabs') {
      setVoices(ELEVENLABS_VOICES);
      setSelectedVoice(ELEVENLABS_VOICES[0]);`,
  ''
);

// In case CRLF:
content = content.replace(
  `} else if (activeEngine === 'elevenlabs') {\r\n      setVoices(ELEVENLABS_VOICES);\r\n      setSelectedVoice(ELEVENLABS_VOICES[0]);`,
  ''
);

// 4. Remove Pajajaran Server button from dropdown
const buttonRegex = /\{\/\* 3\. Pajajaran \(Studio\) \*\/\}[\s\S]*?<\/button>\r?\n/g;
content = content.replace(buttonRegex, '');

// 5. Replace any remaining gradient palette purple/indigo in femalePalette and malePalette
content = content.replace("'Anita': 'from-rose-500 via-pink-600 to-purple-600',", "'Anita': 'from-rose-500 via-pink-600 to-amber-600',");
content = content.replace("'Tina': 'from-cyan-500 via-blue-600 to-indigo-700',", "'Tina': 'from-cyan-500 via-blue-600 to-slate-700',");
content = content.replace("'Maya': 'from-purple-500 via-indigo-600 to-blue-700',", "'Maya': 'from-teal-500 via-blue-600 to-slate-700',");
content = content.replace("'Laras': 'from-fuchsia-500 via-purple-600 to-indigo-700'", "'Laras': 'from-amber-500 via-rose-600 to-slate-700'");
content = content.replace("'Rian': 'from-sky-500 via-blue-600 to-indigo-700',", "'Rian': 'from-sky-500 via-blue-600 to-slate-700',");
content = content.replace("'Eko': 'from-indigo-600 via-blue-700 to-slate-800'", "'Eko': 'from-blue-700 via-slate-700 to-slate-900'");
content = content.replace("gradient: malePalette[v.name] || 'from-indigo-600 to-slate-800',", "gradient: malePalette[v.name] || 'from-slate-700 to-slate-900',");

// 6. Replace remaining loader text
content = content.replaceAll("text-indigo-600", "text-slate-800");

// 7. Replace any remaining bg-indigo-50 border-indigo-200
content = content.replace("bg-indigo-50 border-indigo-200 hover:bg-indigo-100", "bg-emerald-50 border-emerald-200 hover:bg-emerald-100");

fs.writeFileSync(studioFile, content);
console.log('✅ ElevenLabs successfully purged from GentraStudio.jsx!');
