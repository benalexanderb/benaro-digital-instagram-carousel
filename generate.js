// Carousel: Touch-Targets — warum zu kleine Buttons mobile Klicks kosten
// Kategorie: Mobile & Accessibility — Benaro Digital Instagram-Automation
const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap(w => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(path.join(manropeDir, `manrope-latin-${w}-normal.woff`)) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(path.join(manropeDir, `manrope-latin-ext-${w}-normal.woff`)) },
    ]),
    ...[400, 500, 600, 700].flatMap(w => [
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(path.join(interDir, `inter-latin-${w}-normal.woff`)) },
      { name: 'Inter', weight: w, style: 'normal', data: fs.readFileSync(path.join(interDir, `inter-latin-ext-${w}-normal.woff`)) },
    ]),
  ];

  // === Benaro Digital brand colors (from benarodigital.com globals.css) ===
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

  // === BD monogram ===
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
    const height = width * (46 / 86);
    return h('img', { src, width, height, style: { display: 'flex' } });
  }

  // === Reusable components ===
  function badge(text) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '3px',
          color: C.accent2, backgroundColor: 'rgba(0,194,184,0.12)',
          padding: '10px 22px', borderRadius: '12px'
        }
      }, text)
    );
  }

  function headline(text, size, color) {
    return h('span', {
      style: {
        display: 'flex', fontFamily: 'Manrope', fontSize: (size || 58) + 'px', fontWeight: 800, color: color || C.text,
        lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '6px'
      }
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, lineHeight: '1.5', marginTop: '10px' }
    }, text);
  }

  function keyLearning(text, accentColor) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '14px',
        backgroundColor: C.cardBg, borderRadius: '16px', padding: '22px 28px', marginTop: 'auto',
        border: `1px solid ${C.cardBorder}`,
      }
    },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '40px', backgroundColor: accentColor || C.accent, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text)
    );
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital')
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

  function statementCard(label, text, opts) {
    opts = opts || {};
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', backgroundColor: opts.bg || C.cardBg, borderRadius: '20px',
        padding: '28px', gap: '10px', border: `1px solid ${opts.border || C.cardBorder}`,
      }
    },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: opts.labelColor || C.textMuted } }, label),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600,
          color: opts.textColor || C.textSoft, lineHeight: '1.4',
          textDecoration: opts.strike ? 'line-through' : 'none',
        }
      }, text),
    );
  }

  function processCard(step, title, desc, color) {
    return h('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', backgroundColor: C.cardBg, borderRadius: '18px', padding: '22px 26px', border: `1px solid ${C.cardBorder}` } },
      h('div', {
        style: {
          display: 'flex', minWidth: '52px', height: '52px', borderRadius: '14px',
          backgroundColor: color, alignItems: 'center', justifyContent: 'center',
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: '#0B0C0E' } }, step)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '27px', fontWeight: 700, color: C.text } }, title),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc),
      ),
    );
  }

  // Two circles showing target size vs. finger contact area (offset = miss)
  function targetMissVisual() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' } },
      h('div', { style: { display: 'flex', position: 'relative', width: 420, height: 380, alignItems: 'center', justifyContent: 'center' } },
        h('div', { style: { display: 'flex', position: 'absolute', width: 340, height: 340, borderRadius: '170px', backgroundColor: 'rgba(0,194,184,0.10)', border: `4px dashed ${C.accent2}`, top: 14, left: 40 } }),
        h('div', {
          style: {
            display: 'flex', position: 'absolute', width: 96, height: 96, borderRadius: '24px',
            backgroundColor: C.accent, top: 200, left: 250, alignItems: 'center', justifyContent: 'center',
          }
        }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '38px', fontWeight: 800, color: '#FFFFFF' } }, 'X')),
      ),
      h('div', { style: { display: 'flex', gap: '32px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '20px', height: '20px', borderRadius: '6px', backgroundColor: C.accent } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.textSoft } }, 'Button'),
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '20px', height: '20px', borderRadius: '10px', border: `2px dashed ${C.accent2}` } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.textSoft } }, 'Fingerkuppe'),
        ),
      ),
    );
  }

  // Two circles side by side illustrating Fitts's Law (small/far = hard, large/close = easy)
  function fittsVisual() {
    function circleCard(sizePx, label, sub, color) {
      return h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', gap: '18px', backgroundColor: C.cardBg, borderRadius: '20px', padding: '30px 20px', border: `1px solid ${C.cardBorder}` } },
        h('div', { style: { display: 'flex', width: sizePx, height: sizePx, borderRadius: (sizePx / 2) + 'px', backgroundColor: color, alignItems: 'center', justifyContent: 'center' } }),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text, textAlign: 'center' } }, label),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.4' } }, sub),
      );
    }
    return h('div', { style: { display: 'flex', gap: '16px' } },
      circleCard(64, 'KLEIN & WEIT WEG', 'Schwer zu treffen, mehr Fehltipps', C.red),
      circleCard(120, 'GROSS & NAH', 'Schnell und zuverlässig getroffen', C.green),
    );
  }

  // === SLIDE 1: Hook ===
  const slide1 = slideRoot(
    badge('FAT-FINGER-PROBLEM'),
    headline('DANEBEN GETIPPT.', 50),
    headline('SCHON WIEDER.', 50, C.accent2),
    subline('Am Handy reicht ein Millimeter Unterschied zwischen Klick und Fehltipp.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      targetMissVisual(),
    ),
    footer(),
  );

  // === SLIDE 2: Maus vs. Finger ===
  const slide2 = slideRoot(
    badge('MAUS VS. FINGER'),
    headline('EIN ZEIGER TRIFFT', 46),
    headline('PIXELGENAU.', 48, C.accent2),
    headline('EIN FINGER NICHT.', 46),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('MAUS-KLICK', 'Ein Cursor zeigt exakt auf einen Pixel – präzise und mit sofortigem Hover-Feedback.'),
      statementCard('FINGER-TIPP', 'Eine Fingerkuppe deckt eine ganze Fläche ab, ohne Vorschau, wo genau sie landet.', { bg: 'rgba(41,82,255,0.14)', border: C.accent, labelColor: C.accent, textColor: C.text }),
    ),
    footer(),
  );

  // === SLIDE 3: Fitts's Law ===
  const slide3 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('FITTS\'S LAW', 56, C.accent2),
    subline('Paul Fitts, 1954: Je kleiner und weiter entfernt ein Ziel ist, desto länger dauert der Tipp – und desto öfter geht er daneben.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      fittsVisual(),
    ),
    keyLearning('Größere, näher platzierte Ziele werden schneller und zuverlässiger getroffen.', C.accent2),
    footer(),
  );

  // === SLIDE 4: Die Standards ===
  const slide4 = slideRoot(
    badge('DIE STANDARDS'),
    headline('WIE GROSS IST', 50),
    headline('GROSS GENUG?', 50, C.accent2),
    subline('Drei unabhängige Richtlinien, ein gemeinsamer Nenner: größer schlägt kleiner.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      processCard('44', 'Apple Human Interface Guidelines', 'Mindestens 44 × 44 Punkt für jedes tippbare Element.', C.accent2),
      processCard('48', 'Google Material Design', 'Mindestens 48 × 48 dp Touch-Target-Größe.', C.gold),
      processCard('WCAG', 'W3C WCAG 2.5.8 / 2.5.5', 'Minimum 24 × 24 CSS-Pixel (AA), empfohlen 44 × 44 CSS-Pixel (AAA).', C.accent),
    ),
    keyLearning('Faustregel: 44 × 44px erfüllt alle drei Standards gleichzeitig.', C.accent2),
    footer(),
  );

  // === SLIDE 5: Erwartung vs. Realität ===
  const slide5 = slideRoot(
    badge('ERWARTUNG VS. REALITÄT'),
    headline('SIEHT GROSS GENUG', 44),
    headline('AUS – IST ES ABER NICHT', 42),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('ERWARTUNG', '„Der Button ist doch gut sichtbar, das passt schon so.“'),
      statementCard('REALITÄT', 'Zwei Buttons ohne ausreichend Abstand zueinander führen zu Fehltipps – unabhängig davon, wie groß oder auffällig sie aussehen.', { bg: 'rgba(239,68,68,0.12)', border: C.red, labelColor: C.red, textColor: C.text }),
    ),
    keyLearning('Zu kleine oder zu eng stehende Buttons kosten Klicks – und am Ende Kunden.', C.red),
    footer(),
  );

  // === SLIDE 6: Takeaways ===
  const learnings = [
    { num: '01', text: 'Zielgröße von mindestens 44 × 44px für alle wichtigen Buttons', pct: 25 },
    { num: '02', text: 'Ausreichend Abstand zwischen tippbaren Elementen einplanen', pct: 50 },
    { num: '03', text: 'Wichtige Aktionen in Daumenreichweite platzieren', pct: 75 },
    { num: '04', text: 'Immer auf einem echten Smartphone testen, nicht nur am Desktop', pct: 100 },
  ];
  const slide6 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZUM', 52),
    headline('MITNEHMEN', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '23px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px', overflow: 'hidden' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.accent2 : C.accent, borderRadius: '3px' } }),
          ),
        )
      ),
    ),
    footer(),
  );

  // === SLIDE 7: CTA ===
  const slide7 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Ist dein Call-to-Action\nauch am Handy leicht\nzu treffen?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Mobile UX & Accessibility.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-14', 'slides');
  fs.mkdirSync(outDir, { recursive: true });

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

main().catch(e => { console.error(e); process.exit(1); });
