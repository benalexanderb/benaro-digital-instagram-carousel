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

  function contrastCards(leftLabel, leftText, rightLabel, rightText) {
    return h('div', { style: { display: 'flex', gap: '14px' } },
      h('div', { style: {
        display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.textMuted } }, leftLabel),
        h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
        h('span', { style: { display: 'flex', fontSize: '27px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, leftText)),
      h('div', { style: {
        display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.14)',
        border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.accent2 } }, rightLabel),
        h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.accent, borderRadius: '2px' } }),
        h('span', { style: { display: 'flex', fontSize: '27px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.4' } }, rightText)));
  }

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  // === SLIDE 1: HOOK (SCHNELLTEST) ===
  const slide1 = slideBase([
    badge('SCHNELLTEST'),
    headline('Funktioniert deine Website auch ohne Maus?', 54),
    subline('Ein einfacher Tastatur-Test zeigt sofort, wie zugänglich eine Website wirklich ist.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('MIT MAUS', 'Navigation wirkt intuitiv und alles ist erreichbar', 'NUR TASTATUR', 'Viele Menüs, Buttons und Formulare bleiben unerreichbar')),
    keyLearning('Der Tastatur-Test ist einer der schnellsten Wege, Barrierefreiheit zu prüfen.'),
    footer(),
  ]);

  // === SLIDE 2: DAS CHAOS ===
  function rulePill(text) {
    return h('span', { style: {
      display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft,
      backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '14px', padding: '14px 20px',
    } }, text);
  }
  const slide2 = slideBase([
    badge('DAS CHAOS'),
    headline('Barrierefreiheit wirkt wie unzählige Einzelregeln.', 50),
    subline('Kontrast, Formulare, Bilder, Navigation, Schriftgröße – jede Regel für sich wirkt beliebig.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px' } },
        rulePill('Kontrast'),
        rulePill('Alt-Text'),
        rulePill('Formulare'),
        rulePill('Navigation')),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px' } },
        rulePill('Schriftgröße'),
        rulePill('Fokus-Rahmen'),
        rulePill('Untertitel'),
        rulePill('Sprache'))),
    keyLearning('Ohne System wirkt jede neue Regel wie eine zusätzliche Hürde.', true),
    footer(),
  ]);

  // === SLIDE 3: DAS PRINZIP (POUR) ===
  function principleCard(title, text) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: '20px', padding: '26px', gap: '10px', border: `1px solid ${C.cardBorder}`,
    } },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, title),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, text));
  }
  const slide3 = slideBase([
    badge('DAS PRINZIP: POUR'),
    headline('Das W3C ordnet jede Regel einem von 4 Prinzipien zu.', 48),
    subline('WCAG 2.1 (World Wide Web Consortium): Wahrnehmbar, Bedienbar, Verständlich, Robust.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        principleCard('Wahrnehmbar', 'Inhalte müssen für alle Sinne erfassbar sein'),
        principleCard('Bedienbar', 'Funktionen müssen auch ohne Maus nutzbar sein')),
      h('div', { style: { display: 'flex', gap: '14px' } },
        principleCard('Verständlich', 'Sprache und Navigation sind klar und vorhersehbar'),
        principleCard('Robust', 'Inhalte funktionieren mit jeder Hilfstechnologie'))),
    keyLearning('Jede neue Regel lässt sich jetzt einem der vier Prinzipien zuordnen.'),
    footer(),
  ]);

  // === SLIDE 4: WAHRNEHMBAR & BEDIENBAR ===
  const slide4 = slideBase([
    badge('WAHRNEHMBAR & BEDIENBAR'),
    headline('Zwei der vier Prinzipien ganz konkret.', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('WAHRNEHMBAR', 'Bilder brauchen Alt-Text, Videos Untertitel – sonst bleiben Inhalte für manche unsichtbar', 'BEDIENBAR', 'Jede Funktion muss auch per Tastatur erreichbar sein, mit sichtbarem Fokus-Rahmen')),
    keyLearning('Wahrnehmbar heißt: ankommen. Bedienbar heißt: nutzbar sein.'),
    footer(),
  ]);

  // === SLIDE 5: VERSTÄNDLICH & ROBUST ===
  const slide5 = slideBase([
    badge('VERSTÄNDLICH & ROBUST'),
    headline('Und die anderen beiden Prinzipien.', 54),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('VERSTÄNDLICH', 'Navigation bleibt gleich, Sprache ist klar, Fehler werden verständlich erklärt', 'ROBUST', 'Code funktioniert zuverlässig mit Screenreadern und anderer Hilfstechnologie')),
    keyLearning('Verständlich heißt: nachvollziehbar. Robust heißt: zukunftssicher.'),
    footer(),
  ]);

  // === SLIDE 6: ANGEWENDET (Checkliste) ===
  const learnings = [
    { num: '01', text: 'Jedes Formularfeld hat ein sichtbares Label, nicht nur einen Platzhalter', pct: 25 },
    { num: '02', text: 'Das Formular lässt sich komplett per Tab-Taste ausfüllen und absenden', pct: 50 },
    { num: '03', text: 'Fehlermeldungen nennen Ursache und Lösung in klarer Sprache', pct: 75 },
    { num: '04', text: 'Ein Screenreader liest alle Felder und Fehlermeldungen korrekt vor', pct: 100 },
  ];
  const slide6 = slideBase([
    badge('ANGEWENDET'),
    headline('Ein Kontaktformular nach allen vier Prinzipien geprüft.', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '64px' } }, l.num),
            h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text)),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }))))),
    keyLearning('Ein einziges Formular zeigt: alle vier Prinzipien greifen zusammen.'),
    footer(),
  ]);

  // === SLIDE 7: CTA ===
  const slide7 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Würde deine Website den Tastatur-Test bestehen?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-10-28', 'slides');

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
