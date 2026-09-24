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

  const W = 1080;
  const H = 1350;

  const h = (type, props, ...ch) => ({
    type,
    props: { ...props, children: ch.length === 1 ? ch[0] : ch.length === 0 ? undefined : ch },
  });

  // === BD LOGO ===
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
  function badge(text, color = C.accent2) {
    return h(
      'div',
      { style: { display: 'flex', marginBottom: '24px' } },
      h(
        'span',
        {
          style: {
            display: 'flex',
            fontFamily: 'Manrope',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '3px',
            color,
            backgroundColor: C.cardBg,
            border: `1px solid ${C.cardBorder}`,
            padding: '10px 22px',
            borderRadius: '12px',
          },
        },
        text
      )
    );
  }

  function headline(text, size = 62) {
    return h(
      'span',
      {
        style: {
          display: 'flex',
          fontFamily: 'Manrope',
          fontSize: `${size}px`,
          fontWeight: 800,
          color: C.text,
          lineHeight: '1.12',
          letterSpacing: '-1.5px',
          marginBottom: '6px',
        },
      },
      text
    );
  }

  function subline(text) {
    return h(
      'span',
      {
        style: {
          display: 'flex',
          fontFamily: 'Inter',
          fontSize: '30px',
          fontWeight: 500,
          color: C.textSoft,
          lineHeight: '1.5',
          marginTop: '16px',
        },
      },
      text
    );
  }

  function keyLearning(text, accentColor = C.accent2) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          backgroundColor: C.cardBg,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: '18px',
          padding: '26px 30px',
          marginTop: '40px',
        },
      },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '44px', backgroundColor: accentColor, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text)
    );
  }

  function footer() {
    return h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital')
    );
  }

  function slideRoot(...children) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: W,
          height: H,
          padding: '70px',
          backgroundColor: C.bg,
          fontFamily: 'Inter',
        },
      },
      ...children
    );
  }

  function visualBlock(...children) {
    return h(
      'div',
      { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      ...children
    );
  }

  // ============================================================
  // Thema: Fitts's Law — warum Buttongröße und Distanz über Klicks entscheiden
  // Kategorie: Design & UX
  // Quelle: Paul M. Fitts, "The information capacity of the human motor
  //         system in controlling the amplitude of movement", Journal of
  //         Experimental Psychology, 1954. Bis heute HCI-Standardwerk
  //         (u.a. zitiert von der Nielsen Norman Group).
  // ============================================================

  // Slide 1 — Hook: Zwei Buttons, zwei Ergebnisse
  function stateCard(label, desc, accentColor, dark) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          backgroundColor: dark ? C.text : C.cardBg,
          border: dark ? 'none' : `1px solid ${C.cardBorder}`,
          borderRadius: '22px',
          padding: '30px',
          gap: '14px',
        },
      },
      h('div', { style: { display: 'flex', width: '16px', height: '16px', borderRadius: '8px', backgroundColor: accentColor } }),
      h(
        'span',
        { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: dark ? '#0A0E12' : C.text, lineHeight: '1.25' } },
        label
      ),
      h(
        'span',
        { style: { display: 'flex', fontFamily: 'Inter', fontSize: '21px', fontWeight: 500, color: dark ? 'rgba(10,14,18,0.65)' : C.textMuted, lineHeight: '1.4' } },
        desc
      )
    );
  }

  const slide1 = slideRoot(
    badge('UX-GESETZ'),
    headline('Ein Gesetz aus 1954 erklärt, warum manche Buttons einfach nicht performen.', 48),
    subline('Es geht nicht um Farbe oder Text — sondern um zwei simple, messbare Faktoren.'),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        stateCard('Klein & weit weg', 'Kleine Klickfläche, große Distanz — langsamer und fehleranfälliger.', C.accent2, false),
        stateCard('Groß & nah dran', 'Große Klickfläche, kurzer Weg — schneller und zuverlässiger.', C.gold, true)
      )
    ),
    keyLearning('Dieser Unterschied lässt sich vorhersagen — mit einem Modell aus der Bewegungsforschung.', C.gold),
    footer()
  );

  // Slide 2 — Ursprung: 1954, Paul Fitts
  const slide2 = slideRoot(
    badge('DIE GESCHICHTE'),
    headline('1954 vermaß ein Psychologe, wie Menschen Ziele treffen.', 54),
    subline('Paul Fitts untersuchte, wie lange Menschen brauchen, um ein Ziel mit der Hand zu erreichen.'),
    visualBlock(
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: C.cardBg,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: '28px',
            padding: '56px 40px',
            gap: '18px',
          },
        },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '120px', fontWeight: 800, color: C.accent2, letterSpacing: '-2px' } }, '1954'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, textAlign: 'center' } }, 'Paul Fitts veröffentlicht sein Bewegungsmodell'),
        h(
          'div',
          { style: { display: 'flex', backgroundColor: C.accent, borderRadius: '10px', padding: '10px 22px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' } }, 'JOURNAL OF EXPERIMENTAL PSYCHOLOGY')
        )
      )
    ),
    keyLearning('Seither als „Fitts\'s Law" eine Grundlage der Interface- und Ergonomie-Forschung.', C.accent2),
    footer()
  );

  // Slide 3 — Das Gesetz erklärt (zwei Faktoren)
  const slide3 = slideRoot(
    badge('DAS GESETZ'),
    headline('Die Zeit zum Treffen hängt von zwei Dingen ab.', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text } }, 'Zielgröße'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, 'Je größer die Klickfläche, desto schneller und sicherer wird sie getroffen.')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text } }, 'Distanz'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, 'Je weiter der Weg von Cursor oder Finger zum Ziel, desto länger dauert der Klick.')
        )
      )
    ),
    keyLearning('Zusammen bestimmen Größe und Distanz, wie mühelos sich eine Bedienung anfühlt.', C.gold),
    footer()
  );

  // Slide 4 — Erwartung vs. Realität
  function contrastCard(labelText, bodyText, dark) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: dark ? C.text : C.cardBg,
          border: dark ? 'none' : `1px solid ${C.cardBorder}`,
          borderRadius: '22px',
          padding: '30px',
          gap: '14px',
        },
      },
      h(
        'span',
        { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: dark ? 'rgba(10,14,18,0.55)' : C.textMuted } },
        labelText
      ),
      h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: dark ? 'rgba(10,14,18,0.15)' : C.cardBorder, borderRadius: '2px' } }),
      h(
        'span',
        { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: dark ? '#0A0E12' : C.textSoft, lineHeight: '1.4' } },
        bodyText
      )
    );
  }

  const slide4 = slideRoot(
    badge('DER IRRTUM'),
    headline('Eigentlich zählt nur, wie der Button aussieht. Oder?', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        contrastCard('ERWARTUNG', 'Ein auffälliges Design macht den Unterschied beim Klicken.', false),
        contrastCard('REALITÄT', 'Größe und Nähe zum Cursor oder Finger entscheiden über Tempo und Fehlerquote.', true)
      )
    ),
    keyLearning('Das schönste Design hilft wenig, wenn Ziel und Weg zum Klick falsch dimensioniert sind.', C.accent2),
    footer()
  );

  // Slide 5 — Anwendung auf Websites
  function ratioCard(num, text, accentColor) {
    return h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '22px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px 26px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: accentColor, minWidth: '70px' } }, num),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '23px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, text)
    );
  }

  const slide5 = slideRoot(
    badge('AUF DER WEBSITE'),
    headline('So setzt du Fitts\'s Law bewusst ein.', 50),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        ratioCard('01', 'Primäre CTAs großzügig dimensionieren, keine winzigen Klickflächen', C.accent2),
        ratioCard('02', 'Wichtigste Aktion in Daumennähe platzieren, besonders mobil', C.accent),
        ratioCard('03', 'Genug Abstand zwischen Buttons für Fehltoleranz lassen', C.gold)
      )
    ),
    keyLearning('Jeder Pixel Fläche und jeder Millimeter Distanz verändert echtes Klickverhalten.', C.accent2),
    footer()
  );

  // Slide 6 — Das Prinzip
  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Nicht das Auge entscheidet zuerst — die Hand.', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '30px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Fitts\'s Law beschreibt Bedienung als Bewegungsproblem: Bevor eine Entscheidung zählt, muss Hand oder Finger das Ziel erst erreichen können.')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${C.gold}`, paddingLeft: '22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, fontStyle: 'italic', color: C.textSoft, lineHeight: '1.4' } }, 'Paul M. Fitts, 1954 — Journal of Experimental Psychology'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted } }, 'Bis heute Grundlage der HCI- und Ergonomie-Forschung (u.a. zitiert von der Nielsen Norman Group)')
        )
      )
    ),
    keyLearning('Deshalb schlägt ein gut erreichbarer Button oft ein hübsches, aber unbequemes Design.', C.gold),
    footer()
  );

  // Slide 7 — Learnings mit Progress-Bars
  const learnings = [
    { num: '01', text: 'Primäre CTAs deutlich größer als sekundäre Buttons gestalten', pct: 25 },
    { num: '02', text: 'Wichtige Aktionen nah am Daumen bzw. Cursor platzieren', pct: 50 },
    { num: '03', text: 'Genug Abstand zwischen klickbaren Elementen lassen', pct: 75 },
    { num: '04', text: 'Kleine Ziele wie Icons durch größere Klickflächen ergänzen', pct: 100 },
  ];

  function learningCard(l) {
    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.green : C.text, minWidth: '58px' } }, l.num),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '23px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text)
      ),
      h(
        'div',
        { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
        h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } })
      )
    );
  }

  const slide7 = slideRoot(
    badge('DEINE TAKEAWAYS'),
    headline('4 Learnings zu Fitts\'s Law.', 56),
    visualBlock(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, ...learnings.map(learningCard))),
    keyLearning('Kein Redesign nötig — nur bewusste Größen und Abstände bei bestehenden Buttons.', C.accent2),
    footer()
  );

  // Slide 8 — CTA
  const slide8 = slideRoot(
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' } },
        bdLogoImg(C.text, 96),
        h(
          'span',
          {
            style: {
              display: 'flex',
              fontFamily: 'Manrope',
              fontSize: '44px',
              fontWeight: 800,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: '1.3',
              letterSpacing: '-1px',
            },
          },
          'Welcher Button auf deiner Website ist heute zu klein oder zu weit weg?'
        ),
        h(
          'span',
          { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, color: C.accent2, textAlign: 'center', marginTop: '8px' } },
          'Folge @benarodigital für mehr Website-Wissen.'
        )
      )
    ),
    footer()
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  const outDir = path.join(__dirname, 'output', `carousel_${process.env.CAROUSEL_DATE || new Date().toISOString().slice(0, 10)}`, 'slides');
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
