// Carousel: Social Proof statt Selbstlob (Cialdini, "Influence", 1984)
// Kategorie: Trust & Social Proof — Benaro Digital Instagram-Automation
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

  function triggerRow(num, title, desc, color) {
    return h('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', backgroundColor: C.cardBg, borderRadius: '18px', padding: '20px 24px', border: `1px solid ${C.cardBorder}` } },
      h('div', {
        style: {
          display: 'flex', minWidth: '50px', height: '50px', borderRadius: '14px',
          backgroundColor: color, alignItems: 'center', justifyContent: 'center',
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 800, color: '#0B0C0E' } }, num)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 700, color: C.text } }, title),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc),
      ),
    );
  }

  function personIcon(color) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' } },
      h('div', { style: { display: 'flex', width: '30px', height: '30px', borderRadius: '15px', backgroundColor: color } }),
      h('div', { style: { display: 'flex', width: '46px', height: '26px', borderRadius: '14px 14px 0 0', backgroundColor: color } }),
    );
  }

  // === SLIDE 1: Hook — Eigenlob vs. Kundenstimme ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('DU SAGST, DU BIST'),
    headline('DIE BESTE WAHL.', 58, C.accent2),
    subline('Dein Besucher glaubt es trotzdem nicht – das Problem liegt nicht in deiner Botschaft.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('DU SAGST', '„Wir sind die beste Wahl für dich.“', { strike: true }),
      statementCard('KUNDE SAGT', '„Die haben mein Problem wirklich gelöst.“', { bg: 'rgba(0,194,184,0.12)', border: C.accent2, labelColor: C.accent2, textColor: C.text }),
    ),
    footer(),
  );

  // === SLIDE 2: Prinzip — Social Proof (Cialdini, 1984) ===
  const slide2 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('MENSCHEN VERTRAUEN', 52),
    headline('ANDEREN MENSCHEN', 46, C.accent2),
    subline('Social Proof – ein Prinzip von Psychologe Robert Cialdini ("Influence", 1984): In unsicheren Situationen orientieren wir uns am Verhalten anderer, um die richtige Entscheidung zu treffen.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '22px' } },
      h('div', { style: { display: 'flex', gap: '24px', alignItems: 'flex-end' } },
        personIcon(C.cardBorder),
        personIcon(C.cardBorder),
        personIcon(C.cardBorder),
        personIcon(C.cardBorder),
        personIcon(C.accent2),
      ),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'FOLGEN DEM VERHALTEN ANDERER'),
    ),
    keyLearning('Ein Testimonial ist kein nettes Extra – es ist der Beweis, den Interessenten unbewusst suchen.', C.accent),
    footer(),
  );

  // === SLIDE 3: Konsequenz — ohne Beweis bleibt alles Behauptung ===
  const slide3 = slideRoot(
    badge('DIE FOLGE FÜR DEINE WEBSITE'),
    headline('OHNE BEWEIS BLEIBT', 50),
    headline('ALLES BEHAUPTUNG', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('WAS DU SCHREIBST', '„Professionell, zuverlässig, erfahren“ – das behauptet jede Website.'),
      statementCard('WAS FEHLT', 'Ein unabhängiger Beweis, dass es auch stimmt.', { bg: 'rgba(239,68,68,0.12)', border: C.red, labelColor: C.red, textColor: C.text }),
    ),
    keyLearning('Ohne Bestätigung von außen wirkt jedes Qualitätsversprechen austauschbar.', C.red),
    footer(),
  );

  // === SLIDE 4: Erwartung vs. Realität ===
  const slide4 = slideRoot(
    badge('MYTHOS VS. REALITÄT'),
    headline('JEDES TESTIMONIAL', 50),
    headline('WIRKT GLEICH GUT', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      statementCard('ERWARTUNG', '„Irgendein positives Zitat auf der Seite reicht schon.“'),
      statementCard('REALITÄT', 'Konkret, spezifisch und einer echten Person zuordenbar – erst das macht ein Testimonial glaubwürdig.', { bg: 'rgba(41,82,255,0.14)', border: C.accent, labelColor: C.accent, textColor: C.text }),
    ),
    keyLearning('Vage Lob-Sätze wirken wie Werbung. Konkrete, zuordenbare Aussagen wirken wie ein Beweis.', C.accent),
    footer(),
  );

  // === SLIDE 5: Vier Formen von Beweis ===
  const slide5 = slideRoot(
    badge('VIER FORMEN VON BEWEIS'),
    headline('SO ZEIGST DU', 52),
    headline('ECHTEN BEWEIS', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      triggerRow('1', 'Konkrete Kundenstimme', 'Name und ein spezifisches Ergebnis statt allgemeinem Lob.', C.accent2),
      triggerRow('2', 'Nachvollziehbare Case Study', 'Ausgangslage, Vorgehen, Ergebnis – verständlich für neue Besucher.', C.gold),
      triggerRow('3', 'Sichtbare Kennzahlen', 'Anzahl betreuter Kunden oder Projekte, sofern real belegbar.', C.accent),
      triggerRow('4', 'Unabhängige Siegel', 'Verifizierte Bewertungsplattformen als externe Bestätigung.', C.green),
    ),
    footer(),
  );

  // === SLIDE 6: Takeaways ===
  const learnings = [
    { num: '01', text: 'Menschen vertrauen anderen Menschen mehr als Werbeversprechen', pct: 25 },
    { num: '02', text: 'Ohne externen Beweis bleibt jede Aussage nur eine Behauptung', pct: 50 },
    { num: '03', text: 'Konkrete, zuordenbare Testimonials wirken stärker als vages Lob', pct: 75 },
    { num: '04', text: 'Zeig echten Beweis statt allgemeiner Qualitätsversprechen', pct: 100 },
  ];
  const slide6 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 LEARNINGS ZUM', 54),
    headline('MITNEHMEN', 54),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      ...learnings.map(l =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '22px 26px', backgroundColor: C.cardBg, borderRadius: '18px', border: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.accent2 : C.text, minWidth: '58px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
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
          display: 'flex', fontFamily: 'Manrope', fontSize: '44px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Zeigt deine Website\nechten Beweis?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Vertrauen, Design & Psychologie.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-08', 'slides');
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
