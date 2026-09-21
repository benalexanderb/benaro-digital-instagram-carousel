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
  // Thema: Der Zeigarnik-Effekt — warum unfertige Aufgaben im Kopf bleiben
  // Kategorie: Psychologie
  // Quelle: Bluma Zeigarnik, "Über das Behalten von erledigten und
  //         unerledigten Handlungen", Psychologische Forschung, 1927
  //         (Berliner Schule der Gestaltpsychologie, Forschungsgruppe um Kurt Lewin)
  // ============================================================

  // Slide 1 — Hook: Zwei Aufgaben, zwei Gefühle
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
    badge('WUSSTEST DU?'),
    headline('Eine unerledigte Aufgabe lässt dein Gehirn nicht los.', 54),
    subline('Ein 100 Jahre altes Experiment erklärt, warum das so ist — und was Websites damit zu tun haben.'),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        stateCard('Abgeschlossen', 'Aufgabe erledigt — der Kopf ist frei für Neues.', C.accent2, false),
        stateCard('Unterbrochen', 'Aufgabe offen — sie bleibt im Hinterkopf aktiv.', C.gold, true)
      )
    ),
    keyLearning('Dieser Unterschied ist keine Einbildung, sondern ein belegter psychologischer Effekt.', C.gold),
    footer()
  );

  // Slide 2 — Ursprung: 1927, Bluma Zeigarnik
  const slide2 = slideRoot(
    badge('PSYCHOLOGIE'),
    headline('1927 bekam dieser Effekt einen Namen.', 56),
    subline('Die Psychologin Bluma Zeigarnik untersuchte, wie sich unser Gedächtnis an offene Aufgaben klammert.'),
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
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '120px', fontWeight: 800, color: C.accent2, letterSpacing: '-2px' } }, '1927'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, textAlign: 'center' } }, 'Bluma Zeigarnik veröffentlicht ihre Studie'),
        h(
          'div',
          { style: { display: 'flex', backgroundColor: C.accent, borderRadius: '10px', padding: '10px 22px', marginTop: '8px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' } }, 'BERLINER SCHULE DER GESTALTPSYCHOLOGIE')
        )
      )
    ),
    keyLearning('Seither als „Zeigarnik-Effekt" ein fester Begriff der Kognitionspsychologie.', C.accent2),
    footer()
  );

  // Slide 3 — Die Beobachtung (Kellner-Beispiel)
  const slide3 = slideRoot(
    badge('DIE BEOBACHTUNG'),
    headline('Der Anstoß kam aus einem Berliner Café.', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text } }, 'Kellner merkten sich offene Bestellungen'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, 'Details zu Tischen mit unbezahlten Rechnungen — oft bis ins Kleinste.')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 700, color: C.text } }, 'Nach der Bezahlung: vergessen'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textMuted, lineHeight: '1.4' } }, 'War der Vorgang abgeschlossen, verblasste die Erinnerung daran auffällig schnell.')
        )
      )
    ),
    keyLearning('Diese Alltagsbeobachtung wurde zum Ausgangspunkt von Zeigarniks Experimenten.', C.gold),
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
    headline('Eigentlich merkt man sich Erledigtes besser. Oder?', 52),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        contrastCard('ERWARTUNG', 'Abgeschlossene Aufgaben bleiben am besten im Gedächtnis.', false),
        contrastCard('REALITÄT', 'Offene, unterbrochene Aufgaben bleiben deutlich präsenter im Kopf.', true)
      )
    ),
    keyLearning('Unser Gehirn hält mentale Spannung aufrecht, bis eine Aufgabe wirklich abgeschlossen ist.', C.accent2),
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
    headline('So nutzt du diesen Zug bewusst — statt zufällig.', 48),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '18px' } },
        ratioCard('01', 'Fortschrittsanzeige bei mehrstufigen Formularen: „Schritt 2 von 4"', C.accent2),
        ratioCard('02', 'Sichtbare Profil- oder Onboarding-Vollständigkeit in Prozent', C.accent),
        ratioCard('03', 'Checklisten, die offene Punkte bewusst sichtbar lassen', C.gold)
      )
    ),
    keyLearning('Sichtbare Unvollständigkeit motiviert zum Weitermachen — Unsichtbares tut das nicht.', C.accent2),
    footer()
  );

  // Slide 6 — Das Prinzip
  const slide6 = slideRoot(
    badge('DAS PRINZIP'),
    headline('Nicht das Ziel motiviert am stärksten — die Lücke davor.', 50),
    visualBlock(
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '30px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Solange eine Handlung nicht abgeschlossen ist, hält das Gedächtnis eine Art Spannungszustand aufrecht — das ist der Kern des Zeigarnik-Effekts.')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${C.gold}`, paddingLeft: '22px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, fontStyle: 'italic', color: C.textSoft, lineHeight: '1.4' } }, 'Bluma Zeigarnik, 1927 — Psychologische Forschung'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '20px', fontWeight: 500, color: C.textMuted } }, 'Forschungsgruppe um Kurt Lewin, Berliner Schule der Gestaltpsychologie')
        )
      )
    ),
    keyLearning('Deshalb wirkt ein sichtbarer „Rest" oft stärker als ein abstraktes Ziel.', C.gold),
    footer()
  );

  // Slide 7 — Learnings mit Progress-Bars
  const learnings = [
    { num: '01', text: 'Mehrstufige Formulare mit „Schritt X von Y" versehen', pct: 25 },
    { num: '02', text: 'Fortschritt bei Profilen/Onboarding sichtbar machen', pct: 50 },
    { num: '03', text: 'Offene Checklisten-Punkte bewusst stehen lassen', pct: 75 },
    { num: '04', text: 'Nie mit Erledigtem werben — mit dem letzten Schritt', pct: 100 },
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
    headline('4 Learnings zum Zeigarnik-Effekt.', 56),
    visualBlock(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, ...learnings.map(learningCard))),
    keyLearning('Kein neues Feature nötig — nur sichtbarer Fortschritt statt versteckter Prozesse.', C.accent2),
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
          'Wo auf deiner Website bleibt Fortschritt heute unsichtbar?'
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
