const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap(w => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-${w}-normal.woff`) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-ext-${w}-normal.woff`) },
    ]),
    ...[400, 500, 600, 700].flatMap(w => [
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
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
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
    return h('div', { style: { display: 'flex', marginBottom: '20px' } },
      h('span', {
        style: {
          display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
          fontFamily: 'Manrope', color: C.text, backgroundColor: C.cardBg,
          border: `1px solid ${C.cardBorder}`, padding: '10px 22px', borderRadius: '12px',
        }
      }, text),
    );
  }

  function headline(text, size = 62) {
    return h('span', {
      style: {
        display: 'flex', fontSize: `${size}px`, fontWeight: 800, fontFamily: 'Manrope',
        color: C.text, lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '6px',
      }
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: {
        display: 'flex', fontSize: '28px', fontWeight: 500, fontFamily: 'Inter',
        color: C.textSoft, lineHeight: '1.5', marginTop: '10px',
      }
    }, text);
  }

  function keyLearning(text, warn = false) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: 'auto',
      }
    },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '44px', backgroundColor: warn ? C.red : C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.4' } }, text),
    );
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted } }, '@benarodigital'),
    );
  }

  function slideRoot(...children) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
        backgroundColor: C.bg, fontFamily: 'Inter',
      }
    }, ...children);
  }

  function visualBlock(...children) {
    return h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } }, ...children);
  }

  function svgImg(svg, width, height) {
    const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    return h('img', { src, width, height, style: { display: 'flex' } });
  }

  function searchIcon(fill, size = 26) {
    return svgImg(`<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="7" stroke="${fill}" stroke-width="2.4" fill="none"/>
      <line x1="16" y1="16" x2="21.5" y2="21.5" stroke="${fill}" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`, size, size);
  }

  // === SNIPPET CARD (Google-Suchergebnis-Mockup) ===
  function snippetCard(url, titleText, descLines, opts = {}) {
    const titleColor = opts.titleColor || C.accent2;
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '10px', width: '100%',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px',
      }
    },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        searchIcon(C.textMuted, 22),
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted } }, url),
      ),
      h('span', { style: { display: 'flex', fontSize: '30px', fontWeight: 700, fontFamily: 'Manrope', color: titleColor, lineHeight: '1.3' } }, titleText),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
        ...descLines.map(l => h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.45' } }, l)),
      ),
    );
  }

  function labelChip(title, desc, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '8px',
        backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${C.cardBorder}`,
        borderRadius: '16px', padding: '22px 24px',
      }
    },
      h('div', { style: { display: 'flex', width: '34px', height: '6px', backgroundColor: accent, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, desc),
    );
  }

  function meterCard(label, value, pct, accent) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '14px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '26px 28px',
      }
    },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.text, letterSpacing: '1px' } }, label),
        h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, value),
      ),
      h('div', { style: { display: 'flex', width: '100%', height: '16px', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: '8px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '16px', backgroundColor: accent, borderRadius: '8px' } }),
      ),
    );
  }

  function exampleCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '27px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', lineHeight: '1.45' } }, desc),
    );
  }

  // === SLIDE 1: HOOK ===
  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('Diese zwei Zeilen sieht niemand auf deiner Seite.'),
    subline('Trotzdem entscheiden sie oft, ob überhaupt jemand klickt.'),
    visualBlock(
      snippetCard(
        'deine-website.de › leistungen',
        'Webdesign für Unternehmen | Deine Website',
        ['Moderne, schnelle Websites für Unternehmer:innen.', 'Von der Idee bis zum fertigen Launch.'],
      ),
    ),
    keyLearning('Title-Tag und Meta-Description erscheinen nur im Google-Suchergebnis, nie auf der Seite selbst.', true),
    footer(),
  );

  // === SLIDE 2: KONTEXT ===
  const slide2 = slideRoot(
    badge('GOOGLE-SUCHERGEBNIS'),
    headline('Zwei Bauteile entscheiden über den Klick.', 54),
    subline('Title-Tag und Meta-Description schreibst du selbst, im Quellcode jeder Seite.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
        snippetCard(
          'deine-website.de › leistungen',
          'Webdesign für Unternehmen | Deine Website',
          ['Moderne, schnelle Websites für Unternehmer:innen.'],
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          labelChip('Title-Tag', 'Die farbige Überschrift, größte Schrift', C.accent2),
          labelChip('Meta-Description', 'Der graue Anreißertext darunter', C.accent),
        ),
      ),
    ),
    keyLearning('Schreibst du sie nicht bewusst, wählt Google selbst einen Text aus.'),
    footer(),
  );

  // === SLIDE 3: PROBLEM (Konsequenz) ===
  const slide3 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Zu lang? Dann schneidet Google einfach ab.', 52),
    subline('Ohne bewusste Länge endet der Satz mitten drin.'),
    visualBlock(
      snippetCard(
        'deine-website.de › ueber-uns › team › geschichte',
        'Über unser Team, unsere Werte und die ganze G...',
        ['Wir sind ein Team aus Designer:innen und Entwickler:innen, die seit vielen Ja...'],
        { titleColor: C.textMuted },
      ),
    ),
    keyLearning('Ein abgeschnittener Satz wirkt unfertig und schafft kein Vertrauen.', true),
    footer(),
  );

  // === SLIDE 4: WENDEPUNKT (Richtgröße) ===
  const slide4 = slideRoot(
    badge('DIE FAUSTREGEL'),
    headline('Keine feste Grenze – aber eine Richtgröße.', 52),
    subline('Google schneidet nach Darstellungsbreite ab, nicht nach exakter Zeichenzahl. Zwei Richtwerte helfen trotzdem.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        meterCard('TITLE-TAG', '~50–60 Zeichen', 55, C.accent2),
        meterCard('META-DESCRIPTION', '~150–160 Zeichen', 78, C.accent),
      ),
    ),
    keyLearning('Diese Richtwerte verringern das Risiko, dass der Text mitten im Satz abgeschnitten wird.'),
    footer(),
  );

  // === SLIDE 5: KONKRETE REGELN ===
  const slide5 = slideRoot(
    badge('SO SCHREIBST DU SIE'),
    headline('Drei Regeln für Title & Description.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        exampleCard('Einzigartig pro Seite', 'Jede Unterseite bekommt einen eigenen Title und eine eigene Description.'),
        exampleCard('Kernbegriff nach vorne', 'Das wichtigste Wort im Title steht am Anfang, nicht am Ende.'),
        exampleCard('Zum Klicken einladen', 'Die Description ist eigener Text, kein Zitat aus dem Fließtext.'),
      ),
    ),
    keyLearning('Passt die Description nicht zur Suchanfrage, ersetzt Google sie durch einen eigenen Ausschnitt.'),
    footer(),
  );

  // === SLIDE 6: PRINZIP DAHINTER ===
  const slide6 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Kein Ranking-Faktor, aber ein Klick-Faktor.', 48),
    subline('Die Meta-Description beeinflusst laut Google nicht direkt die Position, wohl aber, ob in der Ergebnisliste geklickt wird.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '12px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px' } },
          h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'POSITION 3'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.textMuted } }, 'Generischer Google-Text'),
          h('div', { style: { display: 'flex', width: '100%', height: '14px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '80%', height: '14px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '4px' } }),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', gap: '12px', backgroundColor: C.accent, borderRadius: '18px', padding: '24px' } },
          h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.8)' } }, 'POSITION 3'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, 'Eigene, klare Description'),
          h('div', { style: { display: 'flex', width: '100%', height: '14px', backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '80%', height: '14px', backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: '4px' } }),
        ),
      ),
    ),
    keyLearning('Bessere Klicks bedeuten mehr Besucher, auch ganz ohne bessere Position.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Title-Tag: Kernbegriff nach vorne, kompakt bleiben', pct: 25 },
    { num: '02', text: 'Meta-Description: eigener Text statt Google-Auswahl', pct: 50 },
    { num: '03', text: 'Länge im Blick behalten, nichts abschneiden lassen', pct: 75 },
    { num: '04', text: 'Für jede Seite einzigartig formulieren', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Learnings für deinen nächsten Title-Tag.', 46),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '60px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Kleine Textzeilen, große Wirkung auf jeden einzelnen Klick.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 140),
      h('span', {
        style: {
          display: 'flex', fontSize: '50px', fontWeight: 800, fontFamily: 'Manrope', color: C.text,
          textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px',
        }
      }, 'Bestimmst du, was Google zeigt?'),
      h('span', {
        style: {
          display: 'flex', fontSize: '30px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft,
          textAlign: 'center', lineHeight: '1.4', marginTop: '8px',
        }
      }, 'Folge @benarodigital für mehr Website-Wissen.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, `output/carousel_${process.env.TODAY}/slides`);
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const svg = await satori(slides[i], { width: W, height: H, fonts });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
    const pngData = resvg.render();
    const pngPath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(pngPath, pngData.asPng());
    console.log(`Slide ${i + 1}/${slides.length} done -> ${pngPath}`);
  }
  console.log('All slides generated!');
}

main().catch(e => { console.error(e); process.exit(1); });
