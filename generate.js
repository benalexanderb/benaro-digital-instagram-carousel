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

  // === SLIDE 1: HOOK — Vermutung vs. Test ===
  const slide1 = slideRoot(
    badge('ACHTUNG'),
    headline('Du rätst, welcher Button mehr Kunden bringt – dabei kannst du es einfach testen.', 52),
    subline('Die meisten Änderungen an Websites basieren auf Bauchgefühl statt auf Daten.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'BAUCHGEFÜHL'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, '"Ich glaube, Grün passt besser zum Button."'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'A/B-TEST'),
          h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, '"Die Daten zeigen, welche Farbe wirklich mehr Klicks bringt."'),
        ], true),
      ),
    ),
    keyLearning('A/B-Testing macht aus Vermutungen überprüfbare Entscheidungen.', true),
    footer(),
  );

  // === SLIDE 2: DAS PRINZIP — Traffic-Split ===
  const split2 = (() => {
    const w = 860, hgt = 180, r = 24;
    return svgImg(`<svg width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${w / 2 - 10}" height="${hgt}" rx="${r}" fill="rgba(255,255,255,0.10)"/>
      <rect x="${w / 2 + 10}" y="0" width="${w / 2 - 10}" height="${hgt}" rx="${r}" fill="#00C2B8"/>
    </svg>`, w, hgt);
  })();

  const slide2 = slideRoot(
    badge('DAS PRINZIP'),
    headline('A/B-Testing zeigt zwei Varianten gleichzeitig – nicht nacheinander.', 50),
    subline('Ein Teil der Besucher sieht Variante A (Kontrollgruppe), der andere Teil zeitgleich Variante B.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        split2,
        h('div', { style: { display: 'flex', gap: '20px' } },
          h('span', { style: { display: 'flex', flex: '1', justifyContent: 'center', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.textMuted } }, 'VARIANTE A'),
          h('span', { style: { display: 'flex', flex: '1', justifyContent: 'center', fontSize: '24px', fontWeight: 700, fontFamily: 'Manrope', color: C.accent2 } }, 'VARIANTE B'),
        ),
      ),
    ),
    keyLearning('Nur der Gleichzeitig-Vergleich filtert externe Einflüsse wie Saison oder Traffic-Quelle heraus.'),
    footer(),
  );

  // === SLIDE 3: REGEL 1 — Eine Variable ===
  const slide3 = slideRoot(
    badge('REGEL 1'),
    headline('Teste immer nur eine Variable auf einmal.', 56),
    subline('Design-of-Experiments-Prinzip (Ronald Fisher, 1935): Nur wer eine Sache isoliert verändert, kann ihr die Wirkung eindeutig zuordnen.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '60px', fontWeight: 800, fontFamily: 'Manrope', color: C.green } }, '1'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Variable geändert: Ergebnis eindeutig zuordenbar'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '60px', fontWeight: 800, fontFamily: 'Manrope', color: C.red } }, '5'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Variablen gleichzeitig: unklar, was den Unterschied gemacht hat'),
        ]),
      ),
    ),
    keyLearning('Ohne Isolation weißt du am Ende nicht, welche Änderung wirklich gewirkt hat.', true),
    footer(),
  );

  // === SLIDE 4: REGEL 2 — Nicht zu früh abbrechen ===
  const slide4 = slideRoot(
    badge('REGEL 2'),
    headline('Brich den Test nicht ab, sobald ein Ergebnis gut aussieht.', 48),
    subline('Ein frühes Zwischenergebnis ist oft Zufall. Üblicher Standard in der Statistik: erst ab mindestens 95% Konfidenz entscheiden.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, 'Tag 2: "Variante B gewinnt!" — verfrüht'),
          h('div', { style: { display: 'flex', height: '20px', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: '10px' } },
            h('div', { style: { display: 'flex', width: '28%', height: '20px', backgroundColor: C.red, borderRadius: '10px' } }),
          ),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.text } }, 'Nach ausreichender Stichprobe: belastbares Ergebnis'),
          h('div', { style: { display: 'flex', height: '20px', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: '10px' } },
            h('div', { style: { display: 'flex', width: '100%', height: '20px', backgroundColor: C.green, borderRadius: '10px' } }),
          ),
        ),
      ),
    ),
    keyLearning('Geduld statt Bauchgefühl: Erst bei ausreichender Stichprobengröße ein Ergebnis werten.', true),
    footer(),
  );

  // === SLIDE 5: WAS SICH LOHNT ===
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
    badge('WAS SICH LOHNT'),
    headline('Diese Elemente bringen oft den größten Unterschied.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        leverCard('CTA-Text & Farbe', 'Welche Formulierung und Farbe zum Klick bewegt'),
        leverCard('Value Proposition', 'Wie klar das Angebot in der Headline erklärt wird'),
        leverCard('Formular-Länge', 'Wie viele Felder Besucher wirklich ausfüllen müssen'),
        leverCard('Preis-Darstellung', 'Wie Preise und Pakete gegenübergestellt werden'),
      ),
    ),
    keyLearning('Kleine Elemente nah am Entscheidungsmoment wirken oft stärker als ein komplettes Redesign.'),
    footer(),
  );

  // === SLIDE 6: ERWARTUNG VS. REALITÄT ===
  const slide6 = slideRoot(
    badge('HÄUFIGER FEHLER'),
    headline('Ein Test ist kein Ergebnis für immer.', 56),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'ERWARTUNG'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Ein gewonnener Test gilt für immer'),
        ]),
        card([
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'REALITÄT'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Nutzerverhalten, Angebot und Design ändern sich – Tests regelmäßig wiederholen'),
        ], true),
      ),
    ),
    keyLearning('A/B-Testing ist ein fortlaufender Prozess, kein einmaliges Projekt.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Klare Hypothese und eine Zielmetrik festlegen', pct: 25 },
    { num: '02', text: 'Nur eine Variable pro Test verändern', pct: 50 },
    { num: '03', text: 'Traffic gleichzeitig und zufällig auf beide Varianten verteilen', pct: 75 },
    { num: '04', text: 'Erst bei ausreichender Stichprobe entscheiden', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu einem sauberen A/B-Test.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 24px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '34px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '58px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Ein sauberer Testaufbau entscheidet darüber, ob du dem Ergebnis trauen kannst.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 140),
      h('span', {
        style: {
          display: 'flex', fontSize: '48px', fontWeight: 800, fontFamily: 'Manrope', color: C.text,
          textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px',
        }
      }, 'Was würdest du auf deiner Website zuerst testen?'),
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
