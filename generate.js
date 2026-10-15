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

  function card(children, accent) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '14px',
        backgroundColor: accent ? C.accent : C.cardBg,
        border: accent ? 'none' : `1px solid ${C.cardBorder}`,
        borderRadius: '20px', padding: '26px',
      }
    }, ...children);
  }

  // === SLIDE 1: HOOK — Vertrauenssignal am falschen Ort ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('Dein Sicherheitssiegel bringt nichts, wenn es keiner sieht, wenn er bezahlen will.', 50),
    subline('Die meisten Vertrauenssignale landen im Footer – weit weg vom Moment, in dem Besucher ihre Daten eingeben.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'IM FOOTER'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Siegel & Logos, die kaum jemand beim Kauf noch sieht'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'AM KAUFBUTTON'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Dieselben Signale genau dort, wo die Entscheidung fällt'),
        ], true),
      ),
    ),
    keyLearning('Nicht das Signal fehlt – der Ort, an dem es steht, ist falsch.', true),
    footer(),
  );

  // === SLIDE 2: DAS PRINZIP — Risiko steigt mit jedem Schritt ===
  function riskBar(pct, color) {
    return h('div', { style: { display: 'flex', height: '20px', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: '10px' } },
      h('div', { style: { display: 'flex', width: `${pct}%`, height: '20px', backgroundColor: color, borderRadius: '10px' } }),
    );
  }

  const slide2 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Je näher die Dateneingabe, desto größer die Kaufangst.', 52),
    subline('Mit jedem Schritt Richtung Zahlung wächst das wahrgenommene Risiko – und damit die Zahl der Abbrüche.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '22px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Produktseite – geringes Risiko'),
          riskBar(30, C.accent2),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Warenkorb – mittleres Risiko'),
          riskBar(65, C.gold),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, 'Zahlungsdaten – höchstes Risiko'),
          riskBar(100, C.red),
        ),
      ),
    ),
    keyLearning('Genau am Punkt des höchsten Risikos fehlt meist jedes Vertrauenssignal.', true),
    footer(),
  );

  // === SLIDE 3: DER FEHLER — Signale verstreut statt platziert ===
  function stackCard(title, desc, accent) {
    return h('div', {
      style: {
        display: 'flex', flexShrink: 0, flexDirection: 'column', gap: '10px',
        backgroundColor: accent ? C.accent : C.cardBg,
        border: accent ? 'none' : `1px solid ${C.cardBorder}`,
        borderRadius: '20px', padding: '24px 26px',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: accent ? 'rgba(255,255,255,0.75)' : C.textMuted, lineHeight: '1.4' } }, desc),
    );
  }

  const slide3 = slideRoot(
    badge('DER FEHLER'),
    headline('Trust-Signale werden verteilt statt platziert.', 54),
    subline('Ein Gütesiegel auf der Startseite, eine Kundenstimme auf der "Über uns"-Seite – aber nichts davon direkt neben dem Formular.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        stackCard('Startseite', 'Gütesiegel im Header – sieht kaum noch jemand beim Checkout'),
        stackCard('"Über uns"-Seite', 'Kundenstimmen – weit weg vom Kaufmoment'),
        stackCard('Checkout-Formular', 'Genau hier: meistens kein einziges Vertrauenssignal', true),
      ),
    ),
    keyLearning('Verstreute Signale bauen kein Vertrauen auf – sie werden schlicht übersehen.', true),
    footer(),
  );

  // === SLIDE 4: WENDEPUNKT — Erwartung vs. Realität ===
  const slide4 = slideRoot(
    badge('WENDEPUNKT'),
    headline('Mehr Werbeversprechen überzeugt nicht – Nähe zum Klick schon.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'ERWARTUNG'),
          h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Mehr Text über Sicherheit und Qualität überzeugt Zweifler'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'REALITÄT'),
          h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Ein sichtbares Signal direkt am Button wirkt stärker als jeder zusätzliche Absatz'),
        ], true),
      ),
    ),
    keyLearning('Vertrauen entsteht im Moment der Entscheidung, nicht davor oder danach.'),
    footer(),
  );

  // === SLIDE 5: WAS WIRKT ===
  function leverCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '8px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '22px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '19px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide5 = slideRoot(
    badge('WAS WIRKT'),
    headline('Diese Signale gehören direkt an den Entscheidungspunkt.', 46),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        leverCard('Sicherheits-Siegel am Formular', 'SSL/TLS-Hinweis direkt neben den Eingabefeldern, nicht nur im Footer'),
        leverCard('Zahlungsanbieter-Logos', 'Bekannte Logos nah am Kaufbutton statt irgendwo auf der Seite'),
        leverCard('Echte Kundenstimmen', 'Mit Namen und Foto statt anonymer Sternebewertung'),
        leverCard('Rückgabe-Garantie sichtbar', 'Direkt am Button, nicht erst in den AGB verlinkt'),
      ),
    ),
    keyLearning('Jedes Signal zählt nur dort, wo gerade eine Entscheidung getroffen wird.'),
    footer(),
  );

  // === SLIDE 6: DAS PRINZIP DAHINTER — Social Proof ===
  const slide6 = slideRoot(
    badge('DAS PRINZIP DAHINTER'),
    headline('Menschen vertrauen Entscheidungen, die andere schon getroffen haben.', 44),
    visualBlock(
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column', gap: '18px',
          backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '32px',
        }
      },
        h('div', { style: { display: 'flex', width: '48px', height: '6px', backgroundColor: C.accent2, borderRadius: '3px' } }),
        h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.5' } },
          'Robert Cialdinis Prinzip der "Social Proof" (sozialer Bewährtheit): Unsicherheit sinkt, wenn sichtbar wird, dass andere eine Handlung bereits sicher vollzogen haben.'),
        h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted } }, '— "Influence", Robert Cialdini'),
      ),
    ),
    keyLearning('Ein Trust-Signal am Kaufbutton macht genau das sichtbar: Andere haben hier schon sicher gekauft.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Sicherheits-Siegel direkt neben Zahlungsfeldern platzieren', pct: 25 },
    { num: '02', text: 'Bekannte Zahlungsanbieter-Logos nah am Kaufbutton zeigen', pct: 50 },
    { num: '03', text: 'Echte Kundenstimmen mit Namen statt generischer Sterne', pct: 75 },
    { num: '04', text: 'Rückgabe- oder Geld-zurück-Garantie am Entscheidungspunkt sichtbar machen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Vertrauenssignale für den Kaufmoment.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 24px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '34px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '58px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Nicht mehr Signale zählen, sondern die richtige Stelle dafür.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 140),
      h('span', {
        style: {
          display: 'flex', fontSize: '46px', fontWeight: 800, fontFamily: 'Manrope', color: C.text,
          textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px',
        }
      }, 'Wo auf deiner Website fehlt noch ein Trust-Signal direkt am Klickpunkt?'),
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
