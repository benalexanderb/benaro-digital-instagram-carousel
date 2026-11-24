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

  function codeWindow(lines, danger = false) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.32)',
      border: `1px solid ${danger ? C.red : C.cardBorder}`, borderRadius: '18px', overflow: 'hidden', width: '100%',
    } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 22px', backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: `1px solid ${C.cardBorder}` } },
        h('div', { style: { display: 'flex', width: '13px', height: '13px', borderRadius: '7px', backgroundColor: '#EF4444' } }),
        h('div', { style: { display: 'flex', width: '13px', height: '13px', borderRadius: '7px', backgroundColor: '#CBA35C' } }),
        h('div', { style: { display: 'flex', width: '13px', height: '13px', borderRadius: '7px', backgroundColor: '#10B981' } }),
        h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, marginLeft: '8px' } }, 'index.html')),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '26px 28px' } },
        ...lines.map((line) => h('span', { style: {
          display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter',
          color: line.color || C.textSoft, lineHeight: '1.5',
        } }, line.text))));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===

  // Smartphone mit verbotenem Zoom-Gestensymbol (durchgestrichene Lupe)
  function zoomBlockedSvg() {
    return `<svg width="300" height="420" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="280" height="400" rx="32" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <rect x="40" y="52" width="150" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="40" y="82" width="220" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="40" y="112" width="190" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="40" y="142" width="220" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="40" y="172" width="130" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <circle cx="150" cy="300" r="62" fill="rgba(239,68,68,0.12)" stroke="#EF4444" stroke-width="5"/>
      <circle cx="137" cy="287" r="26" fill="none" stroke="#EF4444" stroke-width="7"/>
      <line x1="156" y1="306" x2="178" y2="328" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
      <line x1="112" y1="340" x2="188" y2="264" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  }

  // Zwei Pfeile, die nach aussen zeigen = Zoom erlaubt (Pinch-to-zoom-Geste)
  function zoomAllowedSvg() {
    return `<svg width="300" height="420" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="280" height="400" rx="32" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <rect x="40" y="52" width="150" height="16" rx="8" fill="rgba(255,255,255,0.18)"/>
      <rect x="40" y="82" width="220" height="24" rx="8" fill="rgba(0,194,184,0.22)"/>
      <rect x="40" y="118" width="190" height="24" rx="8" fill="rgba(0,194,184,0.22)"/>
      <rect x="40" y="154" width="220" height="24" rx="8" fill="rgba(0,194,184,0.22)"/>
      <circle cx="150" cy="300" r="62" fill="rgba(0,194,184,0.14)" stroke="#00C2B8" stroke-width="5"/>
      <line x1="150" y1="270" x2="150" y2="252" stroke="#00C2B8" stroke-width="7" stroke-linecap="round"/>
      <path d="M140 262 L150 250 L160 262" fill="none" stroke="#00C2B8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="150" y1="330" x2="150" y2="348" stroke="#00C2B8" stroke-width="7" stroke-linecap="round"/>
      <path d="M140 338 L150 350 L160 338" fill="none" stroke="#00C2B8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // Augensymbol mit Vergroesserungs-Ring -- steht fuer Sehbehinderung / Low Vision
  function eyeSvg() {
    return `<svg width="240" height="160" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 80 Q120 10 230 80 Q120 150 10 80 Z" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="5"/>
      <circle cx="120" cy="80" r="34" fill="rgba(41,82,255,0.18)" stroke="#2952FF" stroke-width="5"/>
      <circle cx="120" cy="80" r="12" fill="#2952FF"/>
      <circle cx="176" cy="128" r="40" fill="none" stroke="#00C2B8" stroke-width="6"/>
      <line x1="205" y1="157" x2="228" y2="180" stroke="#00C2B8" stroke-width="7" stroke-linecap="round"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('ACHTUNG'),
    headline('Dein Zoom-Verbot sperrt Menschen aus', 46),
    subline('Viele Websites verhindern per Code, dass Besucher:innen auf dem Handy hineinzoomen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' } },
      svgImg(zoomBlockedSvg(), 280, 392)),
    keyLearning('Wer schlechter sieht, kann sich dann nicht mehr helfen.', true),
    footer(),
  ]);

  // === SLIDE 2: DAS PROBLEM ===
  const slide2 = slideBase([
    badge('DAS PROBLEM'),
    headline('Eine einzige Zeile Code blockiert den Zoom', 42),
    subline('Der viewport-Meta-Tag im <head> steuert, ob Pinch-to-Zoom auf dem Smartphone funktioniert.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      codeWindow([
        { text: '<meta name="viewport"', color: C.textSoft },
        { text: '  content="width=device-width,', color: C.textSoft },
        { text: '  user-scalable=no">', color: C.red },
      ], true),
      tagCard('OFT UNABSICHTLICH', '„user-scalable=no" wird häufig kopiert, ohne die Folgen zu kennen', true)),
    footer(),
  ]);

  // === SLIDE 3: WER BETROFFEN IST ===
  const slide3 = slideBase([
    badge('WEN ES TRIFFT'),
    headline('Nicht nur Menschen mit Sehbehinderung', 42),
    subline('Auch ältere Nutzer:innen, Menschen mit Brille oder einfach kleine Displays brauchen Zoom.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(eyeSvg(), 420, 280)),
      tagCard('ZOOM IST EINE HILFE', 'Für viele Menschen der einzige Weg, Text auf dem Handy zu lesen')),
    footer(),
  ]);

  // === SLIDE 4: DIE REGEL ===
  const slide4 = slideBase([
    badge('DIE OFFIZIELLE REGEL'),
    headline('WCAG verlangt: Zoom bis 200% muss möglich sein', 38),
    subline('Das Erfolgskriterium 1.4.4 "Resize Text" ist Teil des WCAG-2.1-Standards des W3C.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      quoteBox('"Text kann ohne assistierende Technologie bis zu 200% skaliert werden, ohne Inhalt oder Funktion zu verlieren."', 'WCAG 2.1 · ERFOLGSKRITERIUM 1.4.4 · W3C')),
    footer(),
  ]);

  // === SLIDE 5: FALSCH VS RICHTIG ===
  const slide5 = slideBase([
    badge('FALSCH VS. RICHTIG'),
    headline('Ein Attribut macht den Unterschied', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      codeWindow([
        { text: 'FALSCH:', color: C.red },
        { text: 'content="width=device-width,', color: C.textMuted },
        { text: '  user-scalable=no">', color: C.textMuted },
      ], true),
      codeWindow([
        { text: 'RICHTIG:', color: C.accent2 },
        { text: 'content="width=device-width,', color: C.textSoft },
        { text: '  initial-scale=1">', color: C.text },
      ])),
    footer(),
  ]);

  // === SLIDE 6: IN DER PRAXIS ===
  const slide6 = slideBase([
    badge('IN DER PRAXIS'),
    headline('So fühlt sich der Unterschied an', 44),
    subline('Richtig eingestellt kann jede:r mit einer Pinch-Geste frei heranzoomen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' } },
      svgImg(zoomAllowedSvg(), 280, 392)),
    keyLearning('Einfach "user-scalable=no" und "maximum-scale=1" entfernen oder weglassen.'),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('Die 3 wichtigsten Learnings', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('01', 'Viewport-Meta-Tag deiner Website prüfen', 34),
      learningCard('02', '"user-scalable=no" und "maximum-scale=1" entfernen', 67),
      learningCard('03', 'WCAG 1.4.4 verlangt Zoom bis 200% ohne Funktionsverlust', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Kann man auf deiner Seite noch zoomen?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || '2026-11-24';
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
