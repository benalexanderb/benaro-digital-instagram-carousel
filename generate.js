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

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===
  function deviceFoldSvg(foldY) {
    return `<svg width="820" height="640" viewBox="0 0 820 640" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="740" height="600" rx="28" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <rect x="40" y="20" width="740" height="60" rx="28" fill="rgba(255,255,255,0.08)"/>
      <circle cx="76" cy="50" r="7" fill="#EF4444"/>
      <circle cx="100" cy="50" r="7" fill="#CBA35C"/>
      <circle cx="124" cy="50" r="7" fill="#10B981"/>
      <rect x="76" y="110" width="520" height="34" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="76" y="166" width="668" height="18" rx="6" fill="rgba(255,255,255,0.09)"/>
      <rect x="76" y="198" width="560" height="18" rx="6" fill="rgba(255,255,255,0.09)"/>
      <rect x="76" y="250" width="220" height="56" rx="14" fill="#2952FF"/>
      <line x1="40" y1="${foldY}" x2="780" y2="${foldY}" stroke="#00C2B8" stroke-width="4" stroke-dasharray="14 12"/>
      <rect x="76" y="${foldY + 50}" width="668" height="18" rx="6" fill="rgba(255,255,255,0.06)"/>
      <rect x="76" y="${foldY + 82}" width="668" height="18" rx="6" fill="rgba(255,255,255,0.06)"/>
      <rect x="76" y="${foldY + 114}" width="420" height="18" rx="6" fill="rgba(255,255,255,0.06)"/>
    </svg>`;
  }

  function attentionBarsSvg() {
    return `<svg width="820" height="420" viewBox="0 0 820 420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00C2B8"/>
          <stop offset="100%" stop-color="#2952FF"/>
        </linearGradient>
      </defs>
      <line x1="60" y1="380" x2="760" y2="380" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <rect x="140" y="40" width="200" height="340" rx="16" fill="url(#gradTop)"/>
      <rect x="480" y="230" width="200" height="150" rx="16" fill="rgba(255,255,255,0.12)"/>
    </svg>`;
  }

  function foldStackSvg() {
    return `<svg width="840" height="480" viewBox="0 0 840 480" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="200" height="400" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <line x1="20" y1="160" x2="220" y2="160" stroke="#00C2B8" stroke-width="4" stroke-dasharray="10 8"/>
      <rect x="300" y="20" width="260" height="440" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <line x1="300" y1="190" x2="560" y2="190" stroke="#00C2B8" stroke-width="4" stroke-dasharray="10 8"/>
      <rect x="620" y="60" width="200" height="340" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <line x1="620" y1="150" x2="820" y2="150" stroke="#00C2B8" stroke-width="4" stroke-dasharray="10 8"/>
    </svg>`;
  }

  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: pct === 100 ? C.green : C.accent2, minWidth: '56px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, text)),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })));
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('WUSSTEST DU?'),
    headline('Deine Website hat nur einen Blick.', 52),
    subline('Bevor jemand scrollt, entscheidet sich schon viel.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(deviceFoldSvg(430), 700, 547)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.accent2 } }, 'SICHTBAR OHNE SCROLLEN'))),
    keyLearning('"Above the Fold": der Bereich, den man ohne Scrollen sieht.'),
    footer(),
  ]);

  // === SLIDE 2: DIE FORSCHUNG ===
  const slide2 = slideBase([
    badge('DIE FORSCHUNG'),
    headline('Eyetracking zeigt ein klares Muster.', 50),
    subline('Nielsen Norman Group, "Scrolling and Attention" (2010)'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(attentionBarsSvg(), 700, 358)),
      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '130px' } },
        h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, 'Oberhalb des Falzes'),
        h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Unterhalb des Falzes'))),
    keyLearning('Nutzer:innen scrollen zwar, aber ihre Aufmerksamkeit sinkt danach spürbar.'),
    footer(),
  ]);

  // === SLIDE 3: DAS PROBLEM ===
  const slide3 = slideBase([
    badge('DAS PROBLEM'),
    headline('Viele verstecken das Wichtigste.', 52),
    subline('Wertversprechen, CTA und Vertrauen rutschen nach unten.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('Slider ohne Aussage', 'Großes Bild, aber keine erkennbare Botschaft', true),
      tagCard('Generische Stock-Fotos', 'Wirken wie Werbung und werden ausgeblendet', true),
      tagCard('CTA erst nach mehrfachem Scrollen', 'Der nächste Schritt bleibt lange unsichtbar', true)),
    keyLearning('Das Ergebnis: Viele Besucher:innen sind weg, bevor die Kernbotschaft ankommt.', true),
    footer(),
  ]);

  // === SLIDE 4: ERWARTUNG VS. REALITÄT ===
  const slide4 = slideBase([
    badge('ERWARTUNG VS. REALITÄT'),
    headline('"Die scrollen schon, wenn’s passt."', 48),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('ERWARTUNG', 'Wer Interesse hat, scrollt automatisch weiter nach unten.', 'REALITÄT', 'Ohne erkennbaren Grund zum Weiterscrollen bleibt der erste Blick der einzige Blick.')),
    keyLearning('Interesse entsteht oben — oder gar nicht.'),
    footer(),
  ]);

  // === SLIDE 5: WAS GEHÖRT NACH OBEN ===
  const slide5 = slideBase([
    badge('WAS GEHÖRT NACH OBEN'),
    headline('3 Dinge, die sofort sichtbar sein müssen.', 48),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('Klares Wertversprechen', 'In Sekunden verständlich: Was wird angeboten, für wen?'),
      tagCard('Ein primärer CTA', 'Genau ein nächster Schritt, nicht mehrere gleichwertige'),
      tagCard('Ein Vertrauenssignal', 'Z.B. eine echte Referenz oder ein konkretes Ergebnis')),
    keyLearning('Alles Weitere darf folgen — diese drei nicht.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Above the Fold ist kein fester Pixelwert.', 46),
    subline('Die Position variiert je Gerät — das Prinzip bleibt gleich.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(foldStackSvg(), 700, 400))),
    keyLearning('Teste auf echten Geräten, nicht nur am großen Desktop-Monitor.'),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('4 Learnings für den ersten Blick.', 48),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('01', 'Wertversprechen in Sekunden verständlich machen', 25),
      learningCard('02', 'Primären CTA ohne Scrollen zeigen', 50),
      learningCard('03', 'Ein Vertrauenssignal direkt sichtbar platzieren', 75),
      learningCard('04', 'Auf echten Geräten testen, nicht nur am Monitor', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Was sieht deine Website im ersten Blick?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-11-04', 'slides');

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
