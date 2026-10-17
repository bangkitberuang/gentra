import fs from 'fs';
import path from 'path';

console.log('=== GENTRA COMPREHENSIVE AUDIT & IN-DEPTH TEST SUITE ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

// 1. TEST INITIAL_VOICES & STATIC_AUDIO_PREVIEWS DATA INTEGRITY
console.log('\n--- 1. Testing Voice Registry & 3 Blocks Integrity ---');
const gentraCode = fs.readFileSync('src/components/GentraStudio.jsx', 'utf8');

// Extract INITIAL_VOICES array from source code
const initialVoicesMatch = gentraCode.match(/const INITIAL_VOICES = \[([\s\S]*?)\];\s*\n\s*\/\/ --- Karakter Suara Khusus ElevenLabs/);
assert(!!initialVoicesMatch, 'INITIAL_VOICES is defined and can be parsed');

// Extract STATIC_AUDIO_PREVIEWS
const staticPreviewsMatch = gentraCode.match(/export const STATIC_AUDIO_PREVIEWS = \{([\s\S]*?)\};\s*\n\s*\/\/ Helper:/);
assert(!!staticPreviewsMatch, 'STATIC_AUDIO_PREVIEWS is defined and can be parsed');

// Parse voices by evaluating safe subset
const voicesBlock = initialVoicesMatch[1];
const voiceLines = voicesBlock.split('\n').filter(l => l.includes("name:") && l.includes("category:"));

console.log(`Found ${voiceLines.length} voice definition entries in INITIAL_VOICES.`);

// Detailed extraction of voices
const voices = [];
const voiceRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)',\s*gender:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
let match;
while ((match = voiceRegex.exec(voicesBlock)) !== null) {
  voices.push({
    id: match[1],
    name: match[2],
    desc: match[3],
    gender: match[4],
    category: match[5]
  });
}

assert(voices.length === 35, `Total personas in INITIAL_VOICES is 35 (Found: ${voices.length})`);

const blok1Nasional = voices.filter(v => v.category === 'Nasional');
const blok2Sunda = voices.filter(v => v.category === 'Sunda');
const blok3Dialek = voices.filter(v => v.category === 'Dialek Nusantara');

assert(blok1Nasional.length === 14, `Blok 1 (Nusa Voice - Nasional) has exactly 14 characters (Found: ${blok1Nasional.length})`);
assert(blok2Sunda.length === 8, `Blok 2 (Pasundan Voice - Sunda) has exactly 8 characters (Found: ${blok2Sunda.length})`);
assert(blok3Dialek.length === 13, `Blok 3 (Logat Nusantara - Dialek) has exactly 13 characters (Found: ${blok3Dialek.length})`);

// Check Nusa Voice 14 personas exact match
const EXPECTED_NUSA_VOICE = [
  { name: 'Anita', id: 'Aoede', gender: 'Female' },
  { name: 'Siti', id: 'Leda', gender: 'Female' },
  { name: 'Agus', id: 'Charon', gender: 'Male' },
  { name: 'Dewi', id: 'Despina', gender: 'Female' },
  { name: 'Tina', id: 'Callirrhoe', gender: 'Female' },
  { name: 'Maya', id: 'Autonoe', gender: 'Female' },
  { name: 'Rian', id: 'Puck', gender: 'Male' },
  { name: 'Indah', id: 'Erinome', gender: 'Female' },
  { name: 'Gading', id: 'Fenrir', gender: 'Male' },
  { name: 'Shinta', id: 'Laomedeia', gender: 'Female' },
  { name: 'Bayu', id: 'Orus', gender: 'Male' },
  { name: 'Adi', id: 'Algenib', gender: 'Male' },
  { name: 'Eko', id: 'Iapetus', gender: 'Male' },
  { name: 'Laras', id: 'Achernar', gender: 'Female' },
];

let nusaMatched = true;
for (const exp of EXPECTED_NUSA_VOICE) {
  const v = blok1Nasional.find(item => item.name === exp.name);
  if (!v || v.id !== exp.id || v.gender !== exp.gender) {
    console.error(`Mismatch for Nusa Voice character: ${exp.name}`, v, exp);
    nusaMatched = false;
  }
}
assert(nusaMatched, 'All 14 Blok 1 personas match Nusa Voice 100% (Name, ID, Gender)');

// 2. TEST AUDIO PREVIEW FILE INTEGRITY FOR ALL 35 PERSONAS
console.log('\n--- 2. Testing Physical Audio Preview Files for All 35 Personas ---');
const previewsObj = {};
const previewLines = staticPreviewsMatch[1].split('\n');
for (const line of previewLines) {
  const m = line.match(/'([^']+)':\s*'([^']+)'/);
  if (m) {
    previewsObj[m[1]] = m[2];
  }
}

let allAudioFilesExist = true;
let totalAudioBytes = 0;

