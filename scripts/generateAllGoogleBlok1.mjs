import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public/audio/previews');

const GOOGLE_PERSONAS = [
  {
    fileName: 'dewi.mp3',
    text: "Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!"
  },
  {
    fileName: 'tina.mp3',
    text: "Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah."
  },
  {
    fileName: 'maya.mp3',
    text: "Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan."
  },
  {
    fileName: 'rian.mp3',
    text: "Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!"
  },
  {
    fileName: 'indah.mp3',
    text: "Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda."
  },
  {
    fileName: 'gading.mp3',
    text: "Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama."
  },
  {
    fileName: 'shinta.mp3',
    text: "Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara."
  },
  {
    fileName: 'bayu.mp3',
    text: "Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama."
  },
  {
    fileName: 'adi.mp3',
    text: "Semangat pagi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!"
  },
  {
    fileName: 'eko.mp3',
    text: "Mari kita cermati bersama langkah-langkah strategis dalam meningkatkan daya saing daerah."
  },
  {
    fileName: 'laras.mp3',
    text: "Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini."
  }
];

async function downloadGoogleTTS(text, filePath) {
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=' + encodeURIComponent(text);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buf);
  console.log(`✅ Saved Clean Audio (No Intro): ${path.basename(filePath)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function run() {
  console.log('Regenerating all 11 Blok 1 audio previews WITHOUT any introductory sentence...');
  for (const item of GOOGLE_PERSONAS) {
    const target = path.join(OUTPUT_DIR, item.fileName);
    await downloadGoogleTTS(item.text, target);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Done! All preview audio files now start directly from the first content word!');
}

run();
