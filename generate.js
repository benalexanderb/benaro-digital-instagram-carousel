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

  // === SLIDE 1: HOOK ===
  const s1_rows = svgImg(`<svg width="900" height="360" viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="36" fill="rgba(255,255,255,0.14)"/>
    <rect x="124" y="38" width="420" height="20" rx="10" fill="rgba(255,255,255,0.10)"/>
    <rect x="124" y="68" width="300" height="16" rx="8" fill="rgba(255,255,255,0.07)"/>
    <circle cx="60" cy="180" r="36" fill="rgba(255,255,255,0.14)"/>
    <rect x="124" y="158" width="420" height="20" rx="10" fill="rgba(255,255,255,0.10)"/>
    <rect x="124" y="188" width="300" height="16" rx="8" fill="rgba(255,255,255,0.07)"/>
    <circle cx="60" cy="300" r="36" fill="#2952FF"/>
    <text x="60" y="310" font-family="Arial" font-size="34" font-weight="700" fill="#FFFFFF" text-anchor="middle">?</text>
    <rect x="124" y="278" width="420" height="20" rx="10" fill="rgba(255,255,255,0.10)"/>
    <rect x="124" y="308" width="300" height="16" rx="8" fill="rgba(255,255,255,0.07)"/>
  </svg>`, 900, 360);

  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('Google liest nicht nur, was auf deiner Seite steht.'),
    subline('Sondern auch, wer dahintersteckt – und ob das glaubwürdig ist.'),
    visualBlock(s1_rows),
    keyLearning('Ohne erkennbare Urheberschaft bleibt jede Information unbestätigt.', true),
    footer(),
  );

  // === SLIDE 2: PROBLEM ===
  const grid2 = (() => {
    const cells = [];
    for (let i = 0; i < 9; i++) {
      const x = (i % 3) * 300;
      const y = Math.floor(i / 3) * 135;
      cells.push(`<rect x="${x}" y="${y}" width="276" height="112" rx="14" fill="rgba(255,255,255,0.09)"/>`);
      cells.push(`<circle cx="${x + 36}" cy="${y + 36}" r="16" fill="rgba(255,255,255,0.18)"/>`);
      cells.push(`<rect x="${x + 64}" y="${y + 26}" width="180" height="12" rx="6" fill="rgba(255,255,255,0.14)"/>`);
      cells.push(`<rect x="${x + 64}" y="${y + 46}" width="130" height="10" rx="5" fill="rgba(255,255,255,0.08)"/>`);
    }
    return svgImg(`<svg width="900" height="405" viewBox="0 0 900 405" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, 900, 405);
  })();

  const slide2 = slideRoot(
    badge('DAS PROBLEM'),
    headline('Viele Websites schreiben für Keywords – nicht für Vertrauen.', 54),
    subline('Austauschbare Texte ohne erkennbare Autor:innen oder Kontaktangaben.'),
    visualBlock(grid2),
    keyLearning('Anonyme Inhalte wirken für Google wie für Menschen: unbestätigt.', true),
    footer(),
  );

  // === SLIDE 3: DAS PRINZIP (E-E-A-T) ===
  function signalCard(label, sublabel, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '10px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px',
      }
    },
      h('div', { style: { display: 'flex', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: accent } }),
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, label),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.35' } }, sublabel),
    );
  }

  const slide3 = slideRoot(
    badge('E-E-A-T'),
    headline('Vier Buchstaben, die Google seit 2022 nutzt.', 56),
    subline('Aus Googles Search Quality Rater Guidelines – dem Leitfaden für menschliche Bewerter:innen.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          signalCard('Experience', 'Hat die Person das selbst erlebt?', C.accent),
          signalCard('Expertise', 'Verfügt sie über echtes Fachwissen?', C.accent2),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          signalCard('Authority', 'Ist die Quelle in ihrem Feld anerkannt?', C.gold),
          signalCard('Trust', 'Sind Angaben genau & transparent?', C.green),
        ),
      ),
    ),
    keyLearning('Vier Fragen, die Google an jeden Inhalt stellt – bewusst oder nicht.'),
    footer(),
  );

  // === SLIDE 4: KONTRAST OHNE/MIT ===
  const slide4 = slideRoot(
    badge('OHNE VS. MIT E-E-A-T-SIGNALEN'),
    headline('Der Unterschied liegt oft nur in ein paar Angaben.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'OHNE'),
          h('div', { style: { display: 'flex', width: '100%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '100%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('div', { style: { display: 'flex', width: '60%', height: '20px', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: '4px' } }),
          h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, marginTop: '6px' } }, 'Kein Autor, kein Kontakt'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'MIT'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
            h('div', { style: { display: 'flex', width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#FFFFFF' } }),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
              h('div', { style: { display: 'flex', width: '140px', height: '14px', backgroundColor: '#FFFFFF', borderRadius: '4px' } }),
              h('div', { style: { display: 'flex', width: '100px', height: '10px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '4px' } }),
            ),
          ),
          h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.85)', marginTop: '6px' } }, 'Name, Qualifikation, Kontakt sichtbar'),
        ),
      ),
    ),
    keyLearning('Dieselbe Information wirkt mit Urheberschaft sofort glaubwürdiger.'),
    footer(),
  );

  // === SLIDE 5: KONKRETE UMSETZUNG ===
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
    badge('SO SETZT DU ES UM'),
    headline('Vier konkrete Hebel für deine Website.', 52),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Autor-Box', 'Name, Foto & Qualifikation unter jedem Beitrag'),
          exampleCard('Impressum & Kontakt', 'Vollständig und leicht auffindbar'),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          exampleCard('Echte Referenzen', 'Namen, Firmen, nachprüfbare Case Studies'),
          exampleCard('Aktualität', 'Veröffentlichungs- & Update-Datum sichtbar'),
        ),
      ),
    ),
    keyLearning('Jeder Hebel für sich ist klein. Zusammen entsteht Glaubwürdigkeit.'),
    footer(),
  );

  // === SLIDE 6: DAS PRINZIP DAHINTER ===
  const s6_visual = svgImg(`<svg width="700" height="380" viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
    <circle cx="350" cy="190" r="170" fill="rgba(255,255,255,0.06)"/>
    <circle cx="350" cy="190" r="120" fill="rgba(255,255,255,0.10)"/>
    <circle cx="350" cy="190" r="70" fill="#2952FF"/>
    <text x="350" y="200" font-family="Arial" font-size="30" font-weight="700" fill="#FFFFFF" text-anchor="middle">Trust</text>
  </svg>`, 700, 380);

  const slide6 = slideRoot(
    badge('WARUM DAS WICHTIG IST'),
    headline('Google simuliert, was Menschen sowieso einschätzen.', 50),
    subline('Die Search Quality Rater Guidelines verlangen von menschlichen Testern genau das: Erfahrung, Fachwissen, Autorität und Vertrauenswürdigkeit einer Quelle zu bewerten.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, s6_visual),
    ),
    keyLearning('Wer für Menschen glaubwürdig wirkt, erfüllt meist auch E-E-A-T.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Autor:innen-Box mit echtem Namen & Foto ergänzen', pct: 25 },
    { num: '02', text: 'Impressum & Kontakt sichtbar verlinken', pct: 50 },
    { num: '03', text: 'Referenzen mit echten Namen & Firmen zeigen', pct: 75 },
    { num: '04', text: 'Veröffentlichungsdatum & Updates kennzeichnen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte für mehr Trust-Signale.', 54),
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
    keyLearning('Vier kleine Änderungen – ein deutlich glaubwürdigerer Auftritt.'),
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
