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

  function badge(text, color = C.text, bg = C.cardBg) {
    return h('div', { style: { display: 'flex', marginBottom: '18px' } },
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '3px', color, backgroundColor: bg, padding: '10px 22px', borderRadius: '12px' } }, text));
  }

  function headline(text, size = 60) {
    return h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: `${size}px`, fontWeight: 800, color: C.text, lineHeight: '1.12', letterSpacing: '-1px', marginBottom: '4px' } }, text);
  }

  function subline(text) {
    return h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, lineHeight: '1.5', marginTop: '10px' } }, text);
  }

  function keyLearning(text, danger = false) {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '24px 28px', marginTop: 'auto' } },
      h('div', { style: { display: 'flex', width: '6px', minHeight: '40px', backgroundColor: danger ? C.red : C.accent2, borderRadius: '3px' } }),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '27px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, text));
  }

  function footer() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' } },
      bdLogoImg('rgba(255,255,255,0.55)', 34),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 500, color: C.textMuted } }, '@benarodigital'));
  }

  function slideRoot(...children) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', width: W, height: H, padding: '70px', backgroundColor: C.bg, fontFamily: 'Inter' } }, ...children);
  }

  // Form-field bar mockup row, used on slide 1
  function fieldBar(width, warn = false) {
    return h('div', {
      style: {
        display: 'flex', width: `${width}px`, height: '38px',
        backgroundColor: warn ? 'rgba(239,68,68,0.14)' : C.cardBg,
        border: `1.5px solid ${warn ? C.red : C.cardBorder}`,
        borderRadius: '10px',
      },
    });
  }

  // === SLIDES ===

  // Slide 1 — Hook
  const slide1 = slideRoot(
    badge('ACHTUNG', C.text, C.cardBg),
    headline('Jedes Formularfeld ist ein Grund zum Abbrechen'),
    subline('Und die meisten Formulare haben mehr Felder als nötig.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${C.cardBorder}`, borderRadius: '24px', padding: '32px', gap: '16px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted, marginBottom: '4px' } }, 'KONTAKTFORMULAR'),
        fieldBar(700),
        fieldBar(700),
        fieldBar(500),
        fieldBar(700, true),
        fieldBar(600, true),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' } },
          h('div', { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: C.red } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, color: C.red } }, 'Oft überflüssig'),
        ),
      ),
    ),
    keyLearning('Jedes zusätzliche Feld erhöht Aufwand und Abbruchrisiko.'),
    footer(),
  );

  // Slide 2 — Context: typische überflüssige Felder
  const slide2 = slideRoot(
    badge('FORMULARE', C.text, C.cardBg),
    headline('Viele Formulare fragen mehr ab, als sie brauchen'),
    subline('Drei klassische Beispiele für überflüssige Felder.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid ${C.red}`, borderRadius: '20px', padding: '26px', gap: '8px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'VORNAME + NACHNAME GETRENNT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Ein einziges Namensfeld reicht in den meisten Fällen völlig aus.'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid ${C.red}`, borderRadius: '20px', padding: '26px', gap: '8px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'TELEFONNUMMER ALS PFLICHT'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Für eine erste Anfrage reicht meist eine E-Mail-Adresse.'),
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.08)', border: `1px solid ${C.red}`, borderRadius: '20px', padding: '26px', gap: '8px' } },
        h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.red } }, 'VOLLSTÄNDIGE ADRESSE'),
        h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '25px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Wird oft erst später im Prozess wirklich gebraucht.'),
      ),
    ),
    keyLearning('Quelle: Luke Wroblewski, "Web Form Design: Filling in the Blanks" (2008).'),
    footer(),
  );

  // Slide 3 — Erwartung vs Realität
  const slide3 = slideRoot(
    badge('ERWARTUNG VS. REALITÄT', C.text, C.cardBg),
    headline('"Mehr Felder heißt mehr Informationen für uns"'),
    subline('Die Realität sieht anders aus.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.textMuted } }, 'ERWARTUNG'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: C.cardBorder, borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.textSoft, lineHeight: '1.4' } }, 'Mehr Datenfelder liefern mehr wertvolle Informationen über den Kunden.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.12)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '14px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', color: C.accent } }, 'REALITÄT'),
          h('div', { style: { display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(41,82,255,0.35)', borderRadius: '2px' } }),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, 'Mehr Felder erhöhen den wahrgenommenen Aufwand und damit die Abbrüche.'),
        ),
      ),
    ),
    keyLearning('Jedes Feld ist eine kleine Entscheidung – und jede Entscheidung kostet Zeit.'),
    footer(),
  );

  // Slide 4 — Die Lösung
  const slide4 = slideRoot(
    badge('DIE LÖSUNG', C.text, C.cardBg),
    headline('Kürzere Formulare fühlen sich leichter an'),
    subline('Zwei Prinzipien machen den Unterschied.'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '14px' } },
      h('div', { style: { display: 'flex', gap: '14px' } },
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(0,194,184,0.10)', border: `1px solid ${C.accent2}`, borderRadius: '20px', padding: '28px', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(0,194,184,0.18)', alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: C.accent2 } }, '1'),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 700, color: C.text } }, 'Nur das Nötigste'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Nur Angaben abfragen, die sofort gebraucht werden. Alles andere später klären.'),
        ),
        h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', backgroundColor: 'rgba(41,82,255,0.10)', border: `1px solid ${C.accent}`, borderRadius: '20px', padding: '28px', gap: '12px' } },
          h('div', { style: { display: 'flex', width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(41,82,255,0.18)', alignItems: 'center', justifyContent: 'center' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '24px', fontWeight: 800, color: C.accent } }, '2'),
          ),
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '26px', fontWeight: 700, color: C.text } }, 'Progressive Disclosure'),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '22px', fontWeight: 500, color: C.textSoft, lineHeight: '1.4' } }, 'Komplexe Formulare in mehrere kleine Schritte aufteilen statt alles auf einmal zu zeigen.'),
        ),
      ),
    ),
    keyLearning('Weniger sichtbare Komplexität wirkt leichter ausfüllbar.'),
    footer(),
  );

  // Slide 5 — Konkrete Schritte
  const steps = [
    { num: '01', text: 'Jedes Feld hinterfragen: Wird diese Angabe wirklich sofort gebraucht?' },
    { num: '02', text: 'Lange Formulare in logische Schritte aufteilen statt alles auf einmal zu zeigen.' },
    { num: '03', text: 'Passende Eingabetypen und Auto-Fill nutzen, damit möglichst wenig getippt werden muss.' },
  ];
  const slide5 = slideRoot(
    badge('SO GEHT ES KONKRET', C.text, C.cardBg),
    headline('Drei Schritte zum schlankeren Formular'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '16px', marginTop: '10px' } },
      ...steps.map((s) =>
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', padding: '26px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: C.accent2, minWidth: '64px' } }, s.num),
          h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.4' } }, s.text),
        ),
      ),
    ),
    keyLearning('Jeder eingesparte Klick senkt die Abbruchwahrscheinlichkeit.'),
    footer(),
  );

  // Slide 6 — Learnings
  const learnings = [
    { num: '01', text: 'Nur wirklich notwendige Felder abfragen.', pct: 33 },
    { num: '02', text: 'Komplexe Formulare in Schritte aufteilen.', pct: 66 },
    { num: '03', text: 'Eingabetypen & Auto-Fill konsequent nutzen.', pct: 100 },
  ];
  const slide6 = slideRoot(
    badge('DIE TAKEAWAYS', C.text, C.cardBg),
    headline('Was du dir merken solltest'),
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', gap: '18px', marginTop: '10px' } },
      ...learnings.map((l) =>
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 28px', backgroundColor: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '18px' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '36px', fontWeight: 800, color: l.pct === 100 ? C.green : C.text, minWidth: '60px' } }, l.num),
            h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '26px', fontWeight: 600, color: C.text, lineHeight: '1.3' } }, l.text),
          ),
          h('div', { style: { display: 'flex', height: '6px', backgroundColor: C.cardBorder, borderRadius: '3px' } },
            h('div', { style: { display: 'flex', width: `${l.pct}%`, height: '6px', backgroundColor: l.pct === 100 ? C.green : C.accent2, borderRadius: '3px' } }),
          ),
        ),
      ),
    ),
    footer(),
  );

  // Slide 7 — CTA
  const slide7 = slideRoot(
    h('div', { style: { display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' } },
      bdLogoImg(C.text, 96),
      h('span', { style: { display: 'flex', fontFamily: 'Manrope', fontSize: '50px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: '1.2', letterSpacing: '-1px' } }, 'Wie viele Felder hat dein Kontaktformular wirklich?'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '28px', fontWeight: 500, color: C.textSoft, textAlign: 'center', lineHeight: '1.5' } }, 'Speichern nicht vergessen, bevor du dein Formular prüfst.'),
      h('span', { style: { display: 'flex', fontFamily: 'Inter', fontSize: '30px', fontWeight: 700, color: C.text, textAlign: 'center', lineHeight: '1.4', marginTop: '10px' } }, 'Folge @benarodigital für mehr Website-Wissen'),
    ),
    footer(),
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

  const outDir = path.join(__dirname, 'output', `carousel_${new Date().toISOString().slice(0, 10)}`, 'slides');
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

main().catch((e) => { console.error(e); process.exit(1); });
