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

  // === SLIDE 1: HOOK — Stat Hero ===
  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('2 Sekunden länger laden lässt die Absprungrate um 32% steigen.'),
    subline('Eine Google-Analyse von über 900.000 mobilen Landingpages zeigt: Schon kleine Verzögerungen kosten Besucher.'),
    visualBlock(
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '28px', padding: '56px 10px', gap: '8px',
        }
      },
        h('span', { style: { display: 'flex', fontSize: '150px', fontWeight: 800, fontFamily: 'Manrope', color: C.accent2, lineHeight: '1' } }, '+32%'),
        h('span', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted, textAlign: 'center' } }, 'mehr Absprünge: von 1 auf 3 Sekunden Ladezeit'),
      ),
    ),
    keyLearning('Ladezeit ist kein technisches Detail – sie entscheidet, ob ein Besucher überhaupt bleibt.', true),
    footer(),
  );

  // === SLIDE 2: DIE STUDIE — Balkendiagramm ===
  const bars2 = [
    { label: '1→3s', pct: 32 },
    { label: '1→5s', pct: 90 },
    { label: '1→6s', pct: 106 },
    { label: '1→10s', pct: 123 },
  ];
  const maxPct = 123;
  const chartW = 860, chartH = 420, barGap = 40;
  const barW = (chartW - barGap * (bars2.length - 1)) / bars2.length;
  const barsSvg = bars2.map((b, i) => {
    const bh = (b.pct / maxPct) * (chartH - 20);
    const x = i * (barW + barGap);
    const y = chartH - bh;
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="14" fill="${i === bars2.length - 1 ? '#00C2B8' : 'rgba(255,255,255,0.18)'}"/>`;
  }).join('');
  const chart2 = svgImg(`<svg width="${chartW}" height="${chartH}" viewBox="0 0 ${chartW} ${chartH}" xmlns="http://www.w3.org/2000/svg">${barsSvg}</svg>`, chartW, chartH);

  const slide2 = slideRoot(
    badge('DIE STUDIE'),
    headline('So stark steigt die Absprungwahrscheinlichkeit mit der Ladezeit.', 52),
    subline('Google/DoubleClick-Studie "The Need for Mobile Speed" (2016): Je länger eine Seite lädt, desto wahrscheinlicher springen Besucher ab.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        chart2,
        h('div', { style: { display: 'flex', gap: `${barGap}px` } },
          ...bars2.map(b => h('span', { style: { display: 'flex', flex: '1', justifyContent: 'center', fontSize: '22px', fontWeight: 600, fontFamily: 'Inter', color: C.textMuted } }, b.label)),
        ),
      ),
    ),
    keyLearning('Von 1 auf 10 Sekunden Ladezeit steigt die Absprungwahrscheinlichkeit um 123%.', true),
    footer(),
  );

  // === SLIDE 3: DIE FOLGE — Icon-Grid (53 von 100) ===
  const grid3 = (() => {
    const cells = [];
    const cols = 10, rows = 10, cell = 60, gap = 10;
    for (let i = 0; i < cols * rows; i++) {
      const x = (i % cols) * (cell + gap);
      const y = Math.floor(i / cols) * (cell + gap);
      const filled = i < 53;
      cells.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="10" fill="${filled ? '#EF4444' : 'rgba(255,255,255,0.08)'}"/>`);
    }
    const w = cols * (cell + gap) - gap, hgt = rows * (cell + gap) - gap;
    return svgImg(`<svg width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg">${cells.join('')}</svg>`, w, hgt);
  })();

  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('53 von 100 mobilen Besuchen werden abgebrochen.', 56),
    subline('Laut derselben Studie springen 53% der mobilen Besucher ab, wenn eine Seite länger als 3 Sekunden zum Laden braucht.'),
    visualBlock(
      h('div', { style: { display: 'flex', justifyContent: 'center' } }, grid3),
    ),
    keyLearning('Über die Hälfte der potenziellen Kunden ist weg, bevor die Seite überhaupt fertig geladen hat.', true),
    footer(),
  );

  // === SLIDE 4: ERWARTUNG VS. REALITÄT ===
  const slide4 = slideRoot(
    badge('ABER'),
    headline('Ladezeit ist längst mehr als ein UX-Detail.', 56),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: C.textMuted } }, 'ERWARTUNG'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: C.textSoft, lineHeight: '1.4' } }, 'Ladezeit betrifft nur den Komfort der Besucher'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.accent, borderRadius: '20px', padding: '26px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'Manrope', color: 'rgba(255,255,255,0.75)' } }, 'REALITÄT'),
          h('span', { style: { display: 'flex', fontSize: '22px', fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', lineHeight: '1.4' } }, 'Ladezeit ist seit 2021 offizieller Google-Rankingfaktor (Core Web Vitals)'),
        ),
      ),
    ),
    keyLearning('Eine langsame Seite kostet also nicht nur Besucher, sondern auch Sichtbarkeit bei Google.'),
    footer(),
  );

  // === SLIDE 5: CORE WEB VITALS — 3 Karten ===
  function vitalCard(label, sublabel, accent) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '26px',
      }
    },
      h('div', { style: { display: 'flex', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: accent } }),
      h('span', { style: { display: 'flex', fontSize: '26px', fontWeight: 700, fontFamily: 'Manrope', color: C.text } }, label),
      h('span', { style: { display: 'flex', fontSize: '21px', fontWeight: 500, fontFamily: 'Inter', color: C.textMuted, lineHeight: '1.4' } }, sublabel),
    );
  }

  const slide5 = slideRoot(
    badge('CORE WEB VITALS'),
    headline('Diese 3 Zahlen misst Google direkt auf deiner Website.', 48),
    subline('Offizielle Google-Metriken (web.dev/vitals), seit 2021 Teil des Page Experience Update.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        vitalCard('LCP', 'Largest Contentful Paint – größtes Element sichtbar in max. 2,5 Sekunden', C.accent),
        vitalCard('INP', 'Interaction to Next Paint – Reaktion auf Klicks in max. 200 Millisekunden', C.accent2),
        vitalCard('CLS', 'Cumulative Layout Shift – visuelle Stabilität, Wert max. 0,1', C.gold),
      ),
    ),
    keyLearning('Alle drei Werte lassen sich kostenlos mit Google PageSpeed Insights prüfen.'),
    footer(),
  );

  // === SLIDE 6: DIE GRÖSSTEN HEBEL ===
  function leverCard(title, desc) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '26px',
        border: '1px solid rgba(255,255,255,0.08)',
      }
    },
      h('span', { style: { display: 'flex', fontSize: '25px', fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF' } }, title),
      h('span', { style: { display: 'flex', fontSize: '20px', fontWeight: 500, fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', lineHeight: '1.4' } }, desc),
    );
  }

  const slide6 = slideRoot(
    badge('DIE GRÖSSTEN HEBEL'),
    headline('Drei Stellschrauben bringen den größten Tempo-Gewinn.', 48),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        leverCard('Bildoptimierung', 'Bilder in WebP/AVIF ausliefern statt unkomprimiertem JPEG/PNG'),
        leverCard('Hosting & CDN', 'Kurze Serverantwortzeiten durch gutes Hosting und ein Content Delivery Network'),
        leverCard('Schlankes JavaScript', 'Weniger blockierendes Skript, damit der Browser die Seite früher zeigen kann'),
      ),
    ),
    keyLearning('Keine dieser Maßnahmen braucht ein Redesign – alle lassen sich an einer bestehenden Website umsetzen.'),
    footer(),
  );

  // === SLIDE 7: CHECKLISTE ===
  const learnings = [
    { num: '01', text: 'Bilder komprimieren und als WebP/AVIF ausliefern', pct: 25 },
    { num: '02', text: 'Hosting & CDN für kurze Serverantwortzeiten wählen', pct: 50 },
    { num: '03', text: 'Blockierendes JavaScript reduzieren', pct: 75 },
    { num: '04', text: 'Core Web Vitals regelmäßig mit PageSpeed Insights prüfen', pct: 100 },
  ];

  const slide7 = slideRoot(
    badge('DEINE CHECKLISTE'),
    headline('4 Schritte zu einer schnelleren Website.', 54),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ...learnings.map(l =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 24px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
              h('span', { style: { display: 'flex', fontSize: '34px', fontWeight: 800, fontFamily: 'Manrope', color: l.pct === 100 ? C.green : C.accent2, minWidth: '58px' } }, l.num),
              h('span', { style: { display: 'flex', fontSize: '23px', fontWeight: 600, fontFamily: 'Inter', color: C.text, lineHeight: '1.3' } }, l.text),
            ),
            h('div', { style: { display: 'flex', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '3px' } },
              h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
            ),
          )
        ),
      ),
    ),
    keyLearning('Jede Sekunde, die du einsparst, reduziert die Absprungrate messbar.'),
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
      }, 'Wie schnell lädt deine Website wirklich?'),
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
