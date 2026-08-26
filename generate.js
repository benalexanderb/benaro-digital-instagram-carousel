// Carousel: Bildoptimierung — WebP & AVIF statt JPEG/PNG
// Kategorie: Performance & Ladezeit — Benaro Digital Instagram-Automation
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

  // === SLIDE 1 visual: one huge file-size bar dwarfing a small one ===
  function fileSizeCompareCard() {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '22px', backgroundColor: C.cardBg,
        borderRadius: '20px', padding: '34px', border: `1px solid ${C.cardBorder}`,
      }
    },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'TYPISCHES FOTO (JPEG)'),
        h('div', { style: { display: 'flex', width: '96%', height: '30px', backgroundColor: C.red, borderRadius: '8px' } }),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'GLEICHES FOTO (WEBP/AVIF)'),
        h('div', { style: { display: 'flex', width: '30%', height: '30px', backgroundColor: C.accent2, borderRadius: '8px' } }),
      ),
    );
  }

  // === SLIDE 2 visual: Core Web Vitals pill row, LCP highlighted ===
  function cwvRow() {
    const metrics = [
      { key: 'LCP', label: 'Largest Contentful Paint', hl: true },
      { key: 'INP', label: 'Interaction to Next Paint', hl: false },
      { key: 'CLS', label: 'Cumulative Layout Shift', hl: false },
    ];
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
      ...metrics.map(m => h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '18px', padding: '22px 26px', borderRadius: '18px',
          backgroundColor: m.hl ? 'rgba(0,194,184,0.12)' : C.cardBg,
          border: `1px solid ${m.hl ? C.accent2 : C.cardBorder}`,
        }
      },
        h('span', {
          style: {
            display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 800,
            color: m.hl ? C.accent2 : C.text, minWidth: '92px',
          }
        }, m.key),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textSoft } }, m.label),
      ))
    );
  }

  // === SLIDE 3 visual: stalled loading bar on a phone mockup ===
  function stalledLoadVisual() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' } },
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column', width: '360px', backgroundColor: C.cardBg, borderRadius: '28px',
          border: `1px solid ${C.cardBorder}`, padding: '26px', gap: '16px',
        }
      },
        h('div', { style: { display: 'flex', width: '60%', height: '16px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '5px' } }),
        h('div', {
          style: {
            display: 'flex', width: '100%', height: '160px', borderRadius: '16px',
            backgroundColor: 'rgba(239,68,68,0.10)', border: `2px dashed ${C.red}`,
            alignItems: 'center', justifyContent: 'center',
          }
        }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: C.red } }, 'LÄDT NOCH …')),
      ),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '14px' } },
        h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: C.red } }),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.red } }, 'Genau dieser Moment zählt für LCP'),
      ),
    );
  }

  // === SLIDE 4 visual: contrast cards JPEG/PNG vs WebP/AVIF ===
  function formatContrastCards() {
    return h('div', { style: { display: 'flex', gap: '14px' } },
      h('div', {
        style: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid ${C.cardBorder}` }
      },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ÜBLICH'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.text } }, 'JPEG'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.text } }, 'PNG'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4', marginTop: '4px' } }, 'Ältere Formate, schwächere Kompression'),
      ),
      h('div', {
        style: { display: 'flex', flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0,194,184,0.10)', borderRadius: '20px', padding: '28px', gap: '14px', border: `1px solid ${C.accent2}` }
      },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: C.accent2 } }, 'EMPFOHLEN'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.accent2 } }, 'WebP'),
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.accent2 } }, 'AVIF'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4', marginTop: '4px' } }, 'Von Google (web.dev) empfohlen'),
      ),
    );
  }

  // === SLIDE 5 visual: two image placeholders, same quality dot, different size bar ===
  function qualityVsSizeCard(label, barPct, barColor) {
    return h('div', {
      style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: C.cardBg, borderRadius: '20px', padding: '26px', gap: '16px', border: `1px solid ${C.cardBorder}` }
    },
      h('div', {
        style: {
          display: 'flex', width: '100%', height: '140px', borderRadius: '14px',
          backgroundColor: 'rgba(255,255,255,0.10)', alignItems: 'center', justifyContent: 'center',
        }
      }, h('div', { style: { display: 'flex', width: '20px', height: '20px', borderRadius: '10px', backgroundColor: C.green } })),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: C.text } }, label),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, letterSpacing: '1px', color: C.textMuted } }, 'DATEIGRÖSSE'),
      h('div', { style: { display: 'flex', width: '100%', height: '14px', backgroundColor: C.cardBorder, borderRadius: '7px', overflow: 'hidden' } },
        h('div', { style: { display: 'flex', width: `${barPct}%`, height: '14px', backgroundColor: barColor, borderRadius: '7px' } }),
      ),
    );
  }

  // === SLIDE 6 visual: browser support row ===
  function browserSupportVisual() {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' } },
      h('div', { style: { display: 'flex', width: '100%', justifyContent: 'space-between' } },
        ...['Chrome', 'Safari', 'Firefox', 'Edge'].map(name =>
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' } },
            h('div', {
              style: {
                display: 'flex', width: '84px', height: '84px', borderRadius: '42px', backgroundColor: 'rgba(0,194,184,0.12)',
                border: `2px solid ${C.accent2}`, alignItems: 'center', justifyContent: 'center',
              }
            }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 800, color: C.accent2 } }, name[0])),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, color: C.textMuted } }, name),
          )
        ),
      ),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: 'rgba(0,194,184,0.10)', borderRadius: '14px' } },
        h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: C.accent2 } }),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.accent2 } }, 'Von allen aktuellen Browsern unterstützt'),
      ),
    );
  }

  // === SLIDE 1: Hook ===
  const slide1 = slideRoot(
    badge('LADEZEIT-KILLER'),
    headline('DEIN GRÖSSTES BREMSPEDAL:', 42),
    headline('DEINE EIGENEN BILDER', 48, C.accent2),
    subline('Auf den meisten Websites sind Bilder der größte Teil der Seitengröße – und bremsen jeden Klick.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      fileSizeCompareCard(),
    ),
    footer(),
  );

  // === SLIDE 2: Warum das zählt ===
  const slide2 = slideRoot(
    badge('WARUM DAS ZÄHLT'),
    headline('LADEZEIT IST TEIL VON', 44),
    headline('CORE WEB VITALS', 46, C.accent2),
    subline('Google misst mit dem Core Web Vital „Largest Contentful Paint“ (LCP), wie schnell der größte sichtbare Inhalt lädt – oft ein Bild.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      cwvRow(),
    ),
    footer(),
  );

  // === SLIDE 3: Die Folge ===
  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('ÜBERGROSSE BILDER =', 46),
    headline('LANGSAMES LCP', 50, C.red),
    subline('Ein zu großes, unkomprimiertes Bild verzögert genau den Moment, den Google als Ladezeit bewertet.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      stalledLoadVisual(),
    ),
    footer(),
  );

  // === SLIDE 4: Die Lösung ===
  const slide4 = slideRoot(
    badge('DIE LÖSUNG'),
    headline('MODERNE FORMATE:', 42),
    headline('WEBP & AVIF', 50, C.accent2),
    subline('In den offiziellen web.dev-Richtlinien empfiehlt Google WebP und AVIF statt klassischem JPEG oder PNG.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      formatContrastCards(),
    ),
    footer(),
  );

  // === SLIDE 5: Warum das funktioniert ===
  const slide5 = slideRoot(
    badge('WARUM DAS FUNKTIONIERT'),
    headline('STÄRKERE KOMPRESSION,', 40),
    headline('GLEICHE QUALITÄT', 44, C.accent2),
    subline('WebP und AVIF nutzen modernere Kompressionsverfahren als JPEG – kleinere Dateien ohne sichtbaren Qualitätsverlust.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        qualityVsSizeCard('JPEG', 92, C.red),
        qualityVsSizeCard('WebP / AVIF', 34, C.accent2),
      ),
    ),
    keyLearning('Beide Bilder wirken für das Auge gleich gut – nur eine Datei ist deutlich kleiner.', C.accent2),
    footer(),
  );

  // === SLIDE 6: Das Prinzip ===
  const slide6 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('KEIN NISCHEN-FORMAT,', 40),
    headline('LÄNGST STANDARD', 46, C.accent2),
    subline('Alle aktuellen Browser unterstützen WebP und AVIF – ein Umstieg ist technisch längst risikofrei möglich.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      browserSupportVisual(),
    ),
    footer(),
  );

  // === SLIDE 7: Takeaways ===
  const learnings = [
    { num: '01', text: 'Bilder sind auf den meisten Websites der größte Teil der Seitengröße', pct: 25 },
    { num: '02', text: 'WebP und AVIF komprimieren stärker als JPEG – bei vergleichbarer Qualität', pct: 50 },
    { num: '03', text: 'Bildgröße wirkt sich direkt auf den Core Web Vital LCP aus', pct: 75 },
    { num: '04', text: 'Bilder immer in der tatsächlich benötigten Größe ausliefern (responsive images)', pct: 100 },
  ];
  const slide7 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZUR', 48),
    headline('BILDOPTIMIERUNG', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px', overflow: 'hidden' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.accent2 : C.accent, borderRadius: '3px' } }),
          ),
        )
      ),
    ),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '42px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Sind deine Bilder schon\nWebP oder AVIF?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Performance & SEO.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-26', 'slides');
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
