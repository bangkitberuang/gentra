import fs from 'fs';
import path from 'path';

const dir = 'public/audio/previews';
const files = ['nini.wav', 'abah.wav', 'ujang.wav', 'bibi.wav', 'budak_eneng.wav', 'teh_neng.wav'];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  const buf = fs.readFileSync(filePath);
  // Header is 44 bytes
  const pcm = buf.subarray(44);
  const totalSamples = pcm.length / 2;
  const durationSec = totalSamples / 24000;

  // Let's analyze energy in 100ms windows (2400 samples = 4800 bytes)
  const windowSize = 2400;
  const windowSec = 0.1;
  const energies = [];

  for (let i = 0; i < totalSamples; i += windowSize) {
    let sum = 0;
    let count = 0;
    for (let j = 0; j < windowSize && (i + j) < totalSamples; j++) {
      const sample = pcm.readInt16LE((i + j) * 2);
      sum += Math.abs(sample);
      count++;
    }
    const avgEnergy = count > 0 ? sum / count : 0;
    energies.push({
      time: ((i / 24000)).toFixed(2),
      energy: Math.round(avgEnergy)
    });
  }

  // Find pauses (silence threshold e.g. < 500 energy) between 3s and 12s
  const pauses = [];
  for (let k = 0; k < energies.length; k++) {
    const t = parseFloat(energies[k].time);
    if (t > 2.0 && t < durationSec - 2.0) {
      if (energies[k].energy < 600) {
        pauses.push(t);
      }
    }
  }

  console.log(`=== ${file} (Duration: ${durationSec.toFixed(2)}s) ===`);
  console.log(`Potential pause points (silence between intro and main speech):`, pauses.slice(0, 15).join(', '));
}
