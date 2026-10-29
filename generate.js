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

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('WUSSTEST DU?'),
    headline('Dein Nutzer vergrößert die Schrift – deine Website reagiert nicht.', 52),
    subline('Browser-Textgröße hochstellen – und optisch ändert sich: nichts.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('NUTZER STELLT EIN', 'Textgröße im Browser auf 200%', 'WEBSITE ZEIGT', 'Weiterhin dieselbe feste Größe')),
    keyLearning('Feste Pixel-Schriftgrößen ignorieren diese Nutzer-Einstellung.', true),
    footer(),
  ]);

  // === SLIDE 2: DER STANDARD ===
  function ruleCard(title, text) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: '20px', padding: '26px', gap: '10px', border: `1px solid ${C.cardBorder}`,
    } },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, title),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, text));
  }
  const slide2 = slideBase([
    badge('DER STANDARD'),
    headline('WCAG 2.1 schreibt zwei Pflicht-Kriterien vor.', 52),
    subline('Level AA – Mindeststandard für barrierefreie Websites.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ruleCard('1.4.4 Resize Text (AA)', 'Text muss sich ohne Hilfsmittel auf 200% vergrößern lassen – ohne Inhalt oder Funktion zu verlieren.'),
      ruleCard('1.4.10 Reflow (AA)', 'Inhalte müssen bei 320px Breite lesbar bleiben – ohne horizontal zu scrollen.')),
    keyLearning('Beide Kriterien stammen vom W3C – den Web Content Accessibility Guidelines.'),
    footer(),
  ]);

  // === SLIDE 3: DIE FOLGE (Funnel) ===
  function funnelStep(label, text, widthPct, danger) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' } },
      h('div', { style: {
        display: 'flex', flexDirection: 'column', width: `${widthPct}%`, backgroundColor: danger ? 'rgba(239,68,68,0.12)' : C.cardBg,
        border: `1px solid ${danger ? C.red : C.cardBorder}`, borderRadius: '16px', padding: '22px 26px', alignItems: 'center', gap: '6px',
      } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '1px', color: danger ? C.red : C.text } }, label),
        h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.3' } }, text)));
  }
  function funnelArrow() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      h('div', { style: { display: 'flex', width: '4px', height: '22px', backgroundColor: C.cardBorder } }),
      h('div', { style: { display: 'flex', width: '0px', height: '0px', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `11px solid ${C.cardBorder}` } }));
  }
  const slide3 = slideBase([
    badge('DIE FOLGE'),
    headline('Text wird abgeschnitten, Layout bricht.', 56),
    subline('Wenn Schriftgrößen in festen px-Werten definiert sind.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0px' } },
      funnelStep('FESTE PX-GRÖSSE', 'Schrift ist auf z.B. 16px fixiert', 100, false),
      funnelArrow(),
      funnelStep('NUTZER VERGRÖSSERT', 'Browser-Textgröße wird erhöht', 82, false),
      funnelArrow(),
      funnelStep('INHALT BRICHT', 'Text überlappt oder wird abgeschnitten', 64, true)),
    keyLearning('Das verfehlt WCAG 1.4.4 – und schließt Menschen mit Sehbehinderung aus.', true),
    footer(),
  ]);

  // === SLIDE 4: DER HEBEL (Erwartung vs Realität / px vs rem) ===
  const slide4 = slideBase([
    badge('DER HEBEL'),
    headline('px bleibt starr. rem passt sich an.', 56),
    subline('Ein Einheiten-Wechsel macht den Unterschied.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('PX (FEST)', '16px bleibt immer 16px – unabhängig von der Nutzer-Einstellung', 'REM (RELATIV)', '1rem skaliert automatisch mit der Basis-Schriftgröße des Browsers')),
    keyLearning('rem rechnet relativ zur Grundeinstellung des Nutzers – px nicht.'),
    footer(),
  ]);

  // === SLIDE 5: KONKRET (3 Karten) ===
  const slide5 = slideBase([
    badge('KONKRET'),
    headline('So setzt du es technisch um.', 54),
    subline('Drei Stellschrauben für skalierbare Typografie.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ruleCard('Einheiten umstellen', 'Schriftgrößen in rem oder em statt in festen px-Werten definieren.'),
      ruleCard('Layout prüfen', 'Breiten relativ statt in festen px-Containern anlegen, damit Inhalt mitwächst.'),
      ruleCard('Bei 200% testen', 'Browser-Zoom auf 200% stellen: Bricht etwas, oder bleibt alles lesbar?')),
    keyLearning('Kleine Umstellung in der Codebasis, große Wirkung für Nutzer mit Sehbehinderung.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP (Arrow Flow) ===
  function flowStep(text) {
    return h('div', { style: {
      display: 'flex', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px',
      padding: '22px 28px', justifyContent: 'center',
    } },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, textAlign: 'center', lineHeight: '1.3' } }, text));
  }
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Relative Einheiten respektieren die Entscheidung des Nutzers.', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '0px' } },
      flowStep('Nutzer stellt Textgröße im Browser ein'),
      funnelArrow(),
      flowStep('rem berechnet die Schriftgröße relativ dazu neu'),
      funnelArrow(),
      flowStep('Inhalt bleibt lesbar und nutzbar')),
    keyLearning('WCAG verschiebt die Kontrolle zur Person, die liest.'),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS (Checkliste mit Progress Bars) ===
  const learnings = [
    { num: '01', text: 'Schriftgrößen in rem/em statt px definieren', pct: 33 },
    { num: '02', text: 'Browser-Zoom auf 200% testen', pct: 66 },
    { num: '03', text: 'Layout bei 320px Breite ohne horizontales Scrollen prüfen (WCAG 1.4.10)', pct: 100 },
  ];
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('3 Schritte zu barrierefreier Typografie.', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '24px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontSize: '38px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '66px' } }, l.num),
            h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text)),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }))))),
    keyLearning('Barrierefreiheit beginnt bei der Maßeinheit, nicht erst beim Kontrast.'),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Ist deine Website wirklich bis 200% vergrößerbar?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-10-29', 'slides');

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
