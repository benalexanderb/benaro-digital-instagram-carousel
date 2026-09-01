const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap((w) => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-${w}-normal.woff`) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-ext-${w}-normal.woff`) },
    ]),
    ...[400, 500, 600, 700].flatMap((w) => [
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(`${interDir}/inter-latin-${w}-normal.woff`) },
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(`${interDir}/inter-latin-ext-${w}-normal.woff`) },
    ]),
  ];

  const C = {
    bg: '#14161A',
    text: '#FFFFFF',
    textSoft: 'rgba(255,255,255,0.72)',
    textMuted: '#9AA0AB',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#2952FF',
    accent2: '#00C2B8',
    gold: '#CBA35C',
    green: '#10B981',
    red: '#EF4444',
  };

  const W = 1080, H = 1350;

  const h = (type, props, ...ch) => ({
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch },
  });

  function bdMonogramSvg(fill) {
    return `<svg viewBox="14 10 86 46" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="10" width="10" height="46" rx="5" fill="${fill}"/>
      <path d="M19 10H34A11 11 0 0 1 34 32H19Z" fill="${fill}"/>
      <path d="M19 32H36A12 12 0 0 1 36 56H19Z" fill="${fill}"/>
      <rect x="51" y="10" width="10" height="46" rx="5" fill="${fill}"/>
      <path d="M56 10H77A23 23 0 0 1 77 56H56Z" fill="${fill}"/>
    </svg>`;
  }
  function bdLogoImg(fill, width) {
    const src = 'data:image/svg+xml;base64,' + Buffer.from(bdMonogramSvg(fill)).toString('base64');
    return h('img', { src, width, height: width * (46 / 86), style: { display: 'flex' } });
  }

  // === REUSABLE COMPONENTS ===

  function badge(text, color = C.text, bg = C.cardBg) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '3px', color, backgroundColor: bg, padding: '10px 22px', borderRadius: '12px' } }, text));
  }

  function headline(text, size = 60) {
    return h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: `${size}px`, fontWeight: 800, color: C.text, lineHeight: '1.12', letterSpacing: '-1px', marginBottom: '4px' } }, text);
  }

  function subline(text) {
    return h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, lineHeight: '1.5', marginTop: '10px' } }, text);
  }

  function keyLearning(text, danger = false) {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: 'auto' } },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '40px', backgroundColor: danger ? C.red : C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text));
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital'));
  }

  function slideRoot(...children) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px', backgroundColor: C.bg, fontFamily: 'Inter' } }, ...children);
  }

  // === SLIDES ===
  // Thema: Formularlänge & Cognitive Load (Conversion & CRO)

  // Slide 1 — Hook
  const formRows = [
    { label: 'Name', risk: false },
    { label: 'E-Mail', risk: false },
    { label: 'Nachricht', risk: false },
    { label: 'Telefon', risk: true },
    { label: 'Firma', risk: true },
    { label: 'Wie hast du uns gefunden?', risk: true },
  ];
  const slide1 = slideRoot(
    badge('ACHTUNG', C.text, C.cardBg),
    headline('Ein einziges Formularfeld kann deine Anfrage kosten'),
    subline('Und die meisten Kontaktformulare haben zu viele.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '30px', gap: '14px' } },
        ...formRows.map((f) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 18px', backgroundColor: f.risk ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${f.risk ? 'rgba(239,68,68,0.35)' : C.cardBorder}`, borderRadius: '14px' } },
            h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: f.risk ? C.red : C.accent2 } }),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: f.risk ? 'rgba(255,255,255,0.75)' : C.text } }, f.label),
          ),
        ),
      ),
    ),
    keyLearning('Jedes zusätzliche Feld erhöht den gefühlten Aufwand für den Besucher.'),
    footer(),
  );

  // Slide 2 — Warum (Cognitive Load)
  const effortSteps = [1, 2, 3, 4, 5, 6];
  const slide2 = slideRoot(
    badge('COGNITIVE LOAD', C.text, C.cardBg),
    headline('Warum jedes Feld Aufwand bedeutet'),
    subline('Das Gehirn bewertet jede Entscheidung einzeln.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '14px', justifyContent: 'center' } },
        ...effortSteps.map((n) =>
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } },
            h('div', { style: { display: 'flex', width: '90px', height: `${60 + n * 28}px`, backgroundColor: n >= 5 ? 'rgba(239,68,68,0.16)' : 'rgba(0,194,184,0.14)', border: `2px solid ${n >= 5 ? C.red : C.accent2}`, borderRadius: '14px' } }),
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, color: C.textMuted } }, `${n}`),
          ),
        ),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px 28px', gap: '8px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Jedes Feld muss gelesen, verstanden, bewertet und ausgefüllt werden – bevor der nächste Schritt möglich ist.'),
      ),
    ),
    keyLearning('Cognitive Load Theory (John Sweller, 1988): jede zusätzliche Information beansprucht das Arbeitsgedächtnis.'),
    footer(),
  );

  // Slide 3 — Die Folge
  const reasons = [
    { title: 'UNKLARER ZWECK', text: 'Warum wird genau das gefragt? Ist nicht sofort ersichtlich.' },
    { title: 'GEFÜHLTER AUFWAND', text: 'Ein langes Formular wirkt aufwändiger, bevor überhaupt ein Wort getippt wurde.' },
    { title: 'DATENSCHUTZ-BEDENKEN', text: 'Sensible Felder wie Telefonnummer wecken Zurückhaltung ohne Erklärung.' },
  ];
  const slide3 = slideRoot(
    badge('DIE FOLGE', C.text, C.cardBg),
    headline('Nicht das Formular ist das Problem'),
    subline('Sondern die Unsicherheit, die dabei entsteht.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...reasons.map((r) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px 28px', gap: '10px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, r.title),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, r.text),
        ),
      ),
    ),
    keyLearning('Jeder dieser Gründe lässt sich mit dem richtigen Formular-Design vermeiden.'),
    footer(),
  );

  // Slide 4 — Erwartung vs Realität
  const slide4 = slideRoot(
    badge('ERWARTUNG VS. REALITÄT', C.text, C.cardBg),
    headline('"Mehr Felder heißt mehr Informationen"'),
    subline('Die Realität sieht anders aus.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Je mehr ich frage, desto besser kann ich die Anfrage einordnen.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.12)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(41,82,255,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Je mehr ich frage, desto weniger Besucher schicken das Formular überhaupt ab.'),
        ),
      ),
    ),
    keyLearning('Baymard Institute: unnötige Formularfelder zählen zu den häufigsten Abbruchgründen.'),
    footer(),
  );

  // Slide 5 — Die Lösung
  const slide5 = slideRoot(
    badge('DIE LÖSUNG', C.text, C.cardBg),
    headline('Nur fragen, was du wirklich brauchst'),
    subline('Zwei Prinzipien für schlankere Formulare.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(0,194,184,0.10)', border: `1px solid ${C.accent2}`, borderRadius: '20px', padding: '28px', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(0,194,184,0.18)', alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: C.accent2 } }, '01'),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '27px', fontWeight: 700, color: C.text } }, 'Minimum-Prinzip'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Nur Felder abfragen, die für den nächsten Schritt zwingend nötig sind.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.10)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(41,82,255,0.18)', alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: C.accent } }, '02'),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '27px', fontWeight: 700, color: C.text } }, 'Progressive Disclosure'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Lange Formulare in mehrere kurze Schritte statt einer langen Liste aufteilen.'),
        ),
      ),
    ),
    keyLearning('Weniger Felder auf einen Blick wirken machbarer – unabhängig von der Gesamtzahl.'),
    footer(),
  );

  // Slide 6 — Konkrete Schritte
  const steps = [
    { num: '01', text: 'Jedes Feld auf Notwendigkeit prüfen – raus, was nicht zwingend gebraucht wird.' },
    { num: '02', text: 'Optionale Felder klar kennzeichnen oder ganz weglassen.' },
    { num: '03', text: 'Lange Formulare in mehrere kurze Schritte aufteilen.' },
  ];
  const slide6 = slideRoot(
    badge('SO GEHT ES KONKRET', C.text, C.cardBg),
    headline('Drei Schritte zu einem leichteren Formular'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px', marginTop: '10px' } },
      ...steps.map((s) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', padding: '26px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: C.accent2, minWidth: '64px' } }, s.num),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, s.text),
        ),
      ),
    ),
    keyLearning('Der Zweck jedes verbleibenden Feldes sollte für Besucher sofort klar sein.'),
    footer(),
  );

  // Slide 7 — Takeaways
  const learnings = [
    { num: '01', text: 'Jedes Feld erhöht den gefühlten Aufwand.', pct: 33 },
    { num: '02', text: 'Unnötige Felder kosten dich Anfragen.', pct: 66 },
    { num: '03', text: 'Weniger und klarer schlägt lang und vollständig.', pct: 100 },
  ];
  const slide7 = slideRoot(
    badge('DIE TAKEAWAYS', C.text, C.cardBg),
    headline('Was du dir merken solltest'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px', marginTop: '10px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.green : C.text, minWidth: '60px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
          ),
        ),
      ),
    ),
    footer(),
  );

  // Slide 8 — CTA
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '50px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Wie viele Felder hat dein Kontaktformular wirklich?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Speichern nicht vergessen, bevor du dein Formular prüfst.'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 700, color: C.text, textAlign: 'center', lineHeight: '1.4', marginTop: '10px' } }, 'Folge @benarodigital für mehr Website-Wissen'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, 'output', `carousel_${new Date().toISOString().slice(0, 10)}`, 'slides');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i + 1}/${slides.length} done -> ${pngPath}`);
  }
  console.log('All slides generated!');
}

main().catch((e) => { console.error(e); process.exit(1); });
