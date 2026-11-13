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

  // Countdown-Widget-Mockup: Karte mit Ablauf-Label, Timer-Zahlen und einem
  // Reset-Pfeil-Icon, das andeutet, dass der Timer nach 00:00 neu startet.
  function countdownWidgetSvg() {
    return `<svg width="760" height="300" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="720" height="260" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
      <rect x="60" y="150" width="140" height="92" rx="14" fill="rgba(239,68,68,0.16)" stroke="#EF4444" stroke-width="2"/>
      <rect x="220" y="150" width="140" height="92" rx="14" fill="rgba(239,68,68,0.16)" stroke="#EF4444" stroke-width="2"/>
      <rect x="380" y="150" width="140" height="92" rx="14" fill="rgba(239,68,68,0.16)" stroke="#EF4444" stroke-width="2"/>
      <circle cx="630" cy="196" r="60" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <path d="M650 170 A 36 36 0 1 1 610 172" fill="none" stroke="#9AA0AB" stroke-width="7" stroke-linecap="round"/>
      <path d="M650 170 L 660 158 L 666 174 Z" fill="#9AA0AB"/>
    </svg>`;
  }

  // Drei Zeilen, jede mit einem Warn-Punkt: die drei Dark-Pattern-Tricks.
  function darkPatternsListSvg() {
    return `<svg width="820" height="230" viewBox="0 0 820 230" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="820" height="60" rx="16" fill="rgba(255,255,255,0.04)"/>
      <rect x="0" y="85" width="820" height="60" rx="16" fill="rgba(255,255,255,0.04)"/>
      <rect x="0" y="170" width="820" height="60" rx="16" fill="rgba(255,255,255,0.04)"/>
    </svg>`;
  }

  // Vertrauens-Messgerät: Zeiger faellt von hoch (gruen) auf niedrig (rot).
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

  // Dokument-/Zitat-Karte mit Quellenangabe.
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

  // Zwei Karten mit Pfeil dazwischen: ein Trick entdeckt -> alle Signale wirken unglaubwuerdig.
  function spreadArrowSvg() {
    return `<svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(255,255,255,0.3)" stroke-width="5" stroke-linecap="round"/>
      <path d="M90 40 L 70 24 M90 40 L 70 56" stroke="rgba(255,255,255,0.3)" stroke-width="5" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  // Echt vs. erfunden: Haken-Kreis gruen, X-Kreis rot.
  function checkCircleSvg(color) {
    return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="${color === C.green ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.16)'}" stroke="${color}" stroke-width="3"/>
      ${color === C.green
        ? `<path d="M20 33 L 28 41 L 44 23" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path d="M22 22 L 42 42 M42 22 L 22 42" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`}
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('ACHTUNG'),
    headline('Dein Countdown-Timer lügt.', 54),
    subline('Und deine Kund:innen merken das.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(countdownWidgetSvg(), 680, 268)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '32px', fontWeight: 800, fontFamily: 'Manrope', color: C.red, letterSpacing: '1px' } }, 'Angebot endet in 00:04:59'))),
    keyLearning('Läuft der Timer ab, startet er bei vielen Shops einfach neu.', true),
    footer(),
  ]);

  // === SLIDE 2: DARK PATTERNS ===
  const slide2 = slideBase([
    badge('DARK PATTERNS'),
    headline('Drei Tricks, die Websites oft nutzen', 46),
    subline('Sie sollen Druck erzeugen, der nicht echt ist.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('COUNTDOWN-RESET', 'Countdown, der nach Ablauf einfach neu startet', true),
      tagCard('PHANTOM-BESTAND', '„Nur noch 2 Stück!“ — Anzeige, die sich nie leert', true),
      tagCard('FAKE-BESUCHERZÄHLER', 'Erfundener Live-Zähler: „17 schauen sich das gerade an“', true)),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE ===
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Einmal entdeckt, ist das Vertrauen weg', 44),
    subline('Nicht nur in den Timer — in die ganze Seite.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(trustGaugeSvg(), 600, 326)),
      h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' } },
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, 'VERTRAUEN'),
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 800, fontFamily: 'Manrope', color: C.red } }, '↓'))),
    keyLearning('Ein erkannter Trick färbt auf alle echten Signale der Seite ab.', true),
    footer(),
  ]);

  // === SLIDE 4: NICHT NUR MEINUNG ===
  const slide4 = slideBase([
    badge('NICHT NUR MEINUNG'),
    headline('Die FTC sieht das genauso', 48),
    subline('Fake-Dringlichkeit gilt als irreführende Werbung.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(quoteDocSvg(), 700, 245)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.gold, textAlign: 'center', lineHeight: '1.4' } },
          'FTC Staff Report: „Bringing Dark Patterns to Light“ (2022)'))),
    footer(),
  ]);

  // === SLIDE 5: DAS PRINZIP ===
  const slide5 = slideBase([
    badge('DAS PRINZIP'),
    headline('Ein erkannter Trick färbt ab', 50),
    subline('Auf alle echten Signale deiner Seite.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
        h('div', { style: {
          display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg,
          border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px', gap: '10px',
        } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, 'ENTDECKT'),
          h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.35' } }, '1 Dark Pattern')),
        svgImg(spreadArrowSvg(), 70, 46),
        h('div', { style: {
          display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.14)',
          border: `1px solid ${C.red}`, borderRadius: '20px', padding: '26px', gap: '10px',
        } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.red } }, 'WIRKUNG'),
          h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.35' } }, 'Alle Trust-Signale unglaubwürdig'))),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, marginTop: '4px' } },
        'Nielsen Norman Group — Deceptive Patterns')),
    footer(),
  ]);

  // === SLIDE 6: WAS STATTDESSEN FUNKTIONIERT ===
  const slide6 = slideBase([
    badge('WAS STATTDESSEN FUNKTIONIERT'),
    headline('4 Regeln für echte Dringlichkeit', 42),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('1', 'Nur zeigen, was wirklich endet', 25),
      learningCard('2', 'Angekündigte Fristen einhalten', 50),
      learningCard('3', 'Social Proof nur mit echten Zahlen', 75),
      learningCard('4', 'Transparenz vor Druck', 100)),
    footer(),
  ]);

  // === SLIDE 7: KURZ GESAGT ===
  const slide7 = slideBase([
    badge('KURZ GESAGT'),
    headline('Echte Dringlichkeit baut Vertrauen auf.', 42),
    subline('Erfundene baut es ab — und bleibt in Erinnerung.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: {
          display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.12)',
          border: `1px solid ${C.green}`, borderRadius: '20px', padding: '30px', gap: '16px',
        } },
          svgImg(checkCircleSvg(C.green), 64, 64),
          h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.green } }, 'ECHT')),
        h('div', { style: {
          display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.12)',
          border: `1px solid ${C.red}`, borderRadius: '20px', padding: '30px', gap: '16px',
        } },
          svgImg(checkCircleSvg(C.red), 64, 64),
          h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.red } }, 'ERFUNDEN')))),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '40px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Nutzt deine Website echte oder künstliche Dringlichkeit?'),
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
