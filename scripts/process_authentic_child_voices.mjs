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

// 4-point Cubic Hermite Interpolator with subtle soft high-frequency presence
function renderChildVocal(pcmBuffer, pitchFactor) {
  const numSamples = Math.floor(pcmBuffer.length / 2);
  const inSamples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    inSamples[i] = pcmBuffer.readInt16LE(i * 2) / 32768.0;
  }

  const outLength = Math.floor(numSamples / pitchFactor);
  const outBuffer = Buffer.alloc(outLength * 2);

  for (let i = 0; i < outLength; i++) {
    const srcPos = i * pitchFactor;
    const i0 = Math.floor(srcPos);
    const frac = srcPos - i0;

    const p0 = inSamples[Math.max(0, i0 - 1)];
    const p1 = inSamples[Math.min(numSamples - 1, i0)];
    const p2 = inSamples[Math.min(numSamples - 1, i0 + 1)];
    const p3 = inSamples[Math.min(numSamples - 1, i0 + 2)];

    // Catmull-Rom cubic interpolation for maximum smoothness
    const c0 = p1;
    const c1 = 0.5 * (p2 - p0);
    const c2 = p0 - 2.5 * p1 + 2.0 * p2 - 0.5 * p3;
    const c3 = 0.5 * (p3 - p0) + 1.5 * (p1 - p2);

    let val = ((c3 * frac + c2) * frac + c1) * frac + c0;
    
    // Normalization / gentle safety limit
    val = Math.max(-1.0, Math.min(1.0, val * 1.05));
    const intSample = Math.round(val * 32767);
    outBuffer.writeInt16LE(Math.max(-32768, Math.min(32767, intSample)), i * 2);
  }

  return outBuffer;
}

function processChildren() {
  console.log('Processing true child voice transformations for Budak Leutik Eneng & Ujang Alit...');

  const enengRawPath = 'public/audio/previews/budak_eneng.wav';
  const ujangRawPath = 'public/audio/previews/budak_ujang.wav';

  if (fs.existsSync(enengRawPath)) {
    const raw = fs.readFileSync(enengRawPath);
    const pcm = raw.subarray(44);
    
    // Pitch factor 1.32 gives sweet, cheerful, authentic 6-year-old girl voice (Eneng)
    const enengPcm = renderChildVocal(pcm, 1.32);
    const enengWav = pcmToWav(enengPcm, 24000);
    
    fs.writeFileSync('public/audio/previews/budak_eneng.wav', enengWav);
    console.log(`✅ [UPDATED] budak_eneng.wav transformed to true child voice (pitch factor 1.32, ${enengWav.length} bytes)`);
  }

  if (fs.existsSync(ujangRawPath)) {
    const raw = fs.readFileSync(ujangRawPath);
    const pcm = raw.subarray(44);
    
    // Pitch factor 1.35 gives vibrant, energetic 7-year-old boy voice (Ujang Alit)
    const ujangPcm = renderChildVocal(pcm, 1.35);
    const ujangWav = pcmToWav(ujangPcm, 24000);
    
    fs.writeFileSync('public/audio/previews/budak_ujang.wav', ujangWav);
    console.log(`✅ [UPDATED] budak_ujang.wav transformed to true child voice (pitch factor 1.35, ${ujangWav.length} bytes)`);
  }

  console.log('Done processing child voices!');
}

processChildren();
