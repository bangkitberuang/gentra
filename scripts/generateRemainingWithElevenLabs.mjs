import fs from 'fs';
import path from 'path';

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_e52a5c3e0477787cd19ac6bcebc257e9337d373adb0f22ba';
const OUTPUT_DIR = path.resolve('public/audio/previews');

const REMAINING_PERSONAS = [
  {
    fileName: 'budak_ujang.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
    text: "Horeee! Hayu urang ulin ka buruan bari diajar elmu pangaweruh anyar!"
  },
  {
    fileName: 'kang_asep.mp3',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    text: "Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak."
  },
  {
    fileName: 'dewi.mp3',
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura
    text: "Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!"
  },
  {
    fileName: 'tina.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    text: "Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah."
  },
  {
    fileName: 'maya.mp3',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    text: "Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan."
  },
  {
    fileName: 'rian.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
    text: "Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!"
  },
  {
    fileName: 'indah.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    text: "Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda."
  },
  {
    fileName: 'gading.mp3',
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie
    text: "Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama."
  },
  {
    fileName: 'shinta.mp3',
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura
    text: "Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara."
  },
  {
    fileName: 'bayu.mp3',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    text: "Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama."
  },
  {
    fileName: 'adi.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
    text: "Semangat pagi wargi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!"
  },
  {
    fileName: 'eko.mp3',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    text: "Mari kita cermati bersama langkah-langkah strategis dalam meningkatkan daya saing daerah."
  },
  {
    fileName: 'laras.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    text: "Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini."
  }
];

async function generateWithEleven(item) {
  const filePath = path.join(OUTPUT_DIR, item.fileName);
  if (fs.existsSync(filePath)) {
    console.log(`[EXISTING] ${item.fileName}`);
    return;
  }

  console.log(`[ELEVENLABS GENERATING] ${item.fileName}...`);
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${item.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: item.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.80
        }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Failed ${item.fileName}:`, err);
      return;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buf);
    console.log(`✅ [SUCCESS] ${item.fileName} (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (e) {
    console.error(`Error ${item.fileName}:`, e.message);
  }

  await new Promise(r => setTimeout(r, 400));
}

async function main() {
  console.log(`Membuat audio untuk ${REMAINING_PERSONAS.length} sisa karakter...`);
  for (const item of REMAINING_PERSONAS) {
    await generateWithEleven(item);
  }
  console.log('Semua sisa karakter berhasil di-generate!');
}

main();
