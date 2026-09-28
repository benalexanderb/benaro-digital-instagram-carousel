const fs = require('fs');
const path = require('path');

async function main() {
  const satori = (await import('satori')).default || require('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const manropeDir = path.join(__dirname, 'node_modules/@fontsource/manrope/files');
  const interDir = path.join(__dirname, 'node_modules/@fontsource/inter/files');
  const fonts = [
    ...[600, 700, 800].flatMap((w) => [
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-${w}-normal.woff`) },
      { name: 'Manrope', weight: w, style: 'normal', data: fs.readFileSync(`${manropeDir}/manrope-latin-ext-${w}-normal.woff`) },
    ]),
    ...[400, 500, 600, 700].flatMap((w) => [
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
    type, props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch },
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
  function badge(text, color) {
    return h('div', { style: { display: 'flex', marginBottom: '24px' } },
      h('span', {
        style: {
          display: 'flex', fontSize: '22px', fontFamily: 'Manrope', fontWeight: 700, letterSpacing: '3px',
          color: color || C.text, backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`,
          padding: '10px 22px', borderRadius: '12px',
        },
      }, text),
    );
  }

  function headline(text, size = 62) {
    return h('span', {
      style: {
        display: 'flex', fontSize: `${size}px`, fontFamily: 'Manrope', fontWeight: 800,
        color: C.text, lineHeight: '1.12', letterSpacing: '-1.5px', marginBottom: '6px',
      },
    }, text);
  }

  function subline(text) {
    return h('span', {
      style: {
        display: 'flex', fontSize: '28px', fontFamily: 'Inter', fontWeight: 500,
        color: C.textSoft, lineHeight: '1.5', marginTop: '14px',
      },
    }, text);
  }

  function keyLearning(text, accentColor) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '18px', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: '32px',
      },
    },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '44px', backgroundColor: accentColor || C.accent, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontSize: '28px', fontFamily: 'Inter', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text),
    );
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '28px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontSize: '24px', fontFamily: 'Inter', fontWeight: 500, color: C.textMuted } }, '@benarodigital'),
    );
  }

  function slideRoot(...children) {
    return h('div', {
      style: {
        display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px',
        backgroundColor: C.bg, fontFamily: 'Inter',
      },
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
  const browserBarSvg = `<svg width="860" height="140" viewBox="0 0 860 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="30" width="860" height="80" rx="40" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    <rect x="44" y="55" width="26" height="22" rx="4" fill="#00C2B8"/>
    <path d="M50 55V44A7 7 0 0 1 64 44V55" stroke="#00C2B8" stroke-width="6" fill="none"/>
    <rect x="96" y="60" width="560" height="20" rx="10" fill="rgba(255,255,255,0.28)"/>
    <circle cx="770" cy="70" r="5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="792" cy="70" r="5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="814" cy="70" r="5" fill="rgba(255,255,255,0.3)"/>
  </svg>`;

  const slide1 = slideRoot(
    badge('WUSSTEST DU?', C.accent2),
    headline('Schön reicht nicht mehr.'),
    subline('Google bewertet längst, wie vertrauenswürdig deine Website wirklich ist.'),
    visualBlock(svgImg(browserBarSvg, 860, 140)),
    footer(),
  );

  // === SLIDE 2: E-E-A-T DEFINITIONS ===
  function eeatCard(letter, label, desc) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '10px',
      },
    },
      h('span', { style: { display: 'flex', fontSize: '40px', fontFamily: 'Manrope', fontWeight: 800, color: C.accent2 } }, letter),
      h('span', { style: { display: 'flex', fontSize: '26px', fontFamily: 'Manrope', fontWeight: 700, color: C.text } }, label),
      h('span', { style: { display: 'flex', fontSize: '22px', fontFamily: 'Inter', fontWeight: 500, color: C.textMuted, lineHeight: '1.35' } }, desc),
    );
  }

  const slide2 = slideRoot(
    badge('E-E-A-T'),
    headline('Vier Signale, auf die Google achtet'),
    subline('Das steckt hinter der Abkürzung:'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h('div', { style: { display: 'flex', gap: '16px' } },
          eeatCard('E', 'Erfahrung', 'Hat die Quelle das selbst erlebt?'),
          eeatCard('E', 'Fachwissen', 'Stimmt das Wissen fachlich?'),
        ),
        h('div', { style: { display: 'flex', gap: '16px' } },
          eeatCard('A', 'Autorität', 'Wird die Seite anerkannt zitiert?'),
          eeatCard('T', 'Vertrauen', 'Ist die Seite sicher & transparent?'),
        ),
      ),
    ),
    keyLearning('So heißen die Kriterien in Googles Search Quality Rater Guidelines.'),
    footer(),
  );

  // === SLIDE 3: CONSEQUENCE (FUNNEL) ===
  function funnelBar(pct, label, sub) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      h('div', { style: { display: 'flex', width: `${pct}%`, height: '64px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', alignItems: 'center', padding: '0 26px' } },
        h('span', { style: { display: 'flex', fontSize: '26px', fontFamily: 'Manrope', fontWeight: 700, color: C.text } }, label),
      ),
      h('span', { style: { display: 'flex', fontSize: '22px', fontFamily: 'Inter', fontWeight: 500, color: C.textMuted } }, sub),
    );
  }

  const slide3 = slideRoot(
    badge('DIE FOLGE'),
    headline('Fehlt Vertrauen, verlierst du zweimal'),
    subline('Bei Google im Ranking – und bei Besuchern in der Conversion.'),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '26px' } },
        funnelBar(100, 'Sichtbarkeit', 'Nutzer findet deine Seite bei Google'),
        funnelBar(72, 'Vertrauen', 'Nutzer bleibt & liest weiter'),
        funnelBar(40, 'Anfrage', 'Nutzer meldet sich wirklich'),
      ),
    ),
    keyLearning('Ohne Vertrauenssignale brechen Besucher vor der Anfrage ab.', C.red),
    footer(),
  );

  // === SLIDE 4: EXPECTATION VS REALITY ===
  function contrastCard(label, text, dark) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', gap: '14px', borderRadius: '20px', padding: '30px',
        backgroundColor: dark ? C.text : C.cardBg,
        border: dark ? 'none' : `1px solid ${C.cardBorder}`,
      },
    },
      h('span', { style: { display: 'flex', fontSize: '22px', fontFamily: 'Manrope', fontWeight: 700, letterSpacing: '2px', color: dark ? 'rgba(20,22,26,0.55)' : C.textMuted } }, label),
      h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: dark ? 'rgba(20,22,26,0.15)' : C.cardBorder, borderRadius: '2px' } }),
      h('span', { style: { display: 'flex', fontSize: '27px', fontFamily: 'Inter', fontWeight: 600, color: dark ? '#14161A' : C.textSoft, lineHeight: '1.4' } }, text),
    );
  }

  const slide4 = slideRoot(
    badge('MISSVERSTÄNDNIS'),
    headline('Die meisten denken: SEO = Keywords', 56),
    subline('Googles eigene Richtlinien sagen etwas anderes.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        contrastCard('ERWARTUNG', 'Keywords und Backlinks reichen aus.', false),
        contrastCard('REALITÄT', 'Erfahrung, Fachwissen & Transparenz zählen genauso.', true),
      ),
    ),
    keyLearning('Quelle: Google Search Quality Rater Guidelines.'),
    footer(),
  );

  // === SLIDE 5: CONCRETE EXAMPLES ===
  function numberRow(num, label, desc) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '22px 26px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px',
      },
    },
      h('span', { style: { display: 'flex', fontSize: '32px', fontFamily: 'Manrope', fontWeight: 800, color: C.accent2, minWidth: '56px' } }, num),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
        h('span', { style: { display: 'flex', fontSize: '26px', fontFamily: 'Manrope', fontWeight: 700, color: C.text } }, label),
        h('span', { style: { display: 'flex', fontSize: '22px', fontFamily: 'Inter', fontWeight: 500, color: C.textMuted, lineHeight: '1.35' } }, desc),
      ),
    );
  }

  const slide5 = slideRoot(
    badge('KONKRET'),
    headline('So zeigst du E-E-A-T auf deiner Seite', 52),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        numberRow('01', 'Erfahrung', 'Echte Fallbeispiele statt Stockfotos'),
        numberRow('02', 'Fachwissen', 'Autor:innen-Profile mit echten Qualifikationen'),
        numberRow('03', 'Autorität', 'Presse, Referenzen & Verlinkungen von außen'),
        numberRow('04', 'Vertrauen', 'Impressum, Datenschutz & echte Kontaktdaten'),
      ),
    ),
    keyLearning('Jedes Signal lässt sich einzeln optimieren.'),
    footer(),
  );

  // === SLIDE 6: PRINCIPLE (YMYL) ===
  function ymylCard(iconSvg, label) {
    return h('div', {
      style: {
        display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', gap: '16px',
        backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '30px 16px',
      },
    },
      svgImg(iconSvg, 64, 64),
      h('span', { style: { display: 'flex', fontSize: '22px', fontFamily: 'Manrope', fontWeight: 700, color: C.text, textAlign: 'center' } }, label),
    );
  }

  const coinSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="none" stroke="#CBA35C" stroke-width="5"/>
    <circle cx="32" cy="32" r="15" fill="none" stroke="#CBA35C" stroke-width="4"/>
  </svg>`;
  const healthSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="26" y="10" width="12" height="44" rx="4" fill="#2952FF"/>
    <rect x="10" y="26" width="44" height="12" rx="4" fill="#2952FF"/>
  </svg>`;
  const shieldSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6L54 14V30C54 44 44 54 32 58C20 54 10 44 10 30V14Z" fill="none" stroke="#00C2B8" stroke-width="5"/>
  </svg>`;

  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Bei Geld, Gesundheit & Sicherheit prüft Google strenger', 46),
    subline('Google nennt das YMYL – Your Money or Your Life.'),
    visualBlock(
      h('div', { style: { display: 'flex', gap: '16px' } },
        ymylCard(coinSvg, 'Geld'),
        ymylCard(healthSvg, 'Gesundheit'),
        ymylCard(shieldSvg, 'Sicherheit'),
      ),
    ),
    keyLearning('Als Unternehmer:in zählt deine Website fast immer dazu.'),
    footer(),
  );

  // === SLIDE 7: TAKEAWAYS ===
  function learningCard(num, text, pct) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontSize: '36px', fontFamily: 'Manrope', fontWeight: 800, color: pct === 100 ? C.green : C.text, minWidth: '58px' } }, num),
        h('span', { style: { display: 'flex', fontSize: '27px', fontFamily: 'Inter', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, text),
      ),
      h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${pct}%`, height: '6px', backgroundColor: pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
      ),
    );
  }

  const slide7 = slideRoot(
    badge('TAKEAWAYS'),
    headline('3 Schritte für mehr Vertrauen', 56),
    visualBlock(
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        learningCard('01', 'Echte Autor:innen sichtbar machen', 33),
        learningCard('02', 'Quellen & Referenzen transparent verlinken', 66),
        learningCard('03', 'Impressum, Datenschutz & Kontakt leicht auffindbar halten', 100),
      ),
    ),
    keyLearning('Vertrauen ist ein Rankingfaktor – kein Nice-to-have.'),
    footer(),
  );

  // === SLIDE 8: CTA ===
  const slide8 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '36px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontSize: '52px', fontFamily: 'Manrope', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Vertraut deine Website schon sich selbst?'),
      h('span', { style: { display: 'flex', fontSize: '30px', fontFamily: 'Inter', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Folge @benarodigital für mehr Website-Wissen, das wirkt.'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, 'output', `carousel_${process.env.CAROUSEL_DATE}`, 'slides');
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

main().catch((e) => { console.error(e); process.exit(1); });
