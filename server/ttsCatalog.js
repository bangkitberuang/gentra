// server/ttsCatalog.js
// Katalog Persona Suara Modular per Engine AI
// Admin dapat dengan mudah mengubah `isHidden: true` untuk menyembunyikan karakter/engine dari backend!

export const ENGINE_CATALOG = [
  // ==========================================
  // 1. ENGINE GOOGLE GEMINI NEURAL TTS
  // ==========================================
  {
    id: 'gemini',
    name: 'Gemini 3.8 Flash Neural',
    provider: 'Google DeepMind',
    badge: 'Voice Natural & Logat Daerah',
    color: 'from-amber-500 to-emerald-600',
    isHidden: false,
    description: 'Model multimodal paling ekspresif dengan intonasi manusiawi, paralinguistik (ketawa/napas), dan dialek daerah Nusantara.',
    voices: [
      // Dialek Nusantara & Logat Daerah
      { id: 'teh_lilis', name: 'Teh Lilis (Sunda)', region: 'Jawa Barat', gender: 'Wanita', baseVoice: 'Kore', desc: 'Logat Sunda halus, ramah, dan berayun merdu.', speechPrompt: 'Berbicara dengan logat Sunda halus dan ramah. Nada lembut dan hangat. Kadang sisipkan kata "punten", "mangga", "nya".', isHidden: false },
      { id: 'mas_tejo', name: 'Mas Tejo (Jawa)', region: 'Jawa Tengah/Timur', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Logat Jawa medok, santun, intonasi tenang berwibawa.', speechPrompt: 'Berbicara dengan logat Jawa medok. Intonasi tenang, kalimat sedikit ditarik di akhir. Gunakan nuansa bahasa Jawa seperti "nggih", "monggo", "nuwun".', isHidden: false },
      { id: 'abang_ucok', name: 'Abang Ucok (Batak)', region: 'Sumatera Utara', gender: 'Pria', baseVoice: 'Charon', desc: 'Logat Batak tegas, lantang, lugas dan bervolume mantap.', speechPrompt: 'Berbicara dengan logat Batak yang kuat dan tegas. Nada lantang dan penuh energi. Kadang gunakan kata seperti "bah", "lae".', isHidden: false },
      { id: 'daeng_makassar', name: 'Daeng (Makassar)', region: 'Sulawesi Selatan', gender: 'Pria', baseVoice: 'Puck', desc: 'Logat Bugis/Makassar bersemangat, cepat dan dinamis.', speechPrompt: 'Berbicara dengan logat Bugis atau Makassar yang khas. Intonasi cepat dan bersemangat. Kadang sisipkan kata "ji", "ki", atau "ta".', isHidden: false },
      { id: 'uda_minang', name: 'Uda (Minang)', region: 'Sumatera Barat', gender: 'Pria', baseVoice: 'Zephyr', desc: 'Logat Minangkabau mengalun santai, bijak dan bersahabat.', speechPrompt: 'Berbicara dengan logat Minangkabau yang jelas. Ritme cepat dan tegas. Kadang gunakan kata "lah", "wak", atau "iyo".', isHidden: false },
      { id: 'bli_wayan', name: 'Bli Wayan (Bali)', region: 'Bali', gender: 'Pria', baseVoice: 'Charon', desc: 'Logat Bali tenang, damai, dan mengalir santun.', speechPrompt: 'Berbicara dengan logat Bali yang lembut dan damai. Ritme pelan dan santun. Kadang gunakan kata seperti "nggih", "tiang".', isHidden: false },
      { id: 'betawi_babe', name: 'Betawi Babe (Jakarta)', region: 'DKI Jakarta', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Logat Betawi ceplas-ceplos, akrab dan penuh kehangatan.', speechPrompt: 'Berbicara dengan logat Betawi asli Jakarta yang ceplas-ceplos, ramah, dan santai. Gunakan kata "nih", "deh", "babe".', isHidden: false },
      { id: 'papua_pace', name: 'Papua Pace (Papua)', region: 'Papua', gender: 'Pria', baseVoice: 'Charon', desc: 'Logat Indonesia Timur / Papua ceria dan berirama khas.', speechPrompt: 'Berbicara dengan logat Papua yang hangat, berirama naik turun bersahabat. Gunakan kata "kaka", "pace", "dong".', isHidden: false },
      { id: 'sanggam_berau', name: 'Sanggam (Berau)', region: 'Kalimantan Timur', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Logat Berau Kaltim santai namun tegas bersahabat.', speechPrompt: 'Berbicara dengan logat Kalimantan Timur khas Berau. Santai namun tegas. Kadang gunakan kata seperti "bah", "lah".', isHidden: false },
      { id: 'galuh_banjar', name: 'Galuh (Banjar)', region: 'Kalimantan Selatan', gender: 'Wanita', baseVoice: 'Kore', desc: 'Logat Banjar manis, ramah dan santun.', speechPrompt: 'Berbicara dengan logat Banjar yang manis dan mengalun ramah. Sisipkan kata "pian", "ulun", "lah".', isHidden: false },
      { id: 'cak_mad', name: 'Cak Mad (Madura)', region: 'Jawa Timur', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Logat Madura bersemangat, tegas dan blak-blakan bersahabat.', speechPrompt: 'Berbicara dengan logat Madura yang tegas, bervolume mantap dan lugas bersahabat.', isHidden: false },
      { id: 'adek_melayu', name: 'Adek (Melayu)', region: 'Riau/Kepri', gender: 'Wanita', baseVoice: 'Kore', desc: 'Logat Melayu pesisir santun, berirama mendayu elok.', speechPrompt: 'Berbicara dengan logat Melayu Riau yang santun, lemah lembut, dan bertutur kata elok bersahaja.', isHidden: false },
      { id: 'nyong_ambon', name: 'Nyong (Ambon)', region: 'Maluku', gender: 'Pria', baseVoice: 'Puck', desc: 'Logat Maluku / Ambon merdu, manis dan penuh kekeluargaan.', speechPrompt: 'Berbicara dengan logat Ambon Maluku yang ramah, manis berirama khas kepulauan. Gunakan kata "katong", "dong".', isHidden: false },

      // Karakter Utama Jabar & Nasional
      { id: 'anita', name: 'Anita', region: 'Nasional', gender: 'Wanita', baseVoice: 'Aoede', desc: 'Ramah & Ceria, presenter berita dan narasi umum.', speechPrompt: 'Berbicara dengan suara wanita ramah, ceria, dan artikulatif layaknya penyiar berita profesional.', isHidden: false },
      { id: 'agus', name: 'Agus', region: 'Nasional', gender: 'Pria', baseVoice: 'Charon', desc: 'Deep & Naratif, vokal berwibawa dokumenter.', speechPrompt: 'Berbicara dengan suara pria berat berwibawa, intonasi tenang untuk dokumenter.', isHidden: false },
      { id: 'siti', name: 'Siti', region: 'Nasional', gender: 'Wanita', baseVoice: 'Leda', desc: 'Lembut & Santun, pelayanan publik dan edukasi.', speechPrompt: 'Berbicara dengan intonasi lembut, penuh empati dan santun.', isHidden: false },
      { id: 'dewi', name: 'Dewi', region: 'Nasional', gender: 'Wanita', baseVoice: 'Despina', desc: 'Energik & Lugas, vokal siaran radio aktif.', speechPrompt: 'Berbicara dengan nada energik, ceria dan lugas.', isHidden: false },
      { id: 'tina', name: 'Tina', region: 'Nasional', gender: 'Wanita', baseVoice: 'Callirrhoe', desc: 'Profesional & Jelas, instruksi dan narasi korporat.', speechPrompt: 'Berbicara dengan artikulasi jernih, formal dan profesional.', isHidden: false },
      { id: 'maya', name: 'Maya', region: 'Nasional', gender: 'Wanita', baseVoice: 'Autonoe', desc: 'Inspiratif & Hangat, konten motivasi warga.', speechPrompt: 'Berbicara dengan nada inspiratif, hangat dan membangkitkan semangat.', isHidden: false },
      { id: 'rian', name: 'Rian', region: 'Nasional', gender: 'Pria', baseVoice: 'Puck', desc: 'Muda & Bersemangat, podcast dan medsos.', speechPrompt: 'Berbicara dengan vokal pemuda bersemangat, gaul dan komunikatif.', isHidden: false },
      { id: 'indah', name: 'Indah', region: 'Nasional', gender: 'Wanita', baseVoice: 'Erinome', desc: 'Halus & Menenangkan, meditatif dan panduan relaksasi.', speechPrompt: 'Berbicara dengan vokal sangat halus, menenangkan dan lembut.', isHidden: false },
      { id: 'gading', name: 'Gading', region: 'Nasional', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Berat & Maskulin, narasi trailer dan pengumuman tegas.', speechPrompt: 'Berbicara dengan vokal berat, dalam, maskulin dan tegas.', isHidden: false },
      { id: 'shinta', name: 'Shinta', region: 'Nasional', gender: 'Wanita', baseVoice: 'Laomedeia', desc: 'Tegas & Berani, himbauan disiplin dan hukum.', speechPrompt: 'Berbicara dengan vokal tegas, lugas, percaya diri dan berani.', isHidden: false },
      { id: 'bayu', name: 'Bayu', region: 'Nasional', gender: 'Pria', baseVoice: 'Orus', desc: 'Santai & Sejuk, dialog santai dan wisata.', speechPrompt: 'Berbicara dengan nada santai, sejuk, mengalir ramah.', isHidden: false },
      { id: 'adi', name: 'Adi', region: 'Nasional', gender: 'Pria', baseVoice: 'Algenib', desc: 'Ceria & Bersemangat, program hiburan dan anak.', speechPrompt: 'Berbicara ceria, penuh senyum dan antusiasme.', isHidden: false },
      { id: 'eko', name: 'Eko', region: 'Nasional', gender: 'Pria', baseVoice: 'Iapetus', desc: 'Serius & Edukatif, sains dan modul pelatihan.', speechPrompt: 'Berbicara dengan intonasi serius, edukatif dan kredibel.', isHidden: false },
      { id: 'laras', name: 'Laras', region: 'Nasional', gender: 'Wanita', baseVoice: 'Achernar', desc: 'Anggun & Elegan, seremonial dan kebudayaan.', speechPrompt: 'Berbicara dengan intonasi anggun, elegan, bertutur kata santun mulia.', isHidden: false },

      // Karakter Khas Sunda (Jawa Barat)
      { id: 'abah', name: 'Abah', region: 'Sunda', gender: 'Pria', baseVoice: 'Fenrir', desc: 'Sesepuh Sunda bijaksana, hangat dan menentramkan.', speechPrompt: 'Berbicara layaknya kakek/sesepuh Sunda yang bijaksana, suara berat berwibawa, tempo tenang bersahaja, vokal hangat khas kakek Priangan.', isHidden: false },
      { id: 'nini', name: 'Nini', region: 'Sunda', gender: 'Wanita', baseVoice: 'Erinome', desc: 'Nenek Sunda penuh kasih sayang, lembut & keibuan.', speechPrompt: 'Berbicara layaknya nenek Sunda yang penuh welas asih, suara lembut penuh kehangatan nenek sepuh, tutur kata mengayomi dan damai.', isHidden: false },
      { id: 'ujang', name: 'Ujang', region: 'Sunda', gender: 'Pria', baseVoice: 'Puck', desc: 'Pemuda Sunda lincah, ceria dan energik.', speechPrompt: 'Berbicara dengan semangat anak muda Sunda yang gaul, ceria, dan positif khas anak muda tanah Pasundan.', isHidden: false },
      { id: 'bibi_edah', name: 'Bibi (Ceu Edah)', region: 'Sunda', gender: 'Wanita', baseVoice: 'Despina', desc: 'Ibu-ibu Sunda heboh, guyub dan akrab.', speechPrompt: 'Berbicara layaknya ceu-ceu Sunda yang heboh, guyub, medok renyah dan penuh keakraban.', isHidden: false },
      { id: 'budak_eneng', name: 'Budak Leutik (Eneng)', region: 'Sunda', gender: 'Wanita', baseVoice: 'Aoede', desc: 'Anak Perempuan Sunda lugu, riang & menggemaskan.', speechPrompt: 'Berbicara dengan nada anak perempuan Sunda nada tinggi yang imut, polos, riang dan menggemaskan.', isHidden: false },
      { id: 'budak_ujang', name: 'Budak Leutik (Ujang Alit)', region: 'Sunda', gender: 'Pria', baseVoice: 'Algenib', desc: 'Anak Laki-laki Sunda aktif, riang & ceria.', speechPrompt: 'Berbicara dengan suara anak kecil laki-laki Sunda yang riang, polos, dan bersemangat.', isHidden: false },
      { id: 'teh_neng', name: 'Teh Neng', region: 'Sunda', gender: 'Wanita', baseVoice: 'Leda', desc: 'Mojang Priangan halus, santun dan merdu.', speechPrompt: 'Berbicara layaknya mojang Sunda dengan tutur kata halus, berayun lembut dan ramah.', isHidden: false },
      { id: 'kang_asep', name: 'Kang Asep', region: 'Sunda', gender: 'Pria', baseVoice: 'Orus', desc: 'Pria dewasa Sunda komunikatif dan bersahabat.', speechPrompt: 'Berbicara santai dan luwes layaknya akang Sunda yang ramah dan komunikatif.', isHidden: false }
    ]
  },

  // ==========================================
  // 2. ENGINE ELEVENLABS NEURAL TTS
  // ==========================================
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Multilingual v2',
    provider: 'ElevenLabs Inc.',
    badge: 'Studio Hyper-Realistic',
    color: 'from-purple-600 to-indigo-700',
    isHidden: false,
    description: 'Generative AI audio berstandar studio rekaman global dengan dinamika napas dan vokal manusia paling realistis di dunia.',
    voices: [
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita profesional, dewasa, menenangkan, artikulasi sangat elegan.', isHidden: false },
      { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', region: 'Studio Global', gender: 'Pria', desc: 'Vokal pria hangat, narator memikat, wibawa penyiaran publik.', isHidden: false },
      { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', region: 'Studio Global', gender: 'Pria', desc: 'Vokal pria deep, percaya diri, berenergi untuk narasi dokumenter.', isHidden: false },
      { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita jernih, komunikatif, edukator ramah.', isHidden: false },
      { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', region: 'Studio Global', gender: 'Pria', desc: 'Vokal pria muda, berkarakter serak khas, dinamis untuk medsos.', isHidden: false },
      { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', region: 'Studio Global', gender: 'Pria', desc: 'Vokal pria santai, kasual, resonansi dada alami.', isHidden: false },
      { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita antusias, ceria, sikap bersemangat.', isHidden: false },
      { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita profesional berbobot, cerdas dan informatif.', isHidden: false },
      { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita hangat, ceria, bersahabat.', isHidden: false },
      { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', region: 'Studio Global', gender: 'Pria', desc: 'Vokal pria halus, tenang, terpercaya.', isHidden: false },
      { id: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella', region: 'Studio Global', gender: 'Wanita', desc: 'Vokal wanita cerah, ramah, artikulatif.', isHidden: false }
    ]
  },

  // ==========================================
  // 3. ENGINE MICROSOFT AZURE NEURAL TTS
  // ==========================================
  {
    id: 'azure',
    name: 'Microsoft Azure Neural TTS',
    provider: 'Microsoft Cognitive Services',
    badge: 'Broadcast Government Standard',
    color: 'from-blue-600 to-cyan-700',
    isHidden: false,
    description: 'Standar penyiaran industri dan pemerintahan dengan artikulasi Bahasa Indonesia yang sangat presisi dan bersih.',
    voices: [
      { id: 'id-ID-GadisNeural', name: 'Gadis (id-ID)', region: 'Indonesia Resmi', gender: 'Wanita', desc: 'Standar penyiaran berita nasional, protokoler resmi pemerintahan.', isHidden: false },
      { id: 'id-ID-ArdiNeural', name: 'Ardi (id-ID)', region: 'Indonesia Resmi', gender: 'Pria', desc: 'Vokal pria otoritatif kedinasan, tegas, formal, dan jelas.', isHidden: false }
    ]
  },

  // ==========================================
  // 4. ENGINE GOOGLE CLOUD TEXT-TO-SPEECH
  // ==========================================
  {
    id: 'google_cloud',
    name: 'Google Cloud Neural2',
    provider: 'Google Cloud Platform',
    badge: 'Enterprise Neural',
    color: 'from-sky-500 to-blue-700',
    isHidden: false,
    description: 'Model sintesis suara korporat Google Cloud untuk pengumuman layanan informasi publik yang stabil.',
    voices: [
      { id: 'id-ID-Neural2-A', name: 'Neural2-A (Wanita)', region: 'Nasional', gender: 'Wanita', desc: 'Artikulasi jernih dan santun untuk customer service dan edukasi.', isHidden: false },
      { id: 'id-ID-Neural2-B', name: 'Neural2-B (Pria)', region: 'Nasional', gender: 'Pria', desc: 'Vokal pria netral, stabil untuk panduan informasi warga.', isHidden: false },
      { id: 'id-ID-Wavenet-A', name: 'Wavenet-A (Wanita)', region: 'Nasional', gender: 'Wanita', desc: 'Sintesis Wavenet jernih berirama halus.', isHidden: false },
      { id: 'id-ID-Wavenet-B', name: 'Wavenet-B (Pria)', region: 'Nasional', gender: 'Pria', desc: 'Sintesis Wavenet pria bernada hangat.', isHidden: false }
    ]
  },

  // ==========================================
  // 5. ENGINE VOICEBOX LOCAL AI WORKSTATION
  // ==========================================
  {
    id: 'voicebox',
    name: 'Voicebox Local Workstation',
    provider: 'DebPalash Open-Source (Kokoro)',
    badge: '100% Offline Sovereign Privacy',
    color: 'from-emerald-600 to-teal-800',
    isHidden: false,
    description: 'Engine AI lokal mandiri di localhost:17493. Data tidak pernah keluar dari server Jawa Barat.',
    voices: [
      { id: 'kokoro_female', name: 'Kokoro Wanita (Offline)', region: 'Lokal Workstation', gender: 'Wanita', desc: 'Model lokal 82M teroptimasi, bekerja tanpa internet.', isHidden: false },
      { id: 'kokoro_male', name: 'Kokoro Pria (Offline)', region: 'Lokal Workstation', gender: 'Pria', desc: 'Model lokal vokal pria mandiri di server daerah.', isHidden: false },
      { id: 'zero_shot_clone', name: 'Zero-Shot Clone Lokal', region: 'Lokal Kloning', gender: 'Kustom', desc: 'Kloning vokal referensi instan secara offline.', isHidden: false }
    ]
  }
];

// Helper: Ambil hanya engine dan persona yang tidak di-hide
export function getActiveCatalog() {
  return ENGINE_CATALOG
    .filter(engine => !engine.isHidden)
    .map(engine => ({
      ...engine,
      voices: engine.voices.filter(voice => !voice.isHidden)
    }));
}
