import React, { useState } from 'react';
import {
  ArrowRight,
  KeyRound,
  Play,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useScorecer } from '../../context/ScorecerContext';
import { CommentaryLanguage } from '../../types/scorecer';

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
  } = useScorecer();

  const isFr = uiLanguage === 'fr';

  // Conversational Assistant state
  const [query, setQuery] = useState<string>('');
  const [showApiKeyBox, setShowApiKeyBox] = useState<boolean>(false);
  const [showRagInspector, setShowRagInspector] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>('');

  // Commentary Persona Studio state
  const [persona, setPersona] = useState<'tactical' | 'passionate' | 'neutral'>(
    'tactical'
  );
  const [voiceLang, setVoiceLang] = useState<CommentaryLanguage>(
    isFr ? 'fr' : 'en'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Story Format state
  const [storyMode, setStoryMode] = useState<'vertical' | 'widescreen'>(
    'vertical'
  );
  const [selectedClipIdx, setSelectedClipIdx] = useState<number>(0);

  const handleAsk = async (customPrompt?: string) => {
    const text = (customPrompt ?? query).trim();
    if (!text) return;
    setQuery('');
    await sendAIChatMessage(text, geminiKey);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      triggerToast(
        isFr ? 'Lecture vocale IA activée' : 'AI Voice synthesis started'
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
              {isFr ? 'STUDIO IA SCORECER' : 'SCORECER AI STUDIO'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Une intelligence qui ressent le match.'
                : 'Intelligence that feels the match.'}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {isFr
                ? 'Posez vos questions en direct au terrain, changez la voix du commentateur selon votre humeur et explorez les Stories vidéo découpées automatiquement.'
                : 'Ask the pitch anything in plain language, switch commentator voices on the fly, and explore highlight Stories cut automatically from the live feed.'}
            </p>
          </div>

          <div className="bg-[#08140C]/90 backdrop-blur-md border border-[#1E3B28] rounded-xl p-4 flex items-center gap-5 self-start lg:self-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF01]">
                <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                <span>
                  {isFr ? 'CONNECTÉ AU MATCH' : 'GROUNDED IN LIVE MATCH'} ·{' '}
                  {activeMatch.minute}&apos;
                </span>
              </div>
              <div className="font-wide font-bold text-base text-white mt-1">
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
              {isFr ? '01 · ASSISTANT DE MATCH' : '01 · AI MATCH ASSISTANT'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Demandez tout au terrain.'
                : 'Ask the pitch anything.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Pas besoin de décoder des tableaux complexes. Posez une question sur un changement tactique, un joueur ou une baisse de rythme et recevez une explication claire accompagnée de l’extrait vidéo.'
                : 'No need to decode complex spreadsheets. Ask about a momentum swing, a substitution, or a player duel and get a clear explanation paired with the video clip.'}
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
                  {isFr ? 'Assistant Match Scorecer (RAG Live)' : 'Scorecer Match Assistant (Live RAG)'}
                </h3>
                <p className="text-xs text-slate-400">
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
                      ? 'Masquer RAG'
                      : 'Hide RAG Context'
                    : isFr
                    ? 'Inspecter RAG'
                    : 'Inspect RAG Context'}
                </button>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#B8FF01]">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF01] animate-pulse" />
                  {isAiStreaming
                    ? isFr
                      ? 'STREAMING...'
                      : 'STREAMING...'
                    : isFr
                    ? 'EN DIRECT'
                    : 'LIVE'}
                </span>
              </div>
            </div>

            {showRagInspector && (
              <div className="rounded-lg bg-[#050D08] border border-[#1E3B29] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#B8FF01]">
                  <span>LIVE MATCH RAG GROUNDING WINDOW</span>
                  <span>{liveRagSnapshot.formations} · {liveRagSnapshot.xgSummary}</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {liveRagSnapshot.serializedPromptContext}
                </pre>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {aiChatMessages.map((msg, idx) =>
                msg.sender === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="px-4 py-2.5 rounded-lg bg-[#12261A] border border-[#1F3B2A] text-sm text-white max-w-md">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start">
                    <div className="p-4 rounded-xl bg-[#0B1B11] border border-[#193122] max-w-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#B8FF01]">
                          SCORECER AI · {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Embedded Video Clip Proof inside AI Response */}
                      {msg.embeddedClipId && (
                        <div className="rounded-lg overflow-hidden border border-[#1F3B2A] bg-[#050D08] flex items-center gap-3.5 p-2.5">
                          <img
                            src={clipPosters[idx % clipPosters.length]}
                            alt="Match clip proof"
                            className="w-24 h-14 object-cover rounded"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] text-[#B8FF01] uppercase">
                              {isFr ? 'EXTRAIT VIDÉO ASSOCIÉ' : 'ATTACHED MATCH CLIP'}
                            </span>
                            <p className="text-xs font-medium text-white truncate">
                              {aiHighlights.find((c) => c.id === msg.embeddedClipId)
                                ?.title || '67’ Saka cutback & Havertz volley'}
                            </p>
                          </div>
                        </div>
                      )}
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
          02 · COMMENTARY PERSONAS — "Same match. Different voice."
      ===================================================================== */}
      <section className="border-b border-[#162B1E] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Interactive Persona & Language Card (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#08140C] border border-[#162B1E] overflow-hidden">
            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-3 border-b border-[#162B1E] text-xs font-mono uppercase tracking-wider">
              {(
                [
                  { id: 'tactical', label: isFr ? 'TACTIQUE' : 'TACTICAL' },
                  { id: 'passionate', label: isFr ? 'PASSIONNÉ' : 'PASSIONATE' },
                  { id: 'neutral', label: isFr ? 'NEUTRE' : 'NEUTRAL' },
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
              {/* Language Pills + Hear Voice Button */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['en', 'fr', 'es', 'de', 'ja', 'ar'] as CommentaryLanguage[]).map(
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
                        {VOICE_SCRIPTS[code].label}
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
                        ? 'Arrêter la voix IA'
                        : 'Stop AI Voice'
                      : isFr
                      ? 'Écouter le commentateur IA'
                      : 'Listen to AI Commentator'}
                  </span>
                </button>
              </div>

              {/* Commentary Lines */}
              <div className="space-y-4 pt-2">
                {currentScriptPack[persona].map((line, i) => {
                  const min = line.slice(0, 3);
                  const body = line.slice(3).trim();
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg bg-[#050D08] border border-[#162B1E]"
                    >
                      <span className="font-mono text-xs font-bold text-[#B8FF01] pt-0.5">
                        {min}
                      </span>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Editorial Explanation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
              {isFr ? '02 · COMMENTAIRES MULTILINGUES' : '02 · COMMENTARY PERSONAS'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {isFr
                ? 'Même match. Autre voix.'
                : 'Same match. Different voice.'}
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              {isFr
                ? 'Choisissez entre l’analyse tactique posée, la ferveur d’un supporter passionné ou le ton neutre d’un commentateur télé—doublé instantanément en 6 langues.'
                : 'Choose between calm tactical insight, passionate club supporter energy, or classic neutral broadcasting—dubbed across 6 languages in real time.'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          03 · AUTOMATED HIGHLIGHT STORIES — "Stories cut for the phone in your hand."
      ===================================================================== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B8FF01]">
                {isFr ? '03 · STORIES AUTOMATISÉES' : '03 · AUTOMATED HIGHLIGHTS'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {isFr
                  ? 'Découpées au son de la clameur du stade.'
                  : 'Stories cut from the roar of the stadium.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                {isFr
                  ? 'Dès qu’un but ou un arrêt décisif survient, l’IA assemble l’action en format vertical 9:16 pour votre téléphone ou 16:9 pour grand écran.'
                  : 'Within seconds of a goal or decisive save, Scorecer assembles the sequence in vertical 9:16 mobile Stories and 16:9 widescreen clips.'}
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-[#08140C] border border-[#162B1E] p-1 text-xs font-mono self-start">
              <button
                onClick={() => setStoryMode('vertical')}
                className={`px-3 py-1.5 rounded-md cursor-pointer ${
                  storyMode === 'vertical'
                    ? 'bg-[#B8FF01] text-[#050D08] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                9:16 Mobile Story
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
                      storyMode === 'vertical' ? 'aspect-[9/13]' : 'aspect-video'
                    }`}
                  >
                    <img
                      src={posterImg}
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/60" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#050D08]/85 text-[#B8FF01] border border-[#1F3B2A]">
                        {clip.minute}&apos; · {clip.crowdDecibels} dB
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#050D08]/85 text-white">
                        {clip.duration}
                      </span>
                    </div>

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
                        {isFr ? 'Partager dans le Squad' : 'Share to Squad'}
                      </span>
                    </button>
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
