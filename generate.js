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

  // === SLIDE 1: HOOK — die 4 Buchstaben ===
  function letterCard(letter, label, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '24px', padding: '48px 10px',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '84px', fontWeight: 800, fontFamily: 'Manrope', color: accent, lineHeight: '1' } }, letter),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, textAlign: 'center' } }, label),
    );
  }

  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('Vier Buchstaben entscheiden, ob Google deiner Seite vertraut.'),
    subline('Gute Keywords sind nur die halbe Miete – Google prüft explizit, wie glaubwürdig ein Inhalt wirkt.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '14px', height: '420px' } },
        letterCard('E', 'Experience', C.accent),
        letterCard('E', 'Expertise', C.accent2),
        letterCard('A', 'Authority', C.gold),
        letterCard('T', 'Trust', C.green),
      ),
    ),
    keyLearning('Ohne erkennbare Vertrauenssignale zählt gutes Fachwissen für Google kaum.', true),
    footer(),
  );

  // === SLIDE 2: DAS PROBLEM ===
  const grid2 = (() => {
    const cells = [];
    for (let i = 0; i < 12; i++) {
      const x = (i % 4) * 225;
      const y = Math.floor(i / 4) * 125;
      cells.push(`<rect x="${x}" y="${y}" width="205" height="105" rx="14" fill="rgba(255,255,255,0.09)"/>`);
    }
    return svgImg(`<svg width="900" height="375" viewBox="0 0 900 375" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, 900, 375);
  })();

  const slide2 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Viele Websites zeigen Fachwissen – aber keine Beweise dafür.'),
    subline('Google bewertet nicht nur, WAS auf einer Seite steht, sondern WER erkennbar dahintersteht.'),
    visualBlock(grid2),
    keyLearning('Fehlende Trust-Signale wirken sich bei Google und beim Besucher gleich aus: beide bleiben skeptisch.', true),
    footer(),
  );

  // === SLIDE 3: E-E-A-T ERKLÄRT ===
  function signalCard(label, sublabel, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '10px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px',
      }
    },
      h('div', { style: { display: 'flex', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: accent } }),
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, label),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, sublabel),
    );
  }

  const slide3 = slideRoot(
    badge('E-E-A-T'),
    headline('Das prüfen Googles Search Quality Rater Guidelines genau.', 50),
    subline('Vier Signale, anhand derer Qualität und Vertrauenswürdigkeit von Inhalten bewertet werden.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        h('div', { style: { display: 'flex', gap: '14px' } },
          signalCard('Experience', 'Eigene, echte Erfahrung mit dem Thema', C.accent),
          signalCard('Expertise', 'Nachweisbares Fachwissen', C.accent2),
        ),
        h('div', { style: { display: 'flex', gap: '14px' } },
          signalCard('Authoritativeness', 'Anerkennung durch andere Quellen', C.gold),
          signalCard('Trustworthiness', 'Verlässlichkeit, Sicherheit, Transparenz', C.green),
        ),
      ),
    ),
    keyLearning('Diese vier Signale zusammen entscheiden, ob Inhalte als hilfreich und verlässlich gelten.'),
    footer(),
  );

  // === SLIDE 4: OHNE VS. MIT VERTRAUEN ===
  const slide4 = slideRoot(
    badge('OHNE VS. MIT VERTRAUEN'),
    headline('Der Unterschied liegt oft in sichtbaren Details.', 56),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Stockfoto, kein erkennbarer Autor, kein Impressum sichtbar'),
          h('div', { style: { display: 'flex', width: '100%', height: '16px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '70%', height: '16px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '26px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Echtes Foto, Autoren-Bio mit Qualifikation, Impressum & Kontakt sichtbar'),
          h('div', { style: { display: 'flex', width: '100%', height: '16px', backgroundColor: '#FFFFFF', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '55%', height: '16px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '4px' } }),
        ),
      ),
    ),
    keyLearning('Dieselben Inhalte wirken völlig unterschiedlich glaubwürdig – je nachdem, was sichtbar ist.'),
    footer(),
  );

  // === SLIDE 5: KONKRET UMSETZEN ===
  function exampleCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '26px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide5 = slideRoot(
    badge('KONKRET UMSETZEN'),
    headline('So machst du E-E-A-T auf deiner Website sichtbar.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        h('div', { style: { display: 'flex', gap: '14px' } },
          exampleCard('Erfahrung zeigen', 'Eigene Fotos & echte Beispiele statt Stockmaterial'),
          exampleCard('Expertise belegen', 'Autoren-Bio mit echten Qualifikationen'),
        ),
        h('div', { style: { display: 'flex', gap: '14px' } },
          exampleCard('Autorität aufbauen', 'Erwähnungen & Links von anerkannten Quellen'),
          exampleCard('Vertrauen schaffen', 'Impressum, Datenschutz, echte Kontaktdaten'),
        ),
      ),
    ),
    keyLearning('Jedes Signal für sich ist klein. Zusammen prägen sie den Gesamteindruck.'),
    footer(),
  );

  // === SLIDE 6: DAS FUNDAMENT ===
  const s6_pyramid = svgImg(`<svg width="760" height="360" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
    <rect x="300" y="0" width="160" height="70" rx="12" fill="rgba(255,255,255,0.20)"/>
    <rect x="220" y="90" width="320" height="70" rx="12" fill="rgba(255,255,255,0.28)"/>
    <rect x="140" y="180" width="480" height="70" rx="12" fill="rgba(255,255,255,0.4)"/>
    <rect x="40" y="270" width="680" height="80" rx="14" fill="#10B981"/>
  </svg>`, 760, 360);

  const slide6 = slideRoot(
    badge('DAS FUNDAMENT'),
    headline('Trustworthiness trägt die anderen drei Signale.', 50),
    subline('Laut Googles Search Quality Rater Guidelines gilt Trust als das wichtigste der vier Signale.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, s6_pyramid),
    ),
    keyLearning('Ohne Vertrauen verlieren Erfahrung, Expertise und Autorität ihre Wirkung.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Erfahrung zeigen: eigene Fotos & echte Beispiele', pct: 25 },
    { num: '02', text: 'Expertise belegen: Autoren-Bio mit echten Qualifikationen', pct: 50 },
    { num: '03', text: 'Autorität aufbauen: Erwähnungen von anerkannten Quellen', pct: 75 },
    { num: '04', text: 'Vertrauen schaffen: Impressum, Datenschutz, echte Kontaktdaten', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte für mehr E-E-A-T auf deiner Website.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 24px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '34px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '58px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Wer alle vier Signale sichtbar macht, baut Vertrauen auf – bei Google und bei echten Besuchern.'),
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
      }, 'Wie vertrauenswürdig wirkt deine Website wirklich?'),
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
