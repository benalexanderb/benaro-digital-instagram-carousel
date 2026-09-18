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
  // Thema: Kontrastverhältnisse — die WCAG-Grenzwerte für Lesbarkeit
  // Kategorie: Mobile & Accessibility
  // Quelle: W3C WCAG 2.1, Success Criterion 1.4.3 "Contrast (Minimum)" (Level AA)
  //         und 1.4.6 "Contrast (Enhanced)" (Level AAA)
  // ============================================================

  // Slide 1 — Hook: Lesbarkeits-Demo
  function demoLine(bgLight, textColor, label, labelColor) {
    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
      h(
        'div',
        { style: { display: 'flex', backgroundColor: bgLight, borderRadius: '18px', padding: '30px 34px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '32px', fontWeight: 600, color: textColor } }, 'Jetzt unverbindlich anfragen')
      ),
      h(
        'div',
        { style: { display: 'flex' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '1px', color: labelColor } }, label)
      )
    );
  }

  const slide1 = slideRoot(
    badge('SELBSTTEST'),
    headline('Kannst du diesen Satz lesen? Viele deiner Besucher können es nicht.', 54),
    subline('Ein einziger Kontrast-Fehler macht Website-Texte für viele Menschen unlesbar.'),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
        demoLine('#EAEAEC', 'rgba(20,22,26,0.30)', '1,7 : 1 — NICHT LESBAR', C.red),
        demoLine('#EAEAEC', '#14161A', '8,2 : 1 — GUT LESBAR', C.accent2)
      )
    ),
    keyLearning('Schlechter Kontrast kostet Lesbarkeit — nicht nur bei Sehschwäche.', C.red),
    footer()
  );

  // Slide 2 — Der WCAG-Grenzwert (Stat Hero)
  const slide2 = slideRoot(
    badge('MOBILE & ACCESSIBILITY'),
    headline('Kontrast ist keine Geschmackssache — er ist ein festgelegter Grenzwert.', 52),
    subline('Das W3C definiert exakte Mindestwerte zwischen Text und Hintergrund.'),
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
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '140px', fontWeight: 800, color: C.accent2, letterSpacing: '-2px' } }, '4,5 : 1'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, textAlign: 'center' } }, 'Mindest-Kontrast für normalen Text'),
        h(
          'div',
          { style: { display: 'flex', backgroundColor: C.accent, borderRadius: '10px', padding: '10px 22px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' } }, 'WCAG 2.1 · LEVEL AA')
        )
      )
    ),
    keyLearning('Unterschreitet der Kontrast diesen Wert, gilt die Seite als nicht barrierefrei.', C.accent2),
    footer()
  );

  // Slide 3 — Wen betrifft es? (2x2 Grid)
  function gridCard(label, desc, accentColor) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
          backgroundColor: C.cardBg,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: '20px',
          padding: '26px',
          gap: '12px',
        },
      },
      h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: accentColor } }),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '25px', fontWeight: 700, color: C.text, lineHeight: '1.25' } }, label),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc)
    );
  }

  const slide3 = slideRoot(
    badge('DAS PROBLEM', C.red),
    headline('Zu wenig Kontrast trifft mehr Menschen, als du denkst.', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h(
          'div',
          { style: { display: 'flex', gap: '16px' } },
          gridCard('Sehbehinderung', 'Auch leichte Seh- oder Farbfehlsichtigkeit', C.accent),
          gridCard('Sonnenlicht', 'Aufs Handy-Display unterwegs', C.gold)
        ),
        h(
          'div',
          { style: { display: 'flex', gap: '16px' } },
          gridCard('Alte Displays', 'Schwächere Bildschirme, ungünstige Winkel', C.accent2),
          gridCard('Alter ab 40', 'Altersbedingter Sehverlust ist normal', C.red)
        )
      )
    ),
    keyLearning('Schlechter Kontrast ist kein Nischenproblem — jeder ist irgendwann betroffen.', C.red),
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
    badge('DER WENDEPUNKT'),
    headline('Was gut aussieht, ist nicht automatisch lesbar.', 54),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        contrastCard('ERWARTUNG', 'Hellgraue Schrift auf Weiß wirkt modern und dezent.', false),
        contrastCard('REALITÄT', 'Für viele Besucher praktisch unlesbar — besonders unterwegs.', true)
      )
    ),
    keyLearning('Der Unterschied liegt nicht im Design-Geschmack, sondern im Messwert.', C.accent2),
    footer()
  );

  // Slide 5 — Die 3 Grenzwerte
  function ratioCard(ratio, text, accentColor) {
    return h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '22px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '24px 26px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 800, color: accentColor, minWidth: '150px' } }, ratio),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, text)
    );
  }

  const slide5 = slideRoot(
    badge('DIE GRENZWERTE'),
    headline('Drei Zahlen, die jede Website kennen sollte.', 54),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        ratioCard('4,5 : 1', 'Normaler Text — Mindestwert (AA)', C.accent2),
        ratioCard('3 : 1', 'Große/fette Überschriften — Mindestwert (AA)', C.accent),
        ratioCard('7 : 1', 'Beliebiger Text — verschärftes Niveau (AAA)', C.gold)
      )
    ),
    keyLearning('Schon kleine Kontrast-Unterschiede kippen von „nicht bestanden" zu „bestanden".', C.accent2),
    footer()
  );

  // Slide 6 — Das Prinzip (WCAG-Zitat)
  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Kontrast ist ein Messwert — kein Bauchgefühl.', 54),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '30px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Berechnet wird das Helligkeitsverhältnis zwischen Text- und Hintergrundfarbe — unabhängig vom Farbton oder Design-Trend.')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${C.gold}`, paddingLeft: '22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, fontStyle: 'italic', color: C.textSoft, lineHeight: '1.4' } }, '„Text […] has a contrast ratio of at least 4.5:1 […]"'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted } }, 'W3C WCAG 2.1, Success Criterion 1.4.3 „Contrast (Minimum)"')
        )
      )
    ),
    keyLearning('Deshalb lässt sich Kontrast mit einem Tool prüfen — statt nur mit dem Auge.', C.gold),
    footer()
  );

  // Slide 7 — Learnings mit Progress-Bars
  const learnings = [
    { num: '01', text: 'Normalen Text mindestens 4,5 : 1 kontrastieren (AA)', pct: 25 },
    { num: '02', text: 'Große/fette Überschriften: 3 : 1 reicht aus (AA)', pct: 50 },
    { num: '03', text: 'Für AAA-Niveau 7 : 1 anstreben, wo möglich', pct: 75 },
    { num: '04', text: 'Kontrast mit einem Prüf-Tool testen, nicht nach Auge', pct: 100 },
  ];

  function learningCard(l) {
    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.green : C.text, minWidth: '58px' } }, l.num),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text)
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
    headline('4 Learnings für lesbare Website-Texte.', 56),
    visualBlock(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, ...learnings.map(learningCard))),
    keyLearning('Kein Redesign nötig — nur die richtigen Kontrastwerte.', C.accent2),
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
          'Hast du den Kontrast deiner Website schon mal wirklich geprüft?'
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
