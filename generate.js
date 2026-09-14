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

  // Small upward triangle indicator (CSS-border triangle, no SVG <text>)
  function triangleUp(color) {
    return h('div', {
      style: {
        display: 'flex',
        width: 0,
        height: 0,
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderBottom: `12px solid ${color}`,
      },
    });
  }

  // ============================================================
  // Thema: Microcopy — die kleinen Textzeilen mit großer Wirkung
  // Kategorie: Content & Storytelling
  // ============================================================

  // Slide 1 — Hook
  const slide1 = slideRoot(
    badge('WUSSTEST DU?'),
    headline('4 Wörter unter deinem Button entscheiden mehr als das Design.'),
    subline('Warum die kleinsten Textzeilen deiner Website den größten Unterschied machen.'),
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
            gap: '20px',
          },
        },
        h(
          'div',
          { style: { display: 'flex', backgroundColor: C.accent, borderRadius: '16px', padding: '26px 56px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '34px', fontWeight: 700, color: '#FFFFFF' } }, 'Jetzt starten')
        ),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          triangleUp(C.accent2),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 500, color: C.textSoft } }, 'Kostenlos. Ohne Risiko. Jederzeit kündbar.')
        ),
        h(
          'div',
          { style: { display: 'flex', backgroundColor: C.accent2, borderRadius: '10px', padding: '10px 22px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, color: '#0A0E12', letterSpacing: '1px' } }, 'DAS IST MICROCOPY')
        )
      )
    ),
    keyLearning('Genau diese kleine Zeile entscheidet oft, ob jemand klickt.', C.accent2),
    footer()
  );

  // Slide 2 — Wo Microcopy überall vorkommt
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
          padding: '28px',
          gap: '14px',
        },
      },
      h('div', { style: { display: 'flex', width: '14px', height: '14px', borderRadius: '7px', backgroundColor: accentColor } }),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '28px', fontWeight: 700, color: C.text } }, label),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, desc)
    );
  }

  const slide2 = slideRoot(
    badge('MICROCOPY'),
    headline('Microcopy versteckt sich an 4 Stellen deiner Website.', 56),
    subline('Überall dort, wo Besucher genau im Moment der Entscheidung lesen.'),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h(
          'div',
          { style: { display: 'flex', gap: '16px' } },
          gridCard('Button-Texte', 'Was passiert nach dem Klick?', C.accent),
          gridCard('Fehlermeldungen', 'Was ist schiefgelaufen?', C.red)
        ),
        h(
          'div',
          { style: { display: 'flex', gap: '16px' } },
          gridCard('Formular-Hinweise', 'Welche Angabe wird erwartet?', C.accent2),
          gridCard('Platzhaltertexte', 'Beispiel statt Beschriftung?', C.gold)
        )
      )
    ),
    keyLearning('Vier kleine Textarten, ein großer Effekt auf Vertrauen.', C.accent2),
    footer()
  );

  // Slide 3 — Problem: generische Worthülsen
  function strikePill(text) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          backgroundColor: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '14px',
          padding: '20px 26px',
        },
      },
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'line-through' } }, text)
    );
  }

  const slide3 = slideRoot(
    badge('ACHTUNG', C.red),
    headline('Die meisten Websites nutzen überall dieselben leeren Worthülsen.', 52),
    subline('Generische Texte sagen nichts – und kosten Klicks.'),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        strikePill('Absenden'),
        strikePill('Fehler aufgetreten'),
        strikePill('Ungültige Eingabe'),
        strikePill('Hier klicken')
      )
    ),
    keyLearning('Austauschbare Texte wirken wie Formulare, nicht wie ein Gespräch.', C.red),
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
    headline('Was die meisten glauben – und was wirklich zählt.', 54),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        contrastCard('ERWARTUNG', 'Besucher lesen Fließtext und Erklärungen in Ruhe durch.', false),
        contrastCard('REALITÄT', 'Besucher scannen nur die paar Wörter, die im Entscheidungsmoment sichtbar sind.', true)
      )
    ),
    keyLearning('Genau dort, im Scan-Moment, wirkt Microcopy am stärksten.', C.accent2),
    footer()
  );

  // Slide 5 — Vorher / Nachher
  function beforeAfterRow(label, bad, good) {
    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, label),
      h(
        'div',
        { style: { display: 'flex', gap: '14px' } },
        h(
          'div',
          { style: { display: 'flex', flex: '1', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: '16px', padding: '20px 22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' } }, bad)
        ),
        h(
          'div',
          { style: { display: 'flex', flex: '1', backgroundColor: 'rgba(0,194,184,0.1)', border: `1px solid rgba(0,194,184,0.3)`, borderRadius: '16px', padding: '20px 22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: '#FFFFFF' } }, good)
        )
      )
    );
  }

  const slide5 = slideRoot(
    badge('VORHER / NACHHER'),
    headline('Kleine Änderung, großer Unterschied.', 58),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '28px' } },
        beforeAfterRow('FEHLERMELDUNG', 'Fehler.', 'E-Mail-Adresse fehlt. Bitte ergänzen.'),
        beforeAfterRow('BUTTON-TEXT', 'Absenden', 'Kostenloses Angebot anfordern')
      )
    ),
    keyLearning('Rechts steht dieselbe Information – nur endlich verständlich.', C.accent2),
    footer()
  );

  // Slide 6 — Das Prinzip (Nielsen Heuristik)
  function principleCard(num, text) {
    return h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '22px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px', padding: '26px 28px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '40px', fontWeight: 800, color: C.accent2, minWidth: '60px' } }, num),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, text)
    );
  }

  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Gute Microcopy beantwortet zwei Fragen sofort.', 54),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        principleCard('01', 'Was genau ist passiert?'),
        principleCard('02', 'Wie behebe ich es konkret?'),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${C.gold}`, paddingLeft: '22px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, fontStyle: 'italic', color: C.textSoft, lineHeight: '1.4' } }, '„Help users recognize, diagnose, and recover from errors."'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted } }, 'Jakob Nielsen, 10 Usability Heuristics, 1994')
        )
      )
    ),
    keyLearning('Ursache + Lösung in einem Satz schafft sofort Klarheit.', C.gold),
    footer()
  );

  // Slide 7 — Learnings mit Progress-Bars
  const learnings = [
    { num: '01', text: 'Fehlermeldungen: Ursache und Lösung nennen', pct: 25 },
    { num: '02', text: 'Button-Texte konkret statt generisch formulieren', pct: 50 },
    { num: '03', text: 'Platzhaltertexte sind kein Ersatz für Feld-Labels', pct: 75 },
    { num: '04', text: 'Sprache der Nutzer:innen statt Technik-Jargon', pct: 100 },
  ];

  function learningCard(l) {
    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 26px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.green : C.text, minWidth: '58px' } }, l.num),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text)
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
    headline('4 Learnings für deine Website-Texte.', 56),
    visualBlock(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, ...learnings.map(learningCard))),
    keyLearning('Kein Redesign nötig – nur ehrlichere, konkretere Worte.', C.accent2),
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
          'Welche Microcopy auf deiner Website würde ein Fremder heute nicht verstehen?'
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
