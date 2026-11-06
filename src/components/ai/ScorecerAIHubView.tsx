import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  Crosshair,
  Eye,
  KeyRound,
  Play,
  Radio,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { CommentaryLanguage } from '../../types/scorecer';

const PHONETIC_DICTIONARY_PREVIEW = [
  { raw: 'Szoboszlai', phonetic: 'so-BOS-lai', club: 'Liverpool / HUN' },
  { raw: 'Kvaratskhelia', phonetic: 'kva-rats-KHE-li-a', club: 'PSG / GEO' },
  { raw: 'Calafiori', phonetic: 'ka-la-FYO-ree', club: 'Arsenal / ITA' },
  { raw: 'Tchouaméni', phonetic: 'choo-ah-may-NEE', club: 'Real Madrid / FRA' },
];

const VOICE_SCRIPTS: Record<
  CommentaryLanguage,
  {
    label: string;
    langCode: string;
    tactical: string[];
    passionate: string[];
    neutral: string[];
  }
> = {
  en: {
    label: 'English',
    langCode: 'en-GB',
    tactical: [
      "67'  Arsenal overload the right half-space as Odegaard pins the pivot, allowing Saka to cut the ball back into Zone 14 for Havertz's first-time finish (0.64 xG).",
      "74'  Real Madrid shift into a direct 4-2-4 transition shape, increasing cross volume by 40%, but Rice drops between the center-backs to protect the box.",
    ],
    passionate: [
      "67'  THE ROOF JUST CAME OFF THE EMIRATES! Saka dances past his man, pulls it back, and Havertz buries it! Pure electricity under the floodlights!",
      "74'  Fingertips of steel from Raya! Madrid threw everything at that counter-attack and he clawed it out of the top corner!",
    ],
    neutral: [
      "67'  Goal for Arsenal. Well-worked combination down the right wing between Odegaard and Saka sets up Kai Havertz for a composed finish inside the box.",
      "74'  Crucial save by David Raya to deny Vinicius Junior following a rapid Real Madrid breakaway.",
    ],
  },
  fr: {
    label: 'Français',
    langCode: 'fr-FR',
    tactical: [
      "67'  Arsenal surcharge le demi-espace droit : Odegaard fixe le double pivot et libère Saka pour un centre en retrait repris instantanément par Havertz (0.64 xG).",
      "74'  Le Real Madrid passe en 4-2-4 direct, augmentant sa fréquence de centres de 40%, mais Rice décroche entre ses centraux pour verrouiller l'axe.",
    ],
    passionate: [
      "67'  LE STADE EXPLOSE ! Quel travail de Saka sur son aile qui sert Havertz sur un plateau ! Une ambiance de folie sous les projecteurs !",
      "74'  QUEL ARRÊT DE RAYA ! Du bout des gants en pleine lucarne sur ce contre éclair madrilène !",
    ],
    neutral: [
      "67'  But pour Arsenal. Belle combinaison côté droit conclue de près par Kai Havertz sur une passe décisive de Bukayo Saka.",
      "74'  Parade décisive de David Raya qui détourne en corner une frappe enroulée de Vinicius Junior.",
    ],
  },
  es: {
    label: 'Español',
    langCode: 'es-ES',
    tactical: [
      "67'  Sobrecarga de Arsenal en el carril interior derecho: Odegaard fija al pivote y Saka asiste atrás para la definición de primera de Havertz (0.64 xG).",
      "74'  El Real Madrid pasa a un 4-2-4 directo en transición, pero Rice baja entre los centrales para cerrar el área.",
    ],
    passionate: [
      "67'  ¡GOLAZO EN LONDRES! ¡Desborde eléctrico de Saka y definición letal de Havertz para hacer vibrar todo el estadio!",
      "74'  ¡PARADÓN MONUMENTAL DE RAYA! ¡Vuela al ángulo para salvar a su equipo en el momento clave!",
    ],
    neutral: [
      "67'  Gol del Arsenal. Gran jugada colectiva por la banda derecha que culmina Kai Havertz dentro del área.",
      "74'  Gran intervención de David Raya para evitar el empate tras el contraataque del Real Madrid.",
    ],
  },
  de: {
    label: 'Deutsch',
    langCode: 'de-DE',
    tactical: [
      "67'  Überladung im rechten Halbraum: Odegaard bindet die Doppelsechs, Saka legt zurück und Havertz vollendet direkt (0.64 xG).",
      "74'  Real Madrid stellt auf ein direktes 4-2-4 um, doch Rice kippt zwischen die Innenverteidiger ab.",
    ],
    passionate: [
      "67'  TOR FÜR ARSENAL! Kai Havertz hämmert den Ball nach perfekter Vorarbeit von Saka ins Netz — das Stadion bebt!",
      "74'  WELTKLASSE-PARADE VON RAYA! Mit den Fingerspitzen lenkt er den Schuss noch über die Latte!",
    ],
    neutral: [
      "67'  Tor für Arsenal durch Kai Havertz nach schöner Kombination über die rechte Seite.",
      "74'  Starke Parade von David Raya gegen den schnellen Konter von Real Madrid.",
    ],
  },
  ja: {
    label: '日本語',
    langCode: 'ja-JP',
    tactical: [
      "67'  右ハーフスペースのオーバーロードからサカが折り返し、ハフェルツがダイレクトで合わせました（0.64 xG）。",
      "74'  レアル・マドリードは4-2-4へシフトしましたが、ライスが最終ラインに落ちて中央を封鎖しています。",
    ],
    passionate: [
      "67'  ゴール！！サカの突破からハフェルツが豪快に決めた！スタジアムが大歓声に包まれています！",
      "74'  ラヤのスーパーセーブ！絶体絶命のカウンターを指先ひとつで防ぎました！",
    ],
    neutral: [
      "67'  アーセナルが追加点。右サイドの崩しからハフェルツが冷静に流し込みました。",
      "74'  レアル・マドリードの鋭いカウンターをラヤが好セーブでしのぎます。",
    ],
  },
  ar: {
    label: 'العربية',
    langCode: 'ar-SA',
    tactical: [
      "67'  كثافة عددية في المساحة النصفية اليمنى، ساكا يمرر عرضية أرضية رائعة وهافيرتز يحولها في الشباك (0.64 xG).",
      "74'  تحول ريال مدريد إلى خطة 4-2-4 الهجومية، مع تراجع رايس لتأمين العمق الدفاعي.",
    ],
    passionate: [
      "67'  هدف رائع في ملعب الإمارات! ساكا يصنع الفارق وهافيرتز يطلق رصاصة الرحمة وسط جنون الجماهير!",
      "74'  تصدي إعجازي من ديفيد رايا! بأطراف أصابعه ينقذ مرماه من هدف محقق!",
    ],
    neutral: [
      "67'  هدف لصالح أرسنال عن طريق كاي هافيرتز بعد تمريرة متقنة من بوكايو ساكا.",
      "74'  تألق الحارس ديفيد رايا في إبعاد تسديدة فينيسيوس جونيور الخطيرة.",
    ],
  },
  pt: {
    label: 'Português',
    langCode: 'pt-BR',
    tactical: [
      "67'  Sobrecarga no meio-espaço direito com Odegaard e Saka servindo Havertz para finalizar de primeira (0.64 xG).",
      "74'  Real Madrid muda para o 4-2-4, mas Declan Rice recua entre os zagueiros para proteger a área.",
    ],
    passionate: [
      "67'  GOLAÇO NO EMIRATES! Saka entorta a marcação e rola para Havertz estufar a rede!",
      "74'  DEFESAÇA DE RAYA! No último milímetro ele salva o empate no contra-ataque!",
    ],
    neutral: [
      "67'  Gol do Arsenal. Boa trama pelo lado direito concluída com precisão por Kai Havertz.",
      "74'  Grande defesa de David Raya após contra-ataque veloz do Real Madrid.",
    ],
  },
};

