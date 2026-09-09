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

  function arrowDown(color = C.cardBorder) {
    return h('div', { style: { display: 'flex', justifyContent: 'center', padding: '2px 0' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        h('div', { style: { display: 'flex', width: '4px', height: '22px', backgroundColor: color } }),
        h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `11px solid ${color}` } }),
      ));
  }

  // === SLIDES ===
  // Thema: Echte Fotos statt Stockfotos (Trust & Social Proof)

  // Slide 1 — Hook
  const slide1 = slideRoot(
    badge('ACHTUNG', C.text, C.cardBg),
    headline('Dein perfektes Stockfoto wird von Besuchern einfach ausgeblendet'),
    subline('Das Phänomen dahinter kennt jeder UX-Forscher.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px', gap: '16px', maxWidth: '760px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'TEAM-SEKTION'),
        h('div', { style: { display: 'flex', gap: '14px' } },
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '10px' } },
            h('div', { style: { display: 'flex', width: '100%', height: '120px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px' } }),
            h('div', { style: { display: 'flex', width: '70%', height: '18px', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: '6px' } }),
          ),
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '10px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '120px', backgroundColor: 'rgba(239,68,68,0.16)', border: `2px solid ${C.red}`, borderRadius: '14px' } },
              h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.red } }, 'X'),
            ),
            h('div', { style: { display: 'flex', width: '70%', height: '18px', backgroundColor: 'rgba(239,68,68,0.25)', borderRadius: '6px' } }),
          ),
        ),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.red } }, 'Rechts: erkennbares Stockfoto'),
      ),
    ),
    keyLearning('Nutzer lernen mit der Zeit, werbe-artige Bilder automatisch zu ignorieren.'),
    footer(),
  );

  // Slide 2 — Der Fall / das Phänomen
  const slide2 = slideRoot(
    badge('DAS PHÄNOMEN', C.text, C.cardBg),
    headline('Es heißt Banner-Blindness'),
    subline('Und es betrifft längst mehr als nur Werbebanner.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '4px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px 28px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Besucher sehen viele generische Werbe- und Symbolbilder'),
      ),
      arrowDown(),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.10)', border: `1px solid ${C.red}`, borderRadius: '18px', padding: '24px 28px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Das Gehirn lernt: Diese Bilder sind Rauschen, keine Information'),
      ),
      arrowDown(C.red),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.16)', border: `1px solid ${C.red}`, borderRadius: '18px', padding: '24px 28px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 700, color: C.red, lineHeight: '1.4' } }, 'Neue Stockfotos werden automatisch mit ausgeblendet'),
      ),
    ),
    keyLearning('Quelle: Nielsen Norman Group – Eyetracking-Forschung zu Banner-Blindness und Bildwahrnehmung.'),
    footer(),
  );

  // Slide 3 — Die Folge: trifft die ganze Website
  const spots = [
    { t: 'Hero-Bild', s: 'Gestellte Symbolfoto-Pose' },
    { t: 'Über-uns-Seite', s: 'Generisches Business-Stockfoto' },
    { t: 'Team-Sektion', s: 'Austauschbare Porträts' },
    { t: 'Testimonials', s: 'Zitat ohne echtes Gesicht' },
  ];
  const slide3 = slideRoot(
    badge('DIE FOLGE', C.text, C.cardBg),
    headline('Das trifft jede Seite deiner Website'),
    subline('Nicht nur klassische Werbeflächen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        ...spots.slice(0, 2).map((f) =>
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px', gap: '12px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text } }, f.t),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 500, color: C.textMuted, lineHeight: '1.3' } }, f.s),
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: C.red } }, 'WIRKT UNGLAUBWÜRDIG'),
          ),
        ),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        ...spots.slice(2, 4).map((f) =>
          h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px', gap: '12px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text } }, f.t),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 500, color: C.textMuted, lineHeight: '1.3' } }, f.s),
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: C.red } }, 'WIRKT UNGLAUBWÜRDIG'),
          ),
        ),
      ),
    ),
    keyLearning('Jede erkennbare Stockfoto-Stelle kostet ein Stück Glaubwürdigkeit.'),
    footer(),
  );

  // Slide 4 — Erwartung vs. Realität
  const slide4 = slideRoot(
    badge('ERWARTUNG VS. REALITÄT', C.text, C.cardBg),
    headline('"Ein professionelles Stockfoto wirkt hochwertig"'),
    subline('Die Realität sieht anders aus.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Ein makelloses Symbolfoto wirkt professionell und vertrauenswürdig.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.12)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(41,82,255,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Ein erkennbares Symbolfoto wirkt unpersönlich und senkt das Vertrauen.'),
        ),
      ),
    ),
    keyLearning('Nielsen Norman Group: Blicke folgen echten Gesichtern – generische Symbolfotos werden übersprungen.'),
    footer(),
  );

  // Slide 5 — Die Lösung
  const steps = [
    { num: '01', text: 'Echte Fotos von Team, Räumen und Arbeit zeigen – statt generischer Symbolbilder.' },
    { num: '02', text: 'Kein Fotoshooting möglich? Dann unaufgeräumt-echte statt offensichtlich gestellte Bilder wählen.' },
    { num: '03', text: 'Testimonials immer mit echtem Gesicht und echtem Namen zeigen, nie anonym.' },
  ];
  const slide5 = slideRoot(
    badge('DIE LÖSUNG', C.text, C.cardBg),
    headline('Authentizität schlägt Hochglanz'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px', marginTop: '10px' } },
      ...steps.map((s) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', padding: '26px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: C.accent2, minWidth: '64px' } }, s.num),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, s.text),
        ),
      ),
    ),
    keyLearning('Konkrete, echte Bilder schaffen Wiedererkennbarkeit – Stockfotos nicht.'),
    footer(),
  );

  // Slide 6 — Learnings mit Fortschrittsbalken
  const learnings = [
    { num: '01', text: 'Generische Stockfotos wirken wie Werbe-Rauschen und werden ignoriert.', pct: 33 },
    { num: '02', text: 'Echte Fotos schaffen Wiedererkennbarkeit und Vertrauen.', pct: 66 },
    { num: '03', text: 'Authentizität schlägt Hochglanz-Perfektion.', pct: 100 },
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
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '52px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Zeigt deine Website echte Menschen – oder nur Stockfotos?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Speichern nicht vergessen, bevor du dein nächstes Bild aussuchst.'),
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
