// Carousel: 5 psychologische Trigger, die aus Besuchern Kunden machen
// Beispiel-Post für die neue Benaro Digital Instagram-Automation
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
    bg: '#14161A',          // anthracite (site's dark section bg)
    text: '#FFFFFF',
    textSoft: 'rgba(255,255,255,0.72)',
    textMuted: '#9AA0AB',   // --color-on-dark-muted
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.12)',
    accent: '#2952FF',      // --color-accent (electric blue)
    accent2: '#00C2B8',     // --color-accent-2 (teal)
    gold: '#CBA35C',        // --color-gold
    green: '#10B981',
    red: '#EF4444',
  };

  const W = 1080, H = 1350;

  const h = (type, props, ...ch) => ({
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch }
  });

  // === BD monogram (exact paths from src/components/ui/logo.tsx LogoMark), white fill ===
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

  function headline(text, size) {
    return h('span', {
      style: {
        display: 'flex', fontFamily: 'Manrope', fontSize: (size || 62) + 'px', fontWeight: 800, color: C.text,
        lineHeight: '1.08', letterSpacing: '-1.5px', marginBottom: '6px'
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

  // === SLIDE 1: Hook ===
  const slide1 = slideRoot(
    badge('PSYCHOLOGIE'),
    headline('5 TRIGGER,'),
    headline('DIE AUS BESUCHERN'),
    h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '62px', fontWeight: 800, color: C.accent2, lineHeight: '1.08', letterSpacing: '-1.5px' } }, 'KUNDEN MACHEN'),
    subline('Die meisten Websites verkaufen nicht am Design — sondern an fehlender Psychologie.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px', justifyContent: 'center' } },
        ...['01', '02', '03', '04', '05'].map((n, i) =>
          h('div', {
            style: {
              display: 'flex', width: '160px', height: '160px', borderRadius: '20px',
              backgroundColor: i === 2 ? 'rgba(41,82,255,0.16)' : C.cardBg,
              border: `1px solid ${i === 2 ? C.accent : C.cardBorder}`,
              alignItems: 'center', justifyContent: 'center',
            }
          }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '48px', fontWeight: 800, color: i === 2 ? C.accent : 'rgba(255,255,255,0.4)' } }, n))
        )
      )
    ),
    footer(),
  );

  // === SLIDE 2: Fact (50ms) ===
  const slide2 = slideRoot(
    badge('DER ERSTE EINDRUCK'),
    headline('Dein Besucher urteilt', 52),
    headline('schneller als du denkst', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '160px', fontWeight: 800, color: C.accent, letterSpacing: '-4px' } }, '50ms'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'So lange braucht das Gehirn, um sich\neinen ersten Eindruck von deiner\nWebsite zu bilden (Lindgaard et al., 2006)'),
    ),
    keyLearning('Bevor jemand liest, hat er bereits entschieden, ob er dir vertraut.', C.accent),
    footer(),
  );

  // === SLIDE 3: Principle (Aesthetic-Usability-Effect) ===
  const slide3 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Der Aesthetic-', 56),
    headline('Usability-Effect', 56),
    subline('Menschen verzeihen kleine Usability-Schwächen, wenn eine Website gut aussieht und vertrauenswürdig wirkt.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '12px', border: `1px solid ${C.cardBorder}` } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'OHNE PSYCHOLOGIE'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Design allein reicht nicht'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(0,194,184,0.12)', borderRadius: '20px', padding: '28px', gap: '12px', border: `1px solid ${C.accent2}` } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent2 } }, 'MIT PSYCHOLOGIE'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.accent2, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Vertrauen entsteht gezielt'),
        ),
      ),
    ),
    keyLearning('Gutes Design schafft Sympathie — Trigger schaffen Vertrauen.', C.accent2),
    footer(),
  );

  // === SLIDE 4: Erwartung vs Realität ===
  const slide4 = slideRoot(
    badge('MYTHOS VS. REALITÄT'),
    headline('Was die meisten', 56),
    headline('Website-Betreiber denken', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.cardBorder}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, '„Schönes Design reicht, der Rest ergibt sich."'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.14)', borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.accent}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Ohne psychologische Trigger bleibt Vertrauen aus — und Besucher springen ab.'),
      ),
    ),
    keyLearning('Design bringt Besucher zum Bleiben. Trigger bringen sie zum Handeln.', C.accent),
    footer(),
  );

  // === Trigger row component ===
  function triggerRow(num, title, desc, color) {
    return h('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', backgroundColor: C.cardBg, borderRadius: '18px', padding: '22px 26px', border: `1px solid ${C.cardBorder}` } },
      h('div', {
        style: {
          display: 'flex', minWidth: '54px', height: '54px', borderRadius: '14px',
          backgroundColor: color, alignItems: 'center', justifyContent: 'center',
        }
      }, h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: '#0B0C0E' } }, num)),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '30px', fontWeight: 700, color: C.text } }, title),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc),
      ),
    );
  }

  // === SLIDE 5: Trigger 1-3 ===
  const slide5 = slideRoot(
    badge('DIE 5 TRIGGER — TEIL 1'),
    headline('Diese 3 wirken', 52),
    headline('sofort beim Betreten', 44),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      triggerRow('1', 'Social Proof', 'Kundenstimmen, Logos, Bewertungen zeigen: andere vertrauen bereits.', C.accent2),
      triggerRow('2', 'Autorität', 'Zertifikate, Presselogos, Expertenwissen signalisieren Kompetenz.', C.gold),
      triggerRow('3', 'Verknappung', 'Begrenzte Plätze oder Zeiträume erhöhen die Entscheidungsdringlichkeit.', C.accent),
    ),
    footer(),
  );

  // === SLIDE 6: Trigger 4-5 ===
  const slide6 = slideRoot(
    badge('DIE 5 TRIGGER — TEIL 2'),
    headline('Diese 2 entscheiden', 52),
    headline('über die Handlung', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px' } },
      triggerRow('4', 'Reziprozität', 'Kostenloser Mehrwert zuerst (Guide, Check) erzeugt den Wunsch zurückzugeben.', C.green),
      triggerRow('5', 'Ankereffekt', 'Der zuerst gezeigte Preis oder Wert prägt, wie fair alles Weitere wirkt.', C.accent),
    ),
    keyLearning('Alle 5 Trigger zusammen verwandeln Aufmerksamkeit in Vertrauen — und Vertrauen in Anfragen.', C.accent2),
    footer(),
  );

  // === SLIDE 7: Takeaways ===
  const learnings = [
    { num: '01', text: 'Vertrauen entsteht in den ersten 50 Millisekunden', pct: 25 },
    { num: '02', text: 'Design allein verkauft nicht — Psychologie schon', pct: 50 },
    { num: '03', text: 'Social Proof & Autorität gehören auf jede Startseite', pct: 75 },
    { num: '04', text: 'Ein klarer CTA nutzt Reziprozität und Ankereffekt', pct: 100 },
  ];
  const slide7 = slideRoot(
    badge('DIE TAKEAWAYS'),
    headline('4 Learnings zum', 54),
    headline('Mitnehmen', 54),
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

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', {
        style: {
          display: 'flex', fontFamily: 'Manrope', fontSize: '44px', fontWeight: 800, color: C.text,
          textAlign: 'center', lineHeight: '1.3', letterSpacing: '-1px',
        }
      }, 'Welcher Trigger fehlt\nauf deiner Website?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Psychologie, Design & SEO.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const outDir = path.join(__dirname, 'output', 'example_5-psychologische-trigger', 'slides');
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
