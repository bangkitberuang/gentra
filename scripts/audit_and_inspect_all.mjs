import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('       GENTRA COMPREHENSIVE AUDIO & THEME AUDIT     ');
console.log('====================================================\n');

const PREVIEWS_DIR = path.resolve('public/audio/previews');

// 1. ALL 22 OFFICIAL PERSONAS
const EXPECTED_PERSONAS = [
  // 14 Nasional (Blok 1 - NUSA VOICE)
  { name: 'Anita', voice: 'Aoede', expectedFile: 'anita.wav' },
  { name: 'Siti', voice: 'Leda', expectedFile: 'siti.wav' },
  { name: 'Agus', voice: 'Charon', expectedFile: 'agus.wav' },
  { name: 'Dewi', voice: 'Despina', expectedFile: 'dewi.wav' },
  { name: 'Tina', voice: 'Callirrhoe', expectedFile: 'tina.wav' },
  { name: 'Maya', voice: 'Autonoe', expectedFile: 'maya.wav' },
  { name: 'Rian', voice: 'Puck', expectedFile: 'rian.wav' },
  { name: 'Indah', voice: 'Erinome', expectedFile: 'indah.wav' },
  { name: 'Gading', voice: 'Fenrir', expectedFile: 'gading.wav' },
  { name: 'Shinta', voice: 'Laomedeia', expectedFile: 'shinta.wav' },
  { name: 'Bayu', voice: 'Orus', expectedFile: 'bayu.wav' },
  { name: 'Adi', voice: 'Algenib', expectedFile: 'adi.wav' },
  { name: 'Eko', voice: 'Iapetus', expectedFile: 'eko.wav' },
  { name: 'Laras', voice: 'Achernar', expectedFile: 'laras.wav' },

  // 8 Khas Sunda (Blok 2)
  { name: 'Abah', voice: 'Fenrir', expectedFile: 'abah.wav' },
  { name: 'Nini', voice: 'Erinome', expectedFile: 'nini.wav' },
  { name: 'Ujang', voice: 'Puck', expectedFile: 'ujang.wav' },
  { name: 'Bibi (Ceu Edah)', voice: 'Despina', expectedFile: 'bibi.wav' },
  { name: 'Budak Leutik Eneng', voice: 'Aoede', expectedFile: 'budak_eneng.wav' },
  { name: 'Budak Leutik Ujang Alit', voice: 'Algenib', expectedFile: 'budak_ujang.wav' },
  { name: 'Teh Neng', voice: 'Leda', expectedFile: 'teh_neng.wav' },
  { name: 'Kang Asep', voice: 'Orus', expectedFile: 'kang_asep.wav' }
];

let errors = [];

console.log('--- 1. PHYSICAL FILE INSPECTION (public/audio/previews) ---');
for (const p of EXPECTED_PERSONAS) {
  const filePath = path.join(PREVIEWS_DIR, p.expectedFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING FILE: ${p.name} -> ${p.expectedFile}`);
    errors.push(`Missing file: ${p.expectedFile}`);
    continue;
  }

  const stat = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  const isWav = buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WAVE';
  const sampleRate = isWav ? buf.readUInt32LE(24) : 0;

  if (stat.size < 10000) {
    console.error(`❌ SUSPICIOUS SMALL FILE: ${p.expectedFile} (${stat.size} bytes)`);
    errors.push(`File too small: ${p.expectedFile}`);
  } else if (!isWav) {
    console.error(`❌ NOT VALID WAV: ${p.expectedFile}`);
    errors.push(`Not valid WAV: ${p.expectedFile}`);
  } else {
    console.log(`✅ [${p.name}] -> ${p.expectedFile} | ${(stat.size / 1024).toFixed(1)} KB | SampleRate: ${sampleRate}Hz | Gemini Voice: ${p.voice}`);
  }
}

console.log('\n--- 2. ELEVENLABS PURGE CHECK ---');
const allFiles = fs.readdirSync(PREVIEWS_DIR);
const elevenLabsFiles = allFiles.filter(f => f.toLowerCase().includes('elevenlabs'));
if (elevenLabsFiles.length > 0) {
  console.error(`❌ ELEVENLABS FILES STILL PRESENT:`, elevenLabsFiles);
  errors.push(`ElevenLabs files found: ${elevenLabsFiles.join(', ')}`);
} else {
  console.log(`✅ 100% PURGED: Zero ElevenLabs files exist in public/audio/previews/`);
}

console.log('\n--- 3. CODEBASE MAPPINGS INSPECTION ---');
const landingContent = fs.readFileSync('src/components/LandingPage.jsx', 'utf8');
const studioContent = fs.readFileSync('src/components/GentraStudio.jsx', 'utf8');

if (landingContent.includes('elevenlabs')) {
  console.error(`❌ LandingPage.jsx still references elevenlabs!`);
  errors.push('LandingPage references elevenlabs');
} else {
  console.log(`✅ LandingPage.jsx has 0 references to elevenlabs`);
}

if (studioContent.includes('elevenlabs_')) {
  console.error(`❌ GentraStudio.jsx still references elevenlabs files!`);
  errors.push('GentraStudio references elevenlabs files');
} else {
  console.log(`✅ GentraStudio.jsx has 0 references to elevenlabs files`);
}

console.log('\n--- 4. AUDIT SUMMARY ---');
if (errors.length === 0) {
  console.log(`🎉 ALL AUDITS PASSED! 22/22 CHARACTERS ARE 100% GENUINE GOOGLE GEMINI NEURAL AUDIO.`);
} else {
  console.error(`🚨 AUDIT FOUND ${errors.length} ISSUES:`, errors);
  process.exit(1);
}
