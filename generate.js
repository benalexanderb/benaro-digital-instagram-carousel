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

  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: pct === 100 ? C.green : C.accent2, minWidth: '56px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, text)),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===

  // Goldenes Siegel, umgeben von einem gestrichelten Ring: ein Trust-Badge,
  // das zwar vorhanden, aber visuell "übersehen" wird.
  function ignoredSealSvg() {
    return `<svg width="620" height="380" viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg">
      <circle cx="310" cy="170" r="150" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="3" stroke-dasharray="5 11"/>
      <circle cx="310" cy="170" r="108" fill="rgba(203,163,92,0.14)" stroke="#CBA35C" stroke-width="4"/>
      <circle cx="310" cy="170" r="70" fill="none" stroke="#CBA35C" stroke-width="3" stroke-dasharray="8 8"/>
      <path d="M252 258 L270 332 L310 300 L350 332 L368 258" fill="rgba(203,163,92,0.18)" stroke="#CBA35C" stroke-width="3" stroke-linejoin="round"/>
    </svg>`;
  }

  // Dokument-/Zitat-Karte mit Quellenangabe (Forschung).
  function quoteDocSvg() {
    return `<svg width="800" height="280" viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="780" height="260" rx="22" fill="rgba(255,255,255,0.05)" stroke="rgba(203,163,92,0.5)" stroke-width="2"/>
      <rect x="48" y="52" width="60" height="10" rx="5" fill="#CBA35C"/>
      <rect x="48" y="90" width="704" height="12" rx="6" fill="rgba(255,255,255,0.22)"/>
      <rect x="48" y="118" width="660" height="12" rx="6" fill="rgba(255,255,255,0.22)"/>
      <rect x="48" y="146" width="560" height="12" rx="6" fill="rgba(255,255,255,0.22)"/>
      <rect x="48" y="200" width="220" height="34" rx="17" fill="rgba(203,163,92,0.16)" stroke="#CBA35C" stroke-width="2"/>
    </svg>`;
  }

  // Vertrauens-Messgeraet: Zeiger faellt von hoch (gruen) auf niedrig (rot).
  function trustGaugeSvg() {
    return `<svg width="700" height="380" viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
      <path d="M90 300 A 260 260 0 0 1 610 300" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="28" stroke-linecap="round"/>
      <path d="M90 300 A 260 260 0 0 1 350 44" fill="none" stroke="#10B981" stroke-width="28" stroke-linecap="round"/>
      <path d="M350 44 A 260 260 0 0 1 480 90" fill="none" stroke="#EF4444" stroke-width="28" stroke-linecap="round"/>
      <circle cx="350" cy="300" r="16" fill="#FFFFFF"/>
      <line x1="350" y1="300" x2="470" y2="150" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      <path d="M470 150 L 450 170 L 490 190 Z" fill="#EF4444"/>
    </svg>`;
  }

  // Dokument mit gruenem Haken: gesetzliche Pflicht + Prinzip.
  function lawDocSvg() {
    return `<svg width="620" height="380" viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg">
      <rect x="110" y="20" width="400" height="340" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <rect x="150" y="70" width="320" height="14" rx="7" fill="rgba(255,255,255,0.22)"/>
      <rect x="150" y="104" width="260" height="14" rx="7" fill="rgba(255,255,255,0.22)"/>
      <rect x="150" y="138" width="300" height="14" rx="7" fill="rgba(255,255,255,0.22)"/>
      <rect x="150" y="190" width="320" height="2" fill="rgba(255,255,255,0.12)"/>
      <circle cx="310" cy="280" r="46" fill="rgba(16,185,129,0.16)" stroke="#10B981" stroke-width="3"/>
      <path d="M288 282 L302 296 L336 258" fill="none" stroke="#10B981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('WUSSTEST DU?'),
    headline('Ein Trust-Siegel allein überzeugt niemanden.', 46),
    subline('Besucher:innen suchen zuerst etwas ganz anderes.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(ignoredSealSvg(), 620, 380))),
    keyLearning('Ein Siegel wird oft einfach überblättert — wie Werbung.', true),
    footer(),
  ]);

  // === SLIDE 2: DIE FORSCHUNG ===
  const slide2 = slideBase([
    badge('DIE FORSCHUNG'),
    headline('Stanford hat gemessen, was wirklich zählt', 42),
    subline('Die Studie zur Glaubwürdigkeit von Websites.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(quoteDocSvg(), 700, 245)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.gold, textAlign: 'center', lineHeight: '1.4' } },
          'Stanford Persuasive Technology Lab (Fogg et al., 2002)'))),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE ===
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Ohne echten Bezug sinkt das Vertrauen in alles', 38),
    subline('Auch wenn Angebot und Inhalt eigentlich stimmen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(trustGaugeSvg(), 600, 326)),
      h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' } },
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, 'VERTRAUEN'),
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 800, fontFamily: 'Manrope', color: C.red } }, '↓'))),
    keyLearning('Fehlt der reale Bezug, wirkt selbst echter Inhalt unglaubwürdig.', true),
    footer(),
  ]);

  // === SLIDE 4: DER WENDEPUNKT ===
  const slide4 = slideBase([
    badge('DER WENDEPUNKT'),
    headline('Erwartung vs. Realität', 52),
    subline('Was Websitebetreiber:innen glauben — und was zählt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      contrastCards(
        'ERWARTUNG',
        'Ein Siegel reicht als Vertrauensbeweis',
        'REALITÄT',
        'Echte Kontaktangaben wiegen schwerer',
      )),
    footer(),
  ]);

  // === SLIDE 5: REAL-WORLD FEEL ===
  const slide5 = slideBase([
    badge('REAL-WORLD FEEL'),
    headline('Was konkret den Unterschied macht', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('ECHTE ADRESSE', 'Physischer Standort sichtbar statt nur ein Formular'),
      tagCard('ECHTER ANSPRECHPARTNER', 'Name und Gesicht statt anonymes „Team“'),
      tagCard('TELEFON ODER CHAT', 'Direkt erreichbar, nicht nur eine E-Mail-Adresse')),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Das ist nicht nur Nice-to-have', 48),
    subline('In Deutschland ist ein vollständiges Impressum Pflicht.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(lawDocSvg(), 560, 345))),
    keyLearning('Transparenz ist gesetzliche Basis und Vertrauenssignal zugleich.'),
    footer(),
  ]);

  // === SLIDE 7: KONKRET HEISST DAS ===
  const slide7 = slideBase([
    badge('KONKRET HEISST DAS'),
    headline('4 Schritte zu echtem Vertrauen', 42),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('1', 'Vollständiges Impressum klar verlinken', 25),
      learningCard('2', 'Echte Adresse und Ansprechpartner zeigen', 50),
      learningCard('3', 'Telefon oder Chat direkt anbieten', 75),
      learningCard('4', 'Echte Fotos statt Stockmaterial nutzen', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Wie leicht ist es, dich auf deiner Website wirklich zu erreichen?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || '2026-11-17';
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
