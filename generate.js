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
  // Thema: A/B-Testing-Grundlagen (Conversion & CRO)

  // Slide 1 — Hook
  const slide1 = slideRoot(
    badge('DIE WAHRHEIT', C.text, C.cardBg),
    headline('Rot oder Blau? Dein Bauchgefühl hat oft unrecht'),
    subline('So findest du heraus, was wirklich mehr Klicks bringt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '18px', alignItems: 'center', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(41,82,255,0.12)', border: `2px solid ${C.accent}`, borderRadius: '24px', padding: '40px 20px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 700, color: C.accent } }, 'JETZT BUCHEN'),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'VARIANTE A'),
        ),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '40px', fontWeight: 800, color: C.textMuted } }, '?'),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(0,194,184,0.12)', border: `2px solid ${C.accent2}`, borderRadius: '24px', padding: '40px 20px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 700, color: C.accent2 } }, 'TERMIN SICHERN'),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'VARIANTE B'),
        ),
      ),
    ),
    keyLearning('Ohne Test weißt du nie, welche Version wirklich besser konvertiert.'),
    footer(),
  );

  // Slide 2 — Problem: so laufen CTA-Entscheidungen meistens
  const flawed = [
    { l: 'BG', text: 'Bauchgefühl im Team entscheidet.' },
    { l: 'CP', text: 'Copy einfach vom Wettbewerber übernommen.' },
    { l: 'HI', text: 'Der lauteste im Meeting gewinnt die Diskussion.' },
  ];
  const slide2 = slideRoot(
    badge('SO LÄUFT ES MEISTENS', C.text, C.cardBg),
    headline('Drei Meinungen, keine Antwort'),
    subline('Website-Entscheidungen entstehen oft so:'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      ...flawed.map((f) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px 28px' } },
          h('div', { style: { display: 'flex', width: '52px', height: '52px', minWidth: '52px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: C.textMuted } }, f.l)),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, f.text),
        ),
      ),
    ),
    keyLearning('Das Ergebnis: Niemand weiß wirklich, ob die Entscheidung stimmt.', true),
    footer(),
  );

  // Slide 3 — Turning point: A/B-Testing Prinzip
  const slide3 = slideRoot(
    badge('A/B-TESTING', C.text, C.cardBg),
    headline('Es gibt einen Weg, es objektiv herauszufinden'),
    subline('Echte Besucher entscheiden, nicht die Meinung im Meeting.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '4px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', padding: '16px 32px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, letterSpacing: '1px', color: C.text } }, 'BESUCHER DEINER SEITE'))),
      h('div', { style: { display: 'flex', justifyContent: 'center', padding: '10px 0' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          h('div', { style: { display: 'flex', width: '4px', height: '30px', backgroundColor: C.cardBorder } }),
          h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `12px solid ${C.cardBorder}` } }))),
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(41,82,255,0.12)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '30px 20px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 700, color: C.accent } }, 'HÄLFTE'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.textSoft, textAlign: 'center' } }, 'sieht Variante A')),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0,194,184,0.12)', border: `1px solid ${C.accent2}`, borderRadius: '20px', padding: '30px 20px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 700, color: C.accent2 } }, 'HÄLFTE'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.textSoft, textAlign: 'center' } }, 'sieht Variante B')),
      ),
    ),
    keyLearning('Welche Version gewinnt, zeigt der Vergleich, nicht die Diskussion.'),
    footer(),
  );

  // Slide 4 — Regel 1: Isolationsprinzip
  const slide4 = slideRoot(
    badge('REGEL 1', C.text, C.cardBg),
    headline('Immer nur eine Variable gleichzeitig testen'),
    subline('Sonst weißt du am Ende nicht, was den Unterschied gemacht hat.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid ${C.red}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'MEHRERE ÄNDERUNGEN'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Farbe, Text und Bild gleichzeitig anders.'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(239,68,68,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 700, color: C.red } }, 'Ergebnis nicht zuordenbar')),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(0,194,184,0.10)', border: `1px solid ${C.accent2}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.accent2 } }, 'EINE ÄNDERUNG'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Nur die Button-Farbe ist anders.'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(0,194,184,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 700, color: C.accent2 } }, 'Ergebnis klar zuordenbar')),
      ),
    ),
    keyLearning('So weißt du am Ende genau, welche Änderung den Unterschied gemacht hat.'),
    footer(),
  );

  // Slide 5 — Regel 2: genug Zeit / statistische Signifikanz
  const svgTrend = `<svg width="860" height="280" viewBox="0 0 860 280" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 140 L120 60 L220 200 L320 90 L420 170 L520 70 L620 150" fill="none" stroke="${C.textMuted}" stroke-width="4" stroke-dasharray="10 10" opacity="0.6"/>
    <path d="M20 150 L860 100" fill="none" stroke="${C.accent2}" stroke-width="6"/>
    <circle cx="20" cy="150" r="8" fill="${C.accent2}"/>
    <circle cx="860" cy="100" r="8" fill="${C.accent2}"/>
  </svg>`;
  const svgTrendSrc = `data:image/svg+xml;base64,${Buffer.from(svgTrend).toString('base64')}`;
  const slide5 = slideRoot(
    badge('REGEL 2', C.text, C.cardBg),
    headline('Zu früh abbrechen macht das Ergebnis wertlos'),
    subline('Kleine Stichproben sehen wie ein Trend aus, sind aber Zufall.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('img', { src: svgTrendSrc, width: 860, height: 280, style: { display: 'flex', objectFit: 'contain' } }),
      h('div', { style: { display: 'flex', gap: '14px', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          h('div', { style: { display: 'flex', width: '20px', height: '4px', backgroundColor: C.textMuted, opacity: 0.6 } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.textMuted } }, 'wenige Besucher, viel Zufall')),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          h('div', { style: { display: 'flex', width: '20px', height: '4px', backgroundColor: C.accent2 } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.text } }, 'genug Besucher, klares Bild')),
      ),
    ),
    keyLearning('Ein belastbares Ergebnis braucht ausreichend Besucher und Zeit, bevor du entscheidest.'),
    footer(),
  );

  // Slide 6 — Learnings
  const learnings = [
    { num: '01', text: 'Nur eine Variable pro Test ändern.', pct: 33 },
    { num: '02', text: 'Genug Zeit und Besucher sammeln, bevor du entscheidest.', pct: 66 },
    { num: '03', text: 'Entscheidung nach Daten treffen, nicht nach Meinung.', pct: 100 },
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
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '52px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Testest du schon, oder rätst du noch?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Speichern nicht vergessen, bevor du deinen nächsten Test startest.'),
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
