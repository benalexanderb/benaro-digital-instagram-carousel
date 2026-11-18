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

  // Footer-Mockup: dunkle Seite, unten rechts ein winziger, kaum lesbarer
  // grauer "Impressum"-Link-Platzhalter.
  function hiddenFooterSvg() {
    return `<svg width="820" height="300" viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="820" height="300" rx="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
      <rect x="40" y="40" width="300" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <rect x="40" y="76" width="220" height="16" rx="8" fill="rgba(255,255,255,0.14)"/>
      <line x1="40" y1="230" x2="780" y2="230" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <rect x="690" y="252" width="90" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <circle cx="760" cy="259" r="26" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="4 5"/>
    </svg>`;
  }

  // Lupe ueber einem Fragezeichen-Kreis: "schwer auffindbar".
  function magnifierSvg() {
    return `<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <circle cx="68" cy="68" r="44" fill="rgba(255,255,255,0.05)" stroke="#9AA0AB" stroke-width="5"/>
      <line x1="100" y1="100" x2="140" y2="140" stroke="#9AA0AB" stroke-width="8" stroke-linecap="round"/>
      <circle cx="68" cy="68" r="4" fill="#9AA0AB"/>
    </svg>`;
  }

  // Zwei Gesetzes-Karten: TMG/DDG Paragraf und DSGVO-Artikel.
  function lawDocSvg() {
    return `<svg width="800" height="260" viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="380" height="240" rx="20" fill="rgba(255,255,255,0.05)" stroke="#2952FF" stroke-width="2"/>
      <rect x="40" y="46" width="70" height="38" rx="10" fill="rgba(41,82,255,0.18)"/>
      <rect x="40" y="110" width="320" height="12" rx="6" fill="rgba(255,255,255,0.2)"/>
      <rect x="40" y="134" width="260" height="12" rx="6" fill="rgba(255,255,255,0.2)"/>
      <rect x="410" y="10" width="380" height="240" rx="20" fill="rgba(255,255,255,0.05)" stroke="#00C2B8" stroke-width="2"/>
      <rect x="440" y="46" width="70" height="38" rx="10" fill="rgba(0,194,184,0.18)"/>
      <rect x="440" y="110" width="320" height="12" rx="6" fill="rgba(255,255,255,0.2)"/>
      <rect x="440" y="134" width="260" height="12" rx="6" fill="rgba(255,255,255,0.2)"/>
    </svg>`;
  }

  // 4 Badge-Kreise fuer E-E-A-T, der vierte (Trust) hervorgehoben.
  function eeatBadgesSvg() {
    return `<svg width="820" height="200" viewBox="0 0 820 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="110" cy="100" r="80" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <circle cx="310" cy="100" r="80" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <circle cx="510" cy="100" r="80" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <circle cx="710" cy="100" r="80" fill="rgba(41,82,255,0.18)" stroke="#2952FF" stroke-width="5"/>
    </svg>`;
  }

  // Nummerierte Liste: Haken-Icons fuer die Impressums-Checkliste.
  function checkDotSvg(color) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="rgba(0,194,184,0.14)" stroke="${color}" stroke-width="2.5"/>
      <path d="M12 21 L18 27 L28 14" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // Zwei Browser-Footer-Mockups: klein/grau vs. groß/lesbar verlinkt.
  function footerCompareSvg(good) {
    const linkColor = good ? '#00C2B8' : '#5A5F68';
    const linkW = good ? 160 : 70;
    const linkH = good ? 20 : 10;
    return `<svg width="380" height="220" viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="380" height="220" rx="18" fill="rgba(255,255,255,0.04)" stroke="${good ? '#00C2B8' : 'rgba(255,255,255,0.1)'}" stroke-width="2"/>
      <rect x="28" y="30" width="200" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <rect x="28" y="56" width="140" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <line x1="28" y1="150" x2="352" y2="150" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <rect x="28" y="178" width="${linkW}" height="${linkH}" rx="${linkH / 2}" fill="${linkColor}"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('VERTRAUENS-CHECK'),
    headline('Dein Impressum ist mehr als eine Pflicht.', 50),
    subline('Die meisten Websites verstecken es — und das kostet Vertrauen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(hiddenFooterSvg(), 680, 249)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.textMuted, letterSpacing: '1px' } }, 'kaum lesbar, ganz unten rechts'))),
    keyLearning('Winzig und grau versteckt wirkt wie "hat was zu verstecken".', true),
    footer(),
  ]);

  // === SLIDE 2: DAS PROBLEM ===
  const slide2 = slideBase([
    badge('DAS PROBLEM'),
    headline('Klein, grau, versteckt — und das wirkt verdächtig', 42),
    subline('Viele Websites behandeln Impressum & Datenschutz als lästige Pflicht.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(magnifierSvg(), 160, 160)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        tagCard('SCHWER FINDBAR', 'Link nur ganz unten, oft erst nach langem Scrollen', true),
        tagCard('KAUM LESBAR', 'Winzige Schriftgröße, blasses Grau auf dunklem Grund', true))),
    footer(),
  ]);

  // === SLIDE 3: RECHTLICHE PFLICHT ===
  const slide3 = slideBase([
    badge('KEINE KÜR, SONDERN PFLICHT'),
    headline('Zwei Gesetze verlangen das', 46),
    subline('Für geschäftsmäßige Websites in Deutschland.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(lawDocSvg(), 720, 234)),
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '4px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent } }, 'DDG § 5 (vormals TMG)'),
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.35' } }, 'Anbieterkennzeichnung: Name, Anschrift, Kontakt')),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '4px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, 'DSGVO Art. 13'),
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.35' } }, 'Informationspflicht bei Datenerhebung')))),
    footer(),
  ]);

  // === SLIDE 4: GOOGLE-SIGNAL ===
  const slide4 = slideBase([
    badge('AUCH GOOGLE SCHAUT GENAU HIN'),
    headline('Trust ist das wichtigste E-E-A-T-Signal', 42),
    subline('Google nennt Kontaktangaben & Impressum als Beispiel dafür.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(eeatBadgesSvg(), 820, 200)),
      h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
        h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, width: '160px', textAlign: 'center', justifyContent: 'center' } }, 'Experience'),
        h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, width: '160px', textAlign: 'center', justifyContent: 'center' } }, 'Expertise'),
        h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, width: '160px', textAlign: 'center', justifyContent: 'center' } }, 'Authority'),
        h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent, width: '160px', textAlign: 'center', justifyContent: 'center' } }, 'Trust'))),
    keyLearning('Googles Search Quality Rater Guidelines führen Trust als wichtigstes der vier Signale.'),
    footer(),
  ]);

  // === SLIDE 5: CHECKLISTE ===
  const slide5 = slideBase([
    badge('DIE CHECKLISTE'),
    headline('Was wirklich ins Impressum gehört', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      tagCard('NAME & ANSCHRIFT', 'Vollständige Adresse des Unternehmens'),
      tagCard('DIREKTE KONTAKTMÖGLICHKEIT', 'E-Mail oder Telefon, nicht nur ein Formular'),
      tagCard('VERTRETUNGSBERECHTIGTE', 'Bei Kapitalgesellschaften namentlich genannt'),
      tagCard('HANDELSREGISTER / UST-ID', 'Falls vorhanden, mit Registernummer')),
    footer(),
  ]);

  // === SLIDE 6: PRAXIS-REGEL ===
  const slide6 = slideBase([
    badge('DIE PRAXIS-REGEL'),
    headline('Sichtbar statt versteckt', 48),
    subline('Auf jeder Seite verlinkt, in maximal 2 Klicks erreichbar.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', gap: '20px', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, 'SO NICHT'),
          svgImg(footerCompareSvg(false), 340, 196)),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.accent2 } }, 'SO BESSER'),
          svgImg(footerCompareSvg(true), 340, 196)))),
    keyLearning('Fester Footer-Link auf jeder Seite, gut lesbare Schriftgröße und Kontrast.'),
    footer(),
  ]);

  // === SLIDE 7: ERGEBNIS ===
  const slide7 = slideBase([
    badge('DAS ERGEBNIS'),
    headline('Sichtbarkeit schafft Vertrauen', 46),
    subline('Nicht nur bei Besuchern — auch bei Google.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('VERSTECKT', 'Wirkt unsicher, wie "hat was zu verstecken"', 'SICHTBAR', 'Wirkt neutral, professionell, vertrauenswürdig')),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '40px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Ist dein Impressum leicht zu finden — oder versteckt?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || '2026-11-13';
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
