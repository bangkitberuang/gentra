import fs from 'fs';
import path from 'path';

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const OUTPUT_DIR = path.resolve('public/audio/previews');

const DIALEK_PERSONAS = [
  {
    fileName: 'teh_lilis.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah (Halus)
    text: "Punten wargi sadayana, mangga urang sasarengan ngajaga kabersihan lingkungan supados langkung merenah."
  },
  {
    fileName: 'mas_tejo.mp3',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George (Wibawa)
    text: "Nggih monggo sedulur, sami-sami makarya kanthi guyub rukun kangge kemajengane kita sedaya."
  },
  {
    fileName: 'abang_ucok.mp3',
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie (Tegas Mantap)
    text: "Horas kawan! Jangan ragu-ragu bah, kerja keras dan integritas itu kunci sukses kita bersama!"
  },
  {
    fileName: 'daeng.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum (Cepat Dinamis)
    text: "Tabe' saudaraku, mariki' sama-sama kobarkan semangat juang demi masa depan yang lebih gemilang!"
  },
  {
    fileName: 'uda.mp3',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger (Santai Bijak)
    text: "Iyo bana kawan, basamo mangko manjadi. Saling dukuang jo jalin silaturahmi nan arek salalu."
  },
  {
    fileName: 'bli_wayan.mp3',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    text: "Om Swastyastu semeton, dumogi rahayu sareng sami, ngiring lestariang seni lan budaya titiang."
  },
  {
    fileName: 'betawi_babe.mp3',
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie
    text: "Nah ini dia babe bilang, jangan pade mager tong, kudu rajin ikhtiar biar berkah hidup lu!"
  },
  {
    fileName: 'papua_pace.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
    text: "Kaka dong semua, mari kita bersatu bangun tanah air dengan hati yang damai dan sukacita besar!"
  },
  {
    fileName: 'sanggam.mp3',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    text: "Iya pang kawan, jaga selalu kebersamaan kita di bumi etam, mantapkan langkah demi kebaikan bersama."
  },
  {
    fileName: 'galuh.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    text: "Inggih pian barataan, ulun maingatakan gasan tatap manjaga karesikan wan karukunan banua kita."
  },
  {
    fileName: 'cak_mad.mp3',
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie
    text: "Tre-tani taretan sadaja! Kudu semangat, jujur lan tangguh madep masa depan sing padhang!"
  },
  {
    fileName: 'adek.mp3',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    text: "Elok budi menawan bahasa, marilah puan dan tuan kita bersama menjulang martabat tanah melayu."
  },
  {
    fileName: 'nyong.mp3',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
    text: "Sio katong basudara samua, mari gandeng tangan baku kele kalesang negeri dengan rasa cinta!"
  }
];

async function generateDialek(item) {
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
  console.log(`Membuat audio untuk ${DIALEK_PERSONAS.length} persona dialek daerah...`);
  for (const item of DIALEK_PERSONAS) {
    await generateDialek(item);
  }
  console.log('Semua persona dialek daerah berhasil di-generate!');
}

main();
