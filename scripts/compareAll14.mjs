import fs from 'fs';

const nusaCode = fs.readFileSync('C:/Users/asist/.gemini/antigravity/scratch/NusaVoice.jsx', 'utf8');
const gentraCode = fs.readFileSync('src/components/GentraStudio.jsx', 'utf8');

// Parse INDO_VOICES from NusaVoice
const nusaLines = nusaCode.match(/const INDO_VOICES = \[([\s\S]*?)\];/)[1].split('\n');
const nusaVoices = [];
for (const line of nusaLines) {
  const m = line.match(/id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)',\s*gender:\s*'([^']+)'/);
  if (m) {
    nusaVoices.push({ id: m[1], name: m[2], desc: m[3], gender: m[4] });
  }
}

// Parse INITIAL_VOICES from Gentra
const gentraMatch = gentraCode.match(/const INITIAL_VOICES = \[([\s\S]*?)\];\s*\n\s*\/\/ --- Karakter Suara Khusus ElevenLabs/);
const gentraLines = gentraMatch[1].split('\n');
const gentraVoices = [];
for (const line of gentraLines) {
  const m = line.match(/id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)',\s*gender:\s*'([^']+)',\s*category:\s*'([^']+)'/);
  if (m && m[5] === 'Nasional') {
    gentraVoices.push({ id: m[1], name: m[2], desc: m[3], gender: m[4] });
  }
}

console.log('=== DATA DEFINITION COMPARISON (14 PERSONAS) ===\n');
let diffCount = 0;
for (let i = 0; i < nusaVoices.length; i++) {
  const nv = nusaVoices[i];
  const gv = gentraVoices.find(g => g.name === nv.name);
  if (!gv) {
    console.log(`❌ [MISSING] ${nv.name} not found in Gentra!`);
    diffCount++;
    continue;
  }
  const idOk = nv.id === gv.id;
  const descOk = nv.desc === gv.desc;
  const genderOk = nv.gender === gv.gender;
  if (!idOk || !descOk || !genderOk) {
    console.log(`⚠️ MISMATCH for ${nv.name}:`);
    if (!idOk) console.log(`   ID: Nusa='${nv.id}' vs Gentra='${gv.id}'`);
    if (!descOk) console.log(`   Desc: Nusa='${nv.desc}' vs Gentra='${gv.desc}'`);
    if (!genderOk) console.log(`   Gender: Nusa='${nv.gender}' vs Gentra='${gv.gender}'`);
    diffCount++;
  } else {
    console.log(`✅ [100% MATCH] ${nv.name}: ID='${nv.id}', Gender='${nv.gender}', Desc='${nv.desc}'`);
  }
}
console.log(`\nTotal Data Definition Differences: ${diffCount}`);
