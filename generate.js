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

  // Dokument-/Zitat-Karte mit Quellenangabe (fuer Gesetzestext/Zitat).
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

  // === SLIDE 1: HOOK — Footer-Mockup mit Impressum/Datenschutz-Pills ===
  const slide1 = slideBase([
    badge('WAHRSCHEINLICH ÜBERSPRUNGEN'),
    headline('Niemand liest dein Impressum.', 50),
    subline('Trotzdem merkt jeder, ob es da ist.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: {
        display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`,
        borderRadius: '20px', padding: '30px 34px', gap: '22px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, '© 2026 deinefirma.de'),
        h('div', { style: { display: 'flex', width: '100%', height: '2px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', gap: '14px' } },
          h('div', { style: {
            display: 'flex', backgroundColor: 'rgba(0,194,184,0.14)', border: `1px solid ${C.accent2}`,
            borderRadius: '14px', padding: '14px 24px',
          } }, h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, 'Impressum')),
          h('div', { style: {
            display: 'flex', backgroundColor: 'rgba(0,194,184,0.14)', border: `1px solid ${C.accent2}`,
            borderRadius: '14px', padding: '14px 24px',
          } }, h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, 'Datenschutz'))))),
    keyLearning('Und trotzdem wird es oft behandelt wie reines Kleingedrucktes.'),
    footer(),
  ]);

  // === SLIDE 2: 3 IRRTÜMER ===
  const slide2 = slideBase([
    badge('3 IRRTÜMER'),
    headline('Diese Denkfehler kosten Vertrauen', 42),
    subline('Noch bevor ein Besucher den ersten Satz liest.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('NUR FÜR JURISTEN', 'Rechtliches Kleingedrucktes, das niemanden interessiert', true),
      tagCard('VERSTECKT IM FOOTER', 'Klein, grau, ganz unten — Hauptsache gesetzlich vorhanden', true),
      tagCard('INHALT EGAL', 'Hauptsache ein Link existiert, der Wortlaut spielt keine Rolle', true)),
    footer(),
  ]);

  // === SLIDE 3: GOOGLE SIEHT DAS ANDERS (E-E-A-T) ===
  const eeatLetters = [
    { l: 'E', active: false }, { l: 'E', active: false }, { l: 'A', active: false }, { l: 'T', active: true },
  ];
  const slide3 = slideBase([
    badge('GOOGLE SIEHT DAS ANDERS'),
    headline('Transparenz zählt zur Bewertung', 44),
    subline('E-E-A-T bewertet u.a. echte Kontaktangaben.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '16px' } },
        ...eeatLetters.map((e) => h('div', { style: {
          display: 'flex', width: '140px', height: '140px', borderRadius: '24px', alignItems: 'center', justifyContent: 'center',
          backgroundColor: e.active ? C.accent2 : C.cardBg, border: `1px solid ${e.active ? C.accent2 : C.cardBorder}`,
        } }, h('span', { style: { display: 'flex', fontSize: '64px', fontWeight: 800, fontFamily: 'Manrope', color: e.active ? '#0B0D10' : C.textMuted } }, e.l)))),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, textAlign: 'center', justifyContent: 'center' } },
        'Experience · Expertise · Authoritativeness · Trustworthiness')),
    keyLearning('Quelle: Google Search Quality Rater Guidelines (E-E-A-T).'),
    footer(),
  ]);

  // === SLIDE 4: CHECKOUT-FORSCHUNG (Funnel) ===
  const slide4 = slideBase([
    badge('CHECKOUT-FORSCHUNG'),
    headline('Unsicherheit kostet Konversion', 44),
    subline('Unklare Kontakt- und Datenangaben wirken wie ein Risiko.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '22px 28px' } },
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft } }, 'Besucher auf der Seite')),
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '78%', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '22px 28px' } },
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft } }, 'Starten den Checkout')),
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '52%', backgroundColor: 'rgba(239,68,68,0.16)', border: `1px solid ${C.red}`, borderRadius: '16px', padding: '22px 28px' } },
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Inter', color: C.red } }, 'Brechen bei Unsicherheit ab'))),
    keyLearning('Quelle: Baymard Institute — Checkout-Usability-Forschung.', true),
    footer(),
  ]);

  // === SLIDE 5: SEIT 2018 PFLICHT (DSGVO Art. 13) ===
  const slide5 = slideBase([
    badge('SEIT 2018 PFLICHT'),
    headline('Transparenz ist EU-Recht', 48),
    subline('Art. 13 DSGVO verlangt klare Angaben zur Datenerhebung.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(quoteDocSvg(), 700, 245)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.gold, textAlign: 'center', lineHeight: '1.4' } },
          'DSGVO, Art. 13 — Informationspflicht, EU-weit seit 25.05.2018'))),
    keyLearning('Pflicht und Vertrauens-Hebel schließen sich nicht aus.'),
    footer(),
  ]);

  // === SLIDE 6: ZWEI WEGE, DIESELBE PFLICHT ===
  const slide6 = slideBase([
    badge('ZWEI WEGE, DIESELBE PFLICHT'),
    headline('Nur erfüllt oder wirklich genutzt?', 42),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards(
        'NUR ERFÜLLT',
        'Juristendeutsch, versteckter Link, veraltete Adresse',
        'ECHT GENUTZT',
        'Klartext, sichtbar in Header & Footer, aktuelle Kontaktdaten',
      )),
    footer(),
  ]);

  // === SLIDE 7: 4 STELLSCHRAUBEN ===
  const slide7 = slideBase([
    badge('IN 10 MINUTEN UMSETZBAR'),
    headline('4 Stellschrauben für mehr Vertrauen', 40),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('1', 'Link in Header UND Footer sichtbar platzieren', 25),
      learningCard('2', 'Erste Sätze in Klartext statt Juristendeutsch', 50),
      learningCard('3', 'Echte, aktuelle Kontaktdaten angeben', 75),
      learningCard('4', 'Einmal im Jahr prüfen und aktualisieren', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '40px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Wann hast du dein Impressum zuletzt geprüft?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, 'output', `carousel_${todayDir}`, 'slides');
  fs.mkdirSync(outDir, { recursive: true });

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
