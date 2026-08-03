// Carousel: Trust-Signale direkt am CTA (Verlustaversion / Prospect Theory)
// Kategorie: Conversion & CRO — Benaro Digital Instagram-Automation
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

  // === SLIDE 1: Hook — der Button steht, geklickt wird trotzdem nicht ===
  const cursorCluster = h('div', { style: { display: 'flex', position: 'absolute', width: '140px', height: '140px', top: '188px', right: '54px' } },
    h('div', { style: { display: 'flex', position: 'absolute', width: '120px', height: '120px', top: '10px', left: '10px', borderRadius: '60px', border: '3px solid rgba(255,255,255,0.15)' } }),
    h('div', { style: { display: 'flex', position: 'absolute', width: '80px', height: '80px', top: '30px', left: '30px', borderRadius: '40px', border: '3px solid rgba(255,255,255,0.3)' } }),
    h('div', { style: { display: 'flex', position: 'absolute', width: '26px', height: '26px', top: '57px', left: '57px', borderRadius: '13px', backgroundColor: '#FFFFFF' } }),
  );

  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('DER BUTTON STEHT.'),
    headline('GEKLICKT WIRD ER NICHT.', 58, C.accent2),
    subline('Das Problem liegt nicht im Design – sondern im Kopf deines Besuchers.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', position: 'relative', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '24px', border: `1px solid ${C.cardBorder}` } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', height: '44px', padding: '0 20px', borderBottom: `1px solid ${C.cardBorder}` } },
          h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.5)' } }),
          h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: 'rgba(203,163,92,0.5)' } }),
          h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.5)' } }),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 30px 70px' } },
          h('div', { style: { display: 'flex', backgroundColor: 'rgba(41,82,255,0.18)', border: `2px solid ${C.accent}`, borderRadius: '14px', padding: '20px 46px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 700, color: '#FFFFFF' } }, 'Jetzt anfragen'),
          ),
        ),
        cursorCluster,
      ),
    ),
    footer(),
  );

  // === SLIDE 2: Prinzip — Verlustaversion (Prospect Theory) ===
  function bar(height, bg, border) {
    return h('div', { style: { display: 'flex', width: '100%', height: `${height}px`, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '14px 14px 0 0' } });
  }
  const slide2 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('VERLUSTE WIEGEN', 54),
    headline('SCHWERER ALS GEWINNE', 46, C.accent2),
    subline('Prospect Theory von Daniel Kahneman & Amos Tversky (1979): Ein gefühlter Verlust schmerzt stärker, als ein gleich großer Gewinn erfreut.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } },
      h('div', { style: { display: 'flex', gap: '50px', alignItems: 'flex-end' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', width: '190px', height: '280px', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' } },
          bar(110, C.cardBg, C.cardBorder),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'GEWINN'),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', width: '190px', height: '280px', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' } },
          bar(230, 'rgba(239,68,68,0.16)', C.red),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'VERLUST'),
        ),
      ),
    ),
    keyLearning('Jeder Klick auf „Jetzt anfragen" fühlt sich für deinen Besucher wie ein möglicher Verlust an.', C.accent),
    footer(),
  );

  // === SLIDE 3: Konsequenz — jeder Klick ist ein Risiko ===
  const slide3 = slideRoot(
    badge('DIE FOLGE FÜR DEINE WEBSITE'),
    headline('JEDER KLICK IST', 54),
    headline('EIN RISIKO', 54),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.cardBorder}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'WAS ER GEWINNT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Eine Lösung, ein Angebot, eine Antwort.'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.red}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'WAS ER RISKIERT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Zeit, Daten, Geld – und Enttäuschung.'),
      ),
    ),
    keyLearning('Ohne Gegengewicht wiegt das wahrgenommene Risiko schwerer als der Nutzen – und er springt ab.', C.red),
    footer(),
  );

  // === SLIDE 4: Erwartung vs. Realität ===
  const slide4 = slideRoot(
    badge('MYTHOS VS. REALITÄT'),
    headline('DER BUTTON ALLEIN', 50),
    headline('REICHT NICHT', 50),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: C.cardBg, borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.cardBorder}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '29px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, '„Ein Button reicht, wenn Design und Text stimmen."'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.14)', borderRadius: '20px', padding: '28px', gap: '10px', border: `1px solid ${C.accent}` } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '29px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Ein Trust-Signal direkt daneben senkt das gefühlte Risiko – und den Klick-Widerstand.'),
      ),
    ),
    keyLearning('Der Unterschied zwischen Zögern und Klicken liegt oft nur wenige Zentimeter neben dem Button.', C.accent),
    footer(),
  );

  // === SLIDE 5: Trust-Signale, die wirken ===
  const slide5 = slideRoot(
    badge('TRUST-SIGNALE, DIE WIRKEN'),
    headline('4 SIGNALE FÜR', 52),
    headline('MEHR VERTRAUEN', 52),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      triggerRow('1', 'Klares Versprechen', 'Feste Reaktionszeit oder unverbindliches Angebot direkt benennen.', C.accent2),
      triggerRow('2', 'Echte Referenz', 'Eine konkrete Kundenstimme direkt neben dem Button.', C.gold),
      triggerRow('3', 'Sicherheits-Hinweis', 'Ein kurzer Datenschutz-Hinweis nimmt die Sorge vor der Weitergabe.', C.accent),
      triggerRow('4', 'Klare Erwartung', 'Sagen, was nach dem Klick passiert – kein Verkaufsdruck.', C.green),
    ),
    footer(),
  );

  // === SLIDE 6: Takeaways ===
  const learnings = [
    { num: '01', text: 'Verluste wiegen psychologisch schwerer als Gewinne', pct: 25 },
    { num: '02', text: 'Jeder Klick fühlt sich wie ein kleines Risiko an', pct: 50 },
    { num: '03', text: 'Trust-Signale direkt am Button senken dieses Risiko', pct: 75 },
    { num: '04', text: 'Konkret statt vage: Zeit, Sicherheit, Ablauf klar benennen', pct: 100 },
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
      }, 'Steht ein Trust-Signal\nneben deinem CTA?'),
      h('span', {
        style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textMuted, textAlign: 'center', lineHeight: '1.5' }
      }, 'Folge @benarodigital für mehr Website-Wissen\nrund um Conversion, Design & Psychologie.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
  const outDir = path.join(__dirname, 'output', 'carousel_2026-08-03', 'slides');
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
