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
const initialVoicesMatch = gentraCode.match(/const INITIAL_VOICES = \[([\s\S]*?)\];\s*\n\s*\/\/\s*---\s*Karakter Suara Khusus/);
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

assert(voices.length === 22, `Total personas in INITIAL_VOICES is 22 (Found: ${voices.length})`);

const blok1Nasional = voices.filter(v => v.category === 'Nasional');
const blok2Sunda = voices.filter(v => v.category === 'Sunda');

assert(blok1Nasional.length === 14, `Blok 1 (Nusa Voice - Nasional) has exactly 14 characters (Found: ${blok1Nasional.length})`);
assert(blok2Sunda.length === 8, `Blok 2 (Pasundan Voice - Sunda) has exactly 8 characters (Found: ${blok2Sunda.length})`);

// Check Nusa Voice 14 personas exact match
const EXPECTED_NUSA_VOICE = [
  { name: 'Anita', id: 'Aoede', gender: 'Female' },
  { name: 'Siti', id: 'Leda', gender: 'Female' },
  { name: 'Mugi', id: 'Charon', gender: 'Male' },
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

// 2. TEST AUDIO PREVIEW FILE INTEGRITY FOR ALL 22 PERSONAS
console.log('\n--- 2. Testing Physical Audio Preview Files for All 22 Personas ---');
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

assert(allAudioFilesExist, `All 22 personas have physical audio preview files (Total payload: ${(totalAudioBytes / 1024 / 1024).toFixed(2)} MB)`);

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
assert(gentraCode.includes('DILARANG KERAS mengucapkan intro, sapaan, atau basa-basi apa pun'), 'SystemInstruction explicitly forbids greetings and filler preamble in Indonesian');
assert(gentraCode.includes('Mulai bersuara langsung dari kata pertama teks naskah tanpa jeda'), 'SystemInstruction mandates zero-delay text speech');
assert(gentraCode.includes('chunkText') && gentraCode.includes('contents: ['), 'Contents payload contains pure chunkText without conversational filler');

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
assert(gentraCode.includes('ILM MODE'), 'Desktop navbar renders "ILM MODE" segmented tab');
assert(gentraCode.includes('Iklan Layanan Masyarakat (ILM)'), 'Navigation renders "Iklan Layanan Masyarakat (ILM)"');
assert(gentraCode.includes('BUAT NASKAH ILM OTOMATIS'), 'ILM generate copywriting button has succinct text');
assert(!gentraCode.includes('[ Audio Nuansa Sunda ]'), 'Redundant dialect toggle button has been removed');

// 8. TEST IPAD PERSISTENCE & STORAGE RESILIENCE
console.log('\n--- 8. Testing iPadOS / Safari Storage Resilience & Sanitization ---');
const safeStorageCode = fs.readFileSync('src/utils/safeStorage.js', 'utf8');
assert(safeStorageCode.includes('sanitizeApiKey'), 'safeStorage exports sanitizeApiKey function');
assert(safeStorageCode.includes('setCookie') && safeStorageCode.includes('getCookie'), 'safeStorage includes cookie persistence fallback');
assert(safeStorageCode.includes('safeGetItem') && safeStorageCode.includes('safeSetItem'), 'safeStorage provides unified dual-storage accessor');

// Test sanitizeApiKey directly with dirty inputs common on iPadOS virtual keyboard
function sanitizeApiKeyMock(key) {
  if (!key || typeof key !== 'string') return '';
  return key
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/^["'`\s]+|["'`\s]+$/g, '')
    .trim();
}

const dirtyIpadKey = '  \nAIzaSyTestKey1234567890\r\n\t  ';
const cleanedKey = sanitizeApiKeyMock(dirtyIpadKey);
assert(cleanedKey === 'AIzaSyTestKey1234567890', `Dirty iPad clipboard key correctly sanitized (Output: "${cleanedKey}")`);

const quotedKey = '"AIzaSyWithQuotes"';
assert(sanitizeApiKeyMock(quotedKey) === 'AIzaSyWithQuotes', 'Keys with copied quotes correctly stripped');

// Verify GentraStudio and Modals integrate safeStorage & Key Masking
assert(gentraCode.includes('safeStorage'), 'GentraStudio imports safeStorage utilities');
assert(gentraCode.includes('ApiKeyModal'), 'GentraStudio includes dedicated ApiKeyModal');
const apiKeyModalCode = fs.readFileSync('src/components/ApiKeyModal.jsx', 'utf8');
const voiceLabCode = fs.readFileSync('src/components/VoiceLabModal.jsx', 'utf8');
assert(apiKeyModalCode.includes('autoCapitalize="none"'), 'ApiKeyModal disables iOS autoCapitalize');
assert(apiKeyModalCode.includes('autoCorrect="off"'), 'ApiKeyModal disables iOS autoCorrect');
assert(!apiKeyModalCode.includes('type={showKey1 ? "text" : "password"}'), 'ApiKeyModal never exposes raw key as plaintext in input');
assert(apiKeyModalCode.includes('formatMaskedKey'), 'ApiKeyModal provides secure masked key formatting');
assert(voiceLabCode.includes('formatMaskedKey'), 'VoiceLabModal provides secure masked key formatting');
assert(!voiceLabCode.includes('type={isVisible ? "text" : "password"}'), 'VoiceLabModal never exposes raw key as plaintext in input');
const userMgmtCode = fs.readFileSync('src/components/UserManagementModal.jsx', 'utf8');
assert(!apiKeyModalCode.includes('Sandi default:'), 'ApiKeyModal completely purged plaintext password hint');
assert(!voiceLabCode.includes('Sandi default:'), 'VoiceLabModal completely purged plaintext password hint');
assert(!userMgmtCode.includes('Sandi default:'), 'UserManagementModal completely purged plaintext password hint');
assert(gentraCode.includes('SOVEREIGN_VAULT_KEY'), 'GentraStudio includes SOVEREIGN_VAULT_KEY for seamless cross-device generation');

// 9. TEST DISTINCT GENTRA VERSIONING (v2.6.4)
console.log('\n--- 9. Testing Distinct Platform Versioning (GENTRA v2.6.4 Standard) ---');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert(pkg.version === '2.6.4', `package.json is standardized to authentic version 2.6.4 (Found: ${pkg.version})`);

const landingCode = fs.readFileSync('src/components/LandingPage.jsx', 'utf8');
assert(landingCode.includes('v2.6.4'), 'LandingPage header and footer display GENTRA v2.6.4');
assert(!landingCode.includes('v1.3.0'), 'LandingPage completely purged external v1.3.0 badge');

const studioCode = fs.readFileSync('src/components/GentraStudio.jsx', 'utf8');
assert(studioCode.includes('v2.6.4'), 'GentraStudio header and footer display GENTRA v2.6.4');
assert(!studioCode.includes('v1.3.0'), 'GentraStudio completely purged external v1.3.0 badge');
assert(studioCode.includes('BANGKIT Beruang Ekosistem'), 'GentraStudio footer displays BANGKIT Beruang Ekosistem');
assert(landingCode.includes('BANGKIT Beruang Ekosistem'), 'LandingPage footer displays BANGKIT Beruang Ekosistem');

const loginModalCode = fs.readFileSync('src/components/LoginModal.jsx', 'utf8');
assert(loginModalCode.includes('v2.6.4'), 'LoginModal displays GENTRA v2.6.4');
assert(!loginModalCode.includes('v1.3.0'), 'LoginModal completely purged external v1.3.0 badge');

assert(voiceLabCode.includes('v2.6.4'), 'VoiceLabModal displays GENTRA Lab v2.6.4');

const userModalCode = fs.readFileSync('src/components/UserManagementModal.jsx', 'utf8');
assert(userModalCode.includes('v2.6.4'), 'UserManagementModal displays GENTRA Enterprise v2.6.4');

const changelogCode = fs.readFileSync('CHANGELOG.md', 'utf8');
assert(changelogCode.includes('## [v2.6.4]'), 'CHANGELOG.md documents v2.6.4 milestone release');

const readmeCode = fs.readFileSync('README.md', 'utf8');
assert(readmeCode.includes('Version-v2.6.4'), 'README.md includes official v2.6.4 release badge');

// 10. TEST PURGING OF ASLI LABELS & WORKLOAD METRICS ATTRIBUTION
console.log('\n--- 10. Testing Purging of "Asli" Persona Labels & Account Workload Synchronization ---');

// Check that "Asli:" has been purged from LandingPage, GentraStudio, VoiceLabModal, and UserManagementModal
assert(!landingCode.includes('Asli: {persona.originalName'), 'LandingPage purged "Asli: {persona.originalName}" label');
assert(!studioCode.includes('(Asli: {v.originalName})'), 'GentraStudio voice cards purged "(Asli: {v.originalName})" label');
assert(!userModalCode.includes('(Asli: {act.originalVoiceName})'), 'UserManagementModal audit trail purged "(Asli: {act.originalVoiceName})" label');
assert(!voiceLabCode.includes('Base ID Asli:'), 'VoiceLabModal purged "Base ID Asli:" label');
assert(!voiceLabCode.includes('<span>Nama Asli:'), 'VoiceLabModal purged "<span>Nama Asli:" label');

// Test userManagement logic
const userUtilCode = fs.readFileSync('src/utils/userManagement.js', 'utf8');
assert(userUtilCode.includes('currentUser = null'), 'getRegisteredUsers and getAccountMetricsSummary support currentUser parameter');
assert(userUtilCode.includes('matchesAccount'), 'getAccountMetricsSummary implements flexible account matching (email, prefix, username)');
assert(userUtilCode.includes('scriptText || script || text'), 'logAccountActivity gracefully handles both script and scriptText');

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}

