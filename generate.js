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
    badge('ACHTUNG'),
    headline('Ein Trust-Siegel neben dem Button – und Kund:innen zögern trotzdem beim Bezahlen?'),
    subline('Nicht jedes Sicherheitssymbol schafft automatisch Vertrauen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('SIEGEL VORHANDEN', 'Schloss-Icon im Checkout sichtbar platziert', 'VERTRAUEN TROTZDEM NIEDRIG', 'Kaufabschluss wird trotzdem abgebrochen')),
    keyLearning('Ob ein Trust-Badge wirkt, hängt nicht vom Vorhandensein ab – sondern davon, wie es eingesetzt wird.'),
    footer(),
  ]);

  // === SLIDE 2: KONTEXT ===
  function flowStep(label, warn) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '12px',
      backgroundColor: warn ? 'rgba(239,68,68,0.1)' : C.cardBg,
      border: `1px solid ${warn ? C.red : C.cardBorder}`, borderRadius: '18px', padding: '26px 16px',
    } },
      h('div', { style: {
        display: 'flex', width: '20px', height: '20px', borderRadius: '10px',
        backgroundColor: warn ? C.red : C.accent2,
      } }),
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.text, textAlign: 'center' } }, label));
  }
  function connector() {
    return h('div', { style: { display: 'flex', alignItems: 'center', padding: '0 6px' } },
      h('div', { style: { display: 'flex', width: '24px', height: '3px', backgroundColor: C.cardBorder } }));
  }
  const slide2 = slideBase([
    badge('DIE FORSCHUNG'),
    headline('Das Baymard Institute analysiert Checkout-Verläufe seit Jahren im Detail.', 54),
    subline('Unsicherheit beim Bezahlen zählt zu den wiederkehrend dokumentierten Abbruchgründen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', alignItems: 'center' } },
        flowStep('Warenkorb', false),
        connector(),
        flowStep('Zahlungsdaten', true),
        connector(),
        flowStep('Abschluss', false))),
    keyLearning('Der Zahlungsschritt ist der Moment, in dem Unsicherheit am stärksten spürbar wird.'),
    footer(),
  ]);

  // === SLIDE 3: PROBLEM ===
  function strikePill(text) {
    return h('span', { style: {
      display: 'flex', fontSize: '28px', fontWeight: 500, fontFamily: 'Inter',
      color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through',
    } }, text);
  }
  const slide3 = slideBase([
    badge('DAS PROBLEM'),
    headline('Ein generisches Vorhängeschloss-Icon überzeugt niemanden.'),
    subline('Nur erkennbare Siegel wirken als echtes Vertrauenssignal.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '20px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '36px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, strikePill('Unbekanntes Siegel')),
        h('div', { style: { display: 'flex', width: '100%', height: '1px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, strikePill('Generisches Schloss-Icon')))),
    keyLearning('Unbekannte oder gefälscht wirkende Siegel können sogar zusätzliches Misstrauen erzeugen.', true),
    footer(),
  ]);

  // === SLIDE 4: ERWARTUNG VS REALITÄT ===
  const slide4 = slideBase([
    badge('ERWARTUNG VS. REALITÄT'),
    headline('Was die meisten glauben – und was laut Forschung wirklich zählt.', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('ERWARTUNG', 'Irgendein Schloss-Symbol neben dem Button reicht aus', 'REALITÄT', 'Nur bekannte, tatsächlich genutzte Marken und Zahlungsanbieter wirken vertrauensbildend')),
    keyLearning('Vertrauen entsteht durch Wiedererkennung – nicht durch irgendein Symbol.'),
    footer(),
  ]);

  // === SLIDE 5: DIE REGELN (2x2) ===
  function ruleCard(title, text) {
    return h('div', { style: {
      display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: '20px', padding: '26px', gap: '10px', border: `1px solid ${C.cardBorder}`,
    } },
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, title),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, text));
  }
  const slide5 = slideBase([
    badge('DIE REGELN'),
    headline('Worauf es bei Trust-Badges wirklich ankommt.', 54),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        ruleCard('Nähe zum Button', 'Platzierung direkt am Entscheidungspunkt, nicht irgendwo auf der Seite'),
        ruleCard('Bekannte Marke', 'Erkennbarer Zahlungsanbieter statt generisches Icon')),
      h('div', { style: { display: 'flex', gap: '14px' } },
        ruleCard('Echtheit', 'Nur real genutzte Siegel und Zertifikate zeigen, keine Fake-Grafiken'),
        ruleCard('Kombination', 'Zusammen mit echten Kontaktdaten & Impressum wirkt es stärker'))),
    keyLearning('Jede Regel zahlt auf dasselbe Ziel ein: das wahrgenommene Risiko senken.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Jeder Klick auf "Jetzt bezahlen" fühlt sich wie ein kleines Risiko an.', 50),
    subline('Verlustaversion (Kahneman & Tversky, 1979): Ein gefühlter Verlust wiegt psychologisch schwerer als ein gleich großer Gewinn.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('OHNE TRUST-BADGE', 'Das wahrgenommene Risiko wirkt groß', 'MIT TRUST-BADGE', 'Die Kaufentscheidung wirkt spürbar leichter')),
    keyLearning('Das Siegel nimmt dem Klick psychologisch etwas von seinem Risiko.'),
    footer(),
  ]);

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Platzierung direkt neben dem Kauf-/Bezahlbutton prüfen', pct: 25 },
    { num: '02', text: 'Nur real genutzte, erkennbare Siegel verwenden', pct: 50 },
    { num: '03', text: 'Keine Fake- oder veralteten Zertifikate zeigen', pct: 75 },
    { num: '04', text: 'Mit echten Kontaktdaten & Impressum kombinieren', pct: 100 },
  ];
  const slide7 = slideBase([
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu wirksamen Trust-Badges.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '64px' } }, l.num),
            h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text)),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }))))),
    keyLearning('Vertrauen entsteht aus der Summe kleiner, echter Signale – nicht aus einem einzelnen Icon.'),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Steht dein Trust-Signal wirklich dort, wo die Entscheidung fällt?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-10-16', 'slides');

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
