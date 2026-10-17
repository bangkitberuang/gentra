import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const OUTPUT_DIR = path.resolve('public/audio/previews');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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

const PERSONAS_TO_GENERATE = [
  // Karakter Khas Sunda
  {
    fileName: 'nini.wav',
    voice: 'Erinome',
    prompt: 'Sebagai Nini, nenek Sunda sepuh yang sangat lembut, penuh kasih sayang, bersahaja dan welas asih. Intonasi mengayomi khas Jawa Barat Priangan: "Sing sabar nya anaking, pancegkeun hate dina kahadean tur ibadah."'
  },
  {
    fileName: 'ujang.wav',
    voice: 'Puck',
    prompt: 'Sebagai Ujang, pemuda Sunda yang ceria, lincah, ramah, dan energik. Logat Sunda yang bersahabat: "Sampurasun wargi Jabar! Hayu urang babarengan ngamumule Jawa Barat Juara!"'
  },
  {
    fileName: 'bibi.wav',
    voice: 'Despina',
    prompt: 'Sebagai Ceu Edah (Bibi), ibu Sunda yang heboh, medok renyah, akrab dan guyub bersahabat: "Aduh euy wargi sadayana, tong hilap jaga kaberesihan sareng kasehatan lingkungan nya!"'
  },
  {
    fileName: 'budak_eneng.wav',
    voice: 'Aoede',
    prompt: 'Sebagai Budak Leutik Eneng, anak perempuan kecil yang imut, polos, dan menggemaskan dengan logat Sunda manis: "Bapa, Ibu... Eneng hoyong diajar maca Al-Qur\'an sareng ngadongeng sasarengan!"'
  },
  {
    fileName: 'budak_ujang.wav',
    voice: 'Puck',
    prompt: 'Sebagai Budak Leutik Ujang Alit, anak laki-laki kecil yang periang, lincah dan bersemangat: "Horeee! Hayu urang ulin ka buruan bari diajar elmu pangaweruh anyar!"'
  },
  {
    fileName: 'kang_asep.wav',
    voice: 'Charon',
    prompt: 'Sebagai Kang Asep, pria dewasa Sunda yang santun, artikulatif, ramah dan komunikatif: "Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak."'
  },
  // Karakter Nasional
  {
    fileName: 'dewi.wav',
    voice: 'Despina',
    prompt: 'Sebagai Dewi, penyiar wanita yang energik, percaya diri, lugas, dan persuasif: "Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!"'
  },
  {
    fileName: 'tina.wav',
    voice: 'Callirrhoe',
    prompt: 'Sebagai Tina, penyiar resmi korporat dan kedinasan dengan intonasi formal, berwibawa dan jelas: "Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah."'
  },
  {
    fileName: 'maya.wav',
    voice: 'Autonoe',
    prompt: 'Sebagai Maya, narator wanita inspiratif, hangat, puitis, dan penuh optimisme: "Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan."'
  },
  {
    fileName: 'rian.wav',
    voice: 'Puck',
    prompt: 'Sebagai Rian, pemuda santai, lincah, kreatif dan relevan untuk generasi muda: "Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!"'
  },
  {
    fileName: 'indah.wav',
    voice: 'Erinome',
    prompt: 'Sebagai Indah, pembicara relaksasi dan meditasi bersuara sangat halus, hening dan menenangkan batin: "Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda."'
  },
  {
    fileName: 'gading.wav',
    voice: 'Fenrir',
    prompt: 'Sebagai Gading, narator pria bersuara berat, tegas, maskulin dan otoritatif untuk pengumuman kedaruratan: "Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama."'
  },
  {
    fileName: 'shinta.wav',
    voice: 'Laomedeia',
    prompt: 'Sebagai Shinta, wanita berintegritas tinggi dengan artikulasi lugas, tegas, dan berani: "Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara."'
  },
  {
    fileName: 'bayu.wav',
    voice: 'Orus',
    prompt: 'Sebagai Bayu, suara pria santai, bersahabat, sejuk seperti mengobrol hangat bersama kawan: "Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama."'
  },
  {
    fileName: 'adi.wav',
    voice: 'Algenib',
    prompt: 'Sebagai Adi, pria dinamis, ceria, dan penuh energi positif membakar semangat: "Semangat pagi wargi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!"'
  },
  {
    fileName: 'eko.wav',
    voice: 'Iapetus',
    prompt: 'Sebagai Eko, narator akademis, berwawasan, metodik dan runtut: "Mari kita cermati bersama langkah-langkah strategis dalam meningkatkan daya saing daerah."'
  },
  {
    fileName: 'laras.wav',
    voice: 'Achernar',
    prompt: 'Sebagai Laras, narator protokoler kenegaraan yang anggun, santun, dan penuh tata krama: "Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini."'
  }
];

async function generatePreview(item) {
  const filePath = path.join(OUTPUT_DIR, item.fileName);
  if (fs.existsSync(filePath)) {
    console.log(`[SUDAH ADA] ${item.fileName}`);
    return;
  }

  console.log(`[GENERATING] ${item.fileName} (${item.voice})...`);

  const models = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
  let success = false;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: item.prompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: item.voice }
              }
            }
          }
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        console.warn(`Gagal dengan model ${model}: ${txt}`);
        continue;
      }

      const data = await res.json();
      const rawB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!rawB64) continue;

      const pcmBuffer = Buffer.from(rawB64, 'base64');
      const wavBuffer = pcmToWav(pcmBuffer, 24000);
      fs.writeFileSync(filePath, wavBuffer);
      console.log(`✅ [BERHASIL] ${item.fileName} (${(wavBuffer.length / 1024).toFixed(1)} KB)`);
      success = true;
      break;
    } catch (e) {
      console.warn(`Error pada ${item.fileName}:`, e.message);
    }
  }

  if (!success) {
    console.error(`❌ [GAGAL TOTAL] ${item.fileName}`);
  }

  // Jeda 600ms antar panggilan agar stabil
  await new Promise(r => setTimeout(r, 600));
}

async function main() {
  console.log(`Mulai pembuatan audio preview untuk ${PERSONAS_TO_GENERATE.length} karakter...`);
  for (const persona of PERSONAS_TO_GENERATE) {
    await generatePreview(persona);
  }
  console.log('Semua proses pembuatan audio preview selesai!');
}

main();