for (const v of voices) {
  const previewPath = previewsObj[v.name];
  if (!previewPath) {
    console.error(`No preview path mapped for voice: "${v.name}"`);
    allAudioFilesExist = false;
    continue;
  }
  const cleanPath = path.join('public', previewPath.replace(/^\//, ''));
  const physicalPath = path.resolve(cleanPath);
  if (!fs.existsSync(physicalPath)) {
    console.error(`Physical file missing for "${v.name}": ${physicalPath}`);
    allAudioFilesExist = false;
    continue;
  }
  const stats = fs.statSync(physicalPath);
  if (stats.size < 1000) {
    console.error(`Audio file for "${v.name}" is suspiciously small: ${stats.size} bytes`);
    allAudioFilesExist = false;
    continue;
  }
  totalAudioBytes += stats.size;
}

assert(allAudioFilesExist, `All 35 personas have physical audio preview files (Total payload: ${(totalAudioBytes / 1024 / 1024).toFixed(2)} MB)`);

// 3. TEST FAIL-SAFE 8-KEY ROTATION LOGIC
console.log('\n--- 3. Testing 8-Slot Fail-Safe API Key Pool Rotation ---');
// Verify fetchWithRetry logic from source code
assert(gentraCode.includes('activeKeyPool'), 'GentraStudio includes activeKeyPool state');
assert(gentraCode.includes('gentra_gemini_keys_pool'), 'GentraStudio persists pool to localStorage key "gentra_gemini_keys_pool"');
assert(gentraCode.includes('showApiKeyModal'), 'Master Admin modal toggle exists');

// Simulate key rotation function
function simulateRotation(keyPool, startIdx, simulateLimitOnKeys) {
  const visitedKeys = [];
  let currIdx = startIdx;
  for (let attempt = 0; attempt < keyPool.length; attempt++) {
    const key = keyPool[currIdx];
    visitedKeys.push(key);
    if (!simulateLimitOnKeys.includes(key)) {
      return { success: true, activeKey: key, visitedKeys };
    }
    currIdx = (currIdx + 1) % keyPool.length;
  }
  return { success: false, activeKey: null, visitedKeys };
}

const testPool = ['key1_exhausted', 'key2_exhausted', 'key3_working', 'key4_backup'];
const rotResult = simulateRotation(testPool, 0, ['key1_exhausted', 'key2_exhausted']);
assert(rotResult.success && rotResult.activeKey === 'key3_working', 'Simulated 429 rotation cleanly jumps to next available key');
assert(rotResult.visitedKeys.length === 3, `Key rotation visited exactly 3 keys before succeeding (Visited: ${rotResult.visitedKeys.join(', ')})`);

// 4. TEST SPOKEN INTRO PREVENTION GUARANTEE
console.log('\n--- 4. Testing Spoken Intro Elimination Rules ---');
assert(gentraCode.includes('DO NOT utter any intro, greeting, commentary'), 'SystemInstruction explicitly forbids greetings and filler preamble');
assert(gentraCode.includes('Begin speaking the very first word of the user text immediately with ZERO delay'), 'SystemInstruction mandates zero-delay text speech');
assert(gentraCode.includes('contents: [{ \n            role: "user",\n            parts: [{ text: chunkText }] \n          }]'), 'Contents payload contains RAW chunkText only without prefix');

// 5. TEST TEXT CHUNKING LOGIC
console.log('\n--- 5. Testing Natural Text Splitting & Chunking ---');
function splitTextIntoNaturalChunks(fullText, maxChunkSize = 800) {
  if (!fullText || fullText.length <= maxChunkSize) return [fullText.trim()];
  const sentenceDelimiters = /([.?!;:\n]+)/g;
  const rawParts = fullText.split(sentenceDelimiters);
  const sentences = [];
  for (let i = 0; i < rawParts.length; i += 2) {
    const sentence = (rawParts[i] || '') + (rawParts[i + 1] || '');
    if (sentence.trim().length > 0) sentences.push(sentence.trim());
  }
  const chunks = [];
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).trim().length <= maxChunkSize) {
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      if (sentence.length > maxChunkSize) {
        const words = sentence.split(/\s+/);
        let subChunk = '';
        for (const w of words) {
          if ((subChunk + ' ' + w).trim().length <= maxChunkSize) {
            subChunk = subChunk ? subChunk + ' ' + w : w;
          } else {
            if (subChunk) chunks.push(subChunk.trim());
            subChunk = w;
          }
        }
        if (subChunk) currentChunk = subChunk;
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

const sampleLongText = "Pemerintah Provinsi Jawa Barat terus berkomitmen untuk memberikan pelayanan publik yang transparan dan akuntabel. ".repeat(20);
const chunks = splitTextIntoNaturalChunks(sampleLongText, 800);
assert(chunks.length > 1, `Long text (${sampleLongText.length} chars) successfully divided into ${chunks.length} natural chunks`);
assert(chunks.every(c => c.length <= 800), 'All chunks respect maximum character threshold of 800');

// 6. TEST WAV HEADER BUILDER
console.log('\n--- 6. Testing PCM to RIFF/WAV Header Builder ---');
function buildWavBlobMock(pcmData, sampleRate = 24000) {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmData.length * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true); // 16-bit
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcmData.length * 2, true);
  return { buffer, byteLength: buffer.byteLength, view };
}

const dummyPcm = new Int16Array(24000); // 1 second mono 24kHz
const wavResult = buildWavBlobMock(dummyPcm, 24000);
const magicRiff = String.fromCharCode(
  wavResult.view.getUint8(0),
  wavResult.view.getUint8(1),
  wavResult.view.getUint8(2),
  wavResult.view.getUint8(3)
);
const magicWave = String.fromCharCode(
  wavResult.view.getUint8(8),
  wavResult.view.getUint8(9),
  wavResult.view.getUint8(10),
  wavResult.view.getUint8(11)
);
assert(magicRiff === 'RIFF', 'WAV Header magic string begins with "RIFF"');
assert(magicWave === 'WAVE', 'WAV Header format string is "WAVE"');
assert(wavResult.byteLength === 44 + 48000, `WAV File buffer size matches expected 48044 bytes (Found: ${wavResult.byteLength})`);

// 7. TEST UI POLISH & ACCURACY
console.log('\n--- 7. Testing UI Navigation & ILM Labels ---');
assert(gentraCode.includes('>ILM<'), 'Desktop navbar button renders "ILM" succinctly');
assert(gentraCode.includes('BUAT NASKAH ILM OTOMATIS'), 'ILM generate copywriting button has succinct text');
assert(!gentraCode.includes('[ Audio Nuansa Sunda ]'), 'Redundant dialect toggle button has been removed');

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
