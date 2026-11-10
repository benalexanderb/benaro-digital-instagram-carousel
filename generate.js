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

  function gridCard(title, sub, color) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg,
      border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px', gap: '12px',
    } },
      h('div', { style: { display: 'flex', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: color } }),
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.text, lineHeight: '1.25' } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.35' } }, sub));
  }

  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: pct === 100 ? C.green : C.accent2, minWidth: '56px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, text)),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })));
  }

  function labelRow(leftText, rightText, width, leftColor = C.accent, rightColor = C.accent2) {
    return h('div', { style: { display: 'flex', width: `${width}px`, justifyContent: 'space-between' } },
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: leftColor } }, leftText),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: rightColor } }, rightText));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SVG VISUALS ===

  // Besucher- und Server-Punkt, verbunden durch eine gestrichelte Signallinie mit
  // wandernden Pulskreisen und einem Uhren-Icon als Sinnbild fuer die Signallaufzeit.
  function distanceSignalSvg() {
    return `<svg width="820" height="340" viewBox="0 0 820 340" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 240 Q 410 160 760 240" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="4" stroke-dasharray="2 16"/>
      <circle cx="260" cy="206" r="8" fill="rgba(255,255,255,0.45)"/>
      <circle cx="410" cy="186" r="8" fill="rgba(255,255,255,0.28)"/>
      <circle cx="560" cy="206" r="8" fill="rgba(255,255,255,0.45)"/>
      <circle cx="60" cy="240" r="32" fill="#2952FF"/>
      <circle cx="760" cy="240" r="32" fill="#00C2B8"/>
      <circle cx="410" cy="92" r="48" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
      <line x1="410" y1="92" x2="410" y2="62" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <line x1="410" y1="92" x2="432" y2="92" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }

  // Ansteigende Kurve: Latenz waechst mit der Entfernung zwischen Besucher und Server.
  function latencyCurveSvg() {
    return `<svg width="820" height="360" viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg">
      <line x1="60" y1="300" x2="760" y2="300" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <line x1="60" y1="300" x2="60" y2="40" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <path d="M60 282 C 300 272, 520 180, 740 60" fill="none" stroke="#2952FF" stroke-width="8" stroke-linecap="round"/>
      <circle cx="60" cy="282" r="13" fill="#00C2B8"/>
      <circle cx="740" cy="60" r="13" fill="#EF4444"/>
    </svg>`;
  }

  // Netzwerk-Diagramm: ein zentraler Ursprungs-Server verbunden mit mehreren
  // verteilten Edge-Server-Knoten eines CDN.
  function cdnNetworkSvg() {
    return `<svg width="820" height="440" viewBox="0 0 820 440" xmlns="http://www.w3.org/2000/svg">
      <line x1="410" y1="220" x2="140" y2="90" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <line x1="410" y1="220" x2="680" y2="90" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <line x1="410" y1="220" x2="110" y2="340" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <line x1="410" y1="220" x2="710" y2="340" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <line x1="410" y1="220" x2="410" y2="400" stroke="rgba(255,255,255,0.22)" stroke-width="3"/>
      <circle cx="410" cy="220" r="36" fill="#2952FF"/>
      <circle cx="140" cy="90" r="22" fill="#00C2B8"/>
      <circle cx="680" cy="90" r="22" fill="#00C2B8"/>
      <circle cx="110" cy="340" r="22" fill="#00C2B8"/>
      <circle cx="710" cy="340" r="22" fill="#00C2B8"/>
      <circle cx="410" cy="400" r="22" fill="#00C2B8"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('WUSSTEST DU?'),
    headline('Dein Serverstandort bremst deine Website', 50),
    subline('Ein physikalisches Prinzip, das viele beim Website-Aufbau übersehen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(distanceSignalSvg(), 700, 290)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, labelRow('BESUCHER', 'SERVER', 700))),
    keyLearning('Jede Anfrage legt eine reale Strecke zurück – messbar als Latenz.'),
    footer(),
  ]);

  // === SLIDE 2: DAS PRINZIP ===
  const slide2 = slideBase([
    badge('DAS PRINZIP'),
    headline('Daten brauchen physische Zeit', 50),
    subline('Jedes Signal reist über Kabel und Funk – mit messbarer Laufzeit.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(latencyCurveSvg(), 700, 308)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, labelRow('NAH', 'FERN', 700, C.accent2, C.red))),
    keyLearning('Latenz entsteht durch Entfernung – nicht durch schlechten Code.'),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE ===
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Ein Server ist nie überall nah', 48),
    subline('Ein einzelner Serverstandort kann nicht für jede Region gleich nah sein.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards(
        'NUTZER IN DER NÄHE',
        'Kurzer Weg zum Server – Bilder und Skripte laden schnell.',
        'NUTZER WEIT WEG',
        'Längerer Weg zum Server – jede Anfrage braucht mehr Zeit.',
        true,
      )),
    keyLearning('Ohne Gegenmaßnahme warten entfernte Besucher länger auf jedes Bild.', true),
    footer(),
  ]);

  // === SLIDE 4: DIE LÖSUNG ===
  const slide4 = slideBase([
    badge('DIE LÖSUNG'),
    headline('Ein CDN bringt die Inhalte näher', 46),
    subline('Content Delivery Network: viele Server weltweit statt nur einem.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(cdnNetworkSvg(), 700, 376))),
    keyLearning('Statt eines Servers verteilt ein CDN Kopien auf viele Standorte.'),
    footer(),
  ]);

  // === SLIDE 5: SO FUNKTIONIERT'S ===
  const slide5 = slideBase([
    badge('SO FUNKTIONIERT\'S'),
    headline('In drei Schritten zum Besucher', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      learningCard('1', 'Anfrage kommt beim nächstgelegenen Edge-Server an', 33),
      learningCard('2', 'Statische Inhalte liegen dort bereits zwischengespeichert', 66),
      learningCard('3', 'Auslieferung ohne Umweg über den Hauptserver', 100)),
    keyLearning('Je näher die Kopie, desto kürzer der Weg – und die Ladezeit.'),
    footer(),
  ]);

  // === SLIDE 6: WARUM DAS WICHTIG IST ===
  const slide6 = slideBase([
    badge('WARUM DAS WICHTIG IST'),
    headline('Ladezeit wirkt auf mehr als Geduld', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        gridCard('Schnellere Ladezeit', 'Weniger Wartezeit für Besucher weltweit', C.accent2),
        gridCard('Weniger Absprünge', 'Nutzer bleiben eher auf schnellen Seiten', C.accent)),
      h('div', { style: { display: 'flex', gap: '14px' } },
        gridCard('Bessere Nutzererfahrung', 'Core Web Vitals bewerten die Ladegeschwindigkeit', C.gold),
        gridCard('Entlastung des Hauptservers', 'Viele Anfragen laufen über Edge-Server', C.green))),
    keyLearning('Ladezeit ist kein Detail – sie wirkt direkt auf UX und Sichtbarkeit.'),
    footer(),
  ]);

  // === SLIDE 7: DEINE TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('3 Dinge, die du mitnehmen solltest', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      learningCard('01', 'Entfernung zum Server erzeugt messbare Latenz – ein physikalisches Prinzip', 33),
      learningCard('02', 'Ein CDN verteilt deine Inhalte auf Server rund um die Welt', 66),
      learningCard('03', 'CDN und gutes Hosting ergänzen sich, sie ersetzen sich nicht', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Nutzt deine Website schon ein CDN?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const todayDir = process.argv[2] || new Date().toISOString().slice(0, 10);
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
