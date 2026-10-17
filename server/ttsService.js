// server/ttsService.js
// GENTRA Multi-Engine Audio Backend Service
// Mendukung 5 Engine Audio AI:
// 1. Google Gemini 3.8 Flash Neural TTS
// 2. ElevenLabs Multilingual v2 / Flash v2.5
// 3. Microsoft Azure Cognitive Services Speech Neural
// 4. Google Cloud Text-to-Speech (Neural2)
// 5. Voicebox Local AI Workstation (100% Offline)

import http from 'http';
import https from 'https';

// Utilitas PCM 16-bit 24kHz ke WAV Buffer
export function pcmToWav(pcmBuffer, sampleRate = 24000) {
  const wav = Buffer.alloc(44 + pcmBuffer.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcmBuffer.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // Mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  wav.writeUInt16LE(2, 32); // Block align
  wav.writeUInt16LE(16, 34); // Bits per sample
  wav.write('data', 36);
  wav.writeUInt32LE(pcmBuffer.length, 40);
  pcmBuffer.copy(wav, 44);
  return wav;
}

// 1. ENGINE GEMINI NEURAL TTS
export async function synthesizeGemini({ text, voice = 'Aoede', personaPrompt = '', speed = 1.0, dialect = 'sunda', apiKey = '' }) {
  const t0 = Date.now();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di backend (.env).');
  }

  const speedDesc = speed > 1.2 ? "tempo cepat dan dinamis" : speed < 0.8 ? "tempo tenang dan santai" : "tempo normal bersahaja";
  const dialectDesc = dialect === 'sunda' 
    ? "Gunakan cengkok dan intonasi khas Jawa Barat / Sunda yang luwes, hangat, ramah, dan manusiawi."
    : "Gunakan intonasi Bahasa Indonesia yang sangat alami, artikulatif, ramah, dan mengalir layaknya manusia sungguhan.";

  const prompt = `Sebagai pengisi suara ${voice}. ${personaPrompt ? personaPrompt + ' ' : ''}${dialectDesc} Bacakan teks ini dengan ${speedDesc}, tanpa nada robotik: "${text}"`;

  const models = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
  let lastErr = null;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || 'Aoede' }
              }
            }
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const rawB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!rawB64) throw new Error('Data audio kosong dari Gemini.');

      const pcmBuffer = Buffer.from(rawB64, 'base64');
      const wavBuffer = pcmToWav(pcmBuffer, 24000);
      const audioUrl = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;

      return {
        success: true,
        engine: 'gemini',
        name: 'Gemini 3.8 Flash Neural',
        provider: 'Google DeepMind',
        audioUrl,
        sampleRate: 24000,
        format: 'wav',
        latencyMs: Date.now() - t0,
        sizeBytes: wavBuffer.length,
        notes: 'Hyper-natural human prosody, emotional inflections, low latency.'
      };
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Gagal memproses audio via Gemini.');
}