export const ScorecerAIHubView: React.FC = () => {
  const {
    uiLanguage,
    activeMatch,
    aiChatMessages,
    sendAIChatMessage,
    aiHighlights,
    shareWidgetToSquad,
    simulateLiveGoalOrShift,
    setActiveTab,
    triggerToast,
    liveRagSnapshot,
    isAiStreaming,
    pureTacticalMode,
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  // Conversational Assistant state
  const [query, setQuery] = useState<string>('');
  const [showApiKeyBox, setShowApiKeyBox] = useState<boolean>(false);
  const [showRagInspector, setShowRagInspector] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [expandedRagMsgId, setExpandedRagMsgId] = useState<string | null>(null);

  // Cartesia Sonic-3.6 Commentary Persona Studio state
  const [persona, setPersona] = useState<'tactical' | 'passionate' | 'neutral'>(
    'tactical'
  );
  const [voiceLang, setVoiceLang] = useState<CommentaryLanguage>(
    isFr ? 'fr' : 'en'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(3);
  const [showPhoneticDict, setShowPhoneticDict] = useState<boolean>(true);
  const [ephemeralTokenSeconds, setEphemeralTokenSeconds] = useState<number>(54);
  const [ttfaMs, setTtfaMs] = useState<number>(89.4);

  // Story Format & CV Smart-Crop Overlay state
  const [storyMode, setStoryMode] = useState<'vertical' | 'square' | 'widescreen'>(
    'vertical'
  );
  const [selectedClipIdx, setSelectedClipIdx] = useState<number>(0);
  const [showCvOverlay, setShowCvOverlay] = useState<boolean>(true);

  // Animate Cartesia Sonic-3.6 word_timestamps read-along highlight in Electric Cyan (#00D4FF)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % 24);
    }, isSpeaking ? 260 : 650);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Dynamic 60-second ephemeral token countdown rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setEphemeralTokenSeconds((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic TTFA latency sampling during speech
  useEffect(() => {
    if (!isSpeaking) return;
    const ttfaTimer = setInterval(() => {
      setTtfaMs(Number((88.0 + Math.random() * 5.4).toFixed(1)));
    }, 2200);
    return () => clearInterval(ttfaTimer);
  }, [isSpeaking]);

  const dynamicContextId = `ctx_sonic3_${persona}_${voiceLang}_${activeMatch.id.replace(/-/g, '_')}`;

  const handleAsk = async (customPrompt?: string) => {
    const text = (customPrompt ?? query).trim();
    if (!text) return;
    setQuery('');
    await sendAIChatMessage(text, geminiKey);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      triggerToast(
        isFr ? 'Lecture vocale IA activée' : 'Cartesia Sonic-3.6 synthesis started'
      );
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const pack = VOICE_SCRIPTS[voiceLang] || VOICE_SCRIPTS.en;
    const textToSpeak = pack[persona].join(' ').replace(/\d+'/g, '');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = pack.langCode;
    utterance.rate = persona === 'passionate' ? 1.12 : 1.0;
    utterance.pitch = persona === 'passionate' ? 1.15 : 0.98;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clipPosters = [
    '/images/highlight-goal.jpg',
    '/images/highlight-save.jpg',
    '/images/tactical-pitch.jpg',
    '/images/hero-goalnet.jpg',
  ];

  const currentScriptPack = VOICE_SCRIPTS[voiceLang] || VOICE_SCRIPTS.en;
  const isEnglishSelected = voiceLang === 'en';

  return (
    <div className="bg-[#050D08] text-slate-100">
      {/* =====================================================================
          HERO BANNER — SCORECER AI STUDIO
      ===================================================================== */}
      <section className="relative border-b border-[#162B1E] overflow-hidden py-16 lg:py-24 px-6">
        <img
          src="/images/wet-turf.jpg"
          alt="Floodlit wet stadium pitch"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D08] via-[#050D08]/80 to-[#050D08]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? 'STUDIO IA SCORECER' : 'SCORECER AI & MEDIA PIPELINE'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Une intelligence qui ressent le match.'
                : 'Intelligence that feels the match.'}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {isFr
                ? 'Assistant RAG ancré dans la télémétrie des 30 dernières secondes, synthèse vocale Cartesia Sonic-3.6 (<90ms TTFA) et découpage vidéo CV YOLOv8-medium.'
                : '30-second sliding-window RAG Match Assistant, Cartesia Sonic-3.6 WebSocket Audio (<90ms TTFA), and automated YOLOv8-medium + TransNetV2 9:16 / 1:1 / 16:9 Smart-Crop Highlights.'}
            </p>
          </div>

          <div className="bg-[#08140C]/90 backdrop-blur-md border border-[#1E3B28] rounded-xl p-4 flex items-center gap-5 self-start lg:self-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF01] tabular-nums">
                <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                <span>
                  {isFr ? 'CONNECTÉ AU MATCH' : 'GROUNDED IN LIVE MATCH'} ·{' '}
                  {activeMatch.minute}&apos;
                </span>
              </div>
              <div className="font-wide font-bold text-base text-white mt-1 tabular-nums">
                {activeMatch.homeTeam} {activeMatch.homeScore} —{' '}
                {activeMatch.awayScore} {activeMatch.awayTeam}
              </div>
            </div>
            <button
              onClick={() => simulateLiveGoalOrShift('goal')}
              className="px-3.5 py-2 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-xs cursor-pointer shrink-0"
            >
              {isFr ? '+ Simuler une action' : '+ Trigger live moment'}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01 · AI MATCH ASSISTANT — "Ask the pitch anything."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Editorial Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '01 · ASSISTANT DE MATCH RAG' : '01 · TELEMETRY-GROUNDED AI ASSISTANT'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Demandez tout au terrain.'
                : 'Ask the pitch anything.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Chaque réponse est strictement ancrée dans la fenêtre télémétrique des 30 dernières secondes (PPDA, Field Tilt, xG, passes progressives) avec schéma tactique miniature et extrait vidéo.'
                : 'Every answer is strictly grounded in the live 30-second sliding telemetry window (PPDA, Field Tilt, xG, progressive passes) and includes an interactive Mini Tactical Pitch Diagram + Smart-Crop Highlight.'}
            </p>

            {/* Quick Football Questions */}
            <div className="space-y-3 pt-2">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                {isFr ? 'Questions rapides :' : 'Try asking:'}
              </p>
              {(isFr
                ? [
                    'Pourquoi Arsenal a-t-il reculé entre la 70e et la 75e minute ?',
                    'Comment Saka et Odegaard créent-ils le décalage à droite ?',
                    'Quel est l’impact du passage en 4-2-4 du Real Madrid ?',
                  ]
                : [
                    'Why did the home team lose momentum between 70’ and 75’?',
                    'How are Saka and Odegaard creating the overload on the right?',
                    'What changed after Real Madrid switched to a 4-2-4?',
                  ]
              ).map((qText) => (
                <button
                  key={qText}
                  onClick={() => handleAsk(qText)}
                  className="w-full text-left flex items-center gap-3.5 py-1.5 text-sm text-slate-200 hover:text-[#B8FF01] transition-colors cursor-pointer group"
                >
                  <span className="w-[3px] h-5 bg-[#B8FF01] rounded-full shrink-0 group-hover:scale-y-125 transition-transform" />
                  <span>{qText}</span>
                </button>
              ))}
            </div>

            {/* Optional Gemini API Key Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowApiKeyBox(!showApiKeyBox)}
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#B8FF01] cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {isFr
                    ? 'Clé API Gemini en direct (optionnel)'
                    : 'Connect live Gemini API key (optional)'}
                </span>
              </button>
              {showApiKeyBox && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#08140C] border border-[#162B1E]">
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder={
                      isFr
                        ? 'Collez votre clé Gemini API (sinon le moteur live intégré répond)...'
                        : 'Paste Gemini API key (falls back to built-in match engine)...'
                    }
                    className="w-full bg-[#050D08] border border-[#1A3324] rounded px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Grounded Conversation Card (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#162B1E] pb-4">
              <div>
                <h3 className="font-display font-semibold text-base text-white">
                  {isFr ? 'Assistant Match Scorecer (RAG 30s Live)' : 'Scorecer Match Assistant (30s Sliding-Window RAG)'}
                </h3>
                <p className="text-xs text-slate-400 tabular-nums">
                  {activeMatch.homeTeam} vs {activeMatch.awayTeam} ·{' '}
                  {isFr
                    ? `Contexte RAG : ~${liveRagSnapshot.tokenEstimate} jetons télémétriques`
                    : `RAG Context: ~${liveRagSnapshot.tokenEstimate} telemetry tokens grounded`}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowRagInspector(!showRagInspector)}
                  className="px-2.5 py-1 rounded-md bg-[#050D08] border border-[#1E3B29] hover:border-[#B8FF01]/50 font-mono text-[11px] text-[#B8FF01] cursor-pointer"
                >
                  {showRagInspector
                    ? isFr
                      ? 'Masquer Fenêtre RAG'
                      : 'Hide Global RAG Window'
                    : isFr
                    ? 'Inspecter Fenêtre RAG'
                    : 'Inspect Global RAG Window'}
                </button>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#B8FF01]">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                  {isAiStreaming ? 'STREAMING...' : isFr ? 'EN DIRECT' : 'LIVE'}
                </span>
              </div>
            </div>

            {showRagInspector && (
              <div className="rounded-lg bg-[#050D08] border border-[#1E3B29] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#B8FF01]">
                  <span>LIVE 30-SECOND MATCH RAG GROUNDING WINDOW</span>
                  <span>{liveRagSnapshot.formations} · {liveRagSnapshot.xgSummary}</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {liveRagSnapshot.serializedPromptContext}
                </pre>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {aiChatMessages.map((msg, idx) =>
                msg.sender === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="px-4 py-2.5 rounded-lg bg-[#12261A] border border-[#1F3B2A] text-sm text-white max-w-md">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start">
                    <div className="p-4 rounded-xl bg-[#0B1B11] border border-[#193122] max-w-2xl w-full space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01] tabular-nums">
                          SCORECER AI · {msg.timestamp}
                        </span>
                        {/* Step 5: Collapsible "View Live RAG Telemetry Context" Pill */}
                        <button
                          onClick={() =>
                            setExpandedRagMsgId(expandedRagMsgId === msg.id ? null : msg.id)
                          }
                          className="px-2.5 py-0.5 rounded-full bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 border border-[#00D4FF]/40 text-[#00D4FF] font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>
                            {expandedRagMsgId === msg.id
                              ? 'Hide Live RAG Telemetry Context'
                              : 'View Live RAG Telemetry Context'}
                          </span>
                        </button>
                      </div>

                      {/* Collapsible Per-Message RAG Telemetry JSON Payload */}
                      {expandedRagMsgId === msg.id && (
                        <div className="p-3 rounded-lg bg-[#050D08] border border-[#00D4FF]/30 space-y-1">
                          <div className="text-[10px] font-mono text-[#00D4FF] uppercase">
                            30-Second Sliding-Window Telemetry JSON Injected into Prompt:
                          </div>
                          <pre className="text-[11px] font-mono text-[#00F59B] overflow-x-auto leading-relaxed">
                            {typeof msg.ragSnapshotPayload === 'string'
                              ? msg.ragSnapshotPayload
                              : JSON.stringify(
                                  msg.ragSnapshotPayload || {
                                    matchId: activeMatch.id,
                                    window: '74:00-74:30',
                                    ppda: `${activeMatch.homePPDA} vs ${activeMatch.awayPPDA}`,
                                    fieldTiltHomePct: activeMatch.fieldTiltHome ?? 64,
                                  },
                                  null,
                                  2
                                )}
                          </pre>
                        </div>
                      )}

                      <p className="text-sm text-slate-200 leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Citations */}
                      {msg.telemetryCitations && msg.telemetryCitations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.telemetryCitations.map((cit) => (
                            <span
                              key={cit}
                              className="px-2 py-0.5 rounded bg-[#050D08] border border-[#1E3B29] text-[10px] font-mono text-slate-300"
                            >
                              ✓ {cit}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Step 5: Embedded Mini Tactical Pitch Diagram + Smart-Crop Video Highlight Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Mini Tactical Pitch Diagram SVG */}
                        <div className="rounded-lg border border-[#1F3B2A] bg-[#050D08] p-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#00F59B]">
                            <span>MINI TACTICAL PITCH DIAGRAM</span>
                            <span className="uppercase">{msg.tacticalDiagramType || 'overload-right'}</span>
                          </div>
                          <svg viewBox="0 0 100 56" className="w-full h-20 rounded bg-[#08140C] border border-[#162B1E]">
                            <rect x="2" y="2" width="96" height="52" fill="none" stroke="#1E3B28" strokeWidth="0.6" />
                            <line x1="50" y1="2" x2="50" y2="54" stroke="#1E3B28" strokeWidth="0.6" />
                            <circle cx="50" cy="28" r="7" fill="none" stroke="#1E3B28" strokeWidth="0.6" />
                            {/* Tactical Zone Highlight */}
                            <rect
                              x="66"
                              y="30"
                              width="24"
                              height="18"
                              rx="2"
                              fill="#00F59B"
                              fillOpacity="0.18"
                              stroke="#00F59B"
                              strokeDasharray="1.5 1"
                              strokeWidth="0.6"
                            />
                            {/* Key Vectors */}
                            <line x1="68" y1="36" x2="84" y2="42" stroke="#00F59B" strokeWidth="1.2" />
                            <line x1="84" y1="42" x2="88" y2="28" stroke="#00D4FF" strokeWidth="1.2" />
                            <circle cx="68" cy="36" r="2.2" fill="#B8FF01" />
                            <circle cx="84" cy="42" r="2.2" fill="#B8FF01" />
                            <circle cx="88" cy="28" r="2.4" fill="#00D4FF" />
                          </svg>
                        </div>

                        {/* Clickable Smart-Crop Video Highlight Card */}
                        {msg.embeddedClipId && (
                          <div
                            onClick={() => {
                              const foundIdx = aiHighlights.findIndex((c) => c.id === msg.embeddedClipId);
                              if (foundIdx >= 0) setSelectedClipIdx(foundIdx);
                              const target = document.getElementById('section-highlights');
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="rounded-lg overflow-hidden border border-[#1F3B2A] hover:border-[#B8FF01] bg-[#050D08] flex items-center gap-3 p-2.5 cursor-pointer transition-all"
                          >
                            <img
                              src={clipPosters[idx % clipPosters.length]}
                              alt="Match clip proof"
                              className="w-20 h-16 object-cover rounded shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="font-mono text-[10px] text-[#B8FF01] uppercase block">
                                {isFr ? 'EXTRAIT YOLOV8 9:16' : '9:16 SMART-CROP CLIP'}
                              </span>
                              <p className="text-xs font-medium text-white line-clamp-2">
                                {aiHighlights.find((c) => c.id === msg.embeddedClipId)
                                  ?.title || '67’ Saka cutback & Havertz volley'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2.5 pt-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Posez votre question sur le match en cours...'
                    : 'Ask about momentum, formations, or any player...'
                }
                className="flex-1 bg-[#050D08] border border-[#1A3324] focus:border-[#B8FF01] rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#B8FF01] hover:bg-[#c8ff38] text-[#050D08] font-semibold text-sm transition-colors cursor-pointer"
              >
                {isFr ? 'Envoyer' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02 · CARTESIA SONIC-3.6 AUDIO STUDIO & 6-LANGUAGE LOCALIZATION ENGINE
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Interactive Cartesia Sonic-3.6 Studio Card (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden">
            {/* Cartesia Sonic-3.6 WebSocket Telemetry Bar */}
            <div className="px-6 py-3 bg-[#050D08] border-b border-[#162B1E] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-[#00D4FF]">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-bold">wss://api.cartesia.ai/tts/websocket</span>
                <span className="px-2 py-0.5 rounded bg-[#00F59B]/15 text-[#00F59B] tabular-nums">
                  TTFA: {ttfaMs}ms (&lt;90ms SSM)
                </span>
                <span className="px-2 py-0.5 rounded bg-[#00D4FF]/15 text-[#00D4FF] tabular-nums flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                  JWT: {ephemeralTokenSeconds}s
                </span>
              </div>
              <div className="text-slate-400 tabular-nums">
                context_id: <span className="text-white font-mono">{dynamicContextId}</span> • word_timestamps: true
              </div>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-3 border-b border-[#162B1E] text-xs font-mono uppercase tracking-wider">
              {(
                [
                  { id: 'tactical', label: isFr ? 'ANALYSTE TACTIQUE' : 'TACTICAL ANALYST' },
                  { id: 'passionate', label: isFr ? 'SUPPORTER PASSIONNÉ' : 'DIE-HARD SUPPORTER' },
                  { id: 'neutral', label: isFr ? 'DIFFUSEUR NEUTRE' : 'NEUTRAL BROADCASTER' },
                ] as const
              ).map((tab) => {
                const active = persona === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPersona(tab.id)}
                    className={`py-4 text-center transition-colors cursor-pointer relative ${
                      active
                        ? 'text-[#B8FF01] font-semibold bg-[#0B1A11]/70'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8FF01]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Language Pills (EN, FR, ES, DE, AR, PT-BR) + Hear Voice Button */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['en', 'es', 'ja', 'fr', 'de', 'ar', 'pt'] as CommentaryLanguage[]).map(
                    (code) => (
                      <button
                        key={code}
                        onClick={() => setVoiceLang(code)}
                        className={`px-3 py-1 rounded-md text-xs font-mono uppercase cursor-pointer transition-colors ${
                          voiceLang === code
                            ? 'bg-[#B8FF01] text-[#050D08] font-bold'
                            : 'bg-[#050D08] text-slate-400 border border-[#162B1E] hover:text-white'
                        }`}
                      >
                        {code === 'pt' ? 'PT-BR' : code.toUpperCase()} ({VOICE_SCRIPTS[code].label})
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleSpeak}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    isSpeaking
                      ? 'bg-[#B8FF01] text-[#050D08]'
                      : 'bg-[#112418] text-[#B8FF01] border border-[#234530] hover:bg-[#162F20]'
                  }`}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <span>
                    {isSpeaking
                      ? isFr
                        ? 'Arrêter Sonic-3.6'
                        : 'Stop Sonic-3.6 Stream'
                      : isFr
                      ? 'Écouter Cartesia Sonic-3.6'
                      : 'Stream Cartesia Sonic-3.6'}
                  </span>
                </button>
              </div>

              {/* Step 5: 6-Language Localization Rule Status Banner */}
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex flex-wrap items-center justify-between gap-2 ${
                  isEnglishSelected
                    ? 'bg-[#00F59B]/10 border-[#00F59B]/30 text-[#00F59B]'
                    : 'bg-[#00D4FF]/10 border-[#00D4FF]/30 text-[#00D4FF]'
                }`}
              >
                <div>
                  {isEnglishSelected
                    ? '✓ EN Localization Mode: Full Emotion Override Flags + Native [laughter] & [sigh] Paralinguistic Tags Active'
                    : `🛡️ Non-EN Localization Safeguard (${voiceLang.toUpperCase()}): Experimental English-Only Emotion Flags Auto-Disabled — Using Native Acoustic Conditioning + SSML <speed> & <volume>`}
                </div>
              </div>

              {/* Commentary Lines with Electric Cyan (#00D4FF) word_timestamps Read-Along */}
              <div className="space-y-4 pt-1">
                {currentScriptPack[persona].map((line, i) => {
                  const min = line.slice(0, 3);
                  const paralinguisticPrefix =
                    persona === 'passionate'
                      ? i === 0
                        ? '[laughter] '
                        : '[sigh] '
                      : '';
                  const bodyWords = `${paralinguisticPrefix}${line.slice(3).trim()}`.split(' ');
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg bg-[#050D08] border border-[#162B1E]"
                    >
                      <span className="font-mono text-xs font-bold text-[#B8FF01] pt-0.5 tabular-nums">
                        {min}
                      </span>
                      <p className="text-sm leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                        {bodyWords.map((word, wIdx) => {
                          const isWordActive = i === 0 && wIdx === activeWordIndex % bodyWords.length;
                          const isTag = word === '[laughter]' || word === '[sigh]';
                          return (
                            <span
                              key={`${i}-${wIdx}`}
                              className={`transition-colors duration-150 rounded px-0.5 ${
                                isWordActive
                                  ? 'bg-[#00D4FF]/25 text-[#00D4FF] font-bold underline decoration-[#00D4FF]'
                                  : isTag
                                  ? 'font-mono text-xs text-[#FFB800] bg-[#FFB800]/10 px-1.5 rounded'
                                  : 'text-slate-200'
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Step 5: Custom Phonetic Pronunciation Dictionary (pronunciation_dict_id) */}
              <div className="rounded-xl bg-[#050D08] border border-[#1E3B29] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B8FF01]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      Custom Phonetic Dictionary (<code className="text-[#00D4FF]">pronunciation_dict_id: dict_uefa_2026</code>)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPhoneticDict(!showPhoneticDict)}
                    className="text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPhoneticDict ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {showPhoneticDict && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {PHONETIC_DICTIONARY_PREVIEW.map((entry) => (
                      <div
                        key={entry.raw}
                        className="p-2.5 rounded-lg bg-[#08140C] border border-[#162B1E] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-white font-bold">&quot;{entry.raw}&quot;</span>
                          <span className="text-slate-500 mx-1.5">→</span>
                          <span className="text-[#00F59B]">&quot;{entry.phonetic}&quot;</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{entry.club}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Editorial Explanation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '02 · CARTESIA SONIC-3.6 SSM' : '02 · CARTESIA SONIC-3.6 SSM AUDIO'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Même match. Autre voix. <90ms.'
                : 'Sub-90ms State Space Model Voice.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Propulsé par l’architecture State Space Model (SSM) de Cartesia Sonic-3.6, Scorecer diffuse des commentaires en direct avec alignement mot à mot en cyan électrique (#00D4FF) et dictionnaire phonétique UEFA.'
                : 'Powered by Cartesia Sonic-3.6 State Space Model (SSM) architecture over persistent WebSockets, Scorecer streams live commentary with Electric Cyan (#00D4FF) word-level read-along timestamps and UEFA phonetic overrides.'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          03 · AUTOMATED 9:16 / 1:1 / 16:9 SMART-CROP COMPUTER VISION PIPELINE
      ===================================================================== */}
      <section id="section-highlights" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr
                  ? '03 · PIPELINE VISION PAR ORDINATEUR (YOLOV8 + TRANSNETV2)'
                  : '03 · AUTOMATED CV SMART-CROP PIPELINE (YOLOV8-MEDIUM + TRANSNETV2)'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Découpées au son de la clameur du stade.'
                  : 'Stories cut from the roar of the stadium.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                {isFr
                  ? 'TransNetV2 détecte les coupures de caméra, YOLOv8-medium suit le ballon avec rejet des valeurs aberrantes (Z-Score / IQR) et interpolation linéaire d’occlusion.'
                  : 'TransNetV2 detects shot boundaries while YOLOv8-medium tracks the ball POI with Z-Score / Modified Z-Score / IQR outlier rejection and linear occlusion interpolation.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start">
              {/* Toggle CV Smart-Crop Vision Overlay */}
              <button
                onClick={() => setShowCvOverlay(!showCvOverlay)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  showCvOverlay
                    ? 'bg-[#00F59B]/20 border-[#00F59B] text-[#00F59B]'
                    : 'bg-[#08140C] border-[#162B1E] text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {showCvOverlay ? 'CV Smart-Crop Overlay: ON' : 'CV Smart-Crop Overlay: OFF'}
                </span>
              </button>

              {/* Aspect Ratio Switcher: 9:16 Vertical / 1:1 Square / 16:9 Broadcast */}
              <div className="inline-flex rounded-lg bg-[#08140C] border border-[#162B1E] p-1 text-xs font-mono">
                <button
                  onClick={() => setStoryMode('vertical')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    storyMode === 'vertical'
                      ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  9:16 Story
                </button>
                <button
                  onClick={() => setStoryMode('square')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    storyMode === 'square'
                      ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1:1 Square
                </button>
                <button
                  onClick={() => setStoryMode('widescreen')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    storyMode === 'widescreen'
                      ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  16:9 Broadcast
                </button>
              </div>
            </div>
          </div>

          {/* CV Pipeline Telemetry Readout Strip */}
          {showCvOverlay && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#08140C] border border-[#162B1E]">
                <div className="text-[10px] text-slate-400">1. SHOT BOUNDARY DETECTION</div>
                <div className="text-[#00F59B] font-bold mt-0.5">TransNetV2 Scene Cut Guard</div>
                <div className="text-[10px] text-slate-400">Prevents cross-cut pan artifacts</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08140C] border border-[#162B1E]">
                <div className="text-[10px] text-slate-400">2. POINT-OF-INTEREST DETECTOR</div>
                <div className="text-[#00D4FF] font-bold mt-0.5">YOLOv8-medium Ball + Player</div>
                <div className="text-[10px] text-slate-400">Confidence: 99.4% @ 60fps</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08140C] border border-[#162B1E]">
                <div className="text-[10px] text-slate-400">3. OUTLIER REJECTION</div>
                <div className="text-[#FFB800] font-bold mt-0.5">Z-Score / Mod Z / IQR Filter</div>
                <div className="text-[10px] text-slate-400">2 Sideline False Positives Rejected</div>
              </div>
              <div className="p-3 rounded-xl bg-[#08140C] border border-[#162B1E]">
                <div className="text-[10px] text-slate-400">4. OCCLUSION HANDLING</div>
                <div className="text-white font-bold mt-0.5">Linear Trajectory Interpolation</div>
                <div className="text-[10px] text-slate-400">Zero camera whip-pan jitter</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiHighlights.map((clip, index) => {
              const posterImg = clipPosters[index % clipPosters.length];
              const isSelected = selectedClipIdx === index;
              return (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClipIdx(index)}
                  className={`group rounded-xl overflow-hidden bg-[#08140C] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#B8FF01]'
                      : 'border-[#162B1E] hover:border-[#294E36]'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-black ${
                      storyMode === 'vertical'
                        ? 'aspect-[9/13]'
                        : storyMode === 'square'
                        ? 'aspect-square'
                        : 'aspect-video'
                    }`}
                  >
                    <img
                      src={posterImg}
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/60" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono tabular-nums">
                      <span className="px-2 py-0.5 rounded bg-[#050D08]/85 text-[#B8FF01] border border-[#1F3B2A]">
                        {clip.minute}&apos; · {clip.crowdDecibels} dB
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#050D08]/85 text-white">
                        {clip.duration}
                      </span>
                    </div>

                    {/* Step 5: Interactive YOLOv8-medium Bounding Box + Smoothed Crop Overlay */}
                    {showCvOverlay && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Smoothed Camera Crop Window (#00D4FF) */}
                        <div className="absolute inset-x-6 inset-y-8 border border-dashed border-[#00D4FF]/80 rounded-lg flex flex-col justify-between p-1.5">
                          <span className="text-[9px] font-mono bg-[#00D4FF]/20 text-[#00D4FF] px-1 rounded self-start">
                            Crop Window ({storyMode === 'vertical' ? '9:16' : storyMode === 'square' ? '1:1' : '16:9'}) • IQR Smooth
                          </span>
                          {/* YOLOv8 Ball POI Bounding Box (#00F59B) */}
                          <div className="w-14 h-14 border-2 border-[#00F59B] rounded bg-[#00F59B]/10 self-center flex items-end justify-center pb-0.5">
                            <span className="text-[8px] font-mono bg-[#00F59B] text-[#050D08] font-bold px-1 rounded">
                              POI 0.99
                            </span>
                          </div>
                          {/* TransNetV2 Scene Cut Marker Timeline */}
                          <div className="w-full bg-black/70 rounded px-1.5 py-0.5 flex items-center justify-between text-[8px] font-mono text-slate-300">
                            <span>TransNetV2 Cuts: 04f | 19f</span>
                            <span className="text-[#00F59B]">Lin-Interp OK</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform">
                      <div className="w-11 h-11 rounded-full bg-[#B8FF01] text-[#050D08] flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                        {clip.tacticalTag}
                      </span>
                      <h3 className="font-display font-bold text-sm text-white mt-0.5 line-clamp-2">
                        {clip.title}
                      </h3>
                    </div>

                    {!pureTacticalMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareWidgetToSquad({
                            type: 'ai-highlight',
                            title: clip.title,
                            subtitle: clip.tacticalTag,
                            metricPrimary: `${clip.minute}' Clip`,
                            metricSecondary: `${clip.crowdDecibels} dB Roar`,
                            accentColor: '#B8FF01',
                            clipId: clip.id,
                          });
                          setActiveTab('social-squads');
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-[#0B1A11] hover:bg-[#12291B] border border-[#1E3B28] text-xs font-medium text-slate-200 hover:text-[#B8FF01] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#B8FF01]" />
                        <span>
                          {isFr ? 'Partager pointeur 60fps dans Squad' : 'Share 60fps Pointer to Squad'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
