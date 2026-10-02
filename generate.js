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

  function signalCard(label, sublabel, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '10px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px',
      }
    },
      h('div', { style: { display: 'flex', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: accent } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, label),
      h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, sublabel),
    );
  }

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

  // === SLIDE 1: HOOK ===
  const s1_visual = svgImg(`<svg width="900" height="380" viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="900" height="380" rx="24" fill="rgba(255,255,255,0.06)"/>
    <circle cx="120" cy="120" r="54" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="6" stroke-dasharray="10 10"/>
    <rect x="210" y="92" width="300" height="24" rx="8" fill="rgba(255,255,255,0.25)"/>
    <rect x="210" y="134" width="220" height="18" rx="6" fill="rgba(255,255,255,0.14)"/>
    <rect x="80" y="230" width="740" height="18" rx="6" fill="rgba(255,255,255,0.12)"/>
    <rect x="80" y="266" width="740" height="18" rx="6" fill="rgba(255,255,255,0.12)"/>
    <rect x="80" y="302" width="500" height="18" rx="6" fill="rgba(255,255,255,0.12)"/>
    <circle cx="790" cy="90" r="40" fill="none" stroke="#2952FF" stroke-width="8"/>
    <line x1="818" y1="118" x2="852" y2="152" stroke="#2952FF" stroke-width="10" stroke-linecap="round"/>
  </svg>`, 900, 380);

  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('Google schaut nicht nur auf deinen Text.'),
    subline('Sondern auch darauf, wer dahinter steckt – und ob man dem vertrauen kann.'),
    visualBlock(s1_visual),
    keyLearning('Ein Text ohne erkennbare Urheberschaft wirkt auf Google weniger vertrauenswürdig.', true),
    footer(),
  );

  // === SLIDE 2: DAS PRINZIP (E-E-A-T) ===
  const slide2 = slideRoot(
    badge('E-E-A-T'),
    headline('Vier Fragen, die Google sich stellt.', 56),
    subline('Erfahrung, Expertise, Autorität, Vertrauenswürdigkeit – offizielle Google-Bewertungskriterien.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          signalCard('Experience', 'Eigene Erfahrung mit dem Thema', C.accent),
          signalCard('Expertise', 'Fachliches Können nachweisbar', C.accent2),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          signalCard('Authority', 'Als Quelle anerkannt', C.gold),
          signalCard('Trust', 'Vertrauenswürdig & sicher', C.green),
        ),
      ),
    ),
    keyLearning('Diese vier Kriterien stehen so in Googles Search Quality Rater Guidelines.'),
    footer(),
  );

  // === SLIDE 3: PROBLEM (gesichtslose Websites) ===
  const grid3 = (() => {
    const cells = [];
    for (let i = 0; i < 12; i++) {
      const x = (i % 4) * 225;
      const y = Math.floor(i / 4) * 125;
      cells.push(`<rect x="${x}" y="${y}" width="205" height="105" rx="14" fill="rgba(255,255,255,0.09)"/>`);
    }
    return svgImg(`<svg width="900" height="375" viewBox="0 0 900 375" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, 900, 375);
  })();

  const slide3 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Die meisten Websites bleiben gesichtslos.', 54),
    subline('Kein Autor, kein Impressum, keine Quellen – für Google ein Vertrauensproblem.'),
    visualBlock(grid3),
    keyLearning('Ohne erkennbare Urheberschaft wird Inhalt schwerer als vertrauenswürdig eingestuft.', true),
    footer(),
  );

  // === SLIDE 4: WENDEPUNKT (Kontrast-Karten) ===
  const slide4 = slideRoot(
    badge('OHNE VS. MIT VERTRAUENSSIGNALEN'),
    headline('Ein sichtbarer Autor macht oft den Unterschied.', 50),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE'),
          h('div', { style: { display: 'flex', width: '100%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '100%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '70%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT'),
          h('div', { style: { display: 'flex', width: '100%', height: '44px', backgroundColor: '#FFFFFF', borderRadius: '6px' } }),
          h('div', { style: { display: 'flex', width: '55%', height: '16px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' } }),
        ),
      ),
    ),
    keyLearning('Sichtbare Urheberschaft und Quellenangaben zeigen: Hier steckt jemand Reales dahinter.'),
    footer(),
  );

  // === SLIDE 5: KONKRET UMGESETZT ===
  const slide5 = slideRoot(
    badge('KONKRET UMGESETZT'),
    headline('So zeigst du, wer du bist.', 56),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Autoren-Bio', 'Echter Name, Foto, Qualifikation'),
          exampleCard('Quellenangaben', 'Studien & Fakten klar belegt'),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Impressum', 'Leicht auffindbar, vollständig'),
          exampleCard('Kontakt', 'Telefon, E-Mail oder Adresse sichtbar'),
        ),
      ),
    ),
    keyLearning('Jedes Signal für sich ist klein. Zusammen ergeben sie Glaubwürdigkeit.'),
    footer(),
  );

  // === SLIDE 6: DAS PRINZIP DAHINTER ===
  const s6_visual = svgImg(`<svg width="700" height="380" viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
    <line x1="350" y1="30" x2="350" y2="350" stroke="rgba(255,255,255,0.18)" stroke-width="4"/>
    <circle cx="350" cy="60" r="46" fill="#2952FF"/>
    <circle cx="350" cy="166" r="38" fill="#00C2B8"/>
    <circle cx="350" cy="262" r="30" fill="#CBA35C"/>
    <circle cx="350" cy="340" r="22" fill="#10B981"/>
  </svg>`, 700, 380);

  const slide6 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Vertrauen ist kein Trick, sondern das Fundament.', 48),
    subline('Googles Search Quality Rater Guidelines bewerten Qualität seit 2022 ausdrücklich auch an eigener Erfahrung – nicht nur an Fachwissen.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, s6_visual),
    ),
    keyLearning('Wer diese Signale konsequent zeigt, baut nicht nur Rankings, sondern echtes Vertrauen auf.'),
    footer(),
  );

  // === SLIDE 7: LEARNINGS ===
  const learnings = [
    { num: '01', text: 'Autoren-Bio mit echtem Namen und Foto ergänzen', pct: 25 },
    { num: '02', text: 'Quellen für Fakten und Studien verlinken', pct: 50 },
    { num: '03', text: 'Impressum & Kontakt leicht auffindbar machen', pct: 75 },
    { num: '04', text: 'Echte Erfahrung und Referenzen zeigen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Learnings für mehr Vertrauen.', 56),
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
    keyLearning('E-E-A-T lässt sich nicht erkaufen – nur durch echte Transparenz aufbauen.'),
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
      }, 'Weiß Google, wer hinter deiner Website steckt?'),
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
