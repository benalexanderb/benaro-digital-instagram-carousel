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

  // === SLIDE 1: HOOK — orphan page visual ===
  const s1_network = (() => {
    const nodes = [
      { x: 160, y: 90 }, { x: 420, y: 70 }, { x: 680, y: 110 },
      { x: 200, y: 260 }, { x: 460, y: 250 },
    ];
    const edges = [[0, 1], [1, 2], [0, 3], [1, 4]];
    const lines = edges.map(([a, b]) => `<line x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="rgba(255,255,255,0.22)" stroke-width="4"/>`).join('');
    const circles = nodes.map(n => `<circle cx="${n.x}" cy="${n.y}" r="26" fill="rgba(255,255,255,0.16)"/>`).join('');
    const orphan = `<circle cx="820" cy="300" r="30" fill="#2952FF"/>`;
    return svgImg(`<svg width="900" height="360" viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg">${lines}${circles}${orphan}</svg>`, 900, 360);
  })();

  const slide1 = slideRoot(
    badge('ÜBERSEHEN'),
    headline('Deine wichtigste Seite bekommt null Links – von dir selbst.'),
    subline('Die meisten Websites verschenken eines der stärksten SEO-Signale, ohne es zu merken.'),
    visualBlock(s1_network),
    keyLearning('Eine Seite ohne interne Links ist für Google fast unsichtbar.', true),
    footer(),
  );

  // === SLIDE 2: WIE GOOGLE DIE SEITE LIEST ===
  const s2_network = (() => {
    const home = { x: 450, y: 70 };
    const pages = [{ x: 200, y: 220 }, { x: 450, y: 250 }, { x: 700, y: 220 }];
    const orphan = { x: 860, y: 310 };
    const lines = pages.map(p => `<line x1="${home.x}" y1="${home.y}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>`).join('');
    const pageCircles = pages.map(p => `<circle cx="${p.x}" cy="${p.y}" r="30" fill="rgba(255,255,255,0.18)"/>`).join('');
    return svgImg(`<svg width="900" height="360" viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg">
      ${lines}
      <circle cx="${home.x}" cy="${home.y}" r="40" fill="#00C2B8"/>
      ${pageCircles}
      <circle cx="${orphan.x}" cy="${orphan.y}" r="22" fill="rgba(255,255,255,0.08)"/>
    </svg>`, 900, 360);
  })();

  const slide2 = slideRoot(
    badge('WIE GOOGLE DEINE SEITE LIEST'),
    headline('Google folgt Links, um deine Website zu verstehen.'),
    subline('Jeder interne Link ist ein Hinweis: Diese Seite gehört dazu – und ist wichtig.'),
    visualBlock(s2_network),
    keyLearning('Ohne Link dorthin fehlt der Pfad, über den Google die Seite findet.'),
    footer(),
  );

  // === SLIDE 3: PROBLEM — Orphan Pages ===
  const grid3 = (() => {
    const cells = [];
    for (let i = 0; i < 11; i++) {
      const x = (i % 4) * 225;
      const y = Math.floor(i / 4) * 125;
      cells.push(`<rect x="${x}" y="${y}" width="205" height="105" rx="14" fill="rgba(255,255,255,0.09)"/>`);
    }
    cells.push(`<rect x="675" y="250" width="205" height="105" rx="14" fill="none" stroke="#EF4444" stroke-width="4" stroke-dasharray="10,8"/>`);
    return svgImg(`<svg width="900" height="375" viewBox="0 0 900 375" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, 900, 375);
  })();

  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('Unverlinkte Seiten nennt man „Orphan Pages“.', 54),
    subline('Ohne eingehende interne Links findet Google sie schwerer – und stuft sie als weniger relevant ein.'),
    visualBlock(grid3),
    keyLearning('Eine Seite kann hervorragend sein und trotzdem kaum gefunden werden.', true),
    footer(),
  );

  // === SLIDE 4: WENDEPUNKT (Kontrast-Karten) ===
  const slide4 = slideRoot(
    badge('OHNE VS. MIT VERLINKUNG'),
    headline('Ein einziger Link kann entscheiden, ob eine Seite gefunden wird.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE'),
          svgImg(`<svg width="260" height="120" viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="60" r="28" fill="rgba(255,255,255,0.14)"/></svg>`, 260, 120),
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, 'Keine Seite verweist darauf'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT'),
          svgImg(`<svg width="260" height="120" viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg">
            <line x1="40" y1="20" x2="130" y2="60" stroke="rgba(255,255,255,0.6)" stroke-width="4"/>
            <line x1="220" y1="20" x2="130" y2="60" stroke="rgba(255,255,255,0.6)" stroke-width="4"/>
            <line x1="130" y1="110" x2="130" y2="60" stroke="rgba(255,255,255,0.6)" stroke-width="4"/>
            <circle cx="40" cy="20" r="14" fill="rgba(255,255,255,0.5)"/>
            <circle cx="220" cy="20" r="14" fill="rgba(255,255,255,0.5)"/>
            <circle cx="130" cy="110" r="14" fill="rgba(255,255,255,0.5)"/>
            <circle cx="130" cy="60" r="30" fill="#FFFFFF"/>
          </svg>`, 260, 120),
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' } }, 'Mehrere Seiten verweisen darauf'),
        ),
      ),
    ),
    keyLearning('Interne Links sind Empfehlungen – auch innerhalb der eigenen Website.'),
    footer(),
  );

  // === SLIDE 5: VIER GEWOHNHEITEN KONKRET ===
  function exampleCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '26px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide5 = slideRoot(
    badge('SO GEHT’S KONKRET'),
    headline('Vier Gewohnheiten für bessere interne Verlinkung.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Sprechender Ankertext', 'Nie „hier klicken“ – den Seiteninhalt im Linktext beschreiben'),
          exampleCard('Wichtige Seiten verlinken', 'Von starken Seiten wie Startseite oder Blog auf zentrale Unterseiten verweisen'),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Kurze Klickpfade', 'Wichtige Seiten in wenigen Klicks von der Startseite erreichbar halten'),
          exampleCard('Breadcrumbs nutzen', 'Zeigen Nutzern und Google die Position in der Seitenstruktur'),
        ),
      ),
    ),
    keyLearning('Jede dieser Gewohnheiten ist klein – zusammen verändern sie die Struktur.'),
    footer(),
  );

  // === SLIDE 6: DAS PRINZIP DAHINTER (PageRank) ===
  const s6_visual = svgImg(`<svg width="700" height="380" viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
    <line x1="150" y1="60" x2="350" y2="190" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <line x1="550" y1="60" x2="350" y2="190" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <line x1="150" y1="320" x2="350" y2="190" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <line x1="550" y1="320" x2="350" y2="190" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <circle cx="150" cy="60" r="24" fill="rgba(255,255,255,0.22)"/>
    <circle cx="550" cy="60" r="24" fill="rgba(255,255,255,0.22)"/>
    <circle cx="150" cy="320" r="24" fill="rgba(255,255,255,0.22)"/>
    <circle cx="550" cy="320" r="24" fill="rgba(255,255,255,0.22)"/>
    <circle cx="350" cy="190" r="56" fill="#2952FF"/>
  </svg>`, 700, 380);

  const slide6 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Links sind Empfehlungen – auch innerhalb der eigenen Seite.', 46),
    subline('PageRank-Prinzip (Larry Page & Sergey Brin, Stanford 1998): Eine Seite gewinnt an Gewicht durch Anzahl und Qualität der Links, die auf sie zeigen – auch durch interne Links.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, s6_visual),
    ),
    keyLearning('Verlinkst du bewusst, gibst du deinen wichtigsten Seiten mehr Gewicht.'),
    footer(),
  );

  // === SLIDE 7: LEARNINGS ===
  const learnings = [
    { num: '01', text: 'Sprechenden Ankertext statt „hier klicken“ verwenden', pct: 25 },
    { num: '02', text: 'Wichtige Seiten von starken Seiten aus verlinken', pct: 50 },
    { num: '03', text: 'Klickpfad zu wichtigen Seiten kurz halten', pct: 75 },
    { num: '04', text: 'Breadcrumbs für klare Struktur einsetzen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Learnings für deine interne Verlinkung.', 52),
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
    keyLearning('Kleine Linkentscheidungen summieren sich zu einer klaren Seitenstruktur.'),
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
      }, 'Weiß Google, welche Seiten bei dir wirklich zählen?'),
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
