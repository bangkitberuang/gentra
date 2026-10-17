import fs from 'fs';
import path from 'path';

function pcmToWav(pcmBuffer, sampleRate = 24000) {
  const wav = Buffer.alloc(44 + pcmBuffer.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcmBuffer.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // Mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcmBuffer.length, 40);
  pcmBuffer.copy(wav, 44);
  return wav;
}

const TRIMS = [
  { file: 'nini.wav', startSec: 11.20 },
  { file: 'ujang.wav', startSec: 7.30 },
  { file: 'bibi.wav', startSec: 8.00 },
  { file: 'budak_eneng.wav', startSec: 8.35 },
  { file: 'abah.wav', startSec: 4.55 }
];

const dir = 'public/audio/previews';

for (const { file, startSec } of TRIMS) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}: not found`);
    continue;
  }

  const raw = fs.readFileSync(filePath);
  const pcm = raw.subarray(44);
  const startByte = Math.floor(startSec * 24000) * 2; // 2 bytes per sample

  if (startByte >= pcm.length) {
    console.warn(`startByte for ${file} exceeds length!`);
    continue;
  }

  const trimmedPcm = pcm.subarray(startByte);
  const newWav = pcmToWav(trimmedPcm, 24000);

  fs.writeFileSync(filePath, newWav);
  console.log(`✅ Trimmed ${file}: sliced from ${startSec}s, new duration: ${(trimmedPcm.length / 48000).toFixed(2)}s`);
}
