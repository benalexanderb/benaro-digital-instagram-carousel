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

  function slideBase(children) {
    return h('div', { style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
      backgroundColor: C.bg, fontFamily: 'Inter',
    } }, ...children);
  }

  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: pct === 100 ? C.green : C.accent2, minWidth: '56px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, text)),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })));
  }

  // === SVG VISUALS ===

  // Google-SERP-Snippet-Mockup: Breadcrumb/URL-Pille, Titelzeile, zwei Description-Zeilen,
  // Cursor-Icon am Titel als Klick-Entscheidungspunkt.
  function serpSnippetSvg() {
    return `<svg width="820" height="420" viewBox="0 0 820 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="780" height="380" rx="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
      <circle cx="80" cy="90" r="18" fill="rgba(255,255,255,0.14)"/>
      <rect x="112" y="78" width="220" height="24" rx="8" fill="rgba(255,255,255,0.12)"/>
      <rect x="80" y="150" width="520" height="34" rx="8" fill="#2952FF"/>
      <rect x="80" y="210" width="640" height="18" rx="6" fill="rgba(255,255,255,0.14)"/>
      <rect x="80" y="242" width="600" height="18" rx="6" fill="rgba(255,255,255,0.14)"/>
      <rect x="80" y="274" width="360" height="18" rx="6" fill="rgba(255,255,255,0.14)"/>
      <circle cx="700" cy="167" r="34" fill="#00C2B8"/>
      <path d="M690 167 L710 167 M700 157 L700 177" stroke="#14161A" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }

  // Pixel-Truncation-Visual: Titelzeile die in Richtung Rand ausblasst und an einer
  // gestrichelten Grenze abgeschnitten wird (drei Punkte als Ellipse markieren den Cut).
  function truncationSvg() {
    return `<svg width="820" height="300" viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeTitle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2952FF"/>
          <stop offset="78%" stop-color="#2952FF"/>
          <stop offset="100%" stop-color="rgba(41,82,255,0)"/>
        </linearGradient>
        <linearGradient id="fadeDesc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(255,255,255,0.16)"/>
          <stop offset="78%" stop-color="rgba(255,255,255,0.16)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <rect x="40" y="60" width="700" height="40" rx="10" fill="url(#fadeTitle)"/>
      <rect x="40" y="140" width="700" height="20" rx="7" fill="url(#fadeDesc)"/>
      <rect x="40" y="176" width="700" height="20" rx="7" fill="url(#fadeDesc)"/>
      <line x1="620" y1="30" x2="620" y2="240" stroke="#EF4444" stroke-width="3" stroke-dasharray="10 8"/>
      <circle cx="650" cy="80" r="6" fill="#EF4444"/>
      <circle cx="672" cy="80" r="6" fill="#EF4444"/>
      <circle cx="694" cy="80" r="6" fill="#EF4444"/>
    </svg>`;
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideBase([
    badge('ACHTUNG'),
    headline('Gutes Ranking, aber keiner klickt?', 50),
    subline('Das Problem liegt oft nicht in der Position.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(serpSnippetSvg(), 700, 358)),
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, fontFamily: 'Manrope', letterSpacing: '2px', color: C.accent2 } }, 'DEIN SNIPPET IN DER GOOGLE-SUCHE'))),
    keyLearning('Title-Tag und Meta-Description entscheiden, was Besucher vor dem Klick sehen.'),
    footer(),
  ]);

  // === SLIDE 2: DIE FAKTEN ===
  const slide2 = slideBase([
    badge('DIE FAKTEN'),
    headline('Kein Ranking-Faktor. Trotzdem entscheidend.', 44),
    subline('Google Search Central Documentation zu Title Links & Snippets'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards(
        'LAUT GOOGLE',
        'Title-Tag und Meta-Description beeinflussen das Ranking nicht direkt.',
        'IN DER PRAXIS',
        'Sie entscheiden, ob aus einer guten Position in der Suche auch ein Klick wird.',
      )),
    keyLearning('Sichtbarkeit und Klick sind zwei unterschiedliche Baustellen.'),
    footer(),
  ]);

  // === SLIDE 3: DAS PROBLEM ===
  const slide3 = slideBase([
    badge('DAS PROBLEM'),
    headline('Viele überlassen das Snippet dem Zufall.', 46),
    subline('Drei typische Fehler, die Google selbst korrigieren muss.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('Title-Tag generisch oder leer', 'CMS-Standardtitel wie "Startseite" statt echter Botschaft', true),
      tagCard('Meta-Description fehlt', 'Google wählt den angezeigten Text dann selbst aus der Seite', true),
      tagCard('Keyword-Stapelung', 'Unleserliche Title-Tags wirken wie Spam und schrecken ab', true)),
    keyLearning('Das Ergebnis: Google entscheidet mit, wie der erste Eindruck aussieht.', true),
    footer(),
  ]);

  // === SLIDE 4: ERWARTUNG VS. REALITÄT ===
  const slide4 = slideBase([
    badge('ERWARTUNG VS. REALITÄT'),
    headline('„Irgendeinen Text zeigt Google schon an."', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      contrastCards(
        'ERWARTUNG',
        'Ohne eigene Angaben zeigt Google trotzdem einen passenden Beschreibungstext.',
        'REALITÄT',
        'Google generiert den Text dann automatisch aus der Seite — oft unpassend zur Suchanfrage.',
      )),
    keyLearning('Wer nichts vorgibt, gibt die Kontrolle über das Snippet ab.'),
    footer(),
  ]);

  // === SLIDE 5: WAS DU STEUERN KANNST ===
  const slide5 = slideBase([
    badge('WAS DU STEUERN KANNST'),
    headline('3 Stellschrauben für dein Snippet.', 48),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      tagCard('Title-Tag kurz und eindeutig', 'Kernbegriff an den Anfang, pro Seite ein eigener Titel'),
      tagCard('Meta-Description mit Mehrwert', 'Beschreibt konkret, was Besucher auf der Seite erwartet'),
      tagCard('Jede Seite einzigartig', 'Keine doppelten Title-Tags oder Descriptions im Projekt')),
    keyLearning('Kleine Textbausteine, großer Hebel auf die Klickentscheidung.'),
    footer(),
  ]);

  // === SLIDE 6: DAS PRINZIP ===
  const slide6 = slideBase([
    badge('DAS PRINZIP'),
    headline('Zu lang? Google schneidet einfach ab.', 44),
    subline('Die Länge wird nach Pixelbreite begrenzt, nicht nach fester Zeichenzahl.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, svgImg(truncationSvg(), 700, 256))),
    keyLearning('Deshalb: lieber knapp und eindeutig als bis zum letzten Zeichen ausreizen.'),
    footer(),
  ]);

  // === SLIDE 7: TAKEAWAYS ===
  const slide7 = slideBase([
    badge('DEINE TAKEAWAYS'),
    headline('4 Learnings für dein Google-Snippet.', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      learningCard('01', 'Jede Seite bekommt einen eigenen, eindeutigen Title-Tag', 25),
      learningCard('02', 'Meta-Description schreibt den Mehrwert, nicht nur Keywords', 50),
      learningCard('03', 'Kernbegriff an den Anfang des Title-Tags setzen', 75),
      learningCard('04', 'Snippet in der Google-Vorschau testen statt nur zu schätzen', 100)),
    footer(),
  ]);

  // === SLIDE 8: CTA ===
  const slide8 = slideBase([
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '40px', fontWeight: 800, fontFamily: 'Manrope', color: C.text, textAlign: 'center', lineHeight: '1.3' } },
        'Wie liest sich deine Website gerade in der Google-Suche?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, textAlign: 'center', lineHeight: '1.4' } },
        'Folge @benarodigital für mehr Website-Wissen.')),
    footer(),
  ]);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-11-07', 'slides');

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
