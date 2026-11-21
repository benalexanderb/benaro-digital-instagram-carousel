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

  function quoteBox(text, source) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px' } },
      h('div', { style: { display: 'flex', width: '48px', height: '6px', backgroundColor: C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.45' } }, text),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', color: C.textMuted, letterSpacing: '1px' } }, source));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===

  // Abnehmende Balkenbreite: weniger Leser erreichen weiter unten liegende Abschnitte.
  function attentionFunnelSvg() {
    return `<svg width="780" height="300" viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="700" height="62" rx="14" fill="rgba(0,194,184,0.18)" stroke="#00C2B8" stroke-width="2.5"/>
      <rect x="130" y="119" width="520" height="62" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" stroke-width="2.5"/>
      <rect x="230" y="218" width="320" height="62" rx="14" fill="rgba(239,68,68,0.14)" stroke="#EF4444" stroke-width="2.5"/>
    </svg>`;
  }

  // Lange Seite: oben grauer Textblock (Vorgeplaenkel), unten unter dem Fold
  // erst die eigentliche Botschaft, farblich hervorgehoben.
  function buriedMessageSvg() {
    return `<svg width="320" height="420" viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="320" height="420" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <rect x="28" y="30" width="264" height="14" rx="7" fill="rgba(255,255,255,0.16)"/>
      <rect x="28" y="56" width="220" height="14" rx="7" fill="rgba(255,255,255,0.16)"/>
      <rect x="28" y="82" width="240" height="14" rx="7" fill="rgba(255,255,255,0.16)"/>
      <rect x="28" y="120" width="264" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <rect x="28" y="146" width="200" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <rect x="28" y="172" width="230" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
      <line x1="0" y1="212" x2="320" y2="212" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 6"/>
      <rect x="28" y="252" width="264" height="60" rx="12" fill="rgba(0,194,184,0.18)" stroke="#00C2B8" stroke-width="2.5"/>
      <circle cx="292" cy="238" r="10" fill="#EF4444"/>
    </svg>`;
  }

  // Pyramiden-Dreieck: klassisch (Spitze oben, Basis unten) vs. umgekehrt
  // (Basis oben, Spitze unten) -- das Thema wortwoertlich als Form.
  function pyramidSvg(inverted, color) {
    const shape = inverted
      ? `<path d="M20,20 L220,20 L120,220 Z" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="4"/>`
      : `<path d="M120,20 L220,220 L20,220 Z" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="4"/>`;
    return `<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">${shape}</svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('ACHTUNG'),
    headline('Kaum einer liest deine Seite bis zum Ende', 46),
    subline('Besucher scrollen und scannen – aber lesen nur selten linear bis zum Schluss.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(attentionFunnelSvg(), 700, 270)),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '60px' } },
        h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Anfang'),
        h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Mitte'),
        h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 600, fontFamily: 'Inter', color: C.red } }, 'Ende'))),
    keyLearning('Steht deine Kernbotschaft erst ganz unten, sehen viele sie nie.', true),
    footer(),
  ]);

  // === SLIDE 2: DAS PROBLEM ===
  const slide2 = slideBase([
    badge('DAS PROBLEM'),
    headline('Die wichtigste Botschaft landet oft ganz unten', 42),
    subline('Viele Websites bauen sich auf wie eine Geschichte: erst Kontext, dann die Pointe.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(buriedMessageSvg(), 300, 394)),
      tagCard('UNTER DEM FOLD', 'Die eigentliche Aussage steht erst nach viel Vorgeplänkel', true)),
    footer(),
  ]);

  // === SLIDE 3: DIE LÖSUNG (UMGEKEHRTE PYRAMIDE) ===
  const slide3 = slideBase([
    badge('DIE LÖSUNG AUS DEM JOURNALISMUS'),
    headline('Die umgekehrte Pyramide dreht die Reihenfolge um', 40),
    subline('Journalist:innen kennen das Problem seit Jahrzehnten – und lösen es strukturell.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', gap: '20px', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' } },
          svgImg(pyramidSvg(false, C.textMuted), 220, 220),
          h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '1.5px', color: C.textMuted, textAlign: 'center' } }, 'KLASSISCHER AUFBAU')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' } },
          svgImg(pyramidSvg(true, C.accent2), 220, 220),
          h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '1.5px', color: C.accent2, textAlign: 'center' } }, 'UMGEKEHRTE PYRAMIDE')))),
    keyLearning('Wichtigstes zuerst, Details und Hintergrund erst danach.'),
    footer(),
  ]);

  // === SLIDE 4: DIE METHODE ===
  const slide4 = slideBase([
    badge('DIE METHODE'),
    headline('Drei Ebenen, eine klare Reihenfolge', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('01 · FAZIT', 'Das Ergebnis oder Kernversprechen direkt im ersten Satz'),
      tagCard('02 · BEGRÜNDUNG', 'Der wichtigste Beleg oder Nutzen dafür'),
      tagCard('03 · HINTERGRUND', 'Details, Kontext und Nebeninfos ganz am Ende')),
    footer(),
  ]);

  // === SLIDE 5: DIE QUELLE ===
  const slide5 = slideBase([
    badge('BELEGT SEIT 1996'),
    headline('Keine neue Idee, sondern UX-Standard', 42),
    subline('Beschrieben in "Inverted Pyramids in Cyberspace", seitdem vielfach bestätigt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      quoteBox('"Nutzer:innen lesen Webseiten nicht linear – sie scannen und steigen oft vorzeitig aus."', 'JAKOB NIELSEN · NIELSEN NORMAN GROUP, 1996')),
    footer(),
  ]);

  // === SLIDE 6: IN DER PRAXIS ===
  const slide6 = slideBase([
    badge('IN DER PRAXIS'),
    headline('So wirkt es auf deiner Startseite', 42),
    subline('Der Unterschied zeigt sich schon im ersten Satz deiner Hero-Section.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('LANGER ANLAUF', 'Erst Firmengeschichte, dann irgendwann das Angebot', 'SOFORT KLAR', 'Angebot und Nutzen stehen direkt im ersten Satz')),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('Die 3 wichtigsten Learnings', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('01', 'Fazit zuerst formulieren, nicht erst aufbauen', 34),
      learningCard('02', 'Details und Hintergrund kommen erst danach', 67),
      learningCard('03', 'So bleibt die Kernaussage auch bei Absprung erhalten', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Steht das Wichtigste bei dir ganz oben – oder ganz unten?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen, das wirkt.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || '2026-11-21';
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
