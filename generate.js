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

  function headline(text, size = 62) {
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

  // Slide 1 — Hook: das Stockfoto, das niemand ansieht
  const slide1 = slideRoot(
    badge('ACHTUNG', C.text, C.cardBg),
    headline('Dieses Foto auf deiner Website sieht kaum jemand wirklich an'),
    subline('Auch wenn es dich extra Geld gekostet hat.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px', gap: '16px', maxWidth: '760px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'DEINE STARTSEITE'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', width: '100%', height: '220px', backgroundColor: 'rgba(239,68,68,0.14)', border: `2px solid ${C.red}`, borderRadius: '14px', padding: '0 24px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.red, lineHeight: '1.4' } }, 'Stockfoto: „Lächelndes Business-Team im Meeting“'),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.red, marginLeft: 'auto' } }, 'X'),
        ),
        h('div', { style: { display: 'flex', width: '100%', height: '28px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' } }),
        h('div', { style: { display: 'flex', width: '70%', height: '28px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' } }),
      ),
    ),
    keyLearning('Nutzer erkennen generische Stockfotos in Sekundenbruchteilen – und blenden sie unbewusst aus.'),
    footer(),
  );

  // Slide 2 — Der Beweis: Blickverlauf-Forschung
  const slide2 = slideRoot(
    badge('DER BEWEIS', C.text, C.cardBg),
    headline('Blicke wandern an generischen Fotos vorbei'),
    subline('Das zeigt Eyetracking-Forschung seit Jahren.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '18px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.accent2 } }, 'TEXT MIT ECHTEM INHALT'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '90px', backgroundColor: 'rgba(0,194,184,0.14)', border: `2px solid ${C.accent2}`, borderRadius: '12px', padding: '0 20px' } },
            ...[0, 1, 2, 3, 4].map(() => h('div', { style: { display: 'flex', width: '16px', height: '16px', borderRadius: '8px', backgroundColor: C.accent2 } })),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted } }, 'Blicke bleiben hängen'),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'GENERISCHES STOCKFOTO'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '90px', backgroundColor: 'rgba(255,255,255,0.05)', border: `2px dashed ${C.cardBorder}`, borderRadius: '12px', padding: '0 20px' } },
            h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.18)' } }),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted } }, 'Blicke springen darüber hinweg'),
        ),
      ),
    ),
    keyLearning('Nielsen Norman Group: Eyetracking-Studien zeigen seit Jahren, dass Blicke über austauschbare, generische Fotos hinweggehen.'),
    footer(),
  );

  // Slide 3 — Die Folge: die ueblichen Verdaechtigen
  const tropes = ['Händeschütteln im Anzug', 'Lächelndes Callcenter-Team', 'Zufällige Hände am Laptop', 'Weltkarte mit Business-Icons'];
  const slide3 = slideRoot(
    badge('DIE FOLGE', C.text, C.cardBg),
    headline('Der Effekt trifft die üblichen Verdächtigen'),
    subline('Diese Motive kennt jede:r – und übergeht sie deshalb.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        ...tropes.slice(0, 2).map((t) =>
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px', gap: '12px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, t),
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '17px', fontWeight: 700, letterSpacing: '1px', color: C.red } }, 'ERKENNBAR GENERISCH'),
          ),
        ),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        ...tropes.slice(2, 4).map((t) =>
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px', gap: '12px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, t),
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '17px', fontWeight: 700, letterSpacing: '1px', color: C.red } }, 'ERKENNBAR GENERISCH'),
          ),
        ),
      ),
    ),
    keyLearning('Je austauschbarer das Motiv, desto schneller wird es als Werbung erkannt – und übersprungen.'),
    footer(),
  );

  // Slide 4 — Erwartung vs. Realitaet
  const slide4 = slideRoot(
    badge('ERWARTUNG VS. REALITÄT', C.text, C.cardBg),
    headline('„Professionelle Stockfotos wirken hochwertiger“'),
    subline('Die Realität sieht anders aus.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Ein poliertes Stockfoto wirkt professionell und vertrauenswürdig.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.12)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(41,82,255,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Nutzer erkennen es als generisch und vertrauen echten Fotos mehr.'),
        ),
      ),
    ),
    keyLearning('Authentizität schlägt Hochglanz – besonders bei Fotos von Menschen und Team.'),
    footer(),
  );

  // Slide 5 — Die Loesung (konkrete Schritte)
  const steps = [
    { num: '01', text: 'Echtes Team, echtes Produkt, echten Arbeitsplatz fotografieren – notfalls mit dem Smartphone.' },
    { num: '02', text: 'Zeigen, was wirklich passiert, statt gestellte Situationen nachzustellen.' },
    { num: '03', text: 'Falls doch Stockfotos nötig sind: spezifische, thematisch passende Motive statt Business-Klischees wählen.' },
  ];
  const slide5 = slideRoot(
    badge('DIE LÖSUNG', C.text, C.cardBg),
    headline('Echte Bilder statt generischer Motive'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px', marginTop: '10px' } },
      ...steps.map((s) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', padding: '26px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: C.accent2, minWidth: '64px' } }, s.num),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, s.text),
        ),
      ),
    ),
    keyLearning('Ein einfaches, echtes Foto schafft mehr Vertrauen als ein perfektes, aber austauschbares Stockbild.'),
    footer(),
  );

  // Slide 6 — Learnings mit Fortschrittsbalken
  const learnings = [
    { num: '01', text: 'Echte Fotos von Team & Produkt priorisieren.', pct: 33 },
    { num: '02', text: 'Gestellte Klischee-Motive vermeiden.', pct: 66 },
    { num: '03', text: 'Stockfotos nur gezielt und thematisch passend einsetzen.', pct: 100 },
  ];
  const slide6 = slideRoot(
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

  // Slide 7 — CTA
  const slide7 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '52px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Zeigen deine Fotos wirklich, wer ihr seid?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Speichern nicht vergessen, bevor du das nächste Stockfoto kaufst.'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 700, color: C.text, textAlign: 'center', lineHeight: '1.4', marginTop: '10px' } }, 'Folge @benarodigital für mehr Website-Wissen'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

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
