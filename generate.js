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
    headline('Deine Startseite klingt wie eine Werbebroschüre – und das kostet Vertrauen.', 54),
    subline('Werbesprache wird beim Scannen einfach übersprungen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('DEINE SPRACHE', '„Marktführer“, „einzigartig“, „die beste Lösung“', 'WAS ANKOMMT', 'Nichts Konkretes bleibt im Kopf')),
    keyLearning('Große Worte überzeugen nicht automatisch – oft bewirken sie das Gegenteil.'),
    footer(),
  ]);

  // === SLIDE 2: DIE STUDIE (Stat Hero) ===
  const slide2 = slideBase([
    badge('DIE STUDIE'),
    headline('1997 verglich eine Studie drei Schreibstile im direkten Test.', 52),
    subline('Jakob Nielsen (Nielsen Norman Group): dieselbe Webseite, dreimal anders formuliert.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px' } },
      h('span', { style: { display: 'flex', fontSize: '150px', fontWeight: 800, fontFamily: 'Manrope', color: C.accent2, letterSpacing: '-3px' } }, '124%'),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 600, fontFamily: 'Inter', color: C.text, textAlign: 'center', lineHeight: '1.4' } },
        'bessere Usability-Bewertung durch prägnante, scannbare, objektive statt werbliche Sprache')),
    keyLearning('Nicht die Botschaft wurde getestet, sondern nur die Art, wie sie geschrieben war.'),
    footer(),
  ]);

  // === SLIDE 3: DER FEHLER ===
  function strikePill(text) {
    return h('span', { style: {
      display: 'flex', fontSize: '28px', fontWeight: 500, fontFamily: 'Inter',
      color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through',
    } }, text);
  }
  const slide3 = slideBase([
    badge('DER FEHLER'),
    headline('Viele Websites texten wie eine Hochglanz-Broschüre.'),
    subline('Superlative ersetzen Informationen – und Nutzer merken das sofort.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '36px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, strikePill('„Marktführer“')),
        h('div', { style: { display: 'flex', width: '100%', height: '1px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, strikePill('„Einzigartig“')),
        h('div', { style: { display: 'flex', width: '100%', height: '1px', backgroundColor: C.cardBorder } }),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, strikePill('„Die beste Lösung“')))),
    keyLearning('Wer nichts Konkretes sagt, wird beim Scannen einfach ignoriert.', true),
    footer(),
  ]);

  // === SLIDE 4: ERWARTUNG VS REALITÄT ===
  const slide4 = slideBase([
    badge('ERWARTUNG VS. REALITÄT'),
    headline('Was die meisten glauben – und was die Forschung zeigt.', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('ERWARTUNG', 'Große Worte wirken professionell und überzeugend', 'REALITÄT', 'Unbelegte Superlative wirken unglaubwürdig und werden beim Scannen übersprungen')),
    keyLearning('Vertrauen entsteht durch Fakten – nicht durch Selbstlob.'),
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
    headline('Wie Nielsen objektives Webtexten definiert.', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        ruleCard('Konkret statt werblich', 'Fakten und Beispiele statt Superlative wie „einzigartig“ oder „beste Lösung“'),
        ruleCard('Scannbar strukturieren', 'Zwischenüberschriften und Aufzählungen statt Fließtext-Blöcke')),
      h('div', { style: { display: 'flex', gap: '14px' } },
        ruleCard('Prägnant schreiben', 'Deutlich weniger Wörter als ein vergleichbarer Printtext'),
        ruleCard('Nutzerperspektive', 'Was hat die Kundschaft davon – nicht wie toll ist das Unternehmen'))),
    keyLearning('Jede Regel zahlt auf dasselbe Ziel ein: schneller verstanden, schneller vertraut.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Nutzer lesen eine Website nicht – sie scannen sie.', 50),
    subline('Jakob Nielsen (Nielsen Norman Group): Unbelegte Werbeaussagen wirken beim schnellen Scannen unglaubwürdig, weil sie sich nicht überprüfen lassen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards('BEHAUPTUNG', '„Wir sind die beste Lösung“ – nicht überprüfbar', 'FAKT', 'Eine konkrete Zahl oder ein Beispiel – überprüfbar')),
    keyLearning('Überprüfbare Aussagen schlagen jede Superlative.'),
    footer(),
  ]);

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Superlative durch konkrete Fakten und Beispiele ersetzen', pct: 25 },
    { num: '02', text: 'Kernaussage in den ersten Satz packen', pct: 50 },
    { num: '03', text: 'Mit Zwischenüberschriften und Aufzählungen scannbar schreiben', pct: 75 },
    { num: '04', text: 'Jeden Satz aus Kundensicht prüfen: Was habe ich davon?', pct: 100 },
  ];
  const slide7 = slideBase([
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu klarerer Website-Sprache.', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '64px' } }, l.num),
            h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text)),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }))))),
    keyLearning('Klare Sprache wird nicht nur gelesen – sie wird auch geglaubt.'),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '42px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Liest sich deine Startseite wie eine Broschüre – oder wie eine Antwort auf die Frage deiner Kunden?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-10-22', 'slides');

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
