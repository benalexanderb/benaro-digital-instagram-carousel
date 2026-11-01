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
    type,
    props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch },
  });

  // === BD MONOGRAM LOGO ===
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
  function badge(text) {
    return h('div', { style: { display: 'flex', marginBottom: '16px' } },
      h('span', { style: {
        display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
        fontFamily: 'Manrope', color: C.text, backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, padding: '10px 22px', borderRadius: '12px',
      } }, text));
  }

  function headline(text, size = 60) {
    return h('span', { style: {
      display: 'flex', fontSize: `${size}px`, fontWeight: 800, fontFamily: 'Manrope',
      color: C.text, lineHeight: '1.12', letterSpacing: '-1.5px', marginBottom: '6px',
    } }, text);
  }

  function subline(text) {
    return h('span', { style: {
      display: 'flex', fontSize: '28px', fontWeight: 500, fontFamily: 'Inter',
      color: C.textSoft, lineHeight: '1.5', marginTop: '10px',
    } }, text);
  }

  function keyLearning(text, danger = false) {
    return h('div', { style: {
      display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: C.cardBg,
      border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '22px 28px', marginTop: 'auto',
    } },
      h('div', { style: {
        display: 'flex', width: '6px', minHeight: '40px',
        backgroundColor: danger ? C.red : C.accent2, borderRadius: '3px',
      } }),
      h('span', { style: {
        display: 'flex', fontSize: '27px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.4',
      } }, text));
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: {
        display: 'flex', fontSize: '24px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted,
      } }, '@benarodigital'));
  }

  function contrastCards(leftLabel, leftText, rightLabel, rightText, danger = false) {
    return h('div', { style: { display: 'flex', gap: '14px' } },
      h('div', { style: {
        display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, leftLabel),
        h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
        h('span', { style: { display: 'flex', fontSize: '27px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, leftText)),
      h('div', { style: {
        display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: danger ? 'rgba(239,68,68,0.14)' : 'rgba(41,82,255,0.14)',
        border: `1px solid ${danger ? C.red : C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: danger ? C.red : C.accent2 } }, rightLabel),
        h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: danger ? C.red : C.accent, borderRadius: '2px' } }),
        h('span', { style: { display: 'flex', fontSize: '27px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.4' } }, rightText)));
  }

  function ruleCard(title, text) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: '20px', padding: '26px', gap: '10px', border: `1px solid ${C.cardBorder}`,
    } },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, title),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, text));
  }

  function funnelStep(label, text, widthPct, danger) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' } },
      h('div', { style: {
        display: 'flex', flexDirection: 'column', width: `${widthPct}%`, backgroundColor: danger ? 'rgba(239,68,68,0.12)' : C.cardBg,
        border: `1px solid ${danger ? C.red : C.cardBorder}`, borderRadius: '16px', padding: '22px 26px', alignItems: 'center', gap: '6px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '1px', color: danger ? C.red : C.text } }, label),
        h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.3' } }, text)));
  }
  function funnelArrow() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      h('div', { style: { display: 'flex', width: '4px', height: '22px', backgroundColor: C.cardBorder } }),
      h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `11px solid ${C.cardBorder}` } }));
  }
  function flowStep(text) {
    return h('div', { style: {
      display: 'flex', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px',
      padding: '22px 28px', justifyContent: 'center',
    } },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, textAlign: 'center', lineHeight: '1.3' } }, text));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('WUSSTEST DU?'),
    headline('Dein Gehirn kann nur wenige Dinge gleichzeitig verarbeiten.', 48),
    subline('Und jede Website testet genau diese Grenze.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('ARBEITSGEDÄCHTNIS', 'Verarbeitet nur eine Handvoll Informationen gleichzeitig', 'VIELE WEBSITES', 'Zeigen Nav, Slider, Popup, Chat & mehrere CTAs gleichzeitig', true)),
    keyLearning('Jedes zusätzliche Element konkurriert um dieselbe begrenzte mentale Kapazität.', true),
    footer(),
  ]);

  // === SLIDE 2: DER STANDARD (Kontext mit 2 Quellen) ===
  const slide2 = slideBase([
    badge('DER STANDARD'),
    headline('Zwei Grundgesetze der Kognitionspsychologie erklären das.', 48),
    subline('Seit Jahrzehnten etabliert und vielfach repliziert.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ruleCard('Cognitive Load Theory', 'John Sweller, 1988: Das Arbeitsgedächtnis hat eine begrenzte Kapazität für neue Informationen.'),
      ruleCard('The Magical Number Seven', 'George A. Miller, 1956: Menschen behalten im Schnitt nur etwa 7 (±2) Informationseinheiten gleichzeitig im Kopf.')),
    keyLearning('Beide Arbeiten gehören zu den meistzitierten der Kognitionsforschung.'),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE (Funnel) ===
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Zu viele Reize – zu wenig Kapazität für die Entscheidung.', 46),
    subline('Was passiert, wenn eine Seite diese Grenze überschreitet.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0px' } },
      funnelStep('VIELE REIZE GLEICHZEITIG', 'Navigation, Popups, Slider, mehrere CTAs auf einmal', 100, false),
      funnelArrow(),
      funnelStep('MENTALE KAPAZITÄT ÜBERLASTET', 'Arbeitsgedächtnis kann nicht mehr alles verarbeiten', 82, false),
      funnelArrow(),
      funnelStep('ENTSCHEIDUNG WIRD VERMIEDEN', 'Die einfachste Option gewinnt: die Seite verlassen', 64, true)),
    keyLearning('Überforderte Besucher entscheiden sich oft gegen jede Entscheidung.', true),
    footer(),
  ]);

  // === SLIDE 4: DER HEBEL (Intrinsic vs Extraneous) ===
  const slide4 = slideBase([
    badge('DER HEBEL'),
    headline('Nicht jede Last ist gleich – nur eine Art lässt sich gestalten.', 44),
    subline('Cognitive Load Theory unterscheidet zwei Arten von Last.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('INTRINSIC LOAD', 'Komplexität, die zur Aufgabe selbst gehört – kaum vermeidbar', 'EXTRANEOUS LOAD', 'Komplexität durch das Design selbst – vollständig vermeidbar')),
    keyLearning('Genau diese vermeidbare Last lässt sich im Website-Design gezielt senken.'),
    footer(),
  ]);

  // === SLIDE 5: KONKRET (3 Prinzipien) ===
  const slide5 = slideBase([
    badge('KONKRET'),
    headline('So senkst du die vermeidbare Last.', 52),
    subline('Drei Prinzipien aus der UX-Forschung.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ruleCard('Chunking', 'Inhalte in kleine, klar abgegrenzte Gruppen gliedern statt in einem langen Block.'),
      ruleCard('Progressive Disclosure', 'Nur das Nötigste sofort zeigen, Details erst bei Bedarf nachliefern.'),
      ruleCard('Eine Aktion pro Screen', 'Ein klarer primärer CTA pro Abschnitt statt mehrerer gleichwertiger Optionen.')),
    keyLearning('Jedes weggelassene Element schafft mentalen Freiraum für die Kernbotschaft.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP (Arrow Flow) ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Weniger Reize lassen mehr Kapazität für die Entscheidung.', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '0px' } },
      flowStep('Website reduziert vermeidbare Last'),
      funnelArrow(),
      flowStep('Arbeitsgedächtnis wird entlastet'),
      funnelArrow(),
      flowStep('Kapazität bleibt für Kernbotschaft & CTA')),
    keyLearning('Klarheit schlägt Kreativität – weil sie dem Gehirn weniger Arbeit macht.'),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const learnings = [
    { num: '01', text: 'Inhalte in kleine, klare Gruppen chunk-en', pct: 33 },
    { num: '02', text: 'Details per Progressive Disclosure nachliefern statt alles zu zeigen', pct: 66 },
    { num: '03', text: 'Einen primären CTA pro Screen statt mehrerer gleichwertiger Optionen', pct: 100 },
  ];
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('3 Schritte gegen kognitive Überlastung.', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '24px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '66px' } }, l.num),
            h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text)),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }))))),
    keyLearning('Weniger gleichzeitige Reize heißt mehr mentale Kapazität für den Kauf.'),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Wie viele Dinge verlangt deine Startseite gleichzeitig von deinen Besuchern?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-11-01', 'slides');

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i + 1}/${slides.length} done`);
  }
  console.log('All slides generated!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
