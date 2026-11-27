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

  function svgImg(svgString, w, h2) {
    const src = 'data:image/svg+xml;base64,' + Buffer.from(svgString).toString('base64');
    return h('img', { src, width: w, height: h2, style: { display: 'flex' } });
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

  function tagCard(label, text, danger = false) {
    return h('div', { style: {
      display: 'flex', alignItems: 'center', gap: '18px', backgroundColor: C.cardBg,
      border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '22px 26px',
    } },
      h('div', { style: { display: 'flex', width: '14px', height: '14px', minWidth: '14px', borderRadius: '7px', backgroundColor: danger ? C.red : C.accent2 } }),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
        h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, label),
        h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.35' } }, text)));
  }

  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: pct === 100 ? C.green : C.accent2, minWidth: '56px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, text)),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })));
  }

  function quoteBox(text, source) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px' } },
      h('div', { style: { display: 'flex', width: '48px', height: '6px', backgroundColor: C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.45' } }, text),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', color: C.textMuted, letterSpacing: '1px' } }, source));
  }

  function arrowConnector() {
    return h('div', { style: { display: 'flex', justifyContent: 'center', padding: '0' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        h('div', { style: { display: 'flex', width: '4px', height: '18px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `11px solid ${C.cardBorder}` } })));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===

  // Browser-Fenster-Mockup: unruhig/ungeordnet vs. aufgeraeumt
  function browserMockupSvg(style) {
    const rough = style === 'rough';
    const barColor = rough ? 'rgba(255,255,255,0.22)' : '#00C2B8';
    const dotColor = rough ? 'rgba(255,255,255,0.25)' : '#CBA35C';
    const frame = rough ? 'rgba(255,255,255,0.14)' : 'rgba(0,194,184,0.4)';
    const cardFill = rough ? 'rgba(255,255,255,0.04)' : 'rgba(0,194,184,0.07)';
    const lines = rough
      ? [{ x: 28, y: 92, w: 200 }, { x: 28, y: 126, w: 140 }, { x: 28, y: 160, w: 224 }, { x: 28, y: 194, w: 110 }, { x: 28, y: 228, w: 174 }]
      : [{ x: 28, y: 100, w: 180 }, { x: 28, y: 150, w: 180 }, { x: 28, y: 200, w: 110 }];
    const lineHeight = rough ? 14 : 20;
    const rects = lines.map((l) => `<rect x="${l.x}" y="${l.y}" width="${l.w}" height="${lineHeight}" rx="${lineHeight / 2}" fill="${barColor}"/>`).join('');
    return `<svg width="260" height="300" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="252" height="292" rx="26" fill="${cardFill}" stroke="${frame}" stroke-width="3"/>
      <circle cx="30" cy="34" r="8" fill="${dotColor}"/>
      <circle cx="56" cy="34" r="8" fill="${dotColor}"/>
      <circle cx="82" cy="34" r="8" fill="${dotColor}"/>
      <line x1="4" y1="58" x2="256" y2="58" stroke="${frame}" stroke-width="2"/>
      ${rects}
    </svg>`;
  }

  // Schild (Vertrauen) + Funken (Aesthetik) als Prinzip-Illustration
  function trustAestheticSvg() {
    return `<svg width="260" height="300" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M130 18 L214 50 V140 C214 205 178 250 130 278 C82 250 46 205 46 140 V50 Z" fill="rgba(41,82,255,0.12)" stroke="#2952FF" stroke-width="6"/>
      <path d="M92 150 L116 176 L168 112" fill="none" stroke="#2952FF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M196 36 L204 54 L222 60 L204 66 L196 84 L188 66 L170 60 L188 54 Z" fill="#CBA35C"/>
      <path d="M50 24 L55 35 L66 39 L55 43 L50 54 L45 43 L34 39 L45 35 Z" fill="#CBA35C"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('ÜBERRASCHEND'),
    headline('Schönheit täuscht dein Gehirn — sofort', 44),
    subline('Ein psychologischer Bias lässt hübsche Websites sofort vertrauenswürdiger wirken, unabhängig von der echten Bedienbarkeit.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', gap: '16px', justifyContent: 'center' } },
        svgImg(browserMockupSvg('rough'), 260, 300),
        svgImg(browserMockupSvg('clean'), 260, 300)),
      tagCard('GLEICHE FUNKTION', 'Beide Interfaces tun exakt dasselbe — nur eines wirkt vertrauenswürdiger.')),
    keyLearning('Diese Einschätzung passiert unbewusst, in Sekundenbruchteilen.', true),
    footer(),
  ]);

  // === SLIDE 2: DIE STUDIE ===
  const slide2 = slideBase([
    badge('AESTHETIC-USABILITY-EFFECT'),
    headline('1995 mit Geldautomaten nachgewiesen', 42),
    subline('Kurosu und Kashimura testeten bei Hitachi ATM-Oberflächen mit exakt derselben Funktion, aber unterschiedlichem Design.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      quoteBox('Testpersonen hielten die ästhetisch ansprechenderen Oberflächen für leichter bedienbar — unabhängig von der tatsächlichen, identischen Bedienbarkeit.', 'KUROSU & KASHIMURA · HITACHI-STUDIE, CHI 1995')),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE (KETTENREAKTION) ===
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Der Effekt wirkt wie eine Kettenreaktion', 40),
    subline('Vom ersten Blick bis zum Vertrauen — in drei Schritten.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '6px' } },
      tagCard('AUSLÖSER', 'Ein stimmiges, durchdachtes Design fällt sofort auf'),
      arrowConnector(),
      tagCard('REAKTION', 'Das Gehirn überträgt den positiven Eindruck automatisch auf die ganze Seite'),
      arrowConnector(),
      tagCard('FOLGE', 'Mehr Vertrauen und Geduld — oft bevor irgendetwas wirklich genutzt wurde')),
    footer(),
  ]);

  // === SLIDE 4: ABER VORSICHT (ERWARTUNG VS REALITÄT) ===
  const slide4 = slideBase([
    badge('ABER VORSICHT'),
    headline('Schön ersetzt keine echte Bedienbarkeit', 40),
    subline('Bei Tests übersehen Nutzer:innen eher Fehler, wenn das Design gefällt — das Problem bleibt trotzdem.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px', gap: '12px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Die Website funktioniert auch wirklich gut')),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.text, borderRadius: '20px', padding: '26px', gap: '12px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: 'rgba(20,22,26,0.5)' } }, 'REALITÄT'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(20,22,26,0.15)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#14161A', lineHeight: '1.4' } }, 'Sie wirkt im ersten Moment nur gut')))),
    keyLearning('Echte Usability-Probleme verschwinden dadurch nicht — sie fallen nur später auf.', true),
    footer(),
  ]);

  // === SLIDE 5: DAS PRINZIP ===
  const slide5 = slideBase([
    badge('DAS PRINZIP'),
    headline('Design ist eine Vertrauensfrage, kein Deko-Extra', 38),
    subline('Visuelle Qualität entscheidet mit, ob jemand bleibt — oft bevor die Bedienung überhaupt getestet wird.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '22px' } },
      svgImg(trustAestheticSvg(), 260, 300),
      tagCard('UNBEWUSST', 'Dieses Urteil fällt automatisch, lange bevor Besucher:innen bewusst urteilen.')),
    footer(),
  ]);

  // === SLIDE 6: KONKRET (2x2 GRID) ===
  const slide6 = slideBase([
    badge('KONKRET'),
    headline('Diese vier Stellschrauben zahlen sich aus', 38),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        tagCard('WEISSRAUM', 'Luft zum Atmen schafft Klarheit statt Enge'),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        tagCard('FARBKONSISTENZ', 'Eine Akzentfarbe konsequent wiederverwenden'),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        tagCard('TYPOGRAFIE', 'Klare Hierarchie zwischen Headline und Text'),
      ),
      h('div', { style: { display: 'flex', gap: '14px' } },
        tagCard('ECHTE BILDER', 'Keine generischen Stockfotos verwenden'),
      )),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('Die 3 wichtigsten Learnings', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('01', 'Visuelle Qualität als echten Vertrauensfaktor behandeln', 33),
      learningCard('02', 'Konsistenz bei Farben, Abständen und Typografie schaffen', 67),
      learningCard('03', 'Schönes Design ersetzt keine echten Usability-Tests', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Wirkt deine Website auf den ersten Blick vertrauenswürdig?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || '2026-11-27';
  const outDir = path.join(__dirname, 'output', `carousel_${todayDir}`, 'slides');

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