// 2. ENGINE ELEVENLABS NEURAL TTS
export async function synthesizeElevenLabs({ text, voiceId = 'EXAVITQu4vr4xnSDxMaL', apiKey = '', modelId = 'eleven_multilingual_v2' }) {
  const t0 = Date.now();
  if (!apiKey) {
    return {
      success: false,
      engine: 'elevenlabs',
      name: 'ElevenLabs Multilingual v2',
      provider: 'ElevenLabs Inc.',
      isConfigured: false,
      error: 'ELEVENLABS_API_KEY belum diisi di file .env.',
      help: 'Dapatkan API Key di https://elevenlabs.io dan masukkan ke .env sebagai ELEVENLABS_API_KEY=...'
    };
  }

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: modelId,
        voice_settings: {
          stability: 0.50,
          similarity_boost: 0.80,
          style: 0.05,
          use_speaker_boost: true
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`ElevenLabs Error (${res.status}): ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioUrl = `data:audio/mpeg;base64,${buffer.toString('base64')}`;

    return {
      success: true,
      engine: 'elevenlabs',
      name: 'ElevenLabs Multilingual v2',
      provider: 'ElevenLabs Inc.',
      audioUrl,
      format: 'mp3',
      sampleRate: 44100,
      latencyMs: Date.now() - t0,
      sizeBytes: buffer.length,
      notes: 'Studio hyper-realistic timbre, rich breath dynamics, international standard.'
    };
  } catch (err) {
    return {
      success: false,
      engine: 'elevenlabs',
      name: 'ElevenLabs Multilingual v2',
      provider: 'ElevenLabs Inc.',
      isConfigured: true,
      error: err.message,
      latencyMs: Date.now() - t0
    };
  }
}

// 3. ENGINE MICROSOFT AZURE NEURAL TTS
export async function synthesizeAzure({ text, voice = 'id-ID-GadisNeural', apiKey = '', region = 'southeastasia' }) {
  const t0 = Date.now();
  if (!apiKey || !region) {
    return {
      success: false,
      engine: 'azure',
      name: 'Microsoft Azure Neural TTS',
      provider: 'Microsoft Cognitive Services',
      isConfigured: false,
      error: 'AZURE_SPEECH_KEY atau AZURE_SPEECH_REGION belum diisi di file .env.',
      help: 'Dapatkan key & region di Azure Portal dan masukkan ke .env: AZURE_SPEECH_KEY=... dan AZURE_SPEECH_REGION=...'
    };
  }

  try {
    const ssml = `<speak version='1.0' xml:lang='id-ID'><voice xml:lang='id-ID' name='${voice}'>${text}</voice></speak>`;
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
        'User-Agent': 'GentraJabarStudio'
      },
      body: ssml
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Azure Error (${res.status}): ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioUrl = `data:audio/wav;base64,${buffer.toString('base64')}`;

    return {
      success: true,
      engine: 'azure',
      name: `Azure Neural (${voice})`,
      provider: 'Microsoft Azure',
      audioUrl,
      format: 'wav',
      sampleRate: 24000,
      latencyMs: Date.now() - t0,
      sizeBytes: buffer.length,
      notes: 'Broadcast-grade Indonesian diction, standard government clarity.'
    };
  } catch (err) {
    return {
      success: false,
      engine: 'azure',
      name: 'Microsoft Azure Neural TTS',
      provider: 'Microsoft Azure',
      isConfigured: true,
      error: err.message,
      latencyMs: Date.now() - t0
    };
  }
}

// 4. ENGINE GOOGLE CLOUD TEXT-TO-SPEECH (NEURAL2)
export async function synthesizeGoogleCloud({ text, voice = 'id-ID-Neural2-A', apiKey = '' }) {
  const t0 = Date.now();
  if (!apiKey) {
    return {
      success: false,
      engine: 'google_cloud',
      name: 'Google Cloud Neural2',
      provider: 'Google Cloud Platform',
      isConfigured: false,
      error: 'GOOGLE_CLOUD_TTS_KEY belum diisi di file .env.',
      help: 'Dapatkan API key di Google Cloud Console dan masukkan ke .env sebagai GOOGLE_CLOUD_TTS_KEY=...'
    };
  }

  try {
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'id-ID',
          name: voice
        },
        audioConfig: {
          audioEncoding: 'LINEAR16',
          sampleRateHertz: 24000
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Cloud TTS Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const audioContent = data.audioContent;
    if (!audioContent) throw new Error('Audio content kosong dari Google Cloud TTS.');

    const pcmBuffer = Buffer.from(audioContent, 'base64');
    const wavBuffer = pcmToWav(pcmBuffer, 24000);
    const audioUrl = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;

    return {
      success: true,
      engine: 'google_cloud',
      name: `Google Cloud (${voice})`,
      provider: 'Google Cloud Platform',
      audioUrl,
      format: 'wav',
      sampleRate: 24000,
      latencyMs: Date.now() - t0,
      sizeBytes: wavBuffer.length,
      notes: 'Enterprise neural clarity, reliable public information announcements.'
    };
  } catch (err) {
    return {
      success: false,
      engine: 'google_cloud',
      name: 'Google Cloud Neural2',
      provider: 'Google Cloud Platform',
      isConfigured: true,
      error: err.message,
      latencyMs: Date.now() - t0
    };
  }
}

// 5. ENGINE VOICEBOX LOCAL WORKSTATION (KOKORO / OFFLINE)
export async function synthesizeVoicebox({ text, voice = 'Anita', speed = 1.0, port = 17493 }) {
  const t0 = Date.now();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice,
        speed,
        engine: 'kokoro'
      })
    });

    if (!res.ok) throw new Error(`Voicebox lokal merespons error ${res.status}`);

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioUrl = `data:audio/wav;base64,${buffer.toString('base64')}`;

    return {
      success: true,
      engine: 'voicebox',
      name: 'Voicebox Local Workstation',
      provider: 'DebPalash Open-Source (Kokoro)',
      audioUrl,
      format: 'wav',
      sampleRate: 24000,
      latencyMs: Date.now() - t0,
      sizeBytes: buffer.length,
      notes: '100% On-Premise Sovereign Privacy, zero external network transfer.'
    };
  } catch (err) {
    return {
      success: false,
      engine: 'voicebox',
      name: 'Voicebox Local Workstation',
      provider: 'DebPalash Open-Source (Kokoro)',
      isConfigured: false,
      error: `Daemon Voicebox port ${port} belum aktif di localhost.`,
      help: 'Jalankan Voicebox Desktop atau Voicebox Docker di port 17493 untuk mode lokal penuh.',
      latencyMs: Date.now() - t0
    };
  }
}

// 6. BENCHMARK COMPARISON DISPATCHER (Menguji Semua Engine Bersamaan)
export async function benchmarkAllEngines({ text, voiceConfig = {}, envKeys = {} }) {
  const promises = [
    // Engine 1: Gemini 3.8 Flash Neural
    synthesizeGemini({
      text,
      voice: voiceConfig.geminiVoice || 'Aoede',
      personaPrompt: voiceConfig.personaPrompt || '',
      speed: voiceConfig.speed || 1.0,
      dialect: voiceConfig.dialect || 'sunda',
      apiKey: envKeys.GEMINI_API_KEY
    }).catch(err => ({
      success: false,
      engine: 'gemini',
      name: 'Gemini 3.8 Flash Neural',
      provider: 'Google DeepMind',
      error: err.message
    })),

    // Engine 2: ElevenLabs Multilingual
    synthesizeElevenLabs({
      text,
      voiceId: voiceConfig.elevenVoiceId || 'EXAVITQu4vr4xnSDxMaL', // Sarah
      apiKey: envKeys.ELEVENLABS_API_KEY
    }),

    // Engine 3: Azure Speech Neural
    synthesizeAzure({
      text,
      voice: voiceConfig.azureVoice || 'id-ID-GadisNeural',
      apiKey: envKeys.AZURE_SPEECH_KEY,
      region: envKeys.AZURE_SPEECH_REGION || 'southeastasia'
    }),

    // Engine 4: Google Cloud Neural2
    synthesizeGoogleCloud({
      text,
      voice: voiceConfig.googleVoice || 'id-ID-Neural2-A',
      apiKey: envKeys.GOOGLE_CLOUD_TTS_KEY
    }),

    // Engine 5: Voicebox Local
    synthesizeVoicebox({
      text,
      voice: voiceConfig.voiceboxVoice || 'Anita',
      speed: voiceConfig.speed || 1.0,
      port: envKeys.VOICEBOX_PORT || 17493
    })
  ];

  const results = await Promise.all(promises);
  return results;
}
