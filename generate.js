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

  // === SLIDE 1: HOOK — die isolierte Seite ===
  const s1_network = svgImg(`<svg width="880" height="420" viewBox="0 0 880 420" xmlns="http://www.w3.org/2000/svg">
    <line x1="200" y1="130" x2="330" y2="230" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <line x1="330" y1="230" x2="200" y2="320" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <line x1="330" y1="230" x2="470" y2="150" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <line x1="330" y1="230" x2="470" y2="300" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <line x1="470" y1="150" x2="580" y2="90" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <line x1="470" y1="300" x2="580" y2="340" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>
    <circle cx="330" cy="230" r="34" fill="#2952FF"/>
    <circle cx="200" cy="130" r="22" fill="rgba(255,255,255,0.28)"/>
    <circle cx="200" cy="320" r="22" fill="rgba(255,255,255,0.28)"/>
    <circle cx="470" cy="150" r="22" fill="rgba(255,255,255,0.28)"/>
    <circle cx="470" cy="300" r="22" fill="rgba(255,255,255,0.28)"/>
    <circle cx="580" cy="90" r="18" fill="rgba(255,255,255,0.18)"/>
    <circle cx="580" cy="340" r="18" fill="rgba(255,255,255,0.18)"/>
    <circle cx="760" cy="230" r="26" fill="rgba(239,68,68,0.9)"/>
    <circle cx="760" cy="230" r="42" fill="none" stroke="rgba(239,68,68,0.5)" stroke-width="3" stroke-dasharray="6 8"/>
  </svg>`, 880, 420);

  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('Deine beste Seite – von der Startseite aus unerreichbar?', 54),
    subline('Viele Unternehmensseiten haben Unterseiten, auf die intern kein einziger Link zeigt.'),
    visualBlock(s1_network),
    keyLearning('Eine Seite ohne eingehende Links ist digital fast unsichtbar.', true),
    footer(),
  );

  // === SLIDE 2: WIE GOOGLE DIE SEITE FINDET ===
  const s2_crawl = svgImg(`<svg width="880" height="360" viewBox="0 0 880 360" xmlns="http://www.w3.org/2000/svg">
    <line x1="120" y1="180" x2="340" y2="90" stroke="#00C2B8" stroke-width="5"/>
    <line x1="120" y1="180" x2="340" y2="180" stroke="#00C2B8" stroke-width="5"/>
    <line x1="120" y1="180" x2="340" y2="270" stroke="#00C2B8" stroke-width="5"/>
    <line x1="340" y1="90" x2="580" y2="60" stroke="#00C2B8" stroke-width="5"/>
    <line x1="340" y1="180" x2="580" y2="180" stroke="#00C2B8" stroke-width="5"/>
    <line x1="580" y1="60" x2="800" y2="60" stroke-dasharray="2 10" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
    <circle cx="120" cy="180" r="38" fill="#2952FF"/>
    <circle cx="340" cy="90" r="24" fill="rgba(255,255,255,0.3)"/>
    <circle cx="340" cy="180" r="24" fill="rgba(255,255,255,0.3)"/>
    <circle cx="340" cy="270" r="24" fill="rgba(255,255,255,0.3)"/>
    <circle cx="580" cy="60" r="20" fill="rgba(255,255,255,0.2)"/>
    <circle cx="580" cy="180" r="20" fill="rgba(255,255,255,0.2)"/>
    <circle cx="800" cy="60" r="16" fill="rgba(239,68,68,0.85)"/>
  </svg>`, 880, 360);

  const slide2 = slideRoot(
    badge('WIE GOOGLE DEINE SEITE FINDET'),
    headline('Google findet nur, wohin ein Link führt.', 56),
    subline('Google Search Central: Suchmaschinen entdecken neue und bestehende Seiten, indem sie Links von Seite zu Seite folgen.'),
    visualBlock(s2_crawl),
    keyLearning('Kein Link dorthin heißt: schwerer zu finden – für Google wie für Besucher.'),
    footer(),
  );

  // === SLIDE 3: DAS PROBLEM — ORPHAN PAGES ===
  const grid3 = (() => {
    const cells = [];
    for (let i = 0; i < 12; i++) {
      const x = (i % 4) * 210;
      const y = Math.floor(i / 4) * 125;
      const isOrphan = i === 9;
      cells.push(`<rect x="${x}" y="${y}" width="190" height="100" rx="14" fill="${isOrphan ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.09)'}" stroke="${isOrphan ? '#EF4444' : 'none'}" stroke-width="${isOrphan ? 3 : 0}"/>`);
    }
    return svgImg(`<svg width="860" height="375" viewBox="0 0 860 375" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, 860, 375);
  })();

  const slide3 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Waisenseiten: erreichbar per URL, aber praktisch unsichtbar.', 50),
    subline('Eine "Orphan Page" hat keine internen Links, die auf sie zeigen – weder für Nutzer noch für Suchmaschinen.'),
    visualBlock(grid3),
    keyLearning('So eine Seite kann noch so gut sein – gefunden wird sie kaum.', true),
    footer(),
  );

  // === SLIDE 4: WENDEPUNKT — OHNE VS. MIT VERLINKUNG ===
  const slide4 = slideRoot(
    badge('OHNE VS. MIT VERLINKUNG'),
    headline('Oft reichen wenige gezielte Links.', 58),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE'),
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '26px', backgroundColor: 'rgba(239,68,68,0.16)', border: '2px dashed rgba(239,68,68,0.6)' } }),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Seite ohne eingehende Links – isoliert'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT'),
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '26px', backgroundColor: '#FFFFFF' } }),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Von relevanten Seiten aus verlinkt – auffindbar'),
        ),
      ),
    ),
    keyLearning('Der Unterschied ist selten neuer Content – meist nur fehlende Links.'),
    footer(),
  );

  // === SLIDE 5: PRINZIP — RELEVANZ FLIESST DURCH LINKS ===
  const s5_flow = svgImg(`<svg width="820" height="360" viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg">
    <line x1="120" y1="180" x2="420" y2="90" stroke="#2952FF" stroke-width="10"/>
    <line x1="120" y1="180" x2="420" y2="270" stroke="#2952FF" stroke-width="6"/>
    <line x1="420" y1="90" x2="700" y2="60" stroke="#00C2B8" stroke-width="5"/>
    <line x1="420" y1="90" x2="700" y2="140" stroke="#00C2B8" stroke-width="3"/>
    <circle cx="120" cy="180" r="42" fill="#FFFFFF"/>
    <circle cx="420" cy="90" r="28" fill="rgba(0,194,184,0.85)"/>
    <circle cx="420" cy="270" r="20" fill="rgba(255,255,255,0.22)"/>
    <circle cx="700" cy="60" r="16" fill="rgba(255,255,255,0.3)"/>
    <circle cx="700" cy="140" r="14" fill="rgba(255,255,255,0.18)"/>
  </svg>`, 820, 360);

  const slide5 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Interne Links geben Relevanz weiter.', 56),
    subline('Google Search Central: Interne Links helfen dabei, Beziehungen und Wichtigkeit von Seiten zueinander zu vermitteln.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, s5_flow),
    ),
    keyLearning('Verlinkst du von einer starken Seite aus, wirkt das wie eine Empfehlung.'),
    footer(),
  );

  // === SLIDE 6: DER ANKERTEXT ZÄHLT ===
  const slide6 = slideRoot(
    badge('DER ANKERTEXT ZÄHLT'),
    headline('Der Linktext sagt, worum es geht.', 58),
    subline('Google Search Central empfiehlt beschreibenden Ankertext statt generischer Phrasen.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          h('span', { style: { display: 'flex', fontSize: '32px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' } }, '"Hier klicken"'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          h('span', { style: { display: 'flex', fontSize: '32px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' } }, '"Mehr erfahren"'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px 28px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontSize: '32px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, '"Leitfaden zur internen Verlinkung"'),
        ),
      ),
    ),
    keyLearning('Beschreibender Ankertext hilft Google und Besuchern gleichermaßen.'),
    footer(),
  );

  // === SLIDE 7: LEARNINGS ===
  const learnings = [
    { num: '01', text: 'Wichtige Seiten von der Startseite aus verlinken', pct: 25 },
    { num: '02', text: 'Beschreibende Ankertexte statt "hier klicken"', pct: 50 },
    { num: '03', text: 'Keine Waisenseiten ohne eingehende Links lassen', pct: 75 },
    { num: '04', text: 'Neue Inhalte mit verwandten Seiten verknüpfen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Learnings für deine interne Verlinkung.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '36px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '60px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Kleine Verlinkungs-Anpassungen bringen oft mehr als neuer Content.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 140),
      h('span', {
        style: {
          display: 'flex', fontSize: '50px', fontWeight: 800, fontFamily: 'Manrope', color: C.text,
          textAlign: 'center', lineHeight: '1.25', letterSpacing: '-1px',
        }
      }, 'Ist jede wichtige Seite deiner Website nur einen Klick entfernt?'),
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
