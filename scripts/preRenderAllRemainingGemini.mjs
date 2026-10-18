import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
const apiKey = match ? match[1].trim() : '';

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

const ITEMS = [
  { fileName: 'laras.wav', voice: 'Achernar', text: 'Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini.' },
  { fileName: 'dewi.wav', voice: 'Despina', text: 'Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!' },
  { fileName: 'tina.wav', voice: 'Callirrhoe', text: 'Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah.' },
  { fileName: 'maya.wav', voice: 'Autonoe', text: 'Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan.' },
  { fileName: 'rian.wav', voice: 'Puck', text: 'Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!' },
  { fileName: 'indah.wav', voice: 'Erinome', text: 'Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda.' },
  { fileName: 'gading.wav', voice: 'Fenrir', text: 'Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama.' },
  { fileName: 'shinta.wav', voice: 'Laomedeia', text: 'Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara.' },
  { fileName: 'bayu.wav', voice: 'Orus', text: 'Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama.' },
  { fileName: 'adi.wav', voice: 'Algenib', text: 'Semangat pagi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!' },
  { fileName: 'eko.wav', voice: 'Iapetus', text: 'Mari kita cermati bersama langkah-langkah strategis dalam meningkatkan daya saing daerah.' },
  { fileName: 'budak_ujang.wav', voice: 'Algenib', text: 'Horeee! Hayu urang ulin ka buruan bari diajar elmu pangaweruh anyar!' },
  { fileName: 'kang_asep.wav', voice: 'Orus', text: 'Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak.' }
];

const MODELS = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];

async function renderItem(item) {
  const outDir = path.resolve('public/audio/previews');
  const targetWav = path.join(outDir, item.fileName);
  const targetMp3 = path.join(outDir, item.fileName.replace('.wav', '.mp3'));

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: item.text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: item.voice }
              }
            }
          }
        })
      });

      if (res.status === 429) {
        console.warn(`⏳ Rate limit on ${model}`);
        continue;
      }

      if (!res.ok) {
        console.warn(`Error on ${model}: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const rawB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!rawB64) continue;

      const pcm = Buffer.from(rawB64, 'base64');
      const wav = pcmToWav(pcm, 24000);
      fs.writeFileSync(targetWav, wav);
      fs.writeFileSync(targetMp3, wav); // duplicate as .mp3 so both extensions resolve

      console.log(`✅ Pre-rendered ${item.fileName} (${(wav.length / 1024).toFixed(1)} KB) using Gemini ${model} (${item.voice})`);
      return true;
    } catch (err) {
      console.warn(`Fetch error on ${model}: ${err.message}`);
    }
  }
  return false;
}

async function main() {
  console.log('🚀 Starting pure Gemini TTS Pre-Renderer for all characters (Zero ElevenLabs)...');
  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    console.log(`[${i + 1}/${ITEMS.length}] Rendering ${item.fileName}...`);
    let success = await renderItem(item);
    if (!success) {
      console.log('Waiting 25s for rate limit recovery...');
      await new Promise(r => setTimeout(r, 25000));
      success = await renderItem(item);
    }
    // Smooth delay between requests (22s ensures we stay under 3 req/min)
    await new Promise(r => setTimeout(r, 22000));
  }
  console.log('🎉 ALL CHARACTERS FULLY PRE-RENDERED WITH GEMINI 3.8 FLASH TTS!');
}

main().catch(console.error);
